import assert from "node:assert/strict";
import { test } from "node:test";
import { compareLots, comparisonTasks, lotInsight, lotRecords, sampleComparison, summarizeLots } from "../src/comparison.ts";

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
  assert.match(lotInsight(mismatch).title, /original package label/);
  assert.match(lotInsight(sampleComparison.find(({ packageId }) => packageId === "PKG-552")).title, /Find the receiving record/);
  assert.match(lotInsight(sampleComparison.find(({ packageId }) => packageId === "PKG-221")).detail, /Neither record lists a lot number/);
});

test("skim prioritizes a mismatch over gaps and stays quiet on matching records", () => {
  const summary = summarizeLots(sampleComparison);
  assert.equal(summary.checked, 53);
  assert.equal(summary.matched, 50);
  assert.equal(summary.different.length, 1);
  assert.equal(summary.missing.length, 2);
  assert.equal(summary.first.packageId, "PKG-443");
  assert.equal(summarizeLots(sampleComparison.filter(({ state }) => state === "match")).first, undefined);
});

test("comparison queues only exceptions and gives retries stable identities", () => {
  const tasks = comparisonTasks(sampleComparison, "inventory.csv", "receiving.csv");
  assert.deepEqual(tasks.map(({ record }) => record), ["PKG-443", "PKG-221", "PKG-552"]);
  assert.deepEqual(tasks.map(({ id }) => id),
    comparisonTasks(sampleComparison, "inventory.csv", "receiving.csv").map(({ id }) => id));
  assert.equal(tasks[0].lotComparison.receiving, "SAMPLE-6");
  assert.equal(tasks[2].lotComparison.receiving, null);
});

test("paired differences retain both sources and need a resolution note before approval", async () => {
  const { initial, prepareReview, recordDecision, shiftHandoff } = await import("../src/workspace.ts");
  const [task] = comparisonTasks(sampleComparison, "inventory.csv", "receiving.csv");
  const [,, unpaired] = comparisonTasks(sampleComparison, "inventory.csv", "receiving.csv");
  assert.equal(prepareReview(task).requiresRationale, true);
  assert.equal(prepareReview(unpaired).requiresRationale, false);
  const workspace = { ...initial, tasks: [task] };
  const evidence = { reference: "Original package label", excerpt: "Label checked", note: "" };
  assert.throws(() => recordDecision(workspace, task, "Approved", evidence), /resolves the conflict/);
  const escalated = recordDecision(workspace, task, "Manager review requested", evidence);
  assert.match(shiftHandoff(escalated)[0].text, /receiving.csv: Lot number: SAMPLE-6/);
  assert.match(shiftHandoff(escalated)[0].text, /inventory.csv/);
});
