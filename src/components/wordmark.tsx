import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "font-heading grid place-items-center rounded-full border",
          size === "lg"
            ? "h-9 w-9 border-migss-accent-400 text-base text-migss-accent-300"
            : "h-[34px] w-[34px] border-current/60 text-[15px]",
        )}
      >
        M
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading tracking-[0.05em]",
            size === "lg" ? "text-2xl" : "text-[clamp(18px,4.8vw,22px)]",
          )}
        >
          MIGSS
        </span>
        <span className="mt-[3px] text-[8px] tracking-[0.32em] text-migss-accent-300">
          INTERIORS
        </span>
      </span>
    </span>
  );
}
