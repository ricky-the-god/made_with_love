"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Minus, Plus, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { normalizeRelationValue } from "@/lib/family-constants";
import { TREE_NAV_TUTORIAL_SEEN_KEY } from "@/lib/preferences/tutorial-keys";
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
  readOnly?: boolean;
}

type FamilyMemberWithLegacyParent = FamilyMember & { parent_id?: string | null };

function getLinkedParentIds(member: FamilyMemberWithLegacyParent) {
  if (Array.isArray(member.parent_ids) && member.parent_ids.length > 0) return member.parent_ids;
  if (member.parent_id) return [member.parent_id];
  return [];
}

// Which roles form a romantic couple — used to draw horizontal couple H-lines.
const COUPLE_ROLE_PAIRS: Record<string, string[]> = {
  husband: ["wife", "spouse", "partner", "myself"],
  wife: ["husband", "spouse", "partner", "myself"],
  spouse: ["husband", "wife", "spouse", "partner", "myself"],
  partner: ["husband", "wife", "spouse", "partner", "myself"],
  myself: ["husband", "wife", "spouse", "partner"],
  // Inferred couples from generational roles
  mother: ["father"],
  father: ["mother"],
  grandmother: ["grandfather"],
  grandfather: ["grandmother"],
  "great-grandmother": ["great-grandfather"],
  "great-grandfather": ["great-grandmother"],
};

// Maps each child-role to the expected parent-role(s) in the tree.
// This drives automatic connector inference across all generations.
const CHILD_TO_PARENT_RELATIONS: Record<string, string[]> = {
  // Youngest generation → parents
  child: ["myself", "mother", "father"],
  son: ["myself", "mother", "father"],
  daughter: ["myself", "mother", "father"],
  // The logged-in user is a child of their parents too
  myself: ["mother", "father"],
  // Siblings share the same parents as "myself"
  sister: ["mother", "father"],
  brother: ["mother", "father"],
  // Parents are also children of grandparents
  mother: ["grandfather", "grandmother"],
  father: ["grandfather", "grandmother"],
  // Aunts/uncles are siblings of parents → children of grandparents
  aunt: ["grandfather", "grandmother"],
  uncle: ["grandfather", "grandmother"],
  // Grandparents are children of great-grandparents
  grandmother: ["great-grandfather", "great-grandmother"],
  grandfather: ["great-grandfather", "great-grandmother"],
  // Great-aunts/uncles are siblings of grandparents → children of great-grandparents
  "great-aunt": ["great-grandfather", "great-grandmother"],
  "great-uncle": ["great-grandfather", "great-grandmother"],
  // Explicit grandchild roles
  granddaughter: ["grandfather", "grandmother"],
  grandson: ["grandfather", "grandmother"],
  grandchild: ["grandfather", "grandmother"],
  // Lateral / extended family
  cousin: ["uncle", "aunt"],
  nephew: ["uncle", "aunt", "brother", "sister"],
  niece: ["uncle", "aunt", "brother", "sister"],
};

function getLastName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1].toLowerCase() : "";
}

// Lower score = better parent candidate for this child.
function rankParentCandidate(child: FamilyMember, candidate: FamilyMember, expectedParentRelations: string[]) {
  const candidateRelation = normalizeRelationValue(candidate.relation) ?? "";
  const isExpectedParent = expectedParentRelations.includes(candidateRelation);
  const childLastName = getLastName(child.name);
  const sameLastName = childLastName !== "" && childLastName === getLastName(candidate.name);
  const generationGap =
    child.generation && candidate.generation ? Math.abs(candidate.generation - (child.generation - 1)) : 99;

  let score = 0;
  if (!isExpectedParent) score += 100;
  score += generationGap * 10;
  if (!sameLastName) score += 3;

  return score;
}

// Relations whose parents are outside the tree (different family origin).
// Never auto-infer parents for these.
const NO_INFER_RELATIONS = new Set(["husband", "wife", "family-friend", "mentor", "other"]);

function inferAutomaticParentIds(
  member: FamilyMember,
  membersByRelation: Map<string, FamilyMember[]>,
  membersByGeneration: Map<number, FamilyMember[]>,
) {
  const memberRelation = normalizeRelationValue(member.relation) ?? "";

  // Members who married in or are family friends have parents outside this tree.
  if (NO_INFER_RELATIONS.has(memberRelation)) return [];

  const expectedParentRelations = CHILD_TO_PARENT_RELATIONS[memberRelation] ?? [];

  if (expectedParentRelations.length > 0) {
    // Collect candidates from the precomputed relation buckets (O(1) lookups), excluding self.
    const parentCandidates = expectedParentRelations
      .flatMap((rel) => membersByRelation.get(rel) ?? [])
      .filter((candidate) => candidate.id !== member.id)
      .sort((a, b) => {
        const scoreDiff =
          rankParentCandidate(member, a, expectedParentRelations) -
          rankParentCandidate(member, b, expectedParentRelations);
        if (scoreDiff !== 0) return scoreDiff;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 2)
      .map((candidate) => candidate.id);

    if (parentCandidates.length > 0) return parentCandidates;
  }

  if (!member.generation || member.generation <= 1) return [];

  // Fallback: up to two people in the immediately older generation.
  return (membersByGeneration.get(member.generation - 1) ?? [])
    .filter((candidate) => candidate.id !== member.id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 2)
    .map((candidate) => candidate.id);
}

// ── Component ──────────────────────────────────────────────────────────────
export function FamilyTreeCanvas({
  rows,
  members,
  recipeCountByMember,
  recipesByMember,
  readOnly,
}: FamilyTreeCanvasProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [connectors, setConnectors] = useState<{ d: string; type: "child" | "couple" }[]>([]);
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });
  const [isTreeEntered, setIsTreeEntered] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
  } | null>(null);

  // ── Connector paths: smooth bezier parent-child + dashed couple lines ──────
  const computeConnectors = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const paths: { d: string; type: "child" | "couple" }[] = [];
    const drawnCoupleLines = new Set<string>();

    // Precompute lookup structures once so inferAutomaticParentIds runs in O(1) per lookup
    // instead of re-filtering the full members array on every call (avoids O(n²) work).
    const membersByRelation = new Map<string, FamilyMember[]>();
    const membersByGeneration = new Map<number, FamilyMember[]>();
    for (const m of members) {
      const rel = normalizeRelationValue(m.relation) ?? "";
      if (!membersByRelation.has(rel)) membersByRelation.set(rel, []);
      membersByRelation.get(rel)?.push(m);
      if (m.generation != null) {
        if (!membersByGeneration.has(m.generation)) membersByGeneration.set(m.generation, []);
        membersByGeneration.get(m.generation)?.push(m);
      }
    }

    // Build position map from rendered node elements
    const nodePos = new Map<string, { cx: number; yTop: number; yBottom: number }>();
    for (const [id, el] of nodeRefs.current) {
      nodePos.set(id, {
        cx: el.offsetLeft + el.offsetWidth / 2,
        yTop: el.offsetTop,
        yBottom: el.offsetTop + el.offsetHeight,
      });
    }

    for (const member of members as FamilyMemberWithLegacyParent[]) {
      const explicitParentIds = getLinkedParentIds(member);
      const parentIds = explicitParentIds.length
        ? explicitParentIds
        : inferAutomaticParentIds(member, membersByRelation, membersByGeneration);
      if (!parentIds.length) continue;
      const childPos = nodePos.get(member.id);
      if (!childPos) continue;

      if (parentIds.length >= 2) {
        const pAPos = nodePos.get(parentIds[0]);
        const pBPos = nodePos.get(parentIds[1]);
        if (!pAPos || !pBPos) continue;

        const leftCx = Math.min(pAPos.cx, pBPos.cx);
        const rightCx = Math.max(pAPos.cx, pBPos.cx);
        const coupleY = Math.max(pAPos.yBottom, pBPos.yBottom);
        const midX = (pAPos.cx + pBPos.cx) / 2;

        // Horizontal couple connector (drawn once per unique couple)
        const coupleKey = [parentIds[0], parentIds[1]].sort().join(":");
        if (!drawnCoupleLines.has(coupleKey)) {
          drawnCoupleLines.add(coupleKey);
          // Dashed couple bridge drawn at the bottom of the taller node
          paths.push({ d: `M ${leftCx} ${coupleY} H ${rightCx}`, type: "couple" });
        }

        // Smooth bezier drop from couple midpoint to child
        const elbowY = coupleY + (childPos.yTop - coupleY) / 2;
        paths.push({
          d: `M ${midX} ${coupleY} C ${midX} ${elbowY} ${childPos.cx} ${elbowY} ${childPos.cx} ${childPos.yTop}`,
          type: "child",
        });
      } else {
        const pPos = nodePos.get(parentIds[0]);
        if (!pPos) continue;
        const elbowY = pPos.yBottom + (childPos.yTop - pPos.yBottom) / 2;
        // Smooth S-curve: starts going down from parent, arrives going down at child
        paths.push({
          d: `M ${pPos.cx} ${pPos.yBottom} C ${pPos.cx} ${elbowY} ${childPos.cx} ${elbowY} ${childPos.cx} ${childPos.yTop}`,
          type: "child",
        });
      }
    }

    // ── Pass 2: explicit couple H-lines for spouse-tagged members ───────────
    for (const member of members) {
      const rel = normalizeRelationValue(member.relation) ?? "";
      const partnerRels = COUPLE_ROLE_PAIRS[rel];
      if (!partnerRels) continue;

      const memberPos = nodePos.get(member.id);
      if (!memberPos) continue;

      // Find best match: same generation, complementary role, same last name preferred.
      const partner = members
        .filter((m) => m.id !== member.id && m.generation === member.generation)
        .filter((m) => partnerRels.includes(normalizeRelationValue(m.relation) ?? ""))
        .sort((a, b) => {
          const ml = getLastName(member.name);
          return (getLastName(a.name) === ml ? 0 : 1) - (getLastName(b.name) === ml ? 0 : 1);
        })[0];

      if (!partner) continue;

      const partnerPos = nodePos.get(partner.id);
      if (!partnerPos) continue;

      const coupleKey = [member.id, partner.id].sort().join(":");
      if (drawnCoupleLines.has(coupleKey)) continue;
      drawnCoupleLines.add(coupleKey);

      const coupleY = Math.max(memberPos.yBottom, partnerPos.yBottom);
      paths.push({
        d: `M ${Math.min(memberPos.cx, partnerPos.cx)} ${coupleY} H ${Math.max(memberPos.cx, partnerPos.cx)}`,
        type: "couple",
      });
    }

    setSvgDims({ w: content.scrollWidth, h: content.scrollHeight });
    setConnectors(paths);
  }, [members]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsTreeEntered(true);
      return;
    }

    const raf = requestAnimationFrame(() => setIsTreeEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(TREE_NAV_TUTORIAL_SEEN_KEY) === "1") return;

    const timer = window.setTimeout(() => setShowTutorial(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  function dismissTutorial() {
    window.localStorage.setItem(TREE_NAV_TUTORIAL_SEEN_KEY, "1");
    setShowTutorial(false);
  }

  useEffect(() => {
    // Double-RAF ensures layout is fully settled after hydration before measuring offsets.
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(computeConnectors);
    });
    // Fallback: re-measure after fonts/images may have shifted layout.
    const timer = setTimeout(computeConnectors, 300);
    const observer = new ResizeObserver(computeConnectors);
    if (contentRef.current) observer.observe(contentRef.current);
    window.addEventListener("resize", computeConnectors);
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      clearTimeout(timer);
      window.removeEventListener("resize", computeConnectors);
      observer.disconnect();
    };
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
            width={svgDims.w || "100%"}
            height={svgDims.h || "100%"}
            style={{ overflow: "visible" }}
          >
            {connectors.map((connector, i) =>
              connector.type === "couple" ? (
                <path
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                  key={i}
                  d={connector.d}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="5 4"
                  className="stroke-rose-400/60 dark:stroke-rose-400/40"
                />
              ) : (
                <path
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                  key={i}
                  d={connector.d}
                  fill="none"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  className="stroke-amber-600/50 dark:stroke-amber-400/40"
                />
              ),
            )}
          </svg>
        )}

        {/* Generation rows */}
        <div className="flex flex-col items-center gap-16 px-16 py-10">
          {rows.map((row, rowIndex) => (
            <div key={row.label} className="flex flex-col items-center gap-5">
              {/* Generation label pill */}
              <span className="rounded-full border border-amber-200/70 bg-white/60 px-3 py-0.5 font-semibold text-[10px] text-amber-700 uppercase tracking-widest dark:border-amber-800/30 dark:bg-stone-900/60 dark:text-amber-400">
                {row.label}
              </span>

              {/* Member cookbook nodes */}
              <div className="flex items-end gap-10">
                {row.members.map((member, memberIndex) => {
                  const count = recipeCountByMember[member.id] ?? 0;
                  const colors = coverColor(member);
                  const isSelected = selected?.id === member.id;
                  const transitionDelay = Math.min(rowIndex * 120 + memberIndex * 45, 720);

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
                        "group relative flex cursor-pointer flex-col items-center gap-2.5 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform focus:outline-none",
                        "md:hover:-translate-y-1 active:scale-[0.99] md:hover:scale-[1.03]",
                        "focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0ece3] dark:focus-visible:ring-offset-stone-950",
                        isTreeEntered
                          ? "translate-y-0 scale-100 opacity-100 blur-0"
                          : "translate-y-4 scale-[0.98] opacity-0 blur-[1px]",
                        isSelected && "scale-105",
                      )}
                      style={{ transitionDelay: `${transitionDelay}ms` }}
                    >
                      {/* ── Cookbook shape ──────────────────────────────── */}
                      <div
                        className={cn(
                          "flex h-40 w-24 overflow-hidden rounded-lg shadow-md transition-[transform,box-shadow,filter] duration-250 ease-out",
                          "md:group-hover:-translate-y-0.5 md:group-hover:shadow-2xl md:group-hover:brightness-105",
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
                      <div className="md:group-hover:-translate-y-0.5 max-w-[100px] rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out md:group-hover:bg-white md:group-hover:shadow-md dark:bg-stone-900/80 dark:md:group-hover:bg-stone-900">
                        <p className="truncate text-center font-semibold text-[10px] text-stone-700 uppercase tracking-wide transition-colors duration-200 md:group-hover:text-amber-800 dark:text-stone-300 dark:md:group-hover:text-amber-300">
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
          readOnly={readOnly}
        />
      )}

      {/* ── First-time navigation tutorial ─────────────────────────────── */}
      {showTutorial && (
        <div className="absolute bottom-4 left-16 z-20 max-w-72 rounded-xl border border-amber-200/80 bg-white/95 p-3 text-xs shadow-md backdrop-blur-sm dark:border-amber-800/40 dark:bg-stone-900/90">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Navigate your family tree</p>
          <p className="mt-1 text-muted-foreground">Drag empty space to move around.</p>
          <p className="mt-1 text-muted-foreground">Use your scroll wheel or +/- buttons to zoom.</p>
          <div className="mt-2 flex justify-end">
            <Button size="sm" className="h-7 px-2.5 text-xs" onClick={dismissTutorial}>
              Got it
            </Button>
          </div>
        </div>
      )}

      {/* ── Zoom controls (side rail) ───────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 rounded-xl border border-amber-200/80 bg-white/92 p-1.5 shadow-md backdrop-blur-sm dark:border-amber-800/40 dark:bg-stone-900/85">
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
