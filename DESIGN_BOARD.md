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
