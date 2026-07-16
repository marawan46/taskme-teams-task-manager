---
version: alpha
name: taskme-design-system
description: TaskMe — a premium team task manager. An evolved-SaaS interface in the spirit of Linear / Height / Vercel — soft-cornered surfaces layered with quiet elevation on a slate-neutral canvas that flips cleanly to a near-black dark mode. An indigo→violet brand pair (#6366f1 → #8b5cf6) carries every primary action and gradient accent; Geist Sans sets the hierarchy with Geist Mono reserved for IDs, dates, and counts. Task cards, Kanban board columns, a persistent sidebar, and a view-switcher (List / Board / Calendar) ride a token-driven system where motion and hover are first-class citizens — everything lifts, tints, and settles with intent.

colors:
  primary: "#6366f1"
  primary-hover: "#4f46e5"
  primary-active: "#4338ca"
  primary-soft: "#eef2ff"
  primary-disabled: "#c7d2fe"
  accent: "#8b5cf6"
  accent-soft: "#f5f3ff"
  gradient-brand: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  gradient-brand-soft: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)"
  ink: "#0f172a"
  body: "#334155"
  body-strong: "#1e293b"
  muted: "#64748b"
  muted-soft: "#94a3b8"
  hairline: "#e2e8f0"
  hairline-strong: "#cbd5e1"
  canvas: "#ffffff"
  surface-soft: "#f8fafc"
  surface-card: "#ffffff"
  surface-sunken: "#f1f5f9"
  surface-strong: "#e2e8f0"
  on-primary: "#ffffff"
  on-accent: "#ffffff"
  dark-canvas: "#0b0b0f"
  dark-surface-soft: "#131318"
  dark-surface-card: "#1a1a22"
  dark-surface-elevated: "#22222c"
  dark-hairline: "#26262f"
  dark-hairline-strong: "#33333f"
  dark-ink: "#f8fafc"
  dark-body: "#cbd5e1"
  dark-muted: "#94a3b8"
  dark-primary: "#818cf8"
  success: "#22c55e"
  success-soft: "#dcfce7"
  warning: "#f59e0b"
  warning-soft: "#fef3c7"
  error: "#ef4444"
  error-soft: "#fee2e2"
  info: "#3b82f6"
  info-soft: "#dbeafe"
  priority-urgent: "#ef4444"
  priority-high: "#f59e0b"
  priority-medium: "#6366f1"
  priority-low: "#94a3b8"

typography:
  display-xl:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "'Geist', sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-md:
    fontFamily: "'Geist', sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.015em
  display-sm:
    fontFamily: "'Geist', sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  title-lg:
    fontFamily: "'Geist', sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  title-md:
    fontFamily: "'Geist', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "'Geist', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "'Geist', sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: "'Geist', sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "'Geist', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "'Geist', sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
  label-uppercase:
    fontFamily: "'Geist', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.6px
    textTransform: uppercase
  button:
    fontFamily: "'Geist', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0.1px
  nav-link:
    fontFamily: "'Geist', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  mono-sm:
    fontFamily: "'Geist Mono', 'SF Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: 13px
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

elevation:
  flat: "none"
  xs: "0 1px 2px rgba(15, 23, 42, 0.06)"
  sm: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)"
  md: "0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)"
  lg: "0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.06)"
  xl: "0 24px 64px rgba(15, 23, 42, 0.16), 0 8px 16px rgba(15, 23, 42, 0.08)"
  inner: "inset 0 1px 2px rgba(15, 23, 42, 0.06)"
  focus-ring: "0 0 0 3px rgba(99, 102, 241, 0.35)"
  focus-ring-error: "0 0 0 3px rgba(239, 68, 68, 0.30)"
  dark-sm: "0 1px 3px rgba(0, 0, 0, 0.40)"
  dark-md: "0 4px 12px rgba(0, 0, 0, 0.45)"
  dark-lg: "0 12px 32px rgba(0, 0, 0, 0.55)"

motion:
  duration-instant: 80ms
  duration-fast: 120ms
  duration-base: 180ms
  duration-slow: 240ms
  duration-slower: 320ms
  ease-standard: "cubic-bezier(0.2, 0, 0, 1)"
  ease-decelerate: "cubic-bezier(0, 0, 0, 1)"
  ease-accelerate: "cubic-bezier(0.3, 0, 1, 1)"
  ease-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  transition-colors: "color, background-color, border-color 120ms cubic-bezier(0.2, 0, 0, 1)"
  transition-hover-lift: "transform 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)"
  transition-fade: "opacity 180ms cubic-bezier(0.2, 0, 0, 1)"
  transition-scale-in: "transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms cubic-bezier(0.2, 0, 0, 1)"

components:
  top-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    height: 56px
    elevation: "{elevation.xs}"
  sidebar:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    width: 260px
  sidebar-item:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    transition: "{motion.transition-colors}"
    hover: "background {colors.surface-sunken}"
  sidebar-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-active}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
    elevation: "{elevation.xs}"
    transition: "{motion.transition-hover-lift}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    elevation: "{elevation.md}"
    transform: "translateY(-1px)"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    elevation: "{elevation.xs}"
    transform: "translateY(0)"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    elevation: "{elevation.flat}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 17px
    height: 40px
    borderColor: "{colors.hairline-strong}"
    transition: "{motion.transition-colors}"
    hover: "background {colors.surface-soft}, border {colors.muted-soft}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 14px
    hover: "background {colors.surface-sunken}"
  button-icon:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: 8px
    height: 36px
    width: 36px
    transition: "{motion.transition-colors}"
    hover: "background {colors.surface-sunken}, color {colors.ink}"
  button-text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    hover: "color {colors.primary-hover}, underline"
  task-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    rounded: "{rounded.lg}"
    padding: 14px 16px
    borderColor: "{colors.hairline}"
    elevation: "{elevation.sm}"
    transition: "{motion.transition-hover-lift}"
  task-card-hover:
    elevation: "{elevation.lg}"
    transform: "translateY(-2px)"
    borderColor: "{colors.hairline-strong}"
  board-column:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.body}"
    rounded: "{rounded.xl}"
    padding: 12px
    width: 300px
  board-column-header:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.label-uppercase}"
    padding: 4px 8px 12px
  list-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px 16px
    borderColor: "{colors.hairline}"
    transition: "{motion.transition-colors}"
    hover: "background {colors.surface-soft}"
  checkbox:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline-strong}"
    rounded: "{rounded.sm}"
    height: 18px
    width: 18px
    transition: "{motion.transition-colors}"
    hover: "border {colors.primary}"
  checkbox-checked:
    backgroundColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    transition: "{motion.transition-scale-in}"
  avatar:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.body-strong}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    height: 28px
    width: 28px
  avatar-group:
    rounded: "{rounded.full}"
  badge:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
  status-badge:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
  priority-flag:
    backgroundColor: transparent
    textColor: "{colors.priority-high}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
  label-chip:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-active}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
    transition: "{motion.transition-colors}"
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
    borderColor: "{colors.hairline-strong}"
    transition: "{motion.transition-colors}"
    hover: "border {colors.primary}, color {colors.primary}"
  filter-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  view-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 6px 12px
    transition: "{motion.transition-colors}"
    hover: "color {colors.ink}, background {colors.surface-sunken}"
  view-tab-active:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 6px 12px
    elevation: "{elevation.xs}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
    borderColor: "{colors.hairline-strong}"
    transition: "{motion.transition-colors}"
    focus: "border {colors.primary}, elevation {elevation.focus-ring}"
  textarea:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 14px
    borderColor: "{colors.hairline-strong}"
    focus: "border {colors.primary}, elevation {elevation.focus-ring}"
  search-input:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 12px 8px 36px
    height: 36px
    focus: "background {colors.canvas}, elevation {elevation.focus-ring}"
  select:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    height: 40px
    borderColor: "{colors.hairline-strong}"
  dropdown-menu:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 6px
    borderColor: "{colors.hairline}"
    elevation: "{elevation.lg}"
    transition: "{motion.transition-scale-in}"
  dropdown-item:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 8px 10px
    hover: "background {colors.surface-sunken}"
  modal:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 24px
    elevation: "{elevation.xl}"
    transition: "{motion.transition-scale-in}"
  modal-overlay:
    backgroundColor: "rgba(15, 23, 42, 0.45)"
    transition: "{motion.transition-fade}"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
    elevation: "{elevation.lg}"
    transition: "{motion.transition-scale-in}"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: 6px 8px
    elevation: "{elevation.md}"
    transition: "{motion.transition-fade}"
  progress-bar:
    backgroundColor: "{colors.surface-sunken}"
    fillColor: "{colors.gradient-brand}"
    rounded: "{rounded.pill}"
    height: 6px
    transition: "width 320ms cubic-bezier(0.2, 0, 0, 1)"
  hero:
    backgroundColor: "{colors.gradient-brand-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    rounded: "{rounded.none}"
    padding: 96px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.xl}"
    padding: 24px
    borderColor: "{colors.hairline}"
    elevation: "{elevation.sm}"
    transition: "{motion.transition-hover-lift}"
    hover: "elevation {elevation.lg}, translateY(-4px)"
  cta-band:
    backgroundColor: "{colors.gradient-brand}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    rounded: "{rounded.2xl}"
    padding: 64px
  footer:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 64px
---

## Overview

TaskMe carries a **premium, evolved-SaaS** interface — the calm, product-focused dialect of tools like Linear, Height, and Vercel. The atmosphere is light and layered: `{colors.canvas}` (#ffffff) holds primary content, `{colors.surface-soft}` (#f8fafc) sits behind the sidebar and footer, and `{colors.surface-sunken}` (#f1f5f9) forms the recessed track a Kanban board's columns rest in. The whole system flips to a near-black dark mode (`{colors.dark-canvas}` — #0b0b0f) where the same relationships hold, only inverted.

Type runs on **Geist** — the family already loaded in `app/layout.tsx` via `next/font`. Geist Sans sets the entire visible hierarchy (weight 700 for display, 600 for titles/buttons, 400–500 for body and nav), and **Geist Mono** is held back for the machine-facing details a task manager accumulates: task IDs, timestamps, due dates, and counts. Display type tightens with negative tracking (down to −0.02em) — the crisp, engineered signature of the premium-SaaS voice.

The brand action pair is an **indigo→violet gradient**: `{colors.primary}` (#6366f1) does the solid-fill work on every primary CTA, while the `{colors.gradient-brand}` sweep (#6366f1 → #8b5cf6) appears on the marketing hero, the CTA band, and the progress-bar fill. A single primary color anchors the UI; the gradient is a treat, not a default.

Unlike a flat corporate system, **depth is deliberate here**. Surfaces are separated by a five-step soft-shadow scale (`{elevation.xs}`–`{elevation.xl}`), corners are soft (`{rounded.md}`–`{rounded.xl}`), and **motion and hover are first-class** — cards lift, buttons settle, menus scale in, checkboxes spring. Every interactive surface has a documented resting and hover state.

**Key Characteristics:**
- Light, layered surfaces: `{colors.canvas}` content · `{colors.surface-soft}` chrome · `{colors.surface-sunken}` recessed board track — with a full near-black dark mode.
- Indigo `{colors.primary}` (#6366f1) is the single solid action color; the `{colors.gradient-brand}` sweep is reserved for hero, CTA band, and progress fill.
- Geist Sans across the hierarchy; Geist Mono for IDs, dates, and counts.
- Soft radii (`{rounded.md}`–`{rounded.xl}`) — never sharp 0px on interactive surfaces; pill for chips and badges.
- Depth from **layered soft shadows** (`{elevation.*}`), not color-block contrast.
- **Motion and hover are documented per component** — hover-lift on cards, tint on chips, spring on checkboxes, scale-in on overlays.
- Task-manager core: task-card, board-column, sidebar, view-switcher (List / Board / Calendar), priority + label chips, avatar groups.
- `prefers-reduced-motion` is honored throughout — transforms and scale-ins degrade to instant.

## Colors

### Brand & Accent
- **Primary (Indigo)** (`{colors.primary}` — #6366f1): The single solid brand action color. All primary CTAs, active nav/sidebar states, selected checkboxes, focus rings. Hover shifts to `{colors.primary-hover}` (#4f46e5); press to `{colors.primary-active}` (#4338ca).
- **Primary Soft** (`{colors.primary-soft}` — #eef2ff): Tinted background for active sidebar items, label chips, and selected tiles.
- **Accent (Violet)** (`{colors.accent}` — #8b5cf6): The second stop in the brand gradient. Rarely used as a solid; lives inside `{colors.gradient-brand}`.
- **Brand Gradient** (`{colors.gradient-brand}` — 135° #6366f1 → #8b5cf6): The premium sweep. Marketing hero, `{component.cta-band}`, `{component.progress-bar}` fill. Never on a standard in-app button.

### Surface (Light)
- **Canvas** (`{colors.canvas}` — #ffffff): Primary content surface — task lists, cards, modals.
- **Surface Soft** (`{colors.surface-soft}` — #f8fafc): The sidebar, footer, and search-input rest state.
- **Surface Card** (`{colors.surface-card}` — #ffffff): Explicit card fill (equals canvas, named for intent).
- **Surface Sunken** (`{colors.surface-sunken}` — #f1f5f9): The recessed track behind Kanban columns, hover fills, badge backgrounds.
- **Surface Strong** (`{colors.surface-strong}` — #e2e8f0): Avatar placeholders, heavier dividers.

### Surface (Dark Mode)
- **Dark Canvas** (`{colors.dark-canvas}` — #0b0b0f) → **Surface Soft** (`{colors.dark-surface-soft}` — #131318) → **Surface Card** (`{colors.dark-surface-card}` — #1a1a22) → **Surface Elevated** (`{colors.dark-surface-elevated}` — #22222c). Elevation in dark mode is expressed by stepping *lighter*, reinforced by the deeper `{elevation.dark-*}` shadows.
- In dark mode, primary brightens to `{colors.dark-primary}` (#818cf8) so it stays legible on near-black.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e2e8f0): The default 1px divider — card borders, list-row separators, dropdown outline.
- **Hairline Strong** (`{colors.hairline-strong}` — #cbd5e1): Input outlines, secondary-button borders, hover-emphasized card edges.
- Dark mode: `{colors.dark-hairline}` (#26262f) / `{colors.dark-hairline-strong}` (#33333f).

### Text
- **Ink** (`{colors.ink}` — #0f172a): Display and primary text; toast/tooltip fills.
- **Body** (`{colors.body}` — #334155): Default running text.
- **Body Strong** (`{colors.body-strong}` — #1e293b): Emphasized copy, avatar initials.
- **Muted** (`{colors.muted}` — #64748b): Secondary labels, meta, placeholder text, resting icons.
- **Muted Soft** (`{colors.muted-soft}` — #94a3b8): Disabled text, fine print.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text on a filled primary button or gradient.

### Semantic
Each semantic color ships with a **soft-tint pair** for badges and callouts (solid on light-tint):
- **Success** (`{colors.success}` — #22c55e / `{colors.success-soft}` — #dcfce7): Completed / on-track.
- **Warning** (`{colors.warning}` — #f59e0b / `{colors.warning-soft}` — #fef3c7): Approaching due, needs attention.
- **Error** (`{colors.error}` — #ef4444 / `{colors.error-soft}` — #fee2e2): Overdue, validation errors.
- **Info** (`{colors.info}` — #3b82f6 / `{colors.info-soft}` — #dbeafe): Neutral informational callouts.

### Priority
Task priority reads at a glance via a dedicated ramp — used on `{component.priority-flag}` and left-border accents:
- **Urgent** (`{colors.priority-urgent}` — #ef4444) · **High** (`{colors.priority-high}` — #f59e0b) · **Medium** (`{colors.priority-medium}` — #6366f1) · **Low** (`{colors.priority-low}` — #94a3b8).

## Typography

### Font Family
The system runs **Geist** (Geist Sans) for everything visible and **Geist Mono** for machine-facing values. Both are already wired into the app through `next/font/google` in `app/layout.tsx` as `--font-geist-sans` and `--font-geist-mono`. Fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The split is functional:
- Geist Sans 700 → display headlines
- Geist Sans 600 → titles, buttons, active tabs, uppercase labels
- Geist Sans 400–500 → body, nav, captions
- Geist Mono 450 → task IDs (`TSK-142`), timestamps, due dates, counts

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 56px | 700 | 1.05 | −0.02em | Marketing hero h1 |
| `{typography.display-lg}` | 40px | 700 | 1.1 | −0.02em | Page / section heads |
| `{typography.display-md}` | 32px | 700 | 1.15 | −0.015em | CTA-band headline, empty-state |
| `{typography.display-sm}` | 24px | 600 | 1.25 | −0.01em | Modal titles, project name |
| `{typography.title-lg}` | 20px | 600 | 1.3 | −0.01em | Board column group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Feature-card head, section subhead |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | Task-card title, list-row title |
| `{typography.body-lg}` | 17px | 400 | 1.6 | 0 | Marketing lead paragraph |
| `{typography.body-md}` | 15px | 400 | 1.6 | 0 | Default in-app body, inputs |
| `{typography.body-sm}` | 13px | 400 | 1.55 | 0 | Secondary copy, footer |
| `{typography.caption}` | 12px | 500 | 1.4 | 0.2px | Meta, badge text, avatar initials |
| `{typography.label-uppercase}` | 12px | 600 | 1.3 | 0.6px | Column headers, section eyebrows |
| `{typography.button}` | 14px | 600 | 1.0 | 0.1px | Button + tab labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-bar + sidebar items |
| `{typography.mono-sm}` | 13px | 450 | 1.5 | 0 | Task IDs, dates, counts (Geist Mono) |

### Principles
- **Display tightens, body relaxes.** Negative tracking (−0.01 to −0.02em) on display type is the premium-SaaS signature; body stays at 0 for readability.
- **Weight 600 is the workhorse.** Titles, buttons, and tabs sit at 600; 700 is reserved for display headlines only.
- **Mono is a signal, not decoration.** Geist Mono marks values that are machine-generated or precise — IDs, timestamps, counts — and never sets running prose.
- **Uppercase labels are quiet.** `{typography.label-uppercase}` (0.6px tracking) marks column headers and eyebrows — restrained, not shouty.

### Note on Fonts
Geist is Vercel's open-source family and ships with the app — no substitution needed. If Geist is ever unavailable, **Inter** (variable) is the closest drop-in at the same weights; leave display tracking at −0.02em.

## Layout

### Spacing System
- **Base unit:** 8px (with a 4px half-step for dense in-app UI).
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **In-app density:** cards pad at `{spacing.md}` (16px) or 14px; board columns at `{spacing.sm}` (12px). The product UI is denser than the marketing pages.
- **Marketing rhythm:** major landing bands hold `{spacing.section}` (96px).

### Grid & Container
- **App shell:** fixed `{component.sidebar}` (260px) + fluid content region; `{component.top-bar}` (56px) spans the content region.
- **Board view:** horizontally scrolling row of `{component.board-column}` (300px each), sitting on the `{colors.surface-sunken}` track.
- **List view:** single-column stack of `{component.list-row}`, full content width, ~1200px max.
- **Marketing:** 12-column grid, ~1200px max content width, centered.

### Whitespace Philosophy
Two densities coexist. The **product UI** is efficient — tight card padding, 12–16px gaps, so more tasks fit on screen. The **marketing surface** breathes at 96px section rhythm. Never mix the two: an in-app modal uses in-app density, not marketing spacing.

## Elevation & Depth

Depth is expressed through a **layered soft-shadow scale** — a deliberate break from a flat corporate system. Shadows are low-opacity and cool-tinted (slate), never hard.

| Token | Value | Use |
|---|---|---|
| `{elevation.flat}` | none | Body text, sidebar items, list rows at rest |
| `{elevation.xs}` | 0 1px 2px | Top bar, resting buttons, active view-tab |
| `{elevation.sm}` | 0 1px 3px + 0 1px 2px | Task cards, feature cards at rest |
| `{elevation.md}` | 0 4px 12px | Button hover, tooltips |
| `{elevation.lg}` | 0 12px 32px | Dropdowns, toasts, card hover, popovers |
| `{elevation.xl}` | 0 24px 64px | Modals / dialogs |
| `{elevation.inner}` | inset 0 1px 2px | Sunken tracks, pressed toggles |

Two focus tokens back accessible keyboard states: `{elevation.focus-ring}` (3px indigo glow) on inputs and focusable controls, and `{elevation.focus-ring-error}` (3px red glow) on invalid fields.

**Dark mode** uses deeper shadows (`{elevation.dark-sm}`–`{elevation.dark-lg}`, up to 0.55 alpha) *plus* a lighter surface step, since shadow alone reads weakly on near-black.

### Brand Accent
- **Gradient sweep** — `{colors.gradient-brand}` (indigo→violet) is the decorative depth device: the marketing hero wash, the `{component.cta-band}` fill, the `{component.progress-bar}` fill. It is never applied to a standard in-app control.
- **Priority left-border** — a 3px `{colors.priority-*}` bar on a `{component.task-card}`'s leading edge encodes urgency without adding chrome.

## Motion & Transitions

Motion is a documented, first-class layer — the premium feel comes from surfaces that *settle* rather than snap.

### Durations
`{motion.duration-instant}` 80ms · `{motion.duration-fast}` 120ms · `{motion.duration-base}` 180ms · `{motion.duration-slow}` 240ms · `{motion.duration-slower}` 320ms.

- **Instant/fast (80–120ms):** color, background, and border changes — hover tints, focus.
- **Base (180ms):** the default for transforms, opacity, hover-lift.
- **Slow/slower (240–320ms):** entrances (modals, dropdowns, toasts) and progress-bar fills.

### Easings
| Token | Curve | Use |
|---|---|---|
| `{motion.ease-standard}` | cubic-bezier(0.2, 0, 0, 1) | Default — hovers, most transitions |
| `{motion.ease-decelerate}` | cubic-bezier(0, 0, 0, 1) | Elements entering the screen |
| `{motion.ease-accelerate}` | cubic-bezier(0.3, 0, 1, 1) | Elements leaving the screen |
| `{motion.ease-spring}` | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful settle — checkbox check, modal/dropdown scale-in |

### Named Transitions
- **`{motion.transition-colors}`** — 120ms color/background/border. The baseline for every hover tint and focus change.
- **`{motion.transition-hover-lift}`** — 180ms transform + box-shadow. Cards and buttons rise on hover.
- **`{motion.transition-fade}`** — 180ms opacity. Overlays, tooltips.
- **`{motion.transition-scale-in}`** — 240ms spring transform + 180ms fade. Menus, modals, toasts enter from ~0.96 scale + 0 opacity.

### Reduced Motion
Under `prefers-reduced-motion: reduce`, **all transforms and scale-ins collapse to opacity-only fades at `{motion.duration-fast}`** — no translate, no spring, no lift. Color and focus transitions remain. Motion is enhancement, never a gate on function.

## Interaction & Hover States

Every interactive surface defines a **resting** state and a **hover/active** state. The three canonical hover moves:

1. **Lift** (cards, buttons) — elevation grows one step and the element rises: `{component.task-card}` → `{component.task-card-hover}` (`{elevation.lg}` + `translateY(-2px)`); `{component.button-primary}` → `{component.button-primary-hover}` (`{elevation.md}` + `translateY(-1px)`); `{component.feature-card}` lifts 4px.
2. **Tint** (chips, nav, rows, ghost/icon buttons) — background or border shifts toward the brand or a soft surface: `{component.sidebar-item}` and `{component.list-row}` fill `{colors.surface-sunken}`; `{component.filter-chip}` borders and colors indigo; `{component.button-icon}` fills sunken and darkens to ink.
3. **Spring** (selection + entrances) — `{component.checkbox}` → `{component.checkbox-checked}` scales the checkmark in via `{motion.ease-spring}`; dropdowns, modals, and toasts enter with `{motion.transition-scale-in}`.

**Active/press** reverses the lift — `{component.button-primary-active}` drops back to `translateY(0)` and `{elevation.xs}`, giving a physical "push" feel.

**Focus** is never removed, only restyled: `{elevation.focus-ring}` (indigo) on inputs, buttons, checkboxes, and menu items; `{elevation.focus-ring-error}` on invalid fields.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands (hero, footer), list-row separators |
| `{rounded.xs}` | 4px | Progress fills, tiny inline markers |
| `{rounded.sm}` | 6px | Checkbox, tooltip, dropdown item |
| `{rounded.md}` | 8px | Buttons, inputs, selects, sidebar items, view tabs — the workhorse |
| `{rounded.lg}` | 12px | Task cards, dropdown menu, toast |
| `{rounded.xl}` | 16px | Board columns, feature cards, modals |
| `{rounded.2xl}` | 24px | CTA band, large marketing surfaces |
| `{rounded.pill}` | 9999px | Chips, badges, labels |
| `{rounded.full}` | 9999px / 50% | Avatars, circular icon buttons |

The radius scales *with the size of the surface* — small controls at 6–8px, cards at 12–16px, big marketing blocks at 24px. Chips and avatars are fully round. This graduated softness is the premium-SaaS shape language.

## Components

### App Shell

**`top-bar`** — A slim 56px app header on `{colors.canvas}` with a bottom `{elevation.xs}` shadow. Holds the current view title, a centered `{component.search-input}`, and right-aligned notification `{component.button-icon}` + profile `{component.avatar}`.

**`sidebar`** — A 260px fixed rail on `{colors.surface-soft}`. Workspace switcher at top, then navigation and project lists as `{component.sidebar-item}`s. In dark mode it steps to `{colors.dark-surface-soft}`.

**`sidebar-item`** / **`sidebar-item-active`** — Nav rows in `{typography.nav-link}`, `{rounded.md}`, 8px×12px padding. Rest: transparent. Hover: `{colors.surface-sunken}` fill via `{motion.transition-colors}`. Active: `{colors.primary-soft}` fill with `{colors.primary-active}` text.

### Buttons

**`button-primary`** — The signature CTA. `{colors.primary}` fill, `{colors.on-primary}` text, `{typography.button}`, `{rounded.md}`, 10px×18px padding, 40px tall, resting `{elevation.xs}`. **Hover** (`button-primary-hover`): `{colors.primary-hover}` + `{elevation.md}` + `translateY(-1px)`. **Active**: `{colors.primary-active}`, back to `translateY(0)`. **Disabled**: `{colors.primary-disabled}`, flat.

**`button-secondary`** — `{colors.canvas}` fill, `{colors.ink}` text, 1px `{colors.hairline-strong}` border. Hover fills `{colors.surface-soft}` and darkens the border.

**`button-ghost`** — Transparent, `{colors.body}` text. Hover fills `{colors.surface-sunken}`. For low-emphasis inline actions.

**`button-icon`** — Square 36px, `{rounded.md}`, `{colors.muted}` glyph. Hover fills `{colors.surface-sunken}` and darkens to `{colors.ink}`.

**`button-text-link`** — Inline `{colors.primary}` link, no fill; hover shifts to `{colors.primary-hover}` and underlines.

### Task & Board

**`task-card`** — The core unit. `{colors.surface-card}` on a 1px `{colors.hairline}` border, `{rounded.lg}`, 14px×16px padding, resting `{elevation.sm}`. Contents: `{component.checkbox}` + title (`{typography.title-sm}`), a row of `{component.label-chip}`s, a `{component.priority-flag}`, a due date in `{typography.mono-sm}`, and an `{component.avatar-group}` of assignees. A 3px `{colors.priority-*}` left border encodes urgency. **Hover** (`task-card-hover`): rises to `{elevation.lg}` + `translateY(-2px)` with a stronger border, via `{motion.transition-hover-lift}`.

**`board-column`** — A Kanban column: `{colors.surface-sunken}` fill, `{rounded.xl}`, 12px padding, 300px wide, holding a stack of task cards. Header (`board-column-header`) is a `{typography.label-uppercase}` title + count badge.

**`list-row`** — The List-view alternative to a card: full-width row on `{colors.canvas}`, 12px×16px padding, `{colors.hairline}` bottom border, `{rounded.none}`. Hover fills `{colors.surface-soft}`.

**`checkbox`** / **`checkbox-checked`** — 18px, `{rounded.sm}`, 1px `{colors.hairline-strong}` border at rest; hover borders `{colors.primary}`. Checked: `{colors.primary}` fill with a white check that **springs in** via `{motion.transition-scale-in}`.

### People & Status

**`avatar`** / **`avatar-group`** — 28px circular (`{rounded.full}`) member marker: photo, or initials in `{typography.caption}` on `{colors.surface-strong}`. Groups overlap with a 2px canvas ring and a "+N" overflow chip.

**`badge`** — Neutral pill counter: `{colors.surface-sunken}` fill, `{colors.body}` text, `{typography.caption}`, `{rounded.pill}`.

**`status-badge`** — Semantic pill using a soft-tint pair, e.g. `{colors.success-soft}` fill + `{colors.success}` text for "Done".

**`priority-flag`** — A small flag/icon tinted from the priority ramp (`{colors.priority-urgent}` … `{colors.priority-low}`) with a `{typography.caption}` label.

**`label-chip`** — A task tag: `{colors.primary-soft}` fill, `{colors.primary-active}` text, `{rounded.pill}`. (Category labels may swap in other soft-tint pairs.)

### Filters & Views

**`filter-chip`** / **`filter-chip-active`** — Board/list filters. Inactive: `{colors.canvas}`, 1px `{colors.hairline-strong}` border, `{typography.caption}`; hover borders and colors `{colors.primary}`. Active: `{colors.primary}` fill, white text. `{rounded.pill}`.

**`view-tab`** / **`view-tab-active`** — The **List / Board / Calendar** switcher. Inactive: transparent, `{colors.muted}`; hover colors `{colors.ink}` + `{colors.surface-sunken}` fill. Active: `{colors.canvas}` fill with `{elevation.xs}`, `{colors.ink}` text — a segmented-control look.

### Inputs & Forms

**`text-input`** / **`textarea`** — `{colors.canvas}` fill, 1px `{colors.hairline-strong}` border, `{rounded.md}`, `{typography.body-md}`. **Focus**: border shifts to `{colors.primary}` and gains `{elevation.focus-ring}`. Invalid state swaps in `{elevation.focus-ring-error}`.

**`search-input`** — A softer, borderless variant on `{colors.surface-soft}` with a leading search glyph (36px left padding). On focus it brightens to `{colors.canvas}` and gains the focus ring.

**`select`** — Matches `{component.text-input}` with a trailing chevron.

### Overlays

**`dropdown-menu`** / **`dropdown-item`** — Menu surface: `{colors.canvas}`, `{rounded.lg}`, 6px padding, 1px `{colors.hairline}`, `{elevation.lg}`; **scales in** via `{motion.transition-scale-in}`. Items are `{rounded.sm}` rows that fill `{colors.surface-sunken}` on hover.

**`modal`** / **`modal-overlay`** — The task-detail / create dialog: `{colors.canvas}`, `{rounded.xl}`, 24px padding, `{elevation.xl}`, entering with a spring `{motion.transition-scale-in}` over a `rgba(15,23,42,0.45)` overlay that fades in.

**`toast`** — Transient notification: `{colors.ink}` fill, white text, `{rounded.lg}`, `{elevation.lg}`; slides/scales in and auto-dismisses.

**`tooltip`** — `{colors.ink}` fill, white `{typography.caption}`, `{rounded.sm}`, `{elevation.md}`; fades in on hover after a short delay.

**`progress-bar`** — Project/checklist progress: 6px track on `{colors.surface-sunken}`, `{rounded.pill}`, filled with the `{colors.gradient-brand}` sweep. The fill width animates over 320ms `{motion.ease-standard}`.

### Marketing

**`hero`** — The landing headline band: a soft `{colors.gradient-brand-soft}` wash, `{typography.display-xl}` headline (−0.02em), lead paragraph in `{typography.body-lg}`, and a `{component.button-primary}`. 96px padding.

**`feature-card`** — A capability card: `{colors.surface-card}`, `{rounded.xl}`, 24px padding, `{elevation.sm}`; hover lifts 4px to `{elevation.lg}`.

**`cta-band`** — The pre-footer conversion band: full `{colors.gradient-brand}` fill, white `{typography.display-md}` headline, `{rounded.2xl}`, 64px padding.

**`footer`** — Closing band on `{colors.surface-soft}`, `{colors.body}` text, a multi-column link list, 64px padding, with a copyright line in `{typography.body-sm}` + `{colors.muted}`.

## Do's and Don'ts

### Do
- Sit product content on `{colors.canvas}`, chrome on `{colors.surface-soft}`, and recessed board tracks on `{colors.surface-sunken}`.
- Use `{colors.primary}` (indigo) as the single solid action color; reserve the `{colors.gradient-brand}` sweep for hero, CTA band, and progress fill.
- Set display in Geist 700 with tight tracking (−0.02em); keep body at 0 tracking for readability.
- Reserve Geist Mono for machine-facing values — task IDs, dates, counts — never running prose.
- Give every interactive surface a documented hover state: **lift** cards/buttons, **tint** chips/rows, **spring** selections and entrances.
- Encode urgency with the priority ramp — a 3px `{colors.priority-*}` left border on task cards plus a `{component.priority-flag}`.
- Scale radius to surface size: 6–8px controls, 12–16px cards, 24px marketing blocks.
- Honor `prefers-reduced-motion` — degrade transforms and scale-ins to opacity fades.
- Support dark mode by stepping surfaces *lighter* (`{colors.dark-canvas}` → elevated) and shadows *deeper*.

### Don't
- Don't introduce a third brand hue — indigo + its violet gradient partner are the whole palette.
- Don't paint standard in-app buttons with the gradient — solid `{colors.primary}` only; the gradient is reserved.
- Don't use sharp 0px corners on interactive surfaces — soft radii are the shape signature (0px only for full-bleed bands and list separators).
- Don't remove focus outlines — restyle them to `{elevation.focus-ring}`, never `outline: none` alone.
- Don't flatten depth to a single shadow — use the graduated `{elevation.*}` scale so rest / hover / overlay read as distinct layers.
- Don't animate layout-shifting properties (width/height/top) for hover — animate `transform` and `box-shadow` so motion stays at 60fps.
- Don't mix marketing spacing into the product UI — in-app density is tighter than the 96px landing rhythm.
- Don't set body copy in Geist Mono or in weight 700 — Mono is for values, 700 is for display only.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Sidebar collapses to a slide-over sheet (hamburger in top bar); Board view scrolls one column at a time; task cards go 1-up; hero h1 56→32px; footer columns → 1 |
| Tablet | 768–1024px | Sidebar becomes an icon rail (collapsible); Board shows 2–3 columns; List view full-width |
| Desktop | 1024–1440px | Full 260px sidebar + top bar; Board scrolls horizontally; view-switcher inline |
| Wide | > 1440px | Same as desktop; marketing content fixed at ~1200px, product region fills available width |

### Touch Targets
- `{component.button-primary}` and `{component.text-input}` are 40px tall; on touch, tappable rows and controls pad to a ≥44px effective target.
- `{component.button-icon}` is 36px visual with a ≥44px hit area on touch.
- `{component.checkbox}` (18px visual) carries a 40px tap padding on touch.

### Collapsing Strategy
- Sidebar: full rail → icon rail (tablet) → off-canvas sheet (mobile), animated with `{motion.transition-scale-in}`/slide.
- Board: horizontal scroll on desktop → snap-scroll single column on mobile.
- View-switcher tabs stay inline; the search input collapses to an icon that expands on tap.
- Modals go full-screen below 768px (edge-to-edge, `{rounded.none}` top).

### Motion at Breakpoints
- Hover-lift effects are pointer-only; on touch they are replaced by an active/pressed tint (no hover state on touch).
- Entrance animations (`{motion.transition-scale-in}`) hold across breakpoints but respect `prefers-reduced-motion` everywhere.

## Iteration Guide

1. Focus on a single component. Reference its YAML key directly (`{component.task-card}`, `{component.button-primary}`).
2. New interactive components default to `{rounded.md}` (8px); cards to `{rounded.lg}`/`{rounded.xl}`; chips/avatars to `{rounded.pill}`/`{rounded.full}`.
3. Every new interactive component MUST define a resting state, a hover state, and a focus state. Hover is one of: lift, tint, or spring.
4. Variants (`-hover`, `-active`, `-disabled`, `-selected`) live as separate entries inside the `components:` block.
5. `{token.refs}` everywhere — never inline hex, shadow, duration, or easing values.
6. Elevation must map to the `{elevation.*}` scale by role (rest → sm, hover → lg, overlay → xl); don't invent one-off shadows.
7. Motion uses the `{motion.*}` tokens; new transitions compose duration + easing tokens rather than raw values.
8. Every visual token needs a dark-mode counterpart or a documented rule (surfaces step lighter, shadows deepen).
9. Display stays Geist 700; body Geist 400–500; values Geist Mono — the trio is fixed.

## Known Gaps

- **Dark-mode component values** are described as rules (step lighter, deepen shadows) rather than enumerated per component; a full dark token map is the next extraction.
- **Calendar view** is named in the view-switcher but its cell/event components are not yet specified — it needs a dedicated pass (month/week grid, event chips, drag targets).
- **Drag-and-drop** affordances for the Kanban board (drag handle, drop placeholder, ghost card, auto-scroll) are referenced but not fully tokenized.
- **Empty, loading, and error states** (skeleton cards, zero-task columns, offline banner) are only implied; each surface needs its own resting variant.
- **Data-density mode** (a compact toggle common to pro task managers) would introduce a second spacing scale not covered here.
- **Geist** ships with the app via `next/font`; Inter is documented as the only sanctioned fallback if the family is ever swapped out.
