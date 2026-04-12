# Workflow Engine — Design Discussion

**Date:** April 9, 2026  
**Status:** In Progress — capturing design decisions and open questions  
**Related:** [PRD-pebbleflow-workflow-engine.md](./PRD-pebbleflow-workflow-engine.md)

---

## What We're Building

A generalized workflow engine on top of PebbleFlow's document extraction. The goal: make document-intensive, human-in-the-loop business processes **repeatable and trackable** — define a workflow once, run it many times as process instances.

Target domains:
- **AP / Cost Cycle** — vendor invoices, cost items → ERP posting
- **Insurance Claims** — claim forms under a policy → approval + payout
- **Loan Underwriting** — credit facility application → decision + disbursement
- **KYC / Onboarding** — document bundle → compliance approval

---

## Decision Log

### D1: Two Layers — Definition vs Instance

A **Workflow** is a reusable template (recipe). A **Process Instance** is one execution of that template (a meal being cooked).

- Admin defines the workflow once in the canvas builder
- Every document set / transaction that enters creates one Process Instance
- Operators see a table of instances — each row = one trackable case

**Locked in.**

---

### D2: Status Model — Stage-Owned Display Status

Instead of a single `macro_status` field on the instance, each **stage node** defines its own `display_status` label. The admin sets this when building the workflow.

```
workflow_stages
  display_status    -- "Awaiting Approval", "Under Review", "Posting to ERP", "Posted"
  stage_category    -- active | auto | done | rejected   (for filtering + badge color)
  is_terminal       -- boolean: does reaching this stage close the instance?
```

- `display_status` → what the operator reads (workflow-specific, meaningful)
- `stage_category` → how the system filters and colors badges (cross-workflow, generic)
- `is_terminal` → engine logic: when true, the instance is closed on reaching this stage

`stage_category` and `is_terminal` are separate concerns:
- `stage_category` = what is the instance doing **while at this stage**
- `is_terminal` = does reaching this stage **end the workflow**

Example: an Integration stage (auto-posting to ERP) is `stage_category: auto` while running. If it's the last step, it is also `is_terminal: true`.

Validation rule: `is_terminal = false` → `on_complete` must point to another stage. `is_terminal = true` → `on_complete` must be null.

**Locked in.**

---

### D3: Instance Initiation — Manual (MVP) + API-Triggered (V2)

- **MVP**: A logged-in user manually uploads documents and starts a case from the UI
- **V2**: External systems trigger instance creation via `POST /api/v1/workflow/{id}/instances`

**Locked in.**

---

### D4: Subject Hierarchy — Container + Item Relationship

Some workflows operate on items that belong to a parent entity. Others operate on standalone entities. Three real-world patterns identified:

**Pattern A — Cost/AP Cycle (Contract → Cost Items)**
```
Contract (umbrella)
  └── Cost Item A  → Process Instance  (accrual or real-time ERP posting)
  └── Cost Item B  → Process Instance
  └── Cost Item C  → Process Instance
```
A contract generates many cost items. Each cost item is individually posted to ERP (either accrued or real-time). The cost item is what goes through the workflow; the contract is just context.

**Pattern B — Insurance (Policy → Claims)**
```
Policy (umbrella)
  └── Claim #001  → Process Instance
  └── Claim #002  → Process Instance
```
Similar structure to Pattern A. A policy is the umbrella; individual claims go through the claims workflow.

**Pattern C — Underwriting (Standalone)**
```
Credit Facility  → Process Instance  (no parent, standalone)
```
A credit facility is a single, self-contained entity. There is no umbrella above it. The facility IS the subject being processed.

**Proposed model (revised in D5):**

See D5 for the extended 3-level hierarchy model.

Operator can filter/group by `context_id` — "show all cost items under Contract ABC."

**Status: Q1 resolved — contracts as subjects is valid. A contract can be both a `context_type` (for child instances) and a `subject_type` (in its own approval instance). No model change needed.**

---

### D5: 3-Level Subject Hierarchy

Real-world workflows sometimes span three levels of business hierarchy, not just two:

- **Construction**: Project → Purchase Order → Invoice
- **Trade Finance**: Client → Letter of Credit → Drawing/Presentation
- **Portfolio Lending**: Portfolio → Facility → Drawdown

The 2-level model from D4 is extended with an optional second context level. All context levels are nullable — depth varies per workflow.

```
process_instances
  subject_id / subject_type          -- the thing being processed
  context_id / context_type          -- nullable: immediate parent (L1)
  context_label
  context_2_id / context_2_type      -- nullable: grandparent (L2, optional)
  context_2_label
```

Operator table adapts to the workflow's configured depth:

```
│ Subject              │ Under (L1)         │ Under (L2)     │ Stage          │ Status    │
│ Invoice #123         │ PO #001            │ Project Alpha  │ AP Review      │ Pending   │
│ Cost Item #124       │ Contract ABC       │ —              │ ERP Post       │ Auto      │
│ Claim #2201          │ Policy POL-00123   │ —              │ Adjuster Review│ Pending   │
│ Credit Facility #F09 │ —                  │ —              │ Underwriting   │ In Review │
```

L2 column is hidden when the workflow doesn't use it.

**Locked in.**

---

### D6: Amendment / Revision Linking

Some process instances are amendments or revisions of a prior case (e.g., Contract Amendment → relates to original Contract Approval). The new instance's relationship is to another *instance*, not just a business entity.

Model: a nullable self-referential FK on `process_instances`:

```sql
parent_instance_id  TEXT REFERENCES process_instances(id)  -- nullable
```

UX: when creating a new case, an optional "Relates to prior case" search field lets the operator manually link to an existing instance.

In case detail view, if `parent_instance_id` is set, a "View original case →" link is shown.

This is a **separate concern from the context hierarchy** — `context_id` groups items under a business entity; `parent_instance_id` links one instance to a prior instance.

**Locked in.**

---

### D7: Per-Workflow Context Labels

The `workflows` table declares what each context level represents, so the UI can adapt:

```sql
workflows
  subject_label     TEXT   -- "Invoice" | "Claim" | "Credit Facility"
  context_1_label   TEXT   -- nullable: "Purchase Order" | "Policy" | "Contract"
  context_2_label   TEXT   -- nullable: "Project" | "Client" | null
```

- `context_2_label = null` → L2 column hidden in operator table and new-case form
- Operator table column headers use these labels
- New case initiation form prompts for the correct entity names

**Locked in.**

---

### D8: Documents Are Evidence — The Subject of Approval is the Business Entity

Documents are inputs that inform the decision. The subject of approval is always the **business entity** (cost_item, claim, credit_facility) — not the document.

This means:
- `subject_type` is always a business entity type, never "document"
- An instance can hold multiple documents (all providing evidence for one decision)
- The workflow makes decisions about the entity, using extracted data from documents

Multi-document instances are supported in `instance_documents` (multiple rows per instance). Each document is extracted separately.

**Locked in.**

---

### D9: Multi-Document Case Detail — Tab Per Document

When a process instance holds multiple documents (e.g., a 10-document loan application bundle: ID, financial statement, collateral docs), the case detail view presents:

- **One tab per document**
- Each tab shows that document's extracted fields table (field | value | confidence)
- Operators review each document's extraction separately

**Locked in.**

---

### D10: New Stage Type — `lookup` (Inbound Integration)

The existing `integration` stage is outbound-only (POST data to external system). Some workflows need to **query** an external system before making a routing decision — e.g., "check ERP if this cost item has already been posted."

New stage type: `lookup`

```json
// Lookup stage config example
{
  "lookup_url": "https://erp.company.com/api/check-posting",
  "method": "GET",
  "query_params": { "cost_item_id": "{{subject_id}}", "period": "{{extracted.period}}" },
  "store_result_as": "erp_posting_status"
}
```

- Admin configures URL + params with field placeholders (`{{subject_id}}`, `{{extracted.field_name}}`)
- Result stored in instance context as `lookup.<result_name>` (e.g., `lookup.erp_posting_status`)
- Downstream condition (Switch) nodes can then branch on this value
- Transition uses `on_complete` column (like `ai_extractor` and `integration`)

**Locked in.**

---

### D11: Condition Node → Multi-Branch Switch Node (n8n-style)

The original binary condition node (`on_complete` / `on_reject`) is replaced by a **multi-branch Switch node**. This allows complex routing decisions with N named branches, evaluated top-down by priority.

Rules can reference:
- Extracted fields from **any document** in the instance (`doc.<schema_field>`)
- Lookup results (`lookup.<result_name>`)
- Subject metadata (`subject_id`, `subject_type`)

```json
// Switch stage config example — cost item posting decision
{
  "branches": [
    {
      "label": "Already Posted",
      "priority": 1,
      "rules": [{ "field": "lookup.erp_posting_status", "op": "eq", "value": "posted" }],
      "next_stage_id": "stage_reject_duplicate"
    },
    {
      "label": "Amount Mismatch",
      "priority": 2,
      "rules": [{ "field": "invoice.amount", "op": "neq", "compare_to_field": "po.amount" }],
      "next_stage_id": "stage_manual_review"
    },
    {
      "label": "Period Closed — Accrue",
      "priority": 3,
      "rules": [{ "field": "lookup.period_status", "op": "eq", "value": "closed" }],
      "next_stage_id": "stage_accrue"
    },
    {
      "label": "Default — Post Real-Time",
      "priority": 99,
      "rules": [],
      "next_stage_id": "stage_erp_post_realtime"
    }
  ]
}
```

Branches are evaluated top-down. The first branch whose rules all pass is taken. A branch with empty `rules` acts as a catch-all default.

**Locked in.**

---

### D13: Operator Nav — Dynamically Composed from Workflow Assignments (resolves Q4 / PRD Q1)

One shell for all roles. Admins always see the full static nav. Operators do **not** get a hardcoded role-based menu — their nav is **dynamically composed** from the stage types in the workflows they are assigned to.

On login, the frontend fetches the user's assigned workflow stages and builds the nav from the stage types present:

| Stage type assigned to operator's group | Nav item shown |
|---|---|
| `user_task` | My Queue / Review |
| `approval` | Approvals |
| `integration` | *(system-only — no menu item)* |
| `ai_extractor` | *(system-only — no menu item)* |
| `lookup` | *(system-only — no menu item)* |
| `condition` | *(system-only — no menu item)* |

If an operator is assigned to only `user_task` stages, they only see "My Queue". If they are assigned to both `user_task` and `approval` stages (across one or more workflows), they see both "My Queue" and "Approvals".

This scales naturally: adding a new operator-facing stage type adds a menu entry without touching role definitions.

**Locked in.**

---

### D12: Stage Transition Model Split

Two different transition models, depending on stage type:

| Stage Type | Transition Storage |
|---|---|
| `ai_extractor` | `on_complete` column |
| `user_task` | `on_complete` / `on_reject` columns |
| `approval` | `on_complete` / `on_reject` columns |
| `integration` | `on_complete` column |
| `lookup` | `on_complete` column |
| `condition` (Switch) | `config.branches[]` — `on_complete` and `on_reject` unused |
| `sub_workflow` | `on_complete` column (fires when child instance closes) |

**Locked in.**

---

## Use Cases Evaluated Against the Model

| Use Case | Pattern | Context Levels | Notes |
|---|---|---|---|
| AP/Invoice (Contract → Invoice) | A | L1 = Contract | — |
| AP/Invoice (Project → PO → Invoice) | A extended | L1 = PO, L2 = Project | Uses D5 L2 context |
| Insurance (Policy → Claim) | B | L1 = Policy | — |
| Loan Underwriting | C | None (standalone) | — |
| KYC / Onboarding | C | None (standalone) | — |
| Vendor Onboarding | C | None (standalone) | — |
| Healthcare Prior Authorization | B | L1 = Member/Policy | — |
| Trade Finance (Client → LC → Drawing) | A extended | L1 = LC, L2 = Client | Uses D5 L2 context |
| HR Hiring (Job Req → Candidate) | B | L1 = Job Requisition | — |
| Contract Approval | C | None (standalone) | `subject_type = "contract"` — separate instance |
| Contract Amendment | — | None | `parent_instance_id` → original contract approval |
| Cost Posting (multi-doc + ERP check) | A | L1 = Contract | Uses `lookup` + `condition` Switch node |

---

## Full Data Model (Revised)

```sql
-- Reusable workflow template
workflows
  id              TEXT PRIMARY KEY
  name            TEXT
  description     TEXT
  trigger_type    TEXT   -- "manual" | "api"
  status          TEXT   -- "draft" | "active" | "archived"
  subject_label   TEXT   -- e.g. "Invoice", "Claim", "Credit Facility"
  context_1_label TEXT   -- nullable: "Purchase Order", "Policy", "Contract"
  context_2_label TEXT   -- nullable: "Project", "Client"
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Steps within a workflow
workflow_stages
  id                    TEXT PRIMARY KEY
  workflow_id           TEXT REFERENCES workflows(id)
  name                  TEXT
  type                  TEXT   -- "ai_extractor" | "user_task" | "approval" | "condition" | "integration" | "lookup"
  position              INT    -- ordering on canvas
  display_status        TEXT   -- shown to operator: "Awaiting Approval", "Posted", etc.
  stage_category        TEXT   -- "active" | "auto" | "done" | "rejected"
  is_terminal           BOOLEAN
  responsible_group_id  TEXT   -- nullable, FK to user_groups
  config                JSONB  -- stage-type-specific config:
                               --   ai_extractor: { schema_id, auto_advance_threshold }
                               --   condition (Switch): { branches: [{label, priority, rules[], next_stage_id}] }
                               --   integration: { webhook_url, payload_mapping }
                               --   lookup: { lookup_url, method, query_params, store_result_as }
  on_complete           TEXT   -- FK to workflow_stages.id; unused for condition/Switch nodes
  on_reject             TEXT   -- FK to workflow_stages.id; nullable; only for user_task and approval

-- One row per case / document set being processed
process_instances
  id                  TEXT PRIMARY KEY   -- e.g., "PROC-2026-0421"
  workflow_id         TEXT REFERENCES workflows(id)
  title               TEXT               -- human-readable: "Invoice #5021 — PT Maju Jaya"
  current_stage_id    TEXT REFERENCES workflow_stages(id)
  assigned_group_id   TEXT

  -- Subject: the business entity being processed
  subject_id          TEXT
  subject_type        TEXT               -- "cost_item" | "claim" | "credit_facility" | "contract" | ...

  -- Context Level 1: immediate parent entity (nullable)
  context_id          TEXT
  context_type        TEXT               -- "purchase_order" | "policy" | "contract" | ...
  context_label       TEXT               -- "PO #001 — Office Supplies"

  -- Context Level 2: grandparent entity (nullable, optional)
  context_2_id        TEXT
  context_2_type      TEXT               -- "project" | "client" | ...
  context_2_label     TEXT               -- "Project Alpha"

  -- Amendment / revision chain (nullable)
  parent_instance_id  TEXT REFERENCES process_instances(id)

  initiated_by        TEXT               -- user_id or "api"
  created_at          TIMESTAMP
  updated_at          TIMESTAMP
  due_date            TIMESTAMP

-- Documents attached to a case (multiple per instance)
instance_documents
  id                TEXT PRIMARY KEY
  instance_id       TEXT REFERENCES process_instances(id)
  schema_id         TEXT
  file_ref          TEXT
  extracted_fields  JSONB   -- [{ key, value, confidence }]
  uploaded_at       TIMESTAMP

-- Audit trail of every action taken on a case
instance_stage_history
  id            TEXT PRIMARY KEY
  instance_id   TEXT REFERENCES process_instances(id)
  stage_id      TEXT REFERENCES workflow_stages(id)
  actor_id      TEXT   -- user_id or "system"
  action        TEXT   -- "approved" | "rejected" | "requested_info" | "advanced" | "corrected_field"
  notes         TEXT
  entered_at    TIMESTAMP
  exited_at     TIMESTAMP
```

---

### D14: Sub-Workflow Stage Type (resolves Q2)

Domain-specific routing logic (e.g., accrual vs real-time posting) is not a platform concern. However, the underlying pattern is valid and generalized: **a Switch node branch can route to an entirely different workflow**, not just another stage.

New stage type: `sub_workflow`

```json
// Sub-workflow stage config
{
  "workflow_id": "wf_accrual-posting",
  "wait_for_completion": true
}
```

Behavior:
- Parent instance pauses at the `sub_workflow` node
- A child process instance is created running the referenced workflow
- When the child instance reaches a terminal stage, the parent advances via `on_complete`
- Child instance is linked to the parent via `parent_instance_id`

This keeps individual workflows small and reusable. A Switch node decides which sub-workflow to invoke; the sub-workflow has no knowledge of its caller.

Stage transition model addition:

| Stage Type | Transition Storage |
|---|---|
| `sub_workflow` | `on_complete` column (fires when child closes) |

`workflow_stages.config` for `sub_workflow`:
```sql
-- config JSONB: { workflow_id TEXT, wait_for_completion BOOLEAN }
```

**Locked in.**

---

### D15: Context — nullable `context_id` is sufficient (resolves Q3)

For insurance and similar domains, some subjects may not have a parent entity (e.g., a one-time claim with no parent policy). The existing model already handles this — `context_id` is nullable. No model change needed.

**Locked in.**

---

### D16: Partial Auto-Advance — Whole Case Goes to Manual Review (resolves Q6)

If any extracted field falls below the confidence threshold, the **entire case** is routed to manual review — not just the failing field. The case detail view highlights low-confidence fields for the operator to correct, but the routing decision is binary: pass all thresholds → auto-advance; any field fails → manual review.

This is simpler and more predictable for operators. Partial field-level routing adds complexity with little benefit at MVP.

**Locked in.**

---

## Open Questions

*No open questions remaining.*

---

## Next Steps

- [ ] Write formal `DATA-MODEL.md` with full table definitions, indexes, constraints
- [ ] Update [PRD-pebbleflow-workflow-engine.md](./PRD-pebbleflow-workflow-engine.md) data model section with D2 + D4–D16 decisions
- [ ] Design operator queue UI (HTML prototype in pfs-static-ui)
- [ ] Design case detail view UI with tab-per-document layout
- [ ] Design Switch node + sub-workflow node configuration UX in workflow canvas builder
