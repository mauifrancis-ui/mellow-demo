// Mellow speaking first (sprint 2). Notes come only from deterministic triggers:
// a new issue in a check, the receiving source going quiet or coming back, and a
// record waiting on a manager since the last shift. Nothing interpretive, no risk
// words, never a popup. See MELLOW_EVALS.md cases P1 to P6.

export type NoteKind = "new" | "batch" | "delayed" | "restored" | "waiting";

export type Note = {
  /** Stable per trigger, so a dismissed note never comes back (P5). */
  id: string;
  kind: NoteKind;
  text: string;
  /** Plain-language trigger, shown under "Why this?". */
  trigger: string;
  compared: string[];
  taskId?: string;
  at: string;
};

export type NewIssue = { taskId: string; record: string; kind: "different" | "missing"; at: string };
export type Waiting = { taskId: string; record: string; since: string };

export type NoteInput = {
  /** Check times, oldest first. */
  checks: string[];
  newIssues: NewIssue[];
  receiving: "current" | "delayed";
  /** When the source came back after a delay, if it has. */
  restoredAt?: string | null;
  lastGoodAt?: string | null;
  waiting: Waiting[];
  dismissed: ReadonlySet<string>;
  now: string;
  /** P6: nothing new is said while a dialog is open. */
  dialogOpen?: boolean;
};

export type NoteSet = {
  /** One line for the Today briefing: the batch, the source status, or a single new issue. */
  briefing?: Note;
  /** Notes that sit under a queue row. Empty when a check is batched (P4). */
  rows: Map<string, Note>;
  /** Packages flagged NEW in the queue. They stay NEW until opened, across later checks. */
  fresh: Set<string>;
};

const SHIFT_MS = 8 * 60 * 60 * 1000;
const FILES = ["Inventory export (sample)", "Receiving log (sample)"];

export const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function words(count: number, kind: "different" | "missing") {
  const noun = kind === "different" ? "difference" : "gap";
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function notesFor(input: NoteInput): NoteSet {
  const rows = new Map<string, Note>();
  if (input.dialogOpen) return { rows, fresh: new Set() };
  const latest = input.checks.at(-1);
  const previous = input.checks.at(-2);
  // NEW stays on a row until it is opened (the caller filters opened rows), whichever check found it.
  const fresh = new Set(input.newIssues.map((issue) => issue.taskId));
  const inLatest = input.newIssues.filter((issue) => issue.at === latest);
  let briefing: Note | undefined;
  const keep = (note: Note | undefined) => (note && !input.dismissed.has(note.id) ? note : undefined);

  if (input.receiving === "delayed") {
    const since = input.lastGoodAt ? clock(input.lastGoodAt) : "the last check";
    briefing = keep({
      id: `delayed:${input.lastGoodAt ?? "none"}`, kind: "delayed", at: input.now,
      text: `Receiving hasn’t reported since ${since}. I’ll say when it’s back.`,
      trigger: `The receiving source stopped reporting after the ${since} check.`,
      compared: ["Receiving source status"],
    });
  } else if (input.restoredAt) {
    briefing = keep({
      id: `restored:${input.restoredAt}`, kind: "restored", at: input.restoredAt,
      text: `Receiving is back. The ${clock(input.restoredAt)} check ran.`,
      trigger: `The receiving source reported again at ${clock(input.restoredAt)}.`,
      compared: ["Receiving source status", ...FILES],
    });
  }

  if (latest && inLatest.length) {
    const since = previous && clock(previous) !== clock(latest) ? `Since the ${clock(previous)} check, the` : "The";
    if (inLatest.length > 2) {
      // P4: one line, no row notes.
      const different = inLatest.filter((issue) => issue.kind === "different").length;
      const missing = inLatest.length - different;
      const parts = [different ? words(different, "different") : "", missing ? words(missing, "missing") : ""].filter(Boolean).join(" and ");
      briefing ??= keep({
        id: `batch:${latest}`, kind: "batch", at: latest,
        text: `The ${clock(latest)} check found ${inLatest.length} new: ${parts}.`,
        trigger: `${inLatest.length} new issues in the ${clock(latest)} check.`,
        compared: [...FILES, ...inLatest.map((issue) => `${issue.record} in both files`)],
      });
    } else {
      for (const issue of inLatest) {
        const note = keep({
          id: `new:${issue.taskId}`, kind: "new", taskId: issue.taskId, at: latest,
          text: `New in the ${clock(latest)} check.`, trigger: `A new ${issue.kind === "different" ? "difference" : "gap"} in the ${clock(latest)} check.`,
          compared: [...FILES, `${issue.record} in both files`],
        });
        if (note) rows.set(issue.taskId, note);
      }
      const first = inLatest[0];
      const more = inLatest.length === 2 ? ` and ${inLatest[1].record}` : "";
      const label = inLatest.length === 1 ? `one new ${first.kind === "different" ? "difference" : "gap"}` : "two new issues";
      briefing ??= keep({
        id: `brief:${latest}`, kind: "new", at: latest,
        text: `${since} ${clock(latest)} check found ${label}: ${first.record}${more}.`,
        trigger: `New issues in the ${clock(latest)} check.`,
        compared: [...FILES, ...inLatest.map((issue) => `${issue.record} in both files`)],
      });
    }
  }

  for (const item of input.waiting) {
    if (new Date(input.now).getTime() - new Date(item.since).getTime() < SHIFT_MS) continue;
    const note = keep({
      id: `waiting:${item.taskId}:${item.since}`, kind: "waiting", taskId: item.taskId, at: input.now,
      text: `${item.record} has waited on a manager since the last shift.`,
      trigger: `Left for a manager at ${clock(item.since)}, more than a shift ago.`,
      compared: ["Decisions saved in Activity on this device"],
    });
    if (note) rows.set(item.taskId, note);
  }

  return { briefing, rows, fresh };
}

export type SourceEvent = { kind: "delayed" | "restored"; at: string; lastGoodAt?: string | null };

/**
 * Every note Mellow has said today, in order, for the Activity trail. Derived from the
 * events that create notes, so a note replaced by a later one still appears.
 */
export function noteTrail(input: { checks: string[]; newIssues: NewIssue[]; sources: SourceEvent[]; waiting: Waiting[]; now: string }): Note[] {
  const trail: Note[] = [];
  const empty = new Set<string>();
  const times = [...new Set(input.newIssues.map((issue) => issue.at))];
  for (const at of times) {
    const before = input.checks.filter((check) => check < at).at(-1);
    const set = notesFor({ checks: before ? [before, at] : [at], newIssues: input.newIssues.filter((issue) => issue.at === at),
      receiving: "current", waiting: [], dismissed: empty, now: at });
    trail.push(...[set.briefing, ...set.rows.values()].filter((note): note is Note => Boolean(note)));
  }
  for (const event of input.sources) {
    const set = notesFor({ checks: [], newIssues: [], waiting: [], dismissed: empty, now: event.at,
      receiving: event.kind === "delayed" ? "delayed" : "current", lastGoodAt: event.lastGoodAt, restoredAt: event.kind === "restored" ? event.at : null });
    if (set.briefing) trail.push(set.briefing);
  }
  const waiting = notesFor({ checks: [], newIssues: [], receiving: "current", waiting: input.waiting, dismissed: empty, now: input.now });
  trail.push(...waiting.rows.values());
  return trail.sort((a, b) => a.at.localeCompare(b.at));
}

/** Sample checks for the demo's "Simulate a new check". The first adds one difference; the second adds three (batched). */
export const sampleChecks = [
  [{ packageId: "PKG-610", inventory: "SAMPLE-9", receiving: "SAMPLE-4" }],
  [
    { packageId: "PKG-611", inventory: "SAMPLE-2", receiving: "SAMPLE-7" },
    { packageId: "PKG-612", inventory: "SAMPLE-5", receiving: "SAMPLE-8" },
    { packageId: "PKG-613", inventory: "SAMPLE-3", receiving: null },
  ],
] as const;

/** Reasons a person can give when a note wasn’t useful. Logged on this device with the note (sprint 4). */
export const notUsefulReasons = ["I already knew", "Wrong package or time", "Too many notes", "Something else"] as const;
