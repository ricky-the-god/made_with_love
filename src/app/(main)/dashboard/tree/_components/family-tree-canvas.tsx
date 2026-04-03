"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Minus, Plus, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

import { BookOpenModal } from "./book-open-modal";

// ── Cover colour palette (deterministic from member id) ────────────────────
const COVER_COLORS = [
  { bg: "bg-amber-800", spine: "bg-amber-900" },
  { bg: "bg-red-800", spine: "bg-red-900" },
  { bg: "bg-stone-600", spine: "bg-stone-700" },
  { bg: "bg-yellow-800", spine: "bg-yellow-900" },
  { bg: "bg-rose-700", spine: "bg-rose-800" },
  { bg: "bg-teal-800", spine: "bg-teal-900" },
] as const;

const MEMORIAL_COLOR = { bg: "bg-stone-400", spine: "bg-stone-500" } as const;

function coverColor(member: FamilyMember) {
  if (member.is_memorial) return MEMORIAL_COLOR;
  const code = member.id.charCodeAt(0) + member.id.charCodeAt(member.id.length - 1);
  return COVER_COLORS[code % COVER_COLORS.length];
}

// ── Types ──────────────────────────────────────────────────────────────────
interface GenRow {
  label: string;
  members: FamilyMember[];
}

interface FamilyTreeCanvasProps {
  rows: GenRow[];
  members: FamilyMember[];
  recipeCountByMember: Record<string, number>;
  recipesByMember: Record<string, { id: string; title: string; is_favorite: boolean }[]>;
}

// ── Component ──────────────────────────────────────────────────────────────
export function FamilyTreeCanvas({ rows, members, recipeCountByMember, recipesByMember }: FamilyTreeCanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [connectors, setConnectors] = useState<string[]>([]);
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });

  const dragRef = useRef<{
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
  } | null>(null);

  // ── Connector paths: one bezier per member → their specific parent ─────────
  const computeConnectors = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const paths: string[] = [];

    // Build position map from rendered node elements
    const nodePos = new Map<string, { cx: number; yTop: number; yBottom: number }>();
    for (const [id, el] of nodeRefs.current) {
      nodePos.set(id, {
        cx: el.offsetLeft + el.offsetWidth / 2,
        yTop: el.offsetTop,
        yBottom: el.offsetTop + el.offsetHeight,
      });
    }

    // Draw one bezier per member → each of their parents (ignores unlinked members)
    for (const member of members) {
      if (!member.parent_ids?.length) continue;
      const child = nodePos.get(member.id);
      if (!child) continue;

      for (const parentId of member.parent_ids) {
        const parent = nodePos.get(parentId);
        if (!parent) continue;

        const midY = (parent.yBottom + child.yTop) / 2;
        paths.push(
          `M ${parent.cx} ${parent.yBottom} C ${parent.cx} ${midY} ${child.cx} ${midY} ${child.cx} ${child.yTop}`,
        );
      }
    }

    setSvgDims({ w: content.scrollWidth, h: content.scrollHeight });
    setConnectors(paths);
  }, [members]);

  useEffect(() => {
    computeConnectors();
    const observer = new ResizeObserver(computeConnectors);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [computeConnectors]);

  // ── Non-passive wheel zoom ────────────────────────────────────────────────
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) => Math.min(2, Math.max(0.4, s * (e.deltaY > 0 ? 0.92 : 1.08))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // ── Pan ───────────────────────────────────────────────────────────────────
  function handleMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startTx: tx, startTy: ty };
    setIsDragging(true);
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    setTx(dragRef.current.startTx + e.clientX - dragRef.current.startX);
    setTy(dragRef.current.startTy + e.clientY - dragRef.current.startY);
  }
  function stopDrag() {
    dragRef.current = null;
    setIsDragging(false);
  }

  // ── Node click → book modal ────────────────────────────────────────────────
  function handleNodeClick(member: FamilyMember) {
    setSelected(member);
  }

  return (
    <section
      ref={outerRef}
      aria-label="Family tree canvas"
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#f0ece3] dark:bg-stone-950",
        isDragging ? "cursor-grabbing select-none" : "cursor-grab",
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onClick={() => {
        // Clicks on the canvas (not on a node) don't need to dismiss — modal handles its own backdrop
      }}
      onKeyDown={() => {
        // Keyboard dismiss is handled inside BookOpenModal
      }}
    >
      {/* ── Transform container (pan + zoom) ────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative min-w-max"
        style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "0 0" }}
      >
        {/* SVG connector lines (inside transform — scales with content) */}
        {connectors.length > 0 && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0"
            width={svgDims.w}
            height={svgDims.h}
          >
            {connectors.map((d, i) => (
              <path
                // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                key={i}
                d={d}
                fill="none"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-amber-400/40 dark:stroke-amber-700/50"
              />
            ))}
          </svg>
        )}

        {/* Generation rows */}
        <div className="flex flex-col items-center gap-16 px-16 py-10">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col items-center gap-5">
              {/* Generation label pill */}
              <span className="rounded-full border border-amber-200/70 bg-white/60 px-3 py-0.5 font-semibold text-[10px] text-amber-700 uppercase tracking-widest dark:border-amber-800/30 dark:bg-stone-900/60 dark:text-amber-400">
                {row.label}
              </span>

              {/* Member cookbook nodes */}
              <div className="flex items-end gap-10">
                {row.members.map((member) => {
                  const count = recipeCountByMember[member.id] ?? 0;
                  const colors = coverColor(member);
                  const isSelected = selected?.id === member.id;

                  return (
                    <button
                      key={member.id}
                      data-node
                      type="button"
                      ref={(el) => {
                        if (el) nodeRefs.current.set(member.id, el);
                        else nodeRefs.current.delete(member.id);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeClick(member);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2.5 transition-transform duration-150 focus:outline-none",
                        isSelected && "scale-105",
                      )}
                    >
                      {/* ── Cookbook shape ──────────────────────────────── */}
                      <div
                        className={cn(
                          "flex h-40 w-24 overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl",
                          isSelected &&
                            "ring-2 ring-amber-400 ring-offset-2 ring-offset-[#f0ece3] dark:ring-offset-stone-950",
                        )}
                      >
                        {/* Spine */}
                        <div className={cn("w-3 shrink-0", colors.spine)} />

                        {/* Cover */}
                        <div className={cn("flex flex-1 flex-col justify-between p-2", colors.bg)}>
                          <p className="text-[7px] text-white/40 uppercase leading-none tracking-widest">
                            Made with Love
                          </p>
                          <p className="line-clamp-3 font-semibold text-[11px] text-white leading-tight">
                            {member.name}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {count > 0 && (
                              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[7px] text-white">
                                {count} {count === 1 ? "recipe" : "recipes"}
                              </span>
                            )}
                            {member.is_memorial && (
                              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[7px] text-white">
                                In memory
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Name label pill below cookbook */}
                      <div className="max-w-[100px] rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm dark:bg-stone-900/80">
                        <p className="truncate text-center font-semibold text-[10px] text-stone-700 uppercase tracking-wide dark:text-stone-300">
                          {member.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Book-open modal (fixed, centered, covers viewport) ─────────── */}
      {selected && (
        <BookOpenModal
          member={selected}
          recipes={recipesByMember[selected.id] ?? []}
          coverColors={coverColor(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── Zoom controls (bottom-left) ────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-white/90 shadow-sm hover:bg-white dark:bg-stone-900/90 dark:hover:bg-stone-800"
          onClick={() => setScale((s) => Math.min(2, +(s + 0.15).toFixed(2)))}
        >
          <Plus className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-white/90 shadow-sm hover:bg-white dark:bg-stone-900/90 dark:hover:bg-stone-800"
          onClick={() => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)))}
        >
          <Minus className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-white/90 shadow-sm hover:bg-white dark:bg-stone-900/90 dark:hover:bg-stone-800"
          onClick={() => {
            setScale(1);
            setTx(0);
            setTy(0);
            setSelected(null);
          }}
        >
          <ScanLine className="size-3.5" />
        </Button>
      </div>
    </section>
  );
}
