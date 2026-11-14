import { cn } from "@/lib/utils";

/**
 * The chat bubble used for WhatsApp in the header and the dock.
 *
 * At rest it is Lucide's "message-circle-text" (three lines of text). When
 * the link it sits in is hovered or focused, the lines draw back to the left
 * and three dots pop in one after another, ending on Lucide's
 * "message-circle-more" (someone typing). Both are drawn in one SVG so the
 * bubble outline never moves; only the inside changes.
 *
 * The parent link needs the `group` class. Hover styles only apply on
 * devices that can hover (Tailwind 4 default), so a tap on a phone does not
 * leave the icon stuck mid-animation, and reduced-motion users get an
 * instant swap.
 */
export function ChatIcon({
  size = 20,
  strokeWidth = 2.5,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const line =
    "origin-left [transform-box:fill-box] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none group-hover:scale-x-0 group-hover:opacity-0 group-focus-visible:scale-x-0 group-focus-visible:opacity-0";
  const dot =
    "origin-center scale-0 opacity-0 [transform-box:fill-box] transition-[transform,opacity] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("flex-none overflow-visible", className)}
    >
      <path d="M3.086 17.509a2 2 0 00-.094-1.167 10 10 0 114.777 4.719 2 2 0 00-1.099-.092l-3.413.998a1 1 0 01-1.236-1.168z" />
      <path className={line} d="M8 8h7" />
      <path className={cn(line, "delay-[40ms]")} d="M8 12h9" />
      <path className={cn(line, "delay-[80ms]")} d="M8 16h5" />
      <path className={cn(dot, "group-hover:delay-[120ms] group-focus-visible:delay-[120ms]")} d="M8 12h.01" strokeWidth={strokeWidth + 0.5} />
      <path className={cn(dot, "group-hover:delay-[190ms] group-focus-visible:delay-[190ms]")} d="M12 12h.01" strokeWidth={strokeWidth + 0.5} />
      <path className={cn(dot, "group-hover:delay-[260ms] group-focus-visible:delay-[260ms]")} d="M16 12h.01" strokeWidth={strokeWidth + 0.5} />
    </svg>
  );
}
