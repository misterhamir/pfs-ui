```markdown
# Design System Specification: The Fluid Enterprise

## 1. Overview & Creative North Star
### Creative North Star: "The Digital River"
Traditional enterprise software is rigid, boxy, and intimidating. This design system rejects the "grid-of-grey-boxes" in favor of an organic, flowing experience. We treat data like water—something that should be channeled, filtered, and moved with ease.

Our aesthetic is **Soft Authority**. We combine the gravitas of deep navy tones with the approachable, tactile nature of "river pebble" geometry. By utilizing intentional asymmetry, expansive white space, and a rejection of harsh structural lines, we create an environment where complex Agentic Document Processing feels like a calm, guided conversation rather than a manual chore.

---

## 2. Color & Surface Theory
Our palette moves away from sterile whites into sophisticated, layered cool tones.

### The Palette
- **Primary Foundation:** `primary` (#031634) and `primary_container` (#1A2B4A). Use these for high-authority moments.
- **The Flow:** `secondary` (#415e92) and `tertiary_container` (#002e49) provide the "problem-solver" energy.
- **Functional Accents:** `error` (#ba1a1a) for critical interruptions, and `surface_tint` (#4e5e80) for interactive states.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections or containers.
Structure must be achieved through **Tonal Transitions**. Use the `surface` tokens to create distinction:
- A `surface_container_low` (#f2f4f6) card sitting on a `surface` (#f8f9fb) background.
- A `surface_container_highest` (#e1e2e4) sidebar to anchor the primary navigation against a lighter workspace.

### Glass & Gradient Rule
To prevent the UI from feeling "flat," use **Glassmorphism** for floating elements (modals, popovers). Use `surface_container_lowest` (#ffffff) at 80% opacity with a `24px` backdrop blur.
**Signature Texture:** Apply a subtle linear gradient from `primary_container` to `secondary` (135°) for primary action hero sections to add "soul" and depth.

---

## 3. Typography: Editorial Authority
We pair the structural stability of **Lato** with the modern, rhythmic legibility of **Plus Jakarta Sans**.

- **Display & Headlines (Lato):** Use `display-lg` through `headline-sm` for high-level data summaries and page titles. These should always be **Bold** to project "Trustworthy Professionalism."
- **Body & Labels (Plus Jakarta Sans):** Use `body-lg` for reading-heavy document previews and `label-sm` for metadata. The wider apertures of Jakarta Sans ensure legibility even in dense document processing tables.

**Intentional Scale:** Contrast is key. Use a large `display-md` (2.75rem) next to a `body-sm` (0.75rem) to create an editorial layout that feels curated, not auto-generated.

---

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of **Ambient Luminosity.**

### The Layering Principle
Depth is achieved by "stacking" the surface-container tiers.
1. **Base:** `surface` (The riverbed)
2. **Intermediate:** `surface_container_low` (Recessed areas/Input fields)
3. **Emphasis:** `surface_container_lowest` (Raised cards/Active workspace)

### Ambient Shadows
When an element must float (e.g., a draggable document chip), use a custom shadow:
- **X: 0, Y: 12, Blur: 32px**
- **Color:** `on_secondary_container` (#335083) at **6% opacity**.
This blue-tinted shadow mimics natural light refracting through water, avoiding the "dirty" look of grey shadows.

### The "Ghost Border" Fallback
If contrast ratios require a boundary, use a **Ghost Border**: `outline_variant` (#c5c6cf) at **15% opacity**. It should be felt, not seen.

---

## 5. Component Guidelines

### Buttons (The Pebbles)
- **Geometry:** `rounded-full` (999px).
- **Primary:** `primary` background with `on_primary` text. No shadow.
- **Secondary:** `secondary_container` background.
- **Interaction:** On hover, shift background to `surface_tint`.

### Cards & Document Containers
- **Radius:** `rounded-xl` (3rem/48px) for main dashboard cards; `rounded-lg` (2rem/32px) for internal content modules.
- **Strict Rule:** No dividers. Use `spacing-6` (2rem) of vertical whitespace to separate header from body.

### Input Fields
- **Style:** "Soft Well" approach. Use `surface_container_low` background with no border. On focus, transition to a `2px` ghost border of `primary_fixed`.
- **Radius:** `rounded-md` (1.5rem).

### Agentic Action Chips
- Used for AI-suggested actions. Use a semi-transparent `tertiary_fixed` (#cce5ff) background with `on_tertiary_fixed` text. These should feel lighter and "quicker" than buttons.

### Progressive Disclosure Lists
Instead of standard tables, use grouped lists. Each row sits on its own `surface_container_lowest` background with `rounded-sm` (0.5rem) corners, creating a "stacked paper" effect.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical margins (e.g., `spacing-12` on the left, `spacing-8` on the right) for editorial dashboard layouts.
- **Do** lean into the "River Pebble" metaphor—every interactive corner should be generously rounded.
- **Do** use `on_surface_variant` (#44474e) for secondary text to maintain a soft, accessible contrast.

### Don’t
- **Don't** use 100% black (#000000) for text. Always use `on_surface` or `primary`.
- **Don't** use sharp 90-degree corners. Even "sharp" elements like document previews should have at least a `rounded-sm` (8px) radius.
- **Don't** use horizontal rules (`
`) or lines to separate content. Use background color shifts or whitespace (`spacing-4` or higher).

- **Don't** use "pure" grey shadows; they kill the professional "Flow Blue" vibrancy of the system.