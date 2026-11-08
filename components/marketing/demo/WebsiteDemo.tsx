"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const library = [
  { key: "hero", name: "Headline", hint: "Big title and one button" },
  { key: "form", name: "Enquiry form", hint: "Name, phone, message" },
  { key: "booking", name: "Booking calendar", hint: "Pick a free slot" },
  { key: "proof", name: "Customer quote", hint: "One real quote" },
  { key: "prices", name: "Price list", hint: "Three simple rows" },
] as const;
type Key = (typeof library)[number]["key"];
type Block = { id: number; key: Key };

export function WebsiteDemo() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, key: "hero" },
    { id: 2, key: "form" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [published, setPublished] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragLib, setDragLib] = useState<Key | null>(null);

  const edit = (fn: (b: Block[]) => Block[]) => {
    setBlocks(fn);
    setPublished(false);
  };
  const add = (key: Key) => {
    edit((b) => [...b, { id: nextId, key }]);
    setNextId((n) => n + 1);
  };
  const shift = (i: number, d: -1 | 1) =>
    edit((b) => {
      const j = i + d;
      if (j < 0 || j >= b.length) return b;
      const c = [...b];
      [c[i], c[j]] = [c[j]!, c[i]!];
      return c;
    });
  const dropOn = (targetId: number) => {
    if (dragId === null || dragId === targetId) return;
    edit((b) => {
      const from = b.findIndex((x) => x.id === dragId);
      const to = b.findIndex((x) => x.id === targetId);
      const c = [...b];
      const [item] = c.splice(from, 1);
      c.splice(to, 0, item!);
      return c;
    });
    setDragId(null);
  };

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Blocks</p>
        <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
          {library.map((b) => (
            <li key={b.key}>
              <button
                type="button"
                draggable
                onDragStart={() => setDragLib(b.key)}
                onDragEnd={() => setDragLib(null)}
                onClick={() => add(b.key)}
                className="flex w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-elevated px-2.5 py-2 text-left hover:border-accent/50"
              >
                <Plus className="size-3.5 shrink-0 text-accent-text" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate text-[13px]">{b.name}</span>
                  <span className="hidden truncate text-[11px] text-subtle lg:block">{b.hint}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-col rounded-xl border border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
          <p className="min-w-0 flex-1 truncate text-[12px] text-subtle">Your page · drag blocks to reorder</p>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[10px]",
              published ? "bg-success/15 text-success-text" : "bg-white/[0.07] text-secondary",
            )}
          >
            {published ? "PUBLISHED" : "DRAFT"}
          </span>
          <button
            type="button"
            onClick={() => setPublished(true)}
            disabled={published || blocks.length === 0}
            className="rounded-full bg-accent px-3 py-1 text-[12px] font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-40"
          >
            Publish
          </button>
        </div>
        <ul className="flex flex-col gap-1.5 p-3" aria-live="polite">
          {blocks.map((b, i) => {
            const def = library.find((l) => l.key === b.key)!;
            return (
              <li
                key={b.id}
                draggable
                onDragStart={() => setDragId(b.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropOn(b.id)}
                onDragEnd={() => setDragId(null)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border bg-elevated px-2.5 py-2.5 transition-opacity",
                  dragId === b.id ? "border-accent opacity-50" : "border-white/[0.08]",
                )}
              >
                <GripVertical className="size-4 shrink-0 cursor-grab text-subtle" aria-hidden />
                <BlockPreview k={b.key} name={def.name} />
                <div className="flex shrink-0 gap-0.5">
                  <IconBtn label={`Move ${def.name} up`} onClick={() => shift(i, -1)} disabled={i === 0}>
                    <ArrowUp className="size-3.5" />
                  </IconBtn>
                  <IconBtn label={`Move ${def.name} down`} onClick={() => shift(i, 1)} disabled={i === blocks.length - 1}>
                    <ArrowDown className="size-3.5" />
                  </IconBtn>
                  <IconBtn label={`Remove ${def.name}`} onClick={() => edit((x) => x.filter((y) => y.id !== b.id))}>
                    <X className="size-3.5" />
                  </IconBtn>
                </div>
              </li>
            );
          })}
        </ul>
        <div
          onDragOver={(e) => dragLib && e.preventDefault()}
          onDrop={() => {
            if (dragLib) add(dragLib);
            setDragLib(null);
          }}
          className={cn(
            "mx-3 mb-3 flex min-h-[72px] flex-1 items-center justify-center rounded-lg border border-dashed px-3 text-center text-[12px] transition-colors",
            dragLib ? "border-accent bg-accent/[0.06] text-fg" : "border-white/[0.1] text-subtle",
          )}
        >
          {blocks.length === 0 ? "Your page is empty. Add a block." : "Drop a block here, or tap one on the left."}
        </div>
        <p className="border-t border-white/[0.06] px-3 py-2 text-[11px] text-subtle">
          Forms on the page feed straight into your leads.
        </p>
      </div>
    </div>
  );
}

function BlockPreview({ k, name }: { k: Key; name: string }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-medium">{name}</p>
      <div className="mt-1.5 flex gap-1" aria-hidden>
        {k === "hero" ? (
          <>
            <span className="h-2 w-2/5 rounded bg-white/25" />
            <span className="h-2 w-6 rounded bg-accent/70" />
          </>
        ) : k === "form" ? (
          <>
            <span className="h-2 w-1/4 rounded bg-white/10" />
            <span className="h-2 w-1/4 rounded bg-white/10" />
            <span className="h-2 w-6 rounded bg-accent/70" />
          </>
        ) : k === "booking" ? (
          <>
            {[0, 1, 2, 3, 4].map((n) => (
              <span key={n} className={cn("h-2 w-4 rounded", n === 2 ? "bg-success/70" : "bg-white/10")} />
            ))}
          </>
        ) : k === "proof" ? (
          <span className="h-2 w-3/5 rounded bg-white/15" />
        ) : (
          <>
            <span className="h-2 w-1/5 rounded bg-white/15" />
            <span className="h-2 w-1/5 rounded bg-white/15" />
            <span className="h-2 w-1/5 rounded bg-white/15" />
          </>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-7 items-center justify-center rounded-md text-secondary hover:bg-white/[0.07] hover:text-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}
