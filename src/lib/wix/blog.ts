import "server-only";

import { cache } from "react";
import { media } from "@wix/sdk";

import type {
  BlogArticle,
  BlogPost,
  BlogTag,
  RicosMedia,
  RichNode,
} from "@/lib/blog-post";
import { getWixClient } from "@/lib/wix/client";

/**
 * The live Wix Blog, which is what /blog and /resources read.
 *
 * The automation pipeline publishes into this blog continuously, so the pages
 * that read it set ISR and /blog/[slug] accepts slugs that did not exist at
 * build time.
 *
 * Room filtering is by tag, not category: a post is a bathroom post because
 * it carries the "Bathroom Renovation" tag. The two tag IDs are looked up by
 * slug at request time rather than hardcoded, so recreating a tag in the
 * dashboard (which mints a new ID) does not silently empty a pillar.
 */

const BLOG = "https://www.wixapis.com/blog/v3";

export const PILLAR_TAG_SLUG = {
  Bathroom: "bathroom-renovation",
  Kitchen: "kitchen-renovation",
} as const;

export type Pillar = keyof typeof PILLAR_TAG_SLUG;

export type { BlogPost, BlogTag, BlogArticle, RichNode } from "@/lib/blog-post";

async function blogFetch<T>(path: string): Promise<T> {
  const client = getWixClient();
  const { headers } = await client.auth.getAuthHeaders();

  const response = await fetch(`${BLOG}${path}`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(
      `Wix Blog ${path} returned ${response.status}: ${(await response.text()).slice(0, 300)}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * A Ricos media reference carries a bare media ID rather than a URL, unlike a
 * post's cover image. The SDK's helpers only take the wix:image:// form, so
 * the ID and the node's own dimensions are assembled back into one.
 */
export function ricosImageUrl(
  image: RicosMedia | undefined,
  width: number,
  height: number,
) {
  const id = image?.src?.id ?? image?.src?.url;
  if (!id) return null;

  const uri = `wix:image://v1/${id}/image.jpg#originWidth=${image?.width ?? width}&originHeight=${image?.height ?? height}`;

  try {
    return media.getScaledToFillImageUrl(uri, width, height, {});
  } catch {
    return null;
  }
}

/** Ricos video nodes hold a storage path; the CDN host is implicit. */
export function ricosVideoUrl(id: string | undefined) {
  if (!id) return null;
  return `https://video.wixstatic.com/${id}`;
}

function toPost(raw: Record<string, unknown>): BlogPost | null {
  const slug = typeof raw.slug === "string" ? raw.slug : null;
  const title = typeof raw.title === "string" ? raw.title.trim() : null;
  if (!slug || !title) return null;

  const image = ((
    raw.media as { wixMedia?: { image?: Record<string, unknown> } }
  )?.wixMedia?.image ?? {}) as Record<string, unknown>;

  return {
    id: String(raw.id ?? slug),
    slug,
    title,
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt.trim() : null,
    publishedDate: String(raw.firstPublishedDate ?? ""),
    minutesToRead:
      typeof raw.minutesToRead === "number" ? raw.minutesToRead : null,
    tagIds: Array.isArray(raw.tagIds) ? (raw.tagIds as string[]) : [],
    featured: raw.featured === true,
    // Cover images come back as plain https URLs already.
    coverUrl: typeof image.url === "string" ? image.url : null,
    coverAlt: typeof image.altText === "string" ? image.altText : title,
  };
}

/** Every published post, newest first. */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const posts: BlogPost[] = [];
  let offset = 0;

  // The blog is growing, so this pages rather than assuming one request.
  for (let page = 0; page < 10; page += 1) {
    const data = await blogFetch<{ posts?: Record<string, unknown>[] }>(
      `/posts?paging.limit=100&paging.offset=${offset}`,
    );
    const batch = data.posts ?? [];
    for (const raw of batch) {
      const post = toPost(raw);
      if (post) posts.push(post);
    }
    if (batch.length < 100) break;
    offset += batch.length;
  }

  return posts.sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
});

export const getArticle = cache(
  async (slug: string): Promise<BlogArticle | null> => {
    let data: { post?: Record<string, unknown> };
    try {
      data = await blogFetch<{ post?: Record<string, unknown> }>(
        `/posts/slugs/${encodeURIComponent(slug)}?fieldsets=RICH_CONTENT`,
      );
    } catch {
      // A slug that is not a post is a 404, not a broken page. Any other
      // failure surfaces on the listing pages, which do not swallow errors.
      return null;
    }

    const raw = data.post;
    if (!raw) return null;

    const post = toPost(raw);
    if (!post) return null;

    const richContent =
      (raw.richContent as { nodes?: RichNode[] })?.nodes ?? [];

    return { ...post, richContent };
  },
);

/** Every tag, so IDs are resolved by slug rather than hardcoded. */
export const getTags = cache(async (): Promise<BlogTag[]> => {
  const data = await blogFetch<{
    tags?: { id?: string; slug?: string; label?: string }[];
  }>("/tags?paging.limit=100");

  return (data.tags ?? []).flatMap((tag) =>
    tag.id && tag.slug
      ? [{ id: tag.id, slug: tag.slug, label: tag.label ?? tag.slug }]
      : [],
  );
});

/** Tag labels by ID, for the chips and card badges. */
export async function getTagLabels(): Promise<Record<string, string>> {
  return Object.fromEntries(
    (await getTags()).map((tag) => [tag.id, tag.label]),
  );
}

/**
 * The posts for a room pillar.
 *
 * An unknown tag slug yields no posts rather than falling back to everything:
 * a bathroom pillar quietly listing kitchen articles would be worse than an
 * empty one, and the empty state already says the library is being written.
 */
export async function getPillarPosts(pillar: Pillar) {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);
  const tagId = tags.find((tag) => tag.slug === PILLAR_TAG_SLUG[pillar])?.id;
  if (!tagId) return [];

  return posts.filter((post) => post.tagIds.includes(tagId));
}

/**
 * Two or three other posts sharing a tag, newest first, falling back to the
 * most recent posts when this one shares no tag with anything.
 */
export async function getRelatedPosts(post: BlogPost, count = 3) {
  const others = (await getPosts()).filter((other) => other.id !== post.id);

  const sharing = others.filter((other) =>
    other.tagIds.some((tagId) => post.tagIds.includes(tagId)),
  );

  return (sharing.length > 0 ? sharing : others).slice(0, count);
}

/** What the hub leads with: the flagged post, else the newest. */
export async function getLeadPost() {
  const posts = await getPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}
