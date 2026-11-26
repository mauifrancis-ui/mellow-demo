// Motion guard (sprint 5, E1 and E2): motion lives in one file, and every timing comes from a token.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const dir = new URL("../src/", import.meta.url);
const css = Object.fromEntries(readdirSync(dir).filter((name) => name.endsWith(".css")).map((name) => [name, readFileSync(new URL(name, dir), "utf8")]));
const strip = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");

test("E1 · only motion.css animates", () => {
  for (const [name, text] of Object.entries(css)) {
    if (name === "motion.css") continue;
    const body = strip(text);
    assert.doesNotMatch(body, /(^|[\s;{])(animation|transition)(-[a-z-]+)?\s*:/m, `${name} must not define animation or transition`);
    assert.doesNotMatch(body, /@keyframes/, `${name} must not define keyframes`);
  }
});

test("E2 · every duration and delay in motion.css is a token", () => {
  const body = strip(css["motion.css"]);
  const rules = body.split("\n").filter((line) => /(animation|transition)\s*:/.test(line) && !/^\s*--/.test(line));
  for (const line of rules) assert.doesNotMatch(line, /\b\d+m?s\b/, `raw timing in: ${line.trim()}`);
});

test("E2 · each keyframe is defined once", () => {
  const names = [...strip(css["motion.css"]).matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
  assert.equal(new Set(names).size, names.length, names.join(", "));
});

test("E2 · reduced motion: every animation and transition sits inside a no-preference block", () => {
  const body = strip(css["motion.css"]);
  const stack = [];
  let header = "";
  for (const char of body) {
    if (char === "{") { stack.push(header.trim()); header = ""; }
    else if (char === "}") { stack.pop(); header = ""; }
    else if (char === ";") {
      if (/(^|\s)(animation|transition)(-[a-z-]+)?\s*:/.test(header) && !/^\s*--/.test(header)) {
        assert.ok(stack.some((h) => h.startsWith("@media (prefers-reduced-motion: no-preference)")), `outside a no-preference block: ${header.trim()}`);
      }
      header = "";
    } else header += char;
  }
});
