import { parseCsv } from "./workspace.ts";

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

const matched = ["PKG-105", "PKG-108", "PKG-114", "PKG-119", "PKG-125"].map((packageId, index) => ({
  packageId, lot: `SAMPLE-${index + 1}`,
}));

export const sampleComparison = compareLots(
  [...matched, { packageId: "PKG-221", lot: "" }, { packageId: "PKG-443", lot: "" }, { packageId: "PKG-552", lot: "" }],
  [...matched, { packageId: "PKG-221", lot: "" }, { packageId: "PKG-443", lot: "SAMPLE-6" }],
);

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
