# PRD: PebbleFlow IDP — MVP v3 (Final)

**Product Name:** PebbleFlow IDP
**Version:** 3.0
**Author:** Product Team
**Date:** March 23, 2026
**Status:** Final — Ready for Validation
**Purpose:** Validate business model before scaling engineering investment

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem](#2-the-problem)
3. [The Solution](#3-the-solution)
4. [Competitive Landscape](#4-competitive-landscape)
5. [Target Customers](#5-target-customers)
6. [MVP Scope](#6-mvp-scope)
7. [Go-to-Market](#7-go-to-market)
8. [Success Metrics & Go/No-Go](#8-success-metrics--gono-go)
9. [Roadmap](#9-roadmap)
10. [Appendix](#10-appendix)

---

## 1. Executive Summary

### The Thesis

Mid-tier multifinance and insurance companies in Indonesia manually process thousands of documents daily — credit applications, claim forms, collateral documents — typing data from paper into core systems. This costs Rp 35-50 juta/month per 5-person data entry team, with 3-5% error rates on fields that directly affect credit decisions and claim payouts. No existing solution serves them: Google DocAI and AWS Textract aren't available in Jakarta region, Azure requires $24K+/year commitment for on-prem, and Laiye requires GPU hardware they don't have.

PebbleFlow is a **schema-based document extraction API**: define the fields you need, send any document, get structured JSON back. Powered by a fine-tuned Small Language Model (Qwen3-1.7B) running entirely on CPU. No GPU. No training. No template annotation.

### Why Now

**Buyer urgency (to be validated in interviews):**

1. **Volume dokumen tumbuh, headcount flat** — Pertumbuhan volume kredit dan klaim ~10-15%/tahun, sementara budget hiring stabil. Tim yang tahun lalu handle 800 dokumen/hari sekarang harus handle 950. Tahun depan 1,100. Pain ini semakin besar setiap kuartal — dan tidak ada yang menunjukkan tren ini akan berbalik. *(Validate in interview H1)*
2. **Co-payment 10% (SEOJK 7/2025) naikkan volume klaim** — OJK mewajibkan co-payment mulai 2026. Ini meningkatkan volume dokumen reimbursement karena nasabah harus submit bukti bayar. Lebih banyak dokumen, staff tetap sama.
3. **UU PDP mempermasalahkan outsourcing ke India** — Asuransi besar yang outsource document processing ke India BPO kini menghadapi risiko UU PDP — transfer PII lintas negara tanpa consent eksplisit. Belum ada enforcement, tapi risikonya semakin nyata setiap kuartal.

**Capability timing (why the solution is buildable now):**

5. **Extraction berkualitas sekarang bisa jalan di CPU** — Sampai 18 bulan lalu, automated extraction yang akurat butuh GPU ($10K+/server) atau cloud commitment ($24K+/tahun). Dengan kemajuan Small Language Models, kualitas yang sama sekarang bisa jalan di server CPU standar — barrier infrastruktur untuk mid-tier BFSI hilang.

### MVP Goals

| Goal                       | Target                                  | Timeframe  |
| -------------------------- | --------------------------------------- | ---------- |
| Hypotheses validated       | H1-H5 confirmed via 10 interviews       | Month 3    |
| Extraction accuracy (F1)   | >85% on pilot customers' real documents | Month 4    |
| Pilot customers onboarded  | 3-5 active pilots                       | Month 6    |
| First paid contract signed | 1-2 customers at Growth tier            | Month 8-10 |
| Monthly Recurring Revenue  | Rp 40-75 juta                           | Month 12   |

### Key Hypotheses

This PRD is built on five hypotheses. If any is rejected, the business model changes fundamentally.

| #   | Hypothesis                                                                                                                | How We Validate                       | Kill Signal                        |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------- |
| H1  | Mid-tier BFSI ops teams spend >4 hours/day on manual document data entry, costing Rp 35-50 juta/month for a 5-person team | Interview Q1-Q4, Q6-Q9                | <1 hour/day, "bukan masalah besar" |
| H2  | They process custom/proprietary documents that have no pre-built parser                                                   | Interview Q2, Q11 + visual inspection | Only standard docs (KTP, invoice)  |
| H3  | They don't have GPU infrastructure, and would use a cloud API                                                             | Interview Q12                         | Already have GPU + prefer on-prem  |
| H4  | They are willing to pay Rp 300-700/page for automated extraction                                                          | Interview Q14-Q17 (Van Westendorp)    | WTP < Rp 100/page                  |
| H5  | They can make a purchase decision within 6 months without HQ sign-off                                                     | Interview Q18-Q20                     | Requires Seoul/Tokyo HQ approval   |

---

## 2. The Problem

### 2.1 Who Feels This Pain

**Primary:** Operations teams at independent mid-tier multifinance and insurance companies in Indonesia (rank 15-40 by assets, 500-5,000 employees). These teams process documents as the critical data pipeline between external sources (customers, applicants, brokers) and internal core systems (CONFINS, LOS, claims management).

**Key characteristic:** They handle **custom, proprietary documents** — forms designed by their own company, not standard national documents. A credit application form at Buana Finance looks different from one at Clipan Finance. No pre-built template exists for these documents.

### 2.2 The Pain (To Be Validated)

```
Dokumen masuk (scan/email/upload dari nasabah)
  → Staff buka dokumen
  → Baca satu field, ketik ke core system
  → Ulangi untuk setiap field × setiap halaman × setiap dokumen
  → Supervisor verifikasi (kadang-kadang)
  → Data tersedia di sistem (jam sampai berhari-hari kemudian)
```

**Estimated cost of manual processing:**

| Metric                             | Value                                   | Confidence                                 |
| ---------------------------------- | --------------------------------------- | ------------------------------------------ |
| Data entry speed                   | 15-30 documents/person/hour             | Industry estimate — validate in interviews |
| Error rate                         | 3-5% field-level                        | Industry estimate — validate in interviews |
| Staff cost (Jakarta, fully loaded) | Rp 7-10 juta/month per person           | Market rate (incl. BPJS, THR, tunjangan)   |
| Processing delay                   | 4-24 hours from receipt to availability | Industry estimate — validate in interviews |

**Why errors matter in BFSI:**

- **Multifinance:** One wrong "jumlah_pinjaman" = disbursing the wrong loan amount. One misread KTP number = failed SLIK check = bad credit slips through. One data entry error in income field = NPF risk.
- **Insurance:** One wrong diagnosis code = claim processed at wrong amount. One missed duplicate claim = fraud undetected. One delayed claim = SLA violation + regulatory scrutiny.

The financial impact of errors is disproportionate to their frequency — a 3% error rate on 1,000 documents/day means 30 errors, each potentially costing Rp 500K-17 juta in rework, bad credit, or fraud loss.

### 2.3 Why This Problem Persists

| Current Alternative             | Why It Doesn't Solve the Problem                                                                                                                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Do Nothing (Status Quo)**     | "Sudah biasa manual." Works, but doesn't scale. Volume grows, headcount stays flat, error rate increases under fatigue.                                                                                                                                   |
| **Hire More Staff**             | Rp 7-10 juta/person/month × 3 people = Rp 21-30 juta/month. No CAPEX approval needed — so Ops Managers default to this. But hiring doesn't reduce error rate, doesn't improve speed, and adds management overhead.                                        |
| **India BPO (Insurance)**       | Top insurers already outsource at $1/claim (~Rp 800/page). Near-100% accuracy. But: batch processing (hours, not seconds), PII sent to India (UU PDP risk), no real-time integration to claims system.                                                    |
| **DIY Build (Tesseract+LLM)**   | IT team thinks "we can do this ourselves." Reality: base model gives 60-70% accuracy. Reaching 85%+ requires months of prompt engineering + fine-tuning + pipeline engineering. Cost: 2-3 engineers × 2-3 months = Rp 150-300 juta + ongoing maintenance. |
| **Google DocAI**                | Not available in Jakarta region. Nearest: Singapore.                                                                                                                                                                                                      |
| **Azure Document Intelligence** | Indonesia Central opened May 2025. Cloud availability unverified. On-prem = $24K+/year commitment.                                                                                                                                                        |
| **AWS Textract**                | Jakarta availability unconfirmed. No custom schema extraction.                                                                                                                                                                                            |
| **Laiye ADP**                   | Enterprise GPU required (NVIDIA L20, 48GB VRAM, ~$10K+ server). Enterprise pricing. No Indonesia presence.                                                                                                                                                |

The common theme: existing solutions either **aren't available in Indonesia**, **require GPU infrastructure mid-tier companies don't have**, or **only handle standard documents**.

---

## 3. The Solution

### 3.1 Positioning

**For** operations and IT teams at Indonesian multifinance and insurance companies
**Who** manually process thousands of documents daily and need extracted data in their core systems
**PebbleFlow IDP is** a document extraction API
**That** turns any document into structured JSON — define fields, send document, get data back
**Unlike** solutions requiring GPU, training data, or unavailable in Jakarta
**PebbleFlow** runs on CPU, works zero-shot from a schema definition, and includes a review dashboard for low-confidence results.

**One-line value proposition:**

> Dokumen masuk → data terstruktur keluar. Tanpa data entry manual. Tanpa GPU. Tanpa training.

### 3.2 Three Pillars

| Pillar                                              | For Ops Manager                                                                                                                                        | For IT Manager                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **1. Dokumen Apapun, Data Terstruktur**             | "Definisikan field yang Anda butuhkan. PebbleFlow extract dari dokumen apapun — formulir kredit, klaim, laporan internal. Bukan cuma KTP dan invoice." | "JSON schema in, structured JSON out. Zero-shot — no training, no annotation, no template."           |
| **2. Tanpa Investasi Tambahan**                     | "Jalan di cloud tanpa hardware baru. Tim Anda sendiri review field yang kurang yakin lewat dashboard — 5 detik per field, bukan 2 menit ketik ulang."  | "CPU-only (8GB RAM). Cloud API — single endpoint. Review dashboard built-in. No GPU, no procurement." |
| **3. Mulai Hari Ini, Berkembang Seiring Kebutuhan** | "Mulai dengan 1 jenis dokumen. Tambah jenis lain seiring kebutuhan. Handle 2x volume tanpa tambah headcount."                                          | "30 minutes signup to first API call. New schema = new document type instantly. Land-and-expand."     |

**Business outcomes (to be validated with pilot data):**

| Segment      | Entry Use Case                                  | Business Impact                                                                                                 |
| ------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Multifinance | Credit underwriting (formulir pengajuan kredit) | Faster credit decisions → more deals closed. Accurate data entry → lower NPF risk.                              |
| Multifinance | Collateral verification (BPKB/STNK)             | Prevent BPKB fraud. Accurate LTV calculation.                                                                   |
| Insurance    | Claims processing (formulir klaim)              | Faster claims → better SLA. Structured data enables fraud detection. UU PDP compliance (data stays in Jakarta). |

### 3.3 How It Works

```
1. DEFINE — Create a JSON schema: field names + descriptions
   "nama_pemohon": "Nama lengkap pemohon kredit sesuai KTP"
   "jumlah_pinjaman": "Jumlah pinjaman yang diajukan dalam Rupiah"

2. EXTRACT — Send document via API or upload in portal
   POST /api/v1/extract + file + schema_id
   → RapidOCR reads text (~200ms)
   → Qwen3-1.7B extracts structured data (~8-12s/page)
   → Per-field confidence scoring

3. REVIEW & INTEGRATE — Get JSON, route low-confidence to dashboard
   All fields ≥ 85% confidence → auto-approve → JSON response
   Any field < 85% → your team reviews in portal (5 sec/field)
   Corrected JSON → feed into CONFINS/LOS/claims system
```

### 3.4 What PebbleFlow is NOT

| We Are NOT                   | Why Not                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| An RPA platform              | We don't replace UiPath/Power Automate. We plug into them.                 |
| A workflow engine            | We do extraction, not orchestration.                                       |
| A document management system | We don't store documents. Ephemeral processing — in, extract, out, delete. |
| A pre-built template library | Our value is CUSTOM schema extraction, not KTP/passport parsing.           |
| A core system replacement    | We complement CONFINS/LOS, not replace them.                               |

### 3.5 API Summary

**Core endpoints (MVP):**

| Method                | Endpoint            | Description                                              |
| --------------------- | ------------------- | -------------------------------------------------------- |
| `POST`                | `/api/v1/extract`   | Extract data from document using schema (sync, ≤5 pages) |
| `GET/POST/PUT/DELETE` | `/api/v1/schemas/*` | Schema CRUD                                              |
| `GET`                 | `/api/v1/usage`     | Usage stats for current billing period                   |

**Sample response:**

```json
{
  "id": "ext_01HQF2QXSWEK5ZXVN0T7C8KFPM",
  "status": "completed",
  "pages_processed": 2,
  "processing_time_ms": 11200,
  "result": {
    "fields": {
      "nama_pemohon": { "value": "Ahmad Suryadi", "confidence": 0.94 },
      "nomor_ktp": { "value": "3201234567890001", "confidence": 0.91 },
      "jumlah_pinjaman": { "value": 25000000, "confidence": 0.88 },
      "jangka_waktu": { "value": "12 bulan", "confidence": 0.72 }
    }
  },
  "requires_review": true,
  "review_fields": ["jangka_waktu"]
}
```

**Indonesian format handling (critical):**

| Format              | Indonesian Convention             | Requirement             |
| ------------------- | --------------------------------- | ----------------------- |
| Thousands separator | Dot: "25.000.000" = 25 million    | MUST parse correctly    |
| Decimal separator   | Comma: "3,5%" = 3.5%              | MUST parse correctly    |
| Currency            | "Rp 25.000.000" or "25.000.000,-" | Strip prefix + trailing |
| Date                | "23 Maret 2026" or "23/03/2026"   | Normalize to ISO 8601   |

One wrong financial amount destroys customer trust permanently. Per-field confidence scoring is the safety net.

---

## 4. Competitive Landscape

### 4.1 Competitive Position

| Capability               | PebbleFlow  | Google DocAI        | Azure DocAI  | AWS Textract   | Laiye ADP    | DIY Build     |
| ------------------------ | ----------- | ------------------- | ------------ | -------------- | ------------ | ------------- |
| Jakarta data center      | ✅          | ❌                  | ✅ (May '25) | ❌ Unconfirmed | ❌           | ✅ Customer's |
| CPU-only                 | ✅ 8GB RAM  | N/A cloud           | N/A cloud    | N/A cloud      | ❌ GPU req'd | ✅            |
| Custom schema extraction | ✅ Core     | 🟡 Custom Extractor | ✅ Custom    | 🟡 Queries     | ✅ NL-based  | 🟡 Manual     |
| Self-review dashboard    | ✅ Built-in | ❌                  | ❌           | ❌             | ✅ Managed   | ❌            |
| Zero-shot (no training)  | ✅          | 🟡                  | 🟡           | ❌             | ✅           | ❌            |
| On-prem option           | Planned     | ❌                  | ✅ $24K+/yr  | ❌             | ✅ GPU       | ✅            |
| Time to production       | Days        | Weeks               | Weeks        | Weeks          | Months       | 2-3 months    |

### 4.2 The Real Competitors

**#1: "Do Nothing" (Status Quo)**

The most dangerous competitor. They've done manual processing for 10-20 years. Change requires effort, budget, and risk. We beat this by: quantifying cost of inaction, demonstrating with THEIR documents, and offering zero-risk free pilot.

**#2: "Hire More Staff"**

Many companies' response to document processing pain is adding headcount, not buying software. We beat this by framing as: "Handle 2x volume tanpa tambah orang. Tim existing naik peran ke quality control." Never say "replace staff" — Ops Manager who shrinks their team loses budget and influence.

**#3: DIY Internal Build**

IT Manager thinks "I can build this with Tesseract + ChatGPT." We beat this by: "Base model gives 60-70% accuracy. Our fine-tuned model: 85%+. Build yourself = 2-3 months × 2-3 engineers = Rp 150-300 juta. PebbleFlow: Rp 15 juta/month, works today. Berapa backlog IT team Anda sekarang?"

**#4: India BPO (Insurance segment)**

Top insurers pay $1/claim (~Rp 800/page) to India BPO. Near-100% accuracy via human review. We beat this with: real-time speed (30 seconds vs hours), data residency (Jakarta vs India), UU PDP compliance, and 50-75% lower cost.

### 4.3 Defensible Advantages

Ranked by durability:

| Advantage                    | Durability | Why                                                                                                                  |
| ---------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| **Pipeline engineering**     | High       | Schema→prompt→GBNF→confidence calibration is proprietary trade secret. Not on GitHub.                                |
| **CPU-only architecture**    | High       | Laiye's VLM approach inherently requires GPU. Structural, not temporary.                                             |
| **Data flywheel** (post-MVP) | High       | Per-customer HITL corrections create switching costs. 6 months of corrections = model calibrated to THEIR documents. |
| **Fine-tuned accuracy**      | Medium     | Base Qwen3 gives 70% F1. PebbleFlow fine-tuned: 85%+. Gap = proprietary training data + expertise.                   |
| **Build vs Buy economics**   | Medium     | Self-build: Rp 150-300 juta + ongoing maintenance. PebbleFlow: Rp 15 juta/month.                                     |

---

## 5. Target Customers

### 5.1 Primary Segment

**Independent mid-tier multifinance and insurance companies in Indonesia** — companies where Ops Manager + IT Manager can approve without corporate HQ sign-off.

| Attribute                      | Target                         |
| ------------------------------ | ------------------------------ |
| Company size                   | 500-5,000 employees            |
| Monthly document volume        | 24,000-100,000 pages           |
| Current solution               | Manual data entry or basic OCR |
| IT team size                   | 5-20 people                    |
| GPU infrastructure             | No                             |
| Budget for document processing | Rp 50-500 juta/year            |

**Why this segment:** Clear pain (manual processing), accessible buyers (3-6 month sales cycle vs 12-18 months for banks), custom documents (our differentiation), and no incumbent IDP vendor (greenfield).

### 5.2 User Personas

**Persona 1: Operations Manager — "The Buyer"**

- _Pain:_ "Tim saya 60% waktunya ketik data dari dokumen. Error 3-5%. Tiap error biaya Rp 500K-5 juta."
- _Goal:_ Reduce manual data entry, improve accuracy, process more volume.
- _Uses PebbleFlow for:_ Define schemas, monitor accuracy, manage review queue.
- _Technical comfort:_ Low-medium. Web portal, not code.

**Persona 2: IT Manager — "The Evaluator"**

- _Pain:_ "Setiap vendor mau ganti seluruh sistem kami. Saya cuma butuh API yang extract data dan kirim ke core system."
- _Goal:_ Integrate extraction into existing stack with minimal disruption.
- _Uses PebbleFlow for:_ API integration, API keys, monitoring.
- _Technical comfort:_ High. Evaluates API docs, runs test calls.

### 5.3 Named Targets (Top 5)

| Company                            | Segment      | Entry Point                     | Why                                                        |
| ---------------------------------- | ------------ | ------------------------------- | ---------------------------------------------------------- |
| **Buana Finance** (BBLD)           | Multifinance | Multi-product loan forms        | Independent (family-owned), listed IDX, 33 branches        |
| **Clipan Finance** (CFIN)          | Multifinance | Consumer + commercial financing | Independent (Lippo minority, public majority), listed IDX  |
| **Radana Bhaskara Finance** (HDFA) | Multifinance | Consumer financing              | PE-backed (Singapore), relatively independent IT decisions |
| **Asuransi Ramayana** (ASRM)       | Insurance    | General insurance claims        | Independent, family-owned, listed IDX, 27 branches         |
| **Asuransi Bintang** (ASBI)        | Insurance    | Motor + property claims         | Independent, listed IDX, pioneer asuransi umum             |

All targets are independently owned (not konglomerat subsidiaries), listed on IDX (financial transparency), and have autonomous IT decision-making.

### 5.4 Anti-Targets

| Segment                                          | Why Not                                                   |
| ------------------------------------------------ | --------------------------------------------------------- |
| Bank KBMI 4 (BCA, Mandiri, BRI, BNI)             | Already have solutions. 12-18 month procurement.          |
| BPR (rural banks)                                | Too small. No IT team. Volume too low.                    |
| Konglomerat subsidiaries (Adira=MUFG, FIF=Astra) | HQ controls IT procurement. Effectively enterprise sales. |
| Companies needing only KTP/passport OCR          | Competitors already do this. Not our differentiation.     |
| Companies needing sub-second latency             | SLM inference takes 10-12s/page. Wrong product.           |

---

## 6. MVP Scope

### 6.1 In Scope

```
PebbleFlow IDP — MVP
│
├── Portal (HonoX + MySQL 8)
│   ├── Email/password authentication
│   ├── Schema CRUD (create, edit, list, delete, test)
│   ├── Test extraction (upload document → see JSON)
│   ├── API key management (create, revoke)
│   ├── Usage dashboard (pages processed/month)
│   └── Self-review queue (low-confidence field review)
│
├── Processing Engine (FastAPI + RapidOCR + Qwen3-1.7B)
│   ├── POST /api/v1/extract (sync, ≤5 pages, ~12s/page)
│   ├── Schema-based extraction (JSON schema → structured JSON)
│   ├── Per-field confidence scoring
│   └── Multi-format support (PDF, PNG, JPG)
│
├── Billing (in Portal — TypeScript, not Rust)
│   ├── Usage tracking (pages per org per month)
│   └── Usage export (CSV for manual invoicing)
│
└── Infrastructure
    ├── MySQL 8 (single instance)
    ├── Redis (sessions + review queue + temp data)
    └── GKE Jakarta (asia-southeast2)
```

### 6.2 Out of Scope

| Feature            | Why Not Now                                                  | When                           |
| ------------------ | ------------------------------------------------------------ | ------------------------------ |
| Workflow engine    | Separate product. Validate extraction first.                 | Post-revenue (Phase 3+)        |
| Rust services      | Billing = 1 CRUD table. TypeScript handles it.               | Never for billing              |
| TiDB               | MySQL 8 handles our scale. TiDB adds unnecessary complexity. | When MySQL limits hit          |
| On-prem deployment | No customers requesting it. Validate cloud first.            | When first customer demands it |
| MFA / SSO          | Pilot customers won't audit this.                            | When enterprise requires it    |
| Async processing   | Most BFSI docs are 1-5 pages. Sync covers 95% of cases.      | When docs >5 pages routinely   |
| Audit logging      | Not needed for pilot phase.                                  | P1 when compliance requires it |

### 6.3 Technology Stack

| Component    | Technology                                    | Why                                        |
| ------------ | --------------------------------------------- | ------------------------------------------ |
| Portal + API | HonoX + Vite + Tailwind (TypeScript)          | SSR + Islands, unified frontend/backend    |
| ORM          | Drizzle ORM                                   | Type-safe, lightweight, MySQL-compatible   |
| Processing   | FastAPI + RapidOCR + Qwen3-1.7B GGUF (Python) | Best ML/OCR ecosystem                      |
| Database     | MySQL 8                                       | Proven, simple, CloudSQL Jakarta available |
| Cache        | Redis                                         | Sessions, review queue, temp data with TTL |
| Infra        | GKE (asia-southeast2)                         | Jakarta region, Kubernetes-native          |

### 6.4 Data Strategy

| Data                                  | Storage          | Retention                                      |
| ------------------------------------- | ---------------- | ---------------------------------------------- |
| Users, orgs, schemas, API keys, usage | MySQL            | Until deleted                                  |
| Self-review queue                     | Redis (TTL)      | 4 hours                                        |
| Extraction results cache              | Redis (TTL)      | 24 hours                                       |
| Raw documents                         | **Never stored** | Processed in memory, immediately discarded     |
| Extracted PII                         | **Ephemeral**    | Redis 4-hour TTL for review, then auto-deleted |

All IDs use prefixed ULID format: `org_`, `usr_`, `sch_`, `ext_`, `key_`.

---

## 7. Go-to-Market

### 7.1 GTM Motion: Founder-Led Sales

**Phase 1 — Validate & Build (Month 1-6):** Founder personally sells the first 3-5 pilots.

```
Month 1-3: Customer Discovery
├── 10 customer interviews (using Interview Guide)
├── Validate hypotheses H1-H5
├── Benchmark accuracy on real documents (100+ docs)
├── Go/No-Go decision at Month 3
└── Identify 3-5 hot prospects

Month 4-6: Pilot Execution
├── Free pilot: 5,000 pages, 4-8 weeks
├── Onboard 3 pilot customers
├── Weekly check-in, track accuracy + time savings
└── Iterate extraction based on feedback
```

**Phase 2 — Convert & Grow (Month 7-12):** Convert pilots to paid, expand.

```
Month 7-10: Conversion
├── Present pilot results with ROI data
├── Sign first paid contracts (Growth tier)
├── Collect case studies and testimonials

Month 10-12: Expand
├── Land-and-expand: add document types per customer
├── Approach SI partners for channel
├── Hire first customer success person
```

**Phase 3 — Scale (Month 12+):** Channel partnerships, on-prem if demanded, PLG for fintech.

### 7.2 Pilot Program

| Aspect           | Detail                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| Duration         | 4-8 weeks                                                                        |
| Volume           | 5,000 pages free                                                                 |
| Schemas          | Up to 3 document types                                                           |
| Support          | Direct WhatsApp/email with founder                                               |
| Review           | Self-review via portal (customer's own team)                                     |
| Success criteria | >85% F1, measurable time savings                                                 |
| LOI required     | Non-binding letter: "If >85% accuracy and >50% time savings, we proceed to paid" |
| Exit             | All data deleted. No lock-in.                                                    |

### 7.3 Pricing

| Tier           | Monthly Price | Page Quota   | Effective Rate/Page | Target                      |
| -------------- | ------------- | ------------ | ------------------- | --------------------------- |
| **Pilot**      | Free          | 5,000 pages  | Free                | Lead generation             |
| **Starter**    | Rp 5 juta     | 10,000 pages | Rp 500/page         | Small companies, self-serve |
| **Growth**     | Rp 15 juta    | 40,000 pages | Rp 375/page         | Mid-tier, primary target    |
| **Enterprise** | Contact Sales | Custom       | Rp 200-350/page     | >50K pages/month            |

**Competitive price anchors:**

| Benchmark                | Per Page             | Per Claim (20p)   | PebbleFlow vs   |
| ------------------------ | -------------------- | ----------------- | --------------- |
| India BPO                | Rp 800               | Rp 16,000 ($1.00) | 50-75% cheaper  |
| Azure Container (annual) | Rp 320 + $24K commit | —                 | More accessible |
| AWS Textract Forms       | Rp 1,040             | —                 | Cheaper         |
| Hiring 3 staff (Jakarta) | ~Rp 30/doc\*         | —                 | Better at scale |

\*Rp 30 juta/month ÷ 1,000 docs/day × 22 days = ~Rp 1,360/doc. But staff doesn't scale linearly.

**Gross margin:** 80-90% (infra ~Rp 30-40/page fully loaded vs selling price Rp 350-700/page).

**Billing model:** Monthly invoicing (manual initially). Bank transfer. Net 60 payment terms. Annual prepaid option with 15% discount.

### 7.4 Sales Cycle

| Stage       | Duration       | Exit Criteria                                               |
| ----------- | -------------- | ----------------------------------------------------------- |
| Discovery   | 2 weeks        | Pain confirmed, budget available, decision-maker identified |
| Demo        | 1 week         | Customer says: "This could work for us"                     |
| Pilot       | 4-8 weeks      | >85% accuracy, measurable time savings                      |
| Negotiation | 2-4 weeks      | Signed contract                                             |
| Onboarding  | 2 weeks        | First production API call                                   |
| **Total**   | **4-6 months** |                                                             |

---

## 8. Success Metrics & Go/No-Go

### 8.1 Product Metrics

| Metric                   | Target (Month 6)                        |
| ------------------------ | --------------------------------------- |
| Extraction accuracy (F1) | >85% on pilot customers' document types |
| Processing time (p95)    | <15s per page                           |
| API uptime               | 99.5%                                   |
| Time-to-first-extraction | <30 min (signup → first API call)       |

### 8.2 Business Metrics

| Metric                      | Month 6         | Month 12        |
| --------------------------- | --------------- | --------------- |
| Qualified pipeline          | 10-15 companies | 15-20 companies |
| Pilot customers             | 3-5             | 5-8             |
| Paying customers            | 0-1             | 2-3             |
| MRR                         | Rp 0-20 juta    | Rp 40-75 juta   |
| Pages processed/month       | 20,000          | 100,000-250,000 |
| Schemas per paying customer | 1-2             | 3+              |

### 8.3 Go/No-Go Criteria (Month 3)

After 10 customer interviews and accuracy benchmarking:

| Criteria                | Go                           | Pivot                                   | Kill                      |
| ----------------------- | ---------------------------- | --------------------------------------- | ------------------------- |
| Hypothesis validation   | 5+ interviews confirm H1-H5  | Problem confirmed but different segment | <3 confirm problem exists |
| Extraction accuracy     | >85% F1 on real docs         | 70-85% (improve with fine-tuning)       | <70% (tech not ready)     |
| Willingness to pay      | 3+ customers at Rp 300+/page | Willing at Rp 100-300 (thin margin)     | <Rp 100/page              |
| Integration feasibility | Can integrate in <1 week     | 1-4 weeks                               | >1 month                  |

### 8.4 Go/No-Go Criteria (Month 12)

| Criteria              | Go                   | Pivot                 | Kill                       |
| --------------------- | -------------------- | --------------------- | -------------------------- |
| First paid contract   | Signed by Month 8-10 | Signed by Month 10-12 | No contract after Month 12 |
| MRR                   | ≥Rp 40 juta          | Rp 20-40 juta         | <Rp 15 juta                |
| Customer satisfaction | NPS ≥30              | NPS 10-30             | NPS <10                    |
| Land-and-expand       | 3+ schemas/customer  | 2 schemas/customer    | Stuck at 1 schema          |

**If KILL at Month 3:** Stop engineering. Re-evaluate segment (non-BFSI? SEA outside Indonesia?).
**If KILL at Month 12:** Stop investment. Product-market fit not found in this segment.

---

## 9. Roadmap

### Phase 1: Validate & Build Core (Month 1-3)

| Activity                            | Deliverable                                         |
| ----------------------------------- | --------------------------------------------------- |
| 10 customer interviews              | Validated/invalidated H1-H5                         |
| Benchmark 100+ real Indonesian docs | Accuracy baseline (printed, handwritten, bilingual) |
| Build extraction API + portal       | Working POST /api/v1/extract                        |
| Pilot prep for top 3 prospects      | Custom demo with THEIR documents                    |

**Go/No-Go at Week 12.**

### Phase 2: Pilot & Convert (Month 4-8)

| Activity                                       | Deliverable               |
| ---------------------------------------------- | ------------------------- |
| Onboard 3-5 free pilots                        | Active pilots             |
| Build usage dashboard + billing + review queue | Complete portal           |
| Iterate accuracy from pilot feedback           | Model prompt optimization |
| Present pilot results, propose paid plan       | ≥1 signed contract        |

**P/MF signal:** Paying customer + NPS ≥30 + customer asks for more document types.

### Phase 3: Grow (Month 9-12)

| Activity                           | Deliverable                     |
| ---------------------------------- | ------------------------------- |
| Convert remaining pilots to paid   | 2-3 paying customers            |
| Approach SI partners               | First SI-originated lead        |
| Build async API + webhooks         | Handle >5 page documents        |
| Hire first customer success person | Founder freed for product/sales |

### Vision: The 3-Year Arc

| Timeframe                | Focus                                              | Key Milestone                                                                                       |
| ------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Year 1** (Start Small) | Schema extraction API for Indonesian mid-tier BFSI | 3-5 paying customers, >85% accuracy, proven ROI                                                     |
| **Year 2** (Grow)        | Platform for Indonesian financial services         | 20+ customers, data flywheel active, on-prem option, async processing                               |
| **Year 3** (Dream Big)   | Southeast Asia's document intelligence platform    | Multi-country expansion, agentic capabilities (classify→extract→validate→route), schema marketplace |

PebbleFlow is building the extraction foundation that everything else stands on. Today: structured data from any document. Tomorrow: the intelligent document layer for Southeast Asia's financial services.

---

## 10. Appendix

### A. Technical Validation Requirements (Pre-Pilot)

| Validation                           | Target                                 | Priority |
| ------------------------------------ | -------------------------------------- | -------- |
| Printed Indonesian document accuracy | >85% F1 on 100+ real docs              | CRITICAL |
| Real-world scan quality              | >75% F1 on 150 DPI, tilted, faded docs | CRITICAL |
| Critical field accuracy              | >95% F1 on amounts, ID numbers, dates  | CRITICAL |
| Handwritten field accuracy           | Measure baseline F1                    | HIGH     |
| Bilingual document accuracy          | >80% F1 on ID+EN mixed docs            | HIGH     |
| Indonesian number format parsing     | "25.000.000" → 25,000,000              | CRITICAL |

### B. Risks

**Business risks:**

| Risk                                               | Impact | Mitigation                                                  |
| -------------------------------------------------- | ------ | ----------------------------------------------------------- |
| No customer validates H1 (problem not real)        | FATAL  | 10 interviews before engineering. Go/No-Go at Month 3.      |
| WTP below Rp 100/page                              | HIGH   | Van Westendorp in interviews. Pivot segment if needed.      |
| Sales cycle too long (>6 months)                   | HIGH   | Free pilot to speed POC. Target multifinance not banks.     |
| Pilot-to-paid conversion failure                   | HIGH   | Require LOI before pilot. If prospect refuses → disqualify. |
| Cash flow: Net 60-90 terms + 8 months zero revenue | HIGH   | Minimum runway: Rp 500-600 juta for 18-24 months.           |
| Legal entity not ready (no PT, no NPWP)            | HIGH   | Start PT establishment immediately (2-3 months).            |

**Technical risks:**

| Risk                                | Impact | Mitigation                                               |
| ----------------------------------- | ------ | -------------------------------------------------------- |
| Accuracy <85% on real docs          | HIGH   | Benchmark BEFORE selling. Upgrade to Qwen3-4B if needed. |
| SLM hallucination on financial data | HIGH   | GBNF grammar + confidence scoring + HITL safety net.     |
| Accuracy drop on low-quality scans  | HIGH   | Benchmark on WORST quality before committing to pilot.   |

**Market risks:**

| Risk                                 | Impact | Mitigation                                                      |
| ------------------------------------ | ------ | --------------------------------------------------------------- |
| AdIns builds extraction into CONFINS | FATAL  | Approach AdIns for partnership by Month 2.                      |
| Laiye or Huawei enters Indonesia     | HIGH   | Build customer base fast. CPU advantage is structural vs Laiye. |
| DIY build becomes default            | HIGH   | Win on total cost of ownership + fine-tuned accuracy gap.       |

### C. Infrastructure Cost (MVP)

| Resource                       | Monthly Cost                   |
| ------------------------------ | ------------------------------ |
| GKE (Portal + Redis)           | ~$120                          |
| CloudSQL MySQL 8               | ~$35                           |
| Processing VM (t2d-standard-8) | ~$148                          |
| Load Balancer + Egress         | ~$25                           |
| **Total**                      | **~$328/month (~Rp 5.2 juta)** |

Break-even with first Growth customer (40,000 pages/month at Rp 375/page = Rp 15 juta revenue vs Rp 5.2 juta infra cost).

### D. Glossary

| Term     | Definition                                                  |
| -------- | ----------------------------------------------------------- |
| BFSI     | Banking, Financial Services, Insurance                      |
| F1 Score | Harmonic mean of precision and recall                       |
| GBNF     | Grammar-based output constraint for LLM (forces valid JSON) |
| GGUF     | Efficient model format for CPU inference                    |
| HITL     | Human-in-the-Loop review for low-confidence results         |
| MRR      | Monthly Recurring Revenue                                   |
| SLM      | Small Language Model (≤4B parameters, CPU-capable)          |
| ULID     | Universally Unique Lexicographically Sortable Identifier    |
| UU PDP   | Indonesia Personal Data Protection Law (UU No. 27/2022)     |

### E. Document References

| Document                            | Content                                               |
| ----------------------------------- | ----------------------------------------------------- |
| `docs/MVP-INTERVIEW-GUIDE-v2.md`    | Customer interview guide for hypothesis validation    |
| `docs/PRD-pebbleflow-idp-mvp-v2.md` | Previous PRD version (retained for detailed research) |
| `docs/ARCHITECTURE.md`              | Full technical architecture (to be created)           |
| `tasks/lessons.md`                  | Institutional knowledge from past sessions            |

---

_End of PRD v3_

**Next action:** Conduct 10 customer interviews using the Interview Guide. Validate H1-H5. Go/No-Go at Month 3.
