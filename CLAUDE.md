# Made with Love — Claude Context

## Project Summary

**Made with Love** is a family recipe and memory preservation web app. The emotional core is a living, interactive family tree where each node represents a family member with their own recipe book, personal memories, and cultural food traditions. The app is designed for immigrant families, diaspora communities, and grieving families who want to preserve more than just instructions — they want to preserve the people, stories, and meaning behind the food.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | React Compiler enabled, Server Actions used |
| UI | React 19, TypeScript 5 strict | |
| Styling | Tailwind CSS v4 | CSS custom properties, no tailwind.config theme needed |
| Components | shadcn/ui — 56 components | All in `src/components/ui/` |
| State | Zustand v5 | Preferences store only (`src/stores/`) |
| Data fetching | TanStack Query v5 | Not yet wired to backend |
| Forms | React Hook Form v7 + Zod v3 | |
| Database | Supabase (PostgreSQL + Storage) | Configured, **not yet integrated** |
| AI | `@anthropic-ai/sdk` v0.82 | Installed, **not yet used** |
| Linting | Biome v2 | Unified lint + format, replaces ESLint + Prettier |
| Hooks | Husky v9 + lint-staged | Auto-format + lint on commit |

---

## Project Status

### Built
- **Auth UI** — v1 & v2 login/register pages, forms, Google OAuth button; no auth logic yet
- **Dashboard shell** — sidebar layout, nav, theme switcher, account switcher
- **CRM & Finance dashboards** — complete template pages; useful as UI reference
- **Theme system** — light/dark, presets, Zustand store, cookie + localStorage persistence
- **56 shadcn/ui components** — ready to use, no further install needed

### Not Yet Built (MVP Priority)
- Family tree visualization (the core feature — nothing exists)
- Family member profiles
- Recipe creation, upload, and editing
- Claude AI recipe extraction from images
- Guided cooking mode + animated family guide
- Memory/story/voice note attachment
- Supabase schema, migrations, and data layer
- Supabase Auth integration (wire up existing auth UI)
- Public discovery and sharing

---

## Key Directories

```
src/
├── app/
│   ├── (external)/          # Landing page
│   └── (main)/
│       ├── auth/            # v1 & v2 login/register (UI only)
│       └── dashboard/       # Main app shell + templates
├── components/ui/           # 56 shadcn/ui components
├── lib/                     # utils.ts, cookie/localStorage helpers, fonts
├── server/                  # Server Actions (server-actions.ts)
├── stores/preferences/      # Zustand store + provider
├── hooks/                   # use-mobile.ts
├── config/app-config.ts     # App metadata
└── data/users.ts            # Mock data (temporary)
```

---

## MVP Scope

The minimum bar for a working demo:
- [ ] Create one family space
- [ ] Build a small family tree (add/display members)
- [ ] Upload a handwritten recipe image → Claude extracts → user reviews/edits
- [ ] Attach one memory/story to a recipe
- [ ] Step-by-step guided cooking mode with a simple animated guide
- [ ] Star a recipe as a family favorite
- [ ] One public cultural discovery page

---

## Core Data Model

```
User            family_id, name, email, profile_photo, role
Family          family_id, family_name, owner_user_id, privacy_setting
FamilyMember    member_id, family_id, name, relation, generation, photo, bio, memorial_status
Recipe          recipe_id, family_id, member_id, title, ingredients, steps, notes,
                servings, prep_time, cook_time, language, culture_tag, country_of_origin,
                is_favorite, visibility
Memory          memory_id, recipe_id, text, voice_note_url, photo_url, occasion, meaning_note
AIOutput        ai_output_id, recipe_id, extracted_text, structured_recipe,
                guided_steps, translation_output, confidence_note
```

---

## Navigation Structure (Post-Auth)

| Tab | Purpose |
|---|---|
| **Tree** | Interactive family tree — primary navigation, browse members by generation |
| **Recipes** | Consolidated recipe view across the family |
| **Discover** | Public family trees, cultural cuisines, featured stories (opt-in only) |
| **Favorites** | Personal favorites + family-marked favorites |
| **Profile** | Account, family management, invitations, privacy settings |

---

## Ethical Constraints

These are non-negotiable product principles that affect implementation:

- **Animated guide**: Must be clearly stylized/cartoon — never presented as a real or resurrected deceased person. Users can disable it entirely.
- **AI transparency**: Always surface what AI did (extraction, cleanup, translation). Never silently invent ingredients, quantities, or steps — flag uncertainty for user review.
- **Privacy by default**: All family content is private. Public sharing is fully opt-in at the recipe and family member level.
- **Grief handling**: Memorial profiles must be treated with care — respectful visual styling, no exploitative features, no manipulative grief experiences.
- **Memory fidelity**: Preserve the family's original wording. AI assists, it does not replace.

---

## Detailed Docs

- [Full Requirements](.claude/MADE_WITH_LOVE_REQUIREMENTS.md) — product goals, user stories, all functional/non-functional requirements, out-of-scope items, success criteria
- [App Workflow](.claude/APP_WORKFLOW.md) — complete UX flows for every feature: auth, onboarding, family tree, profiles, recipes, guided cooking, discovery, collaboration, memorial, timeline
- [Design Guide](.claude/DESIGN.md) — color palette, typography, motion, component direction, emotional design language

---

## Agent Team

Five specialized agents live in `.claude/agents/`. Always invoke the right specialist for the task.

| Agent | File | Invoke when... |
|---|---|---|
| **architect** | `architect.md` | Designing data models, planning folder structure, server vs. client decisions, architectural reviews |
| **frontend-developer** | `frontend-developer.md` | Building pages, components, Tailwind styling, shadcn/ui, animations, responsive layouts |
| **supabase-engineer** | `supabase-engineer.md` | DB schema, SQL migrations, RLS policies, auth wiring, storage buckets, server actions |
| **ai-features** | `ai-features.md` | Recipe extraction from images, guided cooking generation, story assistance, translation |
| **code-reviewer** | `code-reviewer.md` | Pre-commit review, security audit, PR review — uses Codex CLI for deep analysis |

---

## Agent Workflows by Use Case

### A. Building any new feature end-to-end
1. **`architect`** — design data model and API surface
2. **`supabase-engineer`** — write schema, migrations, RLS, server actions
3. **`frontend-developer`** — build UI pages and components
4. **`ai-features`** — add AI layer if feature involves extraction or generation
5. **`code-reviewer`** — review before committing

---

### B. Family tree (highest priority MVP feature)
1. **`architect`** — decide rendering approach (canvas vs. SVG vs. library), define node data shape
2. **`frontend-developer`** — build tree visualization with organic connectors, pan/zoom, node keepsakes
3. **`supabase-engineer`** — wire `family_members` table queries and real-time updates
4. **`code-reviewer`** — review

---

### C. Recipe image upload + AI extraction
1. **`supabase-engineer`** — set up `recipe-images` storage bucket and upload server action
2. **`ai-features`** — build Claude extraction prompt, confidence flagging, save to `ai_outputs`
3. **`frontend-developer`** — build upload UI and user review/edit form
4. **`code-reviewer`** — verify AI transparency labels and error handling

---

### D. Guided cooking mode
1. **`ai-features`** — generate step-by-step guided steps from recipe using Claude API
2. **`frontend-developer`** — build step card UI, animated family guide, progress flow
3. **`code-reviewer`** — verify ethical framing of animated guide (must be cartoon, not realistic)

---

### E. Supabase auth wiring
1. **`supabase-engineer`** — connect existing auth UI to Supabase, set up `profiles` table trigger, configure OAuth
2. **`code-reviewer`** — security review of auth flow and session handling

---

### F. Memory / story attachment
1. **`supabase-engineer`** — `memories` table, storage for voice notes and photos, server actions
2. **`ai-features`** — story organization and summarization assistance
3. **`frontend-developer`** — memory section UI on recipe detail page
4. **`code-reviewer`** — review memorial handling guards

---

### G. Pre-commit / anytime
- **`code-reviewer`** — always run before committing. Uses Codex CLI (requires `OPENAI_API_KEY` in `.env`) for deep automated analysis + Claude review of security, RLS, AI ethics, and project standards.
