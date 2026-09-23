# Internationalization (i18n) & Styling Guide

This document explains the multi-language localization system and Tailwind CSS v4 design token architecture in **SinergiMP Maps**.

---

## 1. Internationalization (i18n) Architecture

The application adopts a light, zero-middleware internationalization pattern integrated into Next.js 16 App Router subpaths.

### Supported Locales
- `id`: Bahasa Indonesia (Default)
- `en`: English

Locales and helper utilities are declared in [`src/lib/i18n.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/i18n.ts):

```typescript
export const locales = ['en', 'id'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';
```

### Static Generation (`generateStaticParams`)
In [`src/app/[lang]/layout.tsx`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/app/[lang]/layout.tsx), locales are pre-rendered statically at build time:

```typescript
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}
```

### Type-Safe Dictionaries
Translation dictionaries reside in [`src/lib/dictionaries/`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/dictionaries/):
- **[`en.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/dictionaries/en.ts)**: Acts as the source-of-truth schema:
  ```typescript
  export const en = { /* ... */ };
  export type Dictionary = typeof en;
  ```
- **[`id.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/lib/dictionaries/id.ts)**: Enforces exact key-parity:
  ```typescript
  import { type Dictionary } from './en';
  export const id: Dictionary = { /* ... */ };
  ```

### How to Add a New UI Translation String
1. Add the key and English text in `src/lib/dictionaries/en.ts`.
2. Add the corresponding Indonesian translation in `src/lib/dictionaries/id.ts`.
3. Pass `dict` as a prop down to components from `src/app/[lang]/page.tsx`.

---

## 2. Styling with Tailwind CSS v4

The project uses **Tailwind CSS v4** with a **CSS-first** syntax defined in [`src/app/globals.css`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/app/globals.css).

### Design Tokens & CSS Variables
Custom theme properties are mapped inline via the `@theme inline` block:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  /* ... */
}
```

> [!WARNING]
> **Tailwind v4 Rule**: Do **NOT** use `@apply` with semantic utility classes (such as `@apply border-border` or `@apply bg-background`) inside `@layer base`. Doing so leads to build and post-css compilation errors in Tailwind v4. Use raw CSS custom properties directly instead:
> ```css
> /* Correct */
> body {
>   background-color: var(--background);
>   color: var(--foreground);
> }
> ```

---

## 3. shadcn/ui Component Conventions

Primitive UI components are generated via `shadcn/ui` into `src/components/ui/` (e.g. `Sheet`, `Skeleton`, `ScrollArea`, `Tooltip`).

- **Do Not Modify Directly**: Keep vendor/shadcn files unchanged so they remain upgradable.
- **Customization**: Apply custom styling, spacing, or animation through the `className` prop at invocation points.

---

## 4. Theme Integration (Dark / Light Mode)

Theme switching is powered by `next-themes` and wrapped in `ThemeProvider` ([`src/app/[lang]/layout.tsx`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/app/[lang]/layout.tsx)).

- Toggling themes seamlessly flips CSS custom variables between `:root` (light) and `.dark`.
- Changing themes automatically triggers [`use-map-instance.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-map-instance.ts) to update the Mapbox light preset and swaps the raster image overlay texture in [`use-map-overlay.ts`](file:///Users/upikaachu/Developer/Works/SinergiMP/Maps/src/features/map/hooks/use-map-overlay.ts).
