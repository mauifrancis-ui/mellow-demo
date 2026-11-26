# Mellow backlog

## Punchlist · small bugs

Small bugs bypass the full review (see AGENTS.md). Each one is fixed, checked and shipped, then reviewed together at the next retro.

| # | Bug | Found | Fix | Status |
| --- | --- | --- | --- | --- |
| 1 | The expanded right panel scrolls sideways 8px, cutting off the end of queue rows ("Import" or the time) | Founder, 2026-11-25 | Inner room for the row hover band; columns never scroll sideways; focus ring drawn inside the row (v1.37.1) | Shipped |
| 2 | On phones, the chat panel bleeds 4px past the screen, so the page can shift sideways | Team, while fixing #1 | The panel bleeds exactly to the 16px page margin (v1.37.1) | Shipped |

## Sprint 4 additions from the v1.38 Product Excellence Review

- One door to the compare dialog ("Compare files" vs "Use my files").
- Remember column choices; a note when files are added; a typed name on the summary; "Send this to my computer".

## Sprint 3 candidates (done in v1.38 unless noted)

0. **Rebuild the marketing site** (audit in DESIGN_BOARD.md, 2026-11-25): Field Ledger, honest claims, a real demo handoff, no fabricated testimonials or scores.

From the v1.37 Product Excellence Review (DESIGN_BOARD.md). The founder picks at sprint planning.

1. Make "Compared" impossible to misread: lead with the evidence ("2 files · row 2 · 9:13").
2. Try to Buy: "Share these findings", a one-page summary for an approver.
3. Your own files in under 10 minutes: drop any CSV and Mellow maps the columns, plus a template.
4. Phone-first: Today leads with "Your next package", and the sheet opens to NEW.
5. "Not useful" on a note, to tune triggers.
6. "Watch a shift": a guided Try mode that plays a scripted day.
7. Export the decision and note trail for inspectors (PDF or CSV).

## Punchlist · 2026-11-25

- Reported by the founder: Activity decision rows wrapped "Issue recorded" at body size, while the evidence people typed sat in 12px dotted mono. Decision words are now 15px sans on one line, and evidence is 14px sans with a quiet underline. Mono stays for times and IDs only.
- Open (needs the founder): Activity marks a recorded issue with a filled vermilion dot and "Left for a manager" with a ring. The mark grammar reserves those for "records disagree" and "gap". This changes design meaning, so it's not a punchlist fix.

- Reported by the founder: the "Not useful" radios showed as large circles with the labels pushed right. The global `label input` field style (44px, full width) was applied to radio buttons. Fixed with styles scoped to `.not-useful`. Our preview review tested the flow but didn't screenshot the control. Retro: screenshot every new control at both widths.

- Fixed after the v1.39 production check: the site still said the stamp shows "Compared" and "which rows". It now says "which files, which package, and when", and that answers not drawn from your records say so. This is site copy only.

## Sprint 5 candidates from the founder's walkthrough · 2026-11-25

- **Today shows one package but says 9 (Use).** This was the founder's most basic confusion. Showing one task with a compact queue is deliberate (decision 003), but it doesn't explain itself to someone arriving cold. Options for the team and board:
  - say "1 of 9 · sorted by what needs you most", with "See all 9" in place;
  - show the next one quietly ("Next: PKG-552 · no receiving record");
  - remember an opened list.
- **Design system tokens (audit 2026-11-25).**
  - Color: primitives are tokens and swap by palette (`data-palette`). A semantic layer exists (`--signal`, `--surface`, `--focus`) but components mostly use primitives directly.
  - Type: families are tokens, but sizes aren't. About ten hard-coded sizes from 11 to 18px caused today's two font bugs.
  - Spacing: not tokenized.
  - The legacy `styles.css` has 37 hard-coded colors and the global input rule behind the radio bug.
  - Context: the system adapts by width, reduced motion and print. It doesn't adapt by use case.
  - Proposal: primitive, semantic and component tiers; a type and spacing scale; context modes for the floor (phone), the desk and print or export; marks and status words as semantic tokens.

## Texas roadmap (team decision 2026-11-25)

- Sprint 4: the regulation source registry (references only), plus the binder skeleton.
- Sprint 5: inspection prep for Texas current law: checked controls, evidence on file, the binder.
- Sprint 6: "What if" for the 2027 session bills, plus Expand.

## From the v1.39 review

- The trail says who decided once accounts exist. Until then, it says it can't (sprint 5).
- The sprint 5 binder opens from the trail.
- Rules entries need a named person to check them before real use.

## Open items

- Real sessions with 3 to 5 receiving leads (Research). "Compared" comprehension comes first.
- Counsel review of AI disclosure before live AI (Compliance).
- The "Your open record changed" trigger, which needs live source sync (Engineer).
- A recruit panel that covers assistive technology users and managers who only review handoffs (Research).
