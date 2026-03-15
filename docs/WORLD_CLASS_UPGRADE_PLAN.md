# Adea Crafts — World-Class AI Product Customization Platform
## Complete Upgrade Plan (16 Phases)

**Target:** Rival Nike By You, Tesla Configurator, Apple Product Pages  
**Vision:** Premium interactive AI product studio with photorealistic 3D, real-time customization, and luxury UX  
**Date:** March 2026

---

# PHASE 1 — COMPLETE CODEBASE ANALYSIS

## 1.1 Project Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19, Vite 8, TypeScript | SPA with routing, lazy loading |
| **Backend** | Express 4, Node.js | REST API, auth, file generation |
| **Database** | SQLite (node:sqlite sync) | Users, designs, orders, products |
| **Real-time** | Socket.io | Optional future use |
| **3D** | Three.js, React Three Fiber, Drei | Product previews, hero |
| **Build** | Vite, tsc | ES modules, bundled output |

**Architecture type:** Monolith — single deployable unit.

## 1.2 Module Responsibilities

| Module | Path | Responsibility |
|--------|------|----------------|
| **CustomizationEngine** | `src/services/CustomizationEngine.ts` | Schema validation, pricing, defaults, zone parsing |
| **PreviewRegistry** | `src/components/PreviewRegistry.tsx` | Maps product types → 3D/2D preview components |
| **ThreeDProductPreview** | `src/components/ThreeDProductPreview.tsx` | 3D sign/plaque/keychain/garment rendering |
| **Hero3D** | `src/components/Hero3D.tsx` | Hero with floating 3D objects, engraving title |
| **DynamicConfigurator** | `src/pages/DynamicConfigurator.tsx` | Unified configurator (AI, history, export) |
| **useConfigurator** | `src/hooks/useConfigurator.ts` | Config state, history, pricing, undo/redo |
| **studioStore** | `src/stores/studioStore.ts` | Layers, tools, machine, material |
| **AuthContext** | `src/contexts/AuthContext.tsx` | Auth state, JWT |
| **CartContext** | `src/contexts/CartContext.tsx` | Cart state |
| **AI modules** | `server/ai/*.js` | designAssistant, generativeDesign, sceneAnalysis, machineAssistant |

## 1.3 Dependency Graph

```
main.tsx
  └── App.tsx
        ├── AuthProvider, CartProvider, PageMeta, Navbar, Footer
        ├── Routes → Home, Shop, ProductDetail, DynamicConfigurator, Admin, etc.
        └── ErrorBoundary

Home
  └── Hero3D (3D Canvas, engraving title, name input)
  └── HomeMiniConfigurator
  └── Category cards, How It Works, Portfolio, AI Preview, Testimonials

DynamicConfigurator
  ├── useConfigurator (config, history, pricing)
  ├── PreviewRegistry (product → preview)
  ├── GenerativeDesignModal (lazy)
  └── API_BASE (products, designs, AI, export)

Server
  ├── db.js (SQLite)
  ├── fileGeneration.js, manufacturingValidation.js
  ├── ai/*.js (OpenAI)
  └── machineExport/*.js (Curio, XTool)
```

## 1.4 Build Pipeline

- **Dev:** `npm run dev` (Vite), `npm run server` (Express), `npm run dev:all` (concurrent)
- **Build:** `tsc -b && vite build`; `build:analyze` for bundle stats
- **Proxy:** `/api` and `/socket.io` → `localhost:3001`

## 1.5 Entry Points

| Entry | Purpose |
|-------|---------|
| `index.html` | HTML shell |
| `src/main.tsx` | React root, StrictMode, HelmetProvider, BrowserRouter |
| `src/App.tsx` | Route tree, providers |
| `server/index.js` | Express app, Socket.io, API routes |

## 1.6 Data Flow

```
User → React Router → Page Component
  → useConfigurator / studioStore / CartContext
  → fetch(API_BASE + /api/...)
  → Express → db.js (SQLite)
  → AI modules → OpenAI API
```

## 1.7 API Architecture

- **Auth:** JWT Bearer, bcrypt, 7-day expiry
- **Designs:** CRUD, share tokens, production files
- **Orders:** Checkout, Stripe, status workflow
- **Products:** Marketplace catalog, pricing, templates
- **AI:** design-assistant, generate-design, analyze-scene, machine-assistant
- **Export:** SVG, DXF, Curio, XTool

---

# PHASE 2 — ARCHITECTURE AUDIT

## 2.1 Problems Identified

| Issue | Severity | Description |
|-------|----------|-------------|
| **Monolith** | High | Single process; no horizontal scaling |
| **Dual state** | Medium | Config in useConfigurator vs layers in studioStore |
| **No API layer** | Medium | Direct fetch scattered; no typed client |
| **God component** | Medium | DynamicConfigurator still ~750 lines |
| **Tight coupling** | Medium | PreviewRegistry hardcodes product types |
| **No caching** | Medium | Product catalog, pricing hit DB every time |
| **SQLite** | Low | Fine for MVP; PostgreSQL for scale |

## 2.2 New Scalable Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│  Design System  │  Configurator UI  │  3D Engine  │  AI Studio  │
│  (Tailwind)     │  (useConfigurator) │  (Three.js) │  (Chat)     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              API Client (typed)
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Express)                      │
│  Rate Limiting │ Auth │ CORS │ Request Validation                │
└─────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────▼───────┐         ┌────────────▼────────────┐   ┌──────▼──────┐
│  Product API  │         │  Design / Order API      │   │  AI Service │
│  (cached)     │         │  (SQLite → PostgreSQL)   │   │  (OpenAI)   │
└───────────────┘         └─────────────────────────┘   └─────────────┘
```

**Recommendations:**
1. **Unified design store** — Merge config + layers into single Zustand store
2. **API client** — Typed fetch wrapper with error handling, retries
3. **Micro-frontends** — Optional: split configurator, admin, shop as separate apps
4. **Caching layer** — Redis for product catalog, pricing rules
5. **Database** — Migrate to PostgreSQL for production scale

---

# PHASE 3 — VISUAL UI AUDIT

## 3.1 Why It Doesn't Feel Premium

| Issue | Current State | Premium Standard |
|-------|---------------|------------------|
| **Typography** | Inter + Syne; generic scale | Distinctive display font (e.g. Clash Display, Satoshi); 8–12 scale |
| **Spacing** | Inconsistent gaps (16, 24, 32, 48, 60) | 8px grid; consistent rhythm |
| **Visual hierarchy** | Flat sections; weak contrast | Clear section hierarchy; depth via shadows |
| **Animations** | Basic Framer Motion; no stagger | Orchestrated entrance; micro-interactions |
| **Component reuse** | Inline styles; glass-panel everywhere | Design tokens; consistent components |
| **Imagery** | Unsplash placeholders | Curated product photography; branded imagery |
| **3D hero** | Procedural geometries; basic materials | Photoreal models; HDR lighting |
| **Engraving** | CSS animation only | Shader-based laser trace; sparks |

## 3.2 Specific Issues

- **Hero:** Engraving is CSS animation; no real laser effect or sparks
- **Cards:** All same glass-panel; no variety
- **Buttons:** Generic; no magnetic hover, no cursor glow
- **Loading:** No skeleton loaders; no shimmer
- **Transitions:** Section-to-section transitions are abrupt

---

# PHASE 4 — FULL HOMEPAGE REDESIGN

## New Structure (11 Sections)

| # | Section | Content | Transition |
|---|---------|---------|------------|
| 1 | **Immersive 3D Hero** | Full-screen 3D scene, floating products, engraving headline | Cursor parallax, fade-in |
| 2 | **Product Categories** | 6–8 category cards with hover 3D tilt | Stagger entrance |
| 3 | **AI Product Creation** | "Create with AI" CTA, prompt preview | Slide-up |
| 4 | **Featured Customizable Products** | 4–6 hero products with configurator links | Carousel or grid |
| 5 | **Interactive Product Demo** | Live 3D configurator embed | Scroll-triggered |
| 6 | **AI Studio Preview** | Screenshot/video of configurator | Parallax |
| 7 | **Real Customer Creations** | UGC gallery, testimonials | Masonry grid |
| 8 | **Platform Benefits** | 4–6 value props (speed, quality, AI) | Icon + text |
| 9 | **Viral Interaction** | Share design, export mockup | CTA |
| 10 | **Final CTA** | Single primary action | Centered |
| 11 | **Premium Footer** | Links, newsletter, social, legal | Minimal |

## Section Transitions

- Use `IntersectionObserver` + Framer Motion for scroll-triggered animations
- Parallax on hero background
- Smooth scroll between sections

---

# PHASE 5 — INSANE HERO EXPERIENCE

## Current State

- Hero3D has: `FallingObjects` (Float, procedural geometries), `ContactShadows`, `Environment preset="night"`
- No cursor parallax
- Basic materials (meshStandardMaterial)

## Target State

| Feature | Implementation |
|---------|----------------|
| **Floating products** | Keep Float; add slow rotation per object |
| **Cursor parallax** | `useMousePosition` → offset camera or light |
| **Soft reflections** | HDR environment map; higher envMapIntensity |
| **Real shadows** | ContactShadows + soft shadows; adjust bias |
| **Product objects** | Upgrade to glTF models (pen, mug, keychain, phone, shirt, cap) |

## Implementation

```tsx
// Cursor parallax
const { x, y } = useMousePosition();
const parallax = useMemo(() => [x * 0.02, y * 0.02, 0], [x, y]);
// Apply to camera or light position
```

---

# PHASE 6 — ENGRAVING ANIMATION

## Current State

- CSS `engraveLine` animation
- `engraving-laser` div with `laserTrace` animation
- No shader; no sparks

## Target State

| Feature | Implementation |
|---------|----------------|
| **Laser trace** | Custom shader or SVG path animation |
| **Sparks** | Particle system (GPU particles) |
| **Engraving texture** | Normal map or displacement |
| **User name** | Typed name → rendered on 3D product in hero |

## Implementation Options

1. **Shader-based:** Custom vertex/fragment shader for "burning" effect
2. **Particle system:** `@react-three/drei` or custom particles for sparks
3. **SVG path:** Animate stroke-dashoffset for laser path
4. **Text3D:** User name on 3D product; animate opacity/scale

---

# PHASE 7 — PRODUCT ASSEMBLY ANIMATION

## Concept

- Pen parts fly together
- Shirt unfolds
- Mug spins into place

## Implementation

- **Three.js:** Use GSAP or React Spring for object transforms
- **glTF:** Load separate parts; animate position/rotation
- **Physics:** Optional: `@react-three/rapier` for assembly simulation

## Product-Specific Animations

| Product | Animation |
|---------|------------|
| Pen | Cap + body + clip fly in |
| Mug | Body + handle attach |
| Shirt | Shirt unfolds from folded |
| Keychain | Base + keyring attach |
| Sign | Layers stack |

---

# PHASE 8 — AI PRODUCT STUDIO

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Product Name | Machine | Export | Quote | Add to Cart          │
├───────────────────────────────┬─────────────────────────────────┤
│                               │  CUSTOMIZATION CONTROLS          │
│   LARGE 3D VIEWER              │  - Materials (swatches)         │
│   (Full canvas)                │  - Colors (picker)               │
│                               │  - Engraving (text)              │
│   [OrbitControls]              │  - Logo upload                   │
│  [Day/Night] [Undo/Redo]       │  - AI design generator          │
│                               │  - Quantity                      │
├───────────────────────────────┴─────────────────────────────────┤
│  AI PROMPT BAR: "Create a luxury engraved pen" [Generate]       │
└─────────────────────────────────────────────────────────────────┘
```

## Current vs Target

| Aspect | Current | Target |
|--------|---------|--------|
| 3D size | ~60% | 70–75% |
| Controls | Left panel | Right panel |
| AI bar | Modal | Persistent bottom bar |
| Updates | Debounced | Instant (real-time) |

---

# PHASE 9 — PHOTOREALISTIC RENDERING

## Current State

- `meshStandardMaterial` with metalness, roughness
- `Environment` from drei
- Basic PBR; no normal maps

## Target State

| Feature | Implementation |
|---------|----------------|
| **PBR materials** | Albedo, roughness, metalness, normal maps |
| **HDR environment** | Custom HDR env map (studio, outdoor) |
| **Real shadows** | Soft shadows; adjust map size |
| **Reflections** | Environment map; transmission for glass |
| **Material types** | Metal, ceramic, plastic, fabric, glass presets |

## Material Library

```ts
const MATERIAL_PRESETS = {
  metal_brushed: { metalness: 0.95, roughness: 0.3, normalMap: '...' },
  ceramic: { metalness: 0, roughness: 0.1 },
  plastic: { metalness: 0.1, roughness: 0.4 },
  fabric: { metalness: 0, roughness: 0.9 },
  glass: { transmission: 0.95, ior: 1.5, thickness: 0.5 },
};
```

---

# PHASE 10 — PRODUCT CONFIGURATION ENGINE

## Current Schema (CustomizationEngine)

- `surfaces`, `fields`, `preview`, `production`, `dimensions`, `components`, `materialConstraints`
- Validation, pricing, zone parsing

## Missing: Rules Engine

```ts
interface Rule {
  id: string;
  condition: { field: string; op: string; value: any };
  actions: { field: string; value: any }[];
}

// Example: IF material = leather THEN engraving disabled
```

## Target Structure

```
Product
├── Components (panel, frame, base, led)
├── Materials (allowed per component)
├── Customization Zones (x, y, w, h, uvBounds)
├── Dimensions (widthMM, heightMM, depthMM)
├── Pricing Rules (tiers, formula)
└── Compatibility Rules (IF/THEN)
```

---

# PHASE 11 — AI PRODUCT GENERATOR

## Current State

- `generativeDesign` — DALL-E 3 for image generation
- `designAssistant` — Chat for design help

## Target: Text-to-Product

| Input | AI Output |
|-------|-----------|
| "Create a luxury engraved pen" | Product model + engraving + material |
| "Gold keychain with company logo" | Keychain + gold material + logo zone |

## Implementation

1. **LLM:** Parse product type, material, engraving from prompt
2. **Schema:** Map to product ID + config
3. **Preview:** Render 3D with config
4. **Refinement:** Allow user to refine via chat

---

# PHASE 12 — VIRAL UX FEATURES

| Feature | Implementation |
|---------|----------------|
| **AI design generator** | Bottom bar; modal for generation |
| **Engraving animation** | Hero + configurator |
| **Share custom design** | `/share/:token` with deep link |
| **Export mockups** | PNG/SVG with transparent background |

## Share Flow

```ts
// Share link: /marketplace/configure?share=abc123
// Fetch design from share token; load config into configurator
```

---

# PHASE 13 — MICRO INTERACTIONS

| Interaction | Implementation |
|-------------|----------------|
| **Magnetic buttons** | Cursor pull; `transform` on hover |
| **Cursor glow** | Custom cursor; glow follows |
| **Hover tilt** | 3D tilt on cards; `transform: perspective` |
| **Animated loading** | Skeleton shimmer; 3D spinner |

## Example: Magnetic Button

```css
.magnetic-btn {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.magnetic-btn:hover {
  transform: translate(var(--cursor-x), var(--cursor-y)) scale(1.05);
}
```

---

# PHASE 14 — PERFORMANCE OPTIMIZATION

| Optimization | Implementation |
|--------------|----------------|
| **Lazy loading** | Route-based; modal lazy; 3D on viewport |
| **3D model compression** | Draco for glTF; KTX2 for textures |
| **Texture compression** | 512x512 max for preview; WebP |
| **GPU instancing** | InstancedMesh for repeated objects |
| **LOD** | LOD for distant objects |

## Bundle Analysis

- Run `npm run build:analyze`
- Split three.js into separate chunk
- Lazy load admin routes (already done)

---

# PHASE 15 — SECURITY AUDIT

## Current State (Post-Fix)

- JWT_SECRET required in production
- OPENAI_API_KEY server-side only
- AI rate limits (20/min)
- Prompt sanitization (aiUtils)
- Parameterized SQL

## Recommendations

| Item | Action |
|------|--------|
| **CORS** | Add FRONTEND_URL to allowed origins |
| **npm audit** | Run regularly; fix vulnerabilities |
| **Input validation** | Zod or Joi for API bodies |
| **Rate limiting** | Per-endpoint limits for AI |
| **Secrets** | Use Vault or env secrets in prod |

---

# PHASE 16 — FINAL OUTPUT

## 1. System Architecture Redesign

- **Monolith → Modular** — Keep monolith for now; add API client, caching
- **Unified design store** — Single Zustand store for config + layers
- **API layer** — Typed fetch client

## 2. UI Redesign Plan

- **Design tokens** — 8px grid
- **Typography** — 8–12 scale; distinctive display font
- **Components** — Button, Card, Input, Section from design system
- **Homepage** — 11 sections per Phase 4

## 3. 3D Engine Upgrade Plan

- **Models** — glTF for hero products; Draco compression
- **Materials** — PBR presets; normal maps
- **Lighting** — HDR env; soft shadows
- **Animations** — Assembly; engraving shader

## 4. AI System Architecture

- **designAssistant** — Keep; add structured output
- **generativeDesign** — Keep; add product-specific prompts
- **Text-to-product** — New: parse prompt → product + config
- **Caching** — Cache common AI responses

## 5. Animation System Design

- **Engraving** — Shader or particle sparks
- **Assembly** — GSAP/Spring for part transforms
- **Micro** — Magnetic buttons, cursor glow, hover tilt

## 6. Performance Optimization Strategy

- Lazy load 3D, modals
- Compress textures, models
- GPU instancing, LOD
- Bundle analysis

## 7. Recommended Technology Stack

| Component | Current | Recommended |
|-----------|---------|-------------|
| **Frontend** | React 19, Vite 8 | Keep |
| **3D** | Three.js, R3F, Drei | Keep; add @react-three/postprocessing |
| **Animation** | Framer Motion | Keep; add GSAP for 3D |
| **State** | Zustand, Context | Keep; unify design store |
| **Database** | SQLite | PostgreSQL for scale |
| **Caching** | None | Redis |
| **CDN** | None | Cloudflare / Vercel |

---

# IMPLEMENTATION ROADMAP

## Phase 1–2 (Weeks 1–2): Foundation

- Architecture refactor: API client, unified design store
- Homepage structure: 11 sections

## Phase 3–5 (Weeks 3–4): Hero

- 3D hero upgrade: cursor parallax, better materials
- Engraving animation: shader or particles

## Phase 6–8 (Weeks 5–6): 3D & Studio

- Photorealistic rendering
- AI studio layout
- Product assembly animations

## Phase 9–11 (Weeks 7–8): AI & Config

- Rules engine
- Text-to-product
- Viral features

## Phase 12–14 (Weeks 9–10): Polish

- Micro-interactions
- Performance
- Security

## Phase 15–16 (Ongoing): Scale

- PostgreSQL migration
- Redis caching
- CDN

---

*End of Upgrade Plan*
