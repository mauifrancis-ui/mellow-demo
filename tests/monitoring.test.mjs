import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleComparison } from "../src/comparison.ts";
import { monitorReceiving, sampleHistory } from "../src/monitoring.ts";

test("a delayed source preserves the last successful scope and timestamp", () => {
  const at = "2026-11-24T20:00:00Z";
  const checked = monitorReceiving(undefined, sampleComparison, "current", at);
  assert.deepEqual(checked.lastSuccessfulRun, { checkedAt: at, checked: 8, matched: 5, different: 1, missing: 2, exceptions: 3 });
  const delayed = monitorReceiving(checked, [], "delayed", "2026-11-24T21:00:00Z");
  assert.equal(delayed.receiving, "delayed");
  assert.deepEqual(delayed.lastSuccessfulRun, checked.lastSuccessfulRun);
  assert.deepEqual(delayed.runs, checked.runs, "a delay adds no run to the history");
  assert.equal(delayed.delayedAt, "2026-11-24T21:00:00Z");
  const restored = monitorReceiving(delayed, sampleComparison, "current", "2026-11-24T22:00:00Z");
  assert.equal(restored.lastSuccessfulRun.checkedAt, "2026-11-24T22:00:00Z");
  assert.equal(restored.delayedAt, null);
  assert.equal(restored.runs.length, 2);
});

test("a delayed first run cannot claim that any packages were checked", () => {
  assert.deepEqual(monitorReceiving(undefined, sampleComparison, "delayed", "2026-11-24T20:00:00Z"), {
    receiving: "delayed", lastSuccessfulRun: null, runs: [], delayedAt: "2026-11-24T20:00:00Z",
  });
});

test("the sample history ends with the live check and keeps eight runs", () => {
  const at = "2026-11-24T20:00:00Z";
  const history = sampleHistory(at);
  assert.ok(history.every((run) => run.checkedAt < at && run.checked === run.matched + run.exceptions));
  let posture = monitorReceiving(undefined, sampleComparison, "current", at, history);
  assert.equal(posture.runs.length, 8);
  assert.equal(posture.runs.at(-1), posture.lastSuccessfulRun);
  posture = monitorReceiving(posture, sampleComparison, "current", "2026-11-24T21:00:00Z");
  assert.equal(posture.runs.length, 8);
  assert.equal(posture.runs.at(-1).checkedAt, "2026-11-24T21:00:00Z");
});
