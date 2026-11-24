import assert from "node:assert/strict";
import { test } from "node:test";
import { ask } from "../src/ask.ts";
import { sampleComparison } from "../src/comparison.ts";
import { monitorReceiving, sampleHistory } from "../src/monitoring.ts";
import { panelFor, panelLabel, queueView, sameView } from "../src/panel.ts";

const at = "2026-11-24T20:00:00Z";
const posture = monitorReceiving(undefined, sampleComparison, "current", at, sampleHistory(at));
const queue = ["PKG-221", "PKG-443", "PKG-552"].map((id) => ({ id, record: id }));
const context = { queue, manager: [], comparison: sampleComparison, runs: posture.runs, receiving: "current" };
const view = (input) => panelFor(ask(input, context));

test("the panel follows what the conversation is about", () => {
  assert.deepEqual(view("anything wrong with 443?"), { kind: "package", id: "PKG-443" });
  assert.deepEqual(view("show me today's gaps"), { kind: "series", series: "missing" });
  assert.deepEqual(view("which ones don't match"), { kind: "series", series: "different" });
  assert.deepEqual(view("what matched?"), { kind: "series", series: "matched" });
  assert.deepEqual(view("how did receiving go today"), { kind: "summary" });
  assert.deepEqual(view("is the receiving feed down?"), { kind: "summary" });
  assert.deepEqual(view("what did I leave for my manager"), { kind: "handoff" });
  assert.deepEqual(view("walk me through all three"), queueView);
});

test("questions that don't point anywhere leave the panel alone", () => {
  assert.equal(view("make me a sandwich"), null);
  assert.equal(view("I have a new vendor manifest"), null);
  assert.equal(view("PKG-999"), null);
});

test("every view has a plain label", () => {
  assert.equal(panelLabel({ kind: "package", id: "PKG-443" }), "PKG-443");
  assert.equal(panelLabel({ kind: "series", series: "missing" }), "Today’s gaps");
  assert.equal(panelLabel(queueView), "Today’s queue");
  assert.ok(sameView({ kind: "summary" }, { kind: "summary" }));
  assert.ok(!sameView(queueView, { kind: "summary" }));
});
