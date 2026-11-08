"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey = "pipeline" | "inbox" | "workflow" | "website" | "social" | "together";

/**
 * One sample customer, five tools. Each step adds a group of fields to the same record.
 * Everything here is simulated with made-up data and matches the verified feature list:
 * tracked links, forms, workflow actions, AI drafts that need approval, pipeline stages.
 */
const journey: readonly {
  title: string;
  line: string;
  tool: string;
  go: TabKey;
  rows: readonly (readonly [string, string])[];
}[] = [
  {
    title: "Sarah sees your post",
    line: "She taps the tracked link in a Facebook post.",
    tool: "Social posts",
    go: "social",
    rows: [["Source", "Facebook post, tracked link"]],
  },
  {
    title: "She sends the website form",
    line: "The form on your page captures her details.",
    tool: "Website",
    go: "website",
    rows: [
      ["Name", "Sarah Tan"],
      ["Phone", "+60 12 555 0142"],
      ["Message", "How much for a full set?"],
    ],
  },
  {
    title: "A workflow routes her",
    line: "One trigger tags her, opens a deal and sets a task.",
    tool: "Workflow",
    go: "workflow",
    rows: [
      ["Tag", "New lead"],
      ["Deal", "Opportunity in New"],
      ["Task", "Reply today, 9:00 AM"],
    ],
  },
  {
    title: "Aisyah drafts the reply",
    line: "She uses your price list. You review and send.",
    tool: "WhatsApp inbox",
    go: "inbox",
    rows: [
      ["Draft", "Full set is RM 4,800. Saturday 10 AM or 2 PM?"],
      ["Status", "Waiting for your approval"],
    ],
  },
  {
    title: "The pipeline keeps score",
    line: "Her stage, value and next follow-up stay in view.",
    tool: "Pipeline",
    go: "pipeline",
    rows: [
      ["Stage", "New"],
      ["Value", "RM 4,800"],
      ["Next follow-up", "Day 3: check in"],
    ],
  },
];

export function TogetherDemo({ onGo, isActive }: { onGo: (t: TabKey) => void; isActive: boolean }) {
  const reducedPref = useReducedMotion();
  // The preference is only known on the client. Reading it after mount keeps server and client HTML identical.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!reducedPref;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);

  const auto = isActive && playing && !hold && !reduce;
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setStep((s) => (s + 1) % journey.length), 2600);
    return () => clearInterval(t);
  }, [auto]);

  const current = journey[step]!;

  return (
    <div
      className="flex h-full flex-col gap-4"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <ol className="relative flex flex-col gap-1.5">
          {journey.map((s, i) => {
            const state = i === step ? "now" : i < step ? "past" : "next";
            return (
              <li key={s.title} className="relative flex-1">
                <button
                  type="button"
                  aria-current={state === "now" ? "step" : undefined}
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex h-full w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-[border-color,background-color,opacity] duration-300",
                    state === "now" && "border-accent bg-accent/[0.08]",
                    state === "past" && "border-white/[0.07] bg-elevated opacity-80",
                    state === "next" && "border-white/[0.07] bg-elevated opacity-55 hover:opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                      state === "now" ? "bg-accent text-accent-fg" : "bg-white/[0.08] text-secondary",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium">{s.title}</span>
                    <span className="mt-0.5 hidden text-[12px] text-secondary xl:block">{s.line}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02]" aria-live="polite">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-3.5 py-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-semibold">ST</span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-tight">Sarah Tan</p>
              <p className="text-[11px] text-subtle">One record, built step by step</p>
            </div>
            <span className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[10px] text-secondary">SIMULATED</span>
          </div>
          <div className="flex flex-1 flex-col gap-1 p-2.5">
            {journey.map((g, i) => {
              const shown = i <= step;
              const skel = "justify-self-start rounded bg-white/[0.045] text-transparent select-none";
              return (
                <div
                  key={g.tool}
                  className={cn(
                    "grid flex-1 grid-cols-1 gap-x-3 gap-y-1 rounded-lg border px-2.5 py-2 transition-[opacity,border-color,background-color] duration-500 motion-reduce:transition-none sm:grid-cols-[84px_minmax(0,1fr)]",
                    shown ? "border-white/[0.07]" : "border-dashed border-white/[0.07] opacity-60",
                    i === step && "border-accent/50 bg-accent/[0.05]",
                  )}
                >
                  <p className="font-mono text-[10px] uppercase leading-[18px] tracking-[0.08em] text-subtle">{g.tool}</p>
                  <dl aria-hidden={!shown} className="grid grid-cols-[76px_minmax(0,1fr)] gap-x-2 gap-y-0.5 text-[12px] leading-[18px]">
                    {g.rows.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className={cn("text-subtle", !shown && skel)}>{k}</dt>
                        <dd className={cn("text-fg", !shown && skel)}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
        <p className="min-w-0 text-[13px] text-secondary">Sample customer, made-up data. Nothing here is live.</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing && !reduce ? "Pause the journey" : "Play the journey"}
            className="flex size-8 items-center justify-center rounded-full ring-1 ring-inset ring-white/15 hover:ring-white/30"
          >
            {playing && !reduce ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => onGo(current.go)}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-fg hover:bg-accent-hover"
          >
            Try {current.tool} <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
