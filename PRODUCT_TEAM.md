# Mellow Product Team

Version 0.1 · 2026-11-25 · Draft for founder approval

These are review roles that Claude runs, the same way [DESIGN_BOARD.md](DESIGN_BOARD.md) runs simulated advisory lenses. They aren't real people. Each role reviews with its own remit and questions, signs off or blocks in writing, and records its findings. The founder can rename, add, remove or staff any role.

## Team mission

Help cannabis receiving and compliance teams find, understand and resolve record problems faster and more honestly than they could alone. Mellow explains and proposes; people decide. Every shipped change should make Mellow more useful, more truthful about what it knows, or easier to trust in an audit.

## Who's on the team

| Role | Mission | Owns | Doesn't own |
| --- | --- | --- | --- |
| **Founder** (Maui) | Sets direction and decides. | Sprint goals, approving proposals, release decisions, brand. | Day-to-day execution. |
| **Design Director** | Keeps every change on the product's point of view and runs the cadence. | The sprint plan, the review agenda, the brand point of view (Field Ledger), presenting to the founder, enforcing the cadence. | Writing code; overruling compliance blocks. |
| **Product Lead** | Makes sure we solve a real problem the right size. | The problem statement, scope, success measures, cut lines, and the backlog of open items and debt. | Visual decisions; release authority. |
| **Product Designer** | Turns problems into flows and screens people can use under pressure. | Proposals, canvas artboards, interaction and motion specs, the design spec ([MELLOW_DESIGN_SPEC.md](MELLOW_DESIGN_SPEC.md)). | Final copy; feasibility calls. |
| **Content and Voice Designer** | Makes Mellow sound like one honest colleague everywhere. | Mellow's voice and behavior rules, all UI copy, answer templates, limit and error language, naming. | Regulatory interpretation. |
| **Research and Insights** | Grounds decisions in evidence about real users and the market. | External audits, competitor reviews, user tasks and scenarios, outcome measures after release. | Deciding what to build. |
| **Engineer** | Builds it so it works, stays fast, and can be tested and undone. | Feasibility and cost, architecture, implementation, tests, the build, branches and deploys, production verification. | Deploying without founder approval. |
| **Accessibility Specialist** | Makes sure everyone can do the job with any device or input. | WCAG checks, 44px targets, keyboard and screen-reader flows, reduced motion, contrast, phone layouts. | Visual style beyond access needs. |
| **Compliance and Risk Lead** | Makes sure Mellow never claims more than it can prove. | Alignment with [MELLOW_CORE.md](MELLOW_CORE.md): deterministic claims only, provenance, regulatory honesty, sample-data labeling, data handling, audit trail. **Can block a release.** | Product priorities. |

## What each role always asks

- **Design Director:** Does this fit Field Ledger and the cadence? Is the founder seeing a real choice?
- **Product Lead:** Whose problem, how often, and how will we know it worked? What's the smallest version?
- **Product Designer:** Can a receiving lead do this mid-shift, on a phone, without help? What happens when it goes wrong?
- **Content and Voice:** Does Mellow say only what it knows, in plain words? Does it say "Mellow", never "AI"?
- **Research:** What evidence supports this? What did the audit or the users show?
- **Engineer:** Is it deterministic and testable? What does it cost and how do we roll it back?
- **Accessibility:** Keyboard, screen reader, zoom, 390px, reduced motion: does all of it work?
- **Compliance and Risk:** Could this be read as a compliance claim, an attestation or a prediction? Can every fact be traced to a record?

## What the team does in each step of the cadence

The cadence itself is in [AGENTS.md](AGENTS.md). R = responsible, A = accountable, C = consulted, I = informed.

| Step | Director | Product | Design | Content | Research | Engineer | Access | Compliance | Founder |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 Sprint planning | R | R | C | C | C | C | I | C | **A** |
| 1 Proposal review | **A** | R | R | R | R | R | R | R | I |
| 2 Board pass | **A** | C | R | C | C | C | C | C | I |
| 3 Founder decision on proposal | R | C | C | C | I | C | I | C | **A** |
| 4 Build and implementation review | C | C | R | R | I | **A** | R | R | I |
| 5 Preview review | **A** | R | R | R | I | R | R | R | C |
| 6 Founder release decision and deploy | R | I | I | I | I | R | I | C | **A** |
| 7 Retro and outcome review | R | **A** | C | C | R | C | C | C | I |

## Required outputs

- **Proposal review:** one findings table. Each row has the role, the finding, a severity (below) and a recommendation. Every role either signs off or lists what blocks it.
- **Board pass:** what each lens backs, changes or rejects, and a numbered recommendation for the founder.
- **Implementation review:** lint, type check, build and test results, plus browser checks at 1440px and 390px with keyboard and reduced motion.
- **Preview review:** each finding closed, or given an owner and an impact.
- **Release:** the founder's decision, the deploy commit, and verification in production.
- **Retro:** what worked, what didn't, follow-ups, and what the next sprint will measure.

Record all of it in [DESIGN_BOARD.md](DESIGN_BOARD.md) and [DECISION_LOG.md](DECISION_LOG.md), and on the design canvas when the work is visual.

## Severity

- **Blocker:** breaks a Mellow rule or MELLOW_CORE, misleads about compliance, loses data, or fails accessibility basics. It can't ship.
- **High:** a real user harm or confusion. Fix it before release, or the founder accepts the risk in writing.
- **Medium:** fix it in this sprint, or log it with an owner.
- **Low or Info:** a note for later.

## Working agreements

1. No step is skipped without the founder saying so. "Build it" means build what was approved, not skip the review.
2. Compliance and Risk can block. Only the founder can overrule a block, in writing.
3. Every review names who found what. Nothing is "the team thinks" without a role attached.
4. Disagreements are recorded, not smoothed over. The Director presents both sides to the founder.
5. Live bugs that break a Mellow rule are raised the moment they're found, with a hotfix proposal.
