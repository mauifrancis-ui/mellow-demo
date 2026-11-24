# Mellow Design Spec

Release 01 · Simplify & Trust · Version 1.0.0 · 2026-11-24

Status: approved requirements captured. Release 01 local demo implemented. Hosted preview and browser verification pending.

| Surface | Behavior |
| --- | --- |
| Today | Lead with one guided task showing the record, why it needs attention, supporting evidence or its absence, and one next action. Display the compact work queue immediately below or beside it. Use a stable ordering based on known workflow state and verified deadlines, with unresolved manager reviews visible until resolved. |
| Activity | Display dated decision events with actor, record, outcome, and evidence references subject to permissions. Show currently unresolved manager reviews even after newer activity arrives. Provide an authorized reopen action and retain the original decision in history. |
| Learn | Preserve the learning entry point. Identify source, scope, and effective date for regulatory material. Show missing or outdated coverage explicitly. |
| Record review | Open a single record from the queue. Preserve drafts across navigation, refresh, and retry. Keep approval unavailable until supporting evidence qualifies. Explain the missing evidence and how to supply it. Show save and decision outcomes clearly. |

## Visual system

Use one 4px spacing scale across the app. Compact rows use exactly 12px top and 12px bottom padding. Center leading content, text groups, and trailing icons on the row's vertical axis, including when text wraps. Reuse row components across queue and activity where their semantics match. Provide adequately sized interactive targets, visible focus, meaningful accessible names, and status cues that include text. Keep logical reading and focus order on desktop and mobile. On narrow screens stack sections, allow text to wrap, and keep all actions reachable without horizontal scrolling.

## Trust and recovery

Remove bulk approval and every record-selection checkbox. Each approval requires a verified human actor and accessible evidence tied to that record, with server validation at write time. Preserve the latest draft if a decision fails. Capture changes to the decision as an event with actor, time, reason, and evidence references. Reopening a manager-owned review makes it visible in the unresolved queue again. Render known facts and actual counts only. Display missing data explicitly and omit readiness scores. Display recommendations and source-grounded requirements distinctly, following [MELLOW_CORE.md](MELLOW_CORE.md).

## Acceptance

Verify the guided task, complete queue, evidence gate, draft recovery, and decision recovery using real application entry points. Verify unresolved manager reviews persist across navigation and reload. Inspect keyboard and screen-reader flows and measure row padding and alignment at desktop and mobile widths. Test at 320 CSS pixels and 200% zoom. Check that failed requests preserve work and that stale or conflicting regulatory data does not become a claim.

## Local demo boundary

The recovered frontend has no verified identity or storage backend. The demo
uses sample records and browser-local drafts and events. CSV intake reports only
observable data gaps and stated transfer statuses. Evidence references and
excerpts support a local demonstration of the approval gate. Production requires
managed evidence, actor permissions, and server enforcement. Manager flags stay
visible in the local workspace. The demo does not deliver notifications.
