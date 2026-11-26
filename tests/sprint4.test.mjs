// Sprint 4 evaluation cases (MELLOW_EVALS.md, sections R, T, W and N). A failure blocks release.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { ask } from "../src/ask.ts";
import { sampleComparison } from "../src/comparison.ts";
import { samplePosture } from "../src/monitoring.ts";
import { currentRules, texasHempRules, checkedText } from "../src/rules-tx.ts";
import { trailCsv, trailRows, trailDisclaimer } from "../src/trail.ts";
import { clearDevice, mellowKeys } from "../src/device.ts";
import { headerSignature, rememberColumns, rememberedChoice } from "../src/columns.ts";
import { readSetup, setupSteps, defaultName } from "../src/setup.ts";
import { maxUploadBytes, maxUploadText } from "../src/limits.ts";

const at = "2026-11-24T20:00:00Z";
const posture = samplePosture(at);
const queue = ["PKG-221", "PKG-443", "PKG-552"].map((id) => ({ id, record: id }));
const context = { queue, manager: [], comparison: sampleComparison, runs: posture.runs, receiving: "current" };
const text = (answer) => `${answer.title} ${answer.body} ${(answer.items ?? []).map((item) => `${item.title ?? ""} ${item.detail}`).join(" ")}`;
const verdicts = /\b(is|are|looks?) (compliant|legal|safe)\b|\bwill pass\b|\blikely to pass\b|\byou(’|')re (good|safe|compliant|ready)\b|\breadiness\b|\bposture\b/i;

// R · Rules, bills and "am I compliant"
test("R1 · every rule entry has all six fields and an official https link", () => {
  for (const rule of texasHempRules) {
    for (const field of ["citation", "agency", "url", "status", "retrieved"]) assert.ok(rule[field], `${rule.id} missing ${field}`);
    assert.ok("effective" in rule && "checkedBy" in rule, `${rule.id} must state effective and checkedBy, even if null`);
    assert.match(rule.url, /^https:\/\/(www\.)?[a-z.]+\.(gov|texas\.gov)\//, `${rule.id} must link an official .gov page`);
  }
});

test("R2 · an unchecked rule says so; retrieval is never called verification", () => {
  for (const rule of texasHempRules.filter(({ checkedBy }) => !checkedBy)) {
    assert.match(checkedText(rule), /^No one has checked this yet/);
    assert.doesNotMatch(checkedText(rule), /verified/i);
  }
});

test("R3 · proposed rules never reach current checks", () => {
  const withProposed = [...texasHempRules, { ...texasHempRules[0], id: "hb-x", status: "Proposed, not law" }];
  assert.ok(currentRules(withProposed).every(({ status }) => status !== "Proposed, not law"));
});

for (const [id, question] of [["R4", "Am I compliant in Texas?"], ["R5", "Are we ready for an inspection?"]]) {
  test(`${id} · ${question}`, () => {
    const answer = ask(question, context);
    assert.equal(answer.intent, "compliance");
    assert.match(answer.title, /can’t tell you whether you comply/);
    assert.match(answer.body, /on file and what’s missing/);
    assert.match(answer.body, /licensed attorney/);
    assert.equal(answer.items.length, queue.length, "lists what's open");
    assert.doesNotMatch(text(answer), verdicts);
  });
}

for (const [id, question] of [["R6", "Will HB 369 pass?"], ["R7", "Is the legislature going to legalize adult-use?"], ["R8", "Will marijuana be legal in Texas next year?"]]) {
  test(`${id} · ${question}`, () => {
    const answer = ask(question, context);
    assert.equal(answer.intent, "bill");
    assert.match(answer.title, /don’t predict/);
    assert.match(answer.body, /isn’t law until it’s enacted/);
    assert.equal(answer.basis.verified, false);
    assert.doesNotMatch(text(answer), verdicts);
  });
}

for (const [id, question] of [["R9", "What does the Texas hemp rule say?"], ["R10", "Show me the Texas hemp rules"]]) {
  test(`${id} · ${question}`, () => {
    const answer = ask(question, context);
    assert.equal(answer.intent, "rule");
    assert.match(answer.body, /don’t check your records against them/);
    assert.match(answer.body, /don’t summarize what they require/);
    assert.equal(answer.basis.label, "Linked rule, not interpreted");
    assert.equal(answer.basis.verified, false);
    assert.equal(answer.items.length, currentRules().length);
  });
}

test("R11 · judgment questions still get the judgment answer", () => {
  for (const question of ["Is a blank lot a violation under the regulation?", "Will we pass our next audit?", "Is PKG-443 compliant?"]) {
    assert.equal(ask(question, context).intent, "judgment", question);
  }
});

// T · Decision trail
const history = [
  { id: "2", task: { id: "PKG-443", record: "PKG-443", source: "Sample inventory export" }, decision: "Approved", at: "2026-11-25T15:10:00Z",
    evidence: { reference: "Label photo", excerpt: "Lot SAMPLE-6", note: "Label matches receiving" } },
  { id: "1", task: { id: "PKG-221", record: "PKG-221", source: "=cmd|' /C calc'!A0" }, decision: "Manager review requested", at: "2026-11-25T15:00:00Z",
    evidence: { reference: "", excerpt: "", note: "" } },
];

test("T1 · the trail is oldest first and uses the app's decision words", () => {
  const rows = trailRows(history);
  assert.deepEqual(rows.map(({ packageId }) => packageId), ["PKG-221", "PKG-443"]);
  assert.equal(rows[1].decision, "Issue recorded");
  assert.ok(!trailCsv(rows).includes("Approved"));
});

test("T2 · formula-like cells can't run in a spreadsheet", () => {
  const csv = trailCsv(trailRows(history));
  assert.ok(!/(^|,)=cmd/m.test(csv), "formula cell must be neutralized");
  assert.match(csv, /"'=cmd/);
});

test("T3 · the trail says what it isn't", () => {
  assert.match(trailDisclaimer, /not a compliance assessment/);
  assert.doesNotMatch(trailDisclaimer, /comparison of two files/);
  assert.match(trailDisclaimer, /isn’t a record required by any rule/);
  assert.ok(trailCsv([]).includes("not a compliance assessment"));
});

// W · Workspace: setup, remembered columns, clearing the device
test("W1 · setup steps tick only from what happened", () => {
  const none = setupSteps({ name: defaultName, comparedSets: 0, ownDecisions: 0, shared: false });
  assert.ok(none.every(({ done }) => !done));
  const some = setupSteps({ name: "Riverside", comparedSets: 1, ownDecisions: 0, shared: false });
  assert.deepEqual(some.map(({ done }) => done), [true, true, false, false]);
  assert.equal(readSetup({ getItem: () => "not json" }).name, defaultName);
});

test("W2 · columns are remembered only for the same headers", () => {
  const headers = ["Package Label", "Batch", "Qty"];
  const saved = rememberColumns([], headers, { package: "Package Label", lot: "Batch" });
  assert.deepEqual(rememberedChoice(["Qty", "Batch", "Package Label"], saved), { package: "Package Label", lot: "Batch" });
  assert.equal(rememberedChoice(["Package Label", "Batch"], saved), undefined);
  assert.equal(headerSignature(["A b", "c"]), headerSignature(["C", "ab"]));
});

test("W3 · clearing removes Mellow's keys and nothing else", () => {
  const store = new Map([["mellow.release01", "x"], ["mellow.columns", "[]"], ["other.app", "keep"]]);
  const storage = { get length() { return store.size; }, key: (i) => [...store.keys()][i] ?? null, removeItem: (k) => store.delete(k) };
  assert.deepEqual(mellowKeys(storage).sort(), ["mellow.columns", "mellow.release01"]);
  assert.equal(clearDevice(storage), 2);
  assert.deepEqual([...store.keys()], ["other.app"]);
});

// Retro follow-up 1: site claims are pinned to the code.
test("W4 · the site's upload limit matches the code", () => {
  const site = readFileSync(new URL("../public/welcome/index.html", import.meta.url), "utf8");
  assert.equal(maxUploadBytes, 500_000);
  assert.ok(site.includes(`Up to ${maxUploadText} per file`), "site must state the same limit");
  assert.ok(!/\b\d+ ?MB\b/.test(site), "no other size claim on the site");
});
