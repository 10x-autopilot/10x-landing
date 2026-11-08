"use client";

import { useEffect, useId, useState } from "react";
import { m, useSpring, useTransform } from "framer-motion";
import { trackOnce } from "@/lib/analytics";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { siteConfig } from "@/lib/site-config";
import { CtaLink } from "@/components/ui/CtaLink";

const MISSED = { min: 1, max: 50, step: 1 };
const VALUE = { min: 25, max: 500, step: 25 };
const CLOSE_RATE = 0.2;

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Missed enquiries a week × 4 weeks × what one customer is worth × a 20% close rate. */
export function calculateLoss(missedPerWeek: number, customerValue: number) {
  const monthlyLoss = missedPerWeek * 4 * customerValue * CLOSE_RATE;
  return { monthlyLoss, yearlyLoss: monthlyLoss * 12 };
}

export function LostRevenueCalculator() {
  const [missed, setMissed] = useState(10);
  const [value, setValue] = useState(100);
  const { monthlyLoss, yearlyLoss } = calculateLoss(missed, value);
  const used = () => trackOnce("calculator_used");

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <h3 id="calculator-title" className="text-title text-balance">
          How much are unanswered messages costing you?
        </h3>
        <p className="mt-3 text-[17px] text-secondary">Move the sliders. See the real number.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        <Slider
          label="Enquiries you miss per week"
          display={String(missed)}
          valueText={`${missed} enquiries per week`}
          value={missed}
          {...MISSED}
          onChange={(n) => {
            setMissed(n);
            used();
          }}
        />
        <Slider
          label="What one customer is worth (USD)"
          display={usd(value)}
          valueText={`${value} US dollars`}
          value={value}
          {...VALUE}
          onChange={(n) => {
            setValue(n);
            used();
          }}
        />
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-[13px] text-secondary">
        Assumes a 20% closing rate on missed enquiries.
      </p>

      <div className="mx-auto mt-8 max-w-3xl border-t border-border pt-10 text-center" aria-live="polite">
        <p className="text-[clamp(1.75rem,1.1rem+3.2vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.04em]">
          <AnimatedUsd value={monthlyLoss} /> lost every month.
        </p>
        <p className="mt-4 text-balance text-[17px] text-warning sm:text-[19px]">
          That is <AnimatedUsd value={yearlyLoss} /> bleeding out of your business every year.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <CtaLink
          href={siteConfig.signupUrl}
          event="cta_clicked"
          eventProps={{ location: "calculator" }}
          size="lg"
          wrap
          className="w-full text-center sm:w-auto"
        >
          Stop losing money. {siteConfig.cta.primary}
        </CtaLink>
      </div>
      <p className="mt-4 text-center text-[13px] text-secondary">Estimate only. Actual results vary.</p>
    </div>
  );
}

function Slider({
  label,
  display,
  valueText,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  display: string;
  valueText: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] text-fg">
          {label}
        </label>
        <span aria-hidden className="shrink-0 font-mono text-[15px] text-accent-text">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/** Counts up and down like an odometer as the value changes. Snaps when reduced motion is on. */
function AnimatedUsd({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 90, damping: 22, mass: 0.8, restDelta: 0.5, restSpeed: 0.5 });
  const text = useTransform(spring, (v) => usd(v));
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced) spring.jump(value);
    else spring.set(value);
  }, [value, reduced, spring]);

  return (
    <>
      <m.span aria-hidden className="tabular-nums">
        {text}
      </m.span>
      <span className="sr-only">{usd(value)}</span>
    </>
  );
}
