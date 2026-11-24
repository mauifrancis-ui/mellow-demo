# Release Checklist

## Architecture preparation

- [x] Capture founder-provided personality, conduct, design, and release authority.
- [x] Define provider-neutral server boundary and manual workflow behavior.
- [x] Inventory missing knowledge, data policy, and integration prerequisites.
- [x] Recover the pasted frontend and create a reproducible build scaffold.
- [ ] Confirm whether the original project contains additional source, server infrastructure, or tests.
- [ ] Identify the real authentication, tenant, evidence, draft, and decision storage paths in the app.

## Release 01 implementation and preview

- [ ] Preserve Today, Activity, Learn, and existing records. Verify navigational and stored-data compatibility.
- [ ] Test one guided task and the compact queue with single-record actions and unresolved manager reviews visible.
- [ ] Verify the 4px spacing system, 12px vertical compact-row padding, alignment, wrapping, keyboard access, and accessible status feedback on mobile and desktop.
- [ ] Test evidence validation, failed writes, draft persistence, concurrent submissions, unauthorized actions, and reopen history.
- [ ] Verify missing or conflicting data displays explicitly and the app contains no invented compliance values or readiness scores.
- [ ] Run the app build and tests. Log results and close or document design, engineering, accessibility, and compliance findings.
- [ ] Confirm access to the Vercel team and `auditready-demo` project. Verify project billing and deployment status. Use preview-scoped configuration and get a working preview URL.
- [ ] Record founder review and explicit production approval before deploying to production.

## Live AI activation

- [ ] Transfer and approve GPT instructions, source files, and examples. Approve jurisdiction coverage and knowledge ownership.
- [ ] Approve provider, model, processing terms, retention, permitted data classes, and evaluation criteria.
- [ ] Configure server-only credentials with separate preview and production settings. Confirm frontend bundles and logs contain no secrets.
- [ ] Implement and verify authentication, tenant isolation, authorized retrieval, citation validation, input limits, rate limits, and unavailable-service behavior.
- [ ] Evaluate unsupported claims, expired rules, conflicting sources, irrelevant citations, misleading document instructions, restricted records, and human decision authority.
- [ ] Obtain founder approval before enabling live AI. Verify the kill switch and manual workflow.

## Local demo verification

- [x] Run `npm run build`, `npm run lint`, and `npm test`.
- [x] Verify missing-evidence rejection, reopening with manager review, and CSV parsing in automated tests.
- [ ] Open an interactive preview and test mobile reflow, keyboard navigation, screen-reader operation, and draft persistence.
- [x] Confirm project permissions for a separate Vercel Preview deployment. The existing production domain responds at `auditready-demo-blond.vercel.app`.
