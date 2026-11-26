// MELLOW_EVALS.md section I: inspection prep (Texas hemp, retail). Counts trace to records; no verdicts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { ask } from "../src/ask.ts";
import { compareLots, sampleComparison } from "../src/comparison.ts";
import { checkControls, controlLabel, countLine, statusOf, texasHempControls } from "../src/controls.ts";
import { currentRules } from "../src/rules-tx.ts";
import { samplePosture } from "../src/monitoring.ts";

const at = "2026-11-25T20:00:00Z";
const context = { queue: ["PKG-221", "PKG-443", "PKG-552"].map((id) => ({ id, record: id })), manager: [], comparison: sampleComparison, runs: samplePosture(at).runs, receiving: "current" };
const verdicts = /\b(met|compliant|ready|readiness|posture|passed?|failed?|score)\b/i;

test("I1 · every count traces to packages, and the counts add up", () => {
  for (const result of checkControls(sampleComparison).filter(({ checkable }) => checkable)) {
    assert.equal(result.onFile.length + result.missing.length + result.disagree.length, sampleComparison.length, result.control.id);
    assert.equal(new Set([...result.onFile, ...result.missing, ...result.disagree]).size, sampleComparison.length);
  }
});

test("I2 · batch disagreements are counted on their own, never as on file", () => {
  const rows = compareLots([{ packageId: "A", lot: "L1" }, { packageId: "B", lot: "L2" }, { packageId: "C", lot: "" }], [{ packageId: "A", lot: "L1" }, { packageId: "B", lot: "L9" }]);
  const [h1, h2] = checkControls(rows);
  assert.deepEqual([h1.onFile, h1.missing], [["A", "B"], ["C"]]);
  assert.deepEqual([h2.onFile, h2.missing, h2.disagree], [["A"], ["C"], ["B"]]);
  assert.equal(statusOf(h2), "Missing");
  assert.equal(countLine(h2), "On file for 1 of 3 · missing for 1 · records disagree for 1");
});

test("I3 · what the files can't show says so, and every control cites a linked rule", () => {
  const ids = new Set(currentRules().map(({ id }) => id));
  for (const result of checkControls(sampleComparison)) {
    assert.ok(ids.has(result.control.ruleId), result.control.id);
    if (!result.checkable) assert.equal(statusOf(result), "Can’t check from these files");
  }
  assert.equal(texasHempControls.length, 9);
});

test("I4 · no verdict words in controls or labels", () => {
  for (const control of texasHempControls) assert.doesNotMatch(`${control.title} ${control.evidence} ${control.note ?? ""}`, verdicts, control.id);
  assert.match(controlLabel, /not reviewed by a regulatory expert/);
});

test("I5 · \"What will an inspector ask for?\" lists every item with counts and the review label", () => {
  const answer = ask("What will an inspector ask for?", context);
  assert.equal(answer.intent, "prep");
  assert.equal(answer.items.length, 9);
  assert.match(answer.body, /can count two from your records; seven I can’t check/);
  assert.match(answer.body, /not reviewed by a regulatory expert/);
  assert.doesNotMatch(`${answer.title} ${answer.body}`, verdicts);
  assert.equal(answer.basis.verified, true);
});

test("I6 · \"Are we ready for an inspection?\" gives counts, not a verdict", () => {
  const answer = ask("Are we ready for an inspection?", context);
  assert.equal(answer.intent, "compliance");
  assert.match(answer.body, /Batch ID on file for 50 of 53/);
  assert.match(answer.body, /Seven more items can’t be checked/);
  assert.doesNotMatch(answer.body.replace("I can’t tell you whether you comply", ""), /\b(compliant|ready|readiness|passed?)\b/i);
});
