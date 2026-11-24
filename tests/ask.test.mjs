import assert from "node:assert/strict";
import { test } from "node:test";
import { ask, suggestions } from "../src/ask.ts";
import { sampleComparison } from "../src/comparison.ts";
import { monitorReceiving, sampleHistory } from "../src/monitoring.ts";

const at = "2026-11-24T20:00:00Z";
const posture = monitorReceiving(undefined, sampleComparison, "current", at, sampleHistory(at));
const queue = ["PKG-221", "PKG-443", "PKG-552"].map((id) => ({ id, record: id }));
const context = { queue, manager: [], comparison: sampleComparison, runs: posture.runs, receiving: "current" };
const intent = (input, extra = {}) => ask(input, { ...context, ...extra }).intent;

test("everyday phrasing reaches the right answer", () => {
  const cases = {
    "anything wrong with 443?": "package",
    "PKG-552": "package",
    "what's going on with package #221": "package",
    "can you look up 999": "unknown-package",
    "what should I look at first": "next",
    "what's on my plate": "next",
    "show me the missing lot numbers": "gaps",
    "which ones don't match": "differences",
    "anything mismatched?": "differences",
    "I got a new manifest from the vendor": "compare",
    "is the receiving feed down?": "source",
    "what did I leave for my manager": "handoff",
    "how are we doing today": "summary",
    "which packages matched": "matched",
    "what's a lot number": "learn",
    "make me a sandwich": "fallback",
  };
  for (const [input, expected] of Object.entries(cases)) assert.equal(intent(input), expected, input);
});

test("every suggestion chip gets a real answer", () => {
  for (const input of suggestions) assert.notEqual(intent(input), "fallback", input);
});

test("answers use the sample records and never invent a package", () => {
  const answer = ask("anything wrong with 443?", context);
  assert.match(answer.body, /no lot number/);
  assert.match(answer.body, /SAMPLE-6/);
  assert.deepEqual(answer.actions[0].action, { kind: "open", id: "PKG-443" });
  assert.equal(answer.series, "different");
  const unknown = ask("PKG-999", context);
  assert.equal(unknown.actions.some((item) => item.action.kind === "open"), false);
});

test("gaps list both missing packages and the summary adds up the runs", () => {
  const gaps = ask("gaps", context);
  assert.deepEqual(gaps.items.map((item) => item.label), ["PKG-221", "PKG-552"]);
  const summary = ask("today", context);
  const total = posture.runs.reduce((sum, run) => sum + run.checked, 0);
  assert.match(summary.title, new RegExp(`^${total} packages`));
});

test("the source answer follows the live posture", () => {
  assert.equal(ask("feed down?", { ...context, receiving: "delayed" }).actions[0].action.kind, "restore");
  assert.equal(ask("feed down?", context).actions[0].action.kind, "delay");
});
