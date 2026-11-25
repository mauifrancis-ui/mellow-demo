# Mellow Product Team

Version 0.1 · 2026-11-25 · Draft for founder approval

These are review roles that Claude runs, the same way [DESIGN_BOARD.md](DESIGN_BOARD.md) runs simulated advisory lenses. They aren't real people. Each role reviews with its own remit and questions, signs off or blocks in writing, and records its findings. The founder can rename, add, remove or staff any role.

## Team mission

Help cannabis receiving and compliance teams find, understand and resolve record problems faster and more honestly than they could alone. Mellow explains and proposes; people decide. Every shipped change should make Mellow more useful, more truthful about what it knows, or easier to trust in an audit.

## How we judge product excellence: the Universal Experiences journey

The team uses IBM's Universal Experiences framework ([Carbon: Building experiences](https://www.carbondesignsystem.com/building-experiences/overview); [IBM Design: Love is a universal experience](https://medium.com/design-ibm/love-is-a-universal-experience-c437570eb693)) as its shared language for the whole customer relationship, not just the screens we ship. Two ideas from it are our bar:

- **Pervasive excellence.** Quality has to hold in every interaction, from the first time someone hears about Mellow to the day they leave. Handoffs between stages are where trust is won or lost.
- **Get help spans every stage.** Help isn't a page. It's how Mellow behaves whenever someone is stuck, ideally before they are.

| Stage | The person's mindset | What it means for Mellow | Outcome we aim for | Lead role |
| --- | --- | --- | --- | --- |
| **Discover** | "Is there something that fixes my record mismatches?" | Finding Mellow and seeing what it does for receiving and compliance work, with honest claims and no compliance guarantees. | They can tell in a minute what Mellow does and doesn't do. | Product Lead, Content |
| **Learn** | "Will it fit how we work, and can I trust it?" | How Mellow compares records, what it can't do (decide, judge the law), where data lives, and what "sample data" means. | Questions are answered before they commit. Limits are clear up front. | Content, Research |
| **Try** | "Show me it works on my problem, without risk." | The sample workspace: a real finding in minutes, with files that stay on the device and nothing to undo. | Time to first finding is under 10 minutes. Nothing a person does in a trial is mistaken for a real record. | Product Designer, AI UX |
| **Buy** | "Can I get this approved and paid for without a fight?" | Owner and compliance approval, a security and data review, and clear pricing. **Not built yet.** | The approver has what they need for sign-off on one page. | Product Lead, Compliance |
| **Get started (Onboard)** | "Get me set up and productive fast." | Connecting inventory and receiving sources (CSV now, Metrc later), the first check, and the first resolved record. | First compared check within 10 minutes of setup. This is a hypothesis to measure, borrowed from IBM's own time-to-value goal. | Product Designer, Engineer |
| **Use** | "Help me get through my shift." | The briefing, queue, record decisions, evidence, Ask Mellow, the handoff, and updates people can see coming. | Daily work gets faster. Advanced features are found when they're needed, not forced. | Product Designer, AI UX |
| **Get help** *(spans all)* | "I'm stuck, so fix it fast and don't make me leave." | Mellow's honest limits, in-product explanations ("How do you know?"), manager handoff, error recovery and drafts that survive. | Most blockers are resolved without leaving the product. No dead-end fallbacks. | AI UX, Content |
| **Expand** | "We're growing. Can it grow with us?" | More sources, more locations and licenses, more jurisdictions, team roles, and live AI once it's approved. **Mostly not built yet.** | Growth adds value without a rebuild or retraining. | Product Lead, Engineer |
| **End use** | "Let me leave cleanly, and keep what I'm required to keep." | Exporting the decision history and evidence, deleting data securely, and records retention by jurisdiction (to be confirmed with counsel). **Not built yet.** | They leave with their records intact and trust intact, open to coming back. | Compliance, Engineer |

**How the team applies it**

1. Every proposal names the stages it touches, the mindset at each one, and the outcome it should move.
2. Every proposal checks the handoffs in and out of those stages. For example, a Try finding has to survive into Get started.
3. Every proposal says how it behaves under Get help: what happens when someone is stuck at that point.
4. Research keeps evidence for each stage's mindset and flags any stage where we're designing without evidence.
5. The Product Designer's system map shows which objects and surfaces serve which stage, and which stages have nothing yet.

## Who's on the team

| Role | Mission | Owns | Doesn't own |
| --- | --- | --- | --- |
| **Founder** (Maui) | Sets direction and decides. | Sprint goals, approving proposals, release decisions, brand. | Day-to-day execution. |
| **Design Director** | Keeps every change on the product's point of view and runs the cadence. | The sprint plan, the review agenda, the brand point of view (Field Ledger), presenting to the founder, enforcing the cadence. | Writing code; overruling compliance blocks. |
| **Product Lead** | Makes sure we solve a real problem the right size. | The problem statement, scope, success measures, cut lines, and the backlog of open items and debt. | Visual decisions; release authority. |
| **Product Designer** | A systems thinker who designs the whole product, not single screens: how its parts, objects and states fit together, so people can use it under pressure. | **Systems:** the product's objects (package, record, check, decision, handoff, evidence) and how they relate; their states and transitions; patterns and components that work the same on every surface. **Information architecture:** navigation, page and panel structure, what lives where and why, naming and labels, grouping and hierarchy, wayfinding, how people find things and move between them. **Flows and specs:** proposals, canvas artboards, interaction and motion specs, the design spec ([MELLOW_DESIGN_SPEC.md](MELLOW_DESIGN_SPEC.md)), and an up-to-date map of the product's structure. | Final copy; feasibility calls. |
| **Content and Voice Designer** | Makes Mellow sound like one honest colleague everywhere. | Mellow's voice and behavior rules, all UI copy, answer templates, limit and error language, naming. | Regulatory interpretation. |
| **Research and Insights** | Grounds decisions in evidence about real users and the market. | External audits, competitor reviews, user tasks and scenarios, outcome measures after release. | Deciding what to build. |
| **AI UX Designer/Engineer** | Makes Mellow's intelligence behave in ways people can understand, check, correct and trust. | How Mellow behaves in the product: intent coverage and routing; answer structure; provenance and explainability (what Mellow compared, and when); how it shows confidence and limits; the triggers and quiet signals that decide when Mellow speaks first; fallbacks and refusals; human-in-the-loop controls (override, dismiss, undo); the behavior spec for live AI; and the **evaluation set**: the questions, including adversarial and compliance-bait ones, every change must pass. | Final copy (Content), regulatory interpretation (Compliance), visual style (Design). |
| **Engineer** | Builds it so it works, stays fast, and can be tested and undone. | Feasibility and cost, architecture, implementation, tests, the build, branches and deploys, production verification. | Deploying without founder approval. |
| **Accessibility Specialist** | Makes sure everyone can do the job with any device or input. | WCAG checks, 44px targets, keyboard and screen-reader flows, reduced motion, contrast, phone layouts. | Visual style beyond access needs. |
| **Compliance and Risk Lead** | Makes sure Mellow never claims more than it can prove. | Alignment with [MELLOW_CORE.md](MELLOW_CORE.md): deterministic claims only, provenance, regulatory honesty, sample-data labeling, data handling, audit trail. **Can block a release.** | Product priorities. |

## What each role always asks

- **Design Director:** Does this fit Field Ledger and the cadence? Is the founder seeing a real choice?
- **Product Lead:** Whose problem, how often, and how will we know it worked? What's the smallest version? Which journey stages does it touch, and does it hold up across the handoffs between them?
- **Product Designer:** Where does this live in the system, and what else does it touch? Is this a new object, a new state of an existing one, or a new view of it? Does it follow the patterns we already have, or does it need a new one, and should that pattern then apply everywhere? Would someone know where to find this, and what it's called, without being told? Can a receiving lead do this mid-shift, on a phone, without help? What happens when it goes wrong?
- **Content and Voice:** Does Mellow say only what it knows, in plain words? Does it say "Mellow", never "AI"?
- **Research:** What evidence supports this? What did the audit or the users show?
- **AI UX Designer/Engineer:** What will people ask that we didn't plan for, and what does Mellow do then? Can a person see why Mellow said it, challenge it, and override it? Does the evaluation set still pass, and did we add the cases this change creates?
- **Engineer:** Is it deterministic and testable? What does it cost and how do we roll it back?
- **Accessibility:** Keyboard, screen reader, zoom, 390px, reduced motion: does all of it work?
- **Compliance and Risk:** Could this be read as a compliance claim, an attestation or a prediction? Can every fact be traced to a record?

## What the team does in each step of the cadence

The cadence itself is in [AGENTS.md](AGENTS.md). R = responsible, A = accountable, C = consulted, I = informed.

| Step | Director | Product | Design | Content | Research | AI UX | Engineer | Access | Compliance | Founder |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 Sprint planning | R | R | C | C | C | C | C | I | C | **A** |
| 1 Proposal review | **A** | R | R | R | R | R | R | R | R | I |
| 2 Board pass | **A** | C | R | C | C | C | C | C | C | I |
| 3 Founder decision on proposal | R | C | C | C | I | C | C | I | C | **A** |
| 4 Build and implementation review | C | C | R | R | I | R | **A** | R | R | I |
| 5 Preview review | **A** | R | R | R | I | R | R | R | R | C |
| 6 Founder release decision and deploy | R | I | I | I | I | C | R | I | C | **A** |
| 7 Retro and outcome review | R | **A** | C | C | R | R | C | C | C | I |

## Required outputs

- **Sprint brief and proposal review:** a journey line naming the stages touched, the mindset at each, the outcome it should move, and its Get help behavior. Then one findings table, plus the Product Designer's note on where the change sits in the system and the information architecture: what it adds, changes or retires. Each row has the role, the finding, a severity (below) and a recommendation. Every role either signs off or lists what blocks it.
- **Board pass:** what each lens backs, changes or rejects, and a numbered recommendation for the founder.
- **Implementation review:** lint, type check, build and test results, plus browser checks at 1440px and 390px with keyboard and reduced motion. For any change to Mellow's behavior, the evaluation set results, including the new cases this change adds.
- **Preview review:** each finding closed, or given an owner and an impact.
- **Product Excellence Review:** for each of the top 3 critical user journeys, a 9-stage scorecard, handoff ratings, provocations, "how might we" and bold ideas, and the founder's decisions (MELLOW_EVALS.md, Part 2). The Design Director facilitates; the Product Lead owns the journey list; Research owns the recruit panel.
- **Release:** the founder's decision, the deploy commit, and verification in production.
- **Retro:** what worked, what didn't, follow-ups, and what the next sprint will measure.

Record all of it in [DESIGN_BOARD.md](DESIGN_BOARD.md) and [DECISION_LOG.md](DECISION_LOG.md), and on the design canvas when the work is visual.

## Severity

- **Blocker:** fails the evaluation set, breaks a Mellow rule or MELLOW_CORE, misleads about compliance, loses data, or fails accessibility basics. It can't ship.
- **High:** a real user harm or confusion. Fix it before release, or the founder accepts the risk in writing.
- **Medium:** fix it in this sprint, or log it with an owner.
- **Low or Info:** a note for later.

## Working agreements

1. No step is skipped without the founder saying so. "Build it" means build what was approved, not skip the review.
2. Compliance and Risk can block. Only the founder can overrule a block, in writing.
3. Every review names who found what. Nothing is "the team thinks" without a role attached.
4. Disagreements are recorded, not smoothed over. The Director presents both sides to the founder.
5. Every Mellow behavior bug becomes a permanent case in the evaluation set before it is fixed.
6. Live bugs that break a Mellow rule are raised the moment they're found, with a hotfix proposal.
