# CLAUDE.md — Slab Sight

## Project Overview

**Slab QC Viewer** is a quality-control visualization tool for stone/slab products (marble, granite, porcelain, etc.). Users browse a catalog of 40+ products, filter by format/size, and view slab faces in sequential (grid or strip) and book-match layouts. It is a fully static single-page application with no backend.

## Tech Stack

- **Framework:** React 18 + TypeScript 5
- **Build Tool:** Vite 5 (SWC compiler via `@vitejs/plugin-react-swc`)
- **Styling:** Tailwind CSS 3 with CSS variables (HSL color tokens)
- **Component Library:** shadcn/ui (Radix UI primitives, `src/components/ui/`)
- **Routing:** React Router 6 (BrowserRouter)
- **State:** Local React state (useState/useMemo). React Query is available but currently unused for data fetching.
- **Icons:** Lucide React
- **Testing:** Vitest + Testing Library + jsdom
- **Linting:** ESLint 9 (flat config) with typescript-eslint, react-hooks, react-refresh plugins
- **Deployment:** GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Repository Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (do not edit manually — managed by shadcn CLI)
│   ├── SearchBar.tsx     # Product search input
│   ├── FormatFilter.tsx  # Format/size filter chips
│   ├── ProductCard.tsx   # Catalog card for a single product
│   ├── ProductViewer.tsx # Detail view with format selector + view mode toggle
│   ├── GridView.tsx      # Grid layout for smaller-format faces
│   ├── StripView.tsx     # Horizontal strip layout for large-format faces
│   ├── BookMatchView.tsx # Mirrored book-match pair layout
│   ├── Breadcrumbs.tsx   # Navigation breadcrumbs
│   └── NavLink.tsx       # Navigation link helper
├── pages/
│   ├── Index.tsx         # Main catalog page (search, filter, product grid)
│   └── NotFound.tsx      # 404 page
├── data/
│   └── products.ts       # Product definitions, types, and format configs
├── hooks/
│   ├── use-mobile.tsx    # useIsMobile hook (breakpoint at 768px)
│   └── use-toast.ts      # Toast notification hook
├── lib/
│   └── utils.ts          # Utility functions (cn for Tailwind class merging)
├── test/
│   ├── setup.ts          # Vitest setup (jest-dom matchers, matchMedia polyfill)
│   └── example.test.ts   # Example test
├── App.tsx               # Root component (providers + routes)
├── main.tsx              # Entry point (React DOM render)
└── index.css             # Global styles + Tailwind directives + CSS variables

public/
└── images/               # Product images organized by product/format/
    └── {product-id}/
        ├── thumb.jpg     # Product thumbnail
        └── {format}/     # e.g., 120x280/, 60x60/
            └── F{n}.jpg  # Numbered face images (F1.jpg, F2.jpg, ...)
```

## Commands

```bash
npm run dev          # Start dev server (localhost:8080)
npm run build        # Production build (outputs to dist/)
npm run build:dev    # Development build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run test         # Run tests once (vitest run)
npm run test:watch   # Run tests in watch mode (vitest)
```

## Key Data Model

Defined in `src/data/products.ts`:

```typescript
type ProductFormat = "120x280" | "160x320" | "120x120" | "90x180" | "60x120" | "60x60" | "30x60";

interface ProductSize {
  format: ProductFormat;
  faceCount: number;
  faces: string[];       // Array of image paths: /images/{id}/{format}/F{n}.jpg
}

interface Product {
  id: string;
  name: string;
  collection: string;
  thumbnail: string;     // /images/{id}/thumb.jpg
  sizes: ProductSize[];
  bookMatch: boolean;
}

interface FormatConfig {
  label: string;
  layout: "strip" | "grid";
  columns?: number;       // For grid layout
  rows?: number;          // For grid layout
  aspectRatio: number;
}
```

- **Strip layout** (`120x280`, `160x320`, `90x180`): Faces shown in horizontal scroll.
- **Grid layout** (`120x120`, `60x120`, `60x60`, `30x60`): Faces shown in a fixed columns×rows grid.
- **Book-match**: Available per-product (`bookMatch: true`). Shows mirrored/flipped face pairs.

## Architecture & Patterns

### Component Organization
- **Page components** in `src/pages/` — full views routed by React Router.
- **Feature components** in `src/components/` — product-specific UI (ProductCard, ProductViewer, views).
- **UI primitives** in `src/components/ui/` — shadcn/ui components. Do not hand-edit; add new ones with `npx shadcn-ui@latest add <component>`.
- **Custom hooks** in `src/hooks/`.

### State Management
- All state is local (React hooks). No global store.
- Product data is static (imported from `src/data/products.ts`), not fetched from an API.
- Filtering uses `useMemo` for performance.

### Styling Conventions
- Use Tailwind CSS utility classes. Avoid writing custom CSS.
- Use the `cn()` helper from `@/lib/utils` to merge conditional class names.
- Colors use HSL CSS variables defined in `src/index.css` (e.g., `bg-primary`, `text-muted-foreground`).
- Design system: minimal, white/grayscale. Font: Calibri, Segoe UI.
- Dark mode is class-based and supported via `next-themes` (not actively toggled in UI currently).

### Routing
- Routes defined in `src/App.tsx`. Add new routes above the `*` catch-all.
- Currently single-page: `/` (Index) and `*` (NotFound).
- Product detail is rendered inline (conditional render in Index), not via a separate route.

### Import Aliases
- `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).
- Always use `@/` imports rather than relative paths for cross-directory imports.

## TypeScript Configuration

- **Strict mode is OFF** (`strict: false` in `tsconfig.app.json`).
- `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters` are all disabled.
- Target: ES2020, module: ESNext, JSX: react-jsx.

## Testing

- Framework: Vitest with jsdom environment and global test APIs.
- Setup file: `src/test/setup.ts` (configures `@testing-library/jest-dom` matchers and `window.matchMedia` polyfill).
- Test file pattern: `src/**/*.{test,spec}.{ts,tsx}`.
- Tests are co-located under `src/test/` (no per-component test files currently).

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Triggered on push to `main`.
2. Runs `npm ci` then `npm run build` on Ubuntu with Node 20.
3. Uploads `dist/` and deploys to GitHub Pages.

## Adding a New Product

1. Place images in `public/images/{product-id}/`:
   - `thumb.jpg` — thumbnail image
   - `{format}/F1.jpg`, `F2.jpg`, ... — face images for each supported format
2. Add a product entry to the `PRODUCTS` array in `src/data/products.ts` using the `faces()` and `thumb()` helper functions.

## Adding a New Format

1. Add the format string to the `ProductFormat` union type in `src/data/products.ts`.
2. Add its configuration to `FORMAT_CONFIGS` (label, layout type, grid dimensions if applicable, aspect ratio).
3. Supply face images under the corresponding `public/images/{product}/{format}/` directories.

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add <component-name>
```

Configuration is in `components.json`. Components are installed to `src/components/ui/`.

## Conventions for AI Assistants

- Run `npm run lint` and `npm run test` before considering a task complete.
- Do not modify files in `src/components/ui/` directly — use the shadcn CLI to add or update components.
- Use `@/` import aliases for all imports outside the current directory.
- Use the `cn()` utility for conditional Tailwind classes.
- Keep product data in `src/data/products.ts`; do not introduce API calls or fetch logic unless explicitly requested.
- Prefer Tailwind utility classes over custom CSS.
- Components use default exports.
- No semicolons are omitted — the codebase uses semicolons consistently.
