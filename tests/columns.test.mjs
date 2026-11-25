// MELLOW_EVALS.md cases F1 to F6: bringing your own files.
import assert from "node:assert/strict";
import { test } from "node:test";
import { columnQuestion, guessColumns, lotRecordsWith, previewRows } from "../src/columns.ts";

test("F1 · the template's columns are found without a question", () => {
  const guess = guessColumns("package_id,lot_number\nPKG-1,LOT-1\n");
  assert.deepEqual([guess.package, guess.lot], ["package_id", "lot_number"]);
  assert.equal(columnQuestion("a.csv", guess), "");
});

test("F2 · common export names are matched regardless of case and spacing", () => {
  const guess = guessColumns("Package Label,Batch No,Product\n1A4000001,LOT-0912,Gummies\n");
  assert.deepEqual([guess.package, guess.lot], ["package_label", "batch_no"], "headers arrive normalized by the CSV reader");
});

test("F3 · a missing lot column becomes a question naming the file, never a guess", () => {
  const guess = guessColumns("metrc_package_id,received_on\n1A4,2026-11-25\n");
  assert.equal(guess.lot, null);
  assert.equal(columnQuestion("receiving_log.csv", guess), "In receiving_log.csv: I couldn’t find a lot column. Which one is it?");
});

test("F4 · two candidate columns become a question listing both", () => {
  const guess = guessColumns("package_id,lot,batch\nP,1,2\n");
  assert.equal(guess.lot, null);
  assert.match(columnQuestion("inv.csv", guess), /2 columns could be the lot \(lot, batch\)/);
});

test("F5 · duplicate and blank package IDs are refused with the row or ID named", () => {
  assert.throws(() => lotRecordsWith("Tag,Batch\nA,1\nA,2\n", { package: "tag", lot: "batch" }), /A appears more than once/);
  assert.throws(() => lotRecordsWith("Tag,Batch\n,1\n", { package: "tag", lot: "batch" }), /Row 2 has no package ID/);
});

test("F6 · the preview shows blank lots as (blank), exactly as they will be read", () => {
  const rows = previewRows("Tag,Batch\nA,\nB,L2\n", { package: "tag", lot: "batch" });
  assert.deepEqual(rows, [{ packageId: "A", lot: "(blank)" }, { packageId: "B", lot: "L2" }]);
  assert.deepEqual(lotRecordsWith("Tag,Batch\nA,\nB,L2\n", { package: "tag", lot: "batch" }), [{ packageId: "A", lot: "" }, { packageId: "B", lot: "L2" }]);
});
