# PebbleFlow — UI Iteration Plan (Phase 2)
**Date:** 2026-03-17
**Scope:** Static UI prototype only — no backend/runtime implementation
**Prepared by:** Planning review of `static-ui/admin/` (10 files) + product context

---

## Sequential Thinking Breakdown

Before recommending specifics, this plan is grounded in the following step-by-step analysis:

1. **Inventory the current prototype** — read all 10 files, understand design language, structure, content, and gaps
2. **Identify reuse vs. build-new** — distinguish pages that can evolve vs. net-new pages required
3. **Define the two audiences** — admin/builder vs. operator/end-user and their separate navigation contexts
4. **Map the workflow-to-UI generation concept** — understand what kinds of pages a workflow node should "produce"
5. **Define node taxonomy** — categorize nodes by whether they configure process behavior or generate user-facing UI
6. **Propose domain scenarios** — anchor the new pages to concrete insurance, banking, and finance examples
7. **Sequence the MVP** — define the smallest set of pages that makes the concept legible

---

## 1. Current-State Assessment

### What Exists (10 files, all under `admin/`)

| File | Page | Status |
|---|---|---|
| `admin/dashboard.html` | Admin overview — 3 KPI cards + 2 chart placeholders | Keep, evolve |
| `admin/schema-library.html` | Schema grid (24 schemas shown as cards, 6 visible) | Keep, evolve |
| `admin/create-schema-step1.html` | Schema creation wizard — step 1 (name/type/description) | Keep |
| `admin/create-schema-step2.html` | Schema creation wizard — step 2 (upload training docs) | Keep |
| `admin/create-schema-step3.html` | Schema creation wizard — step 3 (processing spinner, auto-redirect in 3s) | Keep |
| `admin/create-schema-step4.html` | Schema creation wizard — step 4 (interactive field mapping with property panel) | Keep, refine |
| `admin/training-files.html` | Training/knowledge file management | Rename + evolve |
| `admin/users-roles.html` | User table with role tags (Admin, Reviewer, User), stats, invite | Keep, expand |
| `admin/workflows.html` | Workflow list with linear pipeline visualization, linked schema | Keep, expand |
| `admin/deployments.html` | Deployed schemas + workflows table with stats | Keep |

### What Can Be Reused
- **Design system:** All 10 files share the same `@theme` block (primary: lime `#84cc16`, Inter font, clean white/gray palette). This is solid and should become a shared `_theme.css` or inline include.
- **Sidebar layout:** The two-panel layout (sidebar + content) is consistent and works well. The sidebar component should be extracted to avoid copy-paste debt.
- **Schema card pattern:** The grid card with field tag chips works well for schemas; the same pattern can be reused for knowledge/policy documents and workflow templates.
- **Table pattern:** Used in users-roles and deployments — clean and reusable.
- **Step wizard pattern:** The 4-step schema creation wizard is good UX for any multi-step creation flow (workflows, intake forms).

### What Is Missing (Critical Gaps)
- **No workflow builder canvas** — `workflows.html` only lists workflows; there is no visual builder page.
- **No operator-facing pages** — zero files exist under `operator/`.
- **No approval queue pages** — the "pending reviews" KPI on the admin dashboard has no destination.
- **No case/task detail view** — there is no page for reviewing an individual submitted case or document.
- **No document intake portal** — no end-user-facing upload page generated from a workflow.
- **No schema-driven form page** — no auto-generated form experience.
- **No workflow detail/run history** — clicking a workflow in the list has no destination.
- **No schema detail view** — clicking a schema card has no destination.
- **No policy/knowledge management** — "Training Files" is an IDP term; for a workflow platform, this becomes a policy and knowledge library.
- **No role-based navigation concept** — operators (L0/L1/L2) and admin both use the same nav, but their experiences are fundamentally different.

### What Should Be Cleaned Up
- The `@theme` block and sidebar HTML are copy-pasted across all 10 files. In the next iteration, use a shared `_shared.css` + HTML include approach, or at minimum document a shared snippet that all pages use.
- `admin/training-files.html` is named for a low-level IDP concept; it should be renamed to `admin/knowledge/index.html` to represent the broader policy/knowledge library.
- The `create-schema-step*.html` files should be moved to `admin/schemas/create-step*.html`.
- The nav label "Training Files" should become "Knowledge Base" in the sidebar.
- `admin/workflows.html` should move to `admin/workflows/index.html` to allow sibling pages (builder, detail).

---

## 2. Proposed Folder Structure

### Recommended `static-ui/` Tree

```
static-ui/
│
├── admin/                                  # Admin / builder persona
│   ├── dashboard.html                      # EVOLVE — workflow platform admin dashboard
│   │
│   ├── workflows/
│   │   ├── index.html                      # MOVE: rename from admin/workflows.html
│   │   ├── builder.html                    # NEW: visual workflow builder canvas
│   │   └── detail.html                     # NEW: workflow run history + deployed portals
│   │
│   ├── schemas/
│   │   ├── index.html                      # MOVE: rename from admin/schema-library.html
│   │   ├── detail.html                     # NEW: schema detail — fields, linked workflows, training docs
│   │   ├── create-step1.html               # MOVE from create-schema-step1.html
│   │   ├── create-step2.html               # MOVE from create-schema-step2.html
│   │   ├── create-step3.html               # MOVE from create-schema-step3.html
│   │   └── create-step4.html               # MOVE from create-schema-step4.html
│   │
│   ├── knowledge/
│   │   └── index.html                      # RENAME/EVOLVE: from training-files.html
│   │
│   ├── users-roles.html                    # KEEP — expand with permission levels (L0/L1/L2)
│   └── deployments.html                    # KEEP — expand with "Generated Portals" section
│
└── operator/                               # Operator / end-user persona (generated from workflow)
    │
    ├── dashboard.html                      # NEW: role-aware operator home
    │
    ├── queue/
    │   ├── index.html                      # NEW: work queue — all tasks assigned to current role
    │   └── case-detail.html                # NEW: individual case/task detail with document + fields
    │
    ├── approvals/
    │   ├── index.html                      # NEW: approval queue by role level
    │   └── approve-detail.html             # NEW: approve/reject/escalate a specific item
    │
    └── intake/
        ├── document-upload.html            # NEW: end-user document intake portal
        └── form.html                       # NEW: schema-driven auto-generated form
```

### Page Migration Map

| Current File | New Path | Action |
|---|---|---|
| `admin/dashboard.html` | `admin/dashboard.html` | Evolve in place |
| `admin/workflows.html` | `admin/workflows/index.html` | Move + rename |
| `admin/schema-library.html` | `admin/schemas/index.html` | Move + rename |
| `admin/create-schema-step1.html` | `admin/schemas/create-step1.html` | Move |
| `admin/create-schema-step2.html` | `admin/schemas/create-step2.html` | Move |
| `admin/create-schema-step3.html` | `admin/schemas/create-step3.html` | Move |
| `admin/create-schema-step4.html` | `admin/schemas/create-step4.html` | Move |
| `admin/training-files.html` | `admin/knowledge/index.html` | Rename + evolve |
| `admin/users-roles.html` | `admin/users-roles.html` | Evolve in place |
| `admin/deployments.html` | `admin/deployments.html` | Evolve in place |

---

## 3. Product and UX Definition

### Product Vision

PebbleFlow is a **policy-driven workflow platform and application generator** for document-intensive operations in insurance, banking, and enterprise finance.

It is not a generic automation tool. The key differentiators:

1. **Schema-aware:** Every intake, validation, and review step is grounded in a document schema that defines what to collect, extract, and verify.
2. **Workflow = application:** When an admin publishes a workflow, it automatically generates the operator-facing pages, approval queues, and case management views — without custom front-end development.
3. **Policy-native:** Decision and verification nodes are not just routing logic; they encode policy rules and can explain why a case passes or fails.
4. **Role-driven UI:** The same workflow auto-generates different UI experiences per role. An L0 agent sees an intake checklist; an L2 underwriter sees a full risk summary with exception flags.

### Target Personas

| Persona | Role | Interface |
|---|---|---|
| **Workflow Admin** | Designs workflows, manages schemas, deploys portals | `admin/` |
| **L0 Operator / Reviewer** | Processes incoming cases from a work queue | `operator/queue/` |
| **L1 Supervisor / Approver** | Reviews escalations, makes first-level approvals | `operator/approvals/` |
| **L2 Senior Approver / Underwriter** | Makes final decisions, exception handling | `operator/approvals/` (filtered view) |
| **End User / Applicant** | Submits documents and fills forms via a generated intake portal | `operator/intake/` |

### How PebbleFlow Differs from n8n

| Dimension | n8n | PebbleFlow |
|---|---|---|
| Primary output | API/webhook automation | Operational portals and case queues |
| Domain focus | Generic integration | Insurance, banking, finance document ops |
| Schema awareness | None | Central — every node is schema-linked |
| UI generation | None | Core feature — nodes generate pages |
| Human-in-loop | Webhooks only | First-class approval/review nodes |
| Role model | Technical users | Business operators + end users |
| Document IQ | None | Classification, extraction, identity |

### Workflow-Driven UI Generation (in UI Terms)

A workflow in PebbleFlow is both a **process definition** and an **application specification**. When a workflow is published:

- Document intake nodes generate → `operator/intake/document-upload.html`
- Form nodes generate → `operator/intake/form.html`
- Review/assignment nodes generate → `operator/queue/case-detail.html`
- Approval nodes generate → `operator/approvals/approve-detail.html`
- The set of approval nodes assigned to a role auto-populates → that role's sidebar menu

In the static prototype, we represent this concept by building example "generated" pages for each of the 4 domain scenarios and labeling them clearly as workflow-generated outputs.

---

## 4. Information Architecture and Page Map

### Admin Area Navigation (`admin/`)

```
Sidebar Nav (Admin):
├── Dashboard
├── Workflows
│   └── [opens workflows/index.html]
├── Schemas
│   └── [opens schemas/index.html]
├── Knowledge Base
│   └── [opens knowledge/index.html]
├── Users & Roles
└── Deployments
```

**Page descriptions:**

- **Dashboard** — system health, KPIs, recent workflow activity, pending approval counts by role, quick-links to builders
- **Workflows > Index** — workflow library: cards with status, linked schema, step visualization, edit/run/archive actions
- **Workflows > Builder** — visual node canvas (see Section 5); the centrepiece new page
- **Workflows > Detail** — run history, deployed portal links, performance metrics per step
- **Schemas > Index** — current schema-library.html; add "Linked Workflows" column to cards
- **Schemas > Detail** — full field list, training document count, linked workflows, version history
- **Schemas > Create (4 steps)** — keep as-is, move to correct folder
- **Knowledge Base** — uploaded policy documents, product rules, coverage terms; each linked to a schema or workflow
- **Users & Roles** — expand with "Permission Level" column (L0/L1/L2) + role-to-workflow assignment
- **Deployments** — add "Generated Portals" section showing links to operator portal pages

### Operator Area Navigation (`operator/`)

The operator sidebar is **role-filtered**. An L0 user does not see the L2 approval menu.

```
Sidebar Nav (L0 Operator):
├── My Dashboard
├── Work Queue         [tasks assigned to me]
└── [workflow-generated intake links if applicable]

Sidebar Nav (L1 Supervisor):
├── My Dashboard
├── Work Queue
├── Approvals          [items escalated to L1]
└── Reports

Sidebar Nav (L2 Senior Approver):
├── My Dashboard
├── Approvals          [final decisions]
├── Exceptions
└── Reports
```

### Cross-Area Connection Points

| Admin Page | Connects To | Via |
|---|---|---|
| Deployments | `operator/` portal | "View Portal" link |
| Workflow Detail | `operator/queue/index.html` | "View Work Queue" link |
| Approval node config | `operator/approvals/index.html` | Auto-generated on deploy |
| Schema + Document intake node | `operator/intake/document-upload.html` | Auto-generated on deploy |
| Form node | `operator/intake/form.html` | Auto-generated on deploy |

---

## 5. Workflow UI Model

### Node Categories

Nodes fall into two classes:

#### A. Process / Configuration Nodes (no UI generated)
These execute automatically or route data — they do not produce a user-facing page.

| Node | Purpose | Domain Example |
|---|---|---|
| Trigger | Starts a workflow (API call, form submit, schedule) | "New claim received via API" |
| Document Classify | Identifies document type against schema | "Is this an EOB or a CMS-1500?" |
| Document Extract | Extracts fields from a classified document | "Extract Invoice #, Date, Total Amount" |
| Policy Validate | Checks extracted data against policy rules | "Is claim amount within covered limit?" |
| Scoring | Computes a risk/credit/completeness score | "Credit score calculation" |
| Decision / Route | Branches workflow based on rules or score | "Score < 600 → manual review" |
| Notification | Sends email/SMS/system notification | "Notify applicant document is missing" |
| Integration / Handoff | Sends data to ERP, core banking, HRIS | "Post approved invoice to SAP" |

#### B. UI-Generating Nodes (produce operator-facing pages)
These nodes have a **"Generated Page" property** visible in the builder. When the workflow is deployed, these nodes produce static portal pages automatically.

| Node | Generated Page | Description |
|---|---|---|
| **Document Intake** | `operator/intake/document-upload.html` | End-user upload portal; document requirements driven by linked schema; uploaded docs are auto-classified |
| **Form** | `operator/intake/form.html` | Auto-generated form from schema fields; supports field pre-population from extracted values |
| **Human Review / Assignment** | `operator/queue/case-detail.html` | Operator sees case with extracted fields, document viewer, flags, and action buttons |
| **Approval** | `operator/approvals/approve-detail.html` | Role-specific approval view with decision (approve/reject/escalate), notes, and audit trail |
| **Approval Queue** | `operator/approvals/index.html` | Aggregated list of items awaiting approval for a given role; generated from all approval nodes assigned to that role |
| **Status Tracker** | `operator/intake/status.html` (future) | External-facing case status page for applicant |

### Node Appearance in the Builder

Each node renders as a **card on the canvas** with:

- Icon + node type label (top)
- Schema linkage indicator (if applicable)
- A "Generates UI" badge (lime green) on UI-generating nodes
- A collapsed/expanded state
- Right-side connector ports

Example visual representation (text mockup):

```
┌────────────────────────────────────┐
│ 📄 Document Intake          [⚡ UI] │
│ ─────────────────────────────────  │
│ Schema: Insurance_Claim_v1         │
│ Required docs: EOB, CMS-1500       │
│ Generated: intake/upload.html      │
└────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────┐
│ 🔍 Document Classify               │
│ ─────────────────────────────────  │
│ Model: SCH_3310_M                  │
│ Confidence threshold: 0.85         │
└────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────┐
│ ✅ Approval                 [⚡ UI] │
│ ─────────────────────────────────  │
│ Assigned to: L1 Reviewer           │
│ Generated: approvals/queue.html    │
└────────────────────────────────────┘
```

### Domain Examples Per Node Category

**Insurance Claim Adjudication:**
- Document Intake → collects EOB, CMS-1500, referral letter
- Document Classify → identifies claim type
- Policy Validate → checks against policy terms (coverage, exclusions)
- Decision → payable / not payable / requires manual review
- Approval (L1) → reviewer approves or rejects with notes

**Banking Credit Onboarding:**
- Document Intake → collects ID, income proof, bank statements
- Document Extract → extracts salary, account holder, credit bureau data
- Scoring → computes credit score using extracted values
- Decision → auto-approve / manual review / decline
- Approval (L2 Underwriter) → exception handling for borderline scores

**Finance Cost Posting:**
- Document Intake → collects invoice, purchase order, delivery note
- Document Validate → checks PO number, amounts, vendor
- Human Review (L0) → operator verifies completeness checklist
- Approval (L1 Finance) → approves for ERP posting
- Integration → sends to SAP/Oracle

**Insurance Onboarding:**
- Form Node → collects applicant information and coverage preferences
- Document Intake → collects ID, prior insurance certificates
- Policy Validate → validates eligibility against product rules
- Approval (L1) → underwriter approves policy terms
- Notification → sends policy confirmation to applicant

---

## 6. MVP UI Recommendation

### Build First (Priority 1 — Make the concept legible)

These pages are the minimum to demonstrate the workflow platform concept and the admin-to-operator connection.

| Page | Why First |
|---|---|
| `admin/workflows/builder.html` | The centrepiece new screen; anchors the entire product vision |
| `admin/workflows/index.html` | Update nav + link to builder and detail |
| `operator/dashboard.html` | Shows the role-filtered experience concept |
| `operator/queue/index.html` | Work queue is the first operator touchpoint |
| `operator/queue/case-detail.html` | Shows the generated case review experience |
| `operator/approvals/approve-detail.html` | Shows the approval decision UI |

### Build Second (Priority 2 — Complete the loop)

| Page | Why Second |
|---|---|
| `admin/workflows/detail.html` | Connects admin view to deployed portals |
| `operator/intake/document-upload.html` | Shows the end-user entry point |
| `operator/intake/form.html` | Shows schema-driven auto-form generation |
| `admin/schemas/detail.html` | Schema detail view — linkages to workflows |
| `admin/deployments.html` (update) | Add "Generated Portals" section |

### Defer (Priority 3)

- `operator/approvals/index.html` (approval queue list)
- `admin/knowledge/index.html` (rename training-files is easy, enriching content can wait)
- Users & roles expansion (L0/L1/L2 columns)
- Status tracker for applicants
- Workflow run history / analytics detail

### 4 Anchor Workflow Scenarios for Static Exploration

These 4 scenarios should each be represented by a brief annotated page or section in the static prototype, demonstrating how the workflow generates the downstream operator experience.

#### Scenario 1 — Insurance Onboarding
- **Admin side:** Builder shows nodes: Form → Document Intake → Policy Validate → Approval (L1) → Notification
- **Operator side:** `intake/form.html` (applicant fills coverage info), `approvals/approve-detail.html` (underwriter reviews)
- **Key UI concept:** Form node auto-generates fields from the "InsuranceApplication_v1" schema

#### Scenario 2 — Insurance Claim Adjudication
- **Admin side:** Builder shows: Document Intake → Classify → Extract → Policy Validate → Decision → Approval (L1)
- **Operator side:** `queue/case-detail.html` (reviewer sees claim with extracted fields + policy match result), `approvals/approve-detail.html`
- **Key UI concept:** Decision node surface shows why claim passes/fails; reviewer can override with notes

#### Scenario 3 — Finance Cost Posting with Document Validation
- **Admin side:** Builder shows: Document Intake (Invoice + PO) → Validate → Human Review (L0) → Approval (L1 Finance) → ERP Handoff
- **Operator side:** `queue/case-detail.html` (L0 verifies completeness checklist), `approvals/approve-detail.html` (L1 Finance approves for posting)
- **Key UI concept:** Completeness checklist auto-generated from "Invoice_Standard_v2" schema required fields

#### Scenario 4 — Banking Credit Underwriting
- **Admin side:** Builder shows: Document Intake → Extract → Scoring → Decision → Approval (L2 Underwriter)
- **Operator side:** `queue/case-detail.html` (underwriter sees credit score, extracted income, exception flags), `approvals/approve-detail.html`
- **Key UI concept:** Scoring node output surface with breakdown visible to L2 approver in case detail

---

## 7. Risks and Open Questions

### UX Complexity

| Risk | Details |
|---|---|
| Builder canvas complexity | A node-graph canvas (n8n-style) is the most technically complex UI. Even in static form, representing the canvas convincingly requires careful design of node cards, connection lines, the sidebar palette, and canvas controls. Consider whether a simplified "flowchart-style" builder (vertical steps) is sufficient for the static prototype. |
| Operator nav proliferation | If a user is assigned to multiple workflows with different approval levels, their sidebar could become cluttered. A "by-workflow" grouping of the sidebar vs. a flat "by-task-type" grouping needs a product decision. |
| End-user intake simplicity | The intake portal must feel simple and reassuring to applicants. It cannot look like an admin tool. A distinct visual style for `operator/intake/` pages (vs. the admin shell) may be needed. |

### Schema-to-UI Generation Complexity

| Risk | Details |
|---|---|
| Field type rendering | Different schema field types (text, date, currency, table, document reference) need different UI controls. The static prototype should show at least 4-5 field types in generated forms. |
| Optional vs. required fields | The generated form and intake checklist must distinguish required vs. optional document/field requirements. This needs to be visible in the static prototype. |
| Multi-document intake | Some workflows require multiple document types in one intake step. The static UI needs a clear UX for "which documents have been submitted and which are missing". |

### Authorization and Dashboard Complexity

| Risk | Details |
|---|---|
| Role-based sidebar generation | In production, the sidebar is generated from the user's role and their workflow assignments. In the static prototype, this must be simulated manually. Consider building 2-3 distinct operator HTML pages (one per role type) to show the concept clearly. |
| L0/L1/L2 permission granularity | The current users-roles page uses role labels (Admin, Reviewer, User). These need to map to L0/L1/L2 permission levels. A product decision is needed: are L0/L1/L2 hardcoded system roles or configurable per-workflow? |

### Unclear Assumptions (Require Product Decisions)

1. **Who accesses `operator/intake/` pages?** — Is the applicant an external user with no login, or a registered external user? This affects whether intake pages need authentication context or are public/token-based.
2. **Is the builder always node-graph (canvas) or can workflows also be configured as a linear wizard?** — The current workflow cards suggest linear sequences. Is a full canvas needed in MVP or should a step-list builder suffice?
3. **What does "deploy a workflow" mean in the UI?** — Does deployment create a tenant-specific URL? Does the admin get a shareable link for the intake portal? The Deployments page needs to show this concept clearly.
4. **What is the difference between "Training Files" (current) and "Knowledge Base" (proposed)?** — In the proposed model, knowledge documents include both IDP training samples AND policy documents / product rules referenced by policy validation nodes. These two concepts should be clarified before rebuilding the knowledge section.
5. **Multi-tenant or single-tenant context?** — The static prototype currently has no concept of tenants or environments (dev/staging/prod). Deployments page should indicate whether this matters.
6. **What exactly does a schema represent in a workflow context?** — Currently schemas are document extraction schemas (field-level). Do they also define the data model for form generation? If so, the schema model needs to be enriched to include field types, validation rules, and UI hints.

---

## Appendix A: Current Design System Reference

All pages use:
- **Framework:** Tailwind CSS v4 CDN (`@tailwindcss/browser@4`)
- **Font:** Inter (Google Fonts)
- **Primary color:** `#84cc16` (lime green)
- **Brand name:** RENUSCULE
- **Layout:** Fixed sidebar (256px) + full-height content area
- **Header:** Fixed 64px top bar inside content area
- **Background:** `#f9fafb` (page), `#ffffff` (cards/panels)

This design system should remain consistent across both `admin/` and `operator/`, with:
- Admin area: current lime accent, white sidebar
- Operator area: same colors, but potentially a simplified sidebar (fewer items, more task-focused)
- Intake portal: minimal branding, cleaner/lighter layout suitable for external applicants

---

## Appendix B: Summary of Net-New Pages Required

| Page | Path | Priority |
|---|---|---|
| Workflow Builder Canvas | `admin/workflows/builder.html` | P1 |
| Workflow Detail / Run History | `admin/workflows/detail.html` | P2 |
| Schema Detail | `admin/schemas/detail.html` | P2 |
| Operator Dashboard | `operator/dashboard.html` | P1 |
| Work Queue List | `operator/queue/index.html` | P1 |
| Case / Task Detail | `operator/queue/case-detail.html` | P1 |
| Approval Decision | `operator/approvals/approve-detail.html` | P1 |
| Approval Queue List | `operator/approvals/index.html` | P3 |
| Document Intake Portal | `operator/intake/document-upload.html` | P2 |
| Schema-Driven Form | `operator/intake/form.html` | P2 |

**Total net-new pages: 10**
**Total pages moved/renamed: 7** (no content changes needed, just relocated)
**Total pages evolved in-place: 3** (`dashboard.html`, `users-roles.html`, `deployments.html`)
