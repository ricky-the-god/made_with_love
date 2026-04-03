"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { FamilyMember } from "@/lib/supabase/types";
import { cn, getInitials } from "@/lib/utils";

const _GENERATION_LABELS: Record<number, string> = {
  1: "Great-grandparents",
  2: "Grandparents",
  3: "Parents",
  4: "My Generation",
  5: "Children",
};

interface GenRow {
  label: string;
  members: FamilyMember[];
}

interface FamilyTreeCanvasProps {
  rows: GenRow[];
  recipeCountByMember: Record<string, number>;
}

interface Connector {
  // From parent node center bottom → focal mid point → child node center top
  // We store polyline points as [x,y] pairs
  points: [number, number][];
}

export function FamilyTreeCanvas({ rows, recipeCountByMember }: FamilyTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });

  const computeConnectors = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cr = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const newConnectors: Connector[] = [];

    for (let i = 0; i < rows.length - 1; i++) {
      const parentRow = rows[i];
      const childRow = rows[i + 1];

      // Gather positions relative to container (accounting for scroll)
      const parentNodes = parentRow.members
        .map((m) => {
          const el = nodeRefs.current.get(m.id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left - cr.left + scrollLeft + r.width / 2,
            y: r.bottom - cr.top + scrollTop,
          };
        })
        .filter(Boolean) as { x: number; y: number }[];

      const childNodes = childRow.members
        .map((m) => {
          const el = nodeRefs.current.get(m.id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left - cr.left + scrollLeft + r.width / 2,
            y: r.top - cr.top + scrollTop,
          };
        })
        .filter(Boolean) as { x: number; y: number }[];

      if (parentNodes.length === 0 || childNodes.length === 0) continue;

      // Midpoint Y in the gap between the two generations
      const topOfGap = Math.max(...parentNodes.map((n) => n.y));
      const bottomOfGap = Math.min(...childNodes.map((n) => n.y));
      const midY = (topOfGap + bottomOfGap) / 2;

      // Focal X = average of all involved nodes
      const allX = [...parentNodes.map((n) => n.x), ...childNodes.map((n) => n.x)];
      const focalX = allX.reduce((a, b) => a + b, 0) / allX.length;

      // Horizontal bars
      const parentMinX = Math.min(...parentNodes.map((n) => n.x));
      const parentMaxX = Math.max(...parentNodes.map((n) => n.x));
      const childMinX = Math.min(...childNodes.map((n) => n.x));
      const childMaxX = Math.max(...childNodes.map((n) => n.x));

      const upperBarY = topOfGap + (midY - topOfGap) * 0.5;
      const lowerBarY = midY + (bottomOfGap - midY) * 0.5;

      // Parent nodes → upper bar
      for (const pn of parentNodes) {
        newConnectors.push({
          points: [
            [pn.x, pn.y],
            [pn.x, upperBarY],
          ],
        });
      }

      // Upper horizontal bar
      if (parentNodes.length > 1) {
        newConnectors.push({
          points: [
            [parentMinX, upperBarY],
            [parentMaxX, upperBarY],
          ],
        });
      }

      // Upper bar mid → lower bar mid (trunk)
      const trunkX = parentNodes.length === 1 ? parentNodes[0].x : (parentMinX + parentMaxX) / 2;
      newConnectors.push({
        points: [
          [trunkX, upperBarY],
          [focalX, midY],
          [(childMinX + childMaxX) / 2, lowerBarY],
        ],
      });

      // Lower horizontal bar
      if (childNodes.length > 1) {
        newConnectors.push({
          points: [
            [childMinX, lowerBarY],
            [childMaxX, lowerBarY],
          ],
        });
      }

      // Lower bar → child nodes
      for (const cn of childNodes) {
        newConnectors.push({
          points: [
            [cn.x, lowerBarY],
            [cn.x, cn.y],
          ],
        });
      }
    }

    setSvgDims({ w: container.scrollWidth, h: container.scrollHeight });
    setConnectors(newConnectors);
  }, [rows]);

  useEffect(() => {
    computeConnectors();
    const observer = new ResizeObserver(computeConnectors);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeConnectors]);

  return (
    <div ref={containerRef} className="relative overflow-x-auto">
      {/* SVG connector lines — rendered behind nodes */}
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative connector lines, aria-hidden */}
      {connectors.length > 0 && (
        <svg
          className="pointer-events-none absolute top-0 left-0"
          width={svgDims.w}
          height={svgDims.h}
          aria-hidden="true"
          role="presentation"
        >
          {connectors.map((c, i) => (
            <polyline
              key={i}
              points={c.points.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-300 dark:text-amber-800"
            />
          ))}
        </svg>
      )}

      {/* Tree rows */}
      <div className="flex min-w-max flex-col items-center gap-12 px-10 py-6">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col items-center gap-3">
            {/* Generation label pill */}
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 font-semibold text-[11px] text-amber-700 uppercase tracking-widest dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400">
              {row.label}
            </span>

            {/* Member nodes */}
            <div className="flex items-start gap-6">
              {row.members.map((member) => {
                const count = recipeCountByMember[member.id] ?? 0;
                return (
                  <a
                    key={member.id}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(member.id, el);
                      else nodeRefs.current.delete(member.id);
                    }}
                    href={`/dashboard/tree/member/${member.id}`}
                    className="group flex w-24 flex-col items-center gap-2 text-center"
                  >
                    {/* Avatar circle */}
                    <div
                      className={cn(
                        "flex size-16 items-center justify-center overflow-hidden rounded-full font-semibold text-lg ring-2 ring-transparent transition-all group-hover:ring-amber-400 group-hover:ring-offset-2 dark:group-hover:ring-offset-background",
                        member.is_memorial
                          ? "bg-stone-100 text-stone-400 dark:bg-stone-800/50 dark:text-stone-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                      )}
                    >
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="size-full object-cover" />
                      ) : (
                        getInitials(member.name)
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <p className="line-clamp-2 font-semibold text-foreground text-sm leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-300">
                        {member.name}
                      </p>
                      {member.relation && (
                        <p className="mt-0.5 text-muted-foreground text-xs capitalize">{member.relation}</p>
                      )}
                      {count > 0 && (
                        <p className="mt-0.5 text-amber-600 text-xs dark:text-amber-400">
                          {count} {count === 1 ? "recipe" : "recipes"}
                        </p>
                      )}
                      {member.is_memorial && <p className="mt-0.5 text-stone-400 text-xs">In memory</p>}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
