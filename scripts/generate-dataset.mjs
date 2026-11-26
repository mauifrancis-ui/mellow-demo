// Mellow prototype dataset · v1 (sprint 7, DB1). Fictional. Seeded and reproducible:
//   node scripts/generate-dataset.mjs
// Shaped like how tracked states record packages, manifests and receiving (Metrc-like, not Metrc data).
// Every planted problem is written to answer_key, so Mellow's findings can be scored against the truth.
import { mkdirSync, writeFileSync } from "node:fs";

const VERSION = "sample-v1";
const SEED = 20261126;
const DAYS = 90; // day -89 .. day 0 (day 0 is "today" in the app)

// mulberry32: small, deterministic
let state = SEED >>> 0;
const rand = () => { state |= 0; state = (state + 0x6d2b79f5) | 0; let t = Math.imul(state ^ (state >>> 15), 1 | state); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = (list) => list[Math.floor(rand() * list.length)];
const pad = (n, width) => String(n).padStart(width, "0");
const hhmm = (minutes) => `${pad(Math.floor(minutes / 60), 2)}:${pad(minutes % 60, 2)}`;

const facilities = [
  { license_number: "SAMPLE-R-0001", name: "North Store", type: "Retail", city: "Sample City" },
  { license_number: "SAMPLE-R-0002", name: "River Store", type: "Retail", city: "Sample City" },
];
const suppliers = [
  ["SAMPLE-W-1001", "Mesa Wholesale", "Distributor"], ["SAMPLE-W-1002", "Juniper Supply", "Distributor"],
  ["SAMPLE-M-2001", "Bluebird Kitchen", "Manufacturer"], ["SAMPLE-M-2002", "Harbor Extracts", "Manufacturer"],
  ["SAMPLE-C-3001", "Ridge Farms", "Cultivator"], ["SAMPLE-C-3002", "Canyon Grow", "Cultivator"],
].map(([license_number, name, license_type]) => ({ license_number, name, license_type }));
const itemSpecs = [
  ["Flower", "Grams", ["Blue Dream 3.5g", "Sour Diesel 3.5g", "OG Kush 7g", "Gelato 3.5g", "Wedding Cake 1g"], ["SAMPLE-C-3001", "SAMPLE-C-3002"]],
  ["Pre-roll", "Each", ["Classic Pre-roll 1g", "Mini Pre-roll 5-pack", "Infused Pre-roll 1g"], ["SAMPLE-C-3001", "SAMPLE-W-1001"]],
  ["Edible", "Each", ["Citrus Gummies 10pk", "Dark Chocolate Bar", "Sleep Gummies 20pk", "Mint Tablets 20pk"], ["SAMPLE-M-2001", "SAMPLE-W-1002"]],
  ["Vape", "Each", ["Hybrid Cartridge 0.5g", "Indica Cartridge 1g", "Disposable 0.3g"], ["SAMPLE-M-2002", "SAMPLE-W-1001"]],
  ["Concentrate", "Grams", ["Live Resin 1g", "Shatter 1g"], ["SAMPLE-M-2002"]],
  ["Topical", "Each", ["Relief Balm 50ml", "Body Lotion 100ml"], ["SAMPLE-M-2001", "SAMPLE-W-1002"]],
];
const items = [];
for (const [category, unit, names, makers] of itemSpecs) for (const name of names) {
  items.push({ item_id: `ITM-${pad(items.length + 1, 3)}`, name, category, unit_of_measure: unit, makers });
}

// Batches: each item gets a new batch every 10 to 20 days from a supplier that makes it.
const batches = [];
const batchesByItem = new Map();
for (const item of items) {
  const list = [];
  let day = -DAYS - int(5, 25);
  while (day <= 0) {
    const supplier = pick(item.makers);
    const issued = day + int(3, 7);
    const batch = { batch_id: `LOT-${item.item_id.slice(4)}-${pad(batches.length + 1, 4)}`, item_id: item.item_id, supplier_license: supplier,
      batch_day: day, coa_url: `https://example.com/coa/${pad(batches.length + 1, 4)}`, coa_issued_day: issued, coa_expires_day: issued + 365, lab_testing_state: "TestPassed" };
    batches.push(batch); list.push(batch);
    day += int(10, 20);
  }
  batchesByItem.set(item.item_id, list);
}
// Batch-level problems: a few COAs missing, a few expired before the batch is received.
for (const batch of batches) {
  const roll = rand();
  if (roll < 0.025) batch.coa_url = "";
  else if (roll < 0.04) { batch.coa_issued_day = batch.batch_day - 400; batch.coa_expires_day = batch.batch_day - 35; }
}

// Shipments: per store per day, 3 to 4 manifests of 2 to 4 packages; day 0 is a fuller staged shift.
const manifests = [], lines = [], receiving = [], inventory = [], answerKey = [];
let packageNumber = 10001, manifestNumber = 500001;
const rates = [["lot_mismatch", 0.008], ["missing_lot", 0.006], ["missing_receipt", 0.004], ["left_off_manifest", 0.003], ["quantity_variance", 0.009]];
const day0Plan = { "SAMPLE-R-0001": ["lot_mismatch", "missing_lot", "missing_receipt", "quantity_variance", "left_off_manifest"],
  "SAMPLE-R-0002": ["quantity_variance", "lot_mismatch", "missing_lot", "missing_receipt"] };

for (let day = -(DAYS - 1); day <= 0; day++) {
  for (const facility of facilities) {
    const count = day === 0 ? 5 : int(3, 4);
    let minute = int(7 * 60 + 10, 8 * 60);
    const staged = day === 0 ? [...day0Plan[facility.license_number]] : [];
    for (let m = 0; m < count; m++) {
      const supplier = pick(suppliers);
      const offered = items.filter((item) => item.makers.includes(supplier.license_number));
      const pool = offered.length ? offered : items;
      const manifest = { manifest_number: `MAN-${manifestNumber++}`, shipper_license: supplier.license_number, recipient_license: facility.license_number,
        departed_day: day, departed_time: hhmm(minute - int(60, 180)), arrived_day: day, arrived_time: hhmm(minute) };
      manifests.push(manifest);
      const size = day === 0 ? int(3, 4) : int(2, 4);
      for (let p = 0; p < size; p++) {
        const item = pick(pool);
        const usable = batchesByItem.get(item.item_id).filter((batch) => batch.batch_day <= day - 2);
        const batch = usable.at(-1) ?? batchesByItem.get(item.item_id)[0];
        const label = `PKG-${packageNumber++}`;
        const shipped = item.unit_of_measure === "Grams" ? pick([28, 56, 112, 224, 448]) : int(1, 10) * 10;
        let issue = staged.length && rand() < 0.5 ? staged.shift() : null;
        if (!issue && day !== 0) { let roll = rand(); for (const [name, rate] of rates) { if (roll < rate) { issue = name; break; } roll -= rate; } }
        const receivedAt = hhmm(minute + int(5, 40));
        const line = { manifest_number: manifest.manifest_number, package_label: label, item_id: item.item_id, batch_id: batch.batch_id, shipped_quantity: shipped, unit: item.unit_of_measure };
        const receipt = { received_day: day, received_time: receivedAt, facility: facility.license_number, package_label: label, manifest_number: manifest.manifest_number,
          batch_id_recorded: batch.batch_id, received_quantity: shipped, unit: item.unit_of_measure, received_by_role: pick(["Receiving lead", "Inventory clerk"]), note: "" };
        const stock = { facility: facility.license_number, package_label: label, item_id: item.item_id, batch_id_listed: batch.batch_id, quantity_on_hand: shipped,
          unit: item.unit_of_measure, location: pick(["Back room A", "Back room B", "Vault", "Sales floor"]), last_counted_day: day };
        if (issue === "lot_mismatch") { const other = batchesByItem.get(item.item_id).find((b) => b.batch_id !== batch.batch_id); stock.batch_id_listed = other ? other.batch_id : `${batch.batch_id}-X`; }
        if (issue === "missing_lot") stock.batch_id_listed = "";
        if (issue === "quantity_variance") { const short = item.unit_of_measure === "Grams" ? pick([1, 2, 3.5]) : pick([1, 2, 10]); receipt.received_quantity = +(shipped - short).toFixed(1); stock.quantity_on_hand = receipt.received_quantity; receipt.note = "Counted short at the door"; }
        if (issue !== "left_off_manifest") lines.push(line);
        if (issue !== "missing_receipt") receiving.push(receipt);
        inventory.push(stock);
        if (issue) answerKey.push({ package_label: label, facility: facility.license_number, day, issue, injected_by: day === 0 ? "staged shift" : "base rate" });
        const coaProblem = batch.coa_url === "" ? "coa_missing" : batch.coa_expires_day < day ? "coa_expired" : null;
        if (coaProblem) answerKey.push({ package_label: label, facility: facility.license_number, day, issue: coaProblem, injected_by: "batch" });
      }
      minute += int(70, 150);
    }
  }
}
// Any day-0 issue that wasn't placed gets the last package of that store.
for (const facility of facilities) {
  const placed = new Set(answerKey.filter((row) => row.day === 0 && row.facility === facility.license_number).map((row) => row.issue));
  const missing = day0Plan[facility.license_number].filter((issue) => !placed.has(issue));
  if (missing.length) throw new Error(`Day 0 for ${facility.name} is missing staged issues: ${missing.join(", ")}. Change SEED.`);
}

const tables = {
  facilities, suppliers, items: items.map(({ makers, ...rest }) => rest), batches, manifests,
  manifest_lines: lines, receiving_log: receiving, inventory, answer_key: answerKey,
};

const csv = (rows) => {
  const head = Object.keys(rows[0]);
  const cell = (value) => { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; };
  return [head.join(","), ...rows.map((row) => head.map((key) => cell(row[key])).join(","))].join("\n") + "\n";
};
mkdirSync(`data/${VERSION}`, { recursive: true });
for (const [name, rows] of Object.entries(tables)) writeFileSync(`data/${VERSION}/${name}.csv`, csv(rows));
mkdirSync("src/sample", { recursive: true });
writeFileSync(`data/${VERSION}/dataset.json`, JSON.stringify({ version: VERSION, seed: SEED, days: DAYS, ...tables }));
// The app only needs today's shift and the reference tables; the full set stays for tests and evals.
const today = (rows, key) => rows.filter((row) => row[key] === 0);
const todayLabels = new Set(inventory.filter((row) => row.last_counted_day === 0).map(({ package_label }) => package_label));
writeFileSync("src/sample/today.json", JSON.stringify({
  version: VERSION, facilities, suppliers, items: tables.items,
  batches: batches.filter((batch) => lines.concat([]).some((line) => line.batch_id === batch.batch_id && todayLabels.has(line.package_label)) || inventory.some((row) => todayLabels.has(row.package_label) && (row.batch_id_listed === batch.batch_id))),
  manifests: today(manifests, "arrived_day"), manifest_lines: lines.filter(({ package_label }) => todayLabels.has(package_label)),
  receiving_log: today(receiving, "received_day"), inventory: inventory.filter(({ package_label }) => todayLabels.has(package_label)),
}));
const counts = Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length]));
console.log(JSON.stringify(counts));
