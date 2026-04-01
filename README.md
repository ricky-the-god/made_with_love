# Made with Love

**Made with Love** is a family recipe and memory web app centered around a living family tree.  
Each family member becomes a node in the tree and can have their own recipe book, personal memories, cultural food traditions, and favorite dishes.

The product is designed to preserve more than recipes. It preserves **stories, grief, heritage, identity, and love through food**.

---

## Concept

Many family recipes are lost across generations. Even when a handwritten recipe survives, the emotional context, cooking style, family story, and cultural meaning behind it often disappear.

Made with Love helps families:
- preserve handwritten recipes
- connect recipes to real people in the family
- attach stories, photos, and memories to dishes
- cook family recipes through a guided experience
- build a private family archive
- optionally explore public recipes and traditions from other families and cultures

---

## Core Experience

After authentication, the app opens with a **book-opening animation**.  
From the book, a **living family tree** grows onto the screen.

From there, users can:
- create or join a family space
- add and connect family members in the tree
- open a relative's profile
- browse that person’s personal recipe book
- upload handwritten recipes from images
- attach memories, stories, and photos
- cook recipes through a warm guided cooking mode
- star recipes as personal or family favorites
- explore public family trees and recipes from other cultures

---

## Main Features

### 1. Family Tree Navigation
- Interactive family tree as the main navigation model
- Family members represented as nodes
- Relationship-aware structure
- Family member profiles connected to recipes and memories

### 2. Family Member Profiles
Each profile can include:
- name
- relationship
- country of origin
- biography
- favorite foods
- favorite dishes to cook
- cooking personality
- memories and quotes
- memorial status

### 3. Personal Recipe Books
Each family member has their own cookbook containing:
- recipes linked to that person
- country of origin
- cultural context
- memory/story content
- photos
- family favorite markers

### 4. Recipe Upload and OCR
Users can:
- upload photos of handwritten recipes
- extract text into structured recipe fields
- review and correct uncertain OCR results
- connect recipes to a family member
- add country of origin and story context

### 5. Guided Cooking Mode
- One step at a time cooking flow
- Warm cartoon-style family guide
- Timer support
- Large readable cooking UI
- Low-stress, kitchen-friendly interface

### 6. Favorites
- Personal favorites
- Family favorites
- Saved public recipes

### 7. Public Discovery
- Explore public family trees
- Browse cultural recipes by country or cuisine
- Discover family stories through food
- Search recipes by nationality, ingredient, occasion, or culinary figure

### 8. Grief and Memorial Support
- Memorial mode for family members
- Respectful remembrance design
- Recipes as living memory artifacts
- Emotional preservation without exploitative simulation

---

## Product Goals

### Primary goals
- Preserve family recipes and traditions
- Preserve memory and identity through food
- Make intergenerational knowledge easier to pass down
- Create a guided, emotional, and meaningful cooking experience
- Support grief-sensitive remembrance

### Secondary goals
- Encourage younger generations to engage with family history
- Enable cultural discovery through public sharing
- Create a warm and visually memorable web experience

---

## Design Direction

Made with Love should feel like:
- a cherished family cookbook
- a photo album of memory and food
- a digital heirloom
- a warm home kitchen
- a story passed down through generations

### Design keywords
- cozy
- personal
- intimate
- warm
- story-driven
- heirloom
- soft
- respectful
- emotional
- family-centered

### Avoid
- sterile SaaS dashboards
- cold enterprise UI
- generic productivity-app patterns
- loud or over-gamified interfaces

---

## Cookbook Personalization

A key part of the product is that each cookbook should feel personal to the family member it belongs to.

Cookbooks can adapt visually based on:

### Age / generation
- grandparent / elder cookbook: more classic, heritage-forward, archival
- parent generation cookbook: balanced warmth and structure
- young adult cookbook: lighter, cleaner, more modern
- child cookbook: more approachable, visually simple, gently playful

### Region / country / cultural context
Cookbooks can also subtly adapt based on cultural background through:
- color accents
- motifs
- ornament density
- layout rhythm
- illustration style
- recipe card framing

This customization should be elegant and respectful, never stereotypical.

---

## User Flow Summary

1. User signs in
2. Book opening animation plays
3. Family tree grows onto the screen
4. User completes onboarding
5. User creates or joins a family space
6. User adds or selects a family member
7. User opens that family member’s profile
8. User views their recipe book
9. User uploads a handwritten recipe or creates one manually
10. OCR/AI structures the recipe
11. User adds memory, country of origin, and story context
12. Recipe is saved into the family archive
13. User starts guided cooking mode
14. User favorites the recipe
15. User explores public recipes and family trees

---

## Suggested Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Next.js Route Handlers / Server Actions
- Supabase

### Database / Storage
- Supabase Postgres
- Supabase Storage

### AI / OCR
- Claude API
- OCR pipeline for handwritten recipe extraction

### Testing / Dev Tools
- Playwright
- Vercel
- Context7
- Supabase MCP
- GSD framework

---

## Suggested Data Model

### User
- user_id
- name
- email
- profile_photo
- role

### Family
- family_id
- family_name
- owner_user_id
- privacy_setting

### FamilyMember
- member_id
- family_id
- name
- relation
- generation
- photo
- bio
- memorial_status

### Recipe
- recipe_id
- family_id
- member_id
- title
- ingredients
- steps
- notes
- servings
- prep_time
- cook_time
- language
- culture_tag
- country_of_origin
- is_favorite
- visibility

### Memory
- memory_id
- recipe_id
- text
- voice_note_url
- photo_url
- occasion
- meaning_note

---

## MVP Scope

### Required MVP
- authentication
- one family space
- small interactive family tree
- add at least one family member
- upload one handwritten recipe image
- OCR/AI recipe extraction
- recipe editing
- story/memory attachment
- guided cooking mode
- one family-inspired animated guide
- favorite system
- one discover page for public recipes

### Nice to have
- multilingual translation
- voice notes
- memorial mode
- multiple family members and recipe books
- public cultural discovery by country

---

## Ethical Principles

Made with Love must:
- clearly distinguish real memories from AI assistance
- avoid simulating deceased relatives in an uncanny or manipulative way
- preserve family control over representation
- keep private family archives private by default
- handle grief respectfully
- avoid altering recipe meaning without user review

The animated family guide should feel like a **memory-inspired companion**, not a resurrection.

---

## Why This Matters

Made with Love is not just a recipe app.

It is:
- a family archive
- a memory-preservation tool
- a cultural storytelling platform
- a grief-sensitive cooking experience
- a digital heirloom

It helps families keep the people behind the recipes alive through story, ritual, and food.

---

## Project Status

Hackathon project in active design and prototyping.

---

## Working Title

**Made with Love**

---

## One-Line Summary

**A living family cookbook where recipes, people, memory, grief, and culture are connected through an interactive family tree.**
