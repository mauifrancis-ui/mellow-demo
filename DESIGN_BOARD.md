# Mellow Design Advisory Board

These simulated lenses are inspired by published work and practice. The board is an internal review method. The founder decides releases.

| Lens | Review question |
| --- | --- |
| Dieter Rams | Can operators find the next task with less interface and honest status information? |
| Charles and Ray Eames | Does the workflow fit how people gather evidence and pass work between shifts? |
| Massimo Vignelli | Do layout, hierarchy, and the 4px spacing scale behave consistently across surfaces? |
| Susan Kare | Do icons reinforce recognizable, clearly labeled actions? |
| Don Norman | Can people understand the evidence gate, recover a draft, and reopen a decision? |
| Jony Ive | Are alignment, row centering, and interaction details consistent across devices? |
| Julie Zhuo | Does each screen support a clear user outcome and produce reviewable evidence? |
| Luke Wroblewski | Can operators finish the primary workflow on a narrow screen with touch? |
| John Maeda | Does simplification preserve the context needed for a responsible decision? |
| Josh Clark | Are touch, keyboard, zoom, and responsive interaction reliable? |
| Meredith Ringel Morris | Can people understand, challenge, and override AI advice while retaining agency? |

## Continuous improvement

1. At proposal review, document the user problem, constraints, and representative tasks. Apply relevant lenses and record what changed.
2. At implementation review, exercise real flows on mobile and desktop. Review data, permissions, transaction behavior, keyboard and assistive technology, evidence provenance, and recovery.
3. At preview review, close findings or record their impact and ownership. Capture build and test evidence and the founder's release decision.
4. After release, review support issues and outcome measures, prioritize fixes, and record what the next iteration will verify.

For each pass record the version, lens, observed evidence, finding, owner, disposition, and retest result. The current pass was a specification review. Product behavior and visual implementation are pending.

## Version 1.1 visual and interaction review

These are simulated advisory perspectives applied to the release spec and source.

| Lenses | Recommendation adopted |
| --- | --- |
| Dieter Rams and John Maeda | Spend visual emphasis on the record and next action. Put approval requirements beside the decision. |
| Charles and Ray Eames and Jony Ive | Pair warm paper with evergreen and rounded actions. Give the interface a subtle press response and let new content settle quickly. |
| Massimo Vignelli and Susan Kare | Give editorial headings and operational text distinct roles. Use labels, contrast, and a selection marker so state survives without color. |
| Don Norman and Julie Zhuo | Name the missing evidence before the user acts. Keep confirmations inline and make optional notes discoverable. |
| Luke Wroblewski and Josh Clark | Let navigation and actions wrap and the evidence grid reflow. Keep 44px targets and support reduced motion. |
| Meredith Ringel Morris | Make provenance visible beside the observation. Keep human judgment explicit after evidence fields are complete. |

Desktop and narrow-screen browser checks, keyboard flow, and screen-reader
verification remain part of preview review.

## Version 1.3 team review and board pass

Product design and engineering reviewed the reported workflow first. They
identified the queue placement and top-of-page focus jump as separate causes
of the scroll loop. The team recommended a persistent review frame, a nearby
queue, and continuation after successful saves.

The subsequent simulated board pass applied the Rams, Maeda, and Vignelli
lenses to common-region grouping and a restrained ink, mineral blue, and
amber palette. The Eames, Norman, and Zhuo lenses reviewed continuation and
recovery. The Kare, Ive, Wroblewski, and Clark lenses informed recognizable
controls, tactile motion, reduced motion, and access on narrow screens. The
Morris lens required record-scoped provenance, clear evidence gaps, and
explicit human control of future agent proposals.

## Version 1.7 editorial and retrieval pass

- Rams, Maeda, and Vignelli favored one clear work surface, typography for
  hierarchy, and rules for comparison. The repeated rounded panels made
  unrelated items appear equally important.
- The Eameses, Kare, and Ive favored recognizable pill controls with color
  used sparingly where the reviewer needs orientation.
- Norman, Zhuo, and Morris prioritized the path from source to discrepancy
  to next check. The discrepancy becomes the heading and each source stays
  visible beside its counterpart.
- Wroblewski and Clark favored stacking sources within the same comparison at
  narrow widths and keeping the decision close to the record.

## Version 1.17 simulated board pass

Rams and Maeda questioned the need for a second entrance to the task already
on Today. Norman and Zhuo favored opening the actionable record in place.
Vignelli and Kare favored one structured row per package with the source
values aligned under their labels. Morris kept the recommendation separate
from the values and kept decisions in the review. The receiving comparison
is available below it for source verification.

## Version 1.35 proposal review and board pass · Ask Mellow AI brand · 2026-11-25 (superseded)

*Superseded the same day by the rerun below. That first pass predates [PRODUCT_TEAM.md](PRODUCT_TEAM.md): it had no Product Lead, Research or AI UX pass, and it named findings by area rather than by role.*

**Proposal.** The four directions on the canvas page "Ask Mellow · AI brand": A Margin Note, B The Period, C Second Shift, D Proof. They're reviewed against the founder's voice and behavior rules of 2026-11-25. The prototype build that started before this review (a provenance stamp, a proactive row dot, and routing rule questions) was paused and is stashed. It's evidence for this review, not an approved build.

### Team review

| Pass | Finding | Severity | Recommendation |
| --- | --- | --- | --- |
| Compliance and risk | **Live bug.** "Is a blank lot a violation under the regulation?" matches the gaps intent and answers with a list of today's gaps, which reads as a compliance answer. It breaks rule 5. | High · live | Route rule, violation and compliance questions to an honest "I can't tell you whether that's allowed" answer before any record intent. Add a regression test. Founder go-ahead needed to ship it ahead of the bundle. |
| Compliance and risk | "CHECKED" on a stamp can be read as an attestation in an audit. Mellow compares records; it doesn't check them against the law. | High | Use **"Compared"**, and name the files and time. Never put a stamp on interpretive answers. Use "Not from your records" for guidance, not "Not verified", which implies a verification step exists. |
| Compliance and risk | Proactive signals must come only from deterministic triggers: a new difference or gap, a delayed check, a handoff that's due. | Rule | Keep "noticed", "risk" and predictive words out of proactive copy. |
| Product design | B's dot clashes with the queue grammar, where a filled vermilion dot already means "records disagree" and a ring means "gap". A third vermilion dot makes all three ambiguous. | High | Give Mellow's signal a distinct mark (for example the margin-note tick), or redesign the queue marks first. B can't ship as drawn. |
| Product design | D's rotated stamps read as playful and fight the ledger's straight rules. | Medium | Keep stamps square, with a 1px ink rule and mono type. Motion is a short press only. |
| Product design | C's handoff moment fits the shift workflow, but its "we" voice overstates what Mellow does. | Medium | Defer it to its own sprint. Borrow the drafted handoff, not the voice. |
| Content and voice | A matches the shipped voice. "Mellow" only, with plain limits, holds in all four directions. | Info | Keep A's lines as the voice reference. |
| Engineering | Provenance can be computed deterministically from the comparison and run data that answers already use. It's cheap, and testable per intent. | Info | Attach provenance when the answer is created, so the time is the answer's, not the render's. |
| Engineering | "New since you last looked" is stored per device in localStorage. It's fine for the demo, but the real product needs a per-user timestamp from the server. | Medium | Label it as device-local in the spec. Open item for live mode. |
| Accessibility | The prototype dot's hit area is 28px, under the spec's 44px minimum. A dot alone carries meaning by colour and shape. | High | Use a 44px target, an accessible name, and a visible label on hover and focus. The stamp keeps its word, so it doesn't rely on colour. |
| Accessibility | The stamp's source list must open with the keyboard and close with Escape, and overlay rather than push content (the dropdown rule). | Medium | A summary or details disclosure with an overlay popover, retested on phones. |

### Board pass

- **Rams, Maeda:** back A as the base: the least interface that still tells the truth. Stamps only where a fact needs a source, never as ornament.
- **Eames:** back C's handoff for a later sprint. It's the real moment people pass work between shifts.
- **Vignelli, Kare:** reject B as drawn. One shape can't mean three things. Resolve the marker grammar before adding a signal.
- **Norman:** back D with changes. Provenance must look tappable and say "What I compared". The person should be able to see why a signal appeared and dismiss it.
- **Zhuo:** back D. The outcome is decisions a reviewer can audit, and the stamp creates that evidence.
- **Ive:** square stamps, no rotation, one motion (the press).
- **Wroblewski, Clark:** 44px targets. The popover has to fit at 390px.
- **Morris:** strongest support for A + D. People must be able to understand, challenge and override Mellow, and it must state its limits. Proactive signals must be explainable and dismissible.

### Board recommendation for founder decision

1. **Approve A (Margin Note) as Mellow's identity.**
2. **Approve D's provenance, revised:** a square "Compared · files · time" stamp on answers drawn from records, and "Not from your records" on guidance.
3. **Hold B.** Redesign the proactive mark so it doesn't collide with the queue marks, then review it again.
4. **Defer C's handoff** to its own sprint.
5. **Ship the rule-question routing fix** as a hotfix, with the founder's go-ahead.

**Process note.** Versions 1.31 to 1.34 (the contextual panel, the motion and app shell, Ask Mellow from anywhere, and the chat panel) shipped without a team review or board pass. A retro pass is offered.


## Version 1.35 rerun under PRODUCT_TEAM.md · Ask Mellow · 2026-11-25

### Step 0 · Sprint brief (Product Lead)

**Founder goal.** Give Mellow's AI layer a brand and UX moments that are honest about its capabilities, explain how it knows things, speak first only when the situation calls for it, and never promise what it can't determine.

**Problem.** Receiving leads ask Mellow things the matcher wasn't built for, and today it answers some of them in ways that read as compliance judgments or that dodge questions about itself. Nothing on screen shows what an answer was based on.

**Who and how often.** Every shift lead, on every question. The probe below shows 11 of 17 evaluation cases failing in production.

**Success measures.** The evaluation set passes 100%. Every factual answer shows what was compared and when. No answer contains a compliance verdict, a risk score or a prediction.

**Smallest version.** A hotfix for the compliance, command and self-questions. Then provenance on answers. Proactive signals and the handoff come later.

**Out of scope.** Live AI, regulation content, new visual identity work beyond Field Ledger.

### Step 1 · Proposal review by role

| Role | Finding | Severity | Recommendation |
| --- | --- | --- | --- |
| AI UX Designer/Engineer | Ran the proposed evaluation set ([MELLOW_EVALS.md](MELLOW_EVALS.md)) against production: 1 pass, 4 partial, 11 fail. Compliance-bait questions get record lists, commands get no refusal, and "Are you an AI?", "How do you know?" and "What did you check?" all hit the fallback. | **Blocker** (live) | Approve the evaluation set as the gate. Hotfix three intent groups ahead of everything else: compliance questions, decision commands, and questions about Mellow itself. Add the off-topic fix (E1). |
| AI UX Designer/Engineer | Provenance belongs to the answer, not the page. It's computed when the answer is created, from the same run and comparison data. | Info | Add a `basis` to every answer. M2 and M3 ("how do you know") read the last answer's basis. |
| AI UX Designer/Engineer | A proactive signal needs a dismiss and a "why am I seeing this". Otherwise people can't challenge it. | High | Every proactive note says its trigger ("New in the 9:13 check") and can be dismissed. |
| Compliance and Risk | Founder rule "only says Mellow" is safe as a name, but some laws require telling people they're talking to AI. The EU AI Act's Article 50 has applied since 2 August 2026. Utah requires disclosure when clearly asked, and gives a safe harbor for disclosing at the start. Colorado replaced its AI Act with a narrower disclosure law that takes effect 1 January 2027. Mellow is a B2B tool for licensed staff, so many consumer rules may not apply. That's a question for counsel, not the team. | **High** | Keep "Mellow" as the only name. Mellow must answer "Are you an AI?" truthfully (M1). When live AI turns on, show a plain one-line disclosure at the first interaction. Counsel to confirm which laws apply. |
| Compliance and Risk | "CHECKED" on a stamp can read as an attestation. | High | Use "Compared" with the files and time. Guidance is labeled "Not from your records". |
| Compliance and Risk | Commands like "approve PKG-443" get record facts back. Nothing is approved, but the reply never says Mellow can't decide. | High | Covered by the D1 to D3 hotfix. |
| Product Designer (systems and IA) | **System note.** Mellow already speaks first in three places, all with the same pattern: the MELLOW margin label with an italic line (the Today briefing, the Activity summary and the Learn intro). That is Mellow's existing proactive object. A new dot would be a second, competing pattern, and it collides with the queue marks (a filled vermilion dot means records disagree, a ring means a gap). | **High** | Reject the dot. Proactive signals reuse the margin note: a MELLOW label plus one italic line on the record or row. One pattern everywhere. |
| Product Designer (systems and IA) | **System note.** Provenance is a new property of the Answer object, and it points at an existing object, the Check (run). The panel already says "Last check 9:13". | Medium | The stamp reuses that vocabulary: "Compared · 2 files · check at 9:13". No new terms. |
| Product Designer (systems and IA) | There's no written map of objects (package, record, check, issue, decision, handoff, evidence, answer), their states, or where each appears. Today's collisions came from that gap. | Medium | Produce the system map as the first IA deliverable, on the canvas. |
| Product Designer | D's rotated stamps fight the ledger's straight rules. C's handoff fits the shift workflow. | Medium | Square stamps. Defer the handoff to its own sprint. |
| Content and Voice | Self-answers (M1 to M4) need a fixed voice: short, plain and true. "I'm Mellow. I match your question to the records on this device. Live AI is off, so I don't generate answers or judge the law." | High | Write the copy for the hotfix intents, plus the "Compared" and "Not from your records" labels. |
| Content and Voice | C's "we" overstates what Mellow does. | Medium | Keep "I" for Mellow's actions and "you" for decisions. |
| Research and Insights | Evidence base: the 2026-11-24 competitor audit (9 sites), today's production probe, and the legal sources above. There is **no direct user research** on how receiving leads read provenance or proactive notes. | Medium | Treat the provenance and proactive designs as hypotheses. Test with 3 to 5 receiving leads before the proactive sprint. |
| Engineer | The hotfix is small: one routing block ahead of the record intents, three new intents, and evaluation tests. The basis is deterministic. The "seen" state is per device in the demo. | Info | Ship the hotfix with the evaluation tests in CI. Per-user state is an open item for live mode. |
| Accessibility | The prototype dot had a 28px target, under the 44px minimum, and carried meaning by colour alone. The margin-note pattern avoids both. The stamp's popover needs keyboard open and close and must fit at 390px. | High | Margin-note proactive pattern. A disclosure popover for provenance, tested at 390px and with a keyboard. |
| Design Director | Directions A and D fit Field Ledger. B as drawn and C's voice don't. The team agrees there's a live blocker, which changes the sprint order. | Info | Present a two-sprint plan with the hotfix first. |

**Sign-off.** All roles sign off on the plan below. Compliance and Risk's sign-off depends on M1 shipping in the hotfix and on counsel confirming the disclosure question before live AI.

### Step 2 · Board pass

- **Morris:** backs it strongly. Self-explanation (M1 to M3), provenance on every answer, and dismissible, explained proactive notes are what let people understand, challenge and override Mellow.
- **Norman:** backs the hotfix first. Today a person can't tell whether "PKG-443 needs a look" answers "is it compliant". That's a gulf of evaluation.
- **Rams, Maeda:** back A plus the margin-note proactive pattern. One existing pattern beats a new mark. Stamps only where a fact needs a source.
- **Vignelli, Kare:** reject the dot and back the system map. A visual language has to be a system before it gets new marks.
- **Zhuo:** backs D's provenance. The outcome is a decision a reviewer can audit.
- **Eames:** backs C's handoff for a later sprint.
- **Ive:** square stamps, one press motion.
- **Wroblewski, Clark:** 44px targets. The popover must fit at 390px. The margin note works on touch with no hover.

### Board recommendation for founder decision

1. **Hotfix now (sprint 1a).** Route compliance questions, decision commands and questions about Mellow to honest answers (C1 to C5, D1 to D3, M1 to M3, E1). Add the evaluation set to the tests as a gate.
2. **Approve A, Margin Note,** as Mellow's identity.
3. **Approve provenance (sprint 1b):** a square "Compared · files · check time" stamp on answers drawn from records, "Not from your records" on guidance, and "How do you know?" answered from it.
4. **Approve the margin-note proactive pattern** in place of the dot, with its trigger stated and a dismiss (sprint 2, after 3 to 5 user sessions).
5. **Defer C's handoff** to its own sprint.
6. **Commission the system map** (Product Designer) and **counsel review** of AI disclosure before live AI.

### Journey addendum (Universal Experiences), added before the founder decision

The founder adopted the Universal Experiences journey on 2026-11-25, while this review awaited decision. The Product Lead and Research applied it.

| Stage | Mindset | How Ask Mellow affects it today | What the recommendation moves |
| --- | --- | --- | --- |
| **Try** | "Show me it works, without risk." | The demo is where prospects try Mellow. A compliance-bait answer here ("violation?" answered with a gap list) is the first impression a compliance buyer gets, and it can be screenshotted into the Buy decision. | The hotfix protects Try and the Try-to-Buy handoff. **This raises the hotfix's priority.** |
| **Learn** | "Can I trust it?" | "Are you an AI?" and "What can you do?" hit the fallback, so people can't learn Mellow's limits from Mellow itself. | M1 to M4 make Mellow explain itself. |
| **Use** | "Get me through my shift." | Answers don't show what they were based on, so people re-check by hand. | The provenance stamp. |
| **Get help** *(spans all)* | "I'm stuck." | "I can't help with that one yet" is a dead end at every stage. | Every fallback names what Mellow can do and offers a path: a person, the field guide, or a file to compare. |
| **Get started** | "Get me to first value." | The briefing already speaks first with a real finding, which is good. | The margin-note proactive pattern extends what already works here. |

**Journey gaps the team flags.** Buy, Expand and End use have no product surface yet, and End use needs a counsel view of records retention. These are outside this sprint but are recorded for the roadmap.

**Effect on the recommendation.** No change to the six items. The Get help finding is folded into item 1: the hotfix also replaces the dead-end fallback with what Mellow can do and a path forward.


### Steps 3 to 5 · Founder decision, implementation review and preview review (v1.36)

**Founder decision.** Approved all six recommendations ("deploy the build and do it"), including release once the implementation and preview reviews close with no blockers. Sprint 1 builds items 1 (the hotfix and evaluation gate) and 3 (provenance). Item 4, the margin-note proactive pattern, waits for sprint 2 after user sessions. The prototype dot was removed.

| Role | Implementation and preview review | Status |
| --- | --- | --- |
| AI UX Designer/Engineer | The evaluation set is automated: 51 of 51 tests pass, and the production probe of 16 questions now answers all of them honestly. Every existing suggestion chip still routes to the same intent. | Closed |
| AI UX Designer/Engineer | Over-match: "What evidence is required for…" now gets the "can't judge" answer. That's honest, but less helpful. | **Medium**, owner AI UX. Logged as the next evaluation case. |
| Product Designer (systems and IA) | **Found in build:** "Can / Can't" and "Compared" rows showed the hollow ring that means "gap" in the queue. Fixed: non-package rows carry no package mark. The stamp reuses the existing "check at" vocabulary. | Closed |
| Content and Voice | Self, decision, judgment and risk copy is plain, says "I" for Mellow and "a person decides", and contains no verdict words (checked by test). | Closed |
| Compliance and Risk | No compliance verdicts, audit predictions or risk scores in any answer (checked by test). "Compared", never "Checked". "Are you an AI?" is answered truthfully. Counsel review of AI disclosure stays open for live AI. | Closed, plus one open item |
| Accessibility | The stamp is a native disclosure: it opens with Enter or Space, closes with Escape, and has an accessible name. The popover stays inside the viewport at 1440px and 390px. With reduced motion, no animations run. | Closed |
| Engineer | Lint, type check, build and 51 tests pass. No console errors at either width. | Closed |
| Research | No user sessions yet. Provenance comprehension stays a hypothesis for the sprint 2 sessions. | Open, owner Research |

**Preview review result.** No blockers or open highs. Ready for release under the founder's go-ahead.

## Sprint 1 retro · v1.36 · 2026-11-25

The Product Lead was accountable; Research and AI UX were responsible; all other roles were consulted.

### Outcomes against the sprint brief

| Measure | Target | Result |
| --- | --- | --- |
| Evaluation set | 100% pass | Production went from 1 pass, 4 partial and 11 fail to every case passing. 51 of 51 tests now gate release. |
| Factual answers show what was compared | All | Yes, for every record intent (checked by test). |
| No compliance verdicts, risk scores or predictions | None | None (checked by test). |
| User comprehension of the stamp | Unknown | **Not measured.** There have been no user sessions, so we don't know if leads notice or understand it. |

### What worked

- **Testing against production first.** AI UX ran real questions against the live app before designing. That turned "brand options" into a live blocker and re-ordered the sprint around it.
- **Role-named findings.** The Product Designer's systems note (Mellow already speaks first with one pattern) replaced an invented dot with an existing pattern. It also caught the ring-means-gap collision again during the build.
- **The evaluation set as a gate.** It turned "be honest" into 51 tests that fail loudly.
- **Journey lens.** Universal Experiences exposed the Try-to-Buy risk that raised the hotfix's priority.

### What didn't

- **Process slipped before it was written down.** Versions 1.31 to 1.34 shipped with no team or board review. A prototype was started before any review. The first "Team take" note was Claude's own view, labeled as the team's.
- **The charter changed mid-sprint.** The review ran three times as the team was defined (the first pass, the charter rerun, the journey addendum). The decisions were better for it, but it cost time.
- **A risky command reached the safety check.** A hard reset plus a direct push to production was blocked, correctly. Releases now only fast-forward `main` after the founder's go-ahead.
- **No users in the loop.** Research has no way to reach receiving leads, so every user-facing claim is still a hypothesis.

### Follow-ups

| # | Item | Owner |
| --- | --- | --- |
| 1 | Retro board pass on 1.31 to 1.34, which shipped without review | Design Director |
| 2 | Evidence-question over-match ("What evidence is required for…"): decide the expected behavior, add the evaluation case, fix | AI UX |
| 3 | System map of objects, states, surfaces and journey stages | Product Designer |
| 4 | A way to reach 3 to 5 receiving leads, or an agreed proxy | Founder, with Research |
| 5 | Counsel review of AI disclosure before live AI | Founder, with Compliance |
| 6 | Measure time to first finding in Try (journey target under 10 minutes) | Product Lead, Engineer |

### What sprint 2 should measure

Whether people understand what Mellow compared (the stamp) and whether a proactive note helps or interrupts. Both need users or an agreed proxy.

## Sprint 2 brief · "Mellow speaks first well" · 2026-11-25

**Step 0, sprint planning.** The founder set the goal; the Product Lead wrote the brief.

**Founder goal.** Mellow speaks first only when the situation calls for it, with a deterministic fact the person needs now, in a way that helps and never interrupts. (Founder rule 4, and board recommendation 4.)

**Problem.** Today Mellow speaks first in one place, the Today briefing, which runs once at the top. New differences, a delayed check, or a handoff coming due during a shift go unsaid unless the person asks. A noisy or vague signal would be worse than silence.

**Journey.**

| Stage | Mindset | Outcome this sprint should move |
| --- | --- | --- |
| Use | "Help me get through my shift." | A new finding reaches the person at the record or row where they'll act on it. |
| Get started | "Get me to first value." | The first session's briefing and notes point to the first record to fix. |
| Get help *(spans all)* | "I'm stuck." | Every note says why it appeared and can be dismissed, so a note never becomes a blocker. |

**Hypothesis.** A one-line MELLOW margin note on the record or row, saying the trigger and when ("New in the 9:13 check"), helps leads act sooner without feeling interrupted.

**Success measures.**
- The P1 to P3 evaluation cases are automated and pass.
- No note fires without a deterministic trigger (checked by test).
- In sessions, at least 4 of 5 leads can say what a note means and why it appeared without help. At most 1 of 5 calls it interrupting.

**Scope and order.**

| # | Work | Owner | Gate |
| --- | --- | --- | --- |
| 1 | System map: objects, states, surfaces, where Mellow speaks, and journey stages | Product Designer | Feeds the proposal |
| 2 | Session plan and script for 3 to 5 receiving leads | Research | The founder recruits |
| 3 | Proposal: the margin-note proactive pattern, with its triggers, placement, copy, dismiss and "why am I seeing this" | Product Designer, AI UX, Content | Step 1 review, then step 2 board |
| 4 | Evaluation cases P1 to P3, plus the evidence-question case | AI UX | Before build |
| 5 | Sessions on a clickable prototype of #3 | Research, with the founder | Before build |
| 6 | Build, implementation review and preview review | Engineer, with all roles | Founder release decision |

**Folded in from the retro.** The evidence-question over-match fix (#4). The retro board pass on 1.31 to 1.34 runs with this sprint's board pass.

**Out of scope.** Live AI, the handoff (direction C), and Buy, Expand and End use.

**Dependencies.** The founder lines up 3 to 5 receiving leads. Build waits for the session findings.

### Sprint 2 · proposal review by role · v1.37 proposal

Proposal on the canvas page "Sprint 2 · Mellow speaks first": the system map, the margin-note proactive pattern on Today, and the note states and rules. The founder couldn't recruit, so Research ran **synthetic** sessions with five fictional archetypes ([research/archetypes.md](research/archetypes.md); results in [research/sprint-2-synthetic-sessions.md](research/sprint-2-synthetic-sessions.md)). The founder's request; evidence grade weak.

| Role | Finding | Severity | Recommendation |
| --- | --- | --- | --- |
| Product Designer (systems and IA) | **A collision is already live.** The filled vermilion dot means three things today: "records disagree" (queue and answers), "you're on this record" (NOW), and "a conversation is waiting" (Ask Mellow button, shipped in 1.33). A proactive dot would have made four. | **High** | The filled dot means "disagree" only. NOW keeps its word and loses the dot. Ask Mellow shows "1 waiting". Proactive "new" is the word NEW. |
| Product Designer (systems and IA) | A Note is a new object with states: shown, dismissed, and expired (once its record is opened or decided). It must not change the Issue's state. | Medium | Add Note to the system map and spec. Dismissing hides the note, never the record. |
| Product Designer | On a phone, the queue is a collapsed sheet, so row notes can go unseen. | High | Carry it in the briefing line and the sheet bar ("4 need you · 1 new"). |
| AI UX Designer/Engineer | All four triggers are deterministic (a check, a record change, a source status, a handoff timestamp). "Why this?" reuses the stamp's vocabulary. | Info | Add cases before build: P4 (more than two new in one check makes one batched line), P5 (a dismissed trigger never fires again), P6 (no note while a dialog is open). |
| AI UX Designer/Engineer | Evidence-question over-match from sprint 1: "What evidence is required for PKG-443?" | Medium | Expected behavior: one line, "I can't say what the law requires", then the label-check guidance with "Not from your records". Add it as a case and fix it in this sprint. |
| Content and Voice | "Since 8:43" reads as the person's last visit (predicted by A2). The delayed-source note promises "I'll say when it's back". | Medium | Use "Since the 8:43 check". Keep the promise only if the build includes the source-restored note. |
| Compliance and Risk | Dismissing hides information without a trail (predicted by A3). Notes contain no verdicts or risk words. | Medium | Log notes shown and dismissed in Activity as Mellow events, never as decisions. |
| Accessibility | Vermilion `#C73E22` small text is 4.27:1 on tint-soft (**fails** 4.5:1) and 4.58:1 on paper (barely passes). Dismiss and "Why this?" are 44px. The briefing update needs one polite announcement per check, not one per note. | **High** | Small vermilion text (NEW, the "1 new" counts) uses vermilion-dark `#A93319` (5.97:1). Use `aria-live="polite"` on the briefing line only. |
| Engineer | The demo has no checks arriving on their own. Notes would only appear after a person compares files, so Try never shows the feature. | Medium | Add "Simulate a new check" next to "Simulate a delay". Store note state per device for now. |
| Research and Insights | Synthetic tally: 4 of 5 noticed unprompted, 5 of 5 said what it means, 4 of 5 why, 0 of 5 interrupting, and 1 of 5 misread "Compared". **This doesn't meet the success measure, which needs real leads.** | Medium | Treat the success measure as open. Real sessions remain debt, with "Compared" first on the list. |
| Product Lead | The mark-grammar fix touches shipped UI (NOW and the Ask button), so scope grows. It's a precondition for the feature. | Info | Include it. Out of scope stays as briefed. |
| Design Director | Fits Field Ledger. The one-pattern rule (the margin note) now holds across every place Mellow speaks first. | Info | Present for decision. |

**Sign-off.** All roles sign off with the changes above. Research's sign-off is conditional: synthetic evidence only.

### Sprint 2 · board pass, including the retro pass on 1.31 to 1.34

**On the proposal.**
- **Rams, Maeda:** back it. One pattern, four triggers, and a "never" list is restraint by design.
- **Vignelli, Kare:** strongly back the mark-grammar fix: one shape, one meaning. Words for state (NOW, NEW, 1 waiting).
- **Norman:** backs "Why this?" and dismiss. Wants "Since the 8:43 check" (a gulf of evaluation).
- **Morris:** backs it. Notes are explainable, dismissible and logged, and the person stays in control.
- **Zhuo:** backs logging in Activity. The outcome is a reviewable shift.
- **Eames:** backs batching. It matches how deliveries arrive in bursts.
- **Wroblewski, Clark:** back the phone sheet bar and 44px controls. They want a real phone session.
- **Ive:** one arrival motion, no motion on update.

**Retro pass on what shipped without review.**

| Version | What shipped | Board finding | Action |
| --- | --- | --- | --- |
| 1.31 | A contextual, collapsible side panel | Collapsed by default on phones, which hides the queue (Wroblewski). It surfaced again in this proposal. | Covered by the sheet bar's "1 new". |
| 1.32 | Organic motion, a pinned app bar, columns that scroll independently | Reduced motion is respected. Two scroll areas can hide that there's more content (Norman). | Low. Revisit with real sessions. |
| 1.33 | Ask Mellow from anywhere | The waiting dot reuses the "disagree" dot (Vignelli, Kare). | Fixed by this proposal ("1 waiting"). |
| 1.34 | The tinted chat panel | Clear separation of task and chat. No issues. | None. |

### Board recommendation for founder decision

1. Approve the **margin-note proactive pattern**: four triggers, "Why this?", dismiss, and batching when there are more than two.
2. Approve the **mark-grammar fix**: the filled dot means "disagree" only. NOW without a dot. Ask Mellow shows "1 waiting". NEW is a word.
3. Approve the **copy and access changes**: "Since the 8:43 check", vermilion-dark for small red text, and one polite announcement per check.
4. Approve **logging notes** in Activity as Mellow events, not decisions.
5. Approve **"Simulate a new check"** so Try shows the feature, plus the **evidence-question fix**.
6. Decide whether **synthetic evidence is enough to build**. The board's view: build it, because the pattern is conservative and reversible. Keep the success measure open until real leads try it.


### Sprint 2 · implementation and preview review · v1.37

| Role | Finding | Status |
| --- | --- | --- |
| AI UX Designer/Engineer | `notes.ts` is pure and deterministic. P1 to P6, E5 and the trail are tested: 62 of 62 tests pass. | Closed |
| AI UX Designer/Engineer | "Your open record changed" can't happen in the demo, because sample records never update. It's deferred until live source sync. **This deviates from the approved four triggers; founder to note.** | Deferred, owner Engineer |
| Engineer | **Found in build:** a later check (such as restoring the source) cleared NEW, contrary to the spec. Fixed so NEW lasts until opened, and added a test. | Closed |
| Engineer | **Found in build:** "Since the 10:41 check, the 10:41 check…" when two checks land in the same minute (a demo artifact). Same-minute checks now drop "Since". | Closed |
| Compliance and Risk | **Found in build:** the Activity trail lost notes that a later note replaced. The trail is now derived from the events that create notes, so nothing drops out. | Closed |
| Product Designer (systems and IA) | **Found in build:** the "Why this?" overlay was see-through under the next queue row (each row's animation makes its own layer). Fixed. Simulated rows said "Import"; they now show the check that found them. | Closed |
| Product Designer (systems and IA) | The mark grammar is fixed: the dot means "disagree" only, and NOW, NEW and "1 waiting" are words. | Closed |
| Accessibility | Dismiss and "Why this?" are 44px. "Why this?" opens with the keyboard and closes with Escape. Small vermilion text is vermilion-dark. The briefing note is announced politely. With reduced motion, no animations run. No console errors at 1440px or 390px. | Closed |
| Content and Voice | No interpretive or risk words in any note (checked by test). "Since the 8:43 check" wording is in place. | Closed |
| Research | Synthetic evidence only. The success measure stays open. | Open, owner Research |

**Preview review result.** No blockers. One deviation for the founder to note: the record-changed trigger is deferred.

### Product Excellence Review · v1.37 · 2026-11-25

Run under MELLOW_EVALS.md Part 2. **Evidence grade: Synthetic.** The users were the five fictional archetypes (Dana, Marcus, Priya, Luis and Jo), with the team and the board in the room. The scorecard is on the canvas ("Product Excellence Review · v1.37").

**Scorecard.** Ratings are Excellent (E), Good (G), Friction (F), Broken (B), Not served (NS) and N/A (–).

| CUJ | Discover | Learn | Try | Buy | Get started | Use | Get help | Expand | End use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 · Resolve a mismatch on shift | – | – | – | – | G | **F** (Dana: on a phone the queue hides behind Show, so NEW rows are out of sight) | G | – | – |
| 2 · Ask Mellow and trust the answer | – | G | – | – | G | **F** (Luis: reads "Compared" as "approved") | G | – | – |
| 3 · Try Mellow on our own files | **NS** (no way in but a URL) | **F** (limits found only by asking) | **F** (exact CSV columns needed, no template; Simulate is hidden in a fold) | **NS** | **NS** (no setup for real sources) | G | G | – | **NS** (no clear-my-data control) |

**Handoffs.** Get started → Use: Good. Use → Get help: Good. **Try → Buy: Not served.** A buyer leaves with nothing to show an approver.

**Provocations (recorded verbatim).**
- Product Lead: "If a buyer tries Mellow for ten minutes, what do they leave with to show their boss?"
- Research: "Would a real lead ever open 'What I checked' to find 'Simulate a new check'?"
- AI UX: "What if tapping a note opened the conversation with 'Why this?' already asked?"
- Product Designer: "Should the stamp lead with *what* was compared, so 'Compared' can't read as a verdict?"
- Content: "Do we need a separate note line, or can the briefing itself update in place, in one voice?"
- Compliance: "Can an inspector get the Activity trail as a file?"
- Accessibility: "How does a screen-reader user hear a new note mid-form?"
- Engineer: "What happens when checks arrive every five minutes instead of on demand?"
- Design Director: "What would make Mellow's first sixty seconds unforgettable?"
- Rams: "With one new item, do we need both the briefing note and the row note?"
- Norman: "What's the person's model of a 'check'? Do they know one ran?"
- Morris: "Can a person tell Mellow a note wasn't useful?"
- Eames: "Where does a shift really start? At clock-in, not at the briefing?"
- Wroblewski: "Why is the queue hidden on the device most leads use?"

**How might we, plus a bold idea.**

| # | How might we… | Bold idea |
| --- | --- | --- |
| 1 | …make "Compared" impossible to misread? | Lead with the evidence: "2 files · row 2 · 9:13", with a one-line before-and-after preview of the two records. |
| 2 | …get a buyer from Try to Buy? | "Share these findings": a one-page evidence summary (what was compared, what differed, no verdicts) to forward to an approver. |
| 3 | …make Try on your own files take under 10 minutes? | Drop in any CSV. Mellow maps the columns, previews 5 rows, then compares. A downloadable template. |
| 4 | …put new work in front of phone-first leads? | On a phone, Today leads with "Your next package", and the sheet opens to the NEW row. |
| 5 | …let people correct Mellow? | "Not useful" on a note, with a reason, logged and used to tune triggers. No AI needed. |
| 6 | …show what Mellow does without hunting for demo controls? | "Watch a shift": a guided Try mode that plays a scripted day, with checks arriving and notes appearing. |
| 7 | …make the trail inspector-ready? | Export decisions and Mellow notes as a dated PDF or CSV. |

**Gate check.**
- No Broken cells: **met**.
- Every Friction cell has an owner and a sprint 3 slot:
  - **CUJ 1 Use:** Product Designer (idea 4)
  - **CUJ 2 Use:** Content and Research (idea 1, plus real sessions)
  - **CUJ 3 Learn:** Content
  - **CUJ 3 Try:** Product Designer and Engineer (ideas 3 and 6)
- Not served stages are listed for founder acceptance: CUJ 3's Discover, Buy, Get started and End use, plus the Try → Buy handoff.
- The evaluation set passes, 62 of 62.

**The gate is met, pending the founder's acceptance of the Not served list.**

## Marketing site audit · `mellow-landing-FINAL.html` · 2026-11-25

The founder found the marketing page and asked for it to be brought up to the current specs. Before any redesign, the team audited it. The canvas page "Marketing site · audit" has the full-page render and its demo results.

| Role | Finding | Severity |
| --- | --- | --- |
| Compliance and Risk | **Fabricated testimonials.** Three quotes with names, real-sounding companies and states, five stars and "Verified pilot". There was no pilot with these people. They can't be published, and any future testimonial needs a real person's consent. | **Blocker** |
| AI UX Designer/Engineer | **A fake analysis.** "Upload your own CSV" ignores the file and plays a canned run: "Sunrise Wellness · Denver, CO", "Parsing 847 inventory records", and the same three issues for any file. | **Blocker** |
| Compliance and Risk | **Verdicts and scores.** A readiness score that rises from 74% to 91% as you click "Mark resolved", "Not Ready" turning to "Ready", "Always audit-ready", "Audit packet ready", and "Walk into any inspection confident". This breaks MELLOW_CORE (no readiness values) and founder rule 5 (no compliance verdicts or predictions). | **Blocker** |
| Compliance and Risk | **Invented regulatory claims.** "This will flag in any routine inspection and can result in a hold", "will trigger a discrepancy on inspection", "recommended cadence is every 3 to 5 days", "why it matters under your state's requirements". State rules aren't loaded. | **Blocker** |
| Compliance and Risk | **The lead form goes nowhere.** It takes name, email, dispensary and state, then says "You're on the list" and promises contact within 24 hours, alongside privacy promises. No data is sent or handled. | High |
| Content and Voice, Engineer | **Capability claims the product can't back:** "No formatting required" (it needs `package_id` and `lot_number`), "no integrations required", "always watching" and "monitors continuously", "1-click audit packet export", Metrc transfer status, expiry and waste-log checks, "100% your data stays private", "60s to first readiness score". | High |
| Design Director | **The retired look:** Evergreen greens, Inter, pill buttons, glass blur and shadows. A pulsing green dot next to the wordmark breaks the mark grammar (the dot means "records disagree"). | High |
| Product Designer (systems and IA) | **It depicts a product that doesn't exist** (Dashboard, What to Fix, Issue Detail, Audit Trail with a dark green main panel). The real demo (Today, Activity, Learn, Ask Mellow) is never linked. | High |
| Research and Insights | In journey terms, this page is **Discover, Learn, Try and Buy**. It fakes Try instead of handing off to the real demo, and Try → Buy ends at a form that goes nowhere. It's the "Not served" Discover stage from the v1.37 review, and fixing it closes the Try → Buy handoff. | High |
| Accessibility | Placeholders used as labels; navigation items are `div`s; "✕" has no accessible name; the modal doesn't move or trap focus; white text at 38 to 50% opacity; blinking dots and animations ignore reduced motion. | Medium |
| Compliance and Risk | Four embedded photos, licenses unknown. One shows people in a store. | Medium |
| Engineer | A leftover "Download HTML" button floats over the page. It's a single 913 KB file with duplicated CSS. | Low |

**Team recommendation.** Rebuild it, don't reskin it.
- **Look and story:** Field Ledger, and an honest story in Mellow's voice: what Mellow compares, what it won't judge, and what you see in two minutes.
- **Primary CTA:** opens the real demo.
- **Lead capture:** waits for a real destination and a privacy policy, or becomes a plain "Email us".
- **Testimonials:** none until there are real, consented ones.
- **Photos:** only with a known license.
- **Timing:** fold it into sprint 3 with the Try → Buy work.

**Open question for the founder:** is this page published anywhere? If it is, the blockers should come down now.

## Sprints 3 and 4 · briefs · 2026-11-25

**Founder goal for both sprints.** By the end of sprint 4, every one of the nine Universal Experiences stages is served honestly. The Product Lead split the work by where people are in the journey.

**Journey coverage.** Ratings come from the v1.37 Product Excellence Review; targets are what each sprint must reach.

| Stage | Now (v1.37) | After sprint 3 | After sprint 4 | Carried by |
| --- | --- | --- | --- | --- |
| Discover | Not served | **Good** | Good | Rebuilt marketing site |
| Learn | Friction | **Good** | Good | The site's "does and doesn't" list; "What can you do?" in the app |
| Try | Friction | **Good** | Good | Sample bar; own files in under 10 minutes; a template |
| Buy | Not served | **Good for an early product** | Good | "Share these findings"; an honest pilot contact |
| Get started | Not served (own data) | Friction (first value only) | **Good** | Guided import (sprint 3); workspace setup with saved column mappings (sprint 4) |
| Use | Friction | Friction | **Good** | "Compared" leads with the evidence; phone leads with the next package |
| Get help | Good | Good | **Good+** | "Not useful" on notes; a Help entry that explains Mellow's limits |
| Expand | Not served | Not served | **Good for an early product** | A second store's files as a separate workspace |
| End use | Not served | Not served | **Good** | Export the trail for inspectors; "Clear this device's data" with a plain account of what's kept |

### Sprint 3 brief · "From first look to yes"

- **Stages:** Discover, Learn, Try, Buy. Handoffs: Discover → Try, Try → Get started, Try → Buy.
- **Problem:** there's no honest way in. The only marketing page fakes its demo, scores and testimonials. In the real demo, the controls are buried, your own files need exact column names, and a buyer leaves with nothing to show an approver.
- **Scope:**
  1. Rebuild the marketing site in Field Ledger, from the audited draft.
  2. A sample bar on Today with the demo controls and "Use my files".
  3. Bring your files: a template, column matching by common names, a 5-row preview, and a question whenever Mellow can't tell.
  4. "Share these findings": a printable one-page summary with no verdicts.
- **Success measures:**
  - Every claim on the site is verified against the product (Compliance checklist, 100%).
  - Own files to a first finding in under 10 minutes in a timed walkthrough.
  - CUJ 3 has no Not served cell for Discover or Buy.
  - The evaluation set gains cases for column matching and the summary text, and passes.
- **Out of scope:** pricing and billing, accounts, a server, and live Metrc.

### Sprint 4 brief · "Trust on the floor, and a clean way out"

- **Stages:** Get started, Use, Get help, Expand, End use.
- **Scope:**
  1. Workspace setup: name it, save column mappings, and a first-day checklist.
  2. "Compared" leads with the evidence ("2 files · row 2 · 9:13").
  3. On a phone, Today leads with "Your next package".
  4. "Not useful" on notes, with a reason, logged.
  5. Export the decision and note trail for an inspector (CSV and print).
  6. "Clear this device's data", with a plain account of what's stored and where.
  7. A second store as a separate workspace (Expand).
  8. A Help entry for Mellow's limits.
- **Cut line (Product Lead):** if time runs short, #7 slips to sprint 5 and Expand stays Not served, accepted by the founder.
- **Dependency:** real user sessions stay open debt. Sprint 4 measures "Compared" comprehension with synthetic sessions only, unless leads are recruited.

## Sprint 3 · proposal review by role

Proposal on the canvas page "Sprint 3 · From first look to yes": the marketing site draft at 1440px and 390px, and the Try → Buy flows (the sample bar, bring your files, share these findings).

| Role | Finding | Severity | Recommendation |
| --- | --- | --- | --- |
| Compliance and Risk | Every site claim was checked against the code: no network calls, so comparisons run in the browser; `package_id` and `lot_number` are required; one row per package; 2 MB limit. No testimonials, photos, scores or verdicts. The footer says it isn't legal advice or a compliance assessment. | Info | Add a release-checklist line: "Your files stay in your browser" must be rewritten the day any server handles customer files. |
| Compliance and Risk | "Pilot it with us" and the contact line promise things only the founder can confirm. | High | The founder confirms the offer, the contact address, and whether to say anything about price. |
| Content and Voice | The phone section claims "what's new since the last check", but its screenshot shows only the count. The site mentions the findings summary, which only exists once sprint 3 ships. | Medium | Swap in a screenshot that shows "· 1 new". The site launches together with the sprint 3 build, never before it. |
| Product Designer (systems and IA) | The site's navigation maps to the journey: What it does (Learn), How a shift goes (Use, previewed), Try it on your files (Try), Bring it to your team (Buy). New objects: **Workspace** (sample or your own) and **Findings summary** (derived from a Check; no new state). | Info | Add both to the system map. |
| Product Designer (systems and IA) | **Where the site lives decides an entry point.** Today `/` is the demo, and AGENTS.md says to preserve established entry points. | High | The founder decides: site at `/` with the demo at `/demo`; site at `/welcome` with the demo staying at `/`; or a separate domain. |
| Product Designer | On a phone, the hero screenshot is a scaled-down desktop page and can't be read. | High | Show the phone screenshot at small widths. |
| AI UX Designer/Engineer | Column matching must be deterministic: a fixed list of known names, always a preview, a question when unsure, never a silent guess. | Info | Evaluation cases before build: a missing lot column, two candidate columns, duplicate IDs, blank lots, and summary text containing no verdict words. |
| Accessibility | The site has a skip link, semantic headings, alt text, 48px CTAs and AA contrast, and no motion beyond smooth scrolling, which honors reduced motion. The mapping step must use native `select`s with labels. The summary needs a print stylesheet. | Medium | Build to those rules. |
| Engineer | The site is a static page in the repo; the template is a CSV file. Column matching generalizes `lotRecords`. The summary is a printable view in the app. One sprint. | Info | None. |
| Research and Insights | A synthetic walkthrough with the five archetypes (weak evidence). **Jo** (the owner) understood "does and doesn't" in one read and liked "no form, no list", but asked "What does it cost?", which the site doesn't answer. **Priya** (compliance) asked where files go in a real deployment, since the site only covers the demo. **Marcus** asked about several stores (Expand, sprint 4). **Luis** said the template "would save me." **Dana** couldn't read the hero screenshot on her phone. | Medium | The price question goes to the founder. "In a real deployment" data handling goes in sprint 4 (End use). |
| Design Director | The first fully Field Ledger customer-facing surface, coherent with the product. | Info | Present for decision. |

## Sprint 3 · board pass

- **Morris:** strongly backs it. The "does and doesn't" list sets accurate expectations of an AI-like tool before anyone tries it.
- **Rams, Maeda:** back it. Honesty is the design. Keep the page short: no feature grid, no stats band.
- **Norman:** backs the column preview. It shows the system's status before anything is committed.
- **Zhuo:** backs "Share these findings". A buyer leaves with an artifact an approver can act on.
- **Eames:** backs a human pilot contact over a form.
- **Vignelli, Kare:** back the type system carrying over intact. Keep vermilion for the "Doesn't" heading only.
- **Wroblewski, Clark:** fix the phone hero. Test the import on a phone. (Can a lead pick files at the dock?)
- **Ive:** product shots framed with a 1px ink rule and 4px corners, matching the app.

**Board recommendation.**
1. Approve both sprint briefs and the coverage targets.
2. Approve the sprint 3 proposal with the review changes (the phone hero, the phone screenshot, a launch tied to the build).
3. The founder decides where the site lives.
4. The founder confirms the pilot offer, the contact address and any price line.


## Sprint 3 · founder decision, implementation, preview and Product Excellence Review · v1.38

**Founder decision (2026-11-25).** Approved the sprint 3 and 4 briefs and the sprint 3 proposal. Contact email: the founder's own. **No pilot and nothing about price**, because Mellow is an end-to-end prototype and that strategy comes later. Where the site lives wasn't answered, so the team took the option that preserves the established entry point: `/welcome/`, with the demo staying at `/` (reversible).

### Implementation and preview review

| Role | Finding | Status |
| --- | --- | --- |
| Compliance and Risk | **Caught in our own draft:** the site said "up to 2 MB per file", but comparing two files is limited to 500 KB each (2 MB is the single-file import). Corrected. | Closed |
| AI UX Designer/Engineer | **Caught in build (honesty):** answers about packages from your own files were stamped "Compared · 2 files" and listed the *sample* files, with an all-packages count. Provenance now comes from the file set each package came from, with its own count and a "compared at" time. Added test P-1. | Closed |
| Content and Voice | **Caught in build:** the summary would have printed the internal decision name "Approved", which reads as a sign-off. It now uses the app's words ("Issue recorded"). Added test S2b. | Closed |
| Compliance and Risk | A disclaimer only at the foot, in small grey type, may not survive a photocopy. Added a mono line under the title: "A comparison of two files. Not a compliance assessment." | Closed |
| Product Designer | **Caught in build:** the share dialog opened pinned to the top-left, and the column step pushed "Compare 2 files" below the screen. Both dialogs now centre, scroll their body and keep their buttons in view at 1440px and 390px. | Closed |
| Product Designer (systems and IA) | Two doors now open the same dialog: "Compare files" in the briefing and "Use my files" in the sample bar. | Medium, sprint 4: one door. |
| Engineer | Lint, type check, build and 74 tests pass. No horizontal overflow on Today, Activity or Learn at 390px, 1024px and 1440px. No console errors. The site makes no third-party requests, all its links resolve, and its fonts load locally. | Closed |
| Accessibility | The Tab order follows the page. The skip link is first on the site. Native `select`s have labels, and an unchosen column is marked invalid. With reduced motion, nothing animates. Dialogs close with Escape. | Closed |

### Product Excellence Review · v1.38 · synthetic

The users were the five fictional archetypes, with the team and the board in the room. **Evidence grade: Synthetic.**

**Found Broken during the walk, fixed before scoring.** Luis compared his files, the page reloaded, and Mellow said "I don't see PKG-1002 in today's records" while PKG-1002 sat in his queue, stamped against the sample. Mellow contradicted its own queue. Rows from your comparisons are now saved with the queue, and reset clears them (evaluation case E6).

| CUJ | Discover | Learn | Try | Buy | Get started | Use | Get help | Expand | End use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 · Resolve a mismatch | – | – | – | – | G | **F** (phone: the queue sits behind Show) | G | – | – |
| 2 · Ask and trust | – | G | – | – | G | **F** ("Compared" may still read as "approved") | G (it names your own files now) | – | – |
| 3 · Try on our own files | **G** (the site, with an honest "does and doesn't") | **G** | **G** (sample bar, templates, column matching, preview) | **G for a prototype** (share findings; pricing and approval out of scope by founder) | **F** (a one-off import; column choices aren't remembered) | G | G | **NS** (sprint 4) | **NS** (sprint 4; "Reset sample" is a partial) |

**Handoffs.** Discover → Try: Good ("Open the demo"). Try → Buy: **Good** (was Not served). Try → Get started: Friction.

**Movement since v1.37.** Discover went from Not served to Good, Learn from Friction to Good, Try from Friction to Good, Buy from Not served to Good for a prototype, and Try → Buy from Not served to Good.

**Provocations (recorded verbatim).**
- Product Lead: "A lead opens the site on a phone at the dock. Can they even get their export files onto a phone?"
- Research: "In a one-store shop, who is 'whoever signs off'?"
- AI UX: "Should Mellow remember a file's column choices next time?"
- Product Designer: "Two doors to the same dialog. Which one survives?"
- Content: "Is 'Fictional records' the clearest way to say sample?"
- Compliance: "Does the summary say who made each decision?"
- Accessibility: "Has anyone read the printed PDF with a screen reader?"
- Engineer: "What does a 500 KB, 10,000-row file feel like on a cheap phone?"
- Design Director: "Is the site's first screen memorable, or merely correct?"
- Norman: "Does a person know their files were added to the queue, not swapped in for it?"
- Rams: "Could the sample bar step aside once someone uses their own files?"

**How might we, plus a bold idea.**

| # | How might we… | Bold idea |
| --- | --- | --- |
| 1 | …make the second import effortless? | Remember column choices by file name pattern, then go straight to the preview. |
| 2 | …try from a phone when exports live on a desktop? | "Send this to my computer": a plain link to copy, with no account. |
| 3 | …show that files were *added*? | A margin note with a deterministic trigger: "Added 2 from your files: PKG-1002, PKG-1003." |
| 4 | …give the summary a human signature? | A name field on the summary, typed by the person and never inferred. |
| 5 | …make the first screen unforgettable? | Lead with one live comparison: two lot numbers side by side, disagreeing, in big type. |

**Gate check.**
- No Broken cells: **met** (one found and fixed before scoring).
- Every Friction cell has an owner and a sprint 4 slot: CUJ 1 Use (phone next package), CUJ 2 Use ("Compared" clarity), CUJ 3 Get started (workspace setup, remembered columns).
- Not served: Expand and End use, the sprint 4 targets, which the founder accepted as part of the plan.
- The evaluation set passes, 74 of 74.

**The gate is met. Awaiting the founder's release decision.**
