"use client";

import * as React from "react";

/** Pause before typing starts, so the card can finish popping up. */
const START_DELAY_MS = 380;
const CHAR_MS = 45;
const AFTER_MS = 160;

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * A heading that types itself out, then calls `onDone`. Screen readers get the
 * full text straight away; the typed letters are decorative. Reduced motion
 * shows it at once. Same behaviour as the BrandFactory Labs enquiry card, set
 * in the Migss heading face.
 */
export function TypedHeading({
  id,
  text,
  onDone,
  startDelay = START_DELAY_MS,
}: {
  id: string;
  text: string;
  onDone: () => void;
  startDelay?: number;
}) {
  const reduced = useReducedMotion();
  // The count belongs to the text it was typed for, so a new heading starts
  // from zero.
  const [typed, setTyped] = React.useState({ text: "", count: 0 });
  const count = reduced ? text.length : typed.text === text ? typed.count : 0;

  React.useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 0);
      return () => clearTimeout(t);
    }
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      n += 1;
      setTyped({ text, count: n });
      if (n < text.length) timer = setTimeout(tick, CHAR_MS);
      else timer = setTimeout(onDone, AFTER_MS);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
    // onDone is read when the text changes; every step has a different heading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced, startDelay]);

  const typing = count < text.length;
  return (
    <h2
      id={id}
      className="font-heading min-h-[34px] text-[30px] leading-[1.1] font-normal tracking-[-0.02em]"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {typing && <span className="enquiry-caret" />}
      </span>
    </h2>
  );
}
