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

## First integration slice

Start with one record type and one approved evidence source, such as an
inventory export paired with the corresponding batch record. On record open,
the authenticated server resolves the record and finds eligible evidence using
its stable identifiers. The model summarizes cited passages, explains the
observation, and identifies gaps. The response carries evidence IDs, so the
reviewer can inspect and select stored evidence without copying it into a form.
A dedicated decision endpoint validates evidence IDs and actor permissions at
write time. When sources disagree or are absent, show the gap and preserve
manual review.

Activation requires the approved custom GPT Instructions, original Knowledge
files, one de-identified record and matching evidence example, and a confirmed
server, identity, and storage setup. Use approved fixtures to test attribution,
unsupported claims, source mismatches, and the quality of the proposed next step
before expanding to other record types. Keep the provider credential in
server-only environment settings.

## Metrc pilot

OpenMetrc provides a .NET wrapper and a community-maintained OpenAPI
specification. The Node sandbox probe uses the V2 facilities contract from
[OpenMetrc](https://github.com/OcelliSolutions/OpenMetrc/blob/505e2ba60b3de65538939c240c271676f1ed51fd/open-metrc-swagger-v2.yaml).
Confirm support with the jurisdiction's official Metrc documentation before
activation.

To validate a licensed sandbox, supply `METRC_SANDBOX_HOST`,
`METRC_VENDOR_KEY`, `METRC_USER_KEY`, and `METRC_FACILITY_LICENSE` in an
authorized server or operator environment. Run `npm run metrc:check`. The probe
makes one read-only facilities request and reports whether the configured
license is visible. It has no browser route. Fixture tests verify the protocol,
host restriction, and common failure responses.

The first application pilot should map one tenant to one approved facility and
retrieve only permitted package evidence. Add authenticated tenant and facility
authorization, state-specific endpoint validation, pagination and rate limits,
and provenance before exposing records to the app. Keep output fields scoped
to the review. The probe provides no package synchronization or Metrc writes.

## Retrieval sources reviewed on 2026-11-24

| Source | Candidate use and access |
| --- | --- |
| Metrc Connect | Facility-scoped track-and-trace data. Confirm jurisdiction, integrator onboarding, vendor key, facility user permissions, and readable package endpoints. [Metrc Connect](https://www.metrc.com/track-and-trace-technology/metrc-connect/) |
| Dutchie POS | Authorized store inventory and products. Request a key using a pilot shop and an approved integration. Scope to the inventory permissions needed. [API quick start](https://api.pos.dutchie.com/pages/quick-start.html) · [Partner access](https://support.dutchie.com/hc/en-us/articles/27660267271187-Dutchie-POS-API-key-request-process-for-third-party-integrations) |
| Flowhub | Potential inventory source where the store already uses Flowhub. Confirm partner or data agreement requirements and confirm that the approved endpoint returns the fields required for the comparison. [Flowhub Open Ecommerce](https://help.flowhub.com/en/articles/16005241-use-open-ecommerce) |
| State regulators | Use current rules and official license records for their jurisdiction and effective period. Confirm each jurisdiction's supported machine access and dataset terms. [California DCC licensing data](https://www.cannabis.ca.gov/resources/data-dashboard/license-report/) · [Data.CA.gov API and dataset licensing](https://data.ca.gov/docs/developer-documentation) |
| Leafly | Documented retail integrations sync menu data. A public strain-database retrieval license was not verified. Leafly's terms restrict automated extraction. Seek explicit permission for retrieval, storage, and display before considering it for Learn. [Integration example](https://help.leafly.com/s/article/BLAZE-Pull-Menu-Integration-Guide) · [Terms of Use](https://www.leafly.com/info/terms-of-use) |

Start with one pilot shop, one package ID, one authorized inventory source,
and its matching receiving record or lab certificate where relevant. Store
the provider record ID, link, facility, observed time, and retrieval time.
Use facility and record identifiers to match sources. Return an explicit
mismatch when the linkage cannot be verified. Keep any education catalog
out of the evidence used for package decisions. Validate provider terms
cover use with the model before passing excerpts to it. No live connector
was enabled in this revision.

## Ambient receiving pilot scope

Start with one licensed facility, one authorized inventory feed, and one
receiving feed. Obtain the actual jurisdiction, license type, local permit
conditions, and source access before enabling a live check. The compliance
owner approves any rule before Mellow uses it for deadline or escalation
prompts.

For each enabled control, record the authority and citation, effective
version and date, jurisdiction, license and activities in scope, required
evidence, freshness criteria, the precise test, the responsible reviewer,
and applicable escalation. Preserve the facts and timestamp of each run.
Treat the records comparison as an operational finding. The physical
label and physical count still require human verification.

California and San Francisco were researched as examples. The product
does not assume they apply to the pilot. California's track-and-trace
reporting and physical reconciliation requirements have separate evidence
and triggers. San Francisco requirements include the shop's own permit
conditions. Federal applicability also varies by activity and license.
[California DCC regulations](https://www.cannabis.ca.gov/cannabis-laws/dcc-regulations/text-of-regulations/) · [San Francisco permit conditions](https://codelibrary.amlegal.com/codes/san_francisco/latest/sf_police/0-0-0-50321) · [DEA scheduling actions](https://www.dea.gov/marijuana-rescheduling-regulatory-actions)

A live monitor needs scheduled server execution, tenant-scoped credentials,
last-success and per-source freshness, durable check history, retry with
backoff, and stable findings that reuse the existing queue record. Recovery
of a feed cannot establish a clean period unless the missing window is
actually checked. Keep reports reviewable and source-linked. Require a
human verify or approve any external filing.
