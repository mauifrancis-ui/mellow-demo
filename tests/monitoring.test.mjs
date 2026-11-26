import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleComparison } from "../src/comparison.ts";
import { checksToday, monitorReceiving, samplePosture, sampleRuns } from "../src/monitoring.ts";
import { sampleBatchRows } from "../src/comparison.ts";

test("a delayed source preserves the last successful scope and timestamp", () => {
  const at = "2026-11-24T20:00:00Z";
  const checked = monitorReceiving(undefined, sampleComparison, "current", at);
  const { ids, ...counts } = checked.lastSuccessfulRun;
  assert.deepEqual(counts, { checkedAt: at, checked: 53, matched: 50, different: 1, missing: 2, exceptions: 3 });
  assert.equal(ids.length, 53);
  const delayed = monitorReceiving(checked, [], "delayed", "2026-11-24T21:00:00Z");
  assert.equal(delayed.receiving, "delayed");
  assert.deepEqual(delayed.lastSuccessfulRun, checked.lastSuccessfulRun);
  assert.deepEqual(delayed.runs, checked.runs, "a delay adds no run to the history");
  assert.equal(delayed.delayedAt, "2026-11-24T21:00:00Z");
  const restored = monitorReceiving(delayed, [], "current", "2026-11-24T22:00:00Z");
  assert.equal(restored.receiving, "current");
  assert.equal(restored.delayedAt, null);
  assert.equal(restored.runs.length, 1, "restoring a source records no new check and counts nothing twice");
});

test("a delayed first run cannot claim that any packages were checked", () => {
  assert.deepEqual(monitorReceiving(undefined, sampleComparison, "delayed", "2026-11-24T20:00:00Z"), {
    receiving: "delayed", lastSuccessfulRun: null, runs: [], delayedAt: "2026-11-24T20:00:00Z",
  });
});

test("M1 · sample checks are all today, each package belongs to one check, and they add up to the rows", () => {
  for (const at of ["2026-11-24T20:00:00Z", "2026-11-24T06:20:00Z"]) {
    const runs = sampleRuns(at);
    assert.equal(runs.length, 8);
    assert.equal(checksToday(runs, new Date(at)).length, 8, `all sample checks fall on today's date at ${at}`);
    assert.equal(runs.at(-1).checkedAt, new Date(at).toISOString());
    const ids = runs.flatMap((run) => run.ids);
    assert.equal(new Set(ids).size, ids.length, "no package is in two checks");
    assert.equal(ids.length, sampleComparison.length);
    assert.equal(runs.reduce((sum, run) => sum + run.matched, 0), sampleComparison.filter(({ state }) => state === "match").length);
    assert.equal(runs.reduce((sum, run) => sum + run.exceptions, 0), sampleComparison.filter(({ state }) => state !== "match").length);
  }
  assert.equal(sampleBatchRows().flat().length, sampleComparison.length);
});

test("M2 · a new check counts only the packages it adds, and the window isn't capped", () => {
  const at = "2026-11-24T20:00:00Z";
  let posture = samplePosture(at);
  const fresh = [{ packageId: "PKG-610", inventory: "SAMPLE-9", receiving: "SAMPLE-4", state: "different" }];
  posture = monitorReceiving(posture, fresh, "current", "2026-11-24T21:00:00Z");
  assert.equal(posture.runs.length, 9, "the ninth check is kept, not dropped");
  assert.equal(posture.runs.at(-1).checked, 1);
  assert.equal(posture.runs.reduce((sum, run) => sum + run.checked, 0), sampleComparison.length + 1);
});
