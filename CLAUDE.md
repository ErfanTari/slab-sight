# CLAUDE.md — Slab Sight

## Project Overview

Slab Sight is a marble slab quality-control viewer — a single-page React application for browsing and inspecting marble slab products across multiple size formats. Users can search and filter a catalog of 44 marble products, then view individual slab face images in strip, grid, or book-match layouts.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build tool:** Vite 5 (SWC plugin for fast compilation)
- **Styling:** Tailwind CSS 3 with CSS variables for theming
- **UI components:** shadcn/ui (Radix UI primitives)
- **Routing:** React Router v6 (client-side)
- **State:** Local component state (`useState`/`useMemo`); TanStack React Query configured but minimally used
- **Testing:** Vitest + Testing Library + jsdom
- **Linting:** ESLint 9 (flat config) with TypeScript and React plugins
- **Deployment:** GitHub Pages via GitHub Actions (Node 20)

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build (outputs to dist/)
npm run build:dev    # Development mode build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests (vitest run)
npm run test:watch   # Run tests in watch mode
```

## Project Structure

```
src/
├── App.tsx                  # Root component: providers + router setup
├── main.tsx                 # React entry point
├── index.css                # Global styles, Tailwind directives, CSS variables
├── pages/
│   ├── Index.tsx            # Main page: search, filter, product grid
│   └── NotFound.tsx         # 404 page
├── components/
│   ├── ProductCard.tsx      # Product thumbnail card for grid listing
│   ├── ProductViewer.tsx    # Full product detail view (strip/grid/book-match)
│   ├── SearchBar.tsx        # Search input component
│   ├── FormatFilter.tsx     # Format filter buttons
│   ├── GridView.tsx         # Grid layout for multi-face formats
│   ├── StripView.tsx        # Horizontal strip layout for large formats
│   ├── BookMatchView.tsx    # Mirror-pair (book-match) layout
│   ├── Breadcrumbs.tsx      # Breadcrumb navigation
│   ├── NavLink.tsx          # Navigation link
│   └── ui/                  # shadcn/ui components (48 files, do not edit manually)
├── data/
│   └── products.ts          # Product definitions, types, and image path helpers
├── lib/
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
├── hooks/
│   ├── use-mobile.tsx       # Mobile breakpoint detection hook
│   └── use-toast.ts         # Toast notification hook
└── test/
    ├── setup.ts             # Vitest setup (jest-dom, matchMedia mock)
    └── example.test.ts      # Example test
```

### Key directories outside `src/`

- `public/images/` — Product face images organized as `<product_dir>/<format>/F<n>.jpg` and `<product_dir>/thumb.jpg`
- `.github/workflows/deploy.yml` — CI/CD pipeline

## Architecture & Data Flow

### Routing

Two routes defined in `App.tsx`:
- `/` — Index page (product catalog)
- `*` — NotFound (404 catch-all)

New routes should be added **above** the catch-all `*` route.

### Data Layer

All product data is static and defined in `src/data/products.ts`:
- **Types:** `ProductFormat`, `ProductSize`, `Product`, `FormatConfig`
- **7 formats:** 120x280, 160x320, 120x120, 90x180, 60x120, 60x60, 30x60
- **Layouts:** `"strip"` (large single-face formats) or `"grid"` (multi-face tiled formats)
- **Face images** are generated via the `faces()` helper: `/images/<dir>/<format>/F<n>.jpg`
- **Book-match products:** Bianco_Dior, Macchia_Vecchia, Gemma_Bronz (2-face pairs shown mirrored)

### Component Hierarchy

```
App (providers: QueryClient, TooltipProvider, Toaster, Sonner, BrowserRouter)
└── Index
    ├── SearchBar
    ├── FormatFilter
    ├── ProductCard (×N in grid)
    └── ProductViewer (when product selected)
        ├── Breadcrumbs
        ├── StripView / GridView (based on format layout)
        └── BookMatchView (for book-match products)
```

### State Management

The Index page uses local state for search, format filter, and selected product. No global state store is used. Product filtering is memoized with `useMemo`.

## Coding Conventions

### TypeScript

- TypeScript is configured in **lenient mode** (`noImplicitAny: false`, `strictNullChecks: false`)
- Path alias: `@/` maps to `src/` — always use `@/` imports instead of relative paths
- Export components as default exports from their files

### Styling

- Use Tailwind CSS utility classes; avoid writing custom CSS
- Use CSS variables defined in `src/index.css` for theme colors (e.g., `bg-background`, `text-foreground`, `border-border`)
- Dark mode is class-based (`darkMode: ["class"]`) — configured but not actively used
- Font stack: Calibri, Segoe UI, system sans-serif
- Responsive breakpoints: `sm:`, `md:`, `lg:` (mobile-first)

### Components

- **shadcn/ui components** live in `src/components/ui/` — these are generated; modify via the shadcn CLI (`npx shadcn-ui@latest add <component>`), not by hand
- Custom components live directly in `src/components/`
- Use the `cn()` utility from `@/lib/utils` for conditional class merging

### ESLint

- `@typescript-eslint/no-unused-vars` is **off**
- `react-refresh/only-export-components` is **warn**
- React hooks rules are enforced

### Testing

- Test files go in `src/` alongside source, matching `*.test.ts` or `*.test.tsx`
- Vitest globals are enabled — `describe`, `it`, `expect` are available without imports
- jsdom environment with `@testing-library/react` for component tests
- Run `npm test` before committing to verify nothing is broken

## Adding a New Product

1. Add face images to `public/images/<ProductName>/<format>/F1.jpg`, `F2.jpg`, etc.
2. Add a thumbnail at `public/images/<ProductName>/thumb.jpg`
3. Add a `ProductDef` entry in the `PRODUCT_DEFS` array in `src/data/products.ts`
4. If it's a book-match product, add the directory name to `BOOKMATCH_PRODUCTS`

## CI/CD

The GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on pushes to `main`:
1. Checks out code
2. Installs dependencies with `npm ci`
3. Runs `npm run build`
4. Deploys `dist/` to GitHub Pages

## Important Notes

- The dev server binds to `::` (IPv6 all-interfaces) on port **8080**, not the Vite default 5173
- HMR error overlay is disabled in the Vite config
- The project originated from a Lovable template — the `lovable-tagger` dev dependency and some README references are artifacts of that
- No backend or API — all data is static and bundled at build time
