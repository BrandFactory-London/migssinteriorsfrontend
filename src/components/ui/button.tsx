import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's `.btn`, as a variant component. Sizes default to a
 * 44px+ target so every control is tappable without a separate mobile pass.
 */
const buttonVariants = cva(
  "font-heading inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border text-center leading-tight font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent disabled:cursor-not-allowed disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "border-migss-accent text-migss-accent-ink hover:bg-migss-accent/12 active:bg-migss-accent/20",
        secondary:
          "border-[var(--migss-divider)] text-migss-text hover:bg-migss-text/7 active:bg-migss-text/15",
        ghost:
          "border-transparent text-migss-accent-ink hover:bg-migss-accent/10 active:bg-migss-accent/20",
        /** Light-on-dark, for the hero and the dark testimonial card. */
        contrast:
          "border-migss-neutral-100 bg-migss-neutral-100 text-migss-neutral-900 hover:bg-white active:bg-migss-neutral-200",
        outlineLight:
          "border-migss-neutral-100/55 text-migss-neutral-100 hover:bg-migss-neutral-100/12 active:bg-migss-neutral-100/20",
        outlineAccent:
          "border-migss-accent-400 text-migss-accent-300 hover:bg-migss-accent-300/12 active:bg-migss-accent-300/20",
      },
      size: {
        md: "min-h-[48px] px-4 text-sm",
        lg: "min-h-[56px] px-5 text-[15px]",
        xl: "min-h-[58px] px-5 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<"a"> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size }), "no-underline", className)}
      {...props}
    />
  );
}

export { buttonVariants };
