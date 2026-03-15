# Adea Crafts Design System

## Overview

The design system uses CSS variables for theming and supports Tailwind CSS for utility-first styling. Components can use either approach; migration to Tailwind is incremental.

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-color` | `#0a0a0a` | Page background |
| `--bg-surface` | `#121212` | Card/panel background |
| `--bg-elevated` | `#1e1e1e` | Elevated surfaces |
| `--text-primary` | `#ffffff` | Primary text |
| `--text-secondary` | `#a0a0a0` | Secondary text |
| `--text-muted` | `#666666` | Muted text |
| `--accent-neon-blue` | `#00f0ff` | Primary accent |
| `--accent-neon-purple` | `#b026ff` | Secondary accent |
| `--accent-amber` | `#fbbf24` | Warnings/highlights |
| `--accent-red` | `#ef4444` | Errors |
| `--accent-green` | `#10b981` | Success |
| `--border-color` | `rgba(255,255,255,0.06)` | Default border |
| `--border-focus` | `rgba(255,255,255,0.3)` | Focus state |

### Tailwind Theme Mapping

```js
// tailwind.config.js
colors: {
  accent: {
    'neon-blue': '#00f0ff',
    'neon-purple': '#b026ff',
    amber: '#fbbf24',
    red: '#ef4444',
    green: '#10b981',
  },
  bg: {
    DEFAULT: '#0a0a0a',
    surface: '#121212',
    elevated: '#1e1e1e',
  },
}
```

### Typography

- **Sans**: Inter (body, UI)
- **Display**: Syne (headings)

### Components

- **Buttons**: `.btn`, `.btn-primary`, `.btn-outline`
- **Cards**: `.card`, `.glass-panel`
- **Inputs**: `.input-field`, `.input-group`
- **Layout**: `.container`, `.section`, `.ai-studio-layout`

### Migration Strategy

1. New components: Prefer Tailwind classes.
2. Existing components: Keep CSS variables; add Tailwind where convenient.
3. Shared tokens: Use `var(--token)` in CSS; Tailwind theme for utilities.
