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
  | { kind: "restore" };

export type AskContext = {
  queue: { id: string; record: string }[];
  manager: { id: string; record: string }[];
  comparison: LotCheck[];
  runs: Run[];
  receiving: "current" | "delayed";
};

export type AskAnswer = {
  intent: "package" | "unknown-package" | "next" | "gaps" | "differences" | "matched" | "compare"
    | "handoff" | "source" | "summary" | "learn" | "fallback";
  title: string;
  body: string;
  items?: { label: string; detail: string }[];
  actions: { label: string; action: AskAction }[];
  series?: Series;
};

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

export function normalize(input: string) {
  return input.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}

function packageId(text: string) {
  const match = text.match(/\b(?:pkg|package)?[\s#-]*(\d{3,})\b/);
  return match ? `PKG-${match[1]}` : undefined;
}

export function ask(input: string, context: AskContext): AskAnswer {
  const text = normalize(input);
  const different = context.comparison.filter(({ state }) => state === "different");
  const missing = context.comparison.filter(({ state }) => state === "missing");
  const id = packageId(text);

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
      items: context.manager.map((task) => ({ label: task.record, detail: "Manager review requested" })),
      actions: [{ label: "Open shift handoff", action: { kind: "tab", tab: "Activity" } }],
    };
  }

  if (has(text, /\b(gaps?|missing|blank|empty|no lot)\b/)) {
    return {
      intent: "gaps",
      title: missing.length ? `${plural(missing.length, "package")} with a gap` : "No gaps in the latest check",
      body: "A gap means a lot number or a matching record is missing from one of the sources.",
      items: missing.map((row) => ({ label: row.packageId, detail: describe(row) })),
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
      items: different.map((row) => ({ label: row.packageId, detail: describe(row) })),
      actions: different.filter((row) => context.queue.some((task) => task.id === row.packageId))
        .map((row) => ({ label: `Open ${row.packageId}`, action: { kind: "open" as const, id: row.packageId } })),
      series: "different",
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
      body: `${plural(context.runs.length, "check")} so far. ${total - flagged} matched and ${flagged} had a difference or a gap. Earlier checks are sample data.`,
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

  if (has(text, /\b(what('s| is| are)|explain|define|meaning|mean|why|lot number|batch|learn|rule|regulation|law)\b/)) {
    return {
      intent: "learn",
      title: "Here’s the short version",
      body: "A lot or batch number traces a product to the group it came from. I compare the lot in inventory with the lot in receiving. State rules aren’t loaded yet, so confirm requirements with your regulator’s current materials.",
      actions: [{ label: "Open the field guide", action: { kind: "tab", tab: "Learn" } }],
    };
  }

  return {
    intent: "fallback",
    title: "I can’t help with that one yet",
    body: "Ask me about a package ID, today’s gaps or differences, comparing files, or the shift handoff.",
    actions: [],
  };
}
