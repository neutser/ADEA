# Platform Spec — Gap Analysis

**Reference:** World-class AI-first custom manufacturing platform spec  
**Current:** Adea Crafts — React + Vite + Express + SQLite

---

## Executive Summary

| Spec Dimension | Current State | Gap Level |
|----------------|---------------|-----------|
| **Frontend** | React 19, Vite, Framer Motion | ⚠️ No Next.js (Vite); no Tailwind (custom CSS) |
| **3D/Preview** | ThreeDProductPreview exists, R3F installed | 🔴 Not used in configurator; 2D preview only |
| **Product Schema** | JSON schema per product in DB | ✅ Strong — surfaces, fields, zones, pricing rules |
| **AI Services** | OpenAI/Gemini scene analysis backend | ⚠️ Partial — mock fallback; no generative design |
| **Pricing Engine** | Backend `POST /api/pricing/calculate` | ✅ Done — schema-driven, area, tiers |
| **Production Files** | SVG generation | ⚠️ Generic SVG only; no DXF, DST, product-specific |
| **Bulk/CSV** | BulkPersonalization component | ⚠️ Partial — CSV upload, bulk jobs table |
| **Templates** | templates table, storefronts | ✅ Partial — templates exist; creator stores |
| **Admin** | Admin dashboard, pipeline, inventory | ✅ Partial — CRUD, no full ops dashboard |

---

## 1. Architecture Overview — Spec vs Current

### 1.1 Frontend Layer

| Spec | Current | Gap |
|------|---------|-----|
| Next.js (SSR/CSR) | Vite + React SPA | Use Vite; no SSR. Migrate to Next.js only if needed |
| Tailwind CSS | Custom CSS variables, glass-panel | Consider Tailwind for design system |
| React Three Fiber | Installed, `ThreeDProductPreview.tsx` | **Not used** in DynamicConfigurator; PreviewRegistry uses it for sign type but configurator uses 2D |
| Redux Toolkit / Zustand | React state, CartContext | No global configurator state; add Zustand for undo/redo |

### 1.2 Application/API Layer

| Spec | Current | Gap |
|------|---------|-----|
| REST/GraphQL endpoints | REST ✅ | Done |
| Auth + roles (customer, admin, designer, maker) | JWT, admin, customer | No designer/maker roles |
| AI orchestration | `server/ai/sceneAnalysis.js`, `POST /api/ai/analyze-scene` | Done for scene; no generative design API |
| Pricing engine | `POST /api/pricing/calculate` | ✅ Done |
| Quote from design | Quote page accepts design context | ✅ Done |

### 1.3 AI Services Layer

| Spec | Current | Gap |
|------|---------|-----|
| AI Studio (design prompts, generative) | DesignWizard (rule-based) | ❌ No LLM for generative design |
| Scene Analysis | AI vision (OpenAI/Gemini) | ✅ Backend; mock fallback |
| Recommendation Engine | designWizard + aiScene | ⚠️ Rule-based; no ML-based trending |
| Predictive Analytics | — | ❌ Not implemented |

### 1.4 Rendering Layer

| Spec | Current | Gap |
|------|---------|-----|
| 2D/3D previews (Three.js) | ThreeDProductPreview exists | ❌ Not wired into configurator; uses 2D overlay |
| Server-side high-quality renders | — | ❌ Not implemented |
| WebXR / AR | — | ❌ Not implemented |

### 1.5 Commerce & Business Logic

| Spec | Current | Gap |
|------|---------|-----|
| Product Schema Service | `customization_schema_json` in DB | ✅ Done |
| Pricing Engine | `pricingService.js`, schema-driven | ✅ Done |
| Order & Quote System | Orders, quotes tables | ✅ Done |

### 1.6 Production & Manufacturing

| Spec | Current | Gap |
|------|---------|-----|
| Production File Generator | `fileGeneration.js` — SVG | ⚠️ Generic; no DXF, DST, product-specific |
| Manufacturing Validation | minTextMM, minLineMM in schema | ⚠️ Partial; no bed size, panel split |
| Batch Personalisation | BulkPersonalization, bulk_jobs | ⚠️ Partial — CSV upload, preview |

### 1.7 Data & Storage

| Spec | Current | Gap |
|------|---------|-----|
| PostgreSQL | SQLite | Consider migration for scale |
| S3 / object storage | Local files | — |

### 1.8 Admin & Operations

| Spec | Current | Gap |
|------|---------|-----|
| Admin Dashboard | Products, orders, pipeline, inventory | ✅ Partial |
| Operations Dashboard | — | ❌ No dedicated QC, production staff UI |

### 1.9 Audit & Analytics

| Spec | Current | Gap |
|------|---------|-----|
| Session tracking, AI usage | analytics_events table | ✅ Partial |
| Flow consistency tests | — | ❌ No automated flow tests |

---

## 2. AI Studio Implementation — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| Multi-step wizard (goal, logo, photo, style) | DesignWizard | ✅ Done |
| AI Recommendation Engine | Rule-based | ⚠️ No LLM; add for richer suggestions |
| Generative Design (text prompts → images) | — | ❌ Not implemented |
| Interactive AI chat panel | — | ❌ Not implemented |
| Designer notes / explanations | — | ❌ Not implemented |

---

## 3. Configurator & Product Logic — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| JSON schema (editableZones, materials, dimensions, features, pricingRules, validations) | `customization_schema_json` | ✅ Strong — surfaces, zones, fields, preview config |
| Attribute-aware UI | FieldRenderer, schema-driven | ✅ Done |
| Real-time pricing | `POST /api/pricing/calculate`, debounced | ✅ Done |
| 3D model mapping | — | ❌ Configurator uses 2D; ThreeDProductPreview unused |
| Bulk personalisation (CSV) | BulkPersonalization | ⚠️ Partial |

---

## 4. Scene Upload & Virtual Installation — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| Scene analysis (surfaces, perspective) | AI vision backend | ✅ Done; mock fallback |
| Placement assistant (drag, scale, rotate) | AIBuilder | ✅ Done |
| Lighting & realism (Day/Night) | DynamicConfigurator day/night toggle | ✅ Done |
| Mode switching (scene vs 3D garment) | PreviewRegistry | ✅ Done — scene for signs, overlay for others |

---

## 5. Marketplace & Template System — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| Template library | templates table | ✅ Done |
| Creator stores | storefronts, CreatorStorefronts | ✅ Done |
| Collections/Suites | product_suites | ✅ Done |
| Public & private sharing | share_token | ✅ Done |

---

## 6. Bulk Personalisation — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| CSV upload API | bulk_jobs | ⚠️ Partial |
| Preview & per-row adjustment | BulkPersonalization | ⚠️ Partial |
| Price scaling | quantity tiers | ✅ Done |

---

## 7. Production & Manufacturing — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| SVG/DXF/embroidery file generation | SVG only | ❌ DXF, DST not implemented |
| Manufacturing validation | Schema minTextMM | ⚠️ No bed size, panel split |
| Production queue | Pipeline, MachineQueue | ✅ Done |
| Inventory | inventory table | ✅ Done |

---

## 8. UX Modernisation — Spec vs Current

| Spec | Current | Gap |
|------|---------|-----|
| Global design system | CSS variables | ⚠️ Consider Tailwind / shadcn |
| Configurator layout (left options, center canvas, right AI) | DynamicConfigurator | ⚠️ Partial — no AI panel |
| AI Studio full-page | Dedicated page | ✅ Done |
| Code-splitting, lazy load | Vite | ✅ Partial — lazy admin routes |

---

## 9. Priority Roadmap

### P0 — Critical (Foundation)

1. **Wire ThreeDProductPreview into configurator** — Use for signs, plaques, keychains where schema allows.
2. **Product-specific file generation** — DXF for laser, DST for embroidery, per product type.
3. **Manufacturing validation** — Bed size, panel split, minimum stroke.

### P1 — High (AI & UX)

1. **Generative design engine** — LLM for text-to-design concepts.
2. **AI chat panel** — In-configurator assistant.
3. **Design system** — Tailwind or shadcn for consistency.

### P2 — Medium (Scale & Ops)

1. **Operations dashboard** — QC, production staff UI.
2. **Flow consistency tests** — Automated E2E for design → save → production.
3. **PostgreSQL migration** — If scaling.

### P3 — Lower (Premium)

1. **WebXR / AR preview** — In-browser AR.
2. **Predictive analytics** — Design viability scoring.
3. **Server-side high-quality renders** — GPU render farm.

---

## 10. Files to Modify (Next Steps)

| File | Action |
|------|--------|
| `src/pages/DynamicConfigurator.tsx` | Use PreviewRegistry for 3D when schema has `preview.type: 'scene'` or `product-3d-mockup` |
| `src/components/PreviewRegistry.tsx` | Ensure ThreeDProductPreview receives config for texture mapping |
| `server/fileGeneration.js` | Add product-type branching: DXF for signs, DST for embroidery |
| `server/db.js` | Add `production_profile_json` per product (outputFormats, bedSizeMM) |
| `src/contexts/ConfiguratorState.ts` | New Zustand store for undo/redo, config state |
| `src/components/AIChatPanel.tsx` | New — AI assistant in configurator |

---

## Conclusion

Adea Crafts has a **strong foundation**: schema-driven configurator, backend pricing, scene analysis, templates, storefronts, bulk jobs, and production pipeline. The main gaps are:

- **3D preview** not wired into the configurator
- **Product-specific production files** (DXF, DST)
- **Generative AI** and **AI chat** for design assistance
- **Manufacturing validation** (bed size, panel split)

Implementing the P0 items will bring the platform closer to the spec’s vision of a world-class AI-first custom manufacturing platform.
