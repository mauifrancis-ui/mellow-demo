import { parseCsv, type Task } from "./workspace.ts";

export type LotRecord = { packageId: string; lot: string };
export type LotCheck = { packageId: string; inventory: string | null; receiving: string | null; state: "match" | "different" | "missing" };

export function lotRecords(csv: string): LotRecord[] {
  const rows = parseCsv(csv);
  const seen = new Set<string>();
  return rows.map((row) => {
    if (!Object.hasOwn(row, "package_id") || !Object.hasOwn(row, "lot_number")) {
      throw new Error("Each CSV needs package_id and lot_number columns.");
    }
    if (!row.package_id || seen.has(row.package_id)) throw new Error("Each file needs one row per package ID.");
    seen.add(row.package_id);
    return { packageId: row.package_id, lot: row.lot_number };
  });
}

export function compareLots(inventory: LotRecord[], receiving: LotRecord[]): LotCheck[] {
  const left = new Map(inventory.map(({ packageId, lot }) => [packageId, lot]));
  const right = new Map(receiving.map(({ packageId, lot }) => [packageId, lot]));
  return Array.from(new Set([...left.keys(), ...right.keys()]), (packageId) => {
    const a = left.get(packageId) ?? null;
    const b = right.get(packageId) ?? null;
    const state = a === null || b === null || (!a && !b) ? "missing" : a === b ? "match" : "different";
    return { packageId, inventory: a, receiving: b, state };
  });
}

// Sample data (sprint 5, data integrity). Every sample package belongs to exactly one check.
// The checks' counts and the comparison rows come from this one list, so they always add up.
// Each entry is one check: how many packages matched, and which exceptions it found.
export const sampleBatches: { matched: number; exceptions: { packageId: string; inventory: string; receiving: string | null }[] }[] = [
  { matched: 6, exceptions: [] },
  { matched: 8, exceptions: [{ packageId: "PKG-221", inventory: "", receiving: "" }] },
  { matched: 4, exceptions: [] },
  { matched: 9, exceptions: [] },
  { matched: 6, exceptions: [{ packageId: "PKG-443", inventory: "", receiving: "SAMPLE-6" }] },
  { matched: 5, exceptions: [] },
  { matched: 7, exceptions: [] },
  { matched: 5, exceptions: [{ packageId: "PKG-552", inventory: "", receiving: null }] },
];

/** The packages in each sample check, in order. Matched packages get IDs PKG-101 onward. */
export function sampleBatchRows(): LotCheck[][] {
  let next = 101;
  return sampleBatches.map(({ matched, exceptions }) => [
    ...Array.from({ length: matched }, () => {
      const id = next++;
      return { packageId: `PKG-${id}`, inventory: `SAMPLE-${id}`, receiving: `SAMPLE-${id}`, state: "match" as const };
    }),
    ...exceptions.map((row) => compareLots(
      [{ packageId: row.packageId, lot: row.inventory }],
      row.receiving === null ? [] : [{ packageId: row.packageId, lot: row.receiving }],
    )[0]),
  ]);
}

export const sampleComparison: LotCheck[] = sampleBatchRows().flat();
export function lotInsight(row: LotCheck): { title: string; detail: string } {
  if (row.state === "different") {
    const difference = row.inventory === "" ? "Inventory has no lot number, but receiving does."
      : row.receiving === "" ? "Receiving has no lot number, but inventory does."
        : "Inventory and receiving list different lot numbers.";
    return { title: `Check the original package label for ${row.packageId}`, detail: difference };
  }
  if (row.state === "missing") {
    if (row.receiving === null) {
      return { title: `Find the receiving record for ${row.packageId}`, detail: "There’s no matching receiving row. Look up the package before drawing a conclusion." };
    }
    if (row.inventory === null) {
      return { title: `Find the inventory record for ${row.packageId}`, detail: "There’s no matching inventory row. Check the package ID in the inventory system." };
    }
    return { title: `Verify the lot number for ${row.packageId}`, detail: "Neither record lists a lot number. Check the package label or the original receiving paperwork." };
  }
  return { title: `The lot numbers match for ${row.packageId}`, detail: "Both files list the same number. No follow-up for this comparison." };
}

export function summarizeLots(rows: LotCheck[]) {
  const different = rows.filter(({ state }) => state === "different");
  const missing = rows.filter(({ state }) => state === "missing");
  return {
    checked: rows.length,
    different,
    missing,
    matched: rows.length - different.length - missing.length,
    first: different[0] ?? missing[0],
  };
}


export function comparisonTasks(rows: LotCheck[], inventoryFile: string, receivingFile: string): Task[] {
  const { different, missing } = summarizeLots(rows);
  return [...different, ...missing].map((row) => ({
    id: JSON.stringify(["lot-comparison", inventoryFile, receivingFile, row.packageId, row.inventory, row.receiving]),
    record: row.packageId,
    source: inventoryFile,
    observation: lotInsight(row).detail,
    lotComparison: {
      inventory: row.inventory,
      receiving: row.receiving,
      receivingFile,
      different: row.state === "different",
    },
  }));
}
