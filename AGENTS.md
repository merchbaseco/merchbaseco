# Repository Guidelines

## Project Structure & Module Organization
Astro pages live in `src/pages`, layout shells sit in `src/layouts`, and shared React components belong in `src/components`. Reusable utilities go under `src/lib`, while design tokens and Tailwind layers live in `src/styles`. Static assets (favicons, og images) belong in `public` so Astro can serve them verbatim. Keep new feature directories shallow—prefer collocating assets alongside their page or component folder when possible.

## Build, Test, and Development Commands
- `yarn dev`: start the Astro dev server with hot module reload at `http://localhost:4321`.
- `yarn build`: generate the production static build in `dist/`.
- `yarn preview`: run a local server against the built output for smoke checks.
- `yarn lint`: run Biome linting across Astro, TypeScript, and JSX sources.
- `yarn format`: apply Biome formatting rules before committing.

## Coding Style & Naming Conventions
Biome enforces two-space indentation, 100-character line width, and organized imports; run `yarn format` before pushing. Favor TypeScript across React islands and utilities, and type props with explicit interfaces. Use PascalCase for components and layouts (e.g., `HeroSection.tsx`), camelCase for functions/hooks, and kebab-case for file names in `pages/` to match route slugs. Tailwind classes should be composed with `clsx` or `tailwind-merge` when conditional logic is needed.

## Testing Guidelines
No automated suite ships today—new work should include targeted tests where practical. Prefer lightweight component tests (e.g., Vitest + @testing-library/react) for React islands and integration smoke tests for critical Astro routes. If you add a test runner, document the command in `package.json` (e.g., `yarn test`) and ensure it runs in CI before requesting review. For manual QA, capture viewport screenshots or short Looms when touching interactive 3D scenes.

## Commit & Pull Request Guidelines
Follow Conventional Commit syntax (`type: summary`) to align with the existing `refactor:` history—use `feat`, `fix`, or `chore` as appropriate. Group related changes into a single commit; avoid mixing formatting-only and functional updates. Pull requests must include: a concise summary, linked issue or task reference, validation notes (tests run, preview link), and screenshots for UI changes. Flag breaking config updates (e.g., Astro, Tailwind, deployment workflows) in the PR title and description so reviewers can plan deployment checks.
