// Bring your own files (sprint 3). Mellow finds the package ID and lot columns by a fixed
// list of known names, previews rows exactly as it will read them, and asks when it can't
// tell. It never guesses silently. See MELLOW_EVALS.md cases F1 to F6.
import { parseCsv } from "./workspace.ts";
import type { LotRecord } from "./comparison.ts";

const normal = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export const knownColumns = {
  package: ["package_id", "packageid", "package", "package_label", "package_tag", "metrc_package_id", "metrc_tag", "pkg_id", "pkg", "uid", "tag"],
  lot: ["lot_number", "lot", "lotnumber", "lot_no", "lot_id", "batch", "batch_number", "batch_no", "batch_id", "batch_name"],
} as const;

export type ColumnKind = keyof typeof knownColumns;
export type ColumnGuess = { headers: string[]; package: string | null; lot: string | null; candidates: Record<ColumnKind, string[]> };

/** Matches headers against the known names. Exactly one match is a guess; none or several means Mellow asks. */
export function guessColumns(csv: string): ColumnGuess {
  const rows = parseCsv(csv);
  const headers = rows.length ? Object.keys(rows[0]) : headerLine(csv);
  if (!headers.length) throw new Error("This file has no header row.");
  const find = (kind: ColumnKind) => {
    const names = new Set(knownColumns[kind].map(normal));
    return headers.filter((header) => names.has(normal(header)));
  };
  const candidates = { package: find("package"), lot: find("lot") };
  return {
    headers,
    package: candidates.package.length === 1 ? candidates.package[0] : null,
    lot: candidates.lot.length === 1 ? candidates.lot[0] : null,
    candidates,
  };
}

function headerLine(csv: string) {
  const first = csv.split(/\r?\n/).find((line) => line.trim());
  return first ? first.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")).filter(Boolean) : [];
}

/** What Mellow will say about a file's columns before comparing. Empty when it can go ahead. */
export function columnQuestion(file: string, guess: Pick<ColumnGuess, "package" | "lot" | "candidates">): string {
  const missing: string[] = [];
  for (const kind of ["package", "lot"] as const) {
    if (guess[kind]) continue;
    const label = kind === "package" ? "package ID" : "lot";
    missing.push(guess.candidates[kind].length > 1
      ? `${guess.candidates[kind].length} columns could be the ${label} (${guess.candidates[kind].join(", ")})`
      : `I couldn’t find a ${label} column`);
  }
  return missing.length ? `In ${file}: ${missing.join(", and ")}. Which one is it?` : "";
}

/** Reads one row per package using the chosen columns. Same rules as before: IDs required and unique. */
export function lotRecordsWith(csv: string, columns: { package: string; lot: string }): LotRecord[] {
  const seen = new Set<string>();
  return parseCsv(csv).map((row, index) => {
    if (!Object.hasOwn(row, columns.package) || !Object.hasOwn(row, columns.lot)) throw new Error("A chosen column isn’t in this file.");
    const id = row[columns.package];
    if (!id) throw new Error(`Row ${index + 2} has no package ID.`);
    if (seen.has(id)) throw new Error(`${id} appears more than once. Each file needs one row per package ID.`);
    seen.add(id);
    return { packageId: id, lot: row[columns.lot] };
  });
}

/** The first rows exactly as Mellow will read them. */
export function previewRows(csv: string, columns: { package: string | null; lot: string | null }, count = 5) {
  return parseCsv(csv).slice(0, count).map((row) => ({
    packageId: columns.package ? row[columns.package] || "(blank)" : "?",
    lot: columns.lot ? row[columns.lot] || "(blank)" : "?",
  }));
}
