// The app's sample workspace, built from the dataset (sprint 7, DB2 and DB3). Numbers reconcile,
// every finding has plain words, and every answer still validates against the catalog.
import assert from "node:assert/strict";
import { test } from "node:test";
import { answerMessage, validate } from "../src/a2ui/catalog.ts";
import { ask, brief, issueOf } from "../src/ask.ts";
import { ledgerCounts } from "../src/ledger-math.ts";
import { sampleFor, scoped, stores } from "../src/sample/store.ts";

for (const hour of ["06:10", "14:00", "23:40"]) {
  for (const store of stores) {
    const now = new Date(`2026-11-26T${hour}:00`);
    const sample = sampleFor(store.id, now);
    const context = { queue: sample.tasks, manager: [], comparison: sample.comparison, runs: sample.runs, receiving: "current" };

    test(`S1 · ${store.name} at ${hour}: every check is today, before now, and the checks add up to the rows`, () => {
      for (const run of sample.runs) {
        assert.equal(new Date(run.checkedAt).toDateString(), now.toDateString());
        assert.ok(new Date(run.checkedAt) <= now);
      }
      assert.equal(sample.runs.reduce((sum, run) => sum + run.checked, 0), sample.comparison.length);
      const counts = ledgerCounts({ comparison: sample.comparison, tasks: sample.tasks, history: [], runs: sample.runs, now });
      assert.deepEqual(counts.untracked, []);
      assert.equal(counts.flagged, counts.open);
      assert.equal(counts.checks, sample.runs.length);
    });

    test(`S2 · ${store.name} at ${hour}: every finding has plain words, and answers validate`, () => {
      for (const task of sample.tasks) {
        const issue = issueOf(task, sample.comparison);
        assert.notEqual(issue.kind, "other", task.id);
        assert.ok(issue.label && issue.detail, task.id);
      }
      const b = brief(context, now);
      assert.ok(b.headline.length > 0);
      for (const question of ["What needs me right now?", "How's today going?", "What will an inspector ask for?", `Anything wrong with ${sample.tasks[0].id}?`]) {
        const answer = ask(question, context);
        assert.deepEqual(validate(answerMessage(answer), { recordAnswer: answer.basis?.verified === true }), [], question);
      }
    });
  }
}

test("S3 · the first store keeps the original keys; the second gets its own", () => {
  assert.equal(scoped("mellow.release01", stores[0].id), "mellow.release01");
  assert.equal(scoped("mellow.release01", stores[1].id), `mellow.release01.${stores[1].id}`);
});

test("S4 · quantity and manifest findings read as facts", () => {
  const sample = sampleFor(stores[0].id, new Date("2026-11-26T23:00:00"));
  const labels = sample.tasks.map((task) => issueOf(task, sample.comparison).label);
  assert.ok(labels.includes("Quantities disagree"));
  assert.ok(labels.includes("Not on the manifest"));
  for (const task of sample.tasks) assert.doesNotMatch(issueOf(task, sample.comparison).detail, /\b(theft|stolen|fraud|error by|mistake|wrong)\b/i);
});
