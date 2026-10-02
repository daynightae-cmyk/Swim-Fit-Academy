<div align="center">

# 🏊‍♂️ SWIM FIT ACADEMY

### Abu Dhabi · Premium Swimming Experience Platform

**نتعلّم · نتطوّر · نتألّق**

A conversion-first, bilingual digital home for **Swim Fit Academy — Abu Dhabi**.

[![Status](https://img.shields.io/badge/STATUS-FOUNDATION-0f766e?style=for-the-badge)](#project-status)
[![Web](https://img.shields.io/badge/WEB-NEXT.JS-111827?style=for-the-badge&logo=nextdotjs)](#recommended-stack)
[![Language](https://img.shields.io/badge/AR%20%7C%20EN-BILINGUAL-0ea5e9?style=for-the-badge)](#experience-principles)
[![Quality](https://img.shields.io/badge/QUALITY-PERFORMANCE%20FIRST-1d4ed8?style=for-the-badge)](#quality-gates)

**Built as a real product — not a brochure page.**

</div>

---

## 🌊 Product Vision

Swim Fit Academy needs more than a pretty landing page.
This repository is the foundation for a **fast, premium, trustworthy, measurable customer journey** from local discovery to WhatsApp inquiry and booking.

The website will make the academy easy to **find, understand, trust, contact, and remember**.
## 🎯 What This Project Must Achieve

| Goal | Product outcome |
|---|---|
| **Discoverability** | Strong Google / local SEO foundation with correct NAP and structured data |
| **Trust** | Coach credentials, real training methodology, locations, schedule, reviews and proof |
| **Conversion** | One-tap WhatsApp, clear programs, pricing, trial / booking path |
| **Brand** | One visual language across Arabic and English |
| **Performance** | Mobile-first UX, excellent Core Web Vitals, no decorative bloat |
| **Measurement** | Analytics, UTM discipline and explicit conversion events |

> **Design rule:** cinematic where it helps emotion; brutally simple where the parent needs to decide.

---

## 🔎 Intelligence Baseline — 02 Oct 2026

The pre-build digital audit established a deliberately conservative baseline:

- A verified Facebook footprint exists, with three captured August 2026 posts.
- The public phone observed in the source material is **056 969 8628**.
- A Google Business / Maps presence was **not verified** through the audit's available evidence.
- No official website was verified.
- No public customer-review corpus was available for reliable reputation scoring.
- Instagram ownership / identity remained unverified from independent public evidence.
- Search identity is vulnerable to similarly named swimming businesses in other countries.

**Important:** “not verified” is not the same as “does not exist.”  
Owner-side access wins over public crawling whenever the two disagree.
## 🧭 Experience Architecture

~~~mermaid
flowchart LR
    A[Google / Maps / Social] --> B[Premium Home]
    B --> C[Programs]
    B --> D[Coach & Method]
    B --> E[Locations & Schedule]
    B --> F[Results & Reviews]
    C --> G[WhatsApp / Trial Request]
    D --> G
    E --> G
    F --> G
    G --> H[Qualified Lead]
~~~

### Core pages

- **Home** — cinematic academy story + immediate CTA
- **Programs** — children, adults, beginner to advanced
- **Coach / Method** — credentials, teaching system, safety philosophy
- **Locations** — verified pools only; maps and operating schedule
- **Results** — progress stories, parent testimonials, review proof
- **Pricing** — transparent packages once owner-approved
- **FAQ** — what to bring, ages, make-up policy, trial class, ladies sessions
- **Contact / Book** — WhatsApp-first conversion surface
- **Arabic / English** — equal product quality, not a translated afterthought

---

## 🎨 Visual Direction

The target is **premium aquatic performance**, not generic “kids swimming school” design.

**Visual language:** deep navy · pool cyan · clean white · restrained glass · underwater light rays · fluid motion · crisp typography.

**Avoid:** loud neon, cartoon overload, stock-photo grids, giant gradients, autoplay-heavy video, fake testimonials, fake review counters, fake awards.
## 🧠 Design System Principles

1. **Water is the motion system** — flow, refraction, reveal, depth.
2. **Trust beats decoration** — real coach, real pool, real schedule, real proof.
3. **One primary CTA** — WhatsApp / Book Trial.
4. **Arabic typography is first-class** — spacing and hierarchy are designed, not patched.
5. **Motion has an exit strategy** — reduced-motion support and mobile fallbacks.
6. **Every heavy visual is lazy-loaded** and must justify its performance cost.
7. **No invented business data** enters production.

---

## ⚙️ Recommended Stack

~~~txt
Next.js (App Router)
React + TypeScript strict
Tailwind CSS
Motion for React
next-intl
Zod
React Hook Form
Vercel
Vercel Analytics / Speed Insights
Schema.org JSON-LD
Playwright + Vitest
ESLint + Prettier
~~~

### Architecture rule

Do **not** introduce a database, CMS, Supabase, Three.js, or an admin panel until a real product requirement needs it.
The first production release should stay intentionally lean.
## 📁 Repository Shape

~~~text
Swim-Fit-Academy/
├─ README.md
├─ docs/
│  ├─ PRODUCT-FOUNDATION.md
│  ├─ DIGITAL-INTELLIGENCE-BASELINE.md
│  ├─ BRAND-DIRECTION.md
│  └─ ROADMAP.md
├─ public/
│  └─ brand/
├─ .github/
│  └─ PULL_REQUEST_TEMPLATE.md
├─ .editorconfig
└─ .gitignore
~~~

When implementation starts, the application will be added without replacing these product decisions.

---

## ✅ Quality Gates

A release is **not PASS** because it “looks good.”

| Gate | Acceptance |
|---|---|
| Build | Production build succeeds |
| Type safety | Zero TypeScript errors |
| Tests | Unit + critical browser flows pass |
| Mobile | 360px+ usable with no horizontal overflow |
| Accessibility | Keyboard paths + semantic headings + contrast |
| SEO | Metadata, canonical, sitemap, robots, LocalBusiness schema |
| Performance | LCP / CLS / INP checked on real production build |
| Conversion | WhatsApp and booking events verified |
| Content truth | Locations, pricing, credentials and reviews owner-approved |
| Visual QA | Screenshots reviewed at desktop + mobile widths |
## 🚦 Project Status

**Current phase:** FOUNDATION

Already established:

- Digital intelligence baseline
- Product positioning
- Conversion architecture
- Technical direction
- Visual guardrails
- Quality gates
- Documentation structure

Not yet claimed:

- Website implementation
- Production deployment
- Google Business ownership
- Verified Instagram ownership
- Final pool locations / schedule / prices
- Final logo / brand asset pack

Those stay **UNVERIFIED / PENDING OWNER INPUT** until evidence exists.

---

## 🗺️ Build Sequence

~~~mermaid
flowchart TD
    A[Lock business facts] --> B[Lock brand assets]
    B --> C[UX + visual prototype]
    C --> D[Next.js implementation]
    D --> E[Content + Local SEO]
    E --> F[Analytics + conversion events]
    F --> G[Cross-device QA]
    G --> H[Production deployment]
    H --> I[Reviews + iteration]
~~~
## 🛡️ Product Rules

- Never publish a child’s identifiable story without documented guardian approval.
- Never invent ratings, student counts, certifications, awards or locations.
- Never call a social profile “official” until ownership is verified.
- Never ship an advertising campaign before the destination and conversion tracking work.
- Never let animation block content, CTA, accessibility or speed.
- Never overwrite an approved visual baseline without comparison screenshots.

---

## 📌 Owner Inputs Required Before Production Content Lock

- Official Arabic and English business name
- Final logo files: SVG / PNG
- Coach full legal / public name
- Credential wording and issuing institution
- Pool locations and map pins
- Operating days and times
- Programs / age bands / levels
- Pricing and trial-class policy
- WhatsApp Business number confirmation
- Cancellation / reschedule policy
- Permission for student photos / names / progress stories

---

<div align="center">

### SWIM FIT ACADEMY

**Built to turn discovery into trust — and trust into action.**

Abu Dhabi, UAE

</div>
