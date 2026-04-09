# PRD: PebbleFlow IDP — MVP v2

**Product Name:** PebbleFlow IDP  
**Version:** 2.0 (Revised)  
**Author:** Product Team  
**Date:** March 23, 2026  
**Status:** Draft — Pending Customer Validation

> **Revision Note:** This PRD is a ground-up rewrite based on critical review of v1. Key changes: business-first (not architecture-first), ruthlessly scoped MVP, explicit GTM strategy, measurable success criteria, and honest competitive positioning. Technical architecture is summarized here and detailed in a separate `ARCHITECTURE.md`.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem & Market Context](#2-problem--market-context)
3. [Product Positioning](#3-product-positioning)
4. [Competitive Landscape](#4-competitive-landscape)
5. [Target Customers & Personas](#5-target-customers--personas)
6. [MVP Feature Scope](#6-mvp-feature-scope)
7. [Go-to-Market Strategy](#7-go-to-market-strategy)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Technical Architecture Summary](#9-technical-architecture-summary)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Milestones & Timeline](#11-milestones--timeline)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### What

PebbleFlow IDP is a **schema-based document extraction API** — define a JSON schema, send any document, get structured data back. Powered by RapidOCR and a local Small Language Model (Qwen3-1.7B), running entirely on CPU. No GPU required.

### Who

Primary: **Mid-tier multifinance and insurance companies in Indonesia** whose operations teams manually process thousands of external/customer-submitted documents daily — credit underwriting applications, insurance claim forms, collateral verification documents — and need to feed extracted data into their core systems (CONFINS, LOS, claims systems) without adding headcount.

> **⚠️ Positioning clarity:** PebbleFlow targets **operational document processing** (external docs coming FROM customers/applicants INTO the company's core system). This is fundamentally different from **financial document processing** (internal invoices/receipts flowing through AP/AR/expense). Different buyer (COO/Ops vs CFO/Finance), different documents, different integration targets, different budget.

### Why Now

1. **Open-source SLMs have reached extraction-quality** — Qwen3-1.7B on CPU delivers usable structured extraction, a capability that was impossible 18 months ago without GPU
2. **Indonesia's BFSI sector is underserved** — Google DocAI is NOT available in Jakarta region (available in US, EU, and select APAC like Mumbai — but not `asia-southeast2`); AWS Textract availability in Jakarta (ap-southeast-3) is unconfirmed; Azure recently opened Indonesia Central (May 2025) but Document Intelligence availability in this region is unverified and Disconnected Container still requires $24K+/year commitment
3. **Custom documents are the gap** — competitors offer pre-built parsers for KTP/invoice/passport, but multifinance/asuransi deal with proprietary forms (claim forms, kredit agreements, internal reports) that have no pre-built parser
4. **UU PDP enforcement** (Oct 2024) creates regulatory awareness for data residency solutions — UU No. 27/2022 berlaku efektif 17 Oktober 2024, though the supervisory body (Badan Pengawas PDP) is not yet formed. PebbleFlow offers Jakarta deployment + CPU-based on-prem as a path
5. **OJK Roadmap Pembiayaan 2024-2028** explicitly pushes digitalization of multifinance operations — regulatory tailwind that aligns with PebbleFlow's value proposition

### MVP Goals (Measurable)

| Goal                                      | Target                                     | Timeframe  |
| ----------------------------------------- | ------------------------------------------ | ---------- |
| Qualified pipeline                        | 10-15 companies in active conversation     | Month 4    |
| Extraction accuracy (F1)                  | >85% on pilot customers' real documents    | Month 4    |
| Pilot customers onboarded                 | 3-5 active pilots                          | Month 6    |
| First paid contract signed                | 1-2 customers (Growth plan, Rp 15 juta/mo) | Month 8-10 |
| Monthly Recurring Revenue                 | Rp 40-75 juta (~$2,500-4,700)              | Month 12   |
| Annual Contract Value (pipeline)          | Rp 1 miliar+ in qualified pipeline         | Month 12   |
| Land-and-expand                           | 3+ document types per paying customer      | Month 12   |
| Time-to-first-extraction for new customer | <30 minutes (IT Manager, signup → API)     | Month 4    |

> **Why these numbers, not higher:** These are bottom-up achievable targets for a 1-2 person team doing founder-led enterprise sales in Indonesia with 4-6 month sales cycles. 2-3 paying customers at Enterprise/Growth tier (Rp 20-25 juta/month each) = Rp 40-75 juta MRR. This is NOT a PLG play — each customer is a meaningful enterprise deal. The ACV pipeline target (Rp 1 miliar) represents 4-6 active prospects at Enterprise tier that could close within 12-18 months.
>
> **Why NOT lower:** If we can't reach Rp 40 juta MRR by Month 12 with a product that saves customers Rp 100-300 juta/year in operational costs, the business model doesn't work. One Enterprise customer (40K+ pages/month) alone justifies the infrastructure cost 5x over. The marginal cost of adding customers is near-zero (80-90% gross margin). This is an enterprise SaaS business — the unit economics work best at Enterprise-tier ACVs (Rp 300+ juta/year).
>
> **Land-and-expand is the growth engine:** A multifinance customer starts with "formulir pengajuan kredit" (1 schema) → adds "BPKB/STNK verification" → adds "slip gaji/income verification" → adds "surat keterangan/collateral docs." Each additional schema = more page volume = organic revenue growth per customer without additional CAC. Target: 3+ schemas per customer by Month 12.

---

## 2. Problem & Market Context

### 2.1 The Problem

BFSI companies in Indonesia process thousands of documents daily:

- **Multifinance:** Loan application forms, BPKB certificates, income verification letters, collateral documents
- **Insurance:** Claim forms, medical reports, policy documents, loss adjuster reports
- **Fintech:** KYC documents, bank statements, payslips

**Current process:**

```
Document arrives (email/scan/upload)
  → Data entry staff opens document
  → Manually reads and types data into core system
  → Supervisor verifies (sometimes)
  → Data available in system (hours to days later)
```

**Cost of manual processing:**

| Metric                     | Typical Value                                                                                                    | Source                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Data entry speed           | 15-30 documents/person/hour                                                                                      | Industry estimate         |
| Error rate (manual)        | 3-5% field-level                                                                                                 | Industry estimate         |
| Total staff cost (Jakarta) | Rp 7-10 juta/month per person (incl. BPJS Kes 4%, BPJS TK ~6.24%, THR pro-rata ~8.3%, tunjangan makan/transport) | Glassdoor, Gajimu, Indeed |
| Total staff cost (daerah)  | Rp 5-7 juta/month per person (UMR daerah lebih rendah dari Jakarta)                                              | Glassdoor, Gajimu, Indeed |
| Processing delay           | 4-24 hours from receipt to availability                                                                          | Industry estimate         |

> **⚠️ VALIDATION NEEDED:** These are industry estimates, not validated data from target customers. Interview guide Section 2 is designed to collect actual numbers from prospects.

### 2.2 Why Existing Solutions Fall Short

| Barrier                            | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **No Jakarta region (Google/AWS)** | Google DocAI is not available in Jakarta region `asia-southeast2` (available in US and EU multi-regions only; single-region requires special request form — Jakarta not listed). AWS Textract is **NOT available** in Jakarta `ap-southeast-3` (per AWS FAQ: supported in 15 regions, Jakarta not listed; nearest = Singapore `ap-southeast-1`). Azure opened Indonesia Central in May 2025 but Document Intelligence availability in this region is unverified, and on-prem requires $24K+/year commitment. |
| **GPU requirement**                | Laiye ADP and VLM-based solutions require significant GPU VRAM (e.g., NVIDIA L20 48GB, ~$10K+ GPU server). Mid-tier multifinance does NOT have GPU infrastructure.                                                                                                                                                                                                                                                                                                                                           |
| **Pre-built templates only**       | Huawei Cloud OCR, Tencent Cloud, AWS Textract offer parsers for KTP/passport/invoice — but NOT for custom loan forms, proprietary claim forms, or internal documents.                                                                                                                                                                                                                                                                                                                                        |
| **Enterprise pricing**             | Azure Document Intelligence Disconnected Container = $24K+/year commitment. Laiye = Contact Sales (enterprise deal). Out of reach for mid-tier.                                                                                                                                                                                                                                                                                                                                                              |
| **Vendor lock-in**                 | All major providers use proprietary models. No customer can inspect, fine-tune, or swap the extraction model.                                                                                                                                                                                                                                                                                                                                                                                                |
| **Integration friction**           | Full IDP platforms (ABBYY, Hyperscience) require replacing existing workflows. Mid-tier companies want to plug extraction into their existing process, not adopt a new platform.                                                                                                                                                                                                                                                                                                                             |

### 2.3 Market Size & Opportunity

**Indonesia BFSI Document Processing — Addressable Market:**

| Segment                                         | # Companies | Doc Volume (est.)     | IT Budget                 | Likelihood                                                                                                          |
| ----------------------------------------------- | ----------- | --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Multifinance (non-bank lending)                 | ~150        | 500-5,000 docs/day    | Rp 500 juta - 5 miliar/yr | ✅ HIGH — still manual, budget-constrained                                                                          |
| Asuransi (general + life)                       | ~135        | 200-2,000 docs/day    | Rp 1-10 miliar/yr         | ✅ HIGH — claims processing pain                                                                                    |
| Fintech (lending + payment)                     | ~100        | 100-10,000 docs/day   | Variable                  | 🟡 MEDIUM — tech-forward, KYC focus                                                                                 |
| Digital Bank                                    | ~17         | 1,000-10,000 docs/day | Rp 5-50 miliar/yr         | 🟡 MEDIUM — open to SaaS                                                                                            |
| Bank KBMI 4 / "buku 4" (BCA, Mandiri, BRI, BNI) | 4           | 10,000+ docs/day      | Rp 50+ miliar/yr          | ❌ LOW — already have solutions                                                                                     |
| BPR (rural banks)                               | ~1,350      | 10-100 docs/day       | Minimal                   | ❌ LOW — too small, no IT team (OJK data Maret 2025: 1,345 BPR, declining — OJK plans to eliminate KBMI 1 category) |

**Initial Target:** 15-20 companies in independent multifinance and mid-tier asuransi — companies with autonomous IT decision-making, NOT subsidiaries of conglomerates whose IT procurement is controlled by parent company.

> **⚠️ Targeting principle:** Avoid anak perusahaan konglomerat besar (Adira = Danamon/MUFG, FIF = Astra, WOM = Maybank, Allianz/Prudential = MNC with regional IT). Also avoid subsidiaries of Korean financial groups (KB Financial Group, KDB) — their IT procurement requires Seoul HQ sign-off. Their procurement is as bureaucratic as bank KBMI 4. Target independent companies where Ops Manager + IT Manager can approve without corporate HQ sign-off.

**Revenue potential (bottom-up enterprise sizing):**

**Per-customer revenue model (Growth plan):**

> **⚠️ Volume basis (research-backed, March 2026):**
>
> **Multifinance document requirements per loan application:**
>
> - **Karyawan (motor baru):** KTP pemohon (1p) + KTP pasangan (1p) + KK (1-2p) + slip gaji (1-2p) + formulir pengajuan (1-2p) + bukti domisili/PBB/rekening listrik (1p) + NPWP jika >Rp 50 juta (1p) = **~6-8 halaman/aplikasi**
> - **Multiguna/refinancing:** Semua di atas + BPKB + STNK + rekening koran 3 bulan = **~10-14 halaman/aplikasi**
> - **Wiraswasta:** Semua di atas + SIUP/SKU + laporan keuangan = **~12-18 halaman/aplikasi**
> - **Weighted average across all loan types: ~8-10 halaman/aplikasi**
>
> **Industry volume context:**
>
> - Penjualan motor Indonesia 2024: 6,33 juta unit (AISI), ~80% via kredit = ~422K kredit motor baru/bulan industry-wide
> - **FIF Group (data paling transparan):** FIFASTRA membiayai **1,6 juta unit motor Honda** tahun 2023 dengan total Rp 26,9 triliun (sumber: kontan.co.id, bisnis.com) → **avg pembiayaan per unit = Rp 16,8 juta**. FIF total (termasuk SPEKTRA/DANASTRA/FINATRA/AMITRA) = 3,2 juta unit, Rp 42,3 triliun (avg blended Rp 13,2 juta karena termasuk elektronik/multiproduk)
> - **Adira Finance 2024:** Rp 36,6 triliun pembiayaan baru, 73% otomotif = Rp 26,7 triliun. Dengan avg ~Rp 16-17 juta/unit motor → estimasi **~130-140K unit motor/bulan**. Plus 27% non-otomotif (multiguna/SolusiDana avg Rp 50-100 juta)
> - 20 juta debitur multifinance, 180 juta kontrak total (OJK, infobanknews Jan 2026)
> - ~150 perusahaan pembiayaan aktif (OJK 2025)
>
> **Per-company volume estimate:**
>
> - Top-3 multifinance (FIF/Adira/BFI): FIF = ~267K unit/bulan (semua produk), Adira = ~130-150K. Dengan ~8-10 pages/aplikasi = **800K-1,5 juta halaman/bulan**
> - Mid-tier independent (target PebbleFlow, rank 15-40): ~3-10K aplikasi/bulan × ~8-10 pages = **24,000-100,000 halaman/bulan**
> - Small-tier (rank 40-80): ~500-3K aplikasi/bulan × ~8 pages = **4,000-24,000 halaman/bulan**
>
> **Insurance claim document requirements (per klaim):**
>
> - **Klaim rawat inap (hospitalization):** Formulir klaim (2-3p) + resume medis/resume pasien pulang (1-2p) + surat keterangan dokter (1p) + kuitansi asli + rincian biaya (2-5p) + resep dokter (1-2p) + hasil lab/pemeriksaan penunjang (1-3p) + fotokopi KTP (1p) + fotokopi buku tabungan (1p) = **~10-18 halaman/klaim** (sumber: formulir klaim Prudential, Allianz, Manulife, AXA)
> - **Klaim rawat jalan (outpatient/reimbursement):** Formulir klaim (1-2p) + surat keterangan/resep dokter (1p) + kuitansi (1p) + diagnosis (1p) = **~3-5 halaman/klaim** — ini JAUH lebih sering daripada rawat inap (setiap kunjungan dokter = 1 klaim)
> - **Klaim kendaraan bermotor:** Formulir klaim (1-2p) + fotokopi SIM+STNK (2p) + fotokopi polis (1-2p) + surat kepolisian/BAP (1-2p) + foto kerusakan (1-3p) + estimasi bengkel (1-2p) + kuitansi bengkel (1-2p) = **~8-15 halaman/klaim**
>
> **⚠️ PENTING — Asuransi kesehatan ≠ asuransi jiwa:**
>
> Asuransi kesehatan (rawat jalan + rawat inap) berbeda fundamental dari asuransi jiwa (meninggal/cacat/penyakit kritis):
>
> - **Asuransi kesehatan:** Frekuensi klaim SANGAT TINGGI. Setiap kunjungan dokter oleh karyawan = 1 klaim rawat jalan. Setiap rawat inap = 1 klaim besar. Karyawan rata-rata kunjungan dokter 2-4x/tahun. Perusahaan dengan 1.000 karyawan bisa menghasilkan 2.000-4.000 klaim rawat jalan/tahun + 50-100 klaim rawat inap/tahun.
> - **Asuransi jiwa:** Frekuensi klaim RENDAH. Klaim hanya terjadi saat meninggal, cacat tetap, atau diagnosa penyakit kritis. Jarang — mungkin 1-2% peserta/tahun.
> - **Data AAJI:** Di asuransi jiwa, 78% dari TOTAL klaim adalah klaim asuransi kesehatan (sumber: Generali Indonesia CMO). Klaim kesehatan semester I-2024 = Rp 11,83 triliun, naik 26% yoy. Rasio klaim kesehatan mencapai **138%** di full year 2023 (AAJI), artinya klaim > premi — industri RUGI di produk kesehatan.
> - **PebbleFlow target:** Klaim kesehatan kumpulan (employee health insurance), BUKAN klaim jiwa. Klaim yang membutuhkan document processing = klaim reimbursement (bukan cashless). Cashless sudah diproses real-time via TPA (AdMedika/Fullerton). Yang perlu extraction = reimbursement claims = dokumen fisik yang dikirim nasabah.
>
> **Insurance volume context — CORRECTED (asuransi kesehatan vs umum vs jiwa):**
>
> - **Klaim kesehatan (AAJI 2024):** Rp 23,66 triliun full year (estimasi dari Rp 11,83T di semester I, naik 16,4% yoy). Klaim kesehatan kumpulan = Rp 8,42 triliun (estimasi dari Rp 4,21T semester I)
> - **AdMedika (TPA terbesar):** Memproses klaim untuk **5,1 juta+ peserta**, 60+ perusahaan asuransi mitra, 9.000+ fasilitas kesehatan (sumber: admedika.co.id)
> - **Mandiri Inhealth:** 1,8 juta peserta, 1.300 institusi, membayar klaim Rp 3,8 triliun kepada ~650K peserta sepanjang 2024 (sumber: ifg-life.id)
> - **Asuransi umum (AAUI 2024):** Total klaim dibayar Rp 49,90 triliun (naik 8,5% yoy). Motor vehicle rasio klaim 38,8%, property 27,8%
> - **Co-payment 10% mulai 2026:** OJK mewajibkan nasabah bayar min 10% dari klaim rawat jalan (maks Rp 300K/klaim) dan rawat inap (maks Rp 3 juta/klaim). Ini akan MENINGKATKAN volume klaim reimbursement karena nasabah harus submit dokumen untuk klaim partial.
>
> **Per-company volume estimate (insurance):**
>
> - **Asuransi kesehatan besar (Mandiri Inhealth, AXA Mandiri, Prudential):** 100K-500K peserta. Utilization rate ~30-40% peserta klaim/tahun × rata-rata 2 klaim/peserta = 60K-400K klaim/tahun = **5K-33K klaim/bulan. Dengan ~5 pages/klaim (weighted rawat jalan dominant) = 25,000-165,000 halaman/bulan**
> - **Asuransi umum mid-tier (Ramayana, Bintang, MAG):** Campuran kendaraan + property + kesehatan. Estimasi 2-8K klaim/bulan × ~8 pages (weighted) = **16,000-64,000 halaman/bulan**
> - **Fokus reimbursement only:** Banyak klaim kesehatan diproses cashless via TPA (tidak perlu extraction). Yang butuh extraction = reimbursement claims + klaim non-cashless. Estimasi ~30-50% dari total klaim = volume PebbleFlow realistic = **8,000-80,000 halaman/bulan per perusahaan asuransi mid-tier**
>
> **Key insight:** Volume klaim asuransi kesehatan JAUH lebih besar dari yang diperkirakan (karena setiap kunjungan dokter = 1 klaim), tapi yang relevan untuk PebbleFlow adalah klaim REIMBURSEMENT (dokumen fisik yang perlu di-extract), bukan cashless (sudah real-time via TPA). Mid-tier multifinance (rank 15-40) memproses ~24K-100K halaman/bulan. Per asuransi mid-tier: ~8K-80K halaman reimbursement/bulan.

| Use Case                                     | Monthly Page Volume  | Plan              | Monthly Revenue |
| -------------------------------------------- | -------------------- | ----------------- | --------------- |
| Multifinance: credit underwriting (1 schema) | 24,000-60,000 pages  | Growth/Enterprise | Rp 10-22 juta   |
| Multifinance: full workflow (3+ schemas)     | 60,000-100,000 pages | Enterprise        | Rp 20-35 juta   |
| Insurance: claims processing (2 schemas)     | 20,000-80,000 pages  | Growth/Enterprise | Rp 10-30 juta   |
| Insurance: full workflow (4+ schemas)        | 80,000-200,000 pages | Enterprise        | Rp 25-60 juta   |

> **⚠️ Pricing implication:** Dengan volume riil yang lebih tinggi dari estimasi awal (24K-100K pages/bulan untuk mid-tier multifinance), sebagian besar target customer akan butuh Enterprise tier (≥50K pages/bulan). Growth plan (40K pages) cukup untuk:
>
> - Multifinance kecil-menengah yang baru mulai (1 schema)
> - Pilot phase sebelum full rollout
> - Insurance mid-tier dengan volume klaim terbatas
>
> Untuk full-workflow mid-tier multifinance (60K-100K pages), Enterprise tier dengan custom pricing diperlukan.

**Revenue trajectory (conservative):**

| Timeframe | Customers | Avg MRR/Customer         | Total MRR       | Annualized        |
| --------- | --------- | ------------------------ | --------------- | ----------------- |
| Month 12  | 2-3       | Rp 20-25 juta            | Rp 40-75 juta   | Rp 480-900 juta   |
| Month 18  | 5-8       | Rp 30 juta (land+expand) | Rp 150-240 juta | Rp 1.8-2.9 miliar |
| Month 24  | 8-12      | Rp 35 juta (land+expand) | Rp 280-420 juta | Rp 3.4-5.0 miliar |

> **Land-and-expand driver:** Revenue per customer grows 50-100% over 12 months as customers add document types. A multifinance starting with formulir pengajuan kredit (1 schema, pilot volume ~10-20K pages) → adds KTP + KK verification → adds slip gaji/income verification → adds BPKB/STNK collateral docs. Each additional schema = more of the application bundle processed = organic volume growth to 60-100K pages/month per customer without additional CAC.

- Break-even infra cost: ~$200/month (MySQL + GKE basic) — achieved with first paying customer. Fully-loaded break-even (including support overhead): ~$550/month — achieved with first Growth-plan customer.

### 2.4 Hypotheses to Validate

Before building beyond the current extraction engine, these hypotheses MUST be validated through customer interviews:

| #   | Hypothesis                                                                       | Validation Method                   | Go/No-Go                                                                                            |
| --- | -------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| H1  | Multifinance/asuransi ops teams spend >4 hours/day on manual document data entry | Interview Q2.1-2.3                  | If <1 hour, problem not big enough                                                                  |
| H2  | They process custom/proprietary documents (not just KTP/invoice)                 | Interview Q2.4-2.5                  | If only standard docs, competitors win                                                              |
| H3  | They do NOT have GPU infrastructure and won't buy it                             | Interview Q4.1                      | If they have GPU, CPU advantage is moot                                                             |
| H4  | They would pay Rp 300-700/page for automated extraction                          | Interview Q5.1-5.4 (Van Westendorp) | If WTP < Rp 100, unit economics don't work                                                          |
| H5  | Data residency (Jakarta) is a real requirement, not just nice-to-have            | Interview Q4.3                      | If they don't care, positioning weakens                                                             |
| H6  | They want to integrate extraction into existing systems (not replace them)       | Interview Q4.2                      | Validates "pluggable API" positioning                                                               |
| H7  | HITL (managed reviewer service) is valued — they don't want to hire own QA       | Interview Q3.3                      | If they prefer own team, HITL is cost center                                                        |
| H8  | Documents include handwritten fields that need extraction                        | Interview Q1.1, Q3.5 (NEW)          | If all printed/typed, handwriting is not a blocker. If significant handwritten, benchmark urgently. |
| H9  | Documents are bilingual (Indonesian + English mixed)                             | Interview Q1.1, Q3.6 (NEW)          | If bilingual, validate OCR + SLM accuracy on mixed-language content.                                |
| H10 | "Hire more staff" is the default alternative, not buying software                | Interview Q2.5 (NEW)                | Validates that ROI argument must be framed as "cheaper than headcount"                              |
| H11 | Core system (CONFINS/LOS) has API for external data import                       | Interview Q4.4 (NEW)                | If no API, integration story changes to "export JSON/CSV for manual input"                          |
| H12 | Budget cycle allows purchase in current fiscal year                              | Interview Q6.5, Q6.6 (NEW)          | If budget locked, deal moves to 2027 cycle. Affects realistic sales timeline.                       |

---

## 3. Product Positioning

### 3.1 Positioning Statement

**For** operations and IT teams at Indonesian multifinance and insurance companies  
**Who** manually process thousands of underwriting applications, insurance claims, and operational documents daily and need to feed extracted data into core systems without adding headcount  
**PebbleFlow IDP is** a document extraction service that turns any operational document into structured data — ready to push into your core system  
**That** automatically extracts data from credit applications, claim forms, collateral documents, and any customer-submitted document — feeding structured JSON directly into CONFINS, LOS, or your claims system, so your team processes 2x more applications without adding headcount  
**Unlike** Google DocAI (not available in Jakarta), Azure Document Intelligence ($24K+/year on-prem), or Laiye (GPU required)  
**PebbleFlow** integrates directly into your core system via REST API, runs entirely on CPU (no GPU or additional hardware investment), and includes a built-in review dashboard for your team to verify low-confidence results — all deployable in Jakarta for data residency compliance.

> **⚠️ Positioning clarity — What PebbleFlow is NOT:**
>
> PebbleFlow is NOT an invoice/receipt processing tool. That market is served by Mekari Expense, SAP Concur, and similar AP/AR automation products targeting CFOs and Finance teams.
>
> PebbleFlow targets a **completely different buyer and use case:**
> | Dimension | Mekari Expense / Invoice Processing | PebbleFlow / Operational Extraction |
> | --- | --- | --- |
> | **Buyer** | CFO, Finance Manager | COO, Operations Manager |
> | **Documents** | Invoices, receipts, expense reports (internal) | Loan forms, claim forms, underwriting docs (external/customer-submitted) |
> | **Integration** | Accounting system (Jurnal, SAP) | Core operations system (CONFINS, LOS, claims) |
> | **Budget** | Finance/accounting budget | Operations/IT budget |
> | **Value** | AP/AR automation, expense compliance | Underwriting speed, claims throughput, operational efficiency |

> **Messaging by persona:**
>
> - **Ops Manager / COO:** "Proses 2x lebih banyak dokumen kredit dengan tim yang sama. Data langsung masuk CONFINS/core system — tanpa ketik ulang, tanpa tambah headcount. Tim data entry Anda bisa fokus ke verifikasi dan quality control."
> - **IT Manager:** "REST API — satu endpoint, kirim dokumen + schema, terima JSON. Integrasi ke CONFINS/LOS Anda dalam hitungan hari, bukan bulan. Tanpa GPU, cukup server yang sudah ada."
> - **Compliance:** "Base model open-source (Apache 2.0) yang bisa Anda audit arsitekturnya. Fine-tuned weights optimized untuk dokumen Indonesia. Ephemeral processing — dokumen tidak pernah disimpan. Data center Jakarta."

> **⚠️ PMM Note — framing for Ops Manager:** NEVER frame the value prop as "reduce headcount" or "replace data entry staff." In Indonesian corporate culture, an Ops Manager who reduces their team size LOSES budget, LOSES influence, and potentially LOSES their own job justification. Nobody will champion a product that eliminates their team. Frame as: "Handle 2x volume with the same team" and "Redeploy data entry staff to verification and quality control." The Ops Manager keeps their team, keeps their budget authority, AND gets better results.

### 3.2 Key Differentiators — Four Pillars

These are PebbleFlow's defensible advantages. Each must be validated with customers (see Hypothesis table).

> **⚠️ PMM Note — Pillar ordering rationale:** Pillars are ordered by buyer impact, not technical impressiveness. Pillar 1 (Core System Integration) is the hook that gets Ops Manager's attention. Pillar 2 (No Additional Hardware) removes IT Manager's veto. Pillar 3 (Self-Review) addresses accuracy concerns. Pillar 4 (Speed) creates urgency. Each pillar has dual framing for the two primary personas.

| Pillar                         | For Ops Manager (The Buyer)                                    | For IT Manager (The Evaluator)                    |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------------- |
| **1. Core System Integration** | "Data langsung masuk CONFINS/core system Anda"                 | "REST API, single endpoint, JSON response"        |
| **2. No Additional Hardware**  | "Tanpa investasi hardware tambahan"                            | "CPU-only, 8GB RAM, no GPU required"              |
| **3. Self-Review Dashboard**   | "Tim Anda review 5 detik per field, bukan 2 menit ketik ulang" | "Built-in review UI, audit trail, correction API" |
| **4. Fast Time-to-Value**      | "Mulai proses dokumen dalam hitungan hari"                     | "30 minutes signup to first API call"             |

#### Pillar 1: Data Langsung Masuk Core System — Direct Integration

PebbleFlow is extraction-first, workflow-optional. The core product is a REST API that works with whatever the customer already uses. The #1 value proposition: **data from documents goes directly into your core system — no manual re-typing.**

**Primary integration target: Core System Multifinance (CONFINS/LOS)**

> **Industry context:** AdIns CONFINS dominates ~69% of Indonesian multifinance core systems (those with assets Rp 5-10 triliun), used by 30+ companies. CONFINS.R3 has microservices architecture with third-party API integration. PebbleFlow's primary integration story should be: extract data from documents → push structured JSON into CONFINS/LOS automatically.

> **⚠️ ACTION REQUIRED — CONFINS API Validation:** The claim "integration in days, not months" with CONFINS is UNVALIDATED. CONFINS implementations are customized per client — APIs are not standardized. Before making integration claims to customers, contact AdIns to understand CONFINS.R3 API capabilities for external data import. If CONFINS has no import API, messaging must change to "export JSON/CSV for manual input" — still valuable but different. Target: validate by Month 1-2. See also: AdIns partnership strategy in Section 4.2.

```
Customer's Existing Workflow
  │
  ├── CONFINS/LOS → PebbleFlow extracts from scanned docs → JSON → auto-populates credit application
  ├── Core Banking System → PebbleFlow API → structured data → feeds into loan processing
  ├── Claims System → PebbleFlow API → claim form data → auto-creates claim record
  ├── UiPath/Power Automate → HTTP connector → PebbleFlow API → flow continues
  ├── Custom code → POST /api/v1/extract → gets structured JSON
  └── Manual (email) → PebbleFlow Portal → upload → download JSON/CSV
```

**What PebbleFlow is NOT:**

- NOT an RPA platform (we don't replace UiPath or Power Automate)
- NOT a workflow engine (we don't orchestrate multi-step business processes)
- NOT a document management system (we don't store documents)
- NOT a core system replacement (we complement CONFINS/LOS, not replace them)

**What PebbleFlow IS:**

- The extraction layer that feeds your existing core system with structured data
- API-first: `POST document + schema → GET structured JSON`
- Integration with CONFINS/LOS in days, not months

#### Pillar 2: Tanpa Hardware Tambahan — Full CPU, No GPU Required

| PebbleFlow                               | Competitors                                      |
| ---------------------------------------- | ------------------------------------------------ |
| Runs on 8GB RAM, 4 CPU cores             | Laiye: GPU required (e.g., NVIDIA L20 48GB VRAM) |
| Deploy on $50/month CloudSQL or a laptop | Laiye: $10K-20K GPU server                       |
| Cloud cost: ~Rp 16/page (infra)          | GPU cloud: 5-10x more expensive                  |
| Customer's existing servers can run it   | Customer needs to procure GPU hardware           |

**Why this matters for Indonesia:** Mid-tier multifinance and asuransi do NOT have GPU servers. Procurement of GPU hardware requires capital expenditure approval, which takes 3-6 months. PebbleFlow removes this barrier entirely — IT Manager can greenlight without CAPEX approval process.

**Why this is durable:** Laiye's VLM-based approach inherently requires GPU — they structurally cannot match CPU-only deployment without sacrificing their core technology. This is a design trade-off, not a temporary gap.

#### Pillar 3: Tim Anda Tetap Kontrol — Self-Review Dashboard

> **⚠️ REVISED from "Managed HITL":** Original plan was PebbleFlow-managed reviewers. After operational reality check: managed HITL is not feasible for a 1-2 person team (WHO reviews? WHEN? at what COST?). Revised to **self-review dashboard** — customer's own team verifies low-confidence results through a simple UI. This is operationally sustainable, still provides accuracy safety net, and avoids PebbleFlow becoming an outsourced data entry service.

Most extraction APIs give you a probability score and wish you luck. PebbleFlow provides a built-in review dashboard where the customer's ops team can verify and correct low-confidence results in seconds — not minutes.

**How it works:**

```
Document → OCR + SLM extraction → Confidence scoring per field
  │
  ├── All fields ≥ 85% confidence → Auto-approve → Return JSON (fast path)
  │
  └── Any field < 85% confidence → Route to Review Dashboard
        │
        └── Customer's ops team reviews in portal (simple UI: see document + extracted values, click to correct)
              │
              ├── Corrected result → Return JSON
              └── Correction stored as training pair (data flywheel — Post-MVP)
```

**Value proposition:**

- **Ops Manager:** Tim yang sama handle exceptions lewat dashboard web sederhana — review 5 detik per field, bukan 2 menit ketik ulang. Tim Anda tetap kontrol, tetap pegang budget authority, dan hasilnya lebih baik.
- **IT Manager:** No additional system to integrate. Review dashboard is built into the portal. API returns final result (auto-approved or human-reviewed).
- **Compliance:** Every correction is logged with timestamp, reviewer identity, and before/after values — audit trail built-in.
- Corrections feed back into model improvement (data flywheel — Post-MVP)

> **Future option:** Managed review service (PebbleFlow-operated reviewers) can be explored post-revenue if customer demand validates H7. But MVP should NOT depend on this operationally.

#### Pillar 4: Mulai dalam Hitungan Hari — Fast Time-to-Value

> **Important persona note:** The "30 minutes" claim applies to **IT Manager (Persona 2)** who can work with REST APIs. **Operations Manager (Persona 1)** cannot write code — for them, time-to-value depends on IT Manager's availability and prioritization. Realistic time from management decision to first production extraction: **1-2 weeks** (including IT scheduling, integration, and testing). Use "30 minutes" for IT evaluator conversations. Use "mulai dalam hitungan hari" for Ops Manager pitch.

| Metric                   | PebbleFlow                       | Traditional IDP                |
| ------------------------ | -------------------------------- | ------------------------------ |
| Time to first extraction | 30 minutes (IT Manager)          | 2-6 weeks (training, labeling) |
| Schema definition        | JSON schema + field descriptions | Hundreds of annotated samples  |
| Integration method       | REST API (POST + GET)            | Custom SDK + training pipeline |
| New document type        | New schema → instantly works     | New training → days/weeks      |
| Deployment               | Cloud API (signup + API key)     | On-prem setup + configuration  |

**Customer's journey:**

```
1. Sign up on portal (2 min)
2. Create API key (1 min)
3. Define extraction schema (10 min)
   - Name fields: "nama_pemohon", "jumlah_pinjaman", "jangka_waktu"
   - Add descriptions: "Nama lengkap pemohon kredit sesuai KTP"
4. Test with sample document (5 min)
   - Upload PDF/image → see extracted JSON → adjust schema if needed
5. Integrate into existing process (15 min)
   - Single API call: POST /api/v1/extract with file + schema_id
   - Get JSON response with per-field confidence scores
6. Done. Documents are being processed.
```

### 3.3 What PebbleFlow Is NOT

Being clear about what we DON'T do is as important as what we do. This prevents scope creep and confused positioning.

| We Are NOT                      | Why Not                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| An RPA platform                 | Don't replace UiPath/Power Automate. We plug into them.                           |
| A workflow engine               | We do extraction, not orchestration. Build pipeline later, post-revenue.          |
| A document management system    | We don't store documents. Ephemeral processing — in, extract, out, delete.        |
| A pre-built template library    | We don't compete on KTP/passport parsing. Our value is CUSTOM schema extraction.  |
| An enterprise AI agent platform | We're not Laiye ADP. We're a focused extraction API. Do one thing well.           |
| A general OCR service           | Raw OCR is commodity. We do structured extraction — OCR is an internal component. |

### 3.4 Landing Page Messaging Guide

This section provides copy direction for the landing page and pitch deck.

**Hero Section:**

> **Headline:** Data dari Dokumen, Langsung Masuk Core System Anda
>
> **Subheadline:** Otomatis ekstrak data dari formulir kredit, klaim asuransi, dan dokumen apapun — langsung feed ke CONFINS, LOS, atau core system Anda. Tanpa data entry manual. Tanpa GPU. Tanpa ganti sistem.
>
> **CTA:** Request a Demo | Coba Pilot Gratis

> **English alternative (for website language toggle):**
>
> **Headline:** Turn Any Document Into Structured Data — Directly Into Your Core System
>
> **Subheadline:** Automatically extract data from loan forms, insurance claims, and any custom document. JSON output feeds directly into CONFINS, LOS, or your existing workflow. No GPU required.

**Value Props (4 cards):**

| Card | Headline                   | Body                                                                                                                                                 |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Langsung Masuk Core System | REST API yang langsung feed data ke CONFINS, LOS, atau core system Anda. Tanpa data entry manual. Integrasi dalam hitungan hari, bukan bulan.        |
| 2    | Tanpa Hardware Tambahan    | Jalan di server CPU standar Anda. 8GB RAM cukup. Tanpa GPU, tanpa investasi hardware baru, tanpa proses procurement CAPEX.                           |
| 3    | Tim Anda Tetap Kontrol     | Dashboard review bawaan — tim ops Anda verifikasi field yang kurang yakin dalam 5 detik per field. Audit trail lengkap untuk setiap koreksi.         |
| 4    | Your Schema, Any Document  | Definisikan field yang Anda butuhkan. PebbleFlow ekstrak dari dokumen APAPUN — bukan cuma invoice dan KTP. Formulir kredit, klaim, laporan internal. |

**Social Proof Section (post-pilot):**

> "We reduced invoice processing time from 4 hours to 15 minutes. PebbleFlow handles our custom loan forms that no other tool could parse."
> — [Pilot Customer Name], [Title], [Company]

**How It Works (3 steps):**

1. **Define** — Create a JSON schema describing the fields you want to extract
2. **Extract** — Send any document via API. PebbleFlow OCRs and extracts structured data using your schema
3. **Integrate** — Get JSON results with per-field confidence scores. Route to human review if needed.

**Pricing Section:**

> **Simple, transparent pricing**
>
> | Plan           | Monthly Price | Pages Included         |
> | -------------- | ------------- | ---------------------- |
> | **Pilot**      | Free          | 5,000 pages (one-time) |
> | **Starter**    | Rp 5 juta/mo  | 10,000 pages           |
> | **Growth**     | Rp 15 juta/mo | 40,000 pages           |
> | **Enterprise** | Contact Sales | Custom volume + SLA    |
>
> All plans include: per-field confidence scores, human review for low-confidence results, Jakarta data residency.
> Start with a free pilot — 5,000 pages, no commitment.
>
> [Start Free Pilot] [View Full Pricing]

**Trust Section:**

- Jakarta data center (GKE asia-southeast2) — data stays in Indonesia
- Open-source base model architecture (Apache 2.0) — auditable, no black box. Fine-tuned weights optimized for Indonesian BFSI documents.
- Ephemeral processing — documents are never stored
- UU PDP compliant architecture

**Pitch Deck — Key Slides:**

| Slide           | Content                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| Problem         | Manual document processing in BFSI — cost, speed, error rate                  |
| Why Now         | Open-source SLMs + UU PDP enforcement + Google/AWS not in Jakarta             |
| Solution        | Schema-based extraction API: define → extract → integrate                     |
| Demo            | Live extraction of a custom loan form (not a standard invoice)                |
| Differentiators | 4 pillars (CONFINS integration, CPU-only, Self-review, Custom schema)         |
| Market          | $2B IDP market, Indonesia BFSI underserved (~150 multifinance, ~135 asuransi) |
| Competition     | Matrix showing PebbleFlow vs Google/Azure/AWS/Laiye/DIY Build                 |
| Business Model  | Per-page pricing, monthly packages, 80-90% gross margin                       |
| Traction        | Pilot customer results (post-POC)                                             |
| Ask             | What you need (investment, partnership, pilot customers)                      |

---

## 4. Competitive Landscape

### 4.1 Competitive Position Matrix

| Differentiator               | PebbleFlow         | Google DocAI                            | Azure DocAI            | AWS Textract              | Laiye ADP         | DIY Build (Tesseract+LLM) | Huawei         |
| ---------------------------- | ------------------ | --------------------------------------- | ---------------------- | ------------------------- | ----------------- | ------------------------- | -------------- |
| **Jakarta data center**      | ✅                 | ❌ Not in Jakarta (US/EU + select APAC) | ✅ Indonesia Central   | ❌ Unconfirmed in Jakarta | ❌                | ✅ Customer's own         | 🟡 Local DC    |
| **CPU-only deployment**      | ✅ 8GB RAM         | N/A (cloud)                             | N/A (cloud)            | N/A (cloud)               | ❌ GPU required   | ✅ (Tesseract is CPU)     | N/A            |
| **Custom schema extraction** | ✅ Core            | 🟡 Custom Extractor                     | ✅ Custom Extraction   | 🟡 Custom Queries         | ✅ NL-based       | 🟡 Manual prompt eng      | ❌ Templates   |
| **Container on-prem**        | ✅ Planned         | ❌ GDC mega-deal                        | ✅ Connected Container | ❌ None                   | ✅ GPU required   | ✅ Full control           | 🟡 Cloud Stack |
| **Self-review dashboard**    | ✅ Built-in        | ❌                                      | ❌                     | ❌                        | ✅ Managed        | ❌ Build from scratch     | ❌             |
| **Open model (auditable)**   | ✅ Apache 2.0 base | ❌                                      | ❌                     | ❌                        | ❌                | ✅ (uses same OSS)        | ❌             |
| **API-first**                | ✅ REST API        | API only                                | API + Logic Apps       | API + Lambda              | Laiye RPA lock-in | 🟡 Custom-built           | API            |
| **Extraction accuracy (ID)** | 85%+ (fine-tuned)  | High (but no ID locale)                 | High                   | Medium-High               | High              | 60-70% (base model)       | Medium         |
| **Time to production**       | Days               | Weeks                                   | Weeks                  | Weeks                     | Months            | 2-3 months build          | Weeks          |
| **Ongoing maintenance**      | Included           | Included                                | Included               | Included                  | Included          | Customer's burden         | Included       |
| **Published benchmarks**     | ❌ TBD             | ✅                                      | ✅                     | ✅                        | ✅                | N/A                       | ❌             |

> **⚠️ Note:** Mekari Expense/Stream is excluded from this matrix because it operates in a **different market segment** (invoice/receipt processing for Finance teams, not operational document extraction for Operations teams). See Section 4.2 for detailed explanation.
>
> **⚠️ Note on Tencent Cloud OCR:** Tencent offers general OCR in SEA regions at aggressive pricing (Rp 224-336/page for text recognition). However, this is **general OCR** (raw text), not structured extraction comparable to PebbleFlow's schema-based output. Tencent has no custom schema extraction capability — only pre-built template parsers (ID card, passport, receipt). Excluded from matrix due to different product category, but worth monitoring if they add structured extraction.

### 4.2 Key Competitor Analysis

#### Competitor #0: "Do Nothing" (Status Quo)

The most dangerous competitor is NOT Google or Azure. It's **"kita sudah biasa manual, kenapa harus bayar?"**

- **Why this is the #1 competitor:** Mid-tier multifinance has been manually processing documents for 10-20 years. Staff is already hired. Process already works. Pain exists but they're **numb to it.** Changing process requires effort, budget approval, and risk.
- **How to beat status quo:**
  - **Quantify the cost of inaction:** "Perusahaan ukuran Anda spend Rp X miliar/tahun untuk data entry. Dengan error rate 3-5%, rework cost Rp Y/tahun. Total Rp Z. Kami bisa potong 60% dalam 3 bulan."
  - **Create urgency:** UU PDP compliance — manual handling of PII-heavy documents carries higher risk of human error and data leaks
  - **Low barrier to try:** Free pilot with zero commitment removes the "why change?" objection
  - **Show, don't tell:** Run extraction on THEIR actual documents during demo. Seeing their own loan form auto-extracted is worth 100 slides.

#### Competitor #0b: "Hire More Staff"

Many companies' response to document processing pain is NOT buying software — it's **adding headcount.**

- **Cost:** Rp 7-10 juta/month per person (total employment cost in Jakarta incl. BPJS Kes+TK, THR pro-rata, tunjangan makan/transport) × 3 people = Rp 21-30 juta/month. Daerah: Rp 5-7 juta/person.
- **Why companies choose this:** Zero integration risk, no IT approval needed, Ops Manager can just request headcount
- **PebbleFlow must prove:** We deliver BETTER output than 3 more data entry staff — faster (seconds vs minutes), more accurate (no human fatigue errors at 4pm), scalable (volume spikes don't need overtime), and auditable (per-field confidence scores vs "trust me I checked")
- **ROI argument (REVISED — handle more volume, not replace staff):**

**Current framing (WRONG):**

```
Before: 3 staff × Rp 10 juta = Rp 30 juta/month
After: PebbleFlow = Rp 15 juta/month
Savings: Rp 15 juta/month ← implies firing 3 people. Ops Manager will NOT champion this.
```

**Correct framing:**

```
Before: Tim 5 orang proses 500 dokumen/hari. Butuh 3 orang tambahan untuk handle growth.
After: PebbleFlow Rp 15 juta/bulan (Growth plan) + tim existing dioptimalkan untuk verifikasi & QC.
Result: Handle 2x volume tanpa tambah headcount. Tim existing naik peran dari data entry ke quality control.
Savings: Rp 9-15 juta/bulan (avoided hiring cost) + faster processing + fewer errors.
ROI payback: ~2 bulan.
```

> **PMM Note:** The ROI is still strong even with conservative numbers. Don't overstate it — customers will check your math. And NEVER mention "replacing" or "reducing" staff in front of Ops Manager. Frame as: "handle pertumbuhan tanpa tambah orang" (handle growth without adding headcount).

> **Enterprise reality:** In my 20+ years selling enterprise software in Indonesia, the first 3 meetings are always about convincing the customer that the problem is WORTH solving with technology, not about which technology to pick. Budget the first 2-3 sales calls entirely for problem quantification, NOT product demo.

#### Competitor #0c: India BPO Outsourcing (THE INCUMBENT FOR INSURANCE)

> **⚠️ CRITICAL — Added after founder validation with top 3 insurance companies in Indonesia.** This competitor was entirely missing from all previous PRD versions. For insurance segment customers, India BPO is THE incumbent — not status quo, not hire more staff. They have ALREADY outsourced.

> **Source clarification:** Data below is from informal industry conversations and publicly available insurance industry reports, NOT from formal customer interviews (which are planned for Phase 1). Figures represent industry estimates for top-tier insurers and should be validated during customer discovery interviews (H1-H12).

**Real data (validated with top 3 insurance Indonesia, March 2026):**

| Metric                            | Data                                          |
| --------------------------------- | --------------------------------------------- |
| Claims per day (top insurer)      | ~1,500                                        |
| Pages per claim (average)         | ~20                                           |
| Pages per day                     | ~30,000                                       |
| Pages per month (22 working days) | ~660,000                                      |
| Cost per claim                    | **$1 USD** (includes OCR + human HITL review) |
| Cost per page                     | **$0.05 = Rp 800/page**                       |
| Monthly spend per company         | **~$33,000 = ~Rp 528 juta/month**             |
| OCR technology                    | Tesseract-level                               |
| Accuracy                          | Near 100% (human-verified every claim)        |
| Turnaround                        | Batch processing, hours to next business day  |

**Why this changes everything:**

1. **Volume higher than expected for insurance:** Top insurance processes **660,000 pages/month** (~1,500 claims/day × 20 pages). Even mid-tier (100 claims/day) = ~44,000 pages/month (100 × 20 × 22 working days). Combined with updated multifinance volume estimates (40K-150K pages/month for mid-tier), these volumes put most target customers squarely in Enterprise tier.

2. **The problem is already "solved":** These companies DON'T have manual data entry pain — they outsourced it to India years ago. The pain is different: **speed** (hours/days turnaround), **data residency** (PII sent to India), **UU PDP risk** (cross-border PII transfer), and **dependency** (locked into BPO vendor).

3. **PebbleFlow's value prop changes for insurance:**

| Dimension             | India BPO (Current)          | PebbleFlow (Proposed)          |
| --------------------- | ---------------------------- | ------------------------------ |
| **Speed**             | Batch: hours to next day     | Real-time API: seconds         |
| **Data residency**    | PII sent to India            | Data stays in Jakarta          |
| **UU PDP compliance** | ❌ Cross-border PII transfer | ✅ Ephemeral, Jakarta-only     |
| **Accuracy**          | ~100% (human-verified)       | 85%+ (AI) + self-review option |
| **Cost/claim**        | $1.00 (Rp 16,000)            | $0.25-0.50 (Rp 4,000-8,000)    |
| **Integration**       | CSV/manual import            | Direct API to claims system    |
| **Scalability**       | Human capacity limited       | Unlimited (compute-based)      |
| **Consistency**       | Human variability            | Deterministic per schema       |

**How to beat India BPO:**

- **Lead with UU PDP compliance:** "Sekarang data klaim nasabah — termasuk data medis dan KTP — dikirim ke India untuk diproses. Dengan UU PDP yang berlaku efektif Oktober 2024, transfer cross-border PII tanpa consent eksplisit bisa bermasalah. PebbleFlow memproses semua data di Jakarta — tidak ada PII yang keluar Indonesia."
- **Lead with speed:** "India BPO butuh 4-24 jam turnaround. PebbleFlow: 30 detik per klaim. Artinya klaim bisa langsung diproses, bukan menunggu batch berikutnya."
- **Price at 50-75% below BPO:** PebbleFlow at Rp 200-400/page vs BPO at Rp 800/page. Even with self-review overhead, total cost is 50-75% lower.
- **Acknowledge accuracy gap honestly:** "Akurasi kami 85-90% tanpa review manual. Dengan dashboard review, tim Anda verifikasi 10-15% yang kurang yakin dalam 5 detik per field. Total akurasi = setara BPO, tapi lebih cepat dan lebih murah."

> **⚠️ Pricing implication:** India BPO at $1/claim sets the PRICE CEILING for insurance segment. PebbleFlow must price below this + deliver speed/compliance advantages to justify switching. Enterprise pricing at Rp 200/page × 20 pages = $0.25/claim → 75% cheaper than BPO. This is a strong value prop.

#### Google Document AI

- **Strengths:** Mature, accurate pre-built parsers, fair pricing ($0.03/page custom + ~$438/year hosting per processor)
- **Weaknesses:** Not available in Jakarta region (`asia-southeast2`). Available in US, EU, and select APAC (Mumbai `asia-south1`, Sydney `australia-southeast1`) — but NOT Jakarta. Single-region access requires special form submission. On-prem only via GDC (enterprise mega-deal with custom hardware)
- **PebbleFlow wins when:** Customer needs Jakarta data residency OR on-prem without mega-deal commitment

#### Azure Document Intelligence

- **Strengths:** Best on-prem offering (Connected + Disconnected Container), mature Studio UI, SOC 2/ISO 27001
- **Weaknesses:** Disconnected Container = $24K+/year commitment. Indonesia Central region opened May 2025 (cloud services available, but Document Intelligence availability in this region should be verified). Proprietary models
- **PebbleFlow wins when:** Customer budget is below Azure's commitment tier, OR customer wants open model / no lock-in, OR customer needs on-prem without $24K+/year commitment
- **Honest risk:** Azure is the strongest direct competitor. Azure HAS opened Indonesia Central region (May 2025) — data residency advantage vs Azure is now diminished. Focus remaining advantages: CPU-only, open model, pricing accessibility

#### AWS Textract

- **Strengths:** Good pre-built parsers (Analyze Expense, Analyze Lending), strong ecosystem
- **Weaknesses:** AWS Jakarta region (ap-southeast-3) exists since 2022, but Textract availability there is unconfirmed (16 supported regions per aws-services.info Dec 2025 — Jakarta not clearly listed). NO on-prem option. Forms+Tables = $0.065/page (expensive). No custom schema
- **PebbleFlow wins when:** Customer needs custom document extraction (not just standard invoices/receipts)

#### Laiye ADP

- **Strengths:** VLM visual understanding, multi-model orchestration, data flywheel, enterprise case studies
- **Weaknesses:** GPU required (e.g., NVIDIA L20 48GB VRAM), enterprise-only pricing (Contact Sales), no Indonesia presence
- **PebbleFlow wins when:** Customer doesn't have GPU infrastructure (most mid-tier BFSI in Indonesia)
- **Honest risk:** If GPU costs drop significantly or Laiye launches cloud API with transparent pricing, this advantage weakens

#### Huawei Cloud OCR

- **Strengths:** Local data center in Indonesia, government/SOE relationships, aggressive pricing
- **Weaknesses:** Template-based only (KTP, passport, invoice). NO custom schema extraction. Geopolitical risk.
- **PebbleFlow wins when:** Customer has custom/proprietary documents that don't fit Huawei's pre-built templates

#### Mekari Stream (ADJACENT MARKET — NOT A DIRECT COMPETITOR)

> **⚠️ CORRECTED from previous version.** Mekari Stream was previously labeled "LOCAL COMPETITOR — CRITICAL." This was a positioning error. Mekari's document processing capabilities are part of **Mekari Expense** — designed for internal finance operations (invoice processing, receipt scanning, expense reporting) targeting CFO/Finance teams. PebbleFlow targets a **fundamentally different market**: external operational document processing (underwriting, claims, KYC) targeting COO/Operations teams.

**Why Mekari Stream is NOT a direct competitor:**

| Dimension              | Mekari Expense/Stream                                         | PebbleFlow                                                                    |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Target buyer**       | CFO, Finance Manager, AP/AR team                              | COO, Operations Manager, Underwriting team                                    |
| **Document types**     | Invoices, receipts, expense reports (internal financial docs) | Loan applications, claim forms, BPKB, slip gaji (external/customer-submitted) |
| **Workflow**           | Invoice → expense matching → accounting entry                 | Application → data extraction → core system (CONFINS/LOS/claims)              |
| **Integration target** | Mekari Jurnal (accounting), SAP, Oracle Financials            | CONFINS, LOS, claims management system                                        |
| **Budget source**      | Finance/accounting budget                                     | Operations/IT budget                                                          |
| **Use case**           | AP/AR automation, expense compliance, tax invoicing           | Credit underwriting automation, claims processing, collateral verification    |
| **Revenue impact**     | Cost control (internal)                                       | Revenue acceleration (faster loan approval = more loans closed)               |

**Overlap risk:**

- LOW for MVP: Mekari's IDP is tightly coupled to their finance ecosystem. They would need to build a completely separate product to address operational document processing.
- MEDIUM long-term: If Mekari decides to expand into operational IDP, they have the resources and customer base. But this requires a different go-to-market motion, different buyer relationships, and different integration partnerships (AdIns, not Jurnal).

**Implication:** Remove Mekari from competitive pitch. When a prospect mentions Mekari: "Mekari Expense handles invoice dan receipt untuk tim finance Anda — itu produk yang berbeda. Kami fokus di dokumen operasional: formulir kredit, klaim asuransi, dokumen underwriting yang masuk dari nasabah. Buyer yang berbeda, budget yang berbeda, sistem yang berbeda."

#### DIY Internal Build (REAL COMPETITOR — CRITICAL)

> **⚠️ This is the competitor that replaces Mekari Stream as the most immediate threat.** Many mid-tier BFSI IT teams will attempt to build OCR+extraction pipelines using open-source tools (Tesseract/PaddleOCR + regex/GPT API).

- **Why this is dangerous:** IT Manager evaluates PebbleFlow and thinks "I can build this myself with Tesseract + ChatGPT API." Zero procurement process, no vendor registration, full control.
- **Reality check:** Base Tesseract/PaddleOCR + generic LLM gives ~60-70% extraction accuracy on Indonesian BFSI documents. Reaching 85%+ requires: prompt engineering, grammar constraints, confidence calibration, format-specific parsing (Indonesian number formats), and months of iteration. Total cost: 2-3 developers × 2-3 months = Rp 150-300 juta + ongoing maintenance.
- **PebbleFlow wins when:** "Berapa backlog IT team Anda sekarang? Build sendiri = 2-3 bulan × 2-3 engineer yang bisa dipakai untuk project lain. PebbleFlow: Rp 15 juta/bulan, works today, model sudah optimized untuk dokumen BFSI Indonesia. Plus: kami handle updates, security patches, dan accuracy improvement."
- **PebbleFlow loses when:** IT team has idle capacity AND willingness to maintain an extraction pipeline long-term AND can accept 60-70% baseline accuracy while building up.

#### AdIns CONFINS (ECOSYSTEM THREAT — STRATEGIC)

> **⚠️ AdIns is not a direct competitor today, but a strategic ecosystem risk.**

- **Context:** AdIns CONFINS dominates ~69% of Indonesian multifinance core systems (assets Rp 5-10 triliun). 30+ multifinance companies use CONFINS as their core system. CONFINS.R3 has microservices architecture with API integration.
- **Risk:** If AdIns builds or acquires document extraction capability as a CONFINS module, they have instant distribution to 30+ multifinance companies. They could use the same base open-source model (Qwen3 + RapidOCR), but would still need to: (a) collect training data, (b) fine-tune for document extraction, (c) build pipeline engineering. This is 6-12 months of work — but AdIns has the resources.
- **Mitigation:** Approach AdIns for partnership **in Month 1-2** (during customer discovery) — position PebbleFlow as the extraction module for CONFINS. "We focus on extraction so you don't have to build it." This simultaneously: (1) validates CONFINS API integration feasibility, (2) opens partnership conversation, (3) gets insider knowledge about multifinance document processing workflows. Approaching during customer discovery is strategic — it's lower-pressure ("we're doing research") than approaching with a finished product.
- **Timeline:** If no partnership by Month 3, this risk escalates. AdIns could build equivalent capability in 6-12 months.

### 4.3 PebbleFlow's Defensible Advantages

Ranked by durability — revised March 2026 after honest reassessment of "open model" positioning:

| Advantage                               | Durability | Type            | Why                                                                                                                                                                                                                                          |
| --------------------------------------- | ---------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data flywheel** (Post-MVP)            | ✅ High    | Switching cost  | Every customer's HITL corrections create per-customer fine-tuning data. 6 months of corrections = model calibrated to THEIR specific document types. Not replicable by switching to DIY or competitor.                                       |
| **Pipeline engineering (trade secret)** | ✅ High    | IP moat         | Schema-to-prompt conversion, GBNF grammar generation, confidence calibration, multi-page chunking — these are NOT open-source. The model is open, the orchestration is proprietary.                                                          |
| **CPU-only deployment**                 | ✅ High    | Structural      | Laiye's VLM approach inherently needs GPU. This is architectural, not temporary.                                                                                                                                                             |
| **Build vs Buy economics**              | 🟡 Medium  | Cost moat       | Customer self-build: 2-3 bulan × 2-3 engineer (Rp 25-40 juta/bln) = Rp 150-300 juta + ongoing maintenance. PebbleFlow: Rp 15 juta/bulan, works today. For a 5-person mid-tier IT team, building means 40-60% of capacity tied up for months. |
| **Custom schema flexibility**           | 🟡 Medium  | UX advantage    | JSON schema → instant extraction. No training, no annotation. DIY builds require weeks of prompt engineering. Google/Azure can do custom but slower onboarding.                                                                              |
| **Speed of innovation**                 | 🟡 Medium  | Agility moat    | PebbleFlow can upgrade Qwen3-1.7B → 4B → next-gen model in days. Customer's DIY pipeline is frozen at whatever they built.                                                                                                                   |
| **Jakarta data residency**              | 🟡 Low-Med | Temporary       | Azure opened Indonesia Central (May 2025). Advantage only vs Google DocAI and AWS Textract.                                                                                                                                                  |
| **Pricing accessibility**               | 🟡 Low     | Entry advantage | Competitors can match. Not a moat.                                                                                                                                                                                                           |

> **⚠️ REVISED: "Open model" is a TRUST FEATURE, not a MOAT.**
>
> Previous PRD positioned "open model (Apache 2.0)" as the #1 most durable advantage. This was wrong. Open model is actually an **anti-moat for extraction capability** — if the model is open, anyone (customers, AdIns, Mekari) can replicate the extraction pipeline using the same publicly available tools (Qwen3 + RapidOCR + llama.cpp).
>
> **Open model IS valuable as a trust feature** — important for Compliance teams who want to audit the model, and IT Managers who want no vendor lock-in. But it's not what prevents customers from leaving.
>
> **Analogy:** Linux is open-source, but Red Hat built a $34B business on top of it — not because Linux is proprietary, but because the managed service, support, SLA, and continuous improvement are worth paying for. PebbleFlow's moat is the same: pipeline engineering + managed service + data flywheel, not the underlying model.
>
> **The real switching costs are:**
>
> 1. **Data flywheel** — 6+ months of HITL corrections create per-customer model calibration that's lost if they switch
> 2. **Integration investment** — once PebbleFlow is integrated into CONFINS/LOS workflow, switching requires re-engineering
> 3. **Pipeline engineering** — the schema-to-prompt conversion, GBNF grammar, confidence scoring are trade secrets not available on GitHub
>
> **Regulatory tailwind:** OJK's Roadmap Pengembangan dan Penguatan Perusahaan Pembiayaan 2024-2028 explicitly pushes digitalization of multifinance operations. This creates top-down pressure on multifinance companies to adopt digital tools — aligning with PebbleFlow's positioning.

---

## 5. Target Customers & Personas

### 5.1 Primary Segment: Multifinance & Asuransi Indonesia

**Why this segment:**

- Clear pain (manual document processing, 15-30 docs/person/hour)
- Budget accessible (Rp 500 juta - 5 miliar/yr IT budget)
- Decision-making faster than banks (3-6 month cycle vs 12-18 months)
- Not yet committed to an IDP vendor (greenfield opportunity)
- Custom documents are the norm (proprietary loan forms, claim templates)

**Target company profile:**

| Attribute                      | Target                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Company size                   | 500-5,000 employees                                                                                                                             |
| Monthly document volume        | 24,000-100,000 pages (mid-tier multifinance, rank 15-40); 20,000-80,000 (mid-tier asuransi umum); up to 1.5 juta (top-3 multifinance FIF/Adira) |
| Current solution               | Manual data entry or basic OCR (Tesseract-level)                                                                                                |
| IT team size                   | 5-20 people                                                                                                                                     |
| GPU infrastructure             | NO                                                                                                                                              |
| Data residency requirement     | Yes (OJK regulation)                                                                                                                            |
| Budget for document processing | Rp 50-500 juta/year                                                                                                                             |

**Primary use cases (entry points by segment):**

| Segment          | Primary Use Case        | Document Types                                                    | Pain Point                                         | Business Impact                                                 |
| ---------------- | ----------------------- | ----------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| **Multifinance** | Credit underwriting     | Formulir pengajuan kredit, KTP, KK, slip gaji, BPKB, STNK         | Manual data entry delays approval 1-7 hari kerja   | Deal capture rate + NPF reduction (lihat detail bawah)          |
| **Multifinance** | Collateral verification | BPKB, STNK, sertifikat tanah, laporan appraisal                   | Manual verification slows disbursement, fraud risk | BPKB fraud prevention + collateral accuracy (detail bawah)      |
| **Insurance**    | Claims processing       | Formulir klaim, laporan dokter, kuitansi RS, rincian biaya, resep | Claims backlog, SLA violations, fraud undetected   | Fraud detection enablement + cost reduction (detail bawah)      |
| **Insurance**    | Policy underwriting     | Formulir pengajuan polis, SPAJ, medical check-up                  | Underwriting 1-2 minggu, adverse selection risk    | Claims ratio reduction via better risk selection (detail bawah) |

> **⚠️ OUTCOME-BASED VALUE — Use Case #1: Credit Underwriting (Multifinance)**
>
> Value proposition bukan hanya "lebih cepat" — tapi **mengurangi kredit macet (NPF) dan meningkatkan deal capture rate**.
>
> **Deal capture rate — speed kills:**
>
> - Proses kredit motor saat ini: 1-7 hari kerja (sumber: MUF, nexapp.co, motorhondalampung.com). Adira: SPK 1 hari kerja jika lancar, total 1-3 hari (sumber: adirafinance.co.id).
> - Bottleneck: verifikasi dokumen manual. Survei + verifikasi = 3-5 hari kerja (sumber: MUF).
> - Di floor dealer, customer yang menunggu terlalu lama → walk out → apply di leasing kompetitor. Setiap jam delay = potential lost deal.
> - Dengan PebbleFlow: data dari KTP, KK, slip gaji ter-extract ke JSON dalam detik → credit analyst langsung analisis tanpa ketik ulang → keputusan kredit bisa turun di hari yang sama → deal ditutup sebelum customer pergi.
>
> **NPF reduction — the Rp 28 triliun problem:**
>
> - **NPF gross industri multifinance: 2.51% (2025), naik ke 2.72% per Januari 2026** (sumber: OJK/kontan.co.id)
> - **Total piutang pembiayaan: Rp 506-508 triliun** → 2.51% = Rp 12.7 triliun pembiayaan bermasalah
> - **Hapus buku (write-off) 2025: Rp 28 triliun** dari 145 perusahaan multifinance (sumber: OJK via infobanknews)
> - **Pencadangan (allowance): Rp 30 triliun** (2025)
> - **TOTAL pencadangan + hapus buku = Rp 58 triliun = hampir 10% dari total aset industri** (sumber: OJK)
> - OJK: beberapa multifinance terafiliasi perbankan melakukan hapus buku dalam jumlah besar (sumber: infobanknews)
>
> **Bagaimana accurate extraction menurunkan NPF:**
>
> - Salah input penghasilan dari slip gaji → kredit disetujui untuk orang yang sebenarnya DTI ratio-nya >30% → gagal bayar → NPF
> - Salah input nomor KTP → gagal cek SLIK OJK → calon debitur yang sudah blacklist lolos screening → instant NPF risk
> - Salah baca data KK → jumlah tanggungan salah → credit scoring error
> - Penurunan NPF 0.1% saja pada 1 perusahaan mid-tier (piutang Rp 3-5 triliun) = Rp 3-5 miliar less write-off/year
>
> **Messaging untuk Ops Manager multifinance:**
> "Setiap data entry error di penghasilan pemohon = potensi kredit macet. Tim Bapak/Ibu input ribuan slip gaji per bulan — error 3-5% field-level itu bukan angka kecil. Satu kredit macet motor seharga Rp 17 juta = hilang seluruh margin pembiayaan + biaya penagihan + biaya eksekusi fidusia. PebbleFlow extract slip gaji, KTP, KK ke structured data dengan confidence score per field — credit analyst langsung verifikasi, bukan ketik ulang. Hasilnya: keputusan kredit lebih cepat DAN lebih akurat."

> **⚠️ OUTCOME-BASED VALUE — Use Case #2: Collateral Verification (Multifinance)**
>
> Value proposition bukan "risk assessment acceleration" — tapi **mencegah fraud jaminan fidusia dan memastikan collateral value akurat**.
>
> **Jual-beli STNK only — ancaman NPF yang diakui OJK:**
>
> - **OJK dan APPI eksplisit menyoroti** maraknya jual-beli kendaraan hanya menggunakan STNK tanpa BPKB di media sosial (sumber: kontan.co.id, Ketua APPI Suwandi Wiratno, Agusman OJK)
> - Mekanisme: customer kredit motor → BPKB di leasing → customer jual motor di marketplace hanya pakai STNK → buyer pakai motor tanpa BPKB → jika customer default → leasing mau tarik motor tapi motor sudah berpindah tangan → leasing rugi total
> - **"Kerugian bisa terkait dengan NPF yang meningkat"** — Ketua APPI Suwandi (kontan.co.id)
> - OJK: "praktik tersebut berisiko menimbulkan sengketa kepemilikan serta meningkatkan risiko kredit bagi perusahaan multifinance" — Agusman, OJK (kontan.co.id)
>
> **Fidusia ganda (double pledging):**
>
> - Customer meminjam di Leasing A dengan jaminan BPKB motor → lalu entah bagaimana meminjam lagi di Leasing B dengan kendaraan yang sama → saat default, kedua leasing klaim kendaraan yang sama → sengketa hukum
> - Accurate extraction dari BPKB (nomor rangka, nomor mesin, tahun, nama pemilik) → cross-reference otomatis dengan database fidusia → detect duplikasi SEBELUM pencairan
>
> **Collateral value accuracy — LTV yang tepat:**
>
> - Untuk kredit multiguna (SolusiDana, DANASTRA): jaminan BPKB kendaraan. Nilai collateral = nilai pasar kendaraan.
> - Jika data kendaraan salah extract (tahun pembuatan, tipe kendaraan, CC mesin) → Loan-to-Value (LTV) ratio dihitung salah → over-financing → jika customer default, recovery < outstanding → loss
> - Contoh: BPKB menyatakan motor 2022 tapi salah dibaca sebagai 2020 → nilai pasar turun Rp 3-5 juta → LTV jadi 85% bukan 70% → risk meningkat
> - Accurate extraction: tahun, merek, tipe, CC mesin, nomor rangka/mesin → LTV tepat → credit decision aman
>
> **Messaging untuk Ops Manager multifinance:**
> "Berapa kasus yang Bapak/Ibu temukan tahun lalu di mana kendaraan jaminan ternyata sudah dijual STNK only? Atau BPKB yang datanya tidak cocok dengan kendaraan fisik? PebbleFlow extract semua data dari BPKB dan STNK — nomor rangka, nomor mesin, tahun, tipe — langsung ke JSON yang bisa di-cross-reference otomatis. Sebelum pencairan, Anda sudah tahu apakah data konsisten. Ini bukan soal kecepatan — ini soal mencegah kerugian sebelum terjadi."

> **⚠️ CRITICAL VALUE DRIVER — Fraud Detection Enablement for Insurance:**
>
> Structured extraction doesn't just speed up claims processing — it **enables fraud detection** that is IMPOSSIBLE with manual processing or India BPO outsourcing. This is potentially a BIGGER value driver than processing cost savings.
>
> **The fraud problem in Indonesian health insurance is massive:**
>
> - **KPK data (2015):** 175.774 potensi fraud klaim terdeteksi dari rumah sakit/FKRTL dengan nilai Rp 440 miliar — dan ini HANYA dari provider, belum dari aktor lain (sumber: acch.kpk.go.id)
> - **Penelitian (2007):** 69% penyedia layanan kesehatan melakukan kecurangan (sumber: KSI Indonesia)
> - **BPJS Kesehatan defisit Rp 16,5 triliun** — sebagian karena fraud (sumber: infokes.dinus.ac.id)
> - **Inflasi medis Indonesia: 13,6% (2023), 10,1% (2024)** — jauh di atas inflasi umum 3% (sumber: Mercer Marsh Benefits, OJK). Sebagian inflasi ini adalah BUKAN inflasi riil tapi driven by overcharging/fraud
> - **Rasio klaim kesehatan 138% (2023), 105,7% (semester I-2024)** — industri asuransi RUGI di produk kesehatan. Sebagian kerugian ini preventable via fraud detection (sumber: AAJI)
> - **AAJI sedang membentuk pusat data** khusus untuk "meminimalisir fraud" (Ketua AAJI Budi Tampubolon, 2024)
> - **OJK wajibkan co-payment 10% mulai 2026** — SEOJK No. 7/2025 — eksplisit karena masalah overclaiming (sumber: OJK)
> - **OJK mendirikan Medical Advisory Board (MAB)** — untuk review utilisasi dan mitigasi potensi fraud (sumber: AAJI Daily News April 2025)
>
> **Jenis fraud yang structured extraction bisa detect:**
>
> | Jenis Fraud (Permenkes No. 16/2019)                                            | Cara Deteksi via Structured Data                                                        | Tanpa Structured Data                                |
> | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------- |
> | **Upcoding** — diagnosis/prosedur diklaim lebih mahal                          | Cross-reference diagnosis code vs treatment billed. Flag mismatches.                    | Tidak terdeteksi — reviewer manual tidak cek pattern |
> | **Inflated bills** — penggelembungan tagihan obat/alkes                        | Bandingkan harga obat per RS vs benchmark formularium nasional (fornas). Flag outliers. | Tertutup dalam total tagihan                         |
> | **Phantom billing** — klaim atas layanan tidak diberikan                       | Cross-reference tanggal klaim vs riwayat kunjungan pasien. Detect duplicate/phantom.    | Mustahil tanpa data terstruktur                      |
> | **Services unbundling** — memecah prosedur jadi beberapa klaim                 | Detect multiple klaim dalam episode yang sama dari pasien yang sama.                    | Tidak terlihat jika diklaim terpisah                 |
> | **Repeat billing** — klaim berulang untuk kasus sama                           | Duplicate detection berdasarkan patient ID + diagnosis + tanggal ± 7 hari.              | Manual review hampir mustahil                        |
> | **Prolonged length of stay** — perpanjang rawat inap tanpa indikasi            | Bandingkan LOS per diagnosis vs clinical benchmark. Flag outliers.                      | Tidak ada data untuk compare                         |
> | **Obat premium vs generik** — RS pilih obat branded padahal ada generik fornas | Extract nama obat dari resep/rincian biaya → compare vs fornas list.                    | Staff manual tidak hafal fornas                      |
>
> **Value proposition reframing for insurance:**
>
> - **Without PebbleFlow:** Claims processed manually or via India BPO → data arrives in CSV/batch → NO real-time pattern analysis → fraud goes undetected → industry bleeds Rp triliun/year
> - **With PebbleFlow:** Claims extracted to structured JSON in real-time → each field (diagnosis, medication, amount, hospital, patient ID) is immediately available for rules/ML analysis → anomalies flagged before payment → fraud detected BEFORE disbursement
>
> **Financial impact for mid-tier insurer:**
>
> - Annual claims paid: Rp 100-500 miliar
> - Industry fraud rate estimate: 5-10% (conservative, global benchmark per NHCAA)
> - Detectable via structured data analysis: 2-5% of claims
> - Potential savings: Rp 2-25 miliar/year — this DWARFS the cost of PebbleFlow (Rp 240-420 juta/year for Enterprise plan)
> - **ROI: 5-60x on fraud savings alone**, before even counting processing cost reduction
>
> **⚠️ MVP scope clarification:** PebbleFlow MVP does NOT include fraud detection ML/rules engine — that's a post-MVP feature. But MVP DOES provide the structured data that ENABLES fraud detection. The extraction API is the **prerequisite layer** — without structured data, fraud detection is impossible. Sales messaging: "Step 1 (PebbleFlow today): Extract structured data from every claim. Step 2 (coming soon): Analyze patterns to detect fraud. Step 1 is what makes Step 2 possible."
>
> **Competitive advantage:** India BPO returns data in batch CSV with 4-24 hour delay. PebbleFlow returns structured JSON in real-time. This means anomalies can be flagged BEFORE claim is paid, not after. Manual processing has zero cross-referencing capability. PebbleFlow makes every claim queryable, comparable, and analyzable.
>
> **Messaging for insurance Ops Manager:**
> "Berapa persen klaim yang Bapak/Ibu curigai overcharging tapi tidak bisa dibuktikan karena datanya tidak terstruktur? Dengan PebbleFlow, setiap klaim langsung jadi structured data — nama obat, diagnosis, jumlah tagihan, rumah sakit — semua bisa di-cross-reference otomatis. RS yang charge obat branded padahal ada generik di formularium nasional? Terdeteksi. Klaim duplikat dari pasien yang sama di minggu yang sama? Otomatis di-flag. Ini bukan cuma soal kecepatan proses — ini soal proteksi margin Anda dari kebocoran yang selama ini tidak terlihat."

> **⚠️ OUTCOME-BASED VALUE — Use Case #4: Policy Underwriting (Insurance)**
>
> Value proposition bukan "faster policy issuance" — tapi **menurunkan claims ratio melalui seleksi risiko yang lebih akurat**.
>
> **The claims ratio crisis — industri RUGI di produk kesehatan:**
>
> - **Rasio klaim kesehatan: 138% (full year 2023), 105.7% (semester I-2024)** — klaim MELEBIHI premi (sumber: AAJI)
> - **Klaim kesehatan 2024: Rp 24,18 triliun** — naik 16.4% yoy (sumber: AAJI/bisnis.com)
> - **Inflasi medis Indonesia: 13.6% (2023), 10.1% (2024)** vs inflasi umum 3% (sumber: Mercer Marsh Benefits, OJK)
> - Sebagian penyebab: **adverse selection** — calon nasabah yang SUDAH punya masalah kesehatan membeli asuransi → klaim tinggi early in policy
> - Jika underwriting lebih akurat → high-risk applicants teridentifikasi → premi disesuaikan atau ditolak → claims ratio turun
>
> **Current underwriting process — lambat dan error-prone:**
>
> - SPAJ (Surat Permohonan Asuransi Jiwa) diisi manual → dikirim ke underwriter → proses 1-2 minggu (sumber: Prudential, Allianz, Sunday Insurance)
> - Medical check-up results (darah, kolesterol, gula darah, BMI, tekanan darah) → printed/handwritten → diketik ulang ke sistem underwriting
> - **Problem: jika data medical salah input (misal: gula darah 126 dibaca 116) → calon nasabah pre-diabetic lolos screening sebagai standard risk → premi normal → klaim diabetes dalam 1-2 tahun → loss**
> - Semakin kompleks riwayat kesehatan, semakin lama proses. AAJI: "durasi underwriting bervariasi, kalau riwayat kesehatan lebih kompleks, underwriter perlu waktu lebih lama"
>
> **AI underwriting emerging — PebbleFlow sebagai enabler:**
>
> - **AJB Bumiputera 1912 + Seleris** sudah pilot AI underwriting: akurasi 94%, proses analisis kesehatan 3 menit vs berhari-hari/minggu (sumber: bisnisupdate.com, 2025)
> - Teknologi: analisis video wajah + data terstruktur → 28 parameter kesehatan dalam waktu singkat
> - **TAPI:** AI underwriting membutuhkan DATA TERSTRUKTUR sebagai input. Jika SPAJ dan medical check-up results masih dalam format dokumen scan → harus di-extract dulu → PebbleFlow
> - PebbleFlow = **data preparation layer** untuk AI underwriting. Tanpa structured extraction, AI underwriting tidak bisa berjalan.
>
> **Financial impact:**
>
> - Mid-tier asuransi jiwa: premi kesehatan Rp 100-300 miliar/tahun
> - Claims ratio turun dari 138% ke 130% via better risk selection through accurate data = savings Rp 8-24 miliar/year
> - Bahkan 1% improvement in claims ratio = Rp 1-3 miliar per mid-tier insurer
> - **ROI: ratusan kali lipat dari biaya PebbleFlow (Rp 240-420 juta/year)**
>
> **Messaging untuk VP Underwriting / Chief Actuary:**
> "Medical check-up results calon nasabah Anda diketik ulang oleh admin — berapa error rate-nya? Satu angka gula darah yang tertukar bisa berarti menerima risiko pre-diabetic di tarif standard. PebbleFlow extract semua data dari hasil lab dan formulir SPAJ ke structured JSON — usia, BMI, hasil darah, riwayat penyakit, semuanya akurat dan langsung siap untuk scoring. Underwriter Anda bisa fokus pada keputusan, bukan pada membaca tulisan tangan. Hasilnya: risk selection lebih tajam, claims ratio lebih sehat."

> **Land-and-expand strategy:** Start with ONE use case (e.g., credit underwriting), prove value, then expand to adjacent document types within the same customer. Each expansion = more schemas = more page volume = organic revenue growth without additional CAC.

**Named targets (first 8) — Independent mid-tier, NOT konglomerat subsidiaries:**

> **⚠️ VALIDATED March 2026:** Target list reviewed against actual shareholder data. Removed companies incorrectly identified as independent (see notes below).

| Company                            | Segment      | Est. Volume | Entry Point                       | Why This Company                                                                                                                                       |
| ---------------------------------- | ------------ | ----------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Buana Finance (BBLD)               | Multifinance | Medium      | Multi-product loan forms          | Independent (PT Sari Dasa Karsa 67.6%, family-owned), listed IDX, 33 cabang, accessible decision-making                                                |
| Radana Bhaskara Finance (HDFA)     | Multifinance | Small-Med   | Consumer financing                | PE-backed (Rubicon Investment Holdings Singapore 47.51%), listed IDX, relatively independent in IT decisions                                           |
| Clipan Finance (CFIN)              | Multifinance | Medium      | Consumer + commercial financing   | Independent (Lippo Group minority, public float majority), listed IDX, diversified portfolio                                                           |
| Wahana Ottomitra Multiartha (WOMF) | Multifinance | Medium      | Motor financing, daerah           | Listed IDX, strong regional branch network, independent mid-tier. Verify current shareholder independence before approach.                             |
| Asuransi Ramayana (ASRM)           | Insurance    | Medium      | General insurance claims          | Independent, family-owned, listed IDX since 1990, 27 cabang + 18 perwakilan                                                                            |
| Asuransi Bintang (ASBI)            | Insurance    | Medium      | Motor + property claims           | Independent, listed IDX since 1989, pioneer asuransi umum Indonesia                                                                                    |
| Equity Life Indonesia              | Insurance    | Medium      | Policy + claims (jiwa + kumpulan) | Part of Equity Development Investment Group (GSMF), local holding — sister company Asuransi Dayin Mitra (ASDM) is same group, treat as ONE opportunity |
| Asuransi MAG (AMAG)                | Insurance    | Medium      | General insurance claims          | Listed IDX, mid-tier asuransi umum                                                                                                                     |

> **Removed from original list (March 2026 validation):**
>
> | Company                                                                       | Reason Removed                                                                                                                                                                                                          |
> | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | **KB Finansia Multi Finance** (formerly Finansia Multi Finance / Kredit Plus) | Acquired by **KB Kookmin Card Corp** (80%) in July 2020 — subsidiary of KB Financial Group, Korea's largest financial group (~US$1T assets). IT procurement requires Seoul HQ approval.                                 |
> | **KDB Tifa Finance** (formerly Tifa Finance)                                  | Owned by **Korea Development Bank** (84.65%) — Korean state-owned bank. Public float only 0.35%. NOT independent.                                                                                                       |
> | **Asuransi Tri Pakarta**                                                      | Owned by **Dana Pensiun BNI** (62.9%) + Asuransi Wahana Tata (25%). In BNI orbit — BNI is bank KBMI 4. Not truly independent.                                                                                           |
> | **Asuransi Dayin Mitra** (ASDM)                                               | Part of **same GSMF group** as Equity Life Indonesia. Merged into Equity Life entry as one opportunity.                                                                                                                 |
> | **BFI Finance Indonesia** (BFIN)                                              | Technically not konglomerat, but with **10,000+ employees**, 200+ branches, and **Rp 22 triliun** piutang pembiayaan, this is a **top-3 multifinance** — too large for "mid-tier" positioning. Move to stretch targets. |
> | **Mandala Finance** (MFIN)                                                    | **Merger dengan Adira Finance per 1 Oktober 2025** (Danamon/MUFG group). No longer independent.                                                                                                                         |
> | **Batavia Prosperindo Finance** (BPFI)                                        | **Acquired by Woori Card Corp (Korea)** — now PT Woori Finance Indonesia Tbk. Korean parent HQ controls IT procurement.                                                                                                 |

> **Stretch targets (Phase 2, after reference customers):** BFI Finance (top-3, PE-backed), Adira Finance (Danamon/MUFG), FIF (Astra), Tugu Pratama (Pertamina), Allianz Indonesia, Prudential Indonesia — these are large companies or conglomerate/MNC subsidiaries requiring reference customers and longer sales cycles.

### 5.2 Secondary Segment: Fintech

Lower priority because they're more price-sensitive and often have in-house engineering capability.

| Company   | Use Case                           | Likelihood |
| --------- | ---------------------------------- | ---------- |
| Kredivo   | KYC documents, income verification | 🟡         |
| Akulaku   | Loan docs, KYC                     | 🟡         |
| Investree | SME loan documents                 | 🟡         |

### 5.3 User Personas (MVP — Simplified)

For MVP, we serve **two personas** (not four — reduce scope):

#### Persona 1: Operations Manager ("The Buyer")

- **Role:** Head of Operations, VP Operations, Manager Data Processing
- **Reports to:** COO or Director
- **Pain:** "My team spends 60% of their time on data entry from documents. We make 3-5% errors. Every error costs us Rp 500K-5 juta in rework."
- **Goal:** Reduce manual data entry, improve accuracy, speed up processing
- **Buying motivation:** Time savings → cost savings → accuracy improvement
- **Uses PebbleFlow for:** Defining schemas, monitoring extraction accuracy, approving/rejecting results
- **Technical comfort:** Low-to-medium. Can use web portal, can't write code.

#### Persona 2: IT Manager ("The Evaluator")

- **Role:** IT Manager, Technical Lead, System Administrator
- **Reports to:** CTO, IT Director
- **Pain:** "Every vendor wants to replace our entire system. I just need an API that extracts data from documents and sends it to our core banking/claims system."
- **Goal:** Integrate extraction into existing IT stack with minimal disruption
- **Buying motivation:** Easy integration → clean API → good documentation → security compliance
- **Uses PebbleFlow for:** API integration, API key management, monitoring
- **Technical comfort:** High. Evaluates API docs, runs test calls, checks security posture.

> **Deferred personas:** Reviewer (HITL annotator) and Auditor (compliance officer) are deferred to post-MVP. For MVP, HITL is handled by PebbleFlow's managed team, and audit logging is minimal.

### 5.4 Buying Committee Map

Enterprise BFSI Indonesia has 3-5 stakeholders in every purchasing decision. Understanding the buying committee is critical for sales strategy:

| Role                     | Title Examples                       | Influence                                          | What They Care About                                                  | How to Win Them                                                                   |
| ------------------------ | ------------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Initiator / Champion** | Ops Manager, Head of Data Processing | HIGH — identifies the problem, pushes for solution | Time savings, error reduction, team productivity                      | Show ROI numbers specific to their team. Give them ammunition for internal pitch. |
| **Technical Evaluator**  | IT Manager, Technical Lead           | HIGH — can veto on technical grounds               | API quality, security posture, integration effort, maintenance burden | Clean API docs, security whitepaper, 30-minute integration proof.                 |
| **Budget Owner**         | VP Operations, Director, COO         | HIGH — approves the spend                          | Cost vs benefit, payback period, risk to operations                   | ROI presentation with their actual numbers from pilot.                            |
| **Procurement**          | Procurement Manager, Finance         | MEDIUM — process gatekeeper                        | Compliance docs, vendor registration, payment terms                   | DPA template, NPWP, company profile, acceptable payment terms.                    |
| **Influencer / Blocker** | Compliance Manager, Legal            | LOW-MEDIUM — can slow/block                        | Data security, regulatory compliance, vendor risk                     | Security whitepaper, UU PDP compliance posture, ephemeral processing explanation. |

> **Sales implication:** Don't pitch product to Budget Owner on first meeting. Win the Initiator first (they feel the pain), then Technical Evaluator (they validate feasibility), then jointly present to Budget Owner with evidence from pilot. Procurement and Compliance are managed in parallel during contract stage.

> **Common mistake:** Presenting to IT Manager without first securing Ops Manager buy-in. IT Manager will evaluate technically but won't champion if Ops doesn't push.

### 5.5 Anti-Targets (Do NOT Sell To)

| Segment                                             | Why Not                                                                                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Bank KBMI 4 / "buku 4"** (BCA, Mandiri, BRI, BNI) | Already have solutions. 12-18 month procurement cycle. Will demand every enterprise feature before signing. Not worth the effort for MVP. |
| **BPR** (Bank Perkreditan Rakyat)                   | Too small. No IT team. Volume too low to justify per-page pricing.                                                                        |
| **Companies needing only KTP/passport recognition** | Competitors (Google, Huawei) already do this well with pre-built parsers. Our value is custom schema, not standard docs.                  |
| **Companies needing real-time (<1s) extraction**    | SLM inference on CPU takes 10-12s/page. If they need sub-second, we're not the right tool.                                                |
| **Companies that require SOC 2 on day one**         | We won't have SOC 2 for 6-12 months. If it's a hard requirement, we can't sell yet.                                                       |

---

## 6. MVP Feature Scope

### 6.1 In Scope — The "Jeff Dean Cut"

MVP delivers exactly enough to: (1) prove extraction works on real documents, (2) let customers integrate via API, (3) track usage for billing, (4) provide HITL for accuracy.

```
PebbleFlow IDP — MVP
│
├── 🌐 Portal (HonoX + MySQL 8)
│   ├── Email/Password authentication (NO MFA, NO SSO for MVP)
│   ├── Schema CRUD (create, edit, list, delete, test)
│   ├── Test extraction (upload document → see extracted JSON)
│   ├── API key management (create, revoke)
│   ├── Usage dashboard (pages processed per month)
│   └── Basic HITL review queue (for managed reviewers)
│
├── ⚙️ Processing Engine (FastAPI + RapidOCR + Qwen3-1.7B)
│   ├── POST /api/v1/extract (sync, ≤5 pages, ~12s/page)
│   ├── Schema-based extraction (JSON schema → structured JSON)
│   ├── Per-field confidence scoring
│   └── Multi-format support (PDF, PNG, JPG)
│
├── 💳 Billing (IN the Portal — TypeScript, NOT Rust)
│   ├── Usage tracking (pages per org per month per schema)
│   ├── Usage export (CSV for manual invoicing)
│   └── (Manual invoicing initially — no payment gateway)
│
└── 🏗️ Infrastructure
    ├── MySQL 8 (single instance — CloudSQL Jakarta or Docker)
    ├── Redis (single instance — sessions + HITL queue + temp data)
    └── GKE (asia-southeast2, Jakarta) — single node pool
```

### 6.2 Explicitly Out of Scope (and Why)

| Feature                                        | Why NOT in MVP                                                                                                               | When                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Workflow engine**                            | Separate product, not a feature. Requires 2+ months and 7 node types. customers need extraction first.                       | Post-revenue (Phase 3+)                                       |
| **On-prem deployment**                         | Zero customers requesting on-prem today. Validate cloud first.                                                               | When first customer demands it                                |
| **Rust services** (billing, metering, license) | Adds CI pipeline, skill requirement, Dockerfile, deployment complexity. Billing is a CRUD table — TypeScript handles it.     | Never (for billing). Maybe for metering agent (post-revenue). |
| **TiDB**                                       | MySQL 8 handles millions of rows. We'll have thousands. TiDB adds operational complexity (PD, TiDB, TiKV) for zero benefit.  | When we hit MySQL scaling limits (unlikely in first 2 years)  |
| **MFA / SSO**                                  | Pilot customers won't audit MFA on day one. Email/password is sufficient.                                                    | P1 when enterprise customer requires it                       |
| **Audit logging**                              | Pilot customers won't audit in month one.                                                                                    | P1 when compliance customer requires it                       |
| **Async processing**                           | Most BFSI documents are 1-5 pages. Sync API with 90s timeout covers 95% of use cases (~12s/page × 5 pages = 60s + overhead). | When customer has docs >5 pages routinely                     |
| **IP whitelisting**                            | Premature. We don't have traffic to restrict.                                                                                | When enterprise customer requires it                          |
| **Rate limiting**                              | Premature. We don't have traffic to limit.                                                                                   | When we have enough traffic to need it                        |
| **Idempotency keys**                           | Premature. Build when customer needs it.                                                                                     | P1                                                            |
| **On-prem metering + mTLS**                    | No on-prem customer.                                                                                                         | When first on-prem customer appears                           |
| **License file system**                        | No on-prem customer.                                                                                                         | When first disconnected on-prem customer appears              |

### 6.3 API Design

#### Core Endpoints (MVP)

| Method   | Endpoint               | Description                                                           |
| -------- | ---------------------- | --------------------------------------------------------------------- |
| `POST`   | `/api/v1/extract`      | Extract data from document using schema (sync, ≤5 pages, timeout 90s) |
| `GET`    | `/api/v1/schemas`      | List schemas for current org                                          |
| `POST`   | `/api/v1/schemas`      | Create new extraction schema                                          |
| `GET`    | `/api/v1/schemas/{id}` | Get schema detail                                                     |
| `PUT`    | `/api/v1/schemas/{id}` | Update schema                                                         |
| `DELETE` | `/api/v1/schemas/{id}` | Delete schema                                                         |
| `GET`    | `/api/v1/usage`        | Get usage stats for current billing period                            |

#### Extract Endpoint

```http
POST /api/v1/extract
Authorization: Bearer {api_key}
Content-Type: multipart/form-data

file: (binary - PDF, PNG, JPG)
schema_id: "sch_01HQF2QXSWEK5ZXVN0T7C8KFPM"
```

**Response:**

```json
{
  "id": "ext_01HQF2QXSWEK5ZXVN0T7C8KFPM",
  "status": "completed",
  "schema_id": "sch_01HQF2QXSWEK5ZXVN0T7C8KFPM",
  "pages_processed": 2,
  "processing_time_ms": 11200,
  "result": {
    "fields": {
      "nama_pemohon": {
        "value": "Ahmad Suryadi",
        "confidence": 0.94
      },
      "nomor_ktp": {
        "value": "3201234567890001",
        "confidence": 0.91
      },
      "jumlah_pinjaman": {
        "value": 25000000,
        "confidence": 0.88
      },
      "jangka_waktu": {
        "value": "12 bulan",
        "confidence": 0.72
      }
    }
  },
  "requires_review": true,
  "review_fields": ["jangka_waktu"],
  "created_at": "2026-03-23T10:30:00Z"
}
```

#### Schema Definition

```json
{
  "name": "Formulir Pengajuan Kredit",
  "description": "Ekstraksi data dari formulir pengajuan kredit motor",
  "schema": {
    "type": "object",
    "properties": {
      "nama_pemohon": {
        "type": "string",
        "description": "Nama lengkap pemohon kredit sesuai KTP"
      },
      "nomor_ktp": {
        "type": "string",
        "description": "Nomor KTP 16 digit"
      },
      "jumlah_pinjaman": {
        "type": "number",
        "description": "Jumlah pinjaman yang diajukan dalam Rupiah"
      },
      "jangka_waktu": {
        "type": "string",
        "description": "Jangka waktu cicilan (contoh: 12 bulan, 24 bulan)"
      }
    },
    "required": ["nama_pemohon", "nomor_ktp", "jumlah_pinjaman"]
  }
}
```

#### Error Format

```json
{
  "error": {
    "code": "SCHEMA_NOT_FOUND",
    "message": "Schema with ID 'sch_01ABC...' not found"
  }
}
```

#### Data Strategy

| Data                             | Storage            | Retention                                                                             |
| -------------------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| User accounts, org data          | MySQL              | Until deleted                                                                         |
| Schemas                          | MySQL              | Until deleted                                                                         |
| API keys                         | MySQL              | Until revoked                                                                         |
| Usage records                    | MySQL              | 2 years (billing)                                                                     |
| HITL review queue                | Redis (TTL)        | 4 hours                                                                               |
| Extraction results (async cache) | Redis (TTL)        | 24 hours                                                                              |
| Raw documents                    | **Never stored**   | Processed in memory, immediately discarded after extraction                           |
| Extracted PII                    | **Ephemeral only** | In Redis with 4-hour TTL during HITL review, auto-deleted. No persistent PII storage. |

> **⚠️ Precision on "ephemeral processing":** Raw documents are truly never persisted — they exist only in process memory during OCR+SLM inference (~15-60s per document). Extracted field values are held in Redis with a hard 4-hour TTL for HITL review, then auto-deleted. Redis is configured with `maxmemory-policy allkeys-lru` and no disk persistence (`save ""`, `appendonly no`). Application logs NEVER include extracted field values or PII — only extraction metadata (schema_id, page_count, processing_time, confidence_scores). Core dumps disabled in production (`ulimit -c 0`). For BFSI compliance: no PII persists beyond the 4-hour HITL window. All data residency is in Jakarta (GKE asia-southeast2).

#### Indonesian Number & Date Format Handling

> **⚠️ CRITICAL — Added based on PMM review.** Indonesian documents use formatting conventions that differ from international standards. Incorrect parsing of these formats in financial documents is a catastrophic error.

| Format Type             | Indonesian Convention                                 | International Convention     | Example                              |
| ----------------------- | ----------------------------------------------------- | ---------------------------- | ------------------------------------ |
| **Thousands separator** | Dot (.)                                               | Comma (,)                    | 25.000.000 = 25 million              |
| **Decimal separator**   | Comma (,)                                             | Dot (.)                      | 3,5% = 3.5%                          |
| **Currency**            | "Rp 25.000.000" or "25.000.000,-" or "IDR 25,000,000" | "$25,000,000"                | Multiple formats in use              |
| **Date**                | "23 Maret 2026" or "23/03/2026" or "23-03-2026"       | "2026-03-23" or "03/23/2026" | Day-first, month names in Indonesian |

**Requirements for extraction pipeline:**

1. **Number parsing:** "25.000.000" MUST be parsed as 25,000,000 (twenty-five million), NOT as 25.0. A wrong parse of "jumlah_pinjaman: 25.000.000" as 25.0 instead of 25,000,000 would cause disbursing the wrong loan amount.
2. **Date normalization:** Output dates in ISO 8601 (`2026-03-23`) regardless of input format. Handle Indonesian month names (Januari, Februari, Maret, etc.).
3. **Currency extraction:** Strip currency prefix ("Rp", "IDR") and trailing conventions (",-") before numeric parsing.
4. **Validation:** For `type: number` fields from Indonesian documents, apply Indonesian number format parsing by default. Add schema-level override for international format if needed.

> **Testing requirement:** Every number/date format variation listed above MUST have a unit test proving correct parsing. One wrong financial amount destroys customer trust permanently.

---

## 7. Go-to-Market Strategy

### 7.1 GTM Channel Analysis

| Channel                           | Pros                                                              | Cons                                                       | Verdict              |
| --------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- | -------------------- |
| **Direct (Founder-led)**          | Highest margin, direct feedback, fastest iteration                | Need personal network, long cycle, limited reach           | ✅ MVP channel       |
| **System Integrator (SI)**        | Existing relationships, SI handles compliance docs, broader reach | 30-40% margin share, less control, SI may not prioritize   | Phase 2 channel      |
| **Product-Led Growth (PLG)**      | Low CAC, scalable, developer-friendly                             | Doesn't work for enterprise Indonesia — they want meetings | Fintech segment only |
| **Marketplace** (GCP marketplace) | Easy discovery, built-in billing                                  | Transaction fees, less control over relationship           | Post-revenue         |

### 7.2 Recommended GTM Motion: Hybrid, Starting Direct

**Phase 1 — Founder-Led Sales (Month 1-6):**

The founder MUST personally sell the first 3-5 customers. This is non-negotiable. Every successful enterprise SaaS started this way: Marc Benioff (Salesforce), Stewart Butterfield (Slack), Aaron Levie (Box).

```
Founder's Activities:
├── Week 1-4: Customer Discovery
│   ├── 10 customer interviews (using Discussion Guide)
│   ├── Validate hypotheses H1-H7
│   └── Identify 3-5 hot prospects
│
├── Week 5-8: POC Preparation
│   ├── Get sample documents from prospects
│   ├── Benchmark extraction accuracy on THEIR documents
│   ├── Prepare custom demo with their document types
│   └── Draft pricing proposal
│
├── Week 9-16: Pilot Execution
│   ├── Free pilot: 5,000 pages, 4-8 weeks, no commitment
│   ├── Weekly check-in with pilot customer ops team
│   ├── Track: accuracy, time saved, error reduction
│   └── Collect testimonials and usage data
│
└── Week 17-24: Conversion
    ├── Present pilot results: "You saved X hours, reduced errors by Y%"
    ├── Propose paid plan based on actual usage
    ├── Sign first paid contract
    └── Become reference customer
```

**Why direct first:**

1. You need UNFILTERED customer feedback to iterate the product
2. SI would distort feedback ("customer wants X" might be "SI wants X for their SOW")
3. Founder's passion and domain knowledge closes deals that a sales rep can't
4. Reference customers are needed before any SI will take you seriously
5. You learn the sales cycle, objections, and value messaging firsthand

**Phase 2 — Add SI Channel (Month 7-12):**

After having 2-3 reference customers and proven ROI numbers, approach SIs:

| SI Target                       | Why                                          | Approach                                |
| ------------------------------- | -------------------------------------------- | --------------------------------------- |
| **Mitra Integrasi Informatika** | BCA Group, strong in banking/finance IT      | Co-sell joint offer for BCA ecosystem   |
| **Anabatic Technologies**       | Listed on IDX, enterprise software focus     | Technology partnership + reseller       |
| **Multipolar Technology**       | Lippo Group, broad enterprise reach          | Reseller agreement                      |
| **Local IT consultants**        | Smaller, hungry, faster decision-making      | Referral fee (10-15%) for introductions |
| **Deloitte/PwC Indonesia**      | After SOC 2 readiness, for Tier 1 bank entry | Long-term strategic partner             |

**SI arrangement structure:**

| Model        | PebbleFlow Revenue Share | SI Revenue          | When               |
| ------------ | ------------------------ | ------------------- | ------------------ |
| **Referral** | 85-90%                   | 10-15% referral fee | Phase 2 start      |
| **Reseller** | 60-70%                   | 30-40% margin       | After SI training  |
| **Co-sell**  | Variable                 | Joint proposal      | Strategic accounts |

**Phase 3 — PLG Lite (Month 12+):**

For fintech and developer segment only:

- Free tier: 100 pages/month, 1 schema, no HITL
- Self-serve signup on portal
- API playground with sample documents
- Conversion target: free → paid after hitting volume limit

### 7.3 Sales Playbook

#### Sales Cycle (Expected)

| Stage           | Duration  | Activity                                 | Exit Criteria                                                                  |
| --------------- | --------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Discovery**   | 2 weeks   | Interview, understand pain, qualify      | Confirmed: manual processing pain, budget available, decision-maker identified |
| **Demo**        | 1 week    | Live demo with customer's document type  | Customer says: "This could work for us"                                        |
| **POC/Pilot**   | 4-8 weeks | Free pilot, 5,000 pages                  | >85% accuracy on customer's docs, measurable time savings                      |
| **Negotiation** | 2-4 weeks | Pricing, contract terms, procurement     | Signed contract                                                                |
| **Onboarding**  | 2 weeks   | Integration support, schema optimization | First production API call                                                      |

**Total cycle: 4-6 months** (target, for independent multifinance/asuransi; budget 5-8 months worst case)

#### Qualifying Questions (BANT)

| Criteria      | Question                                           | Green Light               | Red Flag                  |
| ------------- | -------------------------------------------------- | ------------------------- | ------------------------- |
| **Budget**    | "Berapa budget IT untuk proses dokumen tahun ini?" | >Rp 100 juta              | "Belum ada budget khusus" |
| **Authority** | "Siapa yang approve pembelian software di sini?"   | Ops Director + IT Manager | "Harus ke board"          |
| **Need**      | "Berapa dokumen yang diproses manual per hari?"    | >100 docs/day             | <20 docs/day              |
| **Timeline**  | "Kapan idealnya masalah ini terselesaikan?"        | "Secepatnya" / "Q3 ini"   | "Belum urgent"            |

#### Objection Handling

| Objection                                    | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Google/Azure sudah ada"                     | "Google DocAI tidak tersedia di region Jakarta — hanya di US, EU, dan beberapa APAC seperti Mumbai dan Sydney. AWS Textract availability di Jakarta juga belum dikonfirmasi. Azure baru buka Indonesia Central Mei 2025, tapi Document Intelligence availability di region itu belum pasti, dan container on-prem tetap butuh commitment $24K+/tahun. Kami bisa deploy di Jakarta dengan harga yang accessible dan model open-source."                                                                                                                                                                                                                                                                                                                                               |
| "Kami sudah punya Tesseract/OCR"             | "Tesseract memberikan raw text. Kami memberikan structured JSON sesuai schema yang Anda definisikan. Perbedaannya: output langsung masuk ke core system tanpa data entry."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| "Akurasinya berapa?"                         | "Kami memberikan per-field confidence score. Yang di bawah threshold, kami review manual. Anda dapat accuracy guarantee, bukan cuma probabilitas. Mari buktikan dengan pilot gratis menggunakan dokumen Anda."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| "Kami perlu on-prem"                         | "Saat ini kami deploy di GKE Jakarta — data tidak keluar Indonesia. Jika on-prem benar-benar diperlukan, kami bisa discusikan deployment khusus. Tapi mari mulai validasi akurasi dulu dengan cloud."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| "Mahal"                                      | "Berapa total biaya kalau tambah 3 orang data entry termasuk BPJS, THR, makan, transport? Di Jakarta sekitar Rp 7-10 juta per orang, jadi Rp 21-30 juta/bulan untuk 3 orang baru. PebbleFlow Growth plan Rp 15 juta/bulan, handle volume yang sama — tanpa perlu hire, training, dan turnover. Plus: tim existing Bapak/Ibu bisa naik peran ke verifikasi dan quality control. ROI biasanya 2-3 bulan."                                                                                                                                                                                                                                                                                                                                                                              |
| "Belum butuh sekarang"                       | **Quantify cost of inaction:** "Berapa biaya data entry team per bulan? Dengan 5 orang di Jakarta, kira-kira Rp 35-50 juta/bulan termasuk tunjangan. Itu Rp 420-600 juta per tahun. Dengan error rate 3-5%, rework cost per error Rp 500K-5 juta. Per tahun bisa Rp 50-100 juta lagi untuk perbaikan error. Total hidden cost: Rp 470-700 juta/tahun. PebbleFlow bisa handle pertumbuhan volume tanpa tambah orang. Coba pilot gratis dulu — kami proses contoh dokumen Anda, Bapak/Ibu lihat hasilnya sendiri. Zero risk."                                                                                                                                                                                                                                                          |
| "Tambah orang saja"                          | "Tambah 3 orang di Jakarta = Rp 21-30 juta/bulan (termasuk BPJS, THR, tunjangan). PebbleFlow handle volume yang sama = Rp 15 juta/bulan. Selisih Rp 6-15 juta/bulan. Tapi yang lebih penting: tim existing Bapak/Ibu bisa naik perannya — dari data entry ke verifikasi dan quality control. Mereka jadi lebih produktif, hasilnya lebih konsisten, dan Bapak/Ibu handle 2x volume tanpa nambah headcount. Plus: tidak ada sick days, tidak perlu 3 bulan training orang baru, tidak ada turnover di akhir tahun."                                                                                                                                                                                                                                                                   |
| "Kami bisa build sendiri pakai open-source"  | "Betul, base model Qwen3 itu open-source. Tapi yang Anda dapatkan kalau download sendiri itu model GENERIK — akurasinya ~70% untuk dokumen Indonesia. Model kami sudah di-fine-tune via SFT dan RL khusus untuk dokumen BFSI Indonesia: formulir kredit, klaim asuransi, BPKB, surat keterangan. Akurasinya 85%+. Fine-tuned weights itu IP kami, tidak tersedia di GitHub. Ditambah: pipeline engineering (schema-to-prompt, GBNF grammar, confidence scoring), hosting, monitoring, security patches, dan model upgrades. Self-build dengan base model: 2-3 bulan build + MASIH harus kumpulkan training data dan fine-tune sendiri = Rp 150-300 juta minimum. PebbleFlow: Rp 15 juta/bulan, works today dengan model yang sudah optimized. Berapa backlog IT team Anda sekarang?" |
| "Sudah pakai Mekari Stream"                  | "Mekari Expense itu untuk proses invoice dan receipt tim finance — produk yang berbeda, buyer yang berbeda. Kami fokus di dokumen operasional: formulir kredit, klaim asuransi, dokumen underwriting yang masuk dari nasabah ke core system operasional Anda seperti CONFINS atau LOS. Beda use case, beda budget, bisa jalan parallel."                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| "Kita harus tender kalau di atas Rp 50 juta" | "Growth plan kami Rp 15 juta/bulan. Apakah ada mekanisme direct purchase untuk langganan bulanan di bawah threshold? Banyak klien kami mulai dari operational budget, bukan CAPEX. Kalau memang harus tender, mari kita siapkan dokumen vendor dan technical comparison-nya — kami bantu."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| "IT team kami sibuk, tidak bisa integrasi"   | "Integrasi kami cuma butuh 1 developer, 1-2 hari. Satu endpoint REST API. Kalau IT belum available, Bapak/Ibu bisa mulai test di portal web kami — upload dokumen, lihat hasilnya. Tidak perlu integrasi dulu untuk evaluasi. Begitu IT ready, integrasinya 15 menit untuk yang sudah familiar REST API."                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| "Kami sudah outsource ke vendor di India"    | "Berapa yang Bapak/Ibu bayar per klaim? $1 per klaim termasuk review manual? PebbleFlow bisa proses di $0.25-0.50 per klaim — 50-75% lebih murah. Plus tiga keuntungan besar: (1) **Speed** — real-time API, hasil dalam 30 detik, bukan menunggu batch berikutnya. (2) **Data residency** — data klaim nasabah tidak keluar Indonesia. Dengan UU PDP yang sudah berlaku, transfer PII ke India itu risiko compliance. (3) **Integrasi langsung** — JSON masuk ke claims system via API, bukan import CSV manual."                                                                                                                                                                                                                                                                   |

### 7.4 Pilot Program Design

**Pilot offer: "5,000 Pages Free"**

> **Why 5,000, not 1,000:** BFSI companies process 500-5,000 docs/DAY. 1,000 pages would be consumed in 1-2 days — not enough to measure meaningful accuracy or time savings over multiple document types. 5,000 pages gives 1-2 weeks of real usage with diverse document samples.

| Aspect                 | Detail                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Duration**           | 4-8 weeks                                                                                                                  |
| **Volume**             | 5,000 pages included free                                                                                                  |
| **Schemas**            | Up to 3 document types                                                                                                     |
| **Support**            | Direct WhatsApp/email with founder                                                                                         |
| **Review**             | Self-review via portal (customer's own team reviews low-confidence fields)                                                 |
| **Success criteria**   | >85% F1 accuracy, measurable time savings                                                                                  |
| **Conversion trigger** | "Continue processing at Rp X/month?"                                                                                       |
| **LOI required**       | Letter of Intent signed before pilot: "If accuracy >85% and time savings >50%, we will proceed to paid plan at Rp X/month" |
| **Exit**               | All data deleted. No lock-in.                                                                                              |

> **⚠️ Pilot-to-paid conversion risk:** Indonesian enterprise culture favors accepting free offerings without conversion commitment. To mitigate, require a **Letter of Intent (LOI)** before starting the pilot. LOI is non-binding but creates psychological commitment and identifies budget owner early. If prospect refuses LOI, they are unlikely to convert — disqualify.

**Pilot success metrics to track:**

| Metric                  | How to Measure                         | Target         |
| ----------------------- | -------------------------------------- | -------------- |
| Field-level F1 score    | Compare extraction vs ground truth     | >85%           |
| Time saved per document | Ops team tracks before/after           | >50% reduction |
| Error rate improvement  | Compare human error rate vs PebbleFlow | >50% reduction |
| User satisfaction (NPS) | Survey ops team after pilot            | NPS >30        |

### 7.5 Pricing Strategy

**Model: Published Indicative Pricing + Monthly Packages**

> **Why NOT "Contact Sales" for a startup:** "Contact Sales" works for established vendors (Laiye, SAP) with brand recognition and case studies. PebbleFlow has neither. For an unknown startup, transparent pricing builds trust, self-qualifies prospects (those whose budget doesn't fit won't waste your time), and reduces sales friction. Publish pricing tiers on the website. Reserve "Contact Sales" only for Enterprise tier.

**Published pricing (on website):**

| Tier           | Monthly Price    | Page Quota   | Effective Rate/Page | Target Customer              |
| -------------- | ---------------- | ------------ | ------------------- | ---------------------------- |
| **Pilot**      | Free             | 5,000 pages  | Free                | Lead generation, 4-8 weeks   |
| **Starter**    | Rp 5 juta/month  | 10,000 pages | Rp 500/page         | Small multifinance/asuransi  |
| **Growth**     | Rp 15 juta/month | 40,000 pages | Rp 375/page         | Mid-tier, main target        |
| **Enterprise** | Contact Sales    | Custom       | Rp 200-350/page     | >50K pages/month, custom SLA |

> **⚠️ Competitive pricing anchor — India BPO (validated March 2026):**
>
> Top insurance companies currently pay India BPO vendors **$1/claim (~Rp 16,000/claim, ~Rp 800/page)** for Tesseract OCR + human HITL review. This includes near-100% accuracy. PebbleFlow's pricing must account for this benchmark:
>
> | PebbleFlow Plan | Per Page | Per Claim (20 pages) | vs India BPO ($1/claim) | Positioning                                    |
> | --------------- | -------- | -------------------- | ----------------------- | ---------------------------------------------- |
> | Starter         | Rp 500   | Rp 10,000 ($0.62)    | 62% of BPO              | At-parity value (faster, data residency)       |
> | Growth          | Rp 375   | Rp 7,500 ($0.47)     | 47% of BPO              | Clear savings + speed + compliance             |
> | Enterprise      | Rp 200   | Rp 4,000 ($0.25)     | 25% of BPO              | 75% cost reduction, compelling for high-volume |
>
> At all tiers, PebbleFlow is cheaper than India BPO AND provides speed (real-time vs batch) + data residency (Jakarta vs India) + UU PDP compliance. This is a strong value proposition for insurance segment.

> **⚠️ Unit economics warning (Starter plan):** ACV Starter = Rp 60 juta/tahun (~$3,750). CAC for founder-led enterprise sales = 5-8 bulan founder time. If founder opportunity cost = Rp 20 juta/bulan, CAC = Rp 100-160 juta. **CAC payback on Starter: 2-3 tahun.** This is not viable for a bootstrapped startup. Recommendation: lead with Growth plan (ACV Rp 180 juta/tahun, CAC payback ~1 tahun). Use Starter only for self-serve fintech segment (PLG Phase 3) where CAC is near-zero.

> **Why monthly packages instead of pure per-page:** BFSI Indonesia budgets annually with fixed amounts. "Rp 500/page" is a variable cost that's hard to put in a budget proposal. "Rp 60 juta/tahun for document processing" is a line item that Finance approves. IT Manager harus bisa bilang: "Ini budget-nya Rp 5 juta per bulan, fix." Overage billed at standard per-page rate.

**HITL surcharge:** Included in Starter/Growth packages for up to 20% of pages. Beyond 20%, additional Rp 800/page for HITL review. If HITL trigger rate >30%, problem is model accuracy, not pricing — improve model.

**On-prem (future):** When available, 50-70% of cloud rate (customer provides infrastructure).

**Billing model:**

- Monthly invoicing (manual for first 5 customers — founder sends invoice via email/WhatsApp)
- **Net 60 payment terms** (Net 30 is aspirational; enterprise Indonesia typically pays Net 60-90. Budget for 90-day receivables.)
- Payment via bank transfer (common in Indonesia)
- Annual prepaid option with 15% discount (incentivizes commitment, improves cash flow)
- Xendit/Midtrans payment gateway integration = Post-MVP

**Gross margin analysis:**

| Component                                                              | Cost/Page           |
| ---------------------------------------------------------------------- | ------------------- |
| GKE compute (t2d-standard-8, 3Y CUD)                                   | Rp 16               |
| MySQL (CloudSQL basic)                                                 | Rp 2-3              |
| Redis (Memorystore basic)                                              | Rp 1-2              |
| HITL support (self-review: onboarding, troubleshooting, ~15% of pages) | Rp 5-10             |
| Customer success time per account                                      | Rp 3-5              |
| Infrastructure monitoring/alerting                                     | Rp 2-3              |
| **Total fully-loaded cost**                                            | **~Rp 30-40/page**  |
| **Selling price**                                                      | **Rp 350-700/page** |
| **Gross margin**                                                       | **80-90%**          |

> **⚠️ PMM Note:** Previous analysis claimed 94-97% gross margin by counting only infra costs. Realistic gross margin is 80-90% when including HITL support overhead, customer success time, and monitoring. Still excellent — but don't quote 94-97% to investors. They'll find the real number during due diligence and lose trust.

> HITL cost is additional: Rp 500-1,000/page for human reviewer time. HITL is triggered on ~15-30% of pages (below confidence threshold). Managed HITL is a cost center initially — must be priced to cover reviewer costs or operated at controlled loss for customer acquisition.

### 7.6 Support Model (MVP)

| Channel                                          | SLA                              | Availability                     | Phase               |
| ------------------------------------------------ | -------------------------------- | -------------------------------- | ------------------- |
| **WhatsApp group** (founder + customer ops + IT) | Response within 4 business hours | Business hours (09:00-18:00 WIB) | Pilot + Starter     |
| **Email** (support@pebbleflow.id)                | Response within 8 business hours | Business hours                   | All tiers           |
| **Dedicated Slack/Teams channel**                | Response within 2 business hours | Extended hours                   | Growth + Enterprise |
| **Monthly review call**                          | Scheduled                        | Monthly                          | Growth + Enterprise |

> **Warning:** Enterprise BFSI expects dedicated support. "Founder + WhatsApp" works for pilot but is NOT scalable. Plan to hire first customer success person by Month 8-10 or when third pilot is onboarded.

### 7.7 Technical Validation Requirements (Pre-Pilot)

Before the first customer conversation, these technical validations MUST be completed:

| Validation                               | Target                                           | Status    | Priority                                                                |
| ---------------------------------------- | ------------------------------------------------ | --------- | ----------------------------------------------------------------------- |
| **Printed Indonesian document accuracy** | >85% F1 on 100+ real docs                        | ⚠️ Needed | CRITICAL — before any sales                                             |
| **Real-world scan quality accuracy**     | >75% F1 on 150 DPI, tilted, faded docs           | ⚠️ Needed | CRITICAL — branch scans are NOT clean PDFs. Benchmark on WORST quality. |
| **Per-critical-field accuracy**          | >95% F1 on amounts, ID numbers, dates            | ⚠️ Needed | CRITICAL — one wrong "jumlah_pinjaman" destroys trust permanently       |
| **Handwritten field accuracy**           | Measure baseline F1                              | ⚠️ Needed | CRITICAL — many BFSI forms have handwritten fields                      |
| **Bilingual document accuracy**          | >80% F1 on ID+EN mixed docs                      | ⚠️ Needed | HIGH — loan forms mix "Nama Pemohon / Applicant Name"                   |
| **Indonesian number format parsing**     | Correct parsing of "25.000.000" as 25M, not 25.0 | ⚠️ Needed | CRITICAL — see Section 6.3 format handling                              |
| **Qwen3-4B fallback benchmark**          | <30s/page on t2d-standard-8                      | ⚠️ Needed | MEDIUM — fallback if 1.7B insufficient                                  |
| **Multi-page PDF handling**              | Correct extraction across pages                  | ✅ Done   | —                                                                       |
| **Processing time (1.7B)**               | <15s/page single page                            | ✅ Done   | —                                                                       |

> **⚠️ PMM Note — Segment accuracy by field criticality:**
>
> 85% aggregate F1 is meaningless if "jumlah_pinjaman" (loan amount) accuracy is 75%. One wrong financial amount could mean disbursing the wrong loan amount, filing insurance claim for wrong value, or regulatory violation.
>
> **Accuracy targets by field type:**
>
> - **Critical fields** (amounts, ID numbers, dates): target >95% F1
> - **Supporting fields** (names, addresses, descriptions): target >85% F1
> - Present PER-FIELD confidence scores to customers, NEVER aggregate F1

> **Handwriting is potentially a dealbreaker.** Many BFSI forms in Indonesia are partially handwritten (applicant name, address, signature). If RapidOCR accuracy drops significantly on handwritten Indonesian, this must be addressed before pilot — either improve OCR or set clear expectations with customers about which fields PebbleFlow can/cannot extract.

---

## 8. Success Metrics & KPIs

### 8.1 Product Metrics

| Metric                             | Target (Month 6)                                           | How to Measure                     |
| ---------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| Extraction accuracy (F1)           | >85% across pilot customers' document types                | Automated eval set from pilot data |
| Processing time (p95)              | <15s per page (single page); ~12s × N pages for multi-page | API latency monitoring             |
| API uptime                         | 99.5%                                                      | Health check monitoring            |
| Time-to-first-extraction           | <30 minutes (signup → first API call)                      | Onboarding funnel tracking         |
| Schema creation → first extraction | <15 minutes                                                | Portal analytics                   |

### 8.2 Business Metrics

| Metric                      | Target (Month 6) | Target (Month 12)              |
| --------------------------- | ---------------- | ------------------------------ |
| Qualified pipeline          | 10-15 companies  | 15-20 companies                |
| Pilot customers             | 3-5              | 5-8 (including converted)      |
| Paying customers            | 0-1              | 2-3 (Enterprise/Growth tier)   |
| MRR                         | Rp 0-20 juta     | Rp 40-75 juta                  |
| ACV pipeline                | Rp 300 juta      | Rp 1 miliar+                   |
| Pages processed/month       | 20,000           | 100,000-250,000                |
| Schemas per paying customer | 1-2              | 3+ (land-and-expand indicator) |
| Customer churn rate         | 0%               | <10%/quarter                   |
| NPS                         | >30              | >40                            |

> **Revenue reality check:** Rp 40-75 juta MRR at Month 12 = 2-3 customers at Enterprise/Growth tier (Rp 20-25 juta/month each, reflecting real volumes of 40K-80K pages/month per mid-tier multifinance). This is achievable for an enterprise product where ONE customer saves Rp 100-300 juta/year in avoided hiring + faster processing. If we can't close 2-3 customers in 12 months of full-time effort, the product-market fit hypothesis is wrong.

### 8.3 Go/No-Go Criteria

After 3 months of customer interviews and pilot, evaluate:

| Criteria                     | Go                                                       | Pivot                                   | Kill                               |
| ---------------------------- | -------------------------------------------------------- | --------------------------------------- | ---------------------------------- |
| Customer interviews (H1-H12) | 5+ confirm problem, 3+ willing to pilot                  | Problem confirmed but different segment | <3 confirm problem exists          |
| Extraction accuracy          | >85% F1 on real customer docs                            | 70-85% (can improve with fine-tuning)   | <70% (technology not ready)        |
| Willingness to pay           | 3+ customers willing at Rp 300+/page                     | Willing but at Rp 100-300 (thin margin) | <Rp 100/page (below cost)          |
| Integration feasibility      | Customer can integrate in <1 week                        | 1-4 weeks (needs support)               | >1 month (architecture mismatch)   |
| First paid contract          | Signed within 8 months (Enterprise tier, Rp 20+ juta/mo) | Signed within 10 months                 | No signed contract after 12 months |
| Month 12 MRR                 | ≥Rp 40 juta (2+ paying customers)                        | Rp 20-40 juta (1 customer, iterating)   | <Rp 15 juta (no traction)          |

> **Timeline reality check:** Enterprise Indonesia sales cycles are 4-8 months for mid-tier BFSI (4-6 months typical, 8 months worst case). First paid contract at Month 8 is realistic for founder-led sales. Month 12 MRR gate is the true business viability test — if we can't reach Rp 40 juta MRR (2 Enterprise/Growth customers) after 12 months of full-time effort, the business model or segment is wrong.

**If KILL criteria met:** Stop engineering investment. Evaluate pivot options: (a) different market (non-BFSI), (b) different geography (SEA outside Indonesia), (c) different product (consulting/services instead of SaaS).

---

## 9. Technical Architecture Summary

> **Detail:** Full technical architecture is in `docs/ARCHITECTURE.md` (to be created from v1 PRD Section 4). This section provides executive summary only.

### 9.1 System Overview

```
┌──────────────────────────────────────────────────────────┐
│                   PebbleFlow IDP — MVP                    │
│                                                           │
│  ┌───────────────────┐      ┌──────────────────────────┐ │
│  │  Portal (HonoX)   │      │  Processing Engine       │ │
│  │  ├─ Web UI         │ ──── │  ├─ FastAPI              │ │
│  │  ├─ REST API       │ HTTP │  ├─ RapidOCR (ONNX)      │ │
│  │  ├─ Auth           │      │  └─ Qwen3-1.7B (GGUF)    │ │
│  │  ├─ Schema CRUD    │      └──────────────────────────┘ │
│  │  ├─ Usage tracking │                                   │
│  │  └─ HITL queue     │                                   │
│  └─────────┬─────────┘                                   │
│            │                                              │
│  ┌─────────▼─────────┐      ┌──────────────────────────┐ │
│  │  MySQL 8           │      │  Redis                   │ │
│  │  ├─ Users, Orgs    │      │  ├─ Sessions             │ │
│  │  ├─ Schemas        │      │  ├─ HITL queue (TTL)      │ │
│  │  ├─ API keys       │      │  └─ Temp extraction data  │ │
│  │  └─ Usage records  │      └──────────────────────────┘ │
│  └───────────────────┘                                   │
│                                                           │
│  Infrastructure: GKE Jakarta (asia-southeast2)            │
└──────────────────────────────────────────────────────────┘
```

> **Multi-tenant data isolation:** API keys stored hashed (argon2id) with a cleartext prefix (`key_01HQ...`) for identification. All database queries scoped by `org_id` — no cross-tenant data access possible at the ORM layer. Redis keys namespaced by org: `org_{org_id}:hitl:{extraction_id}`. HITL review queue strictly filtered by organization. Session tokens bound to user+org. Single-instance MySQL and Redis are acceptable for MVP; row-level org isolation provides logical separation equivalent to separate databases.

### 9.2 Technology Stack

| Component             | Technology                             | Language   | Why                                                                  |
| --------------------- | -------------------------------------- | ---------- | -------------------------------------------------------------------- |
| **Portal + API**      | HonoX + Vite + Tailwind                | TypeScript | SSR + Islands pattern, full-stack, unified frontend/backend          |
| **ORM**               | Drizzle ORM                            | TypeScript | Type-safe, lightweight, MySQL-compatible                             |
| **Processing Engine** | FastAPI + RapidOCR + Qwen3-1.7B (GGUF) | Python     | Best ML/OCR ecosystem, llama.cpp bindings                            |
| **Database**          | MySQL 8                                | —          | Proven, simple, CloudSQL Jakarta available, handles millions of rows |
| **Cache**             | Redis                                  | —          | Sessions, HITL queue, temp data with TTL                             |
| **Infrastructure**    | GKE (asia-southeast2)                  | —          | Jakarta region, Kubernetes-native                                    |

**What we removed (vs v1 PRD):**

| Removed            | Was                                 | Why Removed                                                                                         |
| ------------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Rust services      | Billing, Metering, License          | Overkill. Billing = 1 table in MySQL. No on-prem customers for metering/license.                    |
| TiDB               | Database                            | MySQL 8 is more than sufficient. TiDB adds 3 components (PD, TiDB, TiKV) of operational complexity. |
| Workflow Engine    | 7 node types, DAG executor          | Separate product. Build after extraction is proven.                                                 |
| On-prem deployment | Container packaging, metering agent | No customers requesting it. Validate cloud first.                                                   |

### 9.3 ID Strategy

Prefixed ULID for all primary keys:

```
org_01HQF2QXSWEK...   # Organization
usr_01HQF2QXSWEK...   # User
sch_01HQF2QXSWEK...   # Schema
ext_01HQF2QXSWEK...   # Extraction
key_01HQF2QXSWEK...   # API Key
```

Benefits: human-readable entity type in logs/URLs, lexicographically sortable (efficient B-tree index), `VARCHAR(30)` storage.

### 9.4 Processing Pipeline

```
Document (PDF/Image)
  │
  ├── RapidOCR (ONNX) ──── ~200ms
  │   └── Text extraction + bounding boxes
  │
  ├── Qwen3-1.7B (GGUF, llama.cpp) ──── ~8-12s (8 threads)
  │   ├── Input: OCR text + JSON Schema
  │   ├── GBNF grammar constrains output to valid JSON
  │   └── Output: Structured JSON matching schema
  │
  └── Confidence scoring ──── ~50ms
      ├── Per-field confidence (0.0 - 1.0)
      └── if any field < 0.85 → flag for HITL
```

> **⚠️ Concurrency note:** SLM inference uses all available CPU threads for a single request. Concurrent API requests are queued FIFO — a second request arriving during inference waits ~12s for the first to complete. For MVP with 1-3 customers, this is acceptable (~5,500 pages/day capacity with 8 threads). For production scaling beyond 3 Growth customers: deploy multiple processing pods with Kubernetes HPA (Horizontal Pod Autoscaler), each handling one concurrent inference request.

> **⚠️ Model upgrade path — CPU advantage tension:** PebbleFlow's CPU-only deployment constrains model size to ~4B parameters at acceptable latency (<30s/page). If accuracy demands require larger models (7B+), processing time on CPU exceeds 60s/page, potentially breaking the CPU-only advantage. **Mitigation strategy:** Maximize per-parameter accuracy through fine-tuning (SFT + RL on Indonesian BFSI documents) rather than scaling model size. A well-fine-tuned 1.7B model can outperform a generic 7B model on domain-specific extraction tasks. If accuracy ceiling is reached at 4B, evaluate CPU/GPU hybrid deployment (CPU for <5 page docs, GPU for complex/high-volume) as a post-revenue option.

### 9.5 Infrastructure Cost (MVP)

| Resource                       | Specification               | Monthly Cost                   |
| ------------------------------ | --------------------------- | ------------------------------ |
| GKE (2x e2-standard-4, 3Y CUD) | Portal + Redis + Processing | ~$120                          |
| CloudSQL MySQL 8               | db-standard-1, Jakarta      | ~$35                           |
| Processing VM (t2d-standard-8) | OCR + SLM inference         | ~$148                          |
| Load Balancer + Egress         | Regional external           | ~$25                           |
| **Total**                      |                             | **~$328/month (~Rp 5.2 juta)** |

Break-even: ~10,500 pages/month at Rp 500/page (infra cost only). Fully-loaded break-even (including HITL support, customer success overhead): ~14,000-17,000 pages/month at Rp 375/page (Growth plan rate). Achievable with first Growth customer (40,000 pages/month).

### 9.6 Cash Runway Requirements

> **⚠️ This section was missing from v1 PRD. Cash flow planning is critical for a bootstrapped startup selling to enterprise with Net 60-90 payment terms.**

| Item                             | Monthly Burn      | Notes                                |
| -------------------------------- | ----------------- | ------------------------------------ |
| Infrastructure (GKE+MySQL+Redis) | Rp 5.2 juta       | Fixed from Day 1                     |
| Domain + email + tools           | Rp 500K           | Google Workspace, domain, analytics  |
| Transport + meetings             | Rp 2-3 juta       | Taxi/Grab for Jakarta sales meetings |
| Accounting/tax service           | Rp 1-2 juta       | Monthly SPT reporting (required)     |
| Founder living cost              | Rp 10-15 juta     | Minimal Jakarta living cost          |
| **Total monthly burn**           | **Rp 19-26 juta** | **~$1,200-1,625/month**              |

**One-time costs (pre-revenue):**

| Item                                        | Cost                | Notes                                                         |
| ------------------------------------------- | ------------------- | ------------------------------------------------------------- |
| PT establishment (notaris + SK Kemenkumham) | Rp 15-30 juta       | REQUIRED before first sale. Budget 2-3 months timeline.       |
| NIB + KBLI via OSS                          | Rp 0 (free)         | But process takes 1-2 weeks                                   |
| PKP registration (faktur pajak)             | Rp 0 (free via DJP) | Process takes 2-4 weeks. Some BFSI procurement requires this. |
| NDA/contract templates (legal review)       | Rp 5-10 juta        | Essential before any customer interaction                     |
| Penetration test                            | Rp 50-100 juta      | Required before BFSI pilot. Some companies mandate this.      |
| Professional liability insurance (optional) | Rp 5-10 juta/year   | Optional but builds trust with enterprise prospects           |
| **Total one-time (estimated)**              | **Rp 75-150 juta**  |                                                               |

**Cash flow timeline (realistic scenario):**

```
Month 1-8:   Customer discovery + build + pilot → ZERO revenue
Month 8-10:  First contract signed → revenue on paper, NOT in bank
Month 10-12: Net 60-90 payment cycle → FIRST CASH arrives
Month 12-15: Second/third customer converts → revenue building
```

**Minimum runway required: Rp 500-600 juta ($31,000-37,500) for 18-24 months.**

This covers: 12 months zero-revenue period + one-time costs (PT, legal, pen test) + 6-month buffer for delayed payments and unexpected costs (co-founder hire, additional compliance requirements).

> **Critical founding team note:** PRD assumes 1-2 person team. Realistically, a **technical co-founder or part-time engineer is needed by Month 4** (before second pilot). Founder cannot simultaneously: sell to new customers, support existing pilot, fix production bugs, and build new features. Budget for this in runway calculation.

### 9.7 Compliance Posture (MVP)

| Requirement             | MVP Status     | Detail                                                     |
| ----------------------- | -------------- | ---------------------------------------------------------- |
| **UU PDP**              | ✅ Addressed   | Ephemeral processing, Jakarta DC, DPA template ready       |
| **OJK vendor docs**     | ⚠️ In progress | Security whitepaper + pen test before pilot                |
| **SOC 2**               | ❌ Post-MVP    | 6-12 months, $50-150K. Not needed for pilot with mid-tier. |
| **Data residency**      | ✅ Addressed   | GKE Jakarta. All persistent data in Indonesia.             |
| **Breach notification** | ✅ Addressed   | Incident response procedure drafted.                       |

> Full compliance details: see `docs/COMPLIANCE.md` (to be extracted from v1 PRD Section 8).

---

## 10. Risks & Mitigations

### Business Risks (most critical)

| #   | Risk                                                                                                                                                                                                 | Impact | Probability             | Mitigation                                                                                                                                                                                                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **No customer validates the problem** — manual processing pain is overstated or budget is too small                                                                                                  | FATAL  | Medium                  | 10 customer interviews before heavy engineering investment. Go/No-Go at Month 3.                                                                                                                                                                                                                   |
| B2  | **WTP below unit economics** — customers willing to pay <Rp 100/page                                                                                                                                 | HIGH   | Medium                  | Van Westendorp pricing in interviews. If WTP too low, pivot to higher-value use cases or different segment.                                                                                                                                                                                        |
| B3  | **Sales cycle too long** — 6+ months to first paid contract                                                                                                                                          | HIGH   | High                    | Offer free pilot to speed POC. Target multifinance (3-5 month cycle), avoid banks (12+ months).                                                                                                                                                                                                    |
| B4  | **Azure already opened Jakarta region (May 2025)** — data residency advantage vs Azure diminished                                                                                                    | MEDIUM | ✅ Occurred             | Data residency advantage remains vs Google DocAI (not in Jakarta region) and AWS Textract (unconfirmed in Jakarta). Focus on CPU-only deployment, pipeline engineering, and data flywheel as durable moats. Accelerate customer acquisition before Azure expands AI services in Indonesia Central. |
| B5  | **Pilot-to-paid conversion failure** — Indonesian enterprise accepts free pilot but doesn't convert to paid                                                                                          | HIGH   | High (60-70% risk)      | Require Letter of Intent (LOI) before pilot start. LOI states: "If accuracy >85% and time savings >50%, we proceed to paid plan at Rp X/month." Non-binding but creates psychological commitment and identifies budget owner early. If prospect refuses LOI → disqualify.                          |
| B6  | **Cash flow crisis** — Net 60-90 payment terms + 8-10 months zero-revenue = 14-16 months cash burn before income                                                                                     | HIGH   | High                    | Minimum runway: Rp 500-600 juta for 18-24 months. See Section 9.6. Prioritize annual prepaid contracts (15% discount) to improve cash flow.                                                                                                                                                        |
| B7  | **Unit economics: Starter ACV too low for enterprise CAC** — ACV Rp 60 juta vs CAC Rp 100-160 juta (5-8 months founder time) = 2-3 year payback                                                      | MEDIUM | High                    | Lead with Growth plan (ACV Rp 180 juta). Reserve Starter for self-serve/fintech only (Phase 3 PLG). **Do NOT sell Starter to enterprise customers. Period.**                                                                                                                                       |
| B8  | **Legal entity not ready** — PT not established, no NPWP/PKP, cannot issue faktur pajak. BFSI procurement cannot register PebbleFlow as vendor.                                                      | HIGH   | Medium (if not started) | Start PT establishment immediately. Budget 2-3 months and Rp 15-30 juta. Required before ANY commercial activity. BFSI companies cannot procure from individuals, CVs, or foreign entities without Indonesian PT subsidiary.                                                                       |
| B9  | **Document quality gap** — accuracy drops from 85% (clean PDF) to <70% on real-world branch scans (150 DPI, tilted, faded thermal paper, stamps overlapping text, mobile phone photos). Pilot fails. | HIGH   | Medium-High             | Benchmark on WORST quality documents before sales. Invest in pre-processing (deskew, denoise, enhance). Set minimum quality expectations: "clean scan required, minimum 200 DPI." If accuracy <75% on mediocre quality docs, improve pre-processing before selling.                                |

### Market Risks

| #   | Risk                                                                                                                                  | Impact | Probability           | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M1  | **Laiye or Huawei enters Indonesia aggressively**                                                                                     | HIGH   | Low-Medium            | Monitor closely. PebbleFlow's CPU advantage is structurally durable vs Laiye. Against Huawei, differentiate on custom schema (Huawei is templates only).                                                                                                                                                                                                                                                                                                                                   |
| M2  | **GPU costs drop dramatically** (making VLM accessible to mid-tier)                                                                   | MEDIUM | Low (3-5 yr)          | Build customer base now while CPU advantage holds. Data flywheel creates switching cost.                                                                                                                                                                                                                                                                                                                                                                                                   |
| M3  | **Regulation changes** — OJK requires specific IDP certification                                                                      | MEDIUM | Low                   | Monitor OJK regulations. Engage compliance counsel.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| M4  | **DIY internal build becomes default** — mid-tier BFSI IT teams build OCR+LLM pipelines in-house using same open-source stack         | HIGH   | Medium-High           | Differentiate on: fine-tuned accuracy (85%+ vs 60-70% base), pipeline engineering trade secrets, managed service with zero maintenance burden, faster time-to-value (days vs months). Win on total cost of ownership: build = Rp 150-300 juta + ongoing dev time. Buy = Rp 15 juta/month, ready today.                                                                                                                                                                                     |
| M5  | **AdIns builds extraction into CONFINS** — core system vendor adds document extraction as native module, using same open-source stack | FATAL  | Medium (12-24 months) | Approach AdIns for partnership PROACTIVELY by **Month 1-2** (during customer discovery, NOT after). Position as extraction module for CONFINS: "We focus on extraction so you don't have to build it." This simultaneously validates CONFINS API integration and opens distribution channel. If partnership fails, pivot to insurance-first (CONFINS is multifinance-focused). If no partnership by Month 3, this risk escalates — AdIns could build equivalent capability in 6-12 months. |

### Technical Risks

| #   | Risk                                                                                                                              | Impact | Probability | Mitigation                                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | **Extraction accuracy <85% on real Indonesian documents**                                                                         | HIGH   | Medium      | Benchmark BEFORE selling. Collect real docs from interviews. If <85%, improve prompts or upgrade to Qwen3-4B.                                                                                                                                             |
| T2  | **SLM hallucination on financial data**                                                                                           | HIGH   | Medium      | Per-field confidence scoring. HITL safety net for low-confidence. GBNF grammar constrains output format. Never trust financial values <90% confidence without human review.                                                                               |
| T3  | **Prompt injection via document content**                                                                                         | LOW    | Low         | System prompts hardcoded. Input treated as data, not instructions. GBNF grammar limits free-form generation.                                                                                                                                              |
| T4  | **Real-world accuracy gap** — benchmark on clean docs ≠ production accuracy on low-quality scans, faded forms, handwritten fields | HIGH   | High        | Benchmark on REAL customer documents (not clean samples) BEFORE committing to pilot. If printed <85% F1 → improve prompts or upgrade to Qwen3-4B. If handwritten <70% F1 → explicitly EXCLUDE handwritten fields from scope and communicate this upfront. |

### Operational Risks

| #   | Risk                                                                                                                                                | Impact | Probability | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Single founder bottleneck** — sales, engineering, support all one person                                                                          | HIGH   | High        | Prioritize ruthlessly. Only build what's needed for next customer milestone. Automate what you can.                                                                                                                                                                                                                                                                                                                                           |
| R2  | **HITL reviewer quality** — managed reviewers make errors                                                                                           | MEDIUM | Medium      | QA process for reviewers. Spot-check corrections. Start with small volume where founder can personally QA.                                                                                                                                                                                                                                                                                                                                    |
| R3  | **HITL reviewer cost** — surcharge doesn't cover labor cost                                                                                         | MEDIUM | Medium      | Track HITL trigger rate per customer. If >30% pages need HITL, accuracy is too low — improve model, not add reviewers.                                                                                                                                                                                                                                                                                                                        |
| R4  | **HITL workforce sourcing** — who are the managed reviewers?                                                                                        | MEDIUM | High        | Options: (a) freelance annotators (Upwork/local), (b) outsource to annotation company, (c) founder + 1-2 part-timers initially. Decision needed before pilot.                                                                                                                                                                                                                                                                                 |
| R5  | **Open-source replication risk** — customer or competitor builds equivalent extraction using same base model (Qwen3 + RapidOCR + llama.cpp)         | MEDIUM | Low-Medium  | Base model is open but fine-tuned weights (SFT/RL for Indonesian BFSI document extraction) are proprietary IP. Competitor using base Qwen3 gets ~70% F1; PebbleFlow's fine-tuned model targets 85%+. The gap = months of training data collection + fine-tuning expertise. Additionally: pipeline engineering (schema-to-prompt, GBNF, confidence calibration) is trade secret. Build data flywheel ASAP to widen the accuracy gap over time. |
| R6  | **Document sensitivity trust gap** — without SOC 2/ISO 27001, BFSI compliance teams will hesitate to send PII-heavy documents to an unknown startup | MEDIUM | Medium      | Publish security whitepaper + conduct pen test before first pilot. Offer to sign DPA (Data Processing Agreement) and NDA. Emphasize ephemeral processing — documents never stored. Aim for SOC 2 by Month 12-18.                                                                                                                                                                                                                              |

---

## 11. Milestones & Timeline

> **Team assumption:** 1-2 person team (founder + possible co-founder/early hire). Adjusted from v1's unrealistic 6-month, 10-feature roadmap.
>
> **⚠️ Founding team reality check:** A single founder cannot simultaneously: sell to new customers, support existing pilot, fix production bugs, build new features, and handle billing/admin. **Technical co-founder or part-time engineer needed by Month 4 at latest** (before second pilot). Budget this in runway planning.
>
> **Cash runway requirement:** Minimum Rp 500-600 juta ($31,000-37,500) for 18-24 months. See Section 9.6 for detailed burn analysis.

> **⚠️ Compliance readiness prerequisite (BEFORE Week 1):** The following must be started in PARALLEL with (not after) customer discovery, because BFSI companies require these before sharing ANY operational information:
>
> - PT establishment started (akta pendirian from notaris, even if SK Kemenkumham pending) — 2-3 months timeline
> - NDA template prepared under PT name (bilingual ID/EN)
> - Professional email domain active (@pebbleflow.id, NOT @gmail.com)
> - Minimal company profile document ready (nama PT, founders, background, NPWP jika sudah ada)
> - Secure file sharing set up (corporate Google Workspace or equivalent, NOT personal GDrive)
> - Data handling policy drafted (1-2 pages: how sample documents are handled, retained, deleted)
> - Penetration test SCHEDULED for Month 2-3 (Rp 50-100 juta, some BFSI companies require this before pilot)

### Phase 1: Validate & Build Core (Month 1-3)

**Goal:** Validate problem, build minimum extraction API, benchmark accuracy on real Indonesian documents.

| Week | Activity                                                              | Deliverable                                        |
| ---- | --------------------------------------------------------------------- | -------------------------------------------------- |
| 1-4  | **Customer discovery** — 10 interviews using Discussion Guide         | Validated/invalidated hypotheses H1-H10            |
| 1-4  | **Benchmark** — collect 100+ real Indonesian BFSI docs, measure F1    | Accuracy baseline: printed, handwritten, bilingual |
| 1-2  | **Handwriting test** — benchmark RapidOCR on handwritten ID forms     | Go/no-go: is handwriting a dealbreaker?            |
| 3-8  | **Build** — extraction API + portal (schema CRUD, test, API keys)     | Working POST /api/v1/extract                       |
| 5-8  | **Pilot prep** — custom demo for top 3 prospects with THEIR doc types | Demo deck + sample extraction results              |
| 8-12 | **Pilot #1** — onboard first free pilot customer (5,000 pages)        | Pilot customer actively using system               |

**Go/No-Go checkpoint (Week 12):**

- ≥5 interviews confirm problem (H1-H10)
- ≥85% F1 on pilot customer's printed documents
- Handwriting accuracy assessed — if <70% F1, set clear scope boundaries with customer
- ≥1 pilot customer actively engaged
- If NO → re-evaluate segment, pivot, or kill

### Phase 2: Pilot & Iterate (Month 4-6)

**Goal:** Prove value with pilots, convert to paid, reach product-market fit signal.

| Week  | Activity                                                                   | Deliverable                                  |
| ----- | -------------------------------------------------------------------------- | -------------------------------------------- |
| 13-16 | **Pilot #2-3** — onboard 2 more pilot customers                            | 3 active pilots                              |
| 13-20 | **Iterate** — improve accuracy based on pilot feedback                     | Model prompt optimization, schema refinement |
| 13-20 | **Build** — usage dashboard, billing (manual invoicing), HITL review queue | Complete portal for ops + billing            |
| 17-20 | **Convert** — present pilot results, propose paid plan                     | ≥1 signed contract (target Month 8-10)       |
| 20-24 | **Collect** — testimonials, case study data, reference letters             | Marketing collateral for next phase          |

**P/MF Signal:** 3 things must be true simultaneously:

1. ≥1 paying customer
2. NPS ≥30 from pilot users
3. Customer asks "can I process more document types?" (organic demand)

> **Outcome focus:** Track and communicate outcomes, not features. "Loan processing time reduced from 4 hours to 15 minutes" is what sells. "JSON schema-based extraction" is how it works. Lead with outcomes in every customer conversation.

### Phase 3: Scale & Channel (Month 7-12)

**Goal:** Grow to 5+ paying customers, establish SI channel, prepare for fundraising.

| Activity                                          | Deliverable                                          |
| ------------------------------------------------- | ---------------------------------------------------- |
| Convert remaining pilots to paid                  | 3-5 paying customers                                 |
| Launch SI channel (1-2 partners)                  | First SI-originated lead                             |
| Build: async API, webhook notifications           | Handle >10 page documents                            |
| Build: on-prem container (IF customer demands it) | Container image + deployment guide                   |
| Security: penetration test, security whitepaper   | Compliance documentation for enterprise              |
| Hiring: first sales/customer success hire         | Founder freed from support to focus on product/sales |

### Future (Post Month 12)

| Feature                                               | Trigger                                                  |
| ----------------------------------------------------- | -------------------------------------------------------- |
| **On-prem deployment**                                | When ≥2 customers contractually require it               |
| **Workflow engine** (simple pipeline, not DAG)        | When ≥3 customers ask "what happens after extraction?"   |
| **SSO / MFA**                                         | When enterprise customer makes it a contract requirement |
| **SOC 2 certification**                               | When Tier 2 bank is ready to buy but needs SOC 2         |
| **Data flywheel** (fine-tuning from HITL corrections) | When HITL correction volume is sufficient for training   |
| **SEA expansion** (Singapore, Malaysia, Thailand)     | When Indonesia revenue is stable and growing             |

> **Data flywheel: design from day 1, implement later.** Even though fine-tuning is post-MVP, store every HITL correction as a training pair (original extraction + corrected values + document type + schema). This is zero-cost now but enables the most durable competitive moat later — per-customer accuracy improvement that creates switching costs.
>
> **Model improvement roadmap:**
>
> 1. **MVP:** Base Qwen3-1.7B with prompt engineering + GBNF grammar (no fine-tuning yet)
> 2. **Post-pilot (Month 4-6):** SFT on collected document-extraction pairs from pilot customers' real documents
> 3. **Post-revenue (Month 8-12):** RL optimization for extraction quality metrics (F1, field accuracy, JSON validity)
> 4. **Ongoing:** HITL corrections from each customer feed into per-customer model calibration (data flywheel)
>
> Each stage widens the accuracy gap between PebbleFlow's fine-tuned model and the base open-source model that anyone can download. By Month 12, PebbleFlow's extraction model should be 10-15 F1 points ahead of base Qwen3 on Indonesian BFSI documents.

---

## 12. Appendix

### A. Document References

| Document                                         | Content                                                         | Status                 |
| ------------------------------------------------ | --------------------------------------------------------------- | ---------------------- |
| `docs/ARCHITECTURE.md`                           | Full technical architecture (extracted from v1 PRD Section 4)   | To be created          |
| `docs/COMPLIANCE.md`                             | Regulatory compliance details (extracted from v1 PRD Section 8) | To be created          |
| `docs/MVP-INTERVIEW-GUIDE.md`                    | Customer interview discussion guide for hypothesis validation   | See companion document |
| `docs/PRD-intelligent-document-processor-mvp.md` | Original PRD v1 (retained for architecture reference)           | Archived               |
| `tasks/prd-review.md`                            | Critical review of v1 PRD                                       | Reference              |

### B. Competitive Pricing Reference

> **Internal only — NOT for external sharing.**

| Vendor          | Product                 | Per-Page (USD) | Per-Page (IDR @Rp16K)     | vs PebbleFlow      |
| --------------- | ----------------------- | -------------- | ------------------------- | ------------------ |
| PebbleFlow      | Schema-based extraction | $0.022-0.044   | Rp 350-700                | Baseline           |
| Google DocAI    | Custom Extractor        | $0.03          | Rp 480 + hosting ~$438/yr | At parity          |
| Azure DocAI     | Custom Extraction       | $0.03          | Rp 480                    | At parity          |
| AWS Textract    | Forms+Tables            | $0.065         | Rp 1,040                  | PF cheaper         |
| AWS Textract    | Custom Queries          | $0.025         | Rp 400                    | Similar            |
| Azure Container | Disconnected (annual)   | ~$0.02         | Rp 320 + $24K commitment  | PF more accessible |
| Laiye ADP       | Contact Sales           | Unknown        | Enterprise deal           | Different segment  |

### C. Key Assumptions & Unknowns

| Item                 | Assumption                                                | Confidence | Validation Plan                             |
| -------------------- | --------------------------------------------------------- | ---------- | ------------------------------------------- |
| Extraction accuracy  | Qwen3-1.7B can achieve >85% F1 on Indonesian BFSI docs    | 🟡 MEDIUM  | Benchmark on 100+ real docs before pilot    |
| Customer WTP         | Rp 300-700/page is acceptable                             | 🟡 MEDIUM  | Van Westendorp pricing in 10 interviews     |
| HITL trigger rate    | ~15-30% of pages need human review                        | 🟡 MEDIUM  | Measure during pilot                        |
| Sales cycle          | 3-5 months for multifinance/asuransi                      | 🟡 MEDIUM  | Track during first 3 sales                  |
| Processing time      | <15s per page on t2d-standard-8                           | ✅ HIGH    | Already benchmarked                         |
| Market size          | ~150 multifinance + ~135 asuransi (77 umum + 58 jiwa)     | ✅ HIGH    | OJK registry data (2024-2025)               |
| Handwriting accuracy | RapidOCR handles handwritten Indonesian fields            | 🟠 MEDIUM  | Benchmark on handwritten forms before pilot |
| Bilingual documents  | OCR+SLM handles mixed ID/EN documents                     | 🟠 MEDIUM  | Benchmark on bilingual loan forms           |
| Payment terms        | Enterprise Indonesia pays Net 60-90                       | ✅ HIGH    | Standard enterprise Indonesia practice      |
| Sales cycle          | 5-8 months for independent mid-tier multifinance/asuransi | 🟠 MEDIUM  | Track during first 3 sales                  |

### D. Glossary

| Term     | Definition                                                                  |
| -------- | --------------------------------------------------------------------------- |
| BFSI     | Banking, Financial Services, Insurance                                      |
| F1 Score | Harmonic mean of precision and recall — standard extraction accuracy metric |
| GBNF     | Grammar-based output constraint for LLM — Forces valid JSON output          |
| GGUF     | GPT-Generated Unified Format — efficient model format for CPU inference     |
| GTM      | Go-to-Market                                                                |
| HITL     | Human-in-the-Loop — human review for low-confidence extraction results      |
| MRR      | Monthly Recurring Revenue                                                   |
| NPS      | Net Promoter Score — customer satisfaction metric (-100 to 100)             |
| OCR      | Optical Character Recognition                                               |
| ONNX     | Open Neural Network Exchange — cross-platform ML inference runtime          |
| P/MF     | Product-Market Fit                                                          |
| PLG      | Product-Led Growth                                                          |
| POC      | Proof of Concept                                                            |
| SI       | System Integrator                                                           |
| SLM      | Small Language Model (≤4B parameters, runs on CPU)                          |
| ULID     | Universally Unique Lexicographically Sortable Identifier                    |
| UU PDP   | Indonesia Personal Data Protection Law (UU No. 27/2022)                     |
| VLM      | Vision-Language Model — AI that processes images + text together            |
| WTP      | Willingness to Pay                                                          |

---

_End of Document_

**Next action:** Conduct 10 customer interviews using the companion Discussion Guide before committing to further engineering investment.
