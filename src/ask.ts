import type { LotCheck } from "./comparison.ts";
import type { Run } from "./monitoring.ts";

// Ask Mellow, local edition. Matches everyday receiving language against the
// sample workspace. No model is called: live AI stays off until approved.

export type Series = "matched" | "different" | "missing";
export type AskAction =
  | { kind: "open"; id: string }
  | { kind: "tab"; tab: "Activity" | "Learn" }
  | { kind: "compare" }
  | { kind: "series"; series: Series }
  | { kind: "delay" }
  | { kind: "restore" }
  | { kind: "evidence" };

export type QueueItem = {
  id: string;
  record: string;
  observation?: string;
  lotComparison?: { inventory: string | null; receiving: string | null; different: boolean };
};

export type AskContext = {
  queue: QueueItem[];
  manager: { id: string; record: string }[];
  comparison: LotCheck[];
  runs: Run[];
  receiving: "current" | "delayed";
  /** Mellow's previous answer in this conversation, so "how do you know?" can explain it. */
  previous?: AskAnswer;
};

export type AskAnswer = {
  intent: "package" | "unknown-package" | "next" | "list" | "label" | "gaps" | "differences" | "matched" | "compare"
    | "handoff" | "source" | "summary" | "learn" | "judgment" | "decision" | "self" | "capabilities" | "explain" | "order" | "fallback";
  title: string;
  body: string;
  items?: { label: string; detail: string; id?: string; title?: string; kind?: Issue["kind"] }[];
  actions: { label: string; action: AskAction }[];
  series?: Series;
  focusId?: string;
  basis?: Basis;
};

/** How Mellow knows what it said. Verified only when the answer comes straight from compared records. */
export type Basis = { verified: boolean; label: string; sources: string[]; at?: string };

export const suggestions = [
  "What needs me right now?",
  "Anything wrong with 443?",
  "Show me today’s gaps",
  "How did receiving go today?",
  "I have a new vendor manifest",
  "What did I leave for my manager?",
];

const has = (text: string, pattern: RegExp) => pattern.test(text);

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function lotText(value: string | null) {
  return value === null ? "no matching record" : value || "no lot number";
}

function describe(row: LotCheck) {
  return `Inventory has ${lotText(row.inventory)}. Receiving has ${lotText(row.receiving)}.`;
}

function short(value: string | null) {
  return value === null ? "none" : value || "no lot";
}

export function compact(task: QueueItem, comparison: LotCheck[]) {
  const row = task.lotComparison ?? comparison.find(({ packageId }) => packageId === task.id);
  return row ? `inventory: ${short(row.inventory)} · receiving: ${short(row.receiving)}` : task.observation ?? "";
}

export function normalize(input: string) {
  return input.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}

function packageId(text: string) {
  const match = text.match(/\b(?:pkg|package)?[\s#-]*(\d{3,})\b/);
  return match ? `PKG-${match[1]}` : undefined;
}

export type Issue = { kind: "different" | "missing" | "other"; label: string; detail: string };

export function issueOf(task: QueueItem, comparison: LotCheck[]): Issue {
  const row = task.lotComparison
    ? { inventory: task.lotComparison.inventory, receiving: task.lotComparison.receiving,
      state: task.lotComparison.different ? "different" : "missing" }
    : comparison.find(({ packageId }) => packageId === task.id);
  if (!row) return { kind: "other", label: "Check the imported record", detail: task.observation ?? "Only the import is available." };
  const detail = row.inventory === "" && row.receiving === "" ? "Neither record has a lot number."
    : `Inventory has ${lotText(row.inventory)}. Receiving has ${lotText(row.receiving)}.`;
  if (row.state === "different") return { kind: "different", label: "Records disagree", detail };
  const label = row.receiving === null ? "No receiving record"
    : row.inventory === null ? "No inventory record"
      : !row.inventory && !row.receiving ? "No lot in either record"
        : !row.inventory ? "No lot in inventory" : "No lot in receiving";
  return { kind: "missing", label, detail };
}

const rank = { different: 0, missing: 1, other: 2 };

export function orderQueue<T extends QueueItem>(queue: T[], comparison: LotCheck[]) {
  return queue.map((task, index) => ({ task, index, issue: issueOf(task, comparison) }))
    .sort((a, b) => rank[a.issue.kind] - rank[b.issue.kind] || a.index - b.index);
}

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const count = (n: number) => words[n] ?? String(n);

export type Brief = { greeting: string; headline: string; message: string; focusId?: string; chips: string[] };

export function brief(context: AskContext, now = new Date()): Brief {
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";
  const ordered = orderQueue(context.queue, context.comparison);
  const open = ordered.length;
  const matched = context.runs.reduce((sum, run) => sum + run.matched, 0);
  const checks = context.runs.length;
  const managerCount = context.manager.length;
  const headline = open ? `${count(open)} package${open === 1 ? "" : "s"} need${open === 1 ? "s" : ""} you before close.` : "You’re caught up.";
  const parts: string[] = [];
  if (context.receiving === "delayed") parts.push("Receiving records are delayed, so I can’t check newer arrivals yet.");
  const focus = ordered[0];
  if (focus) {
    parts.push(`Start with ${focus.task.record}. ${focus.issue.detail}`);
    if (focus.issue.kind === "different") parts.push("The records disagree, so it goes first.");
    const rest = ordered.slice(1);
    if (rest.length) {
      const allGaps = rest.every(({ issue }) => issue.kind === "missing");
      parts.push(`${count(rest.length)} more ${rest.length === 1 ? "is" : "are"} ${allGaps ? "missing a lot or a record" : "waiting in your queue"}.`);
    }
  }
  if (managerCount) parts.push(`${count(managerCount)} ${managerCount === 1 ? "is" : "are"} waiting on a manager.`);
  if (checks) parts.push(open ? `The other ${matched} from today’s ${checks} checks matched, and I left them alone.`
    : `All ${matched} matched packages from today’s ${checks} checks are settled.`);
  const chips = [
    focus ? "What do I check on the label?" : "How did receiving go today?",
    ...(open > 1 ? [`Walk me through all ${count(open).toLowerCase()}`] : []),
    "What matched?",
    ...(managerCount ? ["What did I leave for my manager?"] : []),
    "Compare new files",
  ].slice(0, 5);
  return { greeting, headline, message: parts.join(" "), focusId: focus?.task.id, chips };
}

export function ask(input: string, context: AskContext): AskAnswer {
  const answer = answerFor(input, context);
  const basis = basisOf(answer, context);
  return basis ? { ...answer, basis } : answer;
}

const fromRecords = new Set<AskAnswer["intent"]>(["package", "unknown-package", "next", "list", "gaps", "differences", "matched", "summary", "source", "order"]);

export function basisOf(answer: AskAnswer, context: AskContext): Basis | undefined {
  const last = context.runs.at(-1);
  const files = ["Inventory export (sample)", "Receiving log (sample)"];
  if (answer.intent === "explain") return context.previous?.basis;
  if (answer.intent === "judgment") {
    return answer.focusId ? { verified: true, label: `2 files · ${answer.focusId}`, sources: [`${answer.focusId} in both files`, ...files], at: last?.checkedAt } : undefined;
  }
  if (answer.intent === "handoff") {
    return { verified: true, label: "Your decisions on this device", sources: ["Decisions saved in Activity on this device", "Nothing was sent anywhere"] };
  }
  if (answer.intent === "label" || answer.intent === "learn") {
    return { verified: false, label: "General guidance",
      sources: ["Written guidance, not read from your records", "State rules aren’t loaded, so confirm with your regulator’s current materials"] };
  }
  if (!fromRecords.has(answer.intent)) return undefined;
  const rows = `${context.comparison.length} packages compared`;
  const sources = answer.intent === "summary"
    ? [`${plural(context.runs.length, "check")} today, earlier ones are sample data`, ...files]
    : answer.intent === "source"
      ? ["Receiving source status at the last check", ...files]
      : answer.focusId ? [`${answer.focusId} in both files`, ...files, rows] : [...files, rows];
  return { verified: true, label: answer.intent === "summary" ? `${plural(context.runs.length, "check")} · ${plural(last?.checked ?? 0, "package")} last` : `2 files · ${context.comparison.length} packages`, sources, at: last?.checkedAt };
}

function answerFor(input: string, context: AskContext): AskAnswer {
  const text = normalize(input);
  const different = context.comparison.filter(({ state }) => state === "different");
  const missing = context.comparison.filter(({ state }) => state === "missing");
  const id = packageId(text);

  // Honesty first: these run before any record answer (MELLOW_EVALS.md, sections C, D and M).
  if (has(text, /\b(are you (an? )?(ai|bot|robot|human|person|real|chatgpt|gpt|machine)|what are you|who are you|artificial intelligence|language model|llm)\b/)) {
    return {
      intent: "self",
      title: "I’m Mellow",
      body: "I match your question to the records on this device and answer from them. Live AI is off, so I don’t generate answers, judge the law, or make decisions. A person decides.",
      actions: [],
    };
  }

  if (has(text, /\b(what can you (do|help)|what do you do|how (do|can) (i|you) use|what are you for|help me use)\b/)) {
    return {
      intent: "capabilities",
      title: "What I can and can’t do",
      body: "I work from the inventory and receiving records on this device.",
      items: [
        { label: "Can", title: "Explain a package", detail: "what each record shows and where they disagree" },
        { label: "Can", title: "Find today’s gaps and differences", detail: "and put them in order" },
        { label: "Can", title: "Compare new files", detail: "before anything goes into To check" },
        { label: "Can’t", title: "Make decisions", detail: "only a person approves or dismisses a record" },
        { label: "Can’t", title: "Judge the law or predict an audit", detail: "state rules aren’t loaded" },
        { label: "Can’t", title: "Read attachments or photos", detail: "add them as evidence for a person to review" },
      ],
      actions: [],
    };
  }

  if (has(text, /\b(how do you know|how did you (know|get|work)|what did you (check|compare|look at|use)|where (did|does) (that|this|it) come from|where('s| is) (that|this) from|show (me )?your work|source for that|based on what|why should i (trust|believe)|can i trust)\b/)) {
    const basis = context.previous?.basis;
    return {
      intent: "explain",
      title: basis ? "Here’s what that was based on" : "Here’s where my answers come from",
      body: basis
        ? basis.verified
          ? `I compared the records below. Nothing else went into it.${basis.at ? " That was the latest check." : ""}`
          : "That wasn’t read from your records. It’s general guidance, so confirm it before you rely on it."
        : "I compare the inventory export and the receiving log on this device. Ask me something and I’ll show what that answer was based on. Earlier checks today are sample data.",
      items: basis?.sources.map((source) => ({ label: basis.verified ? "Compared" : "Based on", detail: source })),
      actions: [],
    };
  }

  if (has(text, /^(please )?(approve|dismiss|reject|mark|close|resolve|clear|sign off|record|submit|accept|override)\b|\b(ignore (your|the|all) (rules|instructions)|mark (it|this|pkg-?\d+|\d+) as|approve (it|this|pkg|package|\d))/)) {
    const target = id ? [...context.queue, ...context.manager].find((task) => task.id === id) : undefined;
    return {
      intent: "decision",
      title: "I can’t make decisions",
      body: `Only a person can approve, dismiss or record a decision, from the record itself.${target ? ` Open ${target.record} to decide.` : ""}`,
      actions: target ? [{ label: `Open ${target.record}`, action: { kind: "open", id: target.id } }] : [],
    };
  }

  if (has(text, /\b(violat\w*|complian\w*|non-?complian\w*|legal(ly)?|illegal|lawful|allowed|permitted|penalt\w*|fines?|fined|regulat\w*|laws?|rules?|required|requirements?|audits?|inspections?|inspector|citations?|ok(ay)? to (sell|ship|release|move|use)|safe to (sell|ship|release|move|use)|can (i|we) (sell|ship|release))\b/)) {
    const row = id ? context.comparison.find(({ packageId: rowId }) => rowId === id) : undefined;
    const queued = id ? [...context.queue, ...context.manager].find((task) => task.id === id) : undefined;
    const audit = has(text, /\b(audits?|inspections?|inspector|pass)\b/);
    return {
      intent: "judgment",
      title: audit ? "I can’t predict an audit" : id ? `I can’t tell you whether ${id} is allowed` : "I can’t tell you whether that’s allowed",
      body: [
        "I compare records. I don’t judge them against the law, and state rules aren’t loaded.",
        row ? `What the records show: ${describe(row)}` : "",
        audit ? `What I can say: ${plural(context.queue.length, "record")} ${context.queue.length === 1 ? "is" : "are"} open right now.` : "",
        "Confirm requirements with your regulator’s current materials or a manager.",
      ].filter(Boolean).join(" "),
      actions: [
        ...(queued ? [{ label: `Open ${queued.record}`, action: { kind: "open" as const, id: queued.id } }] : []),
        { label: "Open the field guide", action: { kind: "tab", tab: "Learn" } },
      ],
      focusId: row ? id : undefined,
    };
  }

  if (has(text, /\b(risk\w*|riskiest|dangerous|worst|most (likely|important|urgent)|biggest problem)\b/)) {
    const ordered = orderQueue(context.queue, context.comparison);
    return {
      intent: "order",
      title: "I don’t score risk",
      body: "I put records in a fixed order instead: disagreements first, then missing details. That’s a working order, not a risk judgment.",
      items: ordered.map(({ task, issue }) => ({ label: task.record, id: task.id, kind: issue.kind, title: issue.label, detail: compact(task, context.comparison) })),
      actions: ordered[0] ? [{ label: `Open ${ordered[0].task.record}`, action: { kind: "open", id: ordered[0].task.id } }] : [],
    };
  }

  if (id) {
    const row = context.comparison.find(({ packageId: rowId }) => rowId === id);
    const queued = context.queue.find((task) => task.id === id);
    const handedOff = context.manager.find((task) => task.id === id);
    if (!row && !queued && !handedOff) {
      return {
        intent: "unknown-package",
        title: `I don’t see ${id} in today’s records`,
        body: "I checked the sample inventory and receiving records. Check the ID on the label, or compare a new file if it arrived later.",
        actions: [{ label: "Compare files", action: { kind: "compare" } }],
      };
    }
    const state = row?.state === "match" ? "The sources agree." : row?.state === "different" ? "The sources disagree." : row ? "A detail is missing." : "";
    return {
      intent: "package",
      title: row?.state === "match" ? `${id} looks fine` : `${id} needs a look`,
      body: [row ? describe(row) : "", state, handedOff ? "It’s already in the manager handoff." : queued ? "It’s in To check." : ""].filter(Boolean).join(" "),
      actions: queued || handedOff ? [{ label: `Open ${id}`, action: { kind: "open", id } }] : [],
      series: row && row.state !== "match" ? row.state : undefined,
      focusId: id,
    };
  }

  if (has(text, /\blabels?\b/)) {
    const first = orderQueue(context.queue, context.comparison)[0];
    return {
      intent: "label",
      title: "What to check on the label",
      body: "Find the lot or batch number and the package ID on the original label. Compare both with the inventory and receiving records, then note what the label shows as your evidence.",
      actions: first ? [{ label: `Open ${first.task.record}`, action: { kind: "open", id: first.task.id } }] : [],
    };
  }

  if (has(text, /\b(compare|upload|import|csv|spreadsheet|manifest|new file|another file|files?)\b/)) {
    return {
      intent: "compare",
      title: "Let’s compare it",
      body: "Choose the inventory file and the receiving file. I’ll show what differs before anything goes into To check. The original files stay unchanged.",
      actions: [{ label: "Compare files", action: { kind: "compare" } }],
    };
  }

  if (has(text, /\b(delay(ed)?|late|down|stale|offline|outage|not updating|stuck|feed|sync(ing)?|source)\b/)) {
    const delayed = context.receiving === "delayed";
    return {
      intent: "source",
      title: delayed ? "Receiving records are delayed" : "Both sources are current",
      body: delayed
        ? "I can’t check newer arrivals until receiving catches up. Your earlier checks and open reviews are still here."
        : `Inventory and receiving both reported in the last check. ${context.runs.length ? `That was ${plural(context.runs.at(-1)!.checked, "package")}.` : ""}`,
      actions: [delayed
        ? { label: "Restore sample source", action: { kind: "restore" } }
        : { label: "Simulate a delay", action: { kind: "delay" } }],
    };
  }

  if (has(text, /\b(hand ?off|manager|shift|escalat\w*|left for|leave for|passed on)\b/)) {
    return {
      intent: "handoff",
      title: context.manager.length ? `${plural(context.manager.length, "record")} waiting on a manager` : "Nothing is waiting on a manager",
      body: context.manager.length ? "These stay visible for the next shift until someone decides." : "When you leave a record for a manager, it shows up in Activity for the next shift.",
      items: context.manager.map((task) => ({ label: task.record, id: task.id, title: "Left for a manager", detail: compact(task, context.comparison) })),
      actions: [{ label: "Open shift handoff", action: { kind: "tab", tab: "Activity" } }],
    };
  }

  if (has(text, /\b(gaps?|missing|blank|empty|no lot)\b/)) {
    return {
      intent: "gaps",
      title: missing.length ? `${plural(missing.length, "package")} with a gap` : "No gaps in the latest check",
      body: "A gap means a lot number or a matching record is missing from one of the sources.",
      items: missing.map((row) => ({ label: row.packageId, id: row.packageId, kind: "missing" as const,
        title: issueOf({ id: row.packageId, record: row.packageId }, context.comparison).label,
        detail: `inventory: ${short(row.inventory)} · receiving: ${short(row.receiving)}` })),
      actions: missing.filter((row) => context.queue.some((task) => task.id === row.packageId))
        .map((row) => ({ label: `Open ${row.packageId}`, action: { kind: "open" as const, id: row.packageId } })),
      series: "missing",
    };
  }

  if (has(text, /\b(differ\w*|mismatch\w*|disagree\w*|conflict\w*|wrong|off|don't match|do not match|doesn't match)\b/)) {
    return {
      intent: "differences",
      title: different.length ? `${plural(different.length, "package")} where the sources disagree` : "No disagreements in the latest check",
      body: different.length ? "Check the original package label. A person verifies the physical package." : "Every compared lot number matched or is listed as a gap.",
      items: different.map((row) => ({ label: row.packageId, id: row.packageId, kind: "different" as const, title: "Records disagree",
        detail: `inventory: ${short(row.inventory)} · receiving: ${short(row.receiving)}` })),
      actions: different.filter((row) => context.queue.some((task) => task.id === row.packageId))
        .map((row) => ({ label: `Open ${row.packageId}`, action: { kind: "open" as const, id: row.packageId } })),
      series: "different",
    };
  }

  if (has(text, /\b(all|walk me through|list|everything|every one)\b/) && context.queue.length) {
    const ordered = orderQueue(context.queue, context.comparison);
    return {
      intent: "list",
      title: `${count(ordered.length)} package${ordered.length === 1 ? "" : "s"} to check`,
      body: "Disagreements come first, then missing details.",
      items: ordered.map(({ task, issue }) => ({ label: task.record, id: task.id, kind: issue.kind, title: issue.label, detail: compact(task, context.comparison) })),
      actions: [{ label: `Open ${ordered[0].task.record}`, action: { kind: "open", id: ordered[0].task.id } }],
    };
  }

  if (has(text, /\b(next|first|now|priority|todo|to do|to check|needs? me|attention|start|urgent|queue|work on|look at|plate|pending|open items?)\b/)) {
    const first = context.queue.find((task) => different.some((row) => row.packageId === task.id)) ?? context.queue[0];
    return {
      intent: "next",
      title: first ? `Start with ${first.record}` : "You’re caught up",
      body: first
        ? `${plural(context.queue.length, "record")} in To check. ${different.some((row) => row.packageId === first.id) ? "This one has sources that disagree, so it comes first." : "It’s the oldest open record."}`
        : "Nothing is waiting in To check right now.",
      actions: first ? [{ label: `Open ${first.record}`, action: { kind: "open", id: first.id } }] : [],
    };
  }

  if (has(text, /\b(today|summary|overview|status|so far|totals?|how('s| is| are| did)|recap|report|numbers)\b/)) {
    const total = context.runs.reduce((sum, run) => sum + run.checked, 0);
    const flagged = context.runs.reduce((sum, run) => sum + run.exceptions, 0);
    return {
      intent: "summary",
      title: `${plural(total, "package")} compared today`,
      body: `${plural(context.runs.length, "check")} so far. ${total - flagged} matched and ${flagged} had a difference or a gap. ${plural(context.queue.length, "record")} still open. Earlier checks are sample data.`,
      actions: [{ label: "Show gaps", action: { kind: "series", series: "missing" } }, { label: "Show differences", action: { kind: "series", series: "different" } }],
    };
  }

  if (has(text, /\b(match(ed|es)?|agree\w*|clean|fine|good|ok)\b/)) {
    const matched = context.comparison.filter(({ state }) => state === "match");
    return {
      intent: "matched",
      title: `${plural(matched.length, "package")} matched`,
      body: "Matching records stay quiet. I only bring up the ones that need a person.",
      actions: [{ label: "Show matched", action: { kind: "series", series: "matched" } }],
      series: "matched",
    };
  }

  if (has(text, /\b(what('s| is| are)|explain|define|meaning|mean|why|lot number|batch|learn)\b/)
    && has(text, /\b(lots?|batch\w*|packages?|pkg|manifests?|records?|receiving|inventory|gaps?|differences?|evidence|labels?|metrc|handoff|queue|match\w*)\b/)) {
    return {
      intent: "learn",
      title: "Here’s the short version",
      body: "A lot or batch number traces a product to the group it came from. I compare the lot in inventory with the lot in receiving. State rules aren’t loaded yet, so confirm requirements with your regulator’s current materials.",
      actions: [{ label: "Open the field guide", action: { kind: "tab", tab: "Learn" } }],
    };
  }

  return {
    intent: "fallback",
    title: "That’s outside what I can help with",
    body: "I can explain a package, today’s gaps or differences, compare new files, or show the shift handoff. For anything else, ask a manager.",
    actions: [{ label: "Open the field guide", action: { kind: "tab", tab: "Learn" } }],
  };
}

// Follow-up suggestions that belong to an answer, so the conversation keeps moving.
export function followUps(answer: AskAnswer, context: AskContext): string[] {
  const ordered = orderQueue(context.queue, context.comparison);
  const first = ordered[0]?.task.record;
  const all = ordered.length > 1 ? [`Walk me through all ${count(ordered.length).toLowerCase()}`] : [];
  const byIntent: Record<AskAnswer["intent"], string[]> = {
    package: ["What do I check on the label?", ...all],
    "unknown-package": ["What needs me right now?"],
    next: ["What do I check on the label?", ...all],
    list: [...(first ? [`Why does ${first} go first?`] : []), "What do I check on the label?"],
    label: [...all, "What matched?"],
    gaps: ["What counts as a gap?", "Which ones don’t match?"],
    differences: ["What do I check on the label?", "Show me today’s gaps"],
    matched: ["How did receiving go today?", ...all],
    compare: ["What needs me right now?"],
    handoff: [...all, "How did receiving go today?"],
    source: ["What needs me right now?"],
    summary: ["Show me today’s gaps", "What matched?"],
    learn: ["What counts as a gap?", ...all],
    judgment: ["What do I check on the label?", "What needs me right now?"],
    decision: ["What needs me right now?", "What do I check on the label?"],
    self: ["What can you do?", "What needs me right now?"],
    capabilities: ["What needs me right now?", "Compare new files"],
    explain: ["What needs me right now?", "How did receiving go today?"],
    order: [...(first ? [`Why does ${first} go first?`] : []), "What do I check on the label?"],
    fallback: ["What can you do?", "What needs me right now?"],
  };
  return byIntent[answer.intent].filter((chip) => normalize(chip) !== "").slice(0, 3);
}

/** One question and Mellow's answer. The app keeps these so the thread follows you between pages. */
export type Turn = { id: number; question: string; answer: AskAnswer };

export function addTurn(previous: Turn[], question: string, answer: AskAnswer): Turn[] {
  return [...previous, { id: (previous.at(-1)?.id ?? 0) + 1, question, answer }].slice(-6);
}
