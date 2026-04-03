"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Heart, Minus, Plus, ScanLine, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

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
  recipeCountByMember: Record<string, number>;
}

// ── Component ──────────────────────────────────────────────────────────────
export function FamilyTreeCanvas({ rows, recipeCountByMember }: FamilyTreeCanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<{
    member: FamilyMember;
    px: number;
    py: number;
  } | null>(null);
  const [connectors, setConnectors] = useState<string[]>([]);
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });

  const dragRef = useRef<{
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
  } | null>(null);

  // ── Connector paths (layout-space coordinates via offsetLeft/offsetTop) ──
  const computeConnectors = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const paths: string[] = [];

    for (let i = 0; i < rows.length - 1; i++) {
      const parentRow = rows[i];
      const childRow = rows[i + 1];

      const parentNodes = parentRow.members
        .map((m) => {
          const el = nodeRefs.current.get(m.id);
          if (!el) return null;
          return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight };
        })
        .filter(Boolean) as { x: number; y: number }[];

      const childNodes = childRow.members
        .map((m) => {
          const el = nodeRefs.current.get(m.id);
          if (!el) return null;
          return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop };
        })
        .filter(Boolean) as { x: number; y: number }[];

      if (parentNodes.length === 0 || childNodes.length === 0) continue;

      const topOfGap = Math.max(...parentNodes.map((n) => n.y));
      const bottomOfGap = Math.min(...childNodes.map((n) => n.y));
      const midY = (topOfGap + bottomOfGap) / 2;

      const parentMinX = Math.min(...parentNodes.map((n) => n.x));
      const parentMaxX = Math.max(...parentNodes.map((n) => n.x));
      const childMinX = Math.min(...childNodes.map((n) => n.x));
      const childMaxX = Math.max(...childNodes.map((n) => n.x));
      const trunkX = parentNodes.length === 1 ? parentNodes[0].x : (parentMinX + parentMaxX) / 2;
      const childTrunkX = childNodes.length === 1 ? childNodes[0].x : (childMinX + childMaxX) / 2;
      const upperBarY = topOfGap + (midY - topOfGap) * 0.4;
      const lowerBarY = midY + (bottomOfGap - midY) * 0.6;

      for (const pn of parentNodes) {
        paths.push(`M ${pn.x} ${pn.y} L ${pn.x} ${upperBarY}`);
      }
      if (parentNodes.length > 1) {
        paths.push(`M ${parentMinX} ${upperBarY} L ${parentMaxX} ${upperBarY}`);
      }
      // Cubic bezier for the organic trunk curve
      paths.push(`M ${trunkX} ${upperBarY} C ${trunkX} ${midY} ${childTrunkX} ${midY} ${childTrunkX} ${lowerBarY}`);
      if (childNodes.length > 1) {
        paths.push(`M ${childMinX} ${lowerBarY} L ${childMaxX} ${lowerBarY}`);
      }
      for (const cn of childNodes) {
        paths.push(`M ${cn.x} ${lowerBarY} L ${cn.x} ${cn.y}`);
      }
    }

    setSvgDims({ w: content.scrollWidth, h: content.scrollHeight });
    setConnectors(paths);
  }, [rows]);

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

  // ── Node click → popup ────────────────────────────────────────────────────
  function handleNodeClick(member: FamilyMember, el: HTMLButtonElement) {
    const outer = outerRef.current;
    if (!outer) return;
    const outerRect = outer.getBoundingClientRect();
    const nodeRect = el.getBoundingClientRect();
    const popupW = 264;
    const rawPx = nodeRect.right - outerRect.left + 14;
    const px = Math.min(rawPx, outer.offsetWidth - popupW - 8);
    const py = Math.max(8, nodeRect.top - outerRect.top);
    setSelected({ member, px, py });
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
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-popup]")) setSelected(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setSelected(null);
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
                  const isSelected = selected?.member.id === member.id;

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
                        handleNodeClick(member, e.currentTarget);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2.5 transition-transform duration-150 focus:outline-none",
                        isSelected && "scale-105",
                      )}
                    >
                      {/* ── Cookbook shape ──────────────────────────────── */}
                      <div
                        className={cn(
                          "flex h-28 w-20 overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl",
                          isSelected &&
                            "ring-2 ring-amber-400 ring-offset-2 ring-offset-[#f0ece3] dark:ring-offset-stone-950",
                        )}
                      >
                        {/* Spine */}
                        <div className={cn("w-2.5 shrink-0", colors.spine)} />

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
                      <div className="max-w-[90px] rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm dark:bg-stone-900/80">
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

      {/* ── Popup card (in outer container space, unaffected by transform) ── */}
      {selected && (
        <div
          data-popup
          role="dialog"
          aria-modal="false"
          aria-label={`${selected.member.name} profile`}
          className="absolute z-20 w-64 rounded-2xl border border-stone-100 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900"
          style={{ left: selected.px, top: selected.py }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="relative p-5">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="size-3.5" />
            </button>

            <h3 className="pr-5 font-bold text-amber-800 text-lg leading-tight dark:text-amber-300">
              {selected.member.name}
            </h3>

            {(selected.member.relation || selected.member.country_of_origin) && (
              <p className="mt-1 text-muted-foreground text-xs capitalize">
                {[selected.member.relation, selected.member.country_of_origin].filter(Boolean).join(" · ")}
              </p>
            )}

            {selected.member.bio && (
              <p className="mt-3 line-clamp-3 text-muted-foreground text-sm italic leading-relaxed">
                {selected.member.bio}
              </p>
            )}

            {(recipeCountByMember[selected.member.id] ?? 0) > 0 && (
              <p className="mt-2 text-amber-600 text-xs dark:text-amber-400">
                {recipeCountByMember[selected.member.id]}{" "}
                {recipeCountByMember[selected.member.id] === 1 ? "recipe" : "recipes"} preserved
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <a
                href={`/dashboard/tree/member/${selected.member.id}`}
                className="flex-1 rounded-lg bg-amber-700 px-3 py-2 text-center font-medium text-sm text-white transition-colors hover:bg-amber-800"
              >
                View Story
              </a>
              <button
                type="button"
                className="rounded-lg border border-stone-200 p-2 text-muted-foreground transition-colors hover:text-rose-500 dark:border-stone-700"
              >
                <Heart className="size-4" />
              </button>
            </div>
          </div>
        </div>
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
