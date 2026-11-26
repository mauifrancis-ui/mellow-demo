// MELLOW_EVALS.md cases S1 to S3: "Share these findings".
import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleComparison } from "../src/comparison.ts";
import { disclaimer, findingsSummary, findingsText } from "../src/findings.ts";

const input = { rows: sampleComparison, sources: [{ files: ["Sample inventory export", "Sample receiving log"], at: "2026-11-25T17:13:00Z", kind: "check" }], decisions: [] };
const verdicts = /\b(compliant|non-?compliant|violation|safe|ready|passed?|failed?|risk\w*|approved|verified)\b/i;

test("S1 · the summary counts what was compared and lists disagreements first", () => {
  const summary = findingsSummary(input);
  assert.equal(summary.title, "3 of 53 packages need a person");
  assert.deepEqual(summary.rows.map((row) => row.packageId), ["PKG-443", "PKG-221", "PKG-552"]);
  assert.equal(summary.rows[0].finding, "Records disagree");
  assert.equal(summary.rows[2].receiving, "(no record)");
});

test("S2 · the summary and its text never contain a verdict", () => {
  const text = findingsText(findingsSummary({ ...input, decisions: [{ record: "PKG-443", decision: "Manager review requested", at: "2026-11-25T17:20:00Z" }] }));
  assert.doesNotMatch(text.replace(disclaimer, ""), verdicts, text);
});

test("S3 · the text always ends with what this isn't", () => {
  const text = findingsText(findingsSummary(input));
  assert.ok(text.endsWith(disclaimer));
  assert.match(disclaimer, /not a compliance assessment/);
});

test("S2b · internal decision names never reach the summary ('Approved' reads as a sign-off)", () => {
  const text = findingsText(findingsSummary({ ...input, decisions: [{ record: "PKG-443", decision: "Approved", at: "2026-11-25T17:20:00Z" }, { record: "PKG-221", decision: "Dismissed", at: "2026-11-25T17:21:00Z" }] }));
  assert.match(text, /PKG-443: Issue recorded/);
  assert.match(text, /PKG-221: Marked not an issue/);
  assert.doesNotMatch(text.replace(disclaimer, ""), verdicts);
});

test("S4 · each set of files is named with its own time", () => {
  const summary = findingsSummary({ ...input, sources: [...input.sources, { files: ["inventory_nov25.csv", "receiving_log.csv"], at: "2026-11-25T20:27:00Z", kind: "compared" }] });
  assert.match(summary.compared, /Sample inventory export and Sample receiving log \(the .* check\); inventory_nov25\.csv and receiving_log\.csv \(compared .*\)\./);
});
