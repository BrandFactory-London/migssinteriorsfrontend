import Link from "next/link";

import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { LegalDoc } from "@/lib/legal";

/**
 * Layout for the four policy pages. Plain content: a measured single column,
 * the site's display face for headings and body face for prose, inside the
 * standard chrome. No hero, no imagery — these are documents.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <article className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(36px,7vw,84px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: doc.title }]}
            />
          </div>

          {/* Sized in px, not ch: the ch unit here resolves against Cormorant,
              whose narrow figures made a four-word title break to three lines. */}
          <header className="max-w-[min(100%,560px)] border-b border-[var(--migss-divider)] pb-[18.4px]">
            <h1 className="text-[clamp(32px,7vw,58px)] leading-[1.02] font-normal tracking-[-0.03em] text-balance">
              {doc.title}
            </h1>
            <p className="mt-[13.8px] text-[12.5px] tracking-[0.06em] text-migss-text/58">
              Last updated: {doc.lastUpdated}
            </p>
          </header>

          {/* ~68 characters is the readable measure for body copy at this size. */}
          <div className="mt-[clamp(24px,4vw,44px)] max-w-[68ch]">
            {doc.sections.map((section, index) => (
              <section
                key={section.heading ?? `section-${index}`}
                className="mb-[clamp(24px,3.5vw,40px)] last:mb-0"
              >
                {section.heading ? (
                  <h2 className="mb-[13.8px] text-[clamp(21px,3.4vw,27px)] leading-[1.2] font-normal tracking-[-0.01em]">
                    {section.heading}
                  </h2>
                ) : null}

                {section.blocks.map((block, blockIndex) => {
                  if (block.kind === "p") {
                    return (
                      <p
                        key={blockIndex}
                        className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82 last:mb-0"
                      >
                        {block.content}
                      </p>
                    );
                  }

                  const ListTag = block.kind === "ol" ? "ol" : "ul";
                  return (
                    <ListTag
                      key={blockIndex}
                      className="mb-[13.8px] flex list-none flex-col gap-2.5 last:mb-0"
                    >
                      {block.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex gap-3 text-[15.5px] leading-[1.8] text-migss-text/82"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.7em] w-[1.6ch] flex-none text-[11px] leading-none text-migss-accent-ink tabular-nums"
                          >
                            {block.kind === "ol"
                              ? `${String(itemIndex + 1).padStart(2, "0")}`
                              : "·"}
                          </span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ListTag>
                  );
                })}
              </section>
            ))}
          </div>

          <footer className="mt-[clamp(28px,5vw,56px)] border-t border-[var(--migss-divider)] pt-[18.4px]">
            <Link
              href="/contact"
              className="text-sm font-medium text-migss-accent-ink no-underline"
            >
              Questions about this page? Get in touch →
            </Link>
          </footer>
        </article>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
