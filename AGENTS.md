# Repository Guidelines

## Project Structure & Module Organization
Astro pages live in `src/pages`, layout shells sit in `src/layouts`, and shared React components belong in `src/components`. Reusable utilities go under `src/lib`, while design tokens and Tailwind layers live in `src/styles`. Static assets (favicons, og images) belong in `public` so Astro can serve them verbatim. Keep new feature directories shallow—prefer collocating assets alongside their page or component folder when possible.

## Build, Test, and Development Commands
- `npm run dev`: start the Astro dev server with hot module reload at `http://localhost:4321`.
- `npm run build`: generate the production static build in `dist/`.
- `npm run preview`: run a local server against the built output for smoke checks.
- `npm run lint`: run Biome linting across Astro, TypeScript, and JSX sources.
- `npm run format`: apply Biome formatting rules before committing. Always run this command and resolve any Biome issues before every commit so the codebase stays consistent.

## Local Development Workflow & QA Ritual
- Install dependencies with `npm install`.
- Start the dev server with `npm run dev` and give Astro enough time to finish its initial build. Watch the terminal for 404s, Vite overlay errors, or stack traces; resolve them before continuing.
- When validating changes, keep the dev server log visible so you can spot hot-reload warnings or runtime exceptions as they appear. If you see repeated errors, capture them in your PR notes.
- If the browser surfaces a 404 or any runtime error, troubleshoot before proceeding—use the dev server logs, stack traces, or error overlays to identify the root cause and resolve it.
- Always capture relevant UI screenshots after the app has fully loaded. Wait for fonts, images, and dynamic data to appear; if the page shows a loading skeleton or error state (e.g., 404), refresh or navigate until the intended view renders correctly before taking the screenshot.
- End every change with both a screenshot of the affected page(s) and a brief analysis explaining how the image demonstrates the desired outcome.

## Coding Style & Naming Conventions
Biome enforces two-space indentation, 100-character line width, and organized imports; run `npm run format` before pushing. Favor TypeScript across React islands and utilities, and type props with explicit interfaces. Use PascalCase for components and layouts (e.g., `HeroSection.tsx`), camelCase for functions/hooks, and kebab-case for file names in `pages/` to match route slugs. Tailwind classes should be composed with `clsx` or `tailwind-merge` when conditional logic is needed.

- All new files outside of `pages/` should follow “a-casing-like-this.ext” (lowercase words separated by hyphens) to keep component directories consistent.

- Astro component and page filenames must use lowercase kebab-case (e.g., `logo.astro`, `site-header.astro`).

## Testing Guidelines
No automated suite ships today—new work should include targeted tests where practical. Prefer lightweight component tests (e.g., Vitest + @testing-library/react) for React islands and integration smoke tests for critical Astro routes. If you add a test runner, document the command in `package.json` (e.g., `npm test`) and ensure it runs in CI before requesting review. For manual QA, capture viewport screenshots or short Looms when touching interactive 3D scenes.

## Commit & Pull Request Guidelines
Follow Conventional Commit syntax (`type: summary`) to align with the existing `refactor:` history—use `feat`, `fix`, or `chore` as appropriate. Group related changes into a single commit; avoid mixing formatting-only and functional updates. Pull requests must include: a concise summary, linked issue or task reference, validation notes (tests run, preview link), and screenshots for UI changes. Flag breaking config updates (e.g., Astro, Tailwind, deployment workflows) in the PR title and description so reviewers can plan deployment checks.
