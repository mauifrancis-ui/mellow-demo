// Design-system guard (sprint 5, A6). Components use type and role tokens, never raw values.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (name) => readFileSync(new URL(`../src/${name}`, import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const ledger = read("ledger.css");
const tokenBlockEnd = ledger.indexOf("}", ledger.indexOf('.shell[data-palette="ledger"] {')) + 1;
const components = ledger.slice(tokenBlockEnd);
const legacy = read("styles.css");
const primitives = /var\(--(ink|graphite|voice|paper|rule|rule-strong|tint|tint-soft|pencil|vermilion|vermilion-dark)\)/;

test("A6 · every font size is a type token", () => {
  for (const [name, css] of [["ledger.css", ledger], ["styles.css", legacy]]) {
    for (const [decl] of css.matchAll(/(?<![\w-])font(-size)?\s*:[^;}]*/g)) {
      assert.doesNotMatch(decl, /(?<![\w.-])\d+px|clamp\(/, `${name}: ${decl.trim()}`);
    }
  }
});

test("A6 · components use role tokens, not raw colors", () => {
  assert.doesNotMatch(components, primitives, "ledger.css components must use role tokens");
  assert.doesNotMatch(components, /#[0-9a-fA-F]{3,8}\b/, "no hex values outside the token block");
  assert.doesNotMatch(legacy, primitives);
});

test("A6 · the legacy stylesheet's hex values can only go down (A4 retires them; 45 at the start of sprint 5)", () => {
  const count = (legacy.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).length;
  assert.ok(count <= 45, `styles.css has ${count} hex values; the ceiling is 45`);
});

test("A1 · nothing smaller than 12px, and form fields at 16px", () => {
  const tokens = read("tokens.css");
  for (const [, size] of tokens.matchAll(/--type-[\w-]+:\s*(\d+)px/g)) assert.ok(Number(size) >= 12);
  assert.match(tokens, /--type-input:\s*16px/);
});
