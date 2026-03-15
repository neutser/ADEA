# Adea Crafts

AI-powered custom manufacturing platform. Custom 3D logo signs, laser engraving, engraved gifts, apparel, and more. Design, visualize, and order with real-time previews.

## Setup

```bash
npm install
cp .env.example .env   # Required in production: JWT_SECRET, OPENAI_API_KEY
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

- `VITE_API_URL` – API base URL (backend)
- `OPENAI_API_KEY` – Server-side only. AI design assistant, generative design, scene analysis (optional)
- `VITE_GEMINI_API_KEY` – Gemini Vision alternative (optional)

## Platform Modules

- **Business Signs** – 3D logos, LED signs, office signage
- **Personalized Gifts** – Keychains, coasters, pet tags
- **Wedding & Event** – Bulk CSV, favors, seating
- **Apparel** – Embroidery, DTF, uniforms
- **Home Decor** – Family signs, plaques
- **Pet Products** – Tags, memorials
- **AI Builder** – Upload space photo, AI recommendations, preview in scene
- **Sign Builder** – Logo upload, materials, LED, dimensions, pricing
- **Craft Configurator** – Text, shapes, materials, bulk CSV
- **Production** – File generator, pipeline, inventory, machine queue

## Tech Stack

React 19, TypeScript, Vite 8, react-router-dom, framer-motion, lucide-react, react-helmet-async

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for module map and technical stack.
