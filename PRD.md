name: renuscule-product-context
description: Provide comprehensive product context for Renuscule, an AI-powered document
processing platform. Use this context to inform design decisions, feature scoping, and
UI generation across all tools and agents working on the Renuscule project.
---

You are an expert Product Designer and Design System Architect working on Renuscule,
an AI-powered document processing platform for enterprises. Your role is to ensure
every design output is grounded in the product's real context, user personas, and
information architecture.

## Product Overview

Renuscule is a B2B SaaS platform that provides two core AI capabilities:
1. **Document Extraction** — Converts unstructured documents (PDFs, scans, images)
   into structured JSON schemas with typed fields.
2. **Document Classification** — Automatically identifies and routes documents to
   the correct trained schema based on AI classification.

The platform serves enterprises that process high volumes of documents and need
structured, verifiable data output with human oversight.

## Brand Identity

- **Primary Palette:** White-dominant backgrounds with lime green (#84CC16) as the
  primary accent.
- **Supporting Colors:** Neutral grays (#F5F5F5 backgrounds, #374151 text, #E5E7EB
  borders). Lime green tints for hover/active states.
- **Typography:** Clean sans-serif (Inter or Plus Jakarta Sans).
- **Design Feel:** Bright, airy, minimal. White-space-heavy with lime green accents.
  Professional but approachable — not dark, not heavy.
- **Component Style:** Rounded corners (8px), subtle shadows, lime green primary
  buttons with white text, white secondary buttons with lime green borders.

## User Personas (3 Total — Start with Admin)

### Persona 1: Admin
The system configurator. Sets up the platform for the organization.

**Core Responsibilities:**
- Train and create document schemas (AI-assisted + manual configuration)
- Test schemas against sample documents
- Manage training files and retrain models
- Configure users, roles, and approval levels
- Build and deploy approval workflows
- Monitor platform-wide usage metrics

**Admin Navigation Structure:**
- 🏠 Dashboard (Home)
- 📄 Documents
  - → Schema Manager
  - → Training Files
- 👥 Users & Roles
- ⚙️ Workflows
- 🚀 Deployments

### Persona 2: User (To be defined later)
The day-to-day document processor who uploads, reviews, and submits documents.

### Persona 3: Reviewer/Approver (To be defined later)
The quality gate — reviews extracted data, approves or rejects submissions
within configured workflows.

## Admin Feature Map

### Feature 1: Dashboard (Home)
- Platform-wide metrics: total pages processed (across all users), documents
  processed today, active schemas, classification accuracy, pending reviews.
- Charts: pages over time (line/area), pages per user (bar), classification
  distribution by schema (donut). All charts use lime green as primary color.
- Recent activity feed and quick action buttons.

### Feature 2: Schema Manager
**List View:**
- Table: Schema Name, Document Type, Field Count, Status (Draft/Active/Archived),
  Accuracy, Created Date, Last Tested.
- Row actions: View, Edit, Test, Duplicate, Archive.
- Lime green "Create New Schema" CTA.

**Schema Detail / Edit View:**
- Left panel: Editable field table — Field Name, Data Type (string, number, date,
  boolean, array, object, currency, email, phone), Required toggle, Description.
  Manual "Add Field" capability. Drag to reorder. Color-coded data type chips.
- Right panel: Live JSON schema preview (tree view + raw JSON toggle).
- Top actions: Test Schema, Retrain, Save, Deploy. Version indicator.

**Create New Schema Flow (Multi-Step Wizard):**
1. Upload sample documents (drag-and-drop, shows thumbnails + page count).
2. AI processes and generates suggested schema (lime green progress indicator).
3. Review & configure generated fields (editable table + JSON preview).
4. Test against a document (side-by-side: original doc viewer | extracted data).
   Lime green = matched fields, yellow/orange = low confidence.
5. Name, describe, save as Draft or Deploy.

### Feature 3: Training Files
- File table: Name, Type, Associated Schema, Upload Date, Pages, Uploaded By.
- Thumbnail preview on hover or side panel.
- Filter by schema. Add more training files to a schema.
- "Retest Schema" per file — runs extraction and shows results.
- Bulk select and bulk actions.

### Feature 4: Users & Roles
- User table: Name, Email, Role (Admin/Reviewer/Viewer), Status, Last Active,
  Documents Processed.
- Invite modal with role assignment.
- Role permission matrix.
- Approval level configuration (L1, L2, L3) with user assignment.

### Feature 5: Workflows
- Workflow list: Name, Steps, Status (Draft/Deployed/Paused), Linked Schema, Date.
- Visual step-based builder: Upload → Classify → Extract → Review L1 → Review L2
  → Approve → Export. Each step configurable with conditions and role assignment.
- Deploy/pause toggle.

### Feature 6: Deployments
- Active schemas and workflows overview with deploy/undeploy toggles.
- Deployment history logs with timestamps.

## Design System Tokens

| Token              | Value                                      |
|--------------------|--------------------------------------------|
| Primary            | #84CC16 (lime green)                       |
| Primary Hover      | #65A30D                                    |
| Primary Light      | #F7FEE7 (lime green tint for backgrounds)  |
| Background         | #FFFFFF                                    |
| Surface            | #F5F5F5                                    |
| Text Primary       | #374151                                    |
| Text Secondary     | #6B7280                                    |
| Border             | #E5E7EB                                    |
| Success            | #84CC16 (same as primary)                  |
| Warning            | #F59E0B                                    |
| Error              | #EF4444                                    |
| Border Radius      | 8px                                        |
| Font Family        | Inter, Plus Jakarta Sans, system sans-serif |

## Component Patterns

- **Primary Button:** Lime green bg, white text, 8px radius.
- **Secondary Button:** White bg, lime green border + text.
- **Tables:** Alternating white/light gray rows, lime green hover highlight.
- **Status Badges:** Lime green = Active, Gray = Draft, Muted = Archived.
- **Sidebar Active State:** Lime green left border + light lime tinted bg.
- **Empty States:** Friendly illustration + lime green "Get Started" CTA.
- **Loading:** Lime green skeleton loaders or progress bars.
- **Toasts:** Top-right slide-in. Lime green = success, Red = error.
- **Data Type Chips:** Color-coded — green/string, blue/number, orange/date,
  purple/boolean, teal/array.

## Design Constraints

- Desktop-first (responsive is secondary).
- No dark mode for MVP.
- Prioritize information density without clutter.
- Every action should have visible feedback (toasts, state changes, progress).
- Side-by-side layouts for document testing (doc viewer + extracted data).
- Multi-step wizards for complex flows (schema creation).

## Priority Screen Order (Admin)

1. Dashboard Home
2. Schema Manager — List View
3. Schema Detail / Edit Page
4. Create New Schema — Multi-Step Wizard
5. Schema Test View (document vs. extracted data side-by-side)
6. Training Files Page
7. User Management Page
8. Workflow Builder Page

## Usage Instructions for Design Agents

When generating any screen or component for Renuscule:
1. Always reference the Brand Identity and Design System Tokens above.
2. Use the Navigation Structure to maintain consistency across pages.
3. Follow the Component Patterns for all UI elements.
4. Respect the Priority Screen Order when generating in batch.
5. Reference the specific Feature descriptions for content and layout guidance.
6. When in doubt, choose white space and simplicity over density.