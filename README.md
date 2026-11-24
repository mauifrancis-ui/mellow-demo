# Mellow Demo

Mellow is a compliance intelligence demo for regulated cannabis operations.

This prototype demonstrates a future-state experience where Mellow monitors connected compliance data, detects risk, explains what changed, and recommends what to fix.

## Demo flow
- connected monitoring dashboard
- issue detection
- fix workflow
- audit trail
- export packet preview

## Run locally
npm install
npm run dev

## Deploy
vercel --prod

## Recovered frontend baseline

The pasted React component is in `src/App.tsx`. The repository now has a Vite,
TypeScript, and Tailwind scaffold. Use Node 22.12+ or Node 24 and run
`npm ci`, `npm run dev`, or `npm run build`.

This baseline includes Today, Activity, Learn, and browser-side CSV intake.
Release 01 uses browser-local sample data and evidence. See the release
checklist for validation and production requirements. Original app infrastructure
and approved custom GPT knowledge are still pending.

`npm test` runs the CSV and workflow regression tests on Node 24. To view the
production build locally, run `npm run build` followed by `npm run preview`.
