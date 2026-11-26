// MELLOW_EVALS.md section M: every number on every page comes from one place and adds up.
import assert from "node:assert/strict";
import { test } from "node:test";
import { ask, brief, orderQueue } from "../src/ask.ts";
import { comparisonTasks, sampleComparison } from "../src/comparison.ts";
import { ledgerCounts } from "../src/ledger-math.ts";
import { monitorReceiving, samplePosture } from "../src/monitoring.ts";
import { noteTrail } from "../src/notes.ts";
import { initial, latestDecisions, workQueue } from "../src/workspace.ts";

const at = "2026-11-25T20:00:00Z";
const entry = (task, decision, minute) => ({ id: `${task.id}-${minute}`, task, decision, at: `2026-11-25T20:${String(minute).padStart(2, "0")}:00Z`, evidence: { reference: "", excerpt: "", note: "" } });

function state(history = [], extra = [], extraTasks = []) {
  const workspace = { ...initial, tasks: [...initial.tasks, ...extraTasks], history };
  let posture = samplePosture(at);
  if (extra.length) posture = monitorReceiving(posture, extra, "current", "2026-11-25T20:30:00Z");
  const comparison = [...sampleComparison, ...extra];
  const queue = workQueue(workspace);
  const latest = latestDecisions(history);
  const manager = workspace.tasks.filter(({ id }) => latest.get(id) === "Manager review requested");
  const counts = ledgerCounts({ comparison, tasks: workspace.tasks, history, runs: posture.runs, now: new Date(at) });
  const context = { queue, manager, comparison, runs: posture.runs, receiving: "current", counts };
  return { workspace, posture, comparison, queue, manager, counts, context };
}

const [t221, t443, t552] = initial.tasks;
const fresh = [{ packageId: "PKG-610", inventory: "SAMPLE-9", receiving: "SAMPLE-4", state: "different" }];
const states = {
  fresh: state(),
  "one with a manager": state([entry(t443, "Manager review requested", 1)]),
  "recorded, not an issue, reopened": state([entry(t443, "Approved", 1), entry(t221, "Dismissed", 2), entry(t552, "Approved", 3), entry(t552, "Reopened", 4)]),
  "after a new check": state([], fresh, comparisonTasks(fresh, "Sample inventory export", "Sample receiving log")),
};

for (const [name, s] of Object.entries(states)) {
  test(`M3 · ${name}: flagged = open + decided, and every exception has a task`, () => {
    const c = s.counts;
    assert.equal(c.flagged, c.open + c.decided);
    assert.equal(c.decided, c.recorded + c.notAnIssue + c.manager);
    assert.equal(c.packages, c.matched + c.exceptions);
    assert.deepEqual(c.untracked, []);
    assert.equal(c.exceptions, c.flagged, "in the sample, every flagged task is an exception");
    assert.equal(c.open, s.queue.length);
    assert.equal(c.manager, s.manager.length);
  });

  test(`M4 · ${name}: the checks add up to the rows they compared`, () => {
    const runs = s.posture.runs;
    assert.equal(runs.reduce((sum, run) => sum + run.checked, 0), s.comparison.length);
    assert.equal(runs.reduce((sum, run) => sum + run.matched, 0), s.counts.matched);
    assert.equal(s.counts.checks, runs.length);
  });

  test(`M5 · ${name}: the briefing, the summary answer and "what matched" use the same numbers`, () => {
    const c = s.counts;
    const b = brief(s.context, new Date(at));
    const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    if (c.open) assert.match(b.headline, new RegExp(`^${words[c.open] ?? c.open} package`, "i"));
    assert.match(b.message, new RegExp(`${c.matched} (more matched|matched packages)`));
    const summary = ask("How's today going?", s.context);
    assert.equal(summary.intent, "summary");
    assert.match(summary.title, new RegExp(`^${c.packages} packages compared`));
    assert.match(summary.body, new RegExp(`${c.matched} matched and ${c.exceptions} had a difference or a gap`));
    assert.match(summary.body, new RegExp(`${c.open} records? still open`));
    assert.match(ask("What matched?", s.context).title, new RegExp(`^${c.matched} packages matched`));
    assert.equal(orderQueue(s.queue, s.comparison).length, c.open);
  });
}

test("M6 · one finding is one entry in the notes log", () => {
  const issues = [{ taskId: "a", record: "PKG-611", kind: "different", at }, { taskId: "b", record: "PKG-612", kind: "different", at }];
  const trail = noteTrail({ checks: ["2026-11-25T19:00:00Z", at], newIssues: issues, sources: [], waiting: [], now: at });
  assert.equal(trail.filter((note) => note.at === at).length, 1);
});
