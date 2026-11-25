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
    title: "Manufacture, Distribution, and Sale of Consumable Hemp Products",
    citation: "Texas Health and Safety Code, Chapter 443",
    agency: "Texas Legislature (statute)",
    jurisdiction: "Texas",
    url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.443.htm",
    effective: null,
    status: "In effect",
    statusNote: "Amended more than once. Check the statute page for amendment dates.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-25tac-300",
    title: "Consumable Hemp Program rules: licensing, testing, packaging, labeling, records",
    citation: "25 Texas Administrative Code, Chapter 300",
    agency: "Texas Department of State Health Services (DSHS)",
    jurisdiction: "Texas",
    url: "https://www.dshs.texas.gov/consumable-hemp-program",
    effective: "2026-03-31",
    status: "In effect · in litigation",
    statusNote: "Parts of the March 2026 rules are being challenged in court. Check the DSHS page for the current status.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-schedules-2026",
    title: "Texas Schedules of Controlled Substances (delta-8 and related THC)",
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
    title: "No sales to anyone under 21, and ID checks on every sale (TABC licensees)",
    citation: "16 Texas Administrative Code §35.5 and §35.6",
    agency: "Texas Alcoholic Beverage Commission (TABC)",
    jurisdiction: "Texas",
    url: "https://www.tabc.texas.gov/texas-alcohol-laws-regulations/consumable-hemp-products",
    effective: null,
    status: "In effect",
    statusNote: "Applies only to TABC license and permit holders. Replaced emergency rules in 2026.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "tx-16tac-35-7",
    title: "No consumption of hemp products on certain licensed premises (TABC licensees)",
    citation: "16 Texas Administrative Code §35.7",
    agency: "Texas Alcoholic Beverage Commission (TABC)",
    jurisdiction: "Texas",
    url: "https://www.tabc.texas.gov/texas-alcohol-laws-regulations/tabc-code-rules",
    effective: null,
    status: "In effect",
    statusNote: "Applies only to TABC license and permit holders.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
  {
    id: "us-7cfr-990",
    title: "Domestic hemp production program",
    citation: "7 Code of Federal Regulations, Part 990",
    agency: "USDA Agricultural Marketing Service",
    jurisdiction: "Federal",
    url: "https://www.ams.usda.gov/rules-regulations/hemp",
    effective: null,
    status: "In effect",
    statusNote: "Federal rules for growing hemp. Federal law on hemp products is changing; check the USDA page.",
    retrieved: "2026-11-25",
    checkedBy: null,
  },
];

const day = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

export function effectiveText(rule: RuleReference) {
  return rule.effective ? `Effective ${day(rule.effective)}` : "Effective date not recorded yet";
}

export function checkedText(rule: RuleReference) {
  return rule.checkedBy ? `Checked by ${rule.checkedBy.name}, ${day(rule.checkedBy.on)}`
    : `Not yet checked by a person · page retrieved ${day(rule.retrieved)}`;
}

/** Rules that can be used anywhere a current check lives. Proposed entries never pass. */
export function currentRules(rules: RuleReference[] = texasHempRules) {
  return rules.filter((rule) => rule.status !== "Proposed, not law");
}
