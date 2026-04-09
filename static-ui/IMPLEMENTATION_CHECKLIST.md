# PebbleFlow UI Implementation Checklist
**Based on:** UI_ITERATION_PLAN.md (2026-03-17)
**Scope:** Static UI prototype only — no backend/runtime implementation

---

## Phase 0: Infrastructure (Shared Components)

### 0.1 Create Shared CSS Theme File
- [ ] Create `static-ui/_theme.css` with:
  - Tailwind CSS v4 CDN import
  - Inter font import
  - Primary color: lime `#84cc16`
  - Background colors: page `#f9fafb`, cards `#ffffff`
  - Custom utility classes for consistency
- [ ] Update all 10 existing admin files to reference `_theme.css`

### 0.2 Create Shared Sidebar Component
- [ ] Create `static-ui/_sidebar.html` with:
  - Admin navigation (Dashboard, Workflows, Schemas, Knowledge Base, Users & Roles, Deployments)
  - Operator navigation variants (L0, L1, L2)
  - Brand: RENUSCULE
- [ ] Document include pattern for all pages

---

## Phase 1: File Reorganization (7 moves/renames)

### 1.1 Move Workflows
- [ ] Move `admin/workflows.html` → `admin/workflows/index.html`
- [ ] Update internal navigation links

### 1.2 Move Schemas
- [ ] Move `admin/schema-library.html` → `admin/schemas/index.html`
- [ ] Move `admin/create-schema-step1.html` → `admin/schemas/create-step1.html`
- [ ] Move `admin/create-schema-step2.html` → `admin/schemas/create-step2.html`
- [ ] Move `admin/create-schema-step3.html` → `admin/schemas/create-step3.html`
- [ ] Move `admin/create-schema-step4.html` → `admin/schemas/create-step4.html`
- [ ] Update all internal links between these pages

### 1.3 Rename Training Files → Knowledge Base
- [ ] Move `admin/training-files.html` → `admin/knowledge/index.html`
- [ ] Update sidebar nav label: "Training Files" → "Knowledge Base"
- [ ] Evolve content to show policy documents + product rules (not just IDP training samples)

---

## Phase 2: Evolve Existing Admin Pages (3 pages)

### 2.1 Evolve Dashboard (`admin/dashboard.html`)
- [ ] Update KPIs to reflect workflow platform (not just IDP):
  - Active Workflows
  - Pending Approvals by Role (L0/L1/L2)
  - Generated Portals Live
- [ ] Add quick-links to "New Workflow" and "New Schema" builders
- [ ] Add recent workflow activity feed

### 2.2 Evolve Users & Roles (`admin/users-roles.html`)
- [ ] Add "Permission Level" column (L0/L1/L2)
- [ ] Add role-to-workflow assignment mapping UI
- [ ] Show which workflows each role has access to

### 2.3 Evolve Deployments (`admin/deployments.html`)
- [ ] Add "Generated Portals" section
- [ ] Show links to operator portal pages for each deployment
- [ ] Display deployment status (live/staging/dev)

---

## Phase 3: Priority 1 Admin Pages (1 new page)

### 3.1 Create Workflow Builder Canvas (`admin/workflows/builder.html`) ⭐ CENTERPIECE
**This is the most important page — demonstrates the entire product vision**

Canvas Layout:
- [ ] Left sidebar: Node palette (Process nodes vs. UI-generating nodes)
- [ ] Center: Canvas area with grid background
- [ ] Right: Properties panel (shows selected node config)

Node Palette Items:
- [ ] **Process Nodes** (no UI): Trigger, Document Classify, Document Extract, Policy Validate, Scoring, Decision/Route, Notification, Integration/Handoff
- [ ] **UI-Generating Nodes** (⚡ UI badge): Document Intake, Form, Human Review, Approval, Approval Queue, Status Tracker

Canvas Node Cards (with example nodes from Scenario 1: Insurance Onboarding):
- [ ] Node card design: icon + type label + schema link + "Generates UI" badge (lime)
- [ ] Example: Form node → generates `operator/intake/form.html`
- [ ] Example: Document Intake node → generates `operator/intake/document-upload.html`
- [ ] Example: Approval node → generates `operator/approvals/approve-detail.html`
- [ ] Connector lines between nodes
- [ ] Node selection + properties panel display

Controls:
- [ ] Save workflow
- [ ] Publish/Deploy button
- [ ] Preview generated pages

**Scenario to implement:** Insurance Onboarding (Form → Document Intake → Policy Validate → Approval L1 → Notification)

---

## Phase 4: Priority 1 Operator Pages (4 new pages)

### 4.1 Create Operator Dashboard (`operator/dashboard.html`)
- [ ] Role-filtered sidebar (example: L1 Supervisor view)
- [ ] KPIs: My Pending Tasks, Approvals This Week, Avg Processing Time
- [ ] Quick-links to assigned workflows
- [ ] Recent activity feed

### 4.2 Create Work Queue List (`operator/queue/index.html`)
- [ ] Table/list of cases assigned to current operator role
- [ ] Columns: Case ID, Type, Status, Age, Priority, Action
- [ ] Filters: status, priority, date range
- [ ] Bulk actions (assign, escalate)
- [ ] **Example data:** Insurance claims from Scenario 2

### 4.3 Create Case Detail Page (`operator/queue/case-detail.html`)
- [ ] Header: Case ID, status, timestamps
- [ ] Left panel: Document viewer (uploaded docs preview)
- [ ] Right panel: Extracted fields (from schema), validation results, flags
- [ ] Action buttons: Approve, Reject, Request Info, Escalate
- [ ] Notes/audit trail section
- [ ] **Example data:** Claim adjudication with extracted EOB fields + policy match result (Scenario 2)

### 4.4 Create Approval Detail Page (`operator/approvals/approve-detail.html`)
- [ ] Header: Item to approve, role level (L1/L2), escalation path
- [ ] Context section: Why this requires approval (score, policy violation, exception)
- [ ] Document(s) review section
- [ ] Extracted data summary
- [ ] Decision buttons: Approve, Reject, Escalate to L2
- [ ] Notes field (required on reject/escalate)
- [ ] **Example data:** Credit underwriting decision (Scenario 4) or Cost posting approval (Scenario 3)

---

## Phase 5: Priority 2 Pages (5 pages)

### 5.1 Create Workflow Detail (`admin/workflows/detail.html`)
- [ ] Header: Workflow name, status, linked schema
- [ ] Run history table: execution ID, timestamp, status, duration
- [ ] Deployed portal links: links to generated `operator/` pages
- [ ] Performance metrics per step
- [ ] Actions: Edit, Pause, Archive

### 5.2 Create Schema Detail (`admin/schemas/detail.html`)
- [ ] Header: Schema name, version, type
- [ ] Field list table: field name, type, required/optional, validation rules
- [ ] Linked workflows section
- [ ] Training documents count
- [ ] Version history
- [ ] Actions: Edit version, Create new workflow using this schema

### 5.3 Create Document Intake Portal (`operator/intake/document-upload.html`)
- [ ] Clean, minimal design (not admin-looking)
- [ ] Upload area with drag-and-drop
- [ ] Document requirements list (driven by schema)
- [ ] Progress indicator: which docs submitted vs. missing
- [ ] Submit button
- [ ] **Example:** Insurance claim document collection (Scenario 2)

### 5.4 Create Auto-Generated Form (`operator/intake/form.html`)
- [ ] Form fields auto-generated from schema (show 4-5 field types)
- [ ] Field types to demonstrate: text, date, currency, dropdown, table
- [ ] Required vs. optional indicators
- [ ] Validation messages
- [ ] Submit action
- [ ] **Example:** Insurance application form (Scenario 1)

### 5.5 Update Workflows Index (`admin/workflows/index.html`)
- [ ] Update navigation to link to builder and detail pages
- [ ] Add "Linked Workflows" column to cards
- [ ] Add action buttons: Edit in Builder, View Detail, View Portal

---

## Phase 6: Priority 3 Pages (1 page)

### 6.1 Create Approval Queue List (`operator/approvals/index.html`)
- [ ] Aggregated list of items awaiting approval for current role
- [ ] Group by workflow or by priority (decision point)
- [ ] Show escalation status
- [ ] Quick actions: approve, reject, view detail

---

## Implementation Notes for Agents

### Design System Reference
- Use existing `@theme` block from current admin pages
- Primary: lime green `#84cc16`
- Font: Inter
- Sidebar width: 256px
- Header height: 64px
- Backgrounds: page `#f9fafb`, cards `#ffffff`

### Key Concepts to Demonstrate
1. **Workflow generates UI** — Builder should show "⚡ UI" badge on nodes that produce operator pages
2. **Role-filtered experience** — Operator pages should show role-aware navigation
3. **Schema-driven** — Forms and validation should reference schemas explicitly
4. **4 scenarios** — At least one page per scenario should be represented

### File Structure When Complete
```
static-ui/
├── _theme.css                     (NEW)
├── _sidebar.html                  (NEW)
├── admin/
│   ├── dashboard.html             (EVOLVED)
│   ├── workflows/
│   │   ├── index.html             (MOVED)
│   │   ├── builder.html           (NEW - P1)
│   │   └── detail.html            (NEW - P2)
│   ├── schemas/
│   │   ├── index.html             (MOVED)
│   │   ├── detail.html            (NEW - P2)
│   │   ├── create-step1.html      (MOVED)
│   │   ├── create-step2.html      (MOVED)
│   │   ├── create-step3.html      (MOVED)
│   │   └── create-step4.html      (MOVED)
│   ├── knowledge/
│   │   └── index.html             (RENAMED)
│   ├── users-roles.html           (EVOLVED)
│   └── deployments.html           (EVOLVED)
└── operator/
    ├── dashboard.html              (NEW - P1)
    ├── queue/
    │   ├── index.html              (NEW - P1)
    │   └── case-detail.html        (NEW - P1)
    ├── approvals/
    │   ├── approve-detail.html     (NEW - P1)
    │   └── index.html              (NEW - P3)
    └── intake/
        ├── document-upload.html    (NEW - P2)
        └── form.html               (NEW - P2)
```

### Testing Checklist
- [ ] All navigation links work (no broken paths)
- [ ] Design system is consistent across all pages
- [ ] Builder canvas convincingly demonstrates workflow-to-UI generation
- [ ] Operator pages show role-filtered navigation
- [ ] At least 2 of 4 domain scenarios are represented in static content
- [ ] All moved files have updated internal links

---

**Total Tasks: 22**
**Estimated Phases: 6**
**Priority 1 (Core Concept):** Tasks 3.1, 4.1-4.4 (5 pages)
**Priority 2 (Complete Loop):** Tasks 5.1-5.5 (5 pages)
**Priority 3 (Polish):** Task 6.1 (1 page)
