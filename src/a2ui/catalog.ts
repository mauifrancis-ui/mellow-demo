// Mellow's catalog, shaped after A2UI v1.0 (sprint 6, A7). Answers and inspection prep are
// expressed as a flat list of catalog components, then validated. A verdict can't be rendered
// because no component exists for one, statuses are an enum, and every answer drawn from records
// carries a Stamp. The UI still renders with React; this is the contract it's tested against.
import catalog from "./mellow-catalog.json" with { type: "json" };
import type { AskAnswer } from "../ask.ts";
import { controlLabel, countLine, statusOf, type ControlResult } from "../controls.ts";

export type Component = { id: string; component: string; children?: string[]; [prop: string]: unknown };
export type Message = { version: "1.0"; updateComponents: { surfaceId: string; components: Component[] } };

type Schema = { allowedParents?: string[]; allowedChildren?: string[]; required: string[]; properties: Record<string, { const?: unknown; enum?: unknown[]; type?: string }> };
const schemas = catalog.components as unknown as Record<string, Schema>;
const forbidden = new RegExp(catalog["x-forbidden"], "i");

const kindOf = (kind?: string) => kind === "different" ? "disagree" : kind === "missing" ? "gap" : "other";

/** An Ask answer as catalog components. */
export function answerMessage(answer: AskAnswer, surfaceId = "ask"): Message {
  const components: Component[] = [];
  const children: string[] = [];
  answer.items?.forEach((item, index) => {
    const id = `row-${index}`;
    children.push(id);
    components.push({ id, component: "RecordRow", label: item.title ?? item.label, detail: item.detail,
      ...(item.id ? { packageId: item.id } : {}), kind: kindOf(item.kind) });
  });
  if (answer.series) { children.push("chart"); components.push({ id: "chart", component: "Chart", series: answer.series }); }
  answer.actions.forEach((action, index) => {
    const id = `action-${index}`;
    children.push(id);
    components.push({ id, component: "Action", label: action.label, action: action.action as unknown as object });
  });
  if (answer.basis) {
    children.push("stamp");
    components.push({ id: "stamp", component: "Stamp", verified: answer.basis.verified, label: answer.basis.label, sources: answer.basis.sources,
      ...(answer.basis.at ? { at: answer.basis.at } : {}), ...(answer.basis.atKind ? { atKind: answer.basis.atKind } : {}) });
  }
  return { version: "1.0", updateComponents: { surfaceId, components: [{ id: "root", component: "Answer", title: answer.title, body: answer.body, children }, ...components] } };
}

/** Inspection prep as catalog components: one ControlCheck per control, each with its StatusWord. */
export function prepMessage(results: ControlResult[], surfaceId = "prep"): Message {
  const components: Component[] = [];
  const rows: string[] = [];
  for (const result of results) {
    const id = `control-${result.control.id}`;
    rows.push(id);
    components.push({ id, component: "ControlCheck", controlId: result.control.id, title: result.control.title, citation: result.control.citation,
      counts: countLine(result), reviewLabel: controlLabel, children: [`${id}-status`] });
    components.push({ id: `${id}-status`, component: "StatusWord", value: statusOf(result) });
  }
  return { version: "1.0", updateComponents: { surfaceId, components: [{ id: "root", component: "Column", children: rows }, ...components] } };
}

/** Validate a message against the catalog and Mellow's rules. Returns a list of problems; empty means valid. */
export function validate(message: Message, options: { recordAnswer?: boolean } = {}) {
  const problems: string[] = [];
  const list = message.updateComponents.components;
  const byId = new Map(list.map((item) => [item.id, item]));
  const parentOf = new Map<string, string>();
  for (const item of list) for (const child of item.children ?? []) parentOf.set(child, item.component);

  for (const item of list) {
    const schema = schemas[item.component];
    if (!schema) { problems.push(`${item.id}: "${item.component}" isn't in the catalog`); continue; }
    for (const key of schema.required) if (item[key] === undefined) problems.push(`${item.id}: missing ${key}`);
    for (const [key, rule] of Object.entries(schema.properties)) {
      const value = key === "component" ? item.component : item[key];
      if (value === undefined) continue;
      if (rule.const !== undefined && value !== rule.const) problems.push(`${item.id}: ${key} must be ${String(rule.const)}`);
      if (rule.enum && !rule.enum.includes(value)) problems.push(`${item.id}: ${key} "${String(value)}" isn't allowed`);
    }
    for (const key of Object.keys(item)) {
      if (!["id", "component", "children"].includes(key) && !(key in schema.properties)) problems.push(`${item.id}: unknown property ${key}`);
    }
    const parent = parentOf.get(item.id);
    if (schema.allowedParents && parent && !schema.allowedParents.includes(parent)) problems.push(`${item.id}: ${item.component} can't sit inside ${parent}`);
    if (schema.allowedParents && !parent && item.id !== "root") problems.push(`${item.id}: ${item.component} needs a parent`);
    for (const child of item.children ?? []) {
      const node = byId.get(child);
      if (!node) problems.push(`${item.id}: child ${child} doesn't exist`);
      else if (schema.allowedChildren && !schema.allowedChildren.includes(node.component)) problems.push(`${item.id}: ${node.component} can't sit inside ${item.component}`);
    }
    for (const value of Object.values(item)) {
      const text = Array.isArray(value) ? value.join(" ") : value;
      if (typeof text === "string" && forbidden.test(text)) problems.push(`${item.id}: verdict language "${text.match(forbidden)?.[0]}"`);
    }
  }
  if (options.recordAnswer && !list.some((item) => item.component === "Stamp")) problems.push("An answer drawn from records needs a Stamp");
  return problems;
}

export { catalog };

/** The binder as catalog components: cover, what records show, what to have on hand, decisions, disclaimer. */
export function binderMessage(results: ControlResult[], decisions: { packageId: string; decision: string }[], disclaimer: string, surfaceId = "binder"): Message {
  const components: Component[] = [];
  const section = (id: string, kind: string, heading: string, text?: string, children: string[] = []) =>
    components.push({ id, component: "BinderSection", kind, heading, ...(text ? { text } : {}), children });
  section("cover", "cover", "Inspection prep binder", controlLabel);
  const counted = results.filter(({ checkable }) => checkable);
  const onHand = results.filter(({ checkable }) => !checkable);
  const checkIds = counted.map(({ control }) => `check-${control.id}`);
  section("records", "controls", "What your records show", undefined, checkIds);
  for (const result of counted) {
    components.push({ id: `check-${result.control.id}`, component: "ControlCheck", controlId: result.control.id, title: result.control.title,
      citation: result.control.citation, counts: countLine(result), reviewLabel: controlLabel, children: [`check-${result.control.id}-status`] });
    components.push({ id: `check-${result.control.id}-status`, component: "StatusWord", value: statusOf(result) });
  }
  const handIds = onHand.map(({ control }) => `hand-${control.id}`);
  section("onhand", "evidence", "Have these on hand", "Mellow can’t check these from your files.", handIds);
  for (const result of onHand) components.push({ id: `hand-${result.control.id}`, component: "RecordRow", label: result.control.evidence, detail: result.control.citation, kind: "other" });
  const decisionIds = decisions.map((_, index) => `decision-${index}`);
  section("decisions", "decisions", "Decisions recorded on this device", undefined, decisionIds);
  decisions.forEach((row, index) => components.push({ id: `decision-${index}`, component: "RecordRow", label: row.packageId, detail: row.decision, packageId: row.packageId, kind: "other" }));
  section("disclaimer", "disclaimer", "What this is", disclaimer);
  return { version: "1.0", updateComponents: { surfaceId, components: [{ id: "root", component: "Column", children: ["cover", "records", "onhand", "decisions", "disclaimer"] }, ...components] } };
}
