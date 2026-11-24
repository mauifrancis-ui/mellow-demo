import assert from "node:assert/strict";
import { test } from "node:test";
import { compareLots, lotInsight, lotRecords, sampleComparison } from "../src/comparison.ts";

test("read-only comparison distinguishes matched, different, blank, and unpaired rows", () => {
  const inventory = lotRecords("package_id,lot_number\nA,101\nB,\nC,\nD,400");
  const receiving = lotRecords("package_id,lot_number\nA,101\nB,200\nC,\nE,500");
  const before = structuredClone({ inventory, receiving });
  assert.deepEqual(compareLots(inventory, receiving), [
    { packageId: "A", inventory: "101", receiving: "101", state: "match" },
    { packageId: "B", inventory: "", receiving: "200", state: "different" },
    { packageId: "C", inventory: "", receiving: "", state: "missing" },
    { packageId: "D", inventory: "400", receiving: null, state: "missing" },
    { packageId: "E", inventory: null, receiving: "500", state: "missing" },
  ]);
  assert.deepEqual({ inventory, receiving }, before);
});

test("duplicate IDs and unsupported CSV columns fail instead of silently matching", () => {
  assert.throws(() => lotRecords("package_id,lot_number\nA,1\nA,2"), /one row per package/);
  assert.throws(() => lotRecords("sku,lot_number\nA,1"), /package_id and lot_number/);
  assert.equal(sampleComparison.filter(({ state }) => state === "different").length, 1);
});

test("briefing identifies which record is missing or disagrees", () => {
  const mismatch = sampleComparison.find(({ packageId }) => packageId === "PKG-443");
  assert.match(lotInsight(mismatch).detail, /Inventory has no lot number, but receiving does/);
  assert.match(lotInsight(mismatch).detail, /original package label/);
  assert.match(lotInsight(sampleComparison.find(({ packageId }) => packageId === "PKG-552")).title, /Find the receiving record/);
  assert.match(lotInsight(sampleComparison.find(({ packageId }) => packageId === "PKG-221")).detail, /Neither record lists a lot number/);
});
