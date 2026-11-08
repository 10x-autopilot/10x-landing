"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = ["New", "Qualified", "Booked", "Won"] as const;

type Lead = {
  id: string;
  name: string;
  source: string;
  tags: string[];
  value: number;
  stage: number;
  tasks: { text: string; done: boolean }[];
};

const seed: Lead[] = [
  { id: "1", name: "Sarah Tan", tags: ["Price enquiry"], source: "Click-to-WhatsApp", value: 4800, stage: 0, tasks: [{ text: "Reply with price list", done: false }, { text: "Day 3: check in", done: false }] },
  { id: "2", name: "Mrs. Wong", tags: ["Website"], source: "Website form", value: 2200, stage: 0, tasks: [{ text: "Call to confirm needs", done: false }] },
  { id: "3", name: "Daniel Lim", tags: ["Referred", "Hot"], source: "Saved WhatsApp link", value: 6500, stage: 1, tasks: [{ text: "Send two options", done: true }, { text: "Day 7: ask about timing", done: false }] },
  { id: "4", name: "Aisyah R.", tags: ["Booked"], source: "Booking page", value: 3100, stage: 2, tasks: [{ text: "Confirm Saturday visit", done: false }] },
  { id: "5", name: "Kumar S.", tags: ["Customer"], source: "Referral", value: 5200, stage: 3, tasks: [{ text: "Ask for a review", done: false }] },
];

const rm = (n: number) => `RM ${n.toLocaleString("en-MY")}`;

export function PipelineDemo() {
  const [leads, setLeads] = useState(seed);
  const [selected, setSelected] = useState("1");
  const lead = leads.find((l) => l.id === selected)!;
  const open = leads.filter((l) => l.stage < 3).reduce((s, l) => s + l.value, 0);

  const move = () => setLeads((ls) => ls.map((l) => (l.id === selected && l.stage < 3 ? { ...l, stage: l.stage + 1 } : l)));
  const toggle = (i: number) =>
    setLeads((ls) =>
      ls.map((l) => (l.id === selected ? { ...l, tasks: l.tasks.map((t, ti) => (ti === i ? { ...t, done: !t.done } : t)) } : l)),
    );

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,250px)]">
      <div className="flex flex-col">
        <p className="mb-2 flex items-center justify-between text-[12px] text-subtle">
          <span>Select a lead, then move it along.</span>
          <span className="font-mono">Open: {rm(open)}</span>
        </p>
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          {stages.map((s, si) => (
            <div key={s} className="flex min-h-[150px] flex-col content-start gap-1.5 rounded-xl bg-white/[0.025] p-1.5">
              <p className="px-1 font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">
                {s} <span className="text-subtle">{leads.filter((l) => l.stage === si).length}</span>
              </p>
              {leads
                .filter((l) => l.stage === si)
                .map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={selected === l.id}
                    onClick={() => setSelected(l.id)}
                    className={cn(
                      "rounded-lg border p-2 text-left transition-colors",
                      selected === l.id ? "border-accent bg-accent/[0.08]" : "border-white/[0.07] bg-elevated hover:border-white/20",
                    )}
                  >
                    <span className="block truncate text-[13px] font-medium">{l.name}</span>
                    <span className={cn("font-mono text-[10px]", si === 3 ? "text-success-text" : "text-subtle")}>
                      {si === 3 ? "Won " : ""}
                      {rm(l.value)}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5" aria-live="polite">
        <p className="text-[15px] font-medium">{lead.name}</p>
        <p className="text-[12px] text-secondary">
          Source: {lead.source}
        </p>
        <p className="mt-0.5 font-mono text-[12px] text-secondary">{rm(lead.value)}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
          {lead.tags.map((t) => (
            <li key={t} className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] text-secondary">
              {t}
            </li>
          ))}
        </ul>
        <p className="mb-1.5 mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Follow-ups</p>
        <ul className="mb-4 space-y-1.5">
          {lead.tasks.map((t, i) => (
            <li key={t.text}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={t.done}
                className="flex w-full items-center gap-2 text-left text-[13px]"
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    t.done ? "border-success bg-success text-success-fg" : "border-white/25",
                  )}
                >
                  {t.done ? <Check className="size-3" aria-hidden /> : null}
                </span>
                <span className={cn(t.done && "text-subtle line-through")}>{t.text}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={move}
          disabled={lead.stage === 3}
          className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] ring-1 ring-inset ring-white/15 hover:ring-accent/60 disabled:opacity-40"
        >
          {lead.stage === 3 ? "Won" : `Move to ${stages[lead.stage + 1]}`}
          {lead.stage < 3 ? <ArrowRight className="size-3.5" aria-hidden /> : null}
        </button>
      </div>
    </div>
  );
}
