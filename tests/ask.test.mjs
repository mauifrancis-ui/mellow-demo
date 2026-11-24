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

test("the briefing leads with what needs a person, from live data", async () => {
  const { brief, orderQueue } = await import("../src/ask.ts");
  const afternoon = new Date(2026, 10, 24, 15, 20);
  const result = brief(context, afternoon);
  assert.equal(result.greeting, "Good afternoon.");
  assert.equal(result.headline, "Three packages need you before close.");
  assert.equal(result.focusId, "PKG-443", "a disagreement outranks gaps");
  assert.match(result.message, /^Start with PKG-443\. Inventory has no lot number\. Receiving has SAMPLE-6\./);
  assert.match(result.message, /Two more are missing a lot or a record\./);
  const matched = posture.runs.reduce((sum, run) => sum + run.matched, 0);
  assert.match(result.message, new RegExp(`The other ${matched} from today’s 8 checks matched`));
  for (const chip of result.chips) assert.notEqual(ask(chip, context).intent, "fallback", chip);
  assert.deepEqual(orderQueue(queue, sampleComparison).map(({ issue }) => issue.label),
    ["Records disagree", "No lot in either record", "No receiving record"]);
});

test("the briefing handles an empty queue, a manager handoff and a delay", async () => {
  const { brief } = await import("../src/ask.ts");
  const done = brief({ ...context, queue: [], manager: [{ id: "PKG-221", record: "PKG-221" }], receiving: "delayed" }, new Date(2026, 10, 24, 9));
  assert.equal(done.greeting, "Good morning.");
  assert.equal(done.headline, "You’re caught up.");
  assert.equal(done.focusId, undefined);
  assert.match(done.message, /^Receiving records are delayed/);
  assert.match(done.message, /One is waiting on a manager\./);
  assert.ok(done.chips.includes("What did I leave for my manager?"));
});

test("label and walk-through chips answer from the queue", () => {
  assert.equal(intent("What do I check on the label?"), "label");
  const list = ask("Walk me through all three", context);
  assert.equal(list.intent, "list");
  assert.deepEqual(list.items.map((item) => item.label), ["PKG-443", "PKG-221", "PKG-552"]);
  assert.equal(intent("show all the gaps"), "gaps");
});

test("answers carry structured rows and their own follow-ups", async () => {
  const { followUps } = await import("../src/ask.ts");
  const list = ask("Walk me through all three", context);
  assert.deepEqual(list.items[0], { label: "PKG-443", id: "PKG-443", kind: "different", title: "Records disagree", detail: "inventory: no lot · receiving: SAMPLE-6" });
  assert.equal(list.items[2].detail, "inventory: no lot · receiving: none");
  const gaps = ask("gaps", context);
  assert.deepEqual(gaps.items.map((item) => item.title), ["No lot in either record", "No receiving record"]);
  for (const input of ["Walk me through all three", "gaps", "what matched", "PKG-443", "nonsense words"]) {
    const next = followUps(ask(input, context), context);
    assert.ok(next.length > 0, input);
    for (const chip of next) assert.notEqual(ask(chip, context).intent, "fallback", `${input} → ${chip}`);
  }
});
