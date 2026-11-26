// MELLOW_EVALS.md section K: every answer and every inspection-prep surface validates against Mellow's catalog.
import assert from "node:assert/strict";
import { test } from "node:test";
import { answerMessage, prepMessage, validate } from "../src/a2ui/catalog.ts";
import { ask } from "../src/ask.ts";
import { sampleComparison } from "../src/comparison.ts";
import { checkControls } from "../src/controls.ts";
import { samplePosture } from "../src/monitoring.ts";

const at = "2026-11-25T20:00:00Z";
const posture = samplePosture(at);
const queue = ["PKG-221", "PKG-443", "PKG-552"].map((id) => ({ id, record: id }));
const context = { queue, manager: [], comparison: sampleComparison, runs: posture.runs, receiving: "current" };

const questions = [
  "What needs me right now?", "Anything wrong with 443?", "Anything wrong with PKG-999?", "What matched?", "Show me today's gaps",
  "Show me the differences", "How's today going?", "What can you do?", "Who are you?", "How do you know?", "Approve PKG-443",
  "Is PKG-443 compliant?", "Will we pass our next audit?", "Am I compliant in Texas?", "Are we ready for an inspection?",
  "Will HB 369 pass?", "Show me the Texas hemp rules", "What counts as a gap?", "Where is the lot on a label?",
  "What will an inspector ask for?", "Hand off the shift", "Compare new files", "asdf qwerty",
];

for (const question of questions) {
  test(`K1 · "${question}" validates against the catalog`, () => {
    const answer = ask(question, context);
    const problems = validate(answerMessage(answer), { recordAnswer: answer.basis?.verified === true });
    assert.deepEqual(problems, [], problems.join("\n"));
  });
}

test("K2 · inspection prep validates, one ControlCheck and StatusWord per control", () => {
  const message = prepMessage(checkControls(sampleComparison));
  assert.deepEqual(validate(message), []);
  assert.equal(message.updateComponents.components.filter(({ component }) => component === "ControlCheck").length, 9);
});

const msg = (components) => ({ version: "1.0", updateComponents: { surfaceId: "t", components } });

test("K3 · a verdict can't be rendered", () => {
  assert.match(validate(msg([{ id: "root", component: "Verdict", value: "Compliant" }])).join(), /isn't in the catalog/);
  assert.match(validate(msg([{ id: "root", component: "Column", children: ["c"] },
    { id: "c", component: "ControlCheck", controlId: "H1", title: "t", citation: "c", counts: "x", reviewLabel: "r", children: ["s"] },
    { id: "s", component: "StatusWord", value: "Ready" }])).join(), /"Ready" isn't allowed/);
  assert.match(validate(msg([{ id: "root", component: "Answer", title: "You're compliant", body: "All good." }])).join(), /verdict language/);
});

test("K4 · proposed rules stay in their own surface", () => {
  assert.match(validate(msg([{ id: "root", component: "Column", children: ["p"] },
    { id: "p", component: "ProposedRule", billId: "HB 369", status: "Filed", textUrl: "https://capitol.texas.gov" }])).join(), /can't sit inside Column/);
  assert.match(validate(msg([{ id: "root", component: "WhatIfSurface", label: "Proposed, not law", children: ["c"] },
    { id: "c", component: "ControlCheck", controlId: "H1", title: "t", citation: "c", counts: "x", reviewLabel: "r", children: [] }])).join(), /can't sit inside WhatIfSurface/);
});

test("K5 · an answer drawn from records needs a Stamp", () => {
  assert.match(validate(msg([{ id: "root", component: "Answer", title: "PKG-1", body: "b" }]), { recordAnswer: true }).join(), /needs a Stamp/);
});

test("K6 · the binder validates, with counted items and items to have on hand kept apart", async () => {
  const { binderMessage } = await import("../src/a2ui/catalog.ts");
  const message = binderMessage(checkControls(sampleComparison), [{ packageId: "PKG-443", decision: "Left for a manager" }],
    "This lists what your records show and what to have on hand. It’s not a compliance assessment, and it isn’t legal advice.");
  assert.deepEqual(validate(message), []);
  const list = message.updateComponents.components;
  assert.equal(list.filter(({ component }) => component === "ControlCheck").length, 2);
  assert.equal(list.find(({ id }) => id === "onhand").children.length, 7);
});
