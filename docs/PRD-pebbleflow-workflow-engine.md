# PRD: PebbleFlow Workflow Engine

**Product Name:** PebbleFlow IDP — Workflow Engine  
**Version:** 1.0  
**Author:** Product Team  
**Date:** April 9, 2026  
**Status:** Draft

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Core Mental Model](#3-core-mental-model)
4. [Core Entities](#4-core-entities)
5. [User Roles in Workflow Context](#5-user-roles-in-workflow-context)
6. [Feature Scope](#6-feature-scope)
7. [UI Flows](#7-ui-flows)
8. [Generalization: One Engine, Many Domains](#8-generalization-one-engine-many-domains)
9. [Success Metrics](#9-success-metrics)
10. [Open Questions](#10-open-questions)

---

## 1. Problem Statement

PebbleFlow IDP solves the extraction problem well: send a document, get structured JSON back. But extraction alone is not enough for production use.

After data is extracted, companies still need to:
- **Verify** that the extracted data is correct (especially low-confidence fields)
- **Make a decision** — approve, reject, or request more information
- **Act on that decision** — post data to an ERP, trigger a downstream system, notify a team

Today, the "last mile" between extraction output and business action is still fully manual. An operator gets JSON from the API, copy-pastes it into their core system, and emails someone else for approval. This defeats the purpose of automation.

The workflow engine closes this gap — it makes the full loop repeatable, auditable, and operable by non-technical staff.

---

## 2. Solution Overview

The Workflow Engine turns PebbleFlow from a document extraction API into a **process automation platform**.

An admin defines a **Workflow** — a template describing what steps happen, in what order, with what conditions, by which team. Each time a document set arrives for processing, a **Process Instance** is created from that template. Operators work their queue of instances, reviewing extractions, making decisions, and taking actions.

The platform generalizes across any document-intensive, human-in-the-loop business process.

---

## 3. Core Mental Model

> **A Workflow is a recipe. A Process Instance is a meal being cooked.**

| Concept | Who Manages It | What It Represents |
|---|---|---|
| **Workflow** | Admin | A reusable template: steps, rules, assignments, integrations |
| **Process Instance** | Operator / Reviewer | One case running through a workflow — a specific document set for a specific customer/transaction |

This separation is fundamental. The admin defines the process once. The operator works individual cases, not process design.

---

## 4. Core Entities

### 4.1 Workflow

A workflow is a directed graph of stages. It is created by an admin in the canvas builder and deployed to go live.

```
Workflow = {
  id: "wf_invoice-ap-cycle",
  name: "Invoice AP Cycle",
  description: "Process vendor invoices from receipt to ERP posting",
  stages: [Stage],
  trigger: "manual" | "api",   // MVP: manual; V2: api
  status: "draft" | "active" | "archived",

  // Per-workflow context labels (drive column headers and form labels in operator UI)
  subject_label:   "Invoice",         // the business entity being processed
  context_1_label: "Purchase Order",  // nullable: immediate parent entity
  context_2_label: "Project"          // nullable: grandparent entity (omit if not used)
}
```

### 4.2 Stage

Each stage is one unit of work within a workflow. Stages are connected by transitions.

```
Stage = {
  id: "stage_extract",
  name: "AI Extraction",
  type: "ai_extractor" | "user_task" | "approval" | "condition" | "integration" | "lookup" | "sub_workflow",

  // Status shown to operator while instance is at this stage
  display_status: "Under Review",           // workflow-specific label (admin sets this)
  stage_category: "active" | "auto" | "done" | "rejected",  // for badge color + filtering
  is_terminal: false,                        // true = reaching this stage closes the instance

  // For user_task and approval:
  responsible_group: user_group_id,

  // For ai_extractor:
  schema_id: schema_id,                    // from Schema Library
  auto_advance_threshold: 85,              // % confidence; if ANY field is below → manual review

  // For condition (Switch node — multi-branch, evaluated top-down by priority):
  branches: [
    { label: "High Confidence", priority: 1, rules: [{ field: "confidence_avg", op: "gte", value: 85 }], next_stage_id: "stage_integration" },
    { label: "Default",         priority: 99, rules: [],                                                  next_stage_id: "stage_manual_verify" }
  ],

  // For integration (outbound):
  webhook_url: "https://erp.company.com/api/invoices",
  payload_mapping: { "invoice_number": "extracted.invoice_no", ... },

  // For lookup (inbound — query external system, store result for Switch):
  lookup_url: "https://erp.company.com/api/check-posting",
  method: "GET",
  query_params: { "cost_item_id": "{{subject_id}}" },
  store_result_as: "erp_posting_status",   // accessible as lookup.erp_posting_status in Switch rules

  // For sub_workflow (invoke another workflow as a child):
  sub_workflow_id: "wf_accrual-posting",   // parent pauses; child instance runs; parent resumes on child close
  wait_for_completion: true,

  // Transitions (unused for condition/Switch — those use branches[].next_stage_id):
  on_complete: next_stage_id,
  on_reject: stage_id | null              // only for user_task and approval
}
```

**Stage Types:**

| Type | Description | Assigned To |
|---|---|---|
| `ai_extractor` | Runs schema extraction, scores confidence per field. If any field is below threshold → manual review. | System (automatic) |
| `user_task` | Manual review / data correction by a user group | User Group |
| `approval` | Collect a decision: approve / reject / request info | User Group |
| `condition` | Multi-branch Switch node — N named branches evaluated top-down by priority; first matching branch is taken; empty rules = catch-all default | System (automatic) |
| `integration` | POST extracted + verified data to external system (outbound) | System (automatic) |
| `lookup` | GET data from external system; store result for use in downstream Switch rules (inbound) | System (automatic) |
| `sub_workflow` | Spawn a child process instance running another workflow; parent pauses until child reaches a terminal stage | System (automatic) |

### 4.3 Process Instance

One execution of a workflow for a specific business entity.

```
ProcessInstance = {
  id: "PROC-2026-0421",
  workflow_id: "wf_invoice-ap-cycle",
  title: "Invoice #5021 — PT Maju Jaya",   // human-readable label

  // Status is derived from the current stage's display_status + stage_category (D2)
  // No single macro_status field — the stage owns the status label
  current_stage_id: "stage_manual_verify",
  assigned_group_id: "grp_ap_team",

  // Subject: the business entity being processed (never "document")
  subject_id:   "inv_5021",
  subject_type: "invoice",                 // "invoice" | "claim" | "credit_facility" | "contract" | ...

  // Context Level 1: immediate parent entity (nullable)
  context_id:    "po_001",
  context_type:  "purchase_order",
  context_label: "PO #001 — Office Supplies",

  // Context Level 2: grandparent entity (nullable — omit if workflow doesn't use it)
  context_2_id:    "proj_alpha",
  context_2_type:  "project",
  context_2_label: "Project Alpha",

  // Amendment / revision link (nullable — links to a prior instance, not a business entity)
  parent_instance_id: null,

  // Documents are evidence; multiple per instance (one tab per doc in case detail view)
  documents: [
    {
      doc_id: "doc_001",
      schema_id: "schema_invoice",
      file_url: "...",
      extracted_fields: [
        { key: "vendor_name", value: "PT Maju Jaya", confidence: 0.97 },
        { key: "amount",      value: "12500000",     confidence: 0.78 },
        ...
      ]
    }
  ],

  history: [
    {
      stage_id: "stage_approval",
      actor_id: "usr_jane",               // user_id or "system"
      action: "approved" | "rejected" | "requested_info" | "advanced" | "corrected_field",
      notes: "Amount corrected from 12.5M to 12.75M",
      entered_at: "2026-04-09T13:00:00Z",
      exited_at:  "2026-04-09T14:23:00Z"
    }
  ],

  initiated_by: "usr_jane" | "api",
  created_at: "2026-04-09T13:00:00Z",
  updated_at: "2026-04-09T14:23:00Z",
  due_date: "2026-04-10T17:00:00Z"
}
```

### 4.4 User Group ↔ Workflow Assignment

User groups (already in Users & Roles) are extended with a workflow access map:

```
UserGroup = {
  id: "grp_ap_team",
  name: "AP Team",
  role: "reviewer",
  workflow_assignments: [
    {
      workflow_id: "wf_invoice-ap-cycle",
      stage_ids: ["stage_manual_verify", "stage_approval"]
    }
  ]
}
```

A user sees only instances where their group is the `assigned_group_id` at the current stage.

---

## 5. User Roles in Workflow Context

| Role | What They Do in Workflow | Access |
|---|---|---|
| **Admin** | Define workflows, assign user groups to stages, monitor all instances, force-advance or reassign stuck cases | Full access to all workflows and all instances; always sees the full nav |
| **Operator** | Work their queue — open cases, review extracted fields, correct low-confidence values, submit for approval | Sees only instances at stages assigned to their group |
| **Reviewer / Approver** | Make final decisions on cases — approve, reject, request more info | Sees only instances at approval stages assigned to their group |

A user can belong to multiple groups (e.g., both "AP Team" and "Finance Approvers") and will see the union of their assigned instances.

**Operator nav is dynamically composed from workflow assignments.** There is one app shell for all roles. On login, the frontend fetches the operator's assigned workflow stages and builds the nav from the stage types present — only `user_task` stages produce a "My Queue" menu item, only `approval` stages produce an "Approvals" menu item. System-only stage types (`ai_extractor`, `integration`, `lookup`, `condition`, `sub_workflow`) produce no menu items.

---

## 6. Feature Scope

### MVP (Manual Initiation)

**For Operators/Reviewers:**
- [ ] **Process Instance Queue (Table View)** — filterable, searchable list of assigned cases
- [ ] **Case Detail View** — document viewer + extracted fields table + decision actions
- [ ] **Inline Field Correction** — edit extracted values for low-confidence fields
- [ ] **Decision Actions** — Approve / Reject / Request More Info with optional notes
- [ ] **Process History / Audit Log** — who did what, when, at which stage

**For Admins:**
- [ ] **Workflow Canvas Enhancement** — assign user groups to each stage node
- [ ] **Instance Initiation UI** — manually start a new process instance (upload docs + select workflow)
- [ ] **Instance Monitor** — see all instances across all workflows, filter by status, force-advance, reassign
- [ ] **User Group ↔ Workflow Mapping** — in Users & Roles, assign groups to workflow stages
- [ ] **Basic Webhook Integration** — configure a URL + field mapping on Integration stage nodes

### V2 (API-Triggered Initiation)

- [ ] `POST /api/v1/workflow/{workflow_id}/instances` — create a process instance programmatically
- [ ] Webhook payload to initiate from external system (email gateway, ERP event, upstream API)
- [ ] Instance status webhook callbacks — notify external system on completion/rejection
- [ ] SLA tracking and overdue alerts
- [ ] Analytics: throughput, auto-processing rate, operator performance

### Out of Scope (Both MVP and V2)

- Native ERP connectors (SAP, Oracle, CONFINS) — webhook is sufficient for MVP
- Document storage / DMS — PebbleFlow does not store documents beyond processing
- Email-based document intake — V3 consideration
- Mobile operator interface — web only

---

## 7. UI Flows

### 7.1 Admin Flow: Define and Deploy a Workflow

```
Admin opens Workflows page
  → Click "New Workflow"
  → Canvas editor opens
  → Drag stage nodes: AI Extractor → Condition → User Task → Approval → Integration
  → Configure each node:
      AI Extractor: pick schema, set confidence threshold
      Condition: set branch rules (e.g., confidence_avg >= 85 → skip to Integration)
      User Task: assign user group, set required actions
      Approval: assign approver group
      Integration: set webhook URL + field mapping
  → Click "Save Draft" → review → click "Deploy Workflow"
  → Workflow is now active, instances can be created against it
```

### 7.2 Operator Flow: Process a Case (MVP — Manual Initiation)

```
Operator logs in
  → Sees their queue (Process Instance Table)
  → Filters by workflow or "Assigned to Me"
  → Clicks a row → Case Detail View opens

Case Detail View:
  [Documents Tab]            [Extracted Data Tab]         [History Tab]
  
  PDF/image viewer           Field table:                 Timeline of actions
                             Field | Value | Confidence
                             ------+-------+-----------
                             vendor| PT X  | 97% ✓
                             amount| 12.5M | 78% ⚠  ← click to edit
                             date  | Apr 10| 95% ✓

  Operator corrects low-confidence fields inline
  → Clicks [Approve] or [Reject] or [Request Info]
  → Adds optional notes
  → Instance advances to next stage (or closes if done)
```

### 7.3 Admin Flow: Initiate a Process Instance Manually

```
Admin opens Instance Monitor (or operator opens "New Case")
  → Click "Start New Case"
  → Select Workflow from dropdown
  → Enter case title (e.g., "Invoice #5021 — PT Maju Jaya")
  → Upload document(s)
  → Set due date (optional)
  → Click "Start"
  → System creates ProcessInstance, runs first stage (AI Extraction)
  → Case appears in assigned operator's queue
```

### 7.4 Process Instance Table — Operator View

```
My Queue                                                    [+ New Case]

[Workflow: All ▾]  [Status: Pending ▾]  [☑ Assigned to me]  [Search cases...]

┌─────────────┬──────────────────────────┬──────────────────┬──────────────┬────────────┬─────────┐
│ Case ID     │ Title                    │ Current Stage    │ Status       │ Due Date   │         │
├─────────────┼──────────────────────────┼──────────────────┼──────────────┼────────────┼─────────┤
│ PROC-0421   │ Invoice #5021 — PT Maju  │ Manual Verify    │ ● Pending    │ Apr 10     │ Open →  │
│ PROC-0419   │ Invoice #4998 — CV Sukses│ Integration      │ ◎ Auto       │ Apr 09     │ View →  │
│ PROC-0418   │ Invoice #4990 — PT Alam  │ Approval         │ ● In Review  │ Apr 08 ⚠  │ Open →  │
│ PROC-0412   │ Claim #2201 — Ahmad S.   │ Adjuster Review  │ ● Pending    │ Apr 11     │ Open →  │
└─────────────┴──────────────────────────┴──────────────────┴──────────────┴────────────┴─────────┘

Showing 4 of 4 cases
```

Status legend:
- `● Pending` — needs action from this user group
- `● In Review` — currently being worked
- `◎ Auto` — system is processing automatically (no action needed)
- `✓ Done` — completed, shown for reference
- `✗ Rejected` — closed as rejected

---

## 8. Generalization: One Engine, Many Domains

The workflow engine is domain-agnostic. The same building blocks (stages, groups, conditions, integrations) cover radically different business processes:

| Domain | Workflow Name | Stage Sequence |
|---|---|---|
| **AP / Revenue Cycle** | Invoice Processing | Upload → AI Extract → [Confidence Check] → Manual Verify → Finance Approval → Post to ERP |
| **Loan Underwriting** | Credit Application | Submit → AI Extract → Credit Officer Review → Underwriter Decision → Disbursement Trigger |
| **Insurance Claims** | Claim Processing | Submit → AI Extract → [Confidence Check] → Adjuster Review → Claims Manager Approval → Payout Trigger |
| **KYC / Onboarding** | Customer Onboarding | Submit docs → AI Extract → Compliance Review → Risk Decision → Account Activation |
| **Vendor Onboarding** | Supplier Verification | Submit → AI Extract → Procurement Review → Finance Approval → ERP Vendor Create |

All share the same shape:
```
Documents in → AI extracts → [Auto-advance if confidence high] → Human reviews → Decision → Integration out
```

The platform does not need to know about invoices vs. claims vs. loan applications. It only needs to know: stages, conditions, groups, and integrations. Domain knowledge lives in the workflow definition, not the engine.

---

## 9. Success Metrics

| Metric | Target | How to Measure |
|---|---|---|
| **Cycle time** | Time from case creation to close | `updated_at` (closed) - `created_at` |
| **Auto-processing rate** | % of cases that never need a human (all fields ≥ threshold) | Cases that skip all user_task stages / total cases |
| **Operator throughput** | Cases closed per operator per day | Decisions logged per user per day |
| **SLA compliance** | % of cases closed before due_date | Cases with `closed_at ≤ due_date` / total |
| **Correction rate** | % of extracted fields corrected by operators | Edited fields / total extracted fields |
| **Integration success rate** | % of Integration stage calls that succeed (2xx response) | Webhook call outcomes |

---

## 10. Open Questions

| # | Question | Status | Decision |
|---|---|---|---|
| Q1 | **UI split for operators vs admins** | **Resolved** | One shell. Operator nav is dynamically composed from assigned workflow stage types — not hardcoded by role. See D13. |
| Q2 | **Multi-document cases** | **Resolved** | Multiple documents per instance are supported. Case detail shows one tab per document. Decisions are made on the business entity, not the document. See D8, D9. |
| Q3 | **Partial auto-advance** | **Resolved** | If any field falls below confidence threshold, the whole case goes to manual review. Low-confidence fields are highlighted for the operator. See D16. |
| Q4 | **ERP integration payload format** | **Deferred** | Generic webhook is sufficient for MVP. Revisit after first pilot customer interview. |
| Q5 | **Who can initiate a case?** | **Resolved** | Any logged-in user can start a case in MVP. Restriction by role or workflow is a V2 consideration. |
| Q6 | **Sub-workflow / routing to different workflows** | **Resolved** | New `sub_workflow` stage type added. A Switch node branch can invoke another workflow as a child process instance. Parent pauses until child closes. See D14. |
