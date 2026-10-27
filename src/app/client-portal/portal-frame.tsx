import Link from "next/link";

import s from "./portal.module.css";

/**
 * The staff sign-in's frame: the header photograph fading into charcoal, the
 * bar with its tracked label, and a centred column. Shared by both portal
 * pages so they cannot drift from each other.
 *
 * The bar carries one thing the staff screen does not: a way back to the
 * website, on the right. The staff app is a separate site with nowhere to go
 * back to; this portal sits inside the website and a client should never be
 * stranded in it.
 */
export function PortalFrame({
  barLabel,
  barAction,
  children,
}: {
  barLabel: string;
  barAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={s.screen}>
      <div className={s.banner} aria-hidden="true">
        {/* A plain img: it is 46 KB already sized for the job, and the image
            optimiser would only add a round trip in front of it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portal/login-header.webp"
          alt=""
          className={s.bannerImage}
          fetchPriority="high"
        />
        <div className={s.bannerFade} />
        <div className={s.bannerNoise} />
      </div>

      <header className={s.bar}>
        <span className={s.caps}>{barLabel}</span>
        {barAction ?? (
          <Link href="/" className={s.barLink}>
            Back to site
          </Link>
        )}
      </header>

      <main className={s.body}>
        <div className={s.column}>
          <Link href="/" aria-label="Migss Interiors home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portal/lockup-light.png"
              alt="Migss"
              width={412}
              height={86}
              className={s.logo}
            />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
