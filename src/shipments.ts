// Shipment comparison (sprint 7, DB3). Three records per package: the manifest line, the receiving
// log and the inventory record. Mellow compares them and says what disagrees or is missing. It never
// says why. Each row keeps its evidence so every finding can be shown.
import type { LotCheck } from "./comparison.ts";

export type ManifestLine = { manifest_number: string; package_label: string; item_id: string; batch_id: string; shipped_quantity: number; unit: string };
export type Receipt = { received_day: number; received_time: string; facility: string; package_label: string; manifest_number: string; batch_id_recorded: string; received_quantity: number; unit: string; received_by_role: string; note: string };
export type Stock = { facility: string; package_label: string; item_id: string; batch_id_listed: string; quantity_on_hand: number; unit: string; location: string; last_counted_day: number };
export type Batch = { batch_id: string; item_id: string; supplier_license: string; batch_day: number; coa_url: string; coa_issued_day: number; coa_expires_day: number; lab_testing_state: string };
export type Manifest = { manifest_number: string; shipper_license: string; recipient_license: string; departed_day: number; departed_time: string; arrived_day: number; arrived_time: string };
export type Item = { item_id: string; name: string; category: string; unit_of_measure: string };

export type ShipmentReason = "lot_mismatch" | "missing_lot" | "missing_receipt" | "missing_inventory" | "left_off_manifest" | "quantity_variance";

export type ShipmentCheck = LotCheck & {
  item?: string;
  manifest?: string;
  manifestLot: string | null;
  onManifest: boolean;
  shipped: number | null;
  received: number | null;
  unit: string;
  reasons: ShipmentReason[];
  batch?: { batchDay: number; coaUrl: string; coaExpiresDay: number; coaExpired: boolean };
};

export type ShipmentData = { manifest_lines: ManifestLine[]; receiving_log: Receipt[]; inventory: Stock[]; batches: Batch[]; items: Item[]; manifests: Manifest[] };

/** Compare every package a store received, listed or expected. */
export function compareShipments(data: ShipmentData, facility: string): ShipmentCheck[] {
  const manifests = new Set(data.manifests.filter((m) => m.recipient_license === facility).map((m) => m.manifest_number));
  const lines = new Map(data.manifest_lines.filter((line) => manifests.has(line.manifest_number)).map((line) => [line.package_label, line]));
  const receipts = new Map(data.receiving_log.filter((r) => r.facility === facility).map((r) => [r.package_label, r]));
  const stock = new Map(data.inventory.filter((s) => s.facility === facility).map((s) => [s.package_label, s]));
  const batches = new Map(data.batches.map((b) => [b.batch_id, b]));
  const items = new Map(data.items.map((i) => [i.item_id, i]));
  const labels = [...new Set([...lines.keys(), ...receipts.keys(), ...stock.keys()])].sort();

  return labels.map((label) => {
    const line = lines.get(label), receipt = receipts.get(label), held = stock.get(label);
    const inventory = held ? held.batch_id_listed : null;
    const receiving = receipt ? receipt.batch_id_recorded : null;
    const reasons: ShipmentReason[] = [];
    if (!receipt) reasons.push("missing_receipt");
    if (!held) reasons.push("missing_inventory");
    if (held && !held.batch_id_listed) reasons.push("missing_lot");
    else if (inventory && receiving && inventory !== receiving) reasons.push("lot_mismatch");
    if (!line && (receipt || held)) reasons.push("left_off_manifest");
    if (line && receipt && line.shipped_quantity !== receipt.received_quantity) reasons.push("quantity_variance");
    const disagree = reasons.some((reason) => reason === "lot_mismatch" || reason === "quantity_variance" || (reason === "missing_lot" && Boolean(receiving)));
    const state: LotCheck["state"] = disagree ? "different" : reasons.length ? "missing" : "match";
    const batchId = line?.batch_id ?? receiving ?? inventory ?? "";
    const batch = batches.get(batchId);
    const day = receipt?.received_day ?? held?.last_counted_day ?? 0;
    return {
      packageId: label, inventory, receiving, state, reasons,
      item: items.get(line?.item_id ?? held?.item_id ?? "")?.name,
      manifest: line?.manifest_number ?? receipt?.manifest_number,
      manifestLot: line?.batch_id ?? null,
      onManifest: Boolean(line),
      shipped: line?.shipped_quantity ?? null,
      received: receipt?.received_quantity ?? null,
      unit: line?.unit ?? receipt?.unit ?? held?.unit ?? "",
      ...(batch ? { batch: { batchDay: batch.batch_day, coaUrl: batch.coa_url, coaExpiresDay: batch.coa_expires_day, coaExpired: batch.coa_expires_day < day } } : {}),
    };
  });
}

const qty = (value: number | null, unit: string) => value === null ? "nothing" : `${value} ${unit === "Each" ? (value === 1 ? "unit" : "units") : unit.toLowerCase()}`;

/** The plain-words label and detail for a shipment finding. Facts only. */
export function shipmentIssue(row: ShipmentCheck): { label: string; detail: string } | undefined {
  const [first] = row.reasons;
  switch (first) {
    case "missing_receipt": return { label: "No receiving record", detail: `${row.manifest ?? "The manifest"} lists it, and inventory has it, but the receiving log doesn’t.` };
    case "missing_inventory": return { label: "No inventory record", detail: "Receiving logged it, but inventory doesn’t list it." };
    case "missing_lot": return { label: "No lot in inventory", detail: `Receiving recorded ${row.receiving}. Inventory has no lot number.` };
    case "lot_mismatch": return { label: "Records disagree", detail: `Inventory lists ${row.inventory}. Receiving recorded ${row.receiving}.` };
    case "left_off_manifest": return { label: "Not on the manifest", detail: `Received and in inventory, but ${row.manifest ?? "no manifest"} doesn’t list it.` };
    case "quantity_variance": return { label: "Quantities disagree", detail: `${row.manifest} says ${qty(row.shipped, row.unit)}. Receiving counted ${qty(row.received, row.unit)}.` };
    default: return undefined;
  }
}

/** Map Mellow's findings to the answer key's issue types, for the accuracy eval. */
export function predictedIssues(row: ShipmentCheck): string[] {
  return row.reasons.filter((reason) => reason !== "missing_inventory");
}

/** What a person could do next, for a shipment finding. A suggestion; the person decides. */
export function shipmentNextStep(row: ShipmentCheck): string {
  switch (row.reasons[0]) {
    case "lot_mismatch": return "The records disagree. Check the lot number on the package label, then record the issue or leave it for a manager.";
    case "missing_lot": return "Check the package label for its lot number, then record the issue or leave it for a manager.";
    case "missing_receipt": return "Look for the receiving entry or the signed manifest. If you can’t find it, leave this for a manager.";
    case "missing_inventory": return "Find the package and check whether it was added to inventory.";
    case "left_off_manifest": return "Check the paperwork that came with the delivery. A corrected manifest may be needed; a manager can follow up.";
    case "quantity_variance": return "Recount the package, then record the issue or leave it for a manager.";
    default: return "Check the package, then decide.";
  }
}
