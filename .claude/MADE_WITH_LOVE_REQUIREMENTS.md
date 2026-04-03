# Made with Love — Requirements

## 1. Product overview

**Made with Love** is a personal family recipe and memory app that helps families preserve recipes, stories, and cultural identity through food.
The app centers around a **family tree**, where each family member is represented as a node and may have their own recipe collection, memories, and archived contributions.

The product is designed for:
- families who want to preserve traditions
- immigrant and diaspora families preserving cultural heritage
- grieving families who want to keep loved ones’ stories alive through recipes
- younger generations who want to learn family recipes in a more guided, emotional, and interactive way

---

## 2. Problem statement

Many family recipes are lost across generations. Even when a handwritten recipe survives, the emotional context, family story, cooking style, and cultural significance often disappear.

Families need a way to:
- digitize old recipes
- connect recipes to real people in the family
- preserve memories and stories attached to food
- make traditional recipes easier to learn
- share selected recipes with future generations
- optionally discover recipes from other families and cultures

---

## 3. Product goals

### Primary goals
- Preserve family recipes and food traditions
- Preserve personal and cultural memories through cooking
- Make intergenerational knowledge easier to pass down
- Create a more emotional and meaningful cooking experience
- Support remembrance and grief-sensitive memory preservation

### Secondary goals
- Encourage younger family members to engage with family history
- Enable optional cultural discovery through public/shared recipes
- Create a warm, memorable, visually strong user experience for demo and retention

---

## 4. Target users

### Primary users
- young adults preserving parents’ or grandparents’ recipes
- families building a private family archive
- diaspora families documenting cultural traditions
- grieving families wanting to preserve memory through food

### Secondary users
- children or grandchildren learning family recipes
- relatives contributing stories, photos, or variations
- public users browsing shared cultural recipes from other families

---

## 5. Core user stories

### Family archive
- As a user, I want to create a family tree so I can organize recipes by family member.
- As a user, I want to add a family member node so I can preserve their recipes and memories.
- As a user, I want to see who a recipe came from so I can connect the dish to a person.

### Recipe preservation
- As a user, I want to upload a photo of a handwritten recipe so I can digitize it.
- As a user, I want the app to extract recipe text from an image so I do not need to rewrite everything manually.
- As a user, I want to edit extracted recipe details so I can correct errors.

### Memory preservation
- As a user, I want to attach a story, note, or memory to a recipe so the dish keeps its emotional meaning.
- As a user, I want to save voice notes, photos, or personal details with a recipe so the archive feels alive.
- As a user, I want to mark whether a recipe is linked to someone who has passed away so it can be handled respectfully.

### Guided cooking
- As a user, I want step-by-step recipe guidance so family recipes feel easier to follow.
- As a user, I want a warm animated “cartoon grandma” or family guide so the cooking experience feels personal and memorable.
- As a user, I want the guide to move through one step at a time so the experience is easy to follow.

### Favorites and sharing
- As a user, I want to star a recipe as a family favorite so important dishes stand out.
- As a user, I want to optionally share selected recipes publicly so others can discover cultural dishes.
- As a user, I want to browse public recipes from other families so I can explore other traditions.

---

## 6. Functional requirements

### 6.1 User accounts and profiles
The system shall:
- allow users to create an account
- allow users to sign in and sign out
- allow users to manage a personal profile
- allow users to create or join a family space
- support private family spaces by default

### 6.2 Family tree management
The system shall:
- allow users to create a family tree
- allow users to add, edit, and remove family members
- allow each family member node to contain:
  - name
  - relation
  - generation
  - optional photo
  - optional short biography
  - optional memorial status
- allow recipes to be linked to a specific family member
- allow users to browse recipes visually through the family tree

### 6.3 Recipe creation and storage
The system shall:
- allow users to create a recipe manually
- allow users to upload recipe images
- allow users to extract recipe text from uploaded images
- allow users to edit extracted content
- allow recipe records to include:
  - title
  - ingredients
  - steps
  - cooking notes
  - servings
  - prep/cook time
  - origin family member
  - photos
  - tags
  - cultural origin
  - country of origin
  - language
- allow multiple versions or adaptations of a recipe

### 6.4 Memory and story capture
The system shall:
- allow users to attach written memories to recipes
- allow users to attach voice notes to recipes
- allow users to attach photos to recipes
- allow users to save contextual fields such as:
  - when this dish was made
  - for what occasion
  - who usually cooked it
  - why it matters
- allow users to preserve memorial notes respectfully

### 6.5 Interactive guided cooking
The system shall:
- provide a step-by-step cooking mode
- allow the system to present one step at a time
- allow step completion and navigation to next/previous step
- support an animated guide avatar for selected recipes
- allow the avatar style to be family-inspired but clearly stylized/cartoon-based
- allow users to replay steps
- allow users to enlarge ingredients/instructions during cooking

### 6.6 Favorites
The system shall:
- allow users to star recipes
- display starred recipes in a “Family Favorites” section
- allow filtering and sorting by favorites

### 6.7 Cultural discovery
The system shall:
- allow users to mark selected recipes as public
- provide a public browsing area for shared recipes
- allow browsing by culture, family story, ingredient, or country/region
- allow users to save public recipes to a personal inspiration list without modifying the source family archive

### 6.8 Search and filter
The system shall:
- allow search by recipe name
- allow search by family member
- allow filter by culture
- allow filter by favorites
- allow filter by memorial recipes
- allow filter by ingredients or occasion

### 6.9 Permissions and privacy
The system shall:
- keep family archives private by default
- allow the family owner/admin to control who can view or edit family content
- allow recipe-level privacy settings
- allow public sharing only through explicit opt-in
- allow removal or editing of sensitive memorial content

---

## 7. AI requirements

### 7.1 Recipe extraction
The AI system shall:
- extract recipe text from uploaded handwritten or photographed recipes
- structure extracted text into ingredients and steps
- identify uncertain fields and allow user correction
- avoid silently inventing missing recipe information

### 7.2 Story and memory assistance
The AI system shall:
- help users organize recipe memories into clear story sections
- help summarize long notes while preserving meaning
- assist with multilingual translation where appropriate
- preserve the family’s wording as much as possible when requested

### 7.3 Guided cooking generation
The AI system shall:
- transform recipe text into a step-by-step guided cooking flow
- simplify unclear recipe wording into beginner-friendly instructions
- keep the family recipe’s meaning intact
- avoid changing ingredients or important steps without explicit user review

### 7.4 Tone and personalization
The AI system may:
- generate a warm and caring tone for guided cooking
- offer family-inspired instructional phrasing
- support different guide tones such as warm, playful, formal, or traditional

The AI system shall not:
- claim to be the real deceased person
- simulate resurrection or false real-time identity
- generate manipulative grief experiences

---

## 8. Non-functional requirements

### 8.1 Usability
The application shall:
- be easy to use for non-technical users
- support clear navigation between family tree, recipes, and memories
- support mobile and desktop layouts
- provide a clean step-by-step cooking mode suitable for kitchen use

### 8.2 Performance
The application shall:
- load the family tree within acceptable time under normal conditions
- process standard recipe image uploads within reasonable time
- return guided recipe content without excessive delay
- handle concurrent access from multiple family members

### 8.3 Reliability
The application shall:
- preserve user data reliably
- prevent accidental deletion where possible through confirmation or recovery flows
- support autosave for recipe and story editing where possible

### 8.4 Security
The application shall:
- protect private family data
- require authentication for private spaces
- apply secure access controls for shared family archives
- store uploaded personal content securely

### 8.5 Accessibility
The application shall:
- support readable typography and contrast
- support keyboard-accessible navigation where possible
- support captions/transcripts for voice content where possible
- support simple cooking mode with large buttons and readable instructions

### 8.6 Localization
The application should:
- support multilingual recipe content
- support multiple interface languages over time
- allow family-specific bilingual or multilingual archives

---

## 9. Ethical and trust requirements

The product shall:
- clearly distinguish between real family memory and AI-generated assistance
- avoid presenting the guide avatar as a real living or resurrected person
- give families control over how deceased loved ones are represented
- allow users to disable the animated guide entirely
- protect sensitive grief-related content
- avoid altering the meaning of recipes or memories without review
- be transparent about what AI did, such as:
  - text extraction
  - recipe cleanup
  - translation
  - story summarization

---

## 10. MVP requirements

For a hackathon MVP, the system must include:

### Required MVP scope
- user can create one family space
- user can create a small family tree
- user can add at least one family member
- user can upload one handwritten recipe image
- AI extracts recipe text into structured fields
- user can edit the structured recipe
- user can attach one memory/story to the recipe
- user can launch a step-by-step cooking experience
- one simple animated guide is shown during cooking
- user can star the recipe as a family favorite
- one optional public cultural discovery page exists

### Nice-to-have MVP scope
- voice note attachment
- multilingual translation
- multiple family members and multiple recipes
- memorial mode
- browse other public family recipes by culture

---

## 11. Out of scope for MVP

The following are out of scope for the first version unless time allows:
- full genealogy import
- deep ancestry integrations
- advanced family collaboration workflows
- real-time multiplayer cooking
- full voice cloning of real relatives
- medically or psychologically sensitive grief interventions
- advanced public social network features
- complex recommendation engine

---

## 12. Suggested data model

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

### AIOutput
- ai_output_id
- recipe_id
- extracted_text
- structured_recipe
- guided_steps
- translation_output
- confidence_note

---

## 13. Success criteria

The product will be considered successful if users can:
- preserve a meaningful family recipe in a structured way
- connect that recipe to a real person in the family tree
- attach at least one personal story or memory
- complete the recipe in guided mode
- feel that the app preserves more than just instructions
- understand that the app is about heritage, memory, and meaning, not generic recipe generation

For a hackathon demo, success means the judges can immediately understand:
- the emotional value
- the cultural value
- the AI value
- the product’s uniqueness

---

## 14. One-line product requirement summary

**Made with Love must enable families to preserve recipes, stories, and cultural memory through a private family-tree-based cooking experience that is personal, respectful, interactive, and emotionally meaningful.**
