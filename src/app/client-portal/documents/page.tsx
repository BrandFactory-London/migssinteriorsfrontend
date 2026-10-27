import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOutOfPortal } from "@/app/actions/portal";
import { currentProjectId } from "@/lib/portal/session";
import { SITE, telHref } from "@/lib/site";
import { getProject, listDocuments } from "@/lib/wix/portal";

import { PortalFrame } from "../portal-frame";
import s from "../portal.module.css";

export const metadata: Metadata = {
  title: "Your documents",
  robots: { index: false, follow: false },
};

/**
 * The signed-in client's documents: one row each, with View (the browser's
 * own PDF viewer, in a new tab) and Download. Both go through
 * /client-portal/file/<id>, which checks the session again, so a link copied
 * out of this page is useless to anyone else.
 */
export default async function ClientDocuments() {
  let projectId: string | null = null;
  try {
    projectId = await currentProjectId();
  } catch {
    projectId = null;
  }
  if (!projectId) redirect("/client-portal");

  const [project, documents] = await Promise.all([
    getProject(projectId),
    listDocuments(projectId),
  ]);

  // The office switched the client off, or deleted the row, mid-session.
  if (!project || !project.active) redirect("/client-portal");

  const signOut = (
    <form action={signOutOfPortal}>
      <button type="submit" className={s.barLink} style={barButton}>
        Log out
      </button>
    </form>
  );

  return (
    <PortalFrame barLabel="Client Portal" barAction={signOut}>
      <p className={s.subtitle}>
        {project.name ? `${project.name} · ` : ""}
        {project.referenceId}
      </p>

      <h1 className={s.label} style={{ marginTop: 0 }}>
        Your documents
      </h1>

      {documents.length ? (
        <ul className={s.docs}>
          {documents.map((doc) => {
            const href = `/client-portal/file/${encodeURIComponent(doc.id)}`;
            return (
              <li key={doc.id} className={s.doc}>
                <span className={s.docName}>
                  {doc.title || doc.fileName}
                  <span className={s.docMeta}>PDF</span>
                </span>
                <span className={s.docActions}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className={s.docButton}
                    aria-label={`View ${doc.title || doc.fileName}`}
                  >
                    View
                  </a>
                  <a
                    href={`${href}?download=1`}
                    download={doc.fileName}
                    className={s.docButton}
                    aria-label={`Download ${doc.title || doc.fileName}`}
                  >
                    Download
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={s.empty}>
          Your documents are not ready yet. We will add your warranty and
          handover book when your project is signed off.
        </p>
      )}

      <form action={signOutOfPortal}>
        <button type="submit" className={s.signOut}>
          Log out
        </button>
      </form>

      <p className={s.footer}>
        Something missing? Ring the office.
        <br />
        <a href={telHref}>{SITE.phone}</a>
      </p>
    </PortalFrame>
  );
}

/* The bar's log-out is a form button dressed as the bar's own link. */
const barButton: React.CSSProperties = {
  padding: 0,
  border: 0,
  background: "none",
  cursor: "pointer",
  // Family only: a `font` shorthand here would undo the class's size.
  fontFamily: "inherit",
};
