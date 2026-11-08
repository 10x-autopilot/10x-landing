"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";
import { scrollToId } from "@/lib/scroll";
import { openTrialEvent, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg" | "inline";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent-hover shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_8px_24px_-8px_rgb(37_99_235/0.6)]",
  secondary: "bg-white/[0.04] text-fg ring-1 ring-inset ring-white/12 hover:bg-white/[0.08] hover:ring-white/20",
  ghost: "text-secondary hover:text-fg",
  link: "text-accent-text hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[14px] sm:px-4",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-6 text-[16px] sm:h-14 sm:px-7",
  /** Text-link style: no height or padding. */
  inline: "text-[14px]",
};

export function ctaClasses(variant: Variant = "primary", size: Size = "md", className?: string, wrap = false) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[background-color,box-shadow,color,transform] duration-200 active:scale-[0.98]",
    variants[variant],
    sizes[size],
    !wrap && "whitespace-nowrap",
    className,
  );
}

type Props = {
  href: string;
  children: ReactNode;
  event?: AnalyticsEvent;
  eventProps?: AnalyticsProps;
  variant?: Variant;
  size?: Size;
  className?: string;
  onNavigate?: () => void;
  /** Allow the label to wrap onto two lines (long, contextual CTAs). */
  wrap?: boolean;
  "aria-label"?: string;
};

export function CtaLink({
  href,
  children,
  event = "cta_clicked",
  eventProps,
  variant = "primary",
  size = "md",
  className,
  onNavigate,
  wrap,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      className={ctaClasses(variant, size, className, wrap)}
      onClick={(e) => {
        track(event, eventProps);
        onNavigate?.();
        if (href === siteConfig.signupUrl && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent(openTrialEvent, { detail: { plan: eventProps?.plan } }));
          return;
        }
        if (href.startsWith("#") && !e.metaKey && !e.ctrlKey) {
          if (scrollToId(href.slice(1))) e.preventDefault();
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
