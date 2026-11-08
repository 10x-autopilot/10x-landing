"use client";

import { useState } from "react";
import { CalendarClock, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  "Open this Saturday. Book a slot and we keep it for you.",
  "Three questions we hear every week, answered in one post.",
  "A look at how we prepare before your visit.",
];
const times = ["Today 7:00 PM", "Tomorrow 9:00 AM", "Sat 10:00 AM"];
const channels = ["Facebook", "Instagram"] as const;

type Post = { id: number; text: string; when: string; on: string; paused: boolean };

export function SocialDemo() {
  const [caption, setCaption] = useState("");
  const [drafted, setDrafted] = useState(false);
  const [time, setTime] = useState(times[1]!);
  const [on, setOn] = useState<Record<string, boolean>>({ Facebook: true, Instagram: true });
  const [queue, setQueue] = useState<Post[]>([
    { id: 1, text: "New price list is in.", when: "Mon 9:00 AM", on: "Facebook", paused: false },
    { id: 2, text: "Meet the team behind the desk.", when: "Wed 7:00 PM", on: "Instagram", paused: false },
  ]);
  const [nextId, setNextId] = useState(3);

  const chosen = channels.filter((c) => on[c]);
  const canSchedule = caption.trim().length > 0 && chosen.length > 0;

  const schedule = () => {
    setQueue((q) => [...q, { id: nextId, text: caption.trim(), when: time, on: chosen.join(" + "), paused: false }]);
    setNextId((n) => n + 1);
    setCaption("");
    setDrafted(false);
  };

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
        <div className="flex items-center justify-between">
          <label htmlFor="demo-caption" className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
            New post
          </label>
          <button
            type="button"
            onClick={() => setDrafted(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] text-fg ring-1 ring-inset ring-white/15 hover:ring-accent/60"
          >
            <Sparkles className="size-3 text-accent-text" aria-hidden /> Draft 3 options
          </button>
        </div>
        {drafted ? (
          <ul className="space-y-1.5">
            {options.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => setCaption(o)}
                  className={cn(
                    "w-full rounded-lg border px-2.5 py-2 text-left text-[13px]",
                    caption === o ? "border-accent bg-accent/[0.08]" : "border-white/[0.07] hover:border-white/20",
                  )}
                >
                  {o}
                </button>
              </li>
            ))}
            <li className="text-[11px] text-subtle">Drafts are suggestions. You pick one and approve it.</li>
          </ul>
        ) : null}
        <textarea
          id="demo-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          placeholder="Write a caption, or draft options above."
          className="min-h-[84px] w-full flex-1 resize-none rounded-lg border border-white/[0.08] bg-elevated px-3 py-2 text-[13px] outline-none placeholder:text-subtle focus-visible:border-accent"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          {channels.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={on[c]}
              onClick={() => setOn((s) => ({ ...s, [c]: !s[c] }))}
              className={cn(
                "rounded-full px-2.5 py-1 text-[12px] ring-1 ring-inset",
                on[c] ? "bg-accent/15 text-fg ring-accent/50" : "text-secondary ring-white/10",
              )}
            >
              {c}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />
          {times.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={time === t}
              onClick={() => setTime(t)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[12px] ring-1 ring-inset",
                time === t ? "bg-white/[0.1] text-fg ring-white/30" : "text-secondary ring-white/10",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={schedule}
          disabled={!canSchedule}
          className="self-start rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-40"
        >
          Schedule post
        </button>
      </div>

      <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5" aria-live="polite">
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
          <CalendarClock className="size-3" aria-hidden /> Queue
        </p>
        <ul className="space-y-1.5">
          {queue.map((p) => (
            <li key={p.id} className="rounded-lg border border-white/[0.07] bg-elevated p-2">
              <p className="truncate text-[13px]">{p.text}</p>
              <p className="mt-0.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 font-mono text-[10px] text-subtle">
                <span>
                  {p.when} · {p.on}
                </span>
                <button
                  type="button"
                  onClick={() => setQueue((q) => q.map((x) => (x.id === p.id ? { ...x, paused: !x.paused } : x)))}
                  className={cn("shrink-0 underline-offset-4 hover:underline", p.paused ? "text-warning-text" : "text-success-text")}
                >
                  {p.paused ? "Paused" : (
                    <span className="inline-flex items-center gap-1">
                      <Check className="size-3" aria-hidden /> Scheduled
                    </span>
                  )}
                </button>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-3 text-[11px] text-subtle">Which channels you can connect depends on your setup.</p>
      </div>
    </div>
  );
}
