/**
 * The blog's shared types and presentation helpers.
 *
 * Kept out of lib/wix/blog.ts, which is `server-only`: the article card is
 * rendered inside the client-side library filter, so anything it imports has
 * to be safe to pull into a client bundle. Only the fetching lives on the
 * server side of that line.
 */

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  /** ISO timestamp of first publication. */
  publishedDate: string;
  minutesToRead: number | null;
  tagIds: string[];
  /** The dashboard's own "featured" flag. */
  featured: boolean;
  coverUrl: string | null;
  coverAlt: string;
};

export type BlogTag = { id: string; slug: string; label: string };

export type BlogArticle = BlogPost & {
  /** Ricos nodes, rendered by components/resources/rich-content.tsx. */
  richContent: RichNode[];
};

export type RicosMedia = {
  src?: { id?: string; url?: string };
  width?: number;
  height?: number;
};

export type RichNode = {
  type: string;
  id?: string;
  nodes?: RichNode[];
  textData?: {
    text?: string;
    decorations?: {
      type: string;
      linkData?: { link?: { url?: string; target?: string } };
    }[];
  };
  headingData?: { level?: number };
  imageData?: { image?: RicosMedia; altText?: string };
  videoData?: {
    video?: { src?: { id?: string } };
    thumbnail?: { src?: { id?: string }; width?: number; height?: number };
  };
  galleryData?: { items?: { image?: { media?: RicosMedia } }[] };
  buttonData?: { text?: string; link?: { url?: string; target?: string } };
};

/** Reading-time and date line used on cards and bylines. */
export function postMeta(post: BlogPost) {
  const date = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return [date, post.minutesToRead ? `${post.minutesToRead} min read` : null]
    .filter(Boolean)
    .join(" · ");
}
