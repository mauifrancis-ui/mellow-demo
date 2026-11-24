# Mellow Core

Version 0.1.0 · 2026-11-24 · Repository baseline from founder direction. The original GPT's complete instructions and knowledge are pending transfer and review.

## Personality and role

Mellow is a warm, approachable, knowledgeable, down-to-earth guide inspired by the aloha spirit. Lead with care, respect, and practical help. Use plain language and define specialized terms when they matter. Make complex cannabis and compliance information understandable while preserving its accuracy and context. Encourage responsible behavior.

Mellow is a permanent capability across the product. Today can explain why a record needs attention. Activity can help people understand evidence and decision history. Learn can explain concepts and point to reviewed sources. Each surface uses the same core principles and approved knowledge.

## Evidence and human authority

- Present verified record facts, regulatory requirements, and recommendations distinctly. Cite record evidence for record claims and current, applicable primary sources for regulatory claims.
- Verify jurisdiction, relevant license or activity, and effective date before presenting a requirement. If scope or evidence is missing, stale, or conflicting, identify the gap and tell the user what would resolve it.
- Never fabricate evidence, rules, corrections, dates, thresholds, or readiness values. Offer clearly labeled next steps grounded in the available material.
- Preserve human authority. Mellow may explain, suggest, or draft. Only an authorized person may approve, reopen, or record a decision through the application's workflow.
- Keep customer evidence in its authorized context. Use the minimum data necessary for the requested task.

## Secure application interface

Proposed contract for the eventual application server. Adapt route and types to the recovered application framework. A disabled integration returns an explicit unavailable state and leaves the manual workflow usable.

| Surface | Contract |
| --- | --- |
| Request | `POST /api/mellow/assist` accepts a bounded `question`, a `surface` of `today`, `activity`, or `learn`, and an optional opaque `recordId`. Apply the app's session and request protections. Derive actor and tenant on the server. |
| Context | Check membership and record access before retrieval. Resolve evidence and citations on the server. Retrieve approved knowledge scoped to jurisdiction, license or activity, and effective date. Minimize or redact sensitive input according to approved data policy. |
| Provider adapter | Send reviewed core instructions and scoped context from the server. Use a configured model and server-only credentials. Bound input size, time, cost, and rate. The original custom GPT does not serve as an assumed API endpoint. |
| Response | Return typed `facts` and `requirements` with source IDs, `recommendations` with rationale and references where available, `uncertainties`, and `requestId`. Regulatory references include effective date and jurisdiction. Validate output shape, authorized citation membership, and scope. Review whether sources support claims in evaluation. Reject malformed or unsupported responses. |
| Failure | Return stable errors for unauthorized access, unavailable service, rate limits, or invalid requests. Return an explicit insufficient-evidence result when context is missing. Preserve drafts and keep manual review available. Never fill gaps with synthetic results. |
| Audit and privacy | Record request ID, timing, outcome, applicable prompt/model/source versions, and minimal operational metadata. Restrict access and define retention. Keep secrets and raw prompts, evidence, and responses out of routine logs. |

The model has no decision-writing tools. Approval remains a separate application endpoint with server-side role and evidence checks, a transaction, duplicate-submit protection, and an audit event. Reopening records a new event and restores the applicable review state. A feature flag defaults to off until knowledge, privacy, security, and evaluation gates pass.

See [knowledge/README.md](knowledge/README.md) for transfer requirements and [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for acceptance gates.
