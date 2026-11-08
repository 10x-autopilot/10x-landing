"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { SectionItem, SectionWrapper } from "./SectionWrapper";

/** The audit form card inside chapter 07. The final CTA scrolls here. */
export const AUDIT_FORM_ID = "audit-form";

/** Chapter 07 opener and CTA. The contact form is passed in as children. */
export function FinalCTA({ children }: { children: ReactNode }) {
  return (
    <>
      <SectionWrapper className="mx-auto max-w-3xl text-center">
        <SectionItem>
          <p className="mb-5 flex items-center justify-center gap-3">
            <span className="chapter-marker flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-[11px] text-subtle ring-1 ring-inset ring-white/12 transition-all duration-500">
              07
            </span>
            <span className="eyebrow">Talk to our sales team</span>
          </p>
        </SectionItem>
        <SectionItem>
          <h2 id="audit-title" data-focus-target className="text-hero text-balance focus:outline-none">
            Stop losing leads. <span className="text-secondary">Start closing more.</span>
          </h2>
        </SectionItem>
        <SectionItem>
          <p className="text-lead mx-auto mt-5 max-w-xl text-secondary">
            Ready to stop losing leads? Tell our sales team about your business and we will set up your account with you.
          </p>
        </SectionItem>
        <SectionItem className="mt-9 flex justify-center">
          <Magnetic>
            {/* Depth shadow sits on a wrapper so it never fights the button's own classes. */}
            <div className="rounded-full shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_14px_28px_-10px_rgba(37,99,235,0.55),0_30px_60px_-20px_rgba(0,0,0,0.9)]">
              <CtaLink
                href={siteConfig.demoUrl}
                event="cta_clicked"
                eventProps={{ location: "final_cta" }}
                size="lg"
                className="h-16 px-9 text-[18px] sm:h-[72px] sm:px-12 sm:text-[20px]"
              >
                {siteConfig.cta.demo}
                <ArrowRight className="size-4" aria-hidden />
              </CtaLink>
            </div>
          </Magnetic>
        </SectionItem>
      </SectionWrapper>

      {children}
    </>
  );
}
