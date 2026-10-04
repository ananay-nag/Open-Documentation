# AGENTS.md - Developer & Agent Guide for `mcp-docs`

This document serves as the primary technical specification, architecture guide, and operational manual for AI agents and human engineers working on the **`mcp-docs`** documentation platform.

---

## 1. Project Overview & Architecture

`mcp-docs` is the official, interactive web documentation portal for **`@ananay-nag/mcp-decorators`**—a TypeScript decorator library that simplifies building Model Context Protocol (MCP) servers and clients.

### Key Goals
- **Interactive Multi-Version Documentation**: Dynamically loads and switches between different SDK versions (`v1.0.0`, `v2.0.0`, `v2.0.1`, `v2.0.2`, etc.) without full-page reloads.
- **Rich Landing Experience**: Includes interactive hero sections, live code comparisons (Raw SDK vs. Decorators), dynamic animations, and copy-ready setup commands.
- **Client-Side Search**: Instant in-memory full-text search across all nested sections, items, and markdown blocks.
- **Zero-Backend SPA**: Static single-page application built with Vite and React, ready for static hosting (GitHub Pages, Vercel, Netlify, Cloudflare Pages).

---

## 2. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Core Framework** | React 19 (`react`, `react-dom`) | Modern component architecture, functional components, and hooks. |
| **Language** | TypeScript (`~6.0.2`) | Strict typing, Project References (`tsconfig.app.json`, `tsconfig.node.json`). |
| **Bundler & Tooling** | Vite (`^8.1.1`) | Rapid HMR dev server and Rolldown-powered production bundling. |
| **Styling** | Tailwind CSS (`^3.4.17`) + PostCSS | Utility-first styling with custom palette (`mcp-dark`, `mcp-primary`, `mcp-accent`, `mcp-secondary`). |
| **Animations** | Framer Motion (`^12.42.2`) | Smooth transitions, physics springs, interactive cursor-following effects. |
| **Icons** | Lucide React (`^1.23.0`) | Modern, lightweight SVG iconography. |
| **Linter** | Oxlint (`^1.71.0`) | High-performance Rust-based JavaScript/TypeScript linter. |

---

## 3. Directory Structure & Details

```
mcp-docs/
├── public/                 # Static assets copied directly to dist/
├── src/
│   ├── assets/             # Vector icons and brand logos (e.g. mcp-hex-pink.svg)
│   ├── components/         # Modular UI components
│   │   ├── Content/        # Main documentation reading layout
│   │   │   ├── Breadcrumbs.tsx          # Section hierarchy breadcrumb
│   │   │   ├── CodeBlock.tsx            # Syntax-highlighted code with copy button
│   │   │   ├── ContentArea.tsx          # Wrapper for active doc item & navigation
│   │   │   ├── MarkdownRenderer.tsx     # Custom AST-like block renderer
│   │   │   └── PrevNextNavigation.tsx   # Pagination between flattened doc pages
│   │   ├── Footer/
│   │   │   └── Footer.tsx               # Global footer with GitHub/npm links
│   │   ├── Header/
│   │   │   ├── Header.tsx               # Top navigation bar
│   │   │   ├── SearchBar.tsx            # In-memory full-text search modal
│   │   │   ├── ThemeToggle.tsx          # Dark / Light mode switcher
│   │   │   └── VersionDropdown.tsx      # Version selector dropdown
│   │   ├── Landing/        # Interactive marketing / landing page
│   │   │   ├── BackgroundAnimation.tsx  # Dynamic floating particles & gradients
│   │   │   ├── CodeComparison.tsx       # Side-by-side Raw SDK vs Decorators
│   │   │   └── LandingPage.tsx          # Hero section, badges, install command
│   │   └── Sidebar/        # Documentation navigation drawer
│   │       ├── Sidebar.tsx              # Sidebar container (desktop & mobile)
│   │       ├── SidebarItem.tsx          # Leaf node item link
│   │       └── SidebarSection.tsx       # Collapsible section group
│   ├── doc-data/           # Versioned documentation content datasets
│   │   ├── v1.0.0.ts       # v1.0.0 (Legacy SDK)
│   │   ├── v2.0.0.ts       # v2.0.0 (Initial McpServer support)
│   │   ├── v2.0.1.ts       # v2.0.1 (CI/CD, Jest suite & coverage)
│   │   ├── v2.0.2.ts       # v2.0.2 (Native McpServer, argsSchema, deprecations)
│   │   └── v2-common.ts    # Reusable shared sections for v2 releases
│   ├── App.css             # Root styles
│   ├── App.tsx             # Root container, version routing & global state
│   ├── index.css           # Tailwind directives and utility classes
│   └── main.tsx            # React DOM root mounting
├── index.html              # Single-page entry HTML
├── package.json            # Scripts & dependencies
├── postcss.config.js       # PostCSS configuration for Tailwind CSS
├── tailwind.config.js      # Tailwind theme configuration
├── tsconfig.json           # Solution-level TypeScript configuration
├── tsconfig.app.json       # App source TypeScript configuration
├── tsconfig.node.json      # Node/Vite build TypeScript configuration
└── AGENTS.md               # This agent instruction and guide file
```

---

## 4. Documentation Data Schema (`src/doc-data/`)

The documentation content is structured as typed JavaScript objects instead of raw `.md` files. This allows instant client-side querying, dynamic tab switching, and seamless version comparisons.

### Version File Structure (`vX.Y.Z.ts`)
Each file in `src/doc-data/` exports a default object:
```typescript
export default {
  version: "2.0.2",           // Semantic version string
  isLatest: true,             // True ONLY for the current active latest release
  isDeprecated: false,         // True if the entire version is deprecated
  deprecationMessage?: "...", // Warning banner displayed across all pages if deprecated
  title: "MCP Decorators v2.0.2 (McpServer SDK)",
  sections: [ ... ]           // Array of Section objects
};
```

### Section Schema
```typescript
interface Section {
  id: string;                 // URL/state identifier (e.g. "server-decorators")
  title: string;              // Header text in sidebar
  items: DocItem[];           // Array of items or sub-sections
}
```

### Item Schema
An item can either be a leaf page with `content`, or a parent with nested `items`:
```typescript
interface DocItem {
  id: string;                 // Item identifier (e.g. "cap-prompt")
  title: string;              // Item label
  isDeprecated?: boolean;     // Shows a warning badge on the item
  deprecationMessage?: string;// Item-specific deprecation notice
  items?: DocItem[];          // Nested sub-items
  content?: ContentBlock[];   // Content blocks to render
}
```

### Supported Content Block Types (`MarkdownRenderer.tsx`)
1. **`paragraph`**: Body text supporting inline `**bold**` and `` `code` `` formatting.
   ```json
   { "type": "paragraph", "text": "Install via `npm install`." }
   ```
2. **`heading`**: Headings (`level`: 1, 2, or 3).
   ```json
   { "type": "heading", "level": 3, "text": "@RegisterServer()" }
   ```
3. **`code`**: Single code snippet with language syntax formatting and copy button.
   ```json
   { "type": "code", "language": "typescript", "code": "export class MyServer extends McpServer {}" }
   ```
4. **`list`**: Bulleted list items supporting inline formatting.
   ```json
   { "type": "list", "items": ["**Decoupled:** Clean separation.", "**Auto-binding:** Automatic dispatch."] }
   ```
5. **`alert`**: Styled callout banners (`style`: `'note'` | `'tip'` | `'important'` | `'warning'`).
   ```json
   { "type": "alert", "style": "warning", "text": "Server is deprecated in v2.0.2." }
   ```
6. **`table`**: Structured data table with header and row arrays.
   ```json
   {
     "type": "table",
     "headers": ["Script", "Description"],
     "rows": [["`npm test`", "Run tests"]]
   }
   ```
7. **`code-tabs`**: Tabbed code viewer for multi-file examples (`server.ts`, `handlers.ts`, `index.ts`).
   ```json
   {
     "type": "code-tabs",
     "tabs": [
       { "name": "server.ts", "language": "typescript", "code": "..." },
       { "name": "handlers.ts", "language": "typescript", "code": "..." }
     ]
   }
   ```

---

## 5. How to Start & Initiate

### 5.1. Prerequisites
- Node.js version **18.x**, **20.x**, or **22.x**
- npm version **9.x** or higher

### 5.2. Installation
Navigate into the `mcp-docs` directory and install dependencies:
```bash
cd mcp-docs
npm install
```
> [!NOTE]
> Tailwind CSS is configured using Tailwind v3 (`^3.4.17`) and standard PostCSS. Avoid installing Tailwind v4 unless migrating the entire build pipeline.

### 5.3. Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Vite development server with `--host` at `http://localhost:5173`. |
| `npm run build` | Runs TypeScript compilation check (`tsc -b`) followed by `vite build`. Output is placed in `dist/`. |
| `npm run lint` | Runs `oxlint` across all files to detect syntax errors and anti-patterns. |
| `npm run preview` | Spins up a local static server to preview the built `dist/` directory. |

---

## 6. How We Follow New Changes (Release Ingestion SOP)

Whenever a new version or change is introduced (e.g., when a new release document like `doc2.0.2.md` or `doc2.1.0.md` is added):

### Step 1: Analyze the Release Specification
- Read the release notes markdown file (e.g. `docX.Y.Z.md`).
- Identify:
  1. **New features** (e.g. new decorators, new configuration fields, new options).
  2. **Deprecations & breaking changes** (deprecated classes, deprecated method names, removal roadmaps).
  3. **Enhancements & fixes** (type changes, compiler cleanups, new tests).
  4. **Migration steps** (before vs. after code snippets).

### Step 2: Demote Previous Version
Open the previously latest dataset in `src/doc-data/v<previous>.ts`:
- Set `"isLatest": false`.

### Step 3: Create New Dataset `src/doc-data/vX.Y.Z.ts`
Create the file for the new version:
- Set `"version": "X.Y.Z"`.
- Set `"isLatest": true`.
- Set `"isDeprecated": false`.
- Include a dedicated **Release Notes & Migration Guide** section capturing all details from the release specification.
- Modernize all standard capability documentation (e.g., `@RegisterServer()`, `@Prompt()`, `@Tool()`) with new patterns.
- Modernize the full server and client implementation walkthroughs.
- Include testing and CI/CD guides.

### Step 4: Update Global Application Defaults
- In `src/App.tsx`:
  - Update the fallback version string on `defaultVersion` to `"X.Y.Z"`.
- In `src/components/Landing/CodeComparison.tsx`:
  - Update the interactive comparison snippets if core decorator usage changed (e.g., updating `Server` to `McpServer`).

### Step 5: Verification & Quality Gate
Run the build and linter to ensure zero regressions:
```bash
npm run build
npm run lint
```
Verify that:
1. `tsc -b` exits with code 0 (no TypeScript errors).
2. `vite build` bundles the assets cleanly.
3. The version dropdown includes the new version marked as `(Latest)`.
4. In-memory search can find terms introduced in the new version.
