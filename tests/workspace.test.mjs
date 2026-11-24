import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyDraft, initial, inspectRow, latestDecisions, nextRecord, parseCsv, prepareReview, recordDecision, shiftHandoff, workQueue } from "../src/workspace.ts";

test("approval requires both evidence fields and preserves the evidence snapshot", () => {
  const task = initial.tasks[0];
  assert.throws(() => recordDecision(initial, task, "Approved", { ...emptyDraft, reference: "Example" }), /Supporting evidence/);
  const evidence = { reference: "Sample inventory record", excerpt: "Sample supporting excerpt", note: "Checked" };
  const approved = recordDecision(initial, task, "Approved", evidence);
  assert.deepEqual(approved.history[0].evidence, evidence);
  assert.equal(recordDecision(approved, task, "Approved", evidence), approved);
});

test("reopening a resolved manager review keeps history and returns it to manager review", () => {
  const task = initial.tasks[0];
  const pending = recordDecision(initial, task, "Manager review requested", emptyDraft);
  const dismissed = recordDecision(pending, task, "Dismissed", emptyDraft);
  const reopened = recordDecision(dismissed, task, "Reopened", emptyDraft);
  assert.equal(latestDecisions(reopened.history).get(task.id), "Manager review requested");
  assert.deepEqual(reopened.history.map((entry) => entry.decision), ["Reopened", "Dismissed", "Manager review requested"]);
});

test("CSV observations report explicit data gaps and never infer a regulatory finding", () => {
  const rows = parseCsv('package_id,batch_id,delta_9_thc\r\n"P,1",,0.5%\r\n"P\n2",recorded,0.9%');
  assert.deepEqual(rows.map((row) => row.package_id), ["P,1", "P\n2"]);
  assert.equal(inspectRow(rows[0]), "The batch or lot field is empty.");
  assert.equal(inspectRow(rows[1]), "");
  assert.throws(() => parseCsv("package_id,batch_id\nPKG-1"), /column count/);
});

test("review advances in queue order and never picks a pending manager case", () => {
  const [first, second, third] = initial.tasks;
  const flagged = recordDecision(initial, second, "Manager review requested", emptyDraft);
  assert.equal(nextRecord(flagged.tasks, workQueue(flagged), second.id), third);
  const dismissed = recordDecision(flagged, third, "Dismissed", emptyDraft);
  assert.equal(nextRecord(dismissed.tasks, workQueue(dismissed), third.id), first);
  const finished = recordDecision(dismissed, first, "Manager review requested", emptyDraft);
  assert.deepEqual(workQueue(finished), []);
  assert.equal(nextRecord(finished.tasks, workQueue(finished), first.id), undefined);
  assert.equal(latestDecisions(finished.history).get(second.id), "Manager review requested");
});

test("prepared reviews distinguish corroborated, conflicting, missing, and imported evidence", () => {
  const [supported, conflicting, missing] = initial.tasks;
  const prepared = prepareReview(supported);
  const confirmed = recordDecision(initial, supported, "Approved", prepared.evidence);
  assert.deepEqual(confirmed.history[0].evidence, prepared.evidence);
  assert.equal(prepareReview(conflicting).evidence, undefined);
  assert.throws(() => recordDecision(initial, conflicting, "Approved", prepared.evidence), /resolves the conflict/);
  const escalated = recordDecision(initial, conflicting, "Manager review requested", emptyDraft);
  assert.deepEqual(escalated.history[0].comparedSource, prepareReview(conflicting).source);
  assert.equal(prepareReview(missing).source, undefined);
  assert.equal(prepareReview({ ...supported, sample: false }).source, undefined);
});

test("shift handoff includes the next check and source, and excludes resolved items", () => {
  const [, task] = initial.tasks;
  const flagged = recordDecision(initial, task, "Manager review requested", { ...emptyDraft, note: "Check with receiving." });
  const [handoff] = shiftHandoff(flagged);
  assert.match(handoff.text, /PKG-443/);
  assert.match(handoff.text, /Next check: Compare the original package label/);
  assert.match(handoff.text, /Sample receiving log/);
  assert.match(handoff.text, /Check with receiving/);
  assert.deepEqual(shiftHandoff(recordDecision(flagged, task, "Dismissed", emptyDraft)), []);
});
