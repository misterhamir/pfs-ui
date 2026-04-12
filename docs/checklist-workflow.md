# Workflow Engine — Implementation Checklist

**Related:** [PRD-pebbleflow-workflow-engine.md](./PRD-pebbleflow-workflow-engine.md) | [WORKFLOW-ENGINE-DISCUSSION.md](./WORKFLOW-ENGINE-DISCUSSION.md)  
**Status:** In Progress  
**Last Updated:** April 9, 2026

---

## Static UI Screens (`pfs-static-ui/admin/`)

### Admin Screens

- [x] `workflows.html` — Workflow list (cards view with stage pipeline preview)
- [x] `canvas-editor.html` — Workflow canvas builder (drag-and-drop stage nodes)
- [x] `node-configuration.html` — Node/stage config sidebar (schema, threshold, webhook, etc.)
- [x] `instance-monitor.html` — Admin: all process instances across all workflows; filter by workflow/status; force-advance; reassign
- [x] `start-new-case.html` — Admin/Operator: manually initiate a new process instance (upload docs, select workflow, set context, due date)

### Operator Screens

- [x] `operator-queue.html` — Operator: My Queue — filterable table of assigned process instances
- [x] `case-detail.html` — Case Detail View — three tabs: Documents / Extracted Data / History; inline field correction; decision actions

---

## Screen Details

### `instance-monitor.html`
- [x] Sidebar nav with Instance Monitor active
- [x] Top filters: Workflow (dropdown), Status (dropdown), Due Date (dropdown), Search
- [x] Stats summary row: Total Active, Pending Review, Auto Processing, Overdue
- [x] Instance table columns: Case ID, Title, Workflow, Current Stage, Status badge, Due Date, Assigned Group, Actions
- [x] Status badges: `● Pending` / `● In Review` / `◎ Auto` / `✓ Done` / `✗ Rejected`
- [x] Row actions: Open →, Force Advance, Reassign
- [x] Overdue indicator on due date (red/warning)

### `start-new-case.html`
- [x] Full-page modal or dedicated page
- [x] Step 1: Select Workflow (dropdown with workflow name + description)
- [/] Step 2: Enter case details (title, subject_id, context_id / context_2_id based on workflow config)
- [/] Step 3: Upload documents (drag-and-drop multi-file, shows file list)
- [ ] Step 4: Set due date (optional date picker)
- [ ] Preview: shows which stage runs first (AI Extraction)
- [ ] Submit: "Start Case" button → creates ProcessInstance → routes to operator queue

### `operator-queue.html`
- [x] Operator-specific sidebar (dynamic nav: My Queue + Approvals only)
- [x] Header: "MY QUEUE"
- [x] Filters: Workflow (all), Status (Pending / In Review / All), Assigned to Me toggle, Search
- [x] Instance table: Case ID, Title (subject + context), Current Stage, Status, Due Date, Open →
- [x] Context columns adapt to workflow config (L1 context label shown; L2 hidden if unused)
- [x] "+ New Case" button (for operators with initiation permission)
- [x] Overdue rows highlighted
- [x] Pagination or "Showing X of Y" meta

### `case-detail.html`
- [x] Back button + breadcrumb: My Queue > Case ID
- [x] Case header: Case ID, Title, Status badge, Due date, Assigned group
- [x] Three tabs: Documents | Extracted Data | History
- [x] **Documents tab:** PDF/image viewer placeholder per document; file name + schema label; tab per document
- [x] **Extracted Data tab:** Field table (Field | Value | Confidence % | Status icon); ⚠ fields below threshold highlighted; inline edit on low-confidence fields; edit saves correction to audit log
- [x] **History tab:** Timeline of actions (stage, actor, action type, notes, timestamps)
- [x] Decision action bar (sticky bottom): [Approve] [Reject] [Request Info] + optional notes textarea
- [ ] Parent instance link ("View original case →") when `parent_instance_id` is set

---

## Data Model (Backend — reference)

### Tables to implement

- [ ] `workflows` — id, name, description, trigger_type, status, subject_label, context_1_label, context_2_label
- [ ] `workflow_stages` — id, workflow_id, name, type, display_status, stage_category, is_terminal, responsible_group_id, config (JSONB), on_complete, on_reject
- [ ] `process_instances` — id, workflow_id, title, current_stage_id, assigned_group_id, subject_id/type, context_id/type/label, context_2_id/type/label, parent_instance_id, initiated_by, created_at, updated_at, due_date
- [ ] `instance_documents` — id, instance_id, schema_id, file_ref, extracted_fields (JSONB), uploaded_at
- [ ] `instance_stage_history` — id, instance_id, stage_id, actor_id, action, notes, entered_at, exited_at

### Stage type configs (JSONB)

- [ ] `ai_extractor`: `{ schema_id, auto_advance_threshold }`
- [ ] `user_task`: `{ required_actions[] }`
- [ ] `approval`: `{ required_actions[] }` — approve / reject / request_info
- [ ] `condition` (Switch): `{ branches: [{ label, priority, rules[], next_stage_id }] }`
- [ ] `integration`: `{ webhook_url, payload_mapping }`
- [ ] `lookup`: `{ lookup_url, method, query_params, store_result_as }`
- [ ] `sub_workflow`: `{ workflow_id, wait_for_completion }`

---

## Canvas Builder Enhancements (canvas-editor.html)

- [ ] All 7 stage node types available in the node palette: ai_extractor, user_task, approval, condition (Switch), integration, lookup, sub_workflow
- [ ] Stage node cards show: name, type badge, display_status, assigned group (if applicable)
- [ ] User group assignment field on user_task and approval nodes
- [ ] Multi-branch Switch node UI: add/remove/reorder branches; rule builder per branch; drag-to-reorder priority
- [ ] Sub-workflow node: dropdown to select child workflow; toggle wait_for_completion
- [ ] Lookup node config: URL, method, query params with {{field}} placeholders, result alias
- [ ] Validation: is_terminal=false must have on_complete; condition nodes must have ≥1 branch; ai_extractor must have schema_id
- [ ] Deploy button: validates → sets status="active" → redirects to instance monitor

---

## User Group ↔ Workflow Mapping (users-roles.html)

- [ ] Each user group row expandable to show workflow assignments
- [ ] Per-workflow: which stage_ids the group is assigned to
- [ ] Warning if group assigned to system-only stage types (ai_extractor, integration, lookup, condition)
- [ ] "Assign to Workflow" action on group detail page

---

## Engine Logic (Backend)

- [ ] Instance creation: POST → create ProcessInstance at first stage → run ai_extractor if first stage
- [ ] Stage advance: validate current stage action → record history → resolve next_stage_id → update current_stage_id → check is_terminal
- [ ] Condition (Switch) evaluation: evaluate branches top-down by priority; empty rules = catch-all; first match wins
- [ ] Auto-advance threshold: if any field confidence < threshold → route to user_task (manual review); else → advance
- [ ] Integration stage: POST to webhook_url with payload_mapping; record response; advance on 2xx
- [ ] Lookup stage: GET from lookup_url; store result in instance context as `lookup.<result_name>`; advance
- [ ] Sub-workflow: create child instance; link via parent_instance_id; pause parent; on child terminal → advance parent
- [ ] Audit: every stage transition and field correction recorded in instance_stage_history

---

## V2 Scope (not in MVP)

- [ ] `POST /api/v1/workflow/{workflow_id}/instances` — API-triggered instance creation
- [ ] Webhook callbacks on instance close/reject
- [ ] SLA tracking and overdue alerts
- [ ] Analytics: throughput, auto-processing rate, operator performance dashboard
- [ ] Role-restricted workflow initiation
