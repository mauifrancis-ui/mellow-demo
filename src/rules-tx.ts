// Texas hemp rules, as references only (sprint 4, Learn). Mellow links to these and
// doesn't check your records against them yet. Every entry is dated and says who, if
// anyone, has checked it. Retrieval from the official page is not verification.
// Statuses are words, never a mark. "Proposed" is reserved for sprint 6 and never
// feeds a check, a count or a note.

export type RuleStatus = "In effect" | "In effect · in litigation" | "Proposed, not law";

export type RuleReference = {
  id: string;
  title: string;
  citation: string;
  agency: string;
  jurisdiction: "Texas" | "Federal";
  url: string;
  /** ISO date, or null when we haven't recorded it yet. Never guessed. */
  effective: string | null;
  status: RuleStatus;
  statusNote?: string;
  /** When the official page was last opened to write this entry. */
  retrieved: string;
  /** A named person who checked this entry against the source, or null. */
  checkedBy: { name: string; on: string } | null;
};

export const rulesHeading = "Texas hemp rules · references";
export const rulesScope = "Mellow links to these. It doesn’t check your records against them yet.";

export const texasHempRules: RuleReference[] = [
  {
    id: "tx-hsc-443",
    title: "The state law on making, distributing and selling hemp products",
    citation: "Texas Health and Safety Code, Chapter 443",
    agency: "Texas Legislature",
    jurisdiction: "Texas",
    url: "https://tcss.legis.texas.gov/resources/HS/htm/HS.443.htm",
    effective: null,
    status: "In effect",
    statusNote: "It has been changed more than once. The statute page shows each change.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-25tac-300",
    title: "DSHS rules for hemp licenses, testing, packaging, labels and records",
    citation: "25 Texas Administrative Code, Chapter 300",
    agency: "Texas Department of State Health Services (DSHS)",
    jurisdiction: "Texas",
    url: "https://www.dshs.texas.gov/consumable-hemp-program",
    effective: "2026-03-31",
    status: "In effect · in litigation",
    statusNote: "Parts of these rules are being challenged in court, and DSHS’s page says a lower-court injunction still allows retail sale of hemp for smoking. Check the page for the current status.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-schedules-2026",
    title: "Delta-8, delta-10 and related THC listed as controlled substances in Texas",
    citation: "Texas Schedules of Controlled Substances, as published by DSHS",
    agency: "Texas Department of State Health Services (DSHS)",
    jurisdiction: "Texas",
    url: "https://www.dshs.texas.gov/hemp",
    effective: "2026-07-31",
    status: "In effect · in litigation",
    statusNote: "Lawsuits over the rules are ongoing. Check the DSHS page for the current status.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-16tac-35-5-6",
    title: "No hemp product sales to anyone under 21, and an ID check before every sale",
    citation: "16 Texas Administrative Code §35.5 and §35.6",
    agency: "Texas Alcoholic Beverage Commission (TABC)",
    jurisdiction: "Texas",
    url: "https://www.tabc.texas.gov/texas-alcohol-laws-regulations/consumable-hemp-products",
    effective: null,
    status: "In effect",
    statusNote: "Applies only to businesses with a TABC license or permit. TABC’s page gives no effective date.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-16tac-35-7",
    title: "No one may consume hemp products at certain stores with a TABC off-premises permit or license",
    citation: "16 Texas Administrative Code §35.7",
    agency: "Texas Alcoholic Beverage Commission (TABC)",
    jurisdiction: "Texas",
    url: "https://www.tabc.texas.gov/texas-alcohol-laws-regulations/consumable-hemp-products",
    effective: null,
    status: "In effect",
    statusNote: "Applies only to BQ, BF, P and Q off-premises permits and licenses, per TABC’s page.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "us-7cfr-990",
    title: "Federal rules for growing hemp, under the 2018 Farm Bill",
    citation: "U.S. Domestic Hemp Production Program",
    agency: "USDA Agricultural Marketing Service",
    jurisdiction: "Federal",
    url: "https://www.ams.usda.gov/rules-regulations/hemp",
    effective: null,
    status: "In effect",
    statusNote: "USDA’s page says it has delayed enforcing DEA-registered lab testing for all hemp until December 31, 2026.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
];

const day = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

export function effectiveText(rule: RuleReference) {
  return rule.effective ? `In effect from ${day(rule.effective)}` : "Start date not recorded yet";
}

export function checkedText(rule: RuleReference) {
  return rule.checkedBy ? `Checked by ${rule.checkedBy.name}, ${day(rule.checkedBy.on)}`
    : `No one has checked this yet. Copied from the official page on ${day(rule.retrieved)}.`;
}

/** Rules that can be used anywhere a current check lives. Proposed entries never pass. */
export function currentRules(rules: RuleReference[] = texasHempRules) {
  return rules.filter((rule) => rule.status !== "Proposed, not law");
}
