import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleComparison } from "../src/comparison.ts";
import { monitorReceiving } from "../src/monitoring.ts";

test("a delayed source preserves the last successful scope and timestamp", () => {
  const at = "2026-11-24T20:00:00Z";
  const checked = monitorReceiving(undefined, sampleComparison, "current", at);
  assert.deepEqual(checked.lastSuccessfulRun, { checkedAt: at, checked: 8, matched: 5, exceptions: 3 });
  const delayed = monitorReceiving(checked, [], "delayed", "2026-11-24T21:00:00Z");
  assert.equal(delayed.receiving, "delayed");
  assert.deepEqual(delayed.lastSuccessfulRun, checked.lastSuccessfulRun);
  const restored = monitorReceiving(delayed, sampleComparison, "current", "2026-11-24T22:00:00Z");
  assert.equal(restored.lastSuccessfulRun.checkedAt, "2026-11-24T22:00:00Z");
});

test("a delayed first run cannot claim that any packages were checked", () => {
  assert.deepEqual(monitorReceiving(undefined, sampleComparison, "delayed", "2026-11-24T20:00:00Z"), {
    receiving: "delayed", lastSuccessfulRun: null,
  });
});
