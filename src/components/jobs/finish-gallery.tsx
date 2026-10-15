import { Reveal } from "@/components/reveal";
import { ImageSlot } from "@/components/image-slot";
import type { GalleryShot, Project } from "@/lib/wix/projects";

const MAX_SHOTS = 10;

/**
 * Close-up finishing shots for the careers page, taken from the live
 * portfolio so they are always real Migss work. Bathrooms first, since that
 * is the trade being hired for, and at most two shots per project so the
 * strip shows range rather than one room from every angle.
 */
export function finishShots(projects: Project[]): GalleryShot[] {
  const ordered = [...projects].sort(
    (a, b) =>
      Number(a.category !== "Bathroom") - Number(b.category !== "Bathroom"),
  );

  const shots: GalleryShot[] = [];
  for (const project of ordered) {
    const fromProject = project.gallery.slice(0, 2);
    if (fromProject.length === 0 && project.heroUrl) {
      fromProject.push({ url: project.heroUrl, alt: project.title });
    }
    shots.push(...fromProject);
    if (shots.length >= MAX_SHOTS) break;
  }
  return shots.slice(0, MAX_SHOTS);
}

/**
 * "This is the standard" band: copy beside a horizontal strip of finished
 * work. Same snap-scrolling strip as the portfolio's featured carousel, so a
 * swipe always settles on an image edge.
 */
export function FinishGallery({ shots }: { shots: GalleryShot[] }) {
  if (shots.length === 0) return null;

  return (
    <section
      aria-labelledby="finish-heading"
      className="mx-auto mt-[clamp(30px,6vw,68px)] grid max-w-[1280px] items-center gap-[clamp(18px,3vw,40px)] md:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]"
    >
      <Reveal className="px-[clamp(16px,4.5vw,48px)] md:pr-0">
        <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
          The standard we work to
        </p>
        <h2
          id="finish-heading"
          className="mb-[13.8px] text-[clamp(28px,6.4vw,40px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance"
        >
          Are you experienced in delivering this kind of luxury quality?
        </h2>
        <p className="mb-[18.4px] text-[15px] leading-[1.75] text-migss-text/78">
          Every photograph here is finished Migss work, built by our own team. If
          this is the quality you deliver, view our available positions below.
        </p>
        <a
          href="#roles"
          className="text-sm font-medium text-migss-accent-ink no-underline"
        >
          View available positions ↓
        </a>
      </Reveal>

      <ul
        aria-label="Examples of finished work"
        className="migss-scroll flex list-none snap-x snap-mandatory gap-[clamp(10px,2vw,16px)] overflow-x-auto overscroll-x-contain scroll-p-[clamp(16px,4.5vw,48px)] px-[clamp(16px,4.5vw,48px)] md:pl-0"
      >
        {shots.map((shot) => (
          <li
            key={shot.url}
            className="aspect-[4/5] w-[min(70vw,300px)] flex-none snap-start overflow-hidden rounded-[4px]"
          >
            <ImageSlot
              placeholder={shot.alt}
              src={shot.url}
              alt={shot.alt}
              captionHidden
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
