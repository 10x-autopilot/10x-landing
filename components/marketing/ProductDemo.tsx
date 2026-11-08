"use client";

/**
 * Chapter 05. One product window, six interactive demonstrations.
 * Every screen is a simulation with made-up data and says so. Nothing here calls a real service.
 * Capabilities shown match the verified feature list: the AI drafts, people send, no auto-booking.
 */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { GitBranch, Globe, Inbox, Layers, CalendarClock, SquareKanban, type LucideIcon } from "lucide-react";
import { track } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/scroll";
import { sectionIds } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";
import { InboxDemo } from "./demo/InboxDemo";
import { PipelineDemo } from "./demo/PipelineDemo";
import { SocialDemo } from "./demo/SocialDemo";
import { TogetherDemo, type TabKey } from "./demo/TogetherDemo";
import { WebsiteDemo } from "./demo/WebsiteDemo";
import { WorkflowDemo } from "./demo/WorkflowDemo";

const tabs: readonly { key: TabKey; name: string; line: string; icon: LucideIcon }[] = [
  { key: "workflow", name: "Workflows", line: "One trigger, a condition, many actions.", icon: GitBranch },
  { key: "pipeline", name: "Leads and pipeline", line: "Every lead has a stage and a next step.", icon: SquareKanban },
  { key: "inbox", name: "WhatsApp inbox", line: "Aisyah drafts. You approve and send.", icon: Inbox },
  { key: "website", name: "Website builder", line: "Arrange blocks, then publish.", icon: Globe },
  { key: "social", name: "Social posts", line: "Draft, schedule and manage.", icon: CalendarClock },
  { key: "together", name: "Working together", line: "How the tools hand off to each other.", icon: Layers },
];

export function ProductDemo() {
  const [active, setActive] = useState<TabKey>("workflow");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = tabs.find((t) => t.key === active)!;
  const listRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  /** Edge fade on the tab strip (tablet and mobile) shows when more tabs sit off-screen. */
  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdge({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);
  const fade = (l: boolean, r: boolean) =>
    `linear-gradient(to right, ${l ? "transparent 0, #000 36px" : "#000 0"}, ${r ? "#000 calc(100% - 36px), transparent 100%" : "#000 100%"})`;

  const select = (key: TabKey, focusIndex?: number) => {
    if (key !== active) track("product_feature_selected", { feature: key });
    setActive(key);
    if (focusIndex !== undefined) refs.current[focusIndex]?.focus();
    const idx = tabs.findIndex((t) => t.key === key);
    refs.current[idx]?.scrollIntoView({ inline: "center", block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(tabs[next]!.key, next);
    }
  };

  return (
    <section id={sectionIds.product} data-chapter aria-labelledby="product-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="05"
          label="Inside the product"
          id="product-title"
          title="Try the work yourself."
          lead="Click through each tool. The screens use made-up data, so you can break things."
        />

        <Reveal className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <div
            ref={listRef}
            onScroll={measure}
            role="tablist"
            aria-orientation="vertical"
            aria-label="Product demos"
            style={{ ["--fade" as string]: fade(edge.left, edge.right) }}
            className="-mx-5 flex gap-2 overflow-x-auto scrollbar-none px-5 pb-1 [mask-image:var(--fade)] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:[mask-image:none]"
          >
            {tabs.map((t, i) => {
              const selected = t.key === active;
              return (
                <button
                  key={t.key}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  role="tab"
                  id={`demo-tab-${t.key}`}
                  aria-selected={selected}
                  aria-controls="demo-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(t.key)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "flex shrink-0 items-start gap-3 rounded-xl px-4 py-3 text-left transition-[background-color,box-shadow,opacity] duration-300",
                    selected ? "halo bg-accent/[0.07]" : "opacity-70 ring-1 ring-inset ring-white/[0.06] hover:opacity-100 lg:ring-0",
                  )}
                >
                  <t.icon className={cn("mt-0.5 size-4 shrink-0", selected ? "text-accent-text" : "text-secondary")} aria-hidden />
                  <span>
                    <span className="block whitespace-nowrap text-[15px] font-medium">{t.name}</span>
                    <span className="hidden text-[14px] text-secondary lg:block">{t.line}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="demo-panel"
            aria-labelledby={`demo-tab-${active}`}
            tabIndex={0}
            className="halo-soft min-w-0 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0d0d0e] focus-visible:outline-offset-4"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#111112] px-5 py-2.5">
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-fg">{current.name}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Demonstration</span>
            </div>
            <p className="px-5 pt-4 text-[15px] text-secondary lg:hidden">{current.line}</p>
            {/* On desktop all demos share one grid cell, so the panel is as tall as the tallest and never jumps.
                Below lg only the active demo shows, so short demos do not inherit the tall one's height. */}
            <div className="p-4 sm:p-6 lg:grid">
              {tabs.map((t) => {
                const on = t.key === active;
                return (
                  <div
                    key={t.key}
                    inert={!on}
                    className={cn(on ? "block" : "hidden lg:block lg:invisible", "min-w-0 lg:col-start-1 lg:row-start-1")}
                  >
                    {t.key === "workflow" ? <WorkflowDemo /> : null}
                    {t.key === "pipeline" ? <PipelineDemo /> : null}
                    {t.key === "inbox" ? <InboxDemo /> : null}
                    {t.key === "website" ? <WebsiteDemo /> : null}
                    {t.key === "social" ? <SocialDemo /> : null}
                    {t.key === "together" ? <TogetherDemo isActive={on} onGo={(k) => select(k)} /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-6 text-center text-[14px] text-secondary">
            Simulated screens with made-up data. Which accounts you can connect depends on your setup.{" "}
            <a href={`#${sectionIds.audit}`} className="text-accent-text underline-offset-4 hover:underline">
              Ask our sales team
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
