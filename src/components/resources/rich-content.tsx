import * as React from "react";

import { ImageSlot } from "@/components/image-slot";
import type { RichNode } from "@/lib/blog-post";
import { ricosImageUrl, ricosVideoUrl } from "@/lib/wix/blog";

/**
 * Renders a post's Ricos rich content.
 *
 * Deliberately a small server-rendered renderer rather than @wix/ricos: the
 * reading column's type scale is the artboard's spec, and Wix's own renderer
 * brings its own typography and a large client bundle to fight it for. Every
 * node type present across the blog is handled — paragraph, heading, both
 * list kinds, image, gallery, video, blockquote, caption, table and button.
 *
 * COLOR decorations are ignored on purpose. The editor stamps rgb(0,0,0) on
 * almost every run, and honouring it would override the site's ink (#201f1d)
 * with pure black on nearly every paragraph.
 */
export function RichContent({ nodes }: { nodes: RichNode[] }) {
  return (
    <>
      {nodes.map((node, index) => (
        <Node key={node.id ?? index} node={node} />
      ))}
    </>
  );
}

function Node({ node }: { node: RichNode }) {
  switch (node.type) {
    case "PARAGRAPH": {
      // The editor uses empty paragraphs as spacers; the rhythm is ours.
      if (!hasText(node)) return null;
      return (
        <p className="mb-[1.15em] text-[clamp(17px,4.6vw,19px)] leading-[1.78] tracking-[-0.003em] text-pretty text-migss-text/88">
          <Inline nodes={node.nodes ?? []} />
        </p>
      );
    }

    case "HEADING": {
      if (!hasText(node)) return null;
      const level = node.headingData?.level ?? 2;
      const Tag = (level <= 2 ? "h2" : level === 3 ? "h3" : "h4") as
        | "h2"
        | "h3"
        | "h4";
      const className =
        Tag === "h2"
          ? "font-heading mt-[2.1em] mb-[0.55em] text-[clamp(27px,6.6vw,34px)] leading-[1.12] font-normal tracking-[-0.02em] first:mt-0"
          : Tag === "h3"
            ? "font-heading mt-[1.7em] mb-[0.4em] text-[clamp(21px,5vw,25px)] leading-[1.2] font-normal"
            : "font-heading mt-[1.5em] mb-[0.35em] text-[clamp(18px,4.4vw,21px)] leading-[1.25] font-normal";
      return (
        <Tag className={className}>
          <Inline nodes={node.nodes ?? []} />
        </Tag>
      );
    }

    case "BULLETED_LIST":
    case "ORDERED_LIST": {
      const List = node.type === "ORDERED_LIST" ? "ol" : "ul";
      return (
        <List
          className={`mb-[1.3em] pl-[1.15em] marker:text-migss-accent-ink ${
            List === "ol" ? "list-decimal" : "list-disc"
          }`}
        >
          {(node.nodes ?? []).map((item, index) => (
            <li
              key={item.id ?? index}
              className="mb-[0.55em] text-[clamp(16.5px,4.4vw,18px)] leading-[1.72] text-migss-text/85"
            >
              {/* A list item wraps paragraphs; unwrap them so the bullet and
                  its text sit on one line. */}
              {(item.nodes ?? []).map((child, childIndex) => (
                <React.Fragment key={child.id ?? childIndex}>
                  <Inline nodes={child.nodes ?? []} />
                </React.Fragment>
              ))}
            </li>
          ))}
        </List>
      );
    }

    case "BLOCKQUOTE":
      return (
        <blockquote className="my-[1.6em] border-l-2 border-migss-accent pl-[18.4px]">
          {(node.nodes ?? []).map((child, index) => (
            <p
              key={child.id ?? index}
              className="font-heading text-[clamp(20px,5vw,26px)] leading-[1.35] text-migss-text/90 italic"
            >
              <Inline nodes={child.nodes ?? []} />
            </p>
          ))}
        </blockquote>
      );

    case "IMAGE": {
      const url = ricosImageUrl(node.imageData?.image, 1440, 960);
      if (!url) return null;
      return (
        <figure className="my-[1.9em]">
          <div className="aspect-[3/2]">
            <ImageSlot
              placeholder={node.imageData?.altText ?? "Photograph"}
              src={url}
              alt={node.imageData?.altText ?? ""}
              shape="rounded"
              className="migss-plate"
            />
          </div>
          <Caption nodes={node.nodes ?? []} />
        </figure>
      );
    }

    case "GALLERY": {
      const items = (node.galleryData?.items ?? [])
        .map((item) => ricosImageUrl(item.image?.media, 900, 700))
        .filter((url): url is string => url !== null);
      if (items.length === 0) return null;
      return (
        <div className="my-[1.9em] grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[10px]">
          {items.map((url) => (
            <div key={url} className="aspect-[4/3]">
              <ImageSlot
                placeholder="Photograph"
                src={url}
                alt=""
                shape="rounded"
                className="migss-plate"
              />
            </div>
          ))}
        </div>
      );
    }

    case "VIDEO": {
      const url = ricosVideoUrl(node.videoData?.video?.src?.id);
      if (!url) return null;
      const poster = ricosImageUrl(node.videoData?.thumbnail, 1440, 810);
      return (
        <figure className="my-[1.9em]">
          <video
            controls
            preload="metadata"
            poster={poster ?? undefined}
            className="migss-plate aspect-video w-full rounded-[4px] bg-migss-neutral-900"
          >
            <source src={url} />
          </video>
          <Caption nodes={node.nodes ?? []} />
        </figure>
      );
    }

    case "TABLE": {
      const rows = node.nodes ?? [];
      if (rows.length === 0) return null;
      const [header, ...body] = rows;
      return (
        // Narrow screens cannot fit a three-column table; scrolling it beats
        // squeezing the columns to unreadable.
        <div className="migss-scroll my-[1.7em] overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[440px] border-collapse text-[15px]">
            <thead>
              <tr>
                {(header.nodes ?? []).map((cell, index) => (
                  <th
                    key={cell.id ?? index}
                    className="border-b border-[var(--migss-divider)] px-3 py-2.5 text-left font-medium"
                  >
                    <CellText cell={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex}>
                  {(row.nodes ?? []).map((cell, index) => (
                    <td
                      key={cell.id ?? index}
                      className="border-b border-[var(--migss-divider)] px-3 py-2.5 align-top text-migss-text/85"
                    >
                      <CellText cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "BUTTON": {
      const url = node.buttonData?.link?.url;
      const label = node.buttonData?.text;
      if (!url || !label) return null;
      return (
        <p className="my-[1.7em]">
          <a
            href={url}
            className="font-body inline-flex min-h-[54px] items-center rounded-[4px] bg-migss-accent-700 px-6 text-[15px] font-medium text-migss-text no-underline transition-opacity [@media(hover:hover)]:hover:opacity-90"
          >
            {label}
          </a>
        </p>
      );
    }

    // CAPTION is rendered by its parent figure; anything genuinely unknown is
    // skipped rather than dumped as raw JSON.
    default:
      return null;
  }
}

function Caption({ nodes }: { nodes: RichNode[] }) {
  const caption = nodes.find((node) => node.type === "CAPTION");
  if (!caption || !hasText(caption)) return null;
  return (
    <figcaption className="mt-2.5 text-[13px] leading-[1.6] text-migss-text/60">
      <Inline nodes={caption.nodes ?? []} />
    </figcaption>
  );
}

function CellText({ cell }: { cell: RichNode }) {
  return (
    <>
      {(cell.nodes ?? []).map((paragraph, index) => (
        <React.Fragment key={paragraph.id ?? index}>
          <Inline nodes={paragraph.nodes ?? []} />
        </React.Fragment>
      ))}
    </>
  );
}

/** Text runs and their decorations: bold, italic, underline and links. */
function Inline({ nodes }: { nodes: RichNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type !== "TEXT") return <Node key={index} node={node} />;

        const text = node.textData?.text ?? "";
        if (!text) return null;

        const decorations = node.textData?.decorations ?? [];
        const link = decorations.find((d) => d.type === "LINK")?.linkData?.link;

        let content: React.ReactNode = text;
        if (decorations.some((d) => d.type === "BOLD")) {
          content = <strong className="font-medium">{content}</strong>;
        }
        if (decorations.some((d) => d.type === "ITALIC")) {
          content = <em>{content}</em>;
        }
        if (decorations.some((d) => d.type === "UNDERLINE") && !link) {
          content = <u>{content}</u>;
        }

        if (link?.url) {
          const external = /^https?:\/\//.test(link.url);
          return (
            <a
              key={index}
              href={link.url}
              target={link.target === "BLANK" ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="text-migss-accent-ink underline underline-offset-2"
            >
              {content}
            </a>
          );
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </>
  );
}

function hasText(node: RichNode): boolean {
  return (node.nodes ?? []).some(
    (child) =>
      (child.type === "TEXT" && (child.textData?.text ?? "").trim() !== "") ||
      hasText(child),
  );
}
