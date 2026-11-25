// The Mellow decision trail (sprint 4, End use): every decision with its evidence, and what
// Mellow said first, as CSV and print. It's the skeleton of the sprint 5 inspection binder.
// It doesn't claim to satisfy any record-keeping rule. See MELLOW_EVALS.md cases T1 to T3.
import { decisionWords } from "./findings.ts";
import type { Entry } from "./workspace.ts";

export const trailTitle = "Mellow decision trail";
export const trailDisclaimer = "This lists decisions recorded on this device. It’s not a compliance assessment, and it isn’t a record required by any rule. A person checks each package against its label.";

export type TrailNote = { text: string; trigger: string; at: string; dismissedAt?: string; feedback?: string };

export type TrailRow = { at: string; packageId: string; decision: string; evidenceSource: string; evidenceShows: string; note: string; files: string };

export function trailRows(history: Entry[]): TrailRow[] {
  return [...history].sort((a, b) => a.at.localeCompare(b.at)).map((entry) => {
    const source = entry.evidence.reference || entry.comparedSource?.reference || "";
    const shows = entry.evidence.excerpt || entry.comparedSource?.excerpt || "";
    const files = entry.task.lotComparison ? `${entry.task.source}; ${entry.task.lotComparison.receivingFile}` : entry.task.source;
    return {
      at: entry.at, packageId: entry.task.record, decision: decisionWords[entry.decision] ?? entry.decision,
      evidenceSource: source, evidenceShows: shows, note: entry.evidence.note, files,
    };
  });
}

const cell = (value: string) => /[",\n\r]/.test(value) || /^[=+\-@]/.test(value) ? `"${(/^[=+\-@]/.test(value) ? `'${value}` : value).replace(/"/g, '""')}"` : value;

/** CSV a spreadsheet can open. Cells that start like a formula are quoted with a leading apostrophe so they never run. */
export function trailCsv(rows: TrailRow[], notes: TrailNote[] = []) {
  const lines = [
    ["time", "package_id", "decision", "evidence_source", "evidence_shows", "note", "files_compared"].join(","),
    ...rows.map((row) => [row.at, row.packageId, row.decision, row.evidenceSource, row.evidenceShows, row.note, row.files].map(cell).join(",")),
  ];
  if (notes.length) {
    lines.push("", ["time", "mellow_note", "trigger", "what_happened"].join(","));
    lines.push(...notes.map((note) => [note.at, note.text, note.trigger,
      note.feedback ? `Marked not useful: ${note.feedback}` : note.dismissedAt ? `Dismissed ${note.dismissedAt}` : "Shown"].map(cell).join(",")));
  }
  lines.push("", cell(trailDisclaimer));
  return lines.join("\r\n");
}

export function trailFileName(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `mellow-decision-trail-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
}
