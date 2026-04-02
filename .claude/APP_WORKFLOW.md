# Made with Love — App Workflow

## 1. Overview

**Made with Love** is a family recipe and memory app centered around a living family tree.  
Each family member is represented as a node, and each person may have their own recipe book, memories, cultural food traditions, and favorite dishes.

The product experience should feel:
- warm
- personal
- emotional
- culturally rich
- easy to navigate
- respectful for grief and remembrance

The workflow must support:
- preserving family recipes
- preserving stories and memories
- guided cooking
- family collaboration
- cultural discovery

---

## 2. Entry and Authentication Flow

### User Entry
When the user opens the app, they should land on a welcome experience that immediately reflects the emotional tone of the product.

### Authentication Flow
1. User opens the app
2. User chooses:
   - Sign up
   - Log in
3. Authentication succeeds
4. The app transitions into a **book opening animation**
5. As the book opens, a **living family tree** grows from the pages
6. Onboarding begins

### Design Goal
This opening moment should communicate that the product is not just a recipe utility.  
It is about memory, heritage, love, and storytelling.

---

## 3. Onboarding Flow

## Goals of onboarding
The onboarding should help the user understand:
- this is a family-based recipe archive
- recipes belong to people and stories
- the family tree is the main navigation structure
- the app can preserve both food and memory
- some content can be shared publicly for cultural discovery

## Onboarding Steps
1. **Welcome screen**
   - Explain the mission:
     - preserve recipes
     - preserve family stories
     - preserve cultural traditions

2. **Create or join a family space**
   - Create a new family tree
   - Or join an existing family by invitation

3. **Add your first family member**
   - Suggested options:
     - yourself
     - a parent
     - a grandparent
     - another meaningful relative

4. **Add your first recipe or memory**
   - Upload a handwritten recipe
   - Or create a recipe manually
   - Or add a memory/story first

5. **Learn the family tree navigation**
   - Tap nodes to explore family member profiles
   - Open recipe books linked to each member

6. **Optional public discovery explanation**
   - Explain that users may choose to explore public family trees and cultural recipes from others

---

## 4. Main Navigation Structure

After onboarding, the app should have five main areas:

### Primary Navigation
- **Tree**
- **Recipes**
- **Discover**
- **Favorites**
- **Profile**

### Purpose of Each Section

#### Tree
The emotional and structural center of the app.  
Users browse people, generations, and relationships.

#### Recipes
A consolidated view of recipes the user can access.

#### Discover
Public family trees, cultural cuisines, featured culinary stories, and selected public recipes.

#### Favorites
Personal favorites and family favorites.

#### Profile
User account, family management, invitations, privacy, and settings.

---

## 5. Family Tree Workflow

## Purpose
The family tree is the primary way users experience the app.  
Each node represents a person connected to memory, recipes, and culture.

## User Actions
Users must be able to:
- view the family tree
- zoom in and out
- pan across branches
- click or tap a family member node
- add a family member
- edit a family member
- connect family members
- browse by generation

## Relationship Types
The workflow should support meaningful relationship types such as:
- mother
- father
- grandmother
- grandfather
- aunt
- uncle
- cousin
- sibling
- child
- family friend
- mentor

This is important because meaningful food memories may come from more than direct blood relatives.

---

## 6. Family Member Profile Workflow

When the user selects a family member node, they open that person’s profile.

## Profile Summary Should Include
- full name
- relationship to the user or family
- profile image
- short biography
- country of origin
- cultural background
- favorite foods
- favorite dishes to cook
- cooking personality or style
- optional quote or story
- memorial status, if applicable

## Actions From the Profile
Users must be able to:
- view the person’s recipe book
- start cooking one of their recipes
- add a recipe for this person
- add a story or memory
- upload photos
- upload handwritten recipe images
- favorite a recipe
- share selected recipes publicly, if allowed

## Useful Additional Data
The profile may also include:
- dishes usually cooked for holidays
- special occasions associated with this person
- traditions they were known for
- migration or cultural story
- remembrance notes

---

## 7. Recipe Book Workflow

Each family member has their own recipe book.

## Recipe Book View
The recipe book should display recipe cards or entries that include:
- recipe title
- image
- country of origin
- culture tag
- linked family member
- difficulty level
- prep time
- family favorite status
- memory/story indicator
- privacy/share status

## User Actions
Users must be able to:
- open a recipe
- favorite or star a recipe
- start cooking
- edit recipes if they have permission
- attach a memory
- add a variation
- save a public recipe into their own personal cookbook

---

## 8. Recipe Detail Workflow

When a recipe is opened, the experience should feel practical and emotional at the same time.

## Recipe Detail Layout

### Top Section
- title
- linked family member
- country of origin
- cultural background
- main image
- favorite button
- share/save actions

### Core Recipe Section
- ingredients
- steps
- cooking notes
- servings
- prep time
- cook time
- optional substitutions
- optional difficulty

### Memory Section
- written memory/story
- occasion linked to the dish
- voice note if available
- associated family photos
- remembrance notes, if applicable

### Actions
Users must be able to:
- cook the recipe
- favorite it
- save it
- share it
- add a variation
- add a reflection or note

---

## 9. Guided Cooking Workflow

Guided cooking is one of the signature experiences of the app.

## Start Flow
1. User opens a recipe
2. User clicks **Cook**
3. The app enters **guided cooking mode**
4. A stylized animated family guide appears
5. The recipe is presented one step at a time
6. User moves through the cooking process
7. Completion screen celebrates the dish and the memory

## Guided Cooking Features
The guided mode should support:
- one step at a time
- previous / next step navigation
- ingredient checklist
- timers
- highlighted active ingredients
- optional voice playback
- large readable text
- family-inspired animated guide

## Important Ethical Framing
The animated guide should be framed as:
- a family-inspired cartoon guide
- a memory companion
- a tribute

The app must not present this feature as a resurrection or exact simulation of a deceased loved one.

---

## 10. Recipe Creation Workflow

Users should be able to create recipes in two main ways.

## Option A — Manual Recipe Creation

### User enters:
- recipe title
- linked family member
- country of origin
- cultural background
- ingredients
- steps
- notes
- occasion
- story or memory
- photos

### Flow
1. User clicks **Create Recipe**
2. User selects linked family member
3. User fills in recipe fields
4. User optionally adds memory content
5. User saves the recipe
6. The recipe is added to that person’s recipe book

---

## Option B — Recipe From Image Upload

Users can take a picture of:
- handwritten recipe cards
- notebook pages
- printed instructions
- recipe book pages

### Flow
1. User uploads a recipe image
2. OCR / AI extraction runs
3. The app shows a structured preview
4. User reviews the extracted content
5. Low-confidence fields are flagged for correction
6. User links the recipe to a family member
7. User adds story, occasion, and cultural context
8. User saves the recipe

## Important Trust Requirement
The system should never silently invent uncertain ingredient quantities or cooking steps.  
Uncertain extraction should be clearly marked for confirmation.

---

## 11. Favorites Workflow

The product should support two layers of favorites.

## Personal Favorites
Recipes a specific user personally loves or saves often.

## Family Favorites
Recipes recognized across the family as iconic or especially meaningful.

## Actions
Users must be able to:
- star a recipe as a personal favorite
- mark a recipe as a family favorite if permitted
- browse favorites in a dedicated section
- filter recipes by favorite type

This distinction is useful because a user’s personal preference is not always the same as the family’s most meaningful dish.

---

## 12. Discover Workflow

The app should allow cultural discovery beyond the user’s private family archive.

## Discover Page Sections
- featured public family trees
- public recipes by cuisine
- country-based collections
- cultural traditions and stories
- featured culinary figures
- seasonal collections
- featured memorial or heritage stories, if explicitly shared

## User Actions
Users must be able to:
- visit public family trees
- browse selected public nodes
- open public recipes
- favorite public recipes
- save public recipes to their personal cookbook
- search across public content

## Privacy Rule
Private family content must remain private by default.  
Public discovery must be fully opt-in.

---

## 13. Visiting Other Family Trees Workflow

## Public Family Tree View
When a user visits another family’s public tree, they should be able to:
- explore only the family members that the owner has chosen to make public
- browse public recipe books
- read selected stories
- favorite recipes
- save recipes to their own cookbook

Users must not be able to:
- edit another family’s content
- view private memorial content
- access restricted members or stories

## Family-Level Visibility Controls
Public family owners should be able to choose:
- which people are visible
- which recipes are visible
- which memories are visible
- whether memorial content is public

---

## 14. Search Workflow

Search should go beyond recipe titles.

## Search Categories
Users should be able to search by:
- recipe title
- family member name
- country of origin
- nationality
- cuisine
- ingredient
- occasion
- family name
- memory/story keyword
- featured culinary figure

## Filters
Users should be able to filter by:
- personal favorites
- family favorites
- beginner friendly
- quick meals
- desserts
- memorial recipes
- holiday recipes
- public only
- family only

---

## 15. Cultural and Historical Discovery Workflow

The app should support broader culinary exploration.

## Search by Nationality or Country
Users should be able to search for recipes by:
- country
- region
- nationality
- cultural background

## Search by Famous Person
This feature should be framed as:
**Featured Culinary Figures**

Examples:
- famous chefs
- historical culinary icons
- known food personalities
- notable family-recipe contributors if curated publicly

This is a better fit for the brand than a generic “famous person” label.

---

## 16. Collaboration Workflow

The app should support family collaboration.

## Family Invitations
Users should be able to:
- invite other relatives
- assign permissions
- collaborate on shared family content

## Suggested Roles
- **Owner**
- **Editor**
- **Contributor**
- **Viewer**

## Role-Based Permissions
Roles should control:
- who can add family members
- who can edit recipes
- who can add memories
- who can manage public sharing
- who can mark family favorites

---

## 17. Memorial Workflow

This is an important feature for the emotional positioning of the app.

## Memorial Mode
A family member profile may be marked as memorialized.

## Memorial Profile Features
- memorial badge
- remembrance section
- respectful visual styling
- preserved stories and recipes
- optional remembrance notes

## Important Product Principle
The app should support grief and remembrance without becoming exploitative or emotionally manipulative.

---

## 18. Recipe Variations Workflow

Family recipes often evolve over time.

## Variation Support
Users should be able to:
- preserve the original version
- add their own variation
- note substitutions
- explain why the recipe changed
- link variations back to the original

This supports migration stories, adaptation, and intergenerational evolution.

---

## 19. Language and Translation Workflow

The product should support multilingual families.

## Translation Support
Users should be able to:
- store the original recipe language
- generate translated versions
- display bilingual recipes
- preserve culturally meaningful wording where possible

This is especially useful for immigrant and diaspora families.

---

## 20. Personal Cookbook Workflow

Users should have their own personal cookbook area.

## Personal Cookbook Includes
- recipes they created
- recipes inherited from their family archive
- public recipes they saved
- personal favorites
- recipes they want to cook later

This gives users a practical space outside the family tree while still preserving the emotional structure.

---

## 21. Reflections and Comments Workflow

Users may want to add ongoing meaning to a recipe.

## Reflection Features
Users should be able to:
- add a note after cooking
- comment on public family recipes if enabled
- record “I remember this dish because...”
- add contextual family tips

Examples:
- “Grandma always added extra garlic.”
- “Dad made this every winter.”
- “We used this at New Year.”

These reflections help recipes stay alive instead of becoming static records.

---

## 22. Timeline and Family Food History Workflow

A powerful optional feature is a timeline of food and migration.

## Timeline Features
The app may support:
- recipes by generation
- recipes by migration path
- recipes by decade
- recipes linked to key family events

Example:
Vietnam → immigration to Canada → adaptation of a traditional dish

This feature would strengthen the app’s cultural storytelling dimension.

---

## 23. End-to-End Core User Journey

The main product journey should look like this:

1. User signs in
2. Book opening animation plays
3. Family tree grows onto the screen
4. Onboarding explains the product
5. User creates or joins a family space
6. User adds a family member
7. User clicks a family member node
8. User opens the family member profile
9. User views that person’s recipe book
10. User uploads a handwritten recipe or creates one manually
11. AI extracts and structures the recipe
12. User reviews and corrects extracted content
13. User adds a story, occasion, and country of origin
14. Recipe is saved to the family member’s book
15. User starts guided cooking mode
16. Animated family guide helps step by step
17. User favorites the recipe
18. User explores public family trees and other cultures
19. User saves inspiration into their own cookbook

---

## 24. Key Product Principles

The workflow should always reinforce the following:

### Personal
Recipes should always feel tied to real people.

### Cultural
The app should preserve heritage, identity, and context.

### Emotional
Stories and memories are first-class content, not optional decoration.

### Respectful
Grief and remembrance must be handled carefully.

### Practical
Recipes must still be easy to cook and navigate.

### Discoverable
Users should be able to explore other cultures and traditions when sharing is enabled.

---

## 25. Product Positioning Summary

Made with Love is not just:
- a recipe manager
- a family tree tool
- a cooking assistant
- a social discovery platform

It is:

**A living family cookbook where recipes, people, memory, grief, and culture are connected through an interactive family tree.**
