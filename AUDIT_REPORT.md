# Adea Crafts — Complete Codebase Audit Report

**Date:** March 15, 2026  
**Scope:** Full repository analysis across 13 phases  
**Version:** 0.0.0

---

## PHASE 1 — REPOSITORY STRUCTURE ANALYSIS

### Architecture Type

**Monolith** — Single deployable unit:
- **Frontend:** React 19 SPA (Vite 8)
- **Backend:** Express.js API + Socket.io
- **Database:** SQLite (node:sqlite sync API)
- **Build:** TypeScript + Vite, bundled for production

### Entry Points

| Layer | Entry | Purpose |
|-------|-------|---------|
| Frontend | `index.html` → `src/main.tsx` | React bootstrap |
| App | `src/App.tsx` | Routing, providers, layout |
| Server | `server/index.js` | Express app, HTTP + Socket.io |
| Build | `vite.config.ts` | Vite config, proxy `/api` and `/socket.io` to port 3001 |

### Main Modules & Responsibilities

| Module | Path | Responsibility |
|--------|------|----------------|
| **CustomizationEngine** | `src/services/CustomizationEngine.ts` | Product schema validation, pricing, defaults, zone parsing |
| **PreviewRegistry** | `src/components/PreviewRegistry.tsx` | Maps product types → 3D/2D preview components |
| **ThreeDProductPreview** | `src/components/ThreeDProductPreview.tsx` | 3D sign/plaque/keychain/garment rendering |
| **DynamicConfigurator** | `src/pages/DynamicConfigurator.tsx` | Unified product configurator (AI, history, export) |
| **StudioCanvas** | `src/components/studio/StudioCanvas.tsx` | 2D/3D/AR canvas orchestration |
| **AuthContext** | `src/contexts/AuthContext.tsx` | Auth state, login/register |
| **CartContext** | `src/contexts/CartContext.tsx` | Cart state |
| **studioStore** | `src/stores/studioStore.ts` | Zustand store for layers, tools, undo/redo |
| **db** | `server/db.js` | SQLite schema, queries, product seeding |
| **fileGeneration** | `server/fileGeneration.js` | SVG/DXF export, logo embedding |
| **AI modules** | `server/ai/*.js` | designAssistant, generativeDesign, sceneAnalysis, machineAssistant |

### Dependency Graph (Simplified)

```
main.tsx
  └── App.tsx
        ├── AuthProvider, CartProvider, PageMeta, Navbar, Footer
        ├── Routes → Home, Shop, ProductDetail, DynamicConfigurator, Admin, etc.
        └── ErrorBoundary

DynamicConfigurator
  ├── CustomizationEngine (validate, price, defaults)
  ├── PreviewRegistry (product → preview component)
  ├── StudioCanvas (2D/3D/AR)
  ├── AIChatSidebar, GenerativeDesignModal
  └── API_BASE (fetch products, designs, export)

Server
  ├── db.js (SQLite)
  ├── fileGeneration.js, manufacturingValidation.js
  ├── ai/*.js (OpenAI)
  └── machineExport/*.js (Curio, XTool)
```

### Third-Party Libraries

| Category | Libraries |
|----------|------------|
| **UI** | React 19, react-router-dom 7, framer-motion 12, lucide-react |
| **3D** | three, @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| **AR** | @ar-js-org/ar.js |
| **State** | zustand |
| **Backend** | express, cors, bcryptjs, jsonwebtoken, stripe, archiver, socket.io |
| **Build** | vite 8, typescript 5.9, tailwindcss 4 |

### Environment Configuration

| Variable | Purpose | Exposed to Client |
|----------|---------|-------------------|
| `VITE_API_URL` | API base URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe checkout | No |
| `FRONTEND_URL` | Stripe redirect URLs | No |
| `JWT_SECRET` | JWT signing | No |
| `OPENAI_API_KEY` / `VITE_OPENAI_API_KEY` | AI endpoints | VITE_* is exposed |
| `PORT` | Server port | No |

**Note:** `.env.example` is minimal; `JWT_SECRET` and `OPENAI_API_KEY` are not documented.

---

## PHASE 2 — ARCHITECTURE AUDIT

### Strengths

- **Unified configurator:** `/marketplace/configure` centralizes product customization with context-preserving redirects from `/ai-builder`, `/configure`, `/studio`, `/crafts/configurator`, `/apparel/configurator`.
- **Schema-driven engine:** `CustomizationEngine` provides `validateConfig`, `calculatePrice`, `buildDefaults`, `parseZoneBounds` — product-agnostic.
- **Preview abstraction:** `PreviewRegistry` maps product IDs to preview components, enabling new products without routing changes.

### Weaknesses

| Issue | Severity | Description |
|-------|----------|-------------|
| **Tight coupling** | Medium | `DynamicConfigurator` mixes product fetch, AI, history, export, and UI in one large component (~800 lines). |
| **Dual state** | Medium | Config state lives in `DynamicConfigurator` (useState) while `studioStore` holds layers/tools — no single source of truth for design. |
| **No API abstraction** | Low | Direct `fetch(API_BASE + ...)` calls scattered; no centralized API client or error handling. |
| **Monolith scaling** | Medium | Single process; no horizontal scaling, no caching layer. |

### Anti-Patterns

- **God component:** `DynamicConfigurator` handles too many concerns.
- **Implicit product routing:** Product selection via URL param `?product=...`; no typed route params.
- **Mixed concerns:** AI chat, generative design, and configurator share the same page without clear boundaries.

### Recommendations

1. Extract configurator logic into a `useConfigurator` hook and a `ConfiguratorPanel` component.
2. Introduce a unified design store (Zustand or Context) that merges config + layers.
3. Add an API service layer (`src/services/api.ts` exists but is underused).

---

## PHASE 3 — FRONTEND AUDIT

### UI Architecture

- **Layout:** Navbar + main + Footer; `CRMLayout` for admin with sidebar.
- **Routing:** React Router 7; admin routes lazy-loaded via `Suspense`.
- **Styling:** Tailwind CSS 4, CSS variables for theming.

### Component Reuse

- **PreviewRegistry:** Good abstraction for product-specific previews.
- **PageMeta:** Centralized meta tags.
- **AnalyticsTracker:** Event tracking wrapper.
- **Limited shared form components:** Many forms are inline; no shared `FormField`, `Select`, etc.

### State Management

- **Zustand:** `studioStore` for layers, tools, undo/redo.
- **Context:** Auth, Cart.
- **Local state:** Config, history, UI toggles in `DynamicConfigurator`.

### Rendering & Performance

| Finding | Impact |
|---------|--------|
| **Lazy loading** | Admin routes, `ThreeDProductPreview`, `ARPreview` are lazy — good. |
| **Heavy imports** | `DynamicConfigurator` imports many deps; consider splitting. |
| **No React.memo** | Preview components re-render on parent state changes; consider memoization. |
| **No virtualization** | Product lists, design history could benefit from virtual lists for large datasets. |

### Accessibility

- **Skip link:** `#main-content` skip link present.
- **Limited ARIA:** ~18 `aria-*` / `role=` usages; forms and interactive elements need more labels and roles.
- **Focus management:** No explicit focus trap in modals.

### Responsive Design

- Tailwind responsive classes used; layout adapts to viewport.
- 3D canvas may be heavy on mobile; no explicit mobile fallback.

### Asset Loading

- Images loaded via `src`; no explicit lazy loading for below-fold images.
- 3D textures loaded on demand; `crossOrigin` set for CORS.

---

## PHASE 4 — 3D ENGINE AUDIT

### Three.js / WebGL Architecture

- **Stack:** @react-three/fiber + drei + three.js.
- **Components:** `ThreeDProductPreview`, `Hero3D`, `StudioCanvas` (Canvas wrapper), `ARPreview`.

### Model Loading

- **No external 3D models:** Uses procedural geometries (`planeGeometry`, `boxGeometry`, `cylinderGeometry`, etc.).
- **No glTF/GLB:** No model compression or LOD.

### Texture Loading

- **Image textures:** Logo/artwork via `THREE.Texture`; `anisotropy: 8`, `colorSpace: SRGBColorSpace`.
- **Decal projection:** `Decal` from drei for logo placement on sign face.
- **No texture atlas:** Each image is a separate texture.

### Shader Usage

- **Standard materials:** `meshStandardMaterial`, PBR with `metalness`, `roughness`, `envMapIntensity`.
- **Transmission:** Used for acrylic_clear (`transmission`, `ior`, `thickness`).
- **No custom shaders:** Relies on built-in materials.

### Scene Management

- **Environment:** `Environment` from drei for IBL.
- **Lighting:** Implicit via Environment; `ContactShadows` for ground shadow.
- **No scene graph optimization:** No instancing, no LOD.

### Performance Bottlenecks

| Issue | Recommendation |
|-------|----------------|
| **No LOD** | Add LOD for distant objects if scene complexity grows. |
| **No model compression** | When adding glTF, use Draco/KTX2. |
| **Texture disposal** | `texRef.current?.dispose()` on unmount — good. |
| **No instancing** | Repeated objects (e.g. multiple signs) could use `InstancedMesh`. |

### Photorealistic Rendering

- PBR materials and Environment provide reasonable quality.
- **Upgrades:** Consider `@react-three/postprocessing` for bloom/SSAO; tone mapping; higher-res env maps.

---

## PHASE 5 — PRODUCT CONFIGURATOR AUDIT

### Product Schema Structure

- **CustomizationSchema:** `surfaces`, `fields`, `preview`, `production`, `dimensions`, `components`, `materialConstraints`.
- **Field types:** text, textarea, number, image, select, radio, checkbox, slider, color-swatch, font-picker, icon-picker.
- **SurfaceZone:** `x`, `y`, `w`, `h`, `uvBounds` for 3D projection.

### Customization Zones

- Zones defined per surface; `parseZoneBounds` extracts bounds from schema.
- `getFirstZone` returns first zone for default placement.

### Variant Logic

- Options via `FieldOption` (id, label, priceAdd, multiplier, hex).
- No explicit variant matrix; config is flat key-value.

### Configuration Rules

- **Validation:** `validateConfig` checks required fields, types, constraints.
- **Pricing:** `calculatePrice` uses `PricingRules` from API; `priceAdd`, `multiplier` from options.

### Material Switching

- Material IDs in config; `ThreeDProductPreview` maps to PBR props.
- `materialConstraints` in schema restrict allowed materials per product.

### Weaknesses

| Issue | Description |
|-------|-------------|
| **Hardcoded product types** | `ThreeDProductPreview` switches on `productType`; new types require code changes. |
| **No rules engine** | Dependencies between options (e.g. "if material X then finish Y") are not declarative. |
| **Flat config** | No nested structure for multi-component products; all in one object. |

---

## PHASE 6 — AI SYSTEM AUDIT

### Prompt Structure

- **designAssistant:** System prompt includes category hints, schema fields, production constraints.
- **generativeDesign:** DALL-E 3 with category hints and style presets.
- **sceneAnalysis:** Scene description for AI Builder.
- **machineAssistant:** Machine-specific guidance.

### LLM Usage

- **Models:** GPT-4o-mini (designAssistant), DALL-E 3 (generativeDesign).
- **Conversation history:** Last 8 messages passed to designAssistant.

### Caching

- **None:** Every request hits OpenAI; no response caching.

### Cost Optimization

- `max_tokens: 300` for designAssistant — reasonable.
- No request coalescing or debouncing on rapid user input.

### Error Handling

- Try/catch with fallback message.
- No retry logic, no circuit breaker.

### Security Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Prompt injection** | High | User message passed directly; add output validation and instruction boundaries. |
| **Hallucination** | Medium | Schema-aware prompts help; add structured output (JSON) where possible. |
| **API key exposure** | High | `VITE_OPENAI_API_KEY` is client-exposed; use only server-side `OPENAI_API_KEY`. |

### Missing Safeguards

- No rate limiting on AI endpoints (only global 120/min).
- No content moderation on generated images.
- No audit logging of AI requests.

---

## PHASE 7 — SECURITY AUDIT

### Authentication

- **JWT:** Bearer token, 7-day expiry.
- **bcrypt:** Password hashing with cost 10.
- **Role check:** `adminOnly` middleware for admin routes.
- **Weakness:** `JWT_SECRET` fallback `'adea-crafts-dev-secret-change-in-production'` — **critical** if deployed without override.

### API Security

- **CORS:** Restricted to localhost origins; production origins hardcoded.
- **Rate limiting:** 120 req/min per IP; in-memory store (resets on restart).
- **Security headers:** X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy.

### Secrets Exposure

- `VITE_OPENAI_API_KEY` in .env.example — **never use** for server-side; client can read it.
- `JWT_SECRET` must be set in production.

### Injection

- **SQL:** Parameterized queries throughout (`db.prepare(...).run(...)`); no string concatenation of user input.
- **Inventory PATCH:** Column names hardcoded (stock, min_level, price); safe.

### Dependencies

- Run `npm audit` regularly; no automated check in CI.

### Recommendations

1. Remove `JWT_SECRET` fallback; fail fast if not set.
2. Use only `OPENAI_API_KEY` server-side; remove `VITE_OPENAI_API_KEY` from client.
3. Add `FRONTEND_URL` to CORS allowed origins for production.
4. Document all required env vars in `.env.example`.

---

## PHASE 8 — PERFORMANCE AUDIT

### Bundle Size

- No `rollup-plugin-visualizer` or bundle analysis in build.
- **Recommendation:** Add `vite-plugin-bundle-analyzer` to identify large chunks.

### Build Configuration

- `tsc -b && vite build`; no code splitting beyond route-based lazy loading.
- Vite 8 with default chunking.

### Asset Optimization

- No explicit image optimization pipeline.
- 3D textures loaded at full resolution.

### Lazy Loading

- Admin routes: lazy.
- `ThreeDProductPreview`, `ARPreview`: lazy in StudioCanvas.
- `DynamicConfigurator` and main routes: eager.

### Caching

- No service worker or PWA.
- No HTTP cache headers explicitly set for static assets (Vite handles hashed filenames).

### Recommendations

1. Add bundle analyzer; split large vendor chunks (three.js, framer-motion).
2. Lazy-load `GenerativeDesignModal` and `AIChatSidebar` when first opened.
3. Add image optimization (e.g. sharp, or CDN) for user uploads.
4. Consider CDN for static assets in production.

---

## PHASE 9 — CODE QUALITY AUDIT

### Readability

- Generally clear naming; some long files (`DynamicConfigurator`, `ThreeDProductPreview`).
- JSDoc in CustomizationEngine and AI modules.

### Naming Conventions

- Components: PascalCase.
- Hooks: `use*`.
- Services: camelCase.

### Function Complexity

- `DynamicConfigurator` has many useState/useEffect; could be split.
- `ThreeDProductPreview` has large switch statements per product type.

### Duplication

- Product type handling duplicated across preview components.
- Similar fetch patterns (products, designs) without shared hook.

### Modularity

- Services are reasonably separated.
- Pages mix data fetching and UI.

### Documentation

- CustomizationEngine types are well-documented.
- API routes lack OpenAPI/Swagger.
- No README for development setup.

### Refactoring Strategies

1. Extract `useProductConfig` and `useDesignHistory` hooks.
2. Create `ProductPreview` factory from schema instead of switch.
3. Add API client with typed endpoints.
4. Document env vars and local setup in README.

---

## PHASE 10 — UX / DESIGN AUDIT

### Navigation

- Clear top-level nav; marketplace, shop, design, admin.
- Redirects from legacy routes to `/marketplace/configure` preserve context.

### Interaction Design

- Framer Motion for transitions.
- Undo/redo in studio.
- AI chat sidebar for design guidance.

### Animation Smoothness

- Framer Motion used; no obvious jank.
- 3D canvas may drop frames on low-end devices; no quality scaling.

### Modern Design Patterns

- Dark/light mode support.
- Responsive layout.
- Modal-based flows (generative design, export).

### User Flow Clarity

- Configurator flow is clear: product → customize → add to cart.
- Save/share designs available for logged-in users.
- Quote flow for unauthenticated users.

### Improvements

1. Add loading skeletons for product fetch.
2. Improve error states (toast or inline messages).
3. Add onboarding/tooltips for first-time configurator users.
4. Consider quality preset (low/medium/high) for 3D on mobile.

---

## PHASE 11 — MISSING FEATURES

| Feature | Importance | Rationale |
|---------|------------|-----------|
| **Product rules engine** | High | Declarative rules (if material X then finish Y) would scale better than hardcoded logic. |
| **Save/share configurations** | Partial | Save exists; share token exists; public share page could be improved. |
| **Admin product builder** | High | Adding products requires code changes; UI to create/edit schemas would reduce friction. |
| **Asset management** | Medium | User uploads and AI-generated assets stored ad hoc; no central library or CDN. |
| **Analytics** | Medium | `AnalyticsTracker` exists; no backend analytics, funnels, or conversion tracking. |
| **Caching layer** | Medium | No Redis or similar; product catalog and pricing hit DB every time. |
| **Structured AI output** | High | Design suggestions as JSON would enable one-click config application. |
| **E2E tests** | Medium | Vitest for unit tests; no Playwright/Cypress for critical flows. |
| **CI/CD** | Low | No automated build/test/deploy pipeline. |

---

## PHASE 12 — NEXT-LEVEL UPGRADE PLAN

### 1. Critical (Security & Stability)

| Item | Action |
|------|--------|
| JWT_SECRET | Remove fallback; require env var in production. |
| OpenAI key | Use only OPENAI_API_KEY server-side; remove VITE_OPENAI_API_KEY. |
| .env.example | Document JWT_SECRET, OPENAI_API_KEY, STRIPE_SECRET_KEY, FRONTEND_URL. |

### 2. High Impact (Architecture & UX)

| Item | Action |
|------|--------|
| Configurator refactor | Extract useConfigurator, ConfiguratorPanel; reduce DynamicConfigurator size. |
| Unified design store | Merge config + layers into single Zustand store. |
| AI safeguards | Add prompt boundaries, output validation; consider structured JSON output. |
| Admin product builder | UI to create/edit product schemas without code deploy. |
| Bundle analysis | Add vite-plugin-bundle-analyzer; split three.js and heavy deps. |

### 3. Optional Enhancements

| Item | Action |
|------|--------|
| Rules engine | Declarative product rules (dependencies, constraints). |
| Redis cache | Cache product catalog, pricing rules. |
| E2E tests | Playwright for checkout, configurator, save design. |
| PWA | Service worker for offline readiness. |
| LOD / model compression | When adding glTF, use Draco, KTX2. |
| CDN | Offload static assets and user uploads. |

---

## PHASE 13 — FINAL REPORT

### System Overview

Adea Crafts is a **monolithic** custom manufacturing platform: React SPA + Express API + SQLite. It offers a unified product configurator at `/marketplace/configure`, AI-assisted design (chat + generative design), 3D previews (Three.js), 2D/3D/AR canvas, and export to manufacturing formats (SVG, DXF, Curio, XTool). The architecture is schema-driven for products but still has hardcoded product-type logic in the 3D preview layer.

### Weaknesses Summary

- **Security:** JWT_SECRET fallback; potential OpenAI key exposure.
- **Architecture:** God component (DynamicConfigurator); dual state (config vs studioStore).
- **AI:** No prompt injection protection; no caching; no structured output.
- **3D:** No LOD, no model compression; procedural only.
- **Performance:** No bundle analysis; some heavy components not lazy-loaded.
- **Code quality:** Long files; duplication in product-type handling.

### Technical Debt

- Large DynamicConfigurator component.
- Scattered fetch calls; no centralized API client.
- Missing admin product builder (code-only product addition).
- No E2E tests; limited accessibility.

### Performance Issues

- No bundle analysis or chunk optimization.
- No image optimization pipeline.
- 3D may be heavy on low-end devices.

### Security Risks

- JWT_SECRET fallback (critical in production).
- VITE_OPENAI_API_KEY usage (key exposure risk).
- No AI-specific rate limiting.

### Missing Features

- Product rules engine.
- Admin product builder UI.
- Caching layer.
- Structured AI output.
- E2E test suite.

### Upgrade Roadmap

1. **Week 1–2:** Security fixes (JWT_SECRET, OpenAI key); .env.example update.
2. **Week 3–4:** Configurator refactor; unified design store.
3. **Month 2:** AI safeguards; structured output; admin product builder MVP.
4. **Month 3:** Bundle analysis; performance tuning; E2E tests.
5. **Ongoing:** Rules engine, caching, PWA, CDN as capacity allows.

---

*End of Audit Report*
