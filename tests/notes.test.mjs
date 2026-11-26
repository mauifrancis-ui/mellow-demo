// MELLOW_EVALS.md cases P1 to P6: when Mellow speaks first.
import assert from "node:assert/strict";
import { test } from "node:test";
import { notesFor } from "../src/notes.ts";

const t = (h, m = 0) => new Date(Date.UTC(2026, 10, 25, h, m)).toISOString();
const base = { checks: [t(14, 43), t(15, 13)], newIssues: [], receiving: "current", waiting: [], dismissed: new Set(), now: t(15, 20) };
const issue = (taskId, kind = "different", at = t(15, 13)) => ({ taskId, record: taskId, kind, at });
const banned = /\b(risk\w*|compliant|safe|violation|should|might|likely|noticed)\b/i;

test("P1 · a new issue gets one row note and one briefing line naming the previous check", () => {
  const notes = notesFor({ ...base, newIssues: [issue("PKG-610")] });
  assert.equal(notes.rows.size, 1);
  assert.match(notes.briefing.text, /^Since the .* check, the .* check found one new difference: PKG-610\.$/);
  assert.ok(notes.fresh.has("PKG-610"));
  assert.ok(notes.rows.get("PKG-610").compared.includes("PKG-610 in both files"));
});

test("P2 · a delayed source is said first, with the last good check; restoring says so once", () => {
  const delayed = notesFor({ ...base, receiving: "delayed", lastGoodAt: t(15, 13) });
  assert.equal(delayed.briefing.kind, "delayed");
  assert.match(delayed.briefing.text, /hasn’t reported since/);
  const back = notesFor({ ...base, restoredAt: t(15, 40) });
  assert.equal(back.briefing.kind, "restored");
});

test("P3 · nothing changed means nothing is said", () => {
  const notes = notesFor(base);
  assert.equal(notes.briefing, undefined);
  assert.equal(notes.rows.size, 0);
  assert.equal(notes.fresh.size, 0);
});

test("P4 · more than two new in one check is one batched line and no row notes", () => {
  const notes = notesFor({ ...base, newIssues: [issue("A"), issue("B"), issue("C", "missing")] });
  assert.equal(notes.rows.size, 0);
  assert.equal(notes.briefing.kind, "batch");
  assert.match(notes.briefing.text, /found 3 new: 2 differences and 1 gap\./);
  assert.equal(notes.fresh.size, 3, "rows still carry the NEW word");
});

test("P5 · a dismissed note never fires again, and dismissing doesn't clear NEW", () => {
  const first = notesFor({ ...base, newIssues: [issue("PKG-610")] });
  const dismissed = new Set([first.rows.get("PKG-610").id, first.briefing.id]);
  const again = notesFor({ ...base, newIssues: [issue("PKG-610")], dismissed });
  assert.equal(again.rows.size, 0);
  assert.equal(again.briefing, undefined);
  assert.ok(again.fresh.has("PKG-610"));
});

test("P6 · nothing new is said while a dialog is open", () => {
  const notes = notesFor({ ...base, newIssues: [issue("PKG-610")], dialogOpen: true });
  assert.equal(notes.briefing, undefined);
  assert.equal(notes.rows.size, 0);
});

test("Waiting on a manager fires only after a shift has passed", () => {
  const recent = notesFor({ ...base, waiting: [{ taskId: "PKG-221", record: "PKG-221", since: t(12) }] });
  assert.equal(recent.rows.size, 0);
  const old = notesFor({ ...base, waiting: [{ taskId: "PKG-221", record: "PKG-221", since: t(1) }] });
  assert.match(old.rows.get("PKG-221").text, /waited on a manager since the last shift/);
});

test("Notes speak about the latest check only, but NEW lasts until the row is opened", () => {
  const notes = notesFor({ ...base, newIssues: [issue("OLD", "different", t(14, 43))] });
  assert.equal(notes.briefing, undefined);
  assert.equal(notes.rows.size, 0);
  assert.ok(notes.fresh.has("OLD"), "a later check doesn't clear NEW");
});

test("No note uses interpretive or risk words, and every note says why", () => {
  const sets = [
    notesFor({ ...base, newIssues: [issue("PKG-610")] }),
    notesFor({ ...base, newIssues: [issue("A"), issue("B"), issue("C")] }),
    notesFor({ ...base, receiving: "delayed", lastGoodAt: t(15) }),
    notesFor({ ...base, waiting: [{ taskId: "X", record: "X", since: t(1) }] }),
  ];
  for (const set of sets) for (const note of [set.briefing, ...set.rows.values()].filter(Boolean)) {
    assert.doesNotMatch(`${note.text} ${note.trigger}`, banned, note.text);
    assert.ok(note.trigger && note.compared.length, note.id);
  }
});

test("The Activity trail keeps every note, even after a later note replaces it", async () => {
  const { noteTrail } = await import("../src/notes.ts");
  const trail = noteTrail({
    checks: [t(14, 43), t(15, 13), t(15, 30)],
    newIssues: [issue("PKG-610"), issue("A", "different", t(15, 30)), issue("B", "different", t(15, 30)), issue("C", "missing", t(15, 30))],
    sources: [{ kind: "delayed", at: t(15, 40), lastGoodAt: t(15, 30) }, { kind: "restored", at: t(15, 50) }],
    waiting: [], now: t(16),
  });
  // One finding is one entry (sprint 5, D-d): the 15:13 check logs its briefing note, not a second row note.
  assert.deepEqual(trail.map((note) => note.kind), ["new", "batch", "delayed", "restored"]);
});
