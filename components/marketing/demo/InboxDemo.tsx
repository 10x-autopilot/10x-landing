"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const draftText =
  "Hi Sarah, thanks for asking. The full set is RM 4,800. I can hold a slot this Saturday at 10 AM or 2 PM. Which one suits you?";

type Phase = "idle" | "drafting" | "draft" | "ready";

export function InboxDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [text, setText] = useState(draftText);

  useEffect(() => {
    if (phase !== "drafting") return;
    const t = setTimeout(() => setPhase("draft"), reduce ? 0 : 1100);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
      <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-semibold">ST</span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium leading-tight">Sarah Tan</p>
            <p className="text-[11px] text-subtle">WhatsApp · 11:02 PM</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3.5">
          <Bubble>Hi, how much for the full set?</Bubble>
          <Bubble>Also, are you free this weekend?</Bubble>
          {phase === "drafting" ? (
            <p className="self-end font-mono text-[11px] text-subtle" aria-live="polite">
              Aisyah is drafting...
            </p>
          ) : null}
          {phase === "draft" || phase === "ready" ? (
            <div className="mt-1 self-end rounded-xl border border-dashed border-accent/50 bg-accent/[0.05] p-2.5 sm:max-w-[85%]">
              <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-text">
                <FileText className="size-3" aria-hidden /> Draft by Aisyah
              </p>
              <label className="sr-only" htmlFor="demo-draft">
                Edit the draft reply
              </label>
              <textarea
                id="demo-draft"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={phase === "ready"}
                rows={4}
                className="w-full resize-none rounded-md bg-transparent text-[13px] leading-relaxed text-fg outline-none focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] px-3.5 py-2.5">
          {phase === "idle" ? (
            <button
              type="button"
              onClick={() => setPhase("drafting")}
              className="rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-fg hover:bg-accent-hover"
            >
              Ask Aisyah to draft a reply
            </button>
          ) : null}
          {phase === "draft" ? (
            <>
              <button
                type="button"
                onClick={() => setPhase("ready")}
                className="rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-fg hover:bg-accent-hover"
              >
                Approve draft
              </button>
              <span className="text-[12px] text-subtle">Edit the text first if you like.</span>
            </>
          ) : null}
          {phase === "ready" ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-success-text">
              <Check className="size-3.5" aria-hidden /> Approved by you. You send it from your inbox.
            </span>
          ) : null}
          {phase !== "idle" && phase !== "drafting" ? (
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setText(draftText);
              }}
              className="ml-auto text-[12px] text-accent-text underline-offset-4 hover:underline"
            >
              Start over
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <Side title="Summary">Asked for the price of the full set and weekend availability.</Side>
        <Side title="Knowledge it used">Price list, weekend hours.</Side>
        <Side title="Rule">The AI drafts. Nothing goes out until a person sends it.</Side>
      </div>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return <p className="max-w-[80%] self-start rounded-xl rounded-bl-sm bg-white/[0.07] px-3 py-2 text-[13px]">{children}</p>;
}

function Side({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-white/[0.07] bg-white/[0.02] p-3")}>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">{title}</p>
      <p className="text-[13px] text-secondary">{children}</p>
    </div>
  );
}
