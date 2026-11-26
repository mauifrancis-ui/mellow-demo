// Inspection prep · Texas hemp, retail (sprint 6, C2 and C3). Controls come from
// research/texas-hemp-controls.md. Each one is counted from your records or says plainly that it
// can't be. Statuses are words: On file, Missing, Can't check from these files. Never met, compliant,
// ready or a score. See MELLOW_EVALS.md, section I.
import type { LotCheck } from "./comparison.ts";

export type ControlStatus = "On file" | "Missing" | "Can’t check from these files";

export const controlLabel = "Drafted from the rule text · citations checked by the founder, Nov 25, 2026 · not reviewed by a regulatory expert";
export const controlScope = "Texas hemp · retail · your inventory export and receiving log";

export type Control = {
  id: string;
  title: string;
  citation: string;
  ruleId: string; // rules-tx.ts entry that links the source
  /** What an inspector would ask to see, and where it lives. */
  evidence: string;
  where: "In your files" | "Outside Mellow";
  note?: string;
};

export const texasHempControls: Control[] = [
  { id: "H1", title: "Each package has a batch ID on file", citation: "25 TAC §300.402(a)(1); HSC §443.205(a)", ruleId: "tx-25tac-300",
    evidence: "The batch or lot number for each package you hold", where: "In your files" },
  { id: "H2", title: "The batch you received is the batch you list", citation: "Supports recall identification, 25 TAC §300.207(a)(1)", ruleId: "tx-25tac-300",
    evidence: "Matching batch numbers in your inventory and your receiving log", where: "In your files",
    note: "No rule requires two records to agree. Agreement makes a batch traceable if there's a recall." },
  { id: "H3", title: "Each batch has a batch date on file", citation: "25 TAC §300.402(a)(2); HSC §443.205(a)", ruleId: "tx-25tac-300",
    evidence: "The batch date on each product label", where: "Outside Mellow", note: "Countable when your files include batch details." },
  { id: "H4", title: "Each batch has a certificate of analysis link", citation: "25 TAC §300.402(a)(6); HSC §443.205(a)", ruleId: "tx-25tac-300",
    evidence: "A working link to each batch’s certificate of analysis", where: "Outside Mellow", note: "Countable when your files include a COA link. Mellow doesn’t open or judge the certificate." },
  { id: "H5", title: "Certificates of analysis aren’t expired", citation: "25 TAC §300.301(f)", ruleId: "tx-25tac-300",
    evidence: "The date on each certificate of analysis", where: "Outside Mellow", note: "Countable when your files include the COA's expiry date. Missing links count as missing here too." },
  { id: "H6", title: "Records are kept on site for three years", citation: "25 TAC §300.203(a), (c)", ruleId: "tx-25tac-300",
    evidence: "Your records, on site, going back three years", where: "Outside Mellow",
    note: "Mellow only knows this device. The decision trail export is something you can keep." },
  { id: "H7", title: "Every buyer’s age is checked with a valid ID", citation: "25 TAC §300.701(b), (c); 16 TAC §35.6", ruleId: "tx-16tac-35-5-6",
    evidence: "How your staff check ID at the register", where: "Outside Mellow" },
  { id: "H8", title: "Each retail location is registered", citation: "HSC §443.2025(b), (e)", ruleId: "tx-hsc-443",
    evidence: "Your current registration for this location", where: "Outside Mellow" },
  { id: "H9", title: "There’s a written recall procedure", citation: "25 TAC §300.207(a)", ruleId: "tx-25tac-300",
    evidence: "Your written recall procedure", where: "Outside Mellow" },
];

export type ControlResult = {
  control: Control;
  checkable: boolean;
  onFile: string[];
  missing: string[];
  /** H2 only: packages whose records disagree. They're already in your queue. */
  disagree: string[];
  total: number;
};

const present = (value: string | null) => value !== null && value.trim() !== "";

/** Count each control from the compared rows. Anything the files can't show is "Can't check from these files". */
export function checkControls(rows: LotCheck[], controls: Control[] = texasHempControls): ControlResult[] {
  return controls.map((control) => {
    const empty = { control, checkable: false, onFile: [], missing: [], disagree: [], total: rows.length };
    if (control.id === "H1") {
      return { ...empty, checkable: true,
        onFile: rows.filter((row) => present(row.inventory)).map(({ packageId }) => packageId),
        missing: rows.filter((row) => !present(row.inventory)).map(({ packageId }) => packageId) };
    }
    if (control.id === "H2") {
      return { ...empty, checkable: true,
        onFile: rows.filter((row) => present(row.inventory) && present(row.receiving) && row.inventory === row.receiving).map(({ packageId }) => packageId),
        missing: rows.filter((row) => !present(row.inventory) || !present(row.receiving)).map(({ packageId }) => packageId),
        disagree: rows.filter((row) => present(row.inventory) && present(row.receiving) && row.inventory !== row.receiving).map(({ packageId }) => packageId) };
    }
    // Sprint 7: when the records carry batch details (a batch date, a COA link and its expiry), H3 to H5 can be counted.
    const withBatch = rows.filter((row) => (row as { batch?: unknown }).batch);
    const batchOf = (row: LotCheck) => (row as { batch?: { batchDay: number; coaUrl: string; coaExpired: boolean } }).batch;
    if (withBatch.length && ["H3", "H4", "H5"].includes(control.id)) {
      const has = (row: LotCheck) => {
        const batch = batchOf(row);
        if (!batch) return false;
        return control.id === "H3" ? Number.isFinite(batch.batchDay) : control.id === "H4" ? Boolean(batch.coaUrl) : Boolean(batch.coaUrl) && !batch.coaExpired;
      };
      return { ...empty, checkable: true,
        onFile: rows.filter(has).map(({ packageId }) => packageId),
        missing: rows.filter((row) => !has(row)).map(({ packageId }) => packageId) };
    }
    return empty;
  });
}

export function statusOf(result: ControlResult): ControlStatus {
  if (!result.checkable) return "Can’t check from these files";
  return result.missing.length || result.disagree.length ? "Missing" : "On file";
}

/** One line per control, counts only. */
export function countLine(result: ControlResult) {
  if (!result.checkable) return "Can’t check from these files";
  const parts = [`On file for ${result.onFile.length} of ${result.total}`];
  if (result.missing.length) parts.push(`missing for ${result.missing.length}`);
  if (result.disagree.length) parts.push(`records disagree for ${result.disagree.length}`);
  return parts.join(" · ");
}

export function prepSummary(results: ControlResult[]) {
  const counted = results.filter(({ checkable }) => checkable);
  return {
    counted: counted.length,
    cantCheck: results.length - counted.length,
    withGaps: counted.filter((result) => result.missing.length || result.disagree.length).length,
  };
}
