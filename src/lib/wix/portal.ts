import "server-only";

/**
 * Wix access for the client portal.
 *
 * Everything else on this site reads Wix as an anonymous visitor (see
 * client.ts). The portal cannot: its two collections are admin-only, so that
 * nobody can list every client's reference and postcode by asking Wix
 * directly. It reads them with a site API key instead, over plain REST, which
 * keeps the key and every query on the server and adds no SDK modules to the
 * bundle.
 *
 * Collections (created alongside this code, both admin-only):
 *   ClientProjects   title (client name), referenceId (MIG-XXXX-XX),
 *                    postcode, active
 *   ClientDocuments  title, file (Document), project (-> ClientProjects),
 *                    sortOrder
 */

const API = "https://www.wixapis.com";
const SITE_ID = "cba1d6e0-2aaa-4097-b52d-71939abe2255";

export const PROJECTS = "ClientProjects";
export const DOCUMENTS = "ClientDocuments";

export type PortalProject = {
  id: string;
  name: string;
  referenceId: string;
  postcode: string;
  active: boolean;
};

export type PortalDocument = {
  id: string;
  title: string;
  /** The raw CMS value: a wix:document:// URL or a web URL. */
  file: string;
  fileName: string;
  projectId: string;
};

function headers(): HeadersInit {
  const key = process.env.WIX_API_KEY;
  if (!key) throw new Error("WIX_API_KEY is not set.");
  return {
    Authorization: key,
    "wix-site-id": SITE_ID,
    "Content-Type": "application/json",
  };
}

async function wix<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: headers(),
    // Never cached: these are per-client, permission-gated reads.
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Wix ${path} ${response.status}: ${detail.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

type DataItem = { id: string; data: Record<string, unknown> };

async function query(
  collection: string,
  filter: Record<string, unknown>,
  limit = 50,
): Promise<DataItem[]> {
  const result = await wix<{ dataItems?: DataItem[] }>(
    "/wix-data/v2/items/query",
    {
      method: "POST",
      body: JSON.stringify({
        dataCollectionId: collection,
        query: { filter, paging: { limit } },
      }),
    },
  );
  return result.dataItems ?? [];
}

const text = (value: unknown) => (typeof value === "string" ? value : "");

function toProject(item: DataItem): PortalProject {
  return {
    id: item.id,
    name: text(item.data.title),
    referenceId: text(item.data.referenceId),
    postcode: text(item.data.postcode),
    // Missing counts as on, so a row works as soon as it is created; the
    // office switches a client off by unticking it.
    active: item.data.active !== false,
  };
}

/** Projects stored under this reference, whatever case they were typed in. */
export async function findProjectsByReference(
  reference: string,
): Promise<PortalProject[]> {
  const variants = Array.from(
    new Set([reference, reference.toLowerCase(), reference.replace(/-/g, "")]),
  );
  const items = await query(
    PROJECTS,
    { referenceId: { $in: variants } },
    5,
  );
  return items.map(toProject);
}

export async function getProject(id: string): Promise<PortalProject | null> {
  const items = await query(PROJECTS, { _id: id }, 1);
  return items[0] ? toProject(items[0]) : null;
}

function fileNameOf(file: string, title: string): string {
  const fromUrl = decodeURIComponent(file.split(/[/#?]/).filter(Boolean).pop() ?? "");
  const base = fromUrl && /\.[a-z0-9]{2,5}$/i.test(fromUrl) ? fromUrl : `${title || "document"}.pdf`;
  return base.replace(/[\\/:*?"<>|]+/g, "-");
}

function toDocument(item: DataItem): PortalDocument {
  const file = text(item.data.file);
  const title = text(item.data.title);
  const project = item.data.project;
  return {
    id: item.id,
    title,
    file,
    fileName: fileNameOf(file, title),
    projectId:
      typeof project === "string"
        ? project
        : text((project as { _id?: unknown } | null)?._id),
  };
}

export async function listDocuments(projectId: string): Promise<PortalDocument[]> {
  const items = await query(DOCUMENTS, { project: projectId }, 100);
  return items
    .map((item) => ({ doc: toDocument(item), order: Number(item.data.sortOrder ?? 0) }))
    .filter(({ doc }) => doc.file)
    .sort((a, b) => a.order - b.order || a.doc.title.localeCompare(b.doc.title))
    .map(({ doc }) => doc);
}

export async function getDocument(id: string): Promise<PortalDocument | null> {
  const items = await query(DOCUMENTS, { _id: id }, 1);
  return items[0] ? toDocument(items[0]) : null;
}

/**
 * A short-lived URL the server can fetch the file from.
 *
 * A Document field holds either a web URL (used as it is) or a Media Manager
 * reference, `wix:document://v1/ugd/<fileId>/<name>`, which Wix turns into a
 * signed, expiring download URL.
 */
export async function fileSourceUrl(file: string): Promise<string> {
  if (/^https?:\/\//i.test(file)) return file;

  const match = file.match(/^wix:document:\/\/v1\/(?:ugd\/)?([^/#?]+)/i);
  if (!match) throw new Error("Unrecognised document reference.");
  const fileId = match[1];

  // The Media Manager names files without the `ugd/` folder; try the bare ID
  // first and the prefixed form if Wix does not recognise it.
  let lastError: unknown;
  for (const candidate of [fileId, `ugd/${fileId}`]) {
    try {
      const result = await wix<{ downloadUrls?: { url?: string }[] }>(
        "/site-media/v1/files/generate-file-download-url",
        {
          method: "POST",
          body: JSON.stringify({ fileId: candidate, expirationInMinutes: 10 }),
        },
      );
      const url = result.downloadUrls?.[0]?.url;
      if (url) return url;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("No download URL returned.");
}
