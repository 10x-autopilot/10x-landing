"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { pricingPlans, setupCopy } from "@/lib/pricing";
import { openTrialEvent, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Form = { company: string; name: string; email: string; phone: string; plan: string; setup: boolean };

const empty: Form = { company: "", name: "", email: "", phone: "", plan: "scaler", setup: false };

const field =
  "h-12 w-full rounded-xl border border-border bg-bg px-4 text-[15px] text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

/** Two-step free trial popup. Any link to the signup URL opens it. */
export function TrialModal() {
  const reduced = useReducedMotionPref();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<Form>(empty);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const plan = (e as CustomEvent<{ plan?: string }>).detail?.plan;
      setStep(1);
      setForm((f) => ({ ...f, plan: plan && pricingPlans.some((p) => p.slug === plan) ? plan : f.plan }));
      setOpen(true);
    };
    window.addEventListener(openTrialEvent, onOpen);
    return () => window.removeEventListener(openTrialEvent, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const finish = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(siteConfig.signupUrl);
    url.searchParams.set("company", form.company);
    url.searchParams.set("name", form.name);
    url.searchParams.set("email", form.email);
    url.searchParams.set("phone", form.phone);
    url.searchParams.set("plan", form.plan);
    url.searchParams.set("setup", form.setup ? "yes" : "no");
    window.location.href = url.toString();
  };

  const dur = reduced ? 0 : 0.25;

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trial-title"
            className="relative max-h-[calc(100dvh-32px)] w-full max-w-[520px] overflow-y-auto rounded-xl border border-border bg-surface p-6 sm:p-8"
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 8 }}
            transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-secondary transition-colors hover:text-fg"
            >
              <X className="size-5" aria-hidden />
            </button>

            <h2 id="trial-title" className="pr-8 text-[26px] font-semibold leading-tight tracking-[-0.03em] sm:text-[30px]">
              Start your 7-day free trial
            </h2>
            <p className="mt-2 text-[15px] text-secondary">Full access. We set it up with you.</p>

            <ol className="mt-6 grid grid-cols-2 gap-3 text-[13px]" aria-label="Progress">
              {[
                { n: 1, label: "Your business" },
                { n: 2, label: "Trial details" },
              ].map((s) => (
                <li key={s.n} aria-current={step === s.n ? "step" : undefined}>
                  <div className={cn("h-1 rounded-full", step >= s.n ? "bg-accent" : "bg-white/10")} />
                  <p className={cn("mt-2", step === s.n ? "text-fg" : "text-secondary")}>
                    Step {s.n}. {s.label}
                  </p>
                </li>
              ))}
            </ol>

            {step === 1 ? (
              <form onSubmit={next} className="mt-6 space-y-3">
                <input required autoFocus className={field} placeholder="Company name" autoComplete="organization" value={form.company} onChange={set("company")} aria-label="Company name" />
                <input required className={field} placeholder="Full name" autoComplete="name" value={form.name} onChange={set("name")} aria-label="Full name" />
                <input required type="email" className={field} placeholder="Email address" autoComplete="email" value={form.email} onChange={set("email")} aria-label="Email address" />
                <input required type="tel" className={field} placeholder="Phone number (+60)" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-label="Phone number" />
                <button type="submit" className="h-12 w-full rounded-xl bg-accent text-[16px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
                  Go to step 2
                </button>
              </form>
            ) : (
              <form onSubmit={finish} className="mt-6 space-y-4">
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-[14px] text-secondary">Pick a plan to start with</legend>
                  {pricingPlans.map((p) => (
                    <label
                      key={p.slug}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
                        form.plan === p.slug ? "border-accent bg-accent/10" : "border-border hover:border-white/20",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" name="plan" className="accent-[#2563EB]" checked={form.plan === p.slug} onChange={() => setForm((f) => ({ ...f, plan: p.slug }))} />
                        <span className="text-[15px] font-medium">{p.name}</span>
                      </span>
                      <span className="text-[14px] text-secondary">${p.monthly}/mo</span>
                    </label>
                  ))}
                </fieldset>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3">
                  <input type="checkbox" className="mt-1 accent-[#2563EB]" checked={form.setup} onChange={(e) => setForm((f) => ({ ...f, setup: e.target.checked }))} />
                  <span>
                    <span className="block text-[15px] font-medium">{setupCopy.label}</span>
                    <span className="block text-[14px] text-secondary">{setupCopy.note}</span>
                  </span>
                </label>

                <p className="text-[14px] text-secondary">7 days free. Pick a plan after.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="h-12 rounded-xl border border-border px-5 text-[15px] text-secondary transition-colors hover:text-fg">
                    Back
                  </button>
                  <button type="submit" className="h-12 flex-1 rounded-xl bg-accent text-[16px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
                    Start free trial
                  </button>
                </div>
              </form>
            )}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
