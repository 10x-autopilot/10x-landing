"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, CircleDot, GitBranch, Play, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Lane = "yes" | "no";
type Action = { id: string; label: string; result: string; lane: Lane; draft?: boolean };

const scenarios = [
  { key: "new", label: "New enquiry", who: "Sarah Tan", tag: null, msg: "Hi, how much for a full set?" },
  { key: "existing", label: "Existing customer", who: "Mr. Lim", tag: "Existing customer", msg: "What is the price for a top up?" },
] as const;

const baseActions: Action[] = [
  { id: "a1", lane: "yes", label: "Assign to account owner", result: "Assigned to Jason" },
  { id: "a2", lane: "yes", label: "Notify owner (internal)", result: "Owner notified inside the app" },
  { id: "b1", lane: "no", label: "Add tag: New lead", result: "Tag added: New lead" },
  { id: "b2", lane: "no", label: "Create opportunity in New", result: "Opportunity created in New" },
  { id: "b3", lane: "no", label: "Create task: reply today", result: "Task created, due today 9:00 AM" },
];
const copilotActions: Action[] = [
  { id: "c1", lane: "no", label: "Wait 3 days", result: "Waits 3 days", draft: true },
  { id: "c2", lane: "no", label: "Create task: check in", result: "Task created: check in", draft: true },
];

type Status = "idle" | "queued" | "running" | "done" | "skipped";

export function WorkflowDemo() {
  const reduce = useReducedMotion();
  const [scenario, setScenario] = useState<(typeof scenarios)[number]["key"]>("new");
  const [copilot, setCopilot] = useState(false);
  const [progress, setProgress] = useState(-1);

  const sc = scenarios.find((s) => s.key === scenario)!;
  const lane: Lane = sc.tag ? "yes" : "no";
  const actions = copilot ? [...baseActions, ...copilotActions] : baseActions;

  const order = useMemo(
    () => ["trigger", "cond", ...actions.filter((a) => a.lane === lane).map((a) => a.id)],
    [actions, lane],
  );

  useEffect(() => {
    if (progress < 0 || progress >= order.length) return;
    const t = setTimeout(() => setProgress((p) => p + 1), reduce ? 0 : 650);
    return () => clearTimeout(t);
  }, [progress, order.length, reduce]);

  const run = () => setProgress(0);
  const reset = (fn: () => void) => {
    setProgress(-1);
    fn();
  };

  const status = (id: string, lanePart?: Lane): Status => {
    const idx = order.indexOf(id);
    if (progress < 0) return "idle";
    if (idx === -1) return progress > 1 && lanePart ? "skipped" : "idle";
    if (idx < progress) return "done";
    if (idx === progress) return "running";
    return "queued";
  };

  const done = progress >= order.length;
  const log = order.slice(2).map((id) => actions.find((a) => a.id === id)!);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-subtle">Sample lead</span>
        {scenarios.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={scenario === s.key}
            onClick={() => reset(() => setScenario(s.key))}
            className={cn(
              "rounded-full px-3 py-1 text-[13px] ring-1 ring-inset transition-colors",
              scenario === s.key ? "bg-accent/15 text-fg ring-accent/50" : "text-secondary ring-white/10 hover:text-fg",
            )}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={run}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-fg hover:bg-accent-hover"
        >
          <Play className="size-3.5" aria-hidden /> {done ? "Run again" : "Run workflow"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1.3fr)] lg:items-center">
        <Node
          icon={Zap}
          kind="Trigger"
          title="Inbound message"
          detail={`Keyword: price`}
          status={status("trigger")}
        >
          <p className="mt-2 rounded-md bg-white/[0.04] px-2 py-1.5 text-[12px] text-secondary">
            {sc.who}: &quot;{sc.msg}&quot;
          </p>
        </Node>

        <Connector active={progress >= 1} />

        <Node
          icon={GitBranch}
          kind="Condition"
          title="If / else"
          detail="Has tag: Existing customer?"
          status={status("cond")}
        >
          {progress > 1 ? (
            <p className="mt-2 font-mono text-[11px] text-accent-text">{sc.tag ? "Yes" : "No"}</p>
          ) : null}
        </Node>

        <Connector active={progress >= 2} />

        <div className="grid gap-2">
          {(["yes", "no"] as const).map((l) => (
            <div
              key={l}
              className={cn(
                "rounded-xl border p-2.5 transition-opacity duration-300",
                l === lane || progress < 2 ? "border-white/[0.07] opacity-100" : "border-white/[0.04] opacity-40",
              )}
            >
              <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
                <ArrowRight className="size-3" aria-hidden /> {l === "yes" ? "Yes" : "No"}
              </p>
              <ul className="flex flex-col gap-1.5">
                {actions
                  .filter((a) => a.lane === l)
                  .map((a) => (
                    <li key={a.id}>
                      <ActionRow label={a.label} draft={a.draft} status={status(a.id, l)} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3" aria-live="polite">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Result</p>
          {progress < 2 ? (
            <p className="text-[13px] text-secondary">Run the workflow to see each step finish.</p>
          ) : (
            <ul className="space-y-1">
              {log.slice(0, Math.max(0, progress - 2)).map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-[13px]">
                  <Check className="size-3.5 text-success-text" aria-hidden /> {a.result}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
            <Sparkles className="size-3" aria-hidden /> Workflow copilot
          </p>
          {copilot ? (
            <>
              <p className="text-[13px] text-secondary">&quot;If they do not reply in 3 days, remind me to check in.&quot;</p>
              <p className="mt-1.5 text-[12px] text-subtle">Two steps added as a draft. You review them first.</p>
              <button
                type="button"
                onClick={() => reset(() => setCopilot(false))}
                className="mt-2 text-[12px] text-accent-text underline-offset-4 hover:underline"
              >
                Undo
              </button>
            </>
          ) : (
            <>
              <p className="text-[13px] text-secondary">Describe a change in plain words. The copilot drafts the steps.</p>
              <button
                type="button"
                onClick={() => reset(() => setCopilot(true))}
                className="mt-2 rounded-full px-3 py-1 text-[12px] text-fg ring-1 ring-inset ring-white/15 hover:ring-accent/60"
              >
                Try: remind me after 3 days
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Line and arrow between two nodes. Turns blue once the run has passed it. */
function Connector({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-6 items-center justify-center transition-colors duration-300 lg:h-auto",
        active ? "text-accent-text" : "text-white/25",
      )}
    >
      <ArrowDown className="size-4 lg:hidden" />
      <span className="hidden h-px flex-1 bg-current lg:block" />
      <ArrowRight className="hidden size-4 shrink-0 lg:block" />
    </div>
  );
}

function Node({
  icon: Icon,
  kind,
  title,
  detail,
  status,
  children,
}: {
  icon: typeof Zap;
  kind: string;
  title: string;
  detail: string;
  status: Status;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-[border-color,background-color] duration-300",
        status === "running" ? "border-accent bg-accent/[0.08]" : status === "done" ? "border-success/40 bg-success/[0.04]" : "border-white/[0.08] bg-elevated",
      )}
    >
      <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
        <span className="flex items-center gap-1.5">
          <Icon className="size-3 text-accent-text" aria-hidden /> {kind}
        </span>
        {status === "done" ? <Check className="size-3.5 text-success-text" aria-label="Done" /> : null}
      </p>
      <p className="mt-1.5 text-[14px] font-medium">{title}</p>
      <p className="text-[12px] text-secondary">{detail}</p>
      {children}
    </div>
  );
}

function ActionRow({ label, status, draft }: { label: string; status: Status; draft?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[13px] transition-[border-color,background-color,opacity] duration-300",
        status === "running" && "border-accent bg-accent/[0.08]",
        status === "done" && "border-success/40 bg-success/[0.04]",
        status === "skipped" && "border-white/[0.04] opacity-50",
        (status === "idle" || status === "queued") && "border-white/[0.07] bg-elevated",
      )}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {draft ? <span className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[10px] text-secondary">DRAFT</span> : null}
      {status === "done" ? <Check className="size-3.5 shrink-0 text-success-text" aria-label="Done" /> : null}
      {status === "running" ? <CircleDot className="size-3.5 shrink-0 text-accent-text" aria-label="Running" /> : null}
      {status === "skipped" ? <span className="shrink-0 font-mono text-[10px] text-subtle">SKIPPED</span> : null}
    </div>
  );
}
