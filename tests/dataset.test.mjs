// MELLOW_EVALS.md section D: the prototype dataset is internally consistent, and Mellow's findings are
// scored against its answer key (DB1 and DB4). The dataset is fictional; scores here don't transfer to real data.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { compareShipments, predictedIssues } from "../src/shipments.ts";

const data = JSON.parse(readFileSync(new URL("../data/sample-v1/dataset.json", import.meta.url), "utf8"));
const today = JSON.parse(readFileSync(new URL("../src/sample/today.json", import.meta.url), "utf8"));

test("D1 · keys hold: every line, receipt and stock row points at things that exist", () => {
  const manifests = new Set(data.manifests.map((m) => m.manifest_number));
  const batches = new Set(data.batches.map((b) => b.batch_id));
  const items = new Set(data.items.map((i) => i.item_id));
  const facilities = new Set(data.facilities.map((f) => f.license_number));
  for (const line of data.manifest_lines) { assert.ok(manifests.has(line.manifest_number)); assert.ok(batches.has(line.batch_id)); assert.ok(items.has(line.item_id)); }
  for (const receipt of data.receiving_log) { assert.ok(facilities.has(receipt.facility)); assert.ok(manifests.has(receipt.manifest_number)); }
  for (const row of data.inventory) { assert.ok(facilities.has(row.facility)); assert.ok(items.has(row.item_id)); }
  const labels = data.inventory.map((row) => row.package_label);
  assert.equal(new Set(labels).size, labels.length, "package labels are unique");
});

test("D2 · every license and URL is visibly fictional", () => {
  for (const row of [...data.facilities, ...data.suppliers]) assert.match(row.license_number, /^SAMPLE-/);
  for (const batch of data.batches) if (batch.coa_url) assert.match(batch.coa_url, /^https:\/\/example\.com\//);
});

test("D3 · scale: two stores, 90 days, about 1,900 packages, issue rate within the stated 2 to 4% assumption", () => {
  assert.equal(data.facilities.length, 2);
  const days = new Set(data.receiving_log.map((r) => r.received_day));
  assert.equal(days.size, 90);
  assert.ok(data.inventory.length > 1500 && data.inventory.length < 2500, String(data.inventory.length));
  const base = data.answer_key.filter((r) => r.injected_by === "base rate").length;
  const rate = base / data.inventory.filter((r) => r.last_counted_day !== 0).length;
  assert.ok(rate > 0.02 && rate < 0.04, rate.toFixed(3));
});

test("D4 · today's slice matches the full dataset for day 0", () => {
  assert.equal(today.inventory.length, data.inventory.filter((r) => r.last_counted_day === 0).length);
  assert.equal(today.manifests.length, data.manifests.filter((m) => m.arrived_day === 0).length);
});

const SHIPMENT_ISSUES = ["lot_mismatch", "missing_lot", "missing_receipt", "left_off_manifest", "quantity_variance"];

test("D5 · accuracy against the answer key, every package over 90 days, both stores", () => {
  const truth = new Map();
  for (const row of data.answer_key) if (SHIPMENT_ISSUES.includes(row.issue)) truth.set(`${row.package_label}|${row.issue}`, row);
  const predicted = new Set();
  for (const facility of data.facilities) {
    for (const row of compareShipments(data, facility.license_number)) for (const issue of predictedIssues(row)) predicted.add(`${row.packageId}|${issue}`);
  }
  const report = {};
  for (const issue of SHIPMENT_ISSUES) {
    const t = [...truth.keys()].filter((k) => k.endsWith(`|${issue}`));
    const p = [...predicted].filter((k) => k.endsWith(`|${issue}`));
    const hit = p.filter((k) => truth.has(k)).length;
    report[issue] = { truth: t.length, found: p.length, precision: p.length ? hit / p.length : 1, recall: t.length ? hit / t.length : 1 };
  }
  console.log("Accuracy on sample-v1:", JSON.stringify(report));
  for (const [issue, score] of Object.entries(report)) {
    assert.equal(score.recall, 1, `${issue}: Mellow missed a planted problem`);
    assert.equal(score.precision, 1, `${issue}: Mellow flagged something that wasn't planted`);
  }
});
