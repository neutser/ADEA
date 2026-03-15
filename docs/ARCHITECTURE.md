# Adea Crafts – AI-Powered Custom Manufacturing Platform

## Architecture Overview

Enterprise digital platform for custom manufacturing (laser, craft cutter, embroidery, DTF). Customers design, visualize, and order; the system generates production-ready files.

---

## Technical Stack

| Layer | Technology | Rationale |
|-------|-------------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8 | Current stack, fast builds |
| **3D/Preview** | Three.js (r3f optional) | 3D previews, depth, shadows, LED glow |
| **Vector/SVG** | SVG + canvas | Technical layout, dimensions |
| **AI Vision** | OpenAI Vision / Gemini Vision API | Scene analysis, placement, recommendations |
| **State** | Zustand | Configurator state, cart, design sessions |
| **API** | REST + WebSocket (future) | Orders, real-time status |
| **File Gen** | jsPDF, svg2dxf (or server) | Production files, assembly diagrams |
| **Auth** | JWT + refresh (backend) | Replace mock auth |

---

## Module Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     PREMIUM WEBSITE LAYER                         │
│  Home | Business Signs | Gifts | Wedding | Apparel | Home Decor  │
│  Pet | AI Builder | Portfolio | Case Studies | Blog              │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│              REAL-TIME CONFIGURATION ENGINE                       │
│  • Unified configurator (signs, crafts, apparel)                 │
│  • Logo/image/text upload                                        │
│  • Material, dimensions, LED, packaging                          │
│  • Live pricing                                                  │
│  • Instant SVG/canvas preview                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│              AI VISUALIZATION & SCENE SYSTEM                     │
│  • User photo upload (storefront, room, desk)                    │
│  • AI scene analysis (walls, perspective, scale)                 │
│  • Product placement (drag, resize, rotate)                       │
│  • AI product recommendations                                    │
│  • Hybrid: fast SVG + high-quality AI render                    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│              PRICING & ORDER ENGINE                              │
│  • Dynamic pricing (material, size, qty, complexity)             │
│  • Quote vs direct purchase                                      │
│  • Order storage (config, previews, production files)            │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│              PRODUCTION & MANUFACTURING                          │
│  • Workflow stages (received → design → cut → QC → ship)          │
│  • SVG/DXF/embroidery file generation                            │
│  • Manufacturing constraints validation                          │
│  • Inventory, machine queue                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

- **Configurator**: Debounce price calc; use Web Workers for heavy SVG processing
- **3D Preview**: Lazy-load Three.js; low-poly fallback on weak devices
- **AI Calls**: Cache scene analysis; queue requests; show fast SVG preview first
- **Images**: Lazy load, WebP, responsive srcset

---

## Fallback Flows

1. **AI unavailable**: Use rule-based placement (center, scale from image size)
2. **3D slow**: Fallback to 2D canvas/SVG preview
3. **Backend down**: Offline design save to IndexedDB; sync when online
4. **File gen fails**: Manual download of design JSON for admin processing

---

## Conversion Architecture (3 Funnels)

| Funnel | Entry | Flow | Goal |
|--------|-------|------|------|
| **B2B** | Business Signs | Upload logo → Preview in building → Quote | High-ticket sign projects |
| **B2C** | Gifts / Shop | Customize → Preview → Add to cart | Fast consumer purchases |
| **AI Builder** | AI Builder | Upload building photo → Upload logo → Preview → Order/Quote | Most powerful differentiator |

## Homepage Structure (Conversion Hub)

1. **Hero** – "Design Your Custom Products and See Them Before You Buy" + 3 CTAs (Start Designing, Upload Building Photo, Browse Products)
2. **Interactive AI Demo** – Mini configurator: upload logo, select sign type, instant preview
3. **Featured Categories** – Business Signs, Personalized Gifts, Clothing, Wedding
4. **How It Works** – 4 steps: Upload → Customize → Preview in scene → Order/Quote
5. **Portfolio** – Real installations (restaurant, office, wedding, uniforms)
6. **AI Preview Section** – "See Your Sign Before You Buy" – unique feature promo
7. **Client Logos** – Trusted by businesses
8. **Testimonials** – Client quotes
9. **Final CTA** – Start Designing Your Product

## Implementation Status

| Module | Status | Notes |
|--------|--------|------|
| Site structure | Done | Business Signs, Gifts, Wedding, Apparel, Decor, Pets, Corporate, AI Builder, Case Studies, Blog |
| Nav & routing | Done | All main sections |
| Homepage conversion | Done | Hero, AI Demo, Portfolio, AI Preview, Client Logos, Final CTA |
| Sign Builder | Done | Add to cart, pricing engine |
| Craft Configurator | Done | Add to cart, bulk CSV |
| AI Builder | Done | Scene upload, AI analysis, placement (drag/resize/rotate) |
| Pricing engine | Done | `src/services/pricing.ts` |
| AI scene service | Done | `src/services/aiScene.ts` – placeholder for Vision API |
| File generation | Done | `src/services/fileGeneration.ts` – SVG cut file, validation |
| Production workflow | Existing | Pipeline, FileGenerator, MachineQueue, Inventory |
| Apparel add to cart | Done | `ApparelConfigurator.tsx` – addItem, navigate to cart |
| Checkout integration | Done | `Checkout.tsx` – real cart items, total, clear on success |
| AI placement assistant | Done | `AIBuilder.tsx` – drag, resize, rotate, snap to center |
