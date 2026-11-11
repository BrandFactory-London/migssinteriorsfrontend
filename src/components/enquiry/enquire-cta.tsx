import { EnquiryPageContext } from "@/components/enquiry/page-context";
import { ButtonLink } from "@/components/ui/button";
import type { EnquiryFocus } from "@/lib/enquiry";
import { SITE, telHref } from "@/lib/site";

const STEPS = ["Your details", "Your project", "Anything else"];

/**
 * Stands where the inline enquiry form used to: a short panel whose button
 * opens the site-wide enquiry card, with this section's context. It also
 * registers that context for the page, so the dock's "Free quote" button
 * opens the card with the same room or town pre-filled.
 *
 * Without JavaScript the button is a plain link to /contact, which has the
 * form inline.
 */
export function EnquireCta({
  focus,
  town,
}: {
  focus?: EnquiryFocus;
  town?: string;
}) {
  return (
    <div className="rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg p-[clamp(18px,4vw,28px)] shadow-migss-sm">
      <EnquiryPageContext focus={focus} town={town} />
      <p className="mb-2 text-[11px] font-medium tracking-[0.18em] text-migss-accent-ink uppercase">
        Free quote
      </p>
      <p className="font-heading mb-[18px] text-[clamp(24px,5.4vw,30px)] leading-[1.1]">
        Three quick steps, about a minute.
      </p>
      <ol className="mb-[22px] grid list-none border-t border-[var(--migss-divider)]">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 border-b border-[var(--migss-divider)] py-2.5 text-[15px]"
          >
            <span className="font-heading w-[2.2ch] text-sm text-migss-accent-ink tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <ButtonLink
        href="/contact"
        data-enquire=""
        data-enquire-focus={focus}
        data-enquire-town={town}
        variant="solid"
        size="xl"
        className="font-body w-full font-medium"
      >
        Get your free quote
      </ButtonLink>
      <p className="mt-3 text-center text-[13px] text-migss-text/60">
        Or call us now on{" "}
        <a href={telHref} className="text-migss-accent-ink">
          {SITE.phone}
        </a>
      </p>
    </div>
  );
}
