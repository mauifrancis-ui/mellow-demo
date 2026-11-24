# Mellow

Mellow is a compliance intelligence demo for regulated cannabis operations. It compares inventory and receiving records, explains where the sources disagree or where evidence is missing, and routes each exception to a person who decides. Release 01 runs entirely in the browser on sample data.

## What's in the demo

- **Today**: the current finding, what Mellow last checked, one guided task, and a compact queue of records to check.
- **Compare files**: compare two source files (or check one) in a dialog with a read-only result table, then add the exceptions to the queue.
- **Activity**: shift handoff and decision history, including what still needs a manager.
- **Learn**: a field guide for the dispensary floor.

## Run locally

Use Node 22.12+ or Node 24.

```bash
npm ci
npm run dev        # development server
npm test           # regression tests
npm run lint
npm run build      # production build
npm run preview    # serve the production build
```

`npm run metrc:check` tests a Metrc sandbox connection. It needs `METRC_SANDBOX_HOST`, `METRC_VENDOR_KEY`, `METRC_USER_KEY` and `METRC_FACILITY_LICENSE` in a local `.env` file, which is never committed. The demo itself doesn't need them.

## Repository layout

| Path | Contents |
| --- | --- |
| `src/` | React app (`App.tsx`), receiving check and monitor views, comparison and workspace logic |
| `server/` | Metrc sandbox client and connection check |
| `tests/` | Node test runner regression tests |
| `knowledge/` | Inventory of knowledge still to be transferred and approved |

Product guidance lives at the root. Start with [AGENTS.md](AGENTS.md), then read [MELLOW_CORE.md](MELLOW_CORE.md), [MELLOW_DESIGN_SPEC.md](MELLOW_DESIGN_SPEC.md), [DECISION_LOG.md](DECISION_LOG.md), [DESIGN_BOARD.md](DESIGN_BOARD.md) and [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## Branches and deployment

- `main` deploys to production on Vercel (project `auditready-demo`). Merge to `main` only after the founder approves the preview.
- Do the work on a branch off `main`. Pushing a branch creates a Vercel preview for review.
- Don't run `vercel --prod` by hand. Production follows `main`.
