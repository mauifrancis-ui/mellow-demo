import assert from "node:assert/strict";
import { test } from "node:test";
import { compareLots, lotRecords, sampleComparison } from "../src/comparison.ts";

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
