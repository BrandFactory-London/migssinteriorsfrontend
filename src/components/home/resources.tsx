import { Reveal } from "@/components/reveal";

const ARTICLES = [
  {
    kicker: "Finance",
    title: "How the 0% interest 5-year plan works",
    body: "What you can spread, what it costs, and the paperwork involved.",
    meta: "4 min read",
  },
  {
    kicker: "Guarantee",
    title: "What our 10-year labour guarantee covers",
    body: "In plain English, including what sits under product warranty instead.",
    meta: "3 min read",
  },
  {
    kicker: "Planning",
    title: "A realistic bathroom renovation budget for 2026",
    body: "Where the money actually goes on an Essex bathroom project.",
    meta: "6 min read",
  },
];

export function Resources() {
  return (
    <section
      id="resources"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,7.5vw,84px)]"
    >
      <Reveal>
        <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
          Resources &amp; insights
        </p>
        <h2 className="mb-7 text-[clamp(28px,6.8vw,42px)] leading-[1.05] font-normal tracking-[-0.02em]">
          Before you commit, read these
        </h2>
      </Reveal>

      <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-[13.8px]">
        {ARTICLES.map((article, index) => (
          <Reveal as="li" key={article.title} delay={index * 80}>
            <a
              href="/resources"
              className="group flex min-h-[152px] flex-col gap-[9.2px] rounded-[4px] border border-[var(--migss-divider)] p-[13.8px] text-inherit no-underline transition-[border-color,box-shadow,transform] duration-300 active:scale-[0.99] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
            >
              <span className="text-[10px] tracking-[0.1em] uppercase text-migss-accent-ink">
                {article.kicker}
              </span>
              <span className="font-heading text-[17px] leading-[1.2] font-semibold">
                {article.title}
              </span>
              <p className="flex-1 text-[13px] opacity-80">{article.body}</p>
              <span className="flex items-center gap-1.5 text-[11px] text-migss-text/50">
                {article.meta}
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
