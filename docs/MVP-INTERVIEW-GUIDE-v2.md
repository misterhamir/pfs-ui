# PebbleFlow IDP — Customer Interview Guide v2 (Final)

**Version:** 2.0
**Date:** March 23, 2026
**Purpose:** Validate 5 core hypotheses before committing engineering investment
**Target:** 10 interviews minimum (multifinance + asuransi Indonesia)
**Duration:** 45 minutes per interview
**Language:** Bahasa Indonesia (guide is bilingual for internal reference)

---

## Table of Contents

1. [Interview Logistics](#1-interview-logistics)
2. [Interview Script](#2-interview-script)
3. [Hypothesis Mapping](#3-hypothesis-mapping)
4. [Scoring Sheet](#4-scoring-sheet)
5. [Analysis Template](#5-analysis-template)
6. [Common Mistakes](#6-common-mistakes)
7. [Quick Reference Card](#7-quick-reference-card)

---

## 1. Interview Logistics

### Before the Interview

| Preparation            | Detail                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Research**           | OJK registry, annual report, LinkedIn team size. Know their products.                  |
| **Target interviewee** | Operations Manager or IT Manager. NOT: C-level (too high), Data Entry Staff (too low). |
| **Demo ready**         | Have extraction demo prepared. Do NOT lead with it — show only if asked.               |
| **Recording**          | Ask permission. If denied, take detailed notes.                                        |
| **Warm intro**         | LinkedIn, mutual contact, industry event. Cold outreach <5% response in Indonesia.     |

### Pre-Interview Readiness Checklist

Indonesian BFSI expects professionalism from the first touchpoint. These must be ready:

- [ ] NDA template (bilingual ID/EN)
- [ ] Company profile document (nama PT, founders, background)
- [ ] Data handling policy (1-2 pages: how sample documents are handled, retained, deleted)
- [ ] Professional email domain (@pebbleflow.id, NOT @gmail.com)
- [ ] Business card (physical preferred in Indonesian BFSI culture)
- [ ] Secure file sharing (corporate Google Workspace, NOT personal GDrive)
- [ ] USB drive / AirDrop ready for receiving sample documents
- [ ] Scoring sheet printed or open on laptop

### Who to Interview

| Priority  | Role                                    | Why                                                        |
| --------- | --------------------------------------- | ---------------------------------------------------------- |
| ✅ HIGH   | Operations Manager / Kepala Operasional | Owns the pain. Manages data entry team. Budget influencer. |
| ✅ HIGH   | IT Manager / Kepala IT                  | Technical evaluator. Decides integration feasibility.      |
| 🟡 MEDIUM | VP Operations / Direktur Operasi        | Budget owner. Interview AFTER Ops Manager validates pain.  |
| ❌ SKIP   | CEO                                     | Too high. Won't know operational details.                  |
| ❌ SKIP   | Compliance / Legal                      | Too early. Involve during contract stage.                  |

---

## 2. Interview Script

> **Golden rule:** Customer speaks 70% of the time. Ask, don't tell. Record verbatim quotes.

### Opening (3 min)

> "Terima kasih waktunya, Pak/Bu [Nama]. Saya [Nama] dari PebbleFlow. Kami sedang riset tentang bagaimana perusahaan BFSI memproses dokumen sehari-hari. Tujuannya bukan jualan — saya ingin memahami proses kerja dan tantangan tim operasional Bapak/Ibu."
>
> "Boleh saya rekam? Informasinya tidak akan dibagikan ke luar. Kira-kira 45 menit. Boleh kita mulai?"

---

### Section 1: Current State (10 min)

**Goal:** Understand their document processing world. Validate H1 (pain exists) and H2 (custom documents).

**Q1: Overview**

> "Bisa ceritakan, dokumen apa saja yang diproses tim operasional setiap hari?"

Probes:

- "Contoh 3-5 jenis dokumen yang paling sering?"
- "Datangnya dari mana? Email, scan, upload nasabah?"
- "Format apa? PDF, foto, kertas di-scan?"

Listen for: document types (standard vs custom), volume indicators, handwritten vs printed, language (ID/EN/mixed).

**Q2: Show Me Your Documents**

> "Boleh saya lihat contoh form atau template dokumennya? Blank form juga OK, tidak perlu yang ada data asli."

**This is the most important question.** One document tells you more in 10 seconds than 10 minutes of asking about it. You instantly see: layout complexity, field density, handwritten vs printed, scan quality, whether it's truly custom or a standard variant.

Probes:

- "Ini format dari kantor pusat, atau tiap cabang beda?"
- "Kalau ada versi scan, boleh lihat kualitasnya?"

Bring USB drive. If physical form, photograph with permission.

**Q3: Process Detail**

> "Step-by-step, dari dokumen masuk sampai datanya ada di sistem — prosesnya bagaimana?"

Probes:

- "Siapa yang input data? Berapa orang?"
- "Pakai software apa untuk input?"
- "Ada quality check setelah diinput?"
- "Rata-rata berapa lama per dokumen?"

**Q4: Volume**

> "Berapa dokumen diproses per hari? Dan dari jumlah itu, berapa yang benar-benar harus diinput datanya ke sistem?"

Probes:

- "Rata-rata atau ada peak time?"
- "Berapa halaman per dokumen?"
- "Volumenya naik tiap tahun?"

Record:

| Metric                                     | Answer |
| ------------------------------------------ | ------ |
| Documents per day                          |        |
| Pages per document                         |        |
| Documents needing data entry (addressable) |        |
| Peak vs average ratio                      |        |

**Q5: Current Tools**

> "Sudah pakai tool/software untuk bantu proses dokumen? OCR, scanning software?"

Probes:

- "Apa yang bagus dan kurang dari [tool]?"
- "Pernah evaluasi tool lain? Kenapa jadi/tidak jadi pakai?"

---

### Section 2: Pain & Alternatives (10 min)

**Goal:** Quantify pain and understand barriers. Validate H1 (pain is real and significant).

**Q6: Cost**

> "Berapa total biaya per bulan untuk tim data entry ini? Termasuk gaji, BPJS, THR, dan overhead."

Probes:

- "Ada biaya outsource? Vendor mana?"
- "Ada lembur saat peak?"

Note: Many will be reluctant to share exact numbers. Estimate from team size × Rp 7-10 juta/person (Jakarta, fully loaded).

**Q7: Errors**

> "Seberapa sering terjadi kesalahan data entry? Dan apa dampaknya?"

Probes:

- "Contoh spesifik error yang pernah terjadi?"
- "Berapa biaya per error? Rework, denda, complaint?"

**Q8: Alternatives**

> "Kalau masalah ini makin besar, apa rencana Bapak/Ibu? Tambah orang, cari software, atau cara lain?"

Probes:

- "Apa yang menahan dari menyelesaikan masalah ini sampai sekarang?"
- "Pernah coba solusi lain? Kenapa gagal?"

Listen for: default alternative (hire / buy / nothing), barriers to action, previous failed attempts.

**Q9: Biggest Frustration**

> "Kalau bisa hilangkan SATU masalah terbesar terkait pemrosesan dokumen, apa itu?"

Open-ended. Take verbatim notes. This often reveals the REAL pain that structured questions miss.

---

### Section 3: Solution Fit (10 min)

**Goal:** Test solution concept WITH limitations. Validate H2 (custom docs) and H3 (technical fit).

**Q10: Concept Test**

> "Bayangkan ada tool yang otomatis extract data dari dokumen. Tapi ada limitasi:"
>
> "1. Bapak/Ibu definisikan field apa yang mau diambil — nama nasabah, nomor KTP, jumlah pinjaman."
> "2. Kirim dokumen ke API atau upload di portal, sistem otomatis extract."
> "3. **Akurasinya 85-90%** — dari 10 field, mungkin 1-2 perlu dicek manual lewat dashboard web."
> "4. **Processing time 30-60 detik per halaman** — bukan realtime."
> "5. **Harganya Rp 300-700 per halaman.**"
>
> "Dengan kondisi seperti itu — ini sudah berguna, atau belum cukup?"

Probes:

- "Bagian mana yang menarik? Mana yang kurang?"
- "85% accuracy itu acceptable atau harus lebih tinggi?"
- "30-60 detik vs manual 2-3 menit, acceptable?"

Listen for: genuine interest (follows up with questions) vs polite agreement ("menarik" + silence). Reaction to accuracy limitation. Reaction to price. Spontaneous feature requests.

**Q11: Custom Documents**

> "Dari dokumen yang tadi disebutkan, mana yang formatnya custom/internal perusahaan — bukan standar nasional seperti KTP atau faktur pajak?"

Probes:

- "Berapa banyak variasi format?"
- "Formatnya sering berubah?"
- "Ada dokumen yang hanya ada di perusahaan Bapak/Ibu?"

Critical: If ALL documents are standard (KTP, invoice), they're better served by Google/Azure. Our value is custom documents.

**Q12: Infrastructure**

> "Dari sisi IT, server yang dipakai sekarang — on-prem atau cloud? Ada GPU server?"

Probes:

- "Pakai AWS, Azure, GCP, atau data center sendiri?"
- "Kalau tool AI baru butuh GPU ($10K+), procurement-nya mudah?"
- "Lebih prefer: cloud API, atau harus di server sendiri?"

**Q13: Integration**

> "Kalau ada tool extract data dari dokumen, hasilnya harus masuk ke core system apa? CONFINS? LOS? Sistem lain?"

Probes:

- "Core system-nya punya API untuk import data dari luar?"
- "Atau semua input manual lewat UI?"
- "Pernah ada vendor lain yang integrasi lewat API ke core system ini?"

---

### Section 4: Willingness to Pay (10 min)

**Goal:** Validate unit economics. Validate H4 (WTP Rp 300-700/page).

**Q14: Current Cost Anchor**

> "Dari info tadi — [X] dokumen/bulan, tim [Y] orang — menurut Bapak/Ibu, berapa biaya per dokumen untuk proses manual saat ini?"

Let THEM calculate. Their number = psychological anchor they can't argue with. Only help with math if they genuinely can't estimate.

**Q15: Van Westendorp (4 sub-questions)**

> "Saya tanya 4 pertanyaan tentang harga. Bayangkan tool extract data otomatis, per halaman:"

> **Q15a (Too Cheap):** "Berapa harga per halaman yang TERLALU MURAH — meragukan kualitasnya?"

> **Q15b (Good Value):** "Berapa yang MURAH — berkualitas, deal yang bagus?"

> **Q15c (Getting Expensive):** "Berapa yang mulai MAHAL — masih mau bayar tapi harus dipikir?"

> **Q15d (Too Expensive):** "Berapa yang TERLALU MAHAL — tidak dipertimbangkan?"

| Question          | Answer (Rp/page) |
| ----------------- | ---------------- |
| Too cheap         | Rp               |
| Good value        | Rp               |
| Getting expensive | Rp               |
| Too expensive     | Rp               |

**Q16: Pricing Model**

> "Lebih prefer:"
> "A. Bayar per halaman (seperti listrik — pakai banyak bayar banyak)"
> "B. Langganan bulanan dengan kuota (seperti internet — paket bulanan)"
> "C. Kontrak tahunan dengan diskon"

Probes: "Kenapa prefer model [X]?" "Procurement bisa langsung beli atau harus tender?"

**Q17: ROI Expectation**

> "Kalau invest di solusi ini, berapa lama expect untuk balik modal?"

Options: 1-3 bulan / 3-6 bulan / 6-12 bulan / >12 bulan / "Tidak hitung ROI"

---

### Section 5: Can They Buy? (5 min)

**Goal:** Validate they can make a purchase decision. Validate H5 (can buy without HQ).

**Q18: Decision Process**

> "Kalau ada tool baru untuk tim operasional, siapa saja yang terlibat dalam keputusan? Bisa diputuskan di level lokal, atau harus ke kantor pusat?"

Probes:

- "Siapa yang initiate? Approve budget? Bisa veto?"
- "Berapa threshold budget tanpa approval atasan?"
- "IT harus technical sign-off?"

| Aspect                      | Answer   |
| --------------------------- | -------- |
| Local decision authority?   | YES / NO |
| HQ approval required?       | YES / NO |
| Budget threshold autonomous | Rp       |
| Final approver (role)       |          |

**Q19: Budget**

> "Budget IT untuk 2026 sudah terkunci? Kalau ada kebutuhan baru, ada mekanisme di luar budget tahunan?"

Probes:

- "Operational budget atau petty cash untuk langganan bulanan?"
- "Berapa threshold yang tidak butuh budget planning tahunan?"
- "Budget planning 2027 mulai kapan?"

**Q20: Vendor Requirements**

> "Untuk vendor software baru, dokumen apa yang dibutuhkan? NPWP, akta PT, faktur pajak, SOC 2?"

Probes:

- "Harus PT? Atau CV/perorangan bisa?"
- "Berapa lama proses registrasi vendor baru?"
- "Ada requirement sertifikasi? SOC 2, ISO 27001?"

---

### Closing (2 min)

> "Terima kasih banyak, Pak/Bu [Nama]."
>
> "Kami tawarkan free pilot — kami proses contoh dokumen Bapak/Ibu dan kirimkan hasilnya. Gratis 5,000 halaman selama 4-8 minggu, tanpa commitment."
>
> "Boleh minta 10-20 contoh dokumen scan/PDF? Kalau ada versi blank form, itu juga OK. Dan kalau ada yang tulisan tangan, tolong sertakan."
>
> "Satu lagi — ada kolega atau teman di perusahaan lain yang mungkin punya masalah serupa?"

Leave behind:

- [ ] Contact card / WhatsApp number
- [ ] Promise to follow up with extraction results
- [ ] Request for sample documents
- [ ] Request for peer referral

Within 24 hours:

- [ ] Send thank you (WhatsApp preferred in Indonesia)
- [ ] Complete scoring sheet
- [ ] If sample docs received: run extraction, score accuracy
- [ ] Update interview tracker

---

## 3. Hypothesis Mapping

| Hypothesis                                      | Questions         | Confirmed Signal                                                                     | Rejected Signal                                     |
| ----------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| **H1:** >4 hours/day on manual processing       | Q1, Q3, Q4, Q6-Q9 | FTE dedicated to data entry, frustration evident, cost >Rp 35 juta/month             | <1 hour/day, "bukan masalah besar"                  |
| **H2:** Process custom/proprietary documents    | Q1, Q2, Q11       | Proprietary forms shown, format varies by company                                    | Only standard docs (KTP, invoice, faktur pajak)     |
| **H3:** No GPU, would use cloud API             | Q12               | No GPU, "procurement GPU susah," cloud acceptable                                    | Already have GPU server                             |
| **H4:** WTP Rp 300-700/page                     | Q14, Q15a-d       | "Good value" includes Rp 300-700 range                                               | "Too expensive" at Rp 300                           |
| **H5:** Can decide without HQ, budget available | Q18, Q19, Q20     | Local decision authority, operational budget available, vendor registration feasible | Requires HQ approval, budget locked, missing PT/PKP |

---

## 4. Scoring Sheet

Complete IMMEDIATELY after each interview (within 1 hour).

### Metadata

| Field                          | Value |
| ------------------------------ | ----- |
| Company                        |       |
| Interviewee (name + title)     |       |
| Date                           |       |
| Duration                       |       |
| Format (in-person/video/phone) |       |
| Recording? (Y/N)               |       |

### Hypothesis Scores

Rate each 1-5:

| Score | Meaning                                  |
| ----- | ---------------------------------------- |
| 5     | Strongly confirmed with evidence/numbers |
| 4     | Confirmed, some evidence                 |
| 3     | Neutral or mixed signals                 |
| 2     | Weak, low enthusiasm                     |
| 1     | Explicitly contradicted                  |

| Hypothesis                         | Score (1-5) | Key Evidence / Quote |
| ---------------------------------- | ----------- | -------------------- |
| H1: Manual processing pain is real |             |                      |
| H2: Custom/proprietary documents   |             |                      |
| H3: No GPU, would use cloud API    |             |                      |
| H4: WTP Rp 300-700/page            |             |                      |
| H5: Can buy (authority + budget)   |             |                      |

### Opportunity Score

| Criteria            | Score (1-5) | Notes |
| ------------------- | ----------- | ----- |
| Pain severity       |             |       |
| Budget availability |             |       |
| Decision speed      |             |       |
| Technical fit       |             |       |
| Champion identified |             |       |
| **TOTAL**           | /25         |       |

| Total | Classification | Action                                       |
| ----- | -------------- | -------------------------------------------- |
| 20-25 | 🔥 HOT         | Offer pilot immediately                      |
| 15-19 | 🟡 WARM        | Follow up in 2 weeks with demo on their docs |
| 10-14 | 🔵 COOL        | Add to list. Re-engage in 3-6 months.        |
| <10   | ❌ NOT FIT     | Thank and move on.                           |

### Key Quotes (Verbatim — Top 3)

| #   | Quote (exact words) | Context | Usable in marketing? |
| --- | ------------------- | ------- | -------------------- |
| 1   |                     |         | Y/N                  |
| 2   |                     |         | Y/N                  |
| 3   |                     |         | Y/N                  |

### Documents Collected

| Document Type | Format | Handwritten? | Custom? |
| ------------- | ------ | ------------ | ------- |
|               |        | Y/N          | Y/N     |
|               |        | Y/N          | Y/N     |
|               |        | Y/N          | Y/N     |

### Referral Given?

- [ ] YES — Name:**_ Company:_** Contact:\_\_\_
- [ ] NO

---

## 5. Analysis Template

After 10 interviews, aggregate results.

### Hypothesis Validation Summary

| Hypothesis      | Avg Score | Verdict | Key Evidence |
| --------------- | --------- | ------- | ------------ |
| H1: Manual pain | /5        | ✅/❌   |              |
| H2: Custom docs | /5        | ✅/❌   |              |
| H3: No GPU      | /5        | ✅/❌   |              |
| H4: WTP         | /5        | ✅/❌   |              |
| H5: Can buy     | /5        | ✅/❌   |              |

**Decision criteria:** Average ≥4.0 = CONFIRMED. Average 3.0-3.9 = INCONCLUSIVE (more interviews). Average <3.0 = REJECTED.

### Van Westendorp Pricing

| #          | Too Cheap | Good Value | Expensive | Too Expensive |
| ---------- | --------- | ---------- | --------- | ------------- |
| 1          | Rp        | Rp         | Rp        | Rp            |
| 2          | Rp        | Rp         | Rp        | Rp            |
| ...        |           |            |           |               |
| 10         | Rp        | Rp         | Rp        | Rp            |
| **Median** | **Rp**    | **Rp**     | **Rp**    | **Rp**        |

**Optimal price:** Intersection of "Too Cheap" + "Getting Expensive" medians.
**Ceiling:** "Too Expensive" median.

### Pipeline Summary

| Company | Segment | Score (/25) | Status      | Next Step |
| ------- | ------- | ----------- | ----------- | --------- |
|         |         |             | 🔥/🟡/🔵/❌ |           |

### Discovery Insights

> What did you learn that you did NOT expect?

1. ...
2. ...
3. ...

### PRD Impact

> What needs to change in the PRD based on findings?

| Change Needed | Why | Impact |
| ------------- | --- | ------ |
|               |     |        |

### Go/No-Go Recommendation

Based on 10 interviews:

- [ ] **GO** — ≥5 interviews confirm H1-H5. Proceed to Phase 2 (pilot).
- [ ] **PIVOT** — Problem confirmed but different segment/positioning needed.
- [ ] **KILL** — <3 confirm problem. Stop engineering investment.

Recommendation: \_\_\_

---

## 6. Common Mistakes

### 1. Leading the Witness

❌ "Pasti repot ya proses dokumen manual?"
✅ "Bisa ceritakan proses dokumen sehari-hari?"

The first has only one "right" answer. The second reveals real sentiment.

### 2. Selling Instead of Listening

❌ "Produk kami pakai AI dengan akurasi 95% dan jalan di CPU dan ada HITL..."
✅ "Seperti apa solusi ideal menurut Bapak/Ibu?"

Hold features until Section 3. Before that, listen.

### 3. Confirming Your Own Bias

❌ Recording "customer confirmed pain" when they said "ya, lumayan sih kadang-kadang."
✅ Recording exact quote: "ya, lumayan sih kadang-kadang" — this is lukewarm, not confirmation.

"Menarik" with follow-up questions = real interest. "Menarik" + silence = polite rejection.

### 4. Skipping Money Questions

Van Westendorp feels awkward. Do it anyway. If you don't know their WTP, you can't build a business.

### 5. Not Asking to SEE Documents

Asking ABOUT documents ≠ SEEING them. One form in your hands tells you: layout complexity, handwriting, scan quality, field density, custom vs standard. Always ask Q2.

### 6. Not Checking Budget Calendar

Budget is set in Oct-Nov for next year. If you're pitching in March 2026 and the deal needs director approval (>Rp 50 juta), it's a 2027 budget deal. One question (Q19) saves you 3-4 months chasing a structurally impossible deal.

---

## 7. Quick Reference Card

**Print this. Bring to every interview.**

### Before Interview

- [ ] Company researched
- [ ] Pre-interview checklist complete (NDA, profile, data policy, professional email)
- [ ] Scoring sheet ready
- [ ] USB drive / AirDrop ready
- [ ] Demo ready (don't show unless asked)

### During Interview (45 min)

**Section 1 — Current State (10 min)**

- Q1: What documents? How many? From where?
- Q2: **SHOW ME** a sample document
- Q3: Step-by-step process
- Q4: Volume (docs/day, pages/doc, addressable %)
- Q5: Current tools

**Section 2 — Pain & Alternatives (10 min)**

- Q6: Monthly cost of data entry team
- Q7: Error rate and impact (examples!)
- Q8: Default alternative: hire staff or buy software?
- Q9: ONE biggest frustration (verbatim quote)

**Section 3 — Solution Fit (10 min)**

- Q10: Concept test WITH limitations (85%, 30-60s, Rp 300-700)
- Q11: Which docs are custom/proprietary?
- Q12: GPU? Cloud or on-prem?
- Q13: Core system API available?

**Section 4 — Willingness to Pay (10 min)**

- Q14: Let THEM calculate cost/doc
- Q15a-d: Van Westendorp (4 price questions)
- Q16: Per-page vs monthly vs annual
- Q17: ROI expectation

**Section 5 — Can They Buy? (5 min)**

- Q18: Decision process, local vs HQ
- Q19: Budget locked? Operational budget threshold?
- Q20: Vendor requirements (PT, NPWP, SOC 2)

**Closing (2 min)**

- Offer 5,000-page free pilot
- Request sample documents (10-20 docs, include handwritten)
- Request peer referral

### After Interview (within 24 hours)

- [ ] Score H1-H5 (1-5 each)
- [ ] Score opportunity (/25)
- [ ] Thank you WhatsApp
- [ ] Pipeline tracker updated
- [ ] Sample docs requested if not received

### After 10 Interviews

- [ ] Hypothesis validation summary (H1-H5 avg scores)
- [ ] Van Westendorp pricing chart
- [ ] Pipeline scored and prioritized
- [ ] Go/No-Go recommendation
- [ ] PRD updated based on findings

---

_End of Interview Guide v2_
