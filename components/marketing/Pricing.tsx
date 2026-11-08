"use client";

import { m, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { pricingCopy, pricingPlans, setupCopy } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { CountUp } from "@/components/ui/CountUp";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { PricingViewTracker } from "./PricingViewTracker";

const EASE = [0.16, 1, 0.3, 1] as const;

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Chapter 06 header and plans. Growth is the one featured card. */
export function Pricing() {
  const reduced = useReducedMotionPref();
  const format = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

  return (
    <>
      <div>
        <ChapterHeader num="06" label="Pricing & trust" id="pricing-title" title={pricingCopy.title} lead={pricingCopy.lead} />
      </div>

      <div className="relative mt-12">
        <PricingViewTracker />
        <m.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch lg:mb-24"
        >
        {pricingPlans.map((plan) => (
            <m.li
              key={plan.slug}
              variants={card}
              whileHover={reduced ? undefined : { scale: plan.highlighted ? 1.03 : 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={cn("relative min-w-0", plan.highlighted && "lg:-my-3")}
            >
              {/* The featured plan floats gently; the others stay still. */}
              <m.div
                className="h-full"
                animate={plan.highlighted && !reduced ? { y: [0, -5, 0] } : undefined}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                style={plan.highlighted && !reduced ? { willChange: "transform" } : undefined}
              >
              <Tilt max={3}>
                <article
                  aria-labelledby={`plan-${plan.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col rounded-2xl border p-6 sm:p-8",
                    plan.highlighted
                      ? "border-accent/70 bg-elevated shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_0_64px_-8px_rgba(37,99,235,0.28)] lg:py-11"
                      : "border-border bg-surface",
                  )}
                >
                  {/* Hover border: an accent ring fades in (opacity only). */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 ring-1 ring-accent transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 id={`plan-${plan.slug}`} className="text-[20px] font-semibold tracking-[-0.02em]">
                      {plan.name}
                    </h3>
                    {plan.highlighted ? (
                      <span className="badge-pulse rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-fg">
                        Most popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-[17px] font-medium leading-snug tracking-[-0.01em]">{plan.headline}</p>

                  <div className="mt-8">
                    <p className="flex flex-wrap items-baseline gap-x-1.5">
                      <CountUp to={plan.monthly} format={format} className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums" />
                      <span className="text-[15px] text-secondary">/mo</span>
                    </p>
                    <p className="mt-2 text-[14px] text-secondary">{plan.subtext}</p>
                    <p className="mt-1 text-[14px] text-secondary">7 days free. Full access.</p>
                    <p className="mt-1 text-[14px] text-accent-text">{setupCopy.badge}</p>
                  </div>

                  <ul className="mt-8 space-y-3 border-t border-border pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[15px] text-secondary">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                                  <div className="mt-auto pt-8">
                    <Magnetic>
                      <CtaLink
                        href={siteConfig.signupUrl}
                        event="pricing_cta_clicked"
                        eventProps={{ plan: plan.slug, location: "pricing" }}
                        variant={plan.highlighted ? "primary" : "secondary"}
                        size="md"
                        className="w-full"
                        aria-label={`${siteConfig.cta.primary} (${plan.name} plan)`}
                      >
                        {siteConfig.cta.primary}
                      </CtaLink>
                    </Magnetic>
                  </div>
                </article>
              </Tilt>
              </m.div>
              {plan.badge ? (
                <div className="relative mt-6 lg:absolute lg:inset-x-0 lg:top-full lg:mt-8">
                  <m.span
                    aria-hidden
                    className="absolute -inset-1 rounded-xl bg-accent/50 blur-xl"
                    animate={reduced ? { opacity: 0.6 } : { opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <p className="relative rounded-xl border border-accent/70 bg-elevated px-4 py-3 text-center text-[14px] leading-snug text-fg">
                    {plan.badge}
                  </p>
                </div>
              ) : null}
            </m.li>
        ))}
        </m.ul>
      </div>

      <Reveal className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-balance text-[16px] text-secondary">
          Compare: one junior hire costs about $600-800/month. 10X {pricingPlans[0].name} starts at{" "}
          <span className="text-fg">{format(pricingPlans[0].monthly)}/month</span>.
        </p>
      </Reveal>
    </>
  );
}
