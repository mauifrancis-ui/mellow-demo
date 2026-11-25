// "Share these findings" (sprint 3, Buy). A one-page summary for whoever signs off:
// what was compared, what differed, decisions so far, and what it isn't. Deterministic,
// no verdicts. See MELLOW_EVALS.md cases S1 to S3.
import type { LotCheck } from "./comparison.ts";

export type FindingsSource = { files: string[]; at?: string; kind: "check" | "compared" };
export type FindingsInput = {
  rows: LotCheck[];
  sources: FindingsSource[];
  decisions: { record: string; decision: string; at: string }[];
};

/** The words people see in the app. "Approved" is stored internally but would read as a sign-off on a summary. */
export const decisionWords: Record<string, string> = {
  "Approved": "Issue recorded", "Manager review requested": "Left for a manager", "Dismissed": "Marked not an issue", "Reopened": "Reopened",
};

export const disclaimer = "This is a comparison of two files, not a compliance assessment. A person checks each package against its label.";

const value = (lot: string | null) => lot === null ? "(no record)" : lot === "" ? "(blank)" : lot;
const label = (row: LotCheck) => row.state === "different" ? "Records disagree" : row.receiving === null ? "No receiving record"
  : row.inventory === null ? "No inventory record" : "No lot in either record";

const when = (iso: string) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function findingsSummary({ rows, sources, decisions }: FindingsInput) {
  const flagged = rows.filter((row) => row.state !== "match")
    .sort((a, b) => (a.state === "different" ? 0 : 1) - (b.state === "different" ? 0 : 1) || a.packageId.localeCompare(b.packageId));
  return {
    title: flagged.length
      ? `${flagged.length} of ${rows.length} package${rows.length === 1 ? "" : "s"} need${flagged.length === 1 ? "s" : ""} a person`
      : `All ${rows.length} lot numbers match`,
    compared: `${sources.map(({ files, at, kind }) => `${files.join(" and ")}${at ? kind === "check" ? ` (the ${when(at)} check)` : ` (compared ${when(at)})` : ""}`).join("; ")}.`,
    rows: flagged.map((row) => ({ packageId: row.packageId, inventory: value(row.inventory), receiving: value(row.receiving), finding: label(row) })),
    decisions: decisions.map((entry) => ({ ...entry, decision: decisionWords[entry.decision] ?? entry.decision })),
    disclaimer,
  };
}

export function findingsText(summary: ReturnType<typeof findingsSummary>) {
  return [
    `Mellow findings: ${summary.title}`,
    `Compared: ${summary.compared}`,
    "",
    ...summary.rows.map((row) => `${row.packageId}: ${row.finding}. Inventory ${row.inventory}; receiving ${row.receiving}.`),
    "",
    summary.decisions.length ? "Decisions so far:" : "Decisions so far: none recorded yet.",
    ...summary.decisions.map((entry) => `${entry.record}: ${entry.decision} (${new Date(entry.at).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })})`),
    "",
    summary.disclaimer,
  ].join("\n");
}
