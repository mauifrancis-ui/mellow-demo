type Row = Record<string, string>;
export type Task = { id: string; record: string; source: string; line: number; observation: string; sample?: boolean };
export type Draft = { reference: string; excerpt: string; note: string };
export type Decision = "Approved" | "Manager review requested" | "Dismissed" | "Reopened";
export type Entry = { id: string; task: Task; decision: Decision; at: string; evidence: Draft; returnToManager?: boolean; comparedSource?: Pick<Draft, "reference" | "excerpt"> };
export type Workspace = { tasks: Task[]; drafts: Record<string, Draft>; history: Entry[] };

export const emptyDraft: Draft = { reference: "", excerpt: "", note: "" };
export const storageKey = "mellow.release01";
export const initial: Workspace = {
  tasks: ["PKG-221", "PKG-443", "PKG-552"].map((record, index) => ({
    id: record, record, source: "Sample inventory export", line: index + 1,
    observation: "The batch or lot field is empty.", sample: true,
  })),
  drafts: {}, history: [],
};

export function readWorkspace(): Workspace {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) as Workspace : initial;
}

export function parseCsv(text: string): Row[] {
  const lines: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"' && (quoted || field === "")) {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index++;
      } else quoted = !quoted;
    } else if (!quoted && character === ",") {
      row.push(field.trim());
      field = "";
    } else if (!quoted && (character === "\n" || character === "\r")) {
      row.push(field.trim());
      if (row.some(Boolean)) lines.push(row);
      row = [];
      field = "";
      if (character === "\r" && text[index + 1] === "\n") index++;
    } else field += character;
  }
  if (quoted) throw new Error("A quoted CSV field is incomplete.");
  row.push(field.trim());
  if (row.some(Boolean)) lines.push(row);
  const headers = lines.shift()?.map((header) => header.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
  if (!headers || !lines.length || headers.some((header) => !header) || new Set(headers).size !== headers.length) {
    throw new Error("Use a CSV with unique column names and at least one data row.");
  }
  return lines.map((values) => {
    if (values.length !== headers.length) throw new Error("Each CSV row must match the header column count.");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
}

export function inspectRow(row: Row) {
  const groups = [
    { fields: ["batch_id", "batch", "lot_id", "lot_number", "source_batch"], label: "batch or lot" },
    { fields: ["transfer_status", "manifest_status", "metrc_transfer_status"], label: "transfer status" },
    { fields: ["expiry_date", "expiration_date", "expires", "exp_date"], label: "expiration date" },
  ];
  const findings = groups.flatMap(({ fields, label }) => {
    const present = fields.filter((field) => Object.hasOwn(row, field));
    return present.length && !present.some((field) => row[field]) ? [label] : [];
  });
  const transfer = row.transfer_status || row.manifest_status || row.metrc_transfer_status;
  const notes = findings.map((field) => `The ${field} field is empty.`);
  if (transfer && /^(pending|missing|unconfirmed)$/i.test(transfer)) notes.push(`The export lists the transfer status as “${transfer}”.`);
  return notes.join(" ");
}


export function latestDecisions(history: Entry[]) {
  const states = new Map<string, Decision>();
  for (const entry of [...history].reverse()) {
    states.set(entry.task.id, entry.decision === "Reopened" && entry.returnToManager
      ? "Manager review requested" : entry.decision);
  }
  return states;
}

export function hasEvidence(draft: Draft) {
  return Boolean(draft.reference.trim() && draft.excerpt.trim());
}

export function recordDecision(current: Workspace, task: Task, decision: Decision, evidence: Draft): Workspace {
  const previous = current.history.find((entry) => entry.task.id === task.id);
  const closed = previous?.decision === "Approved" || previous?.decision === "Dismissed";
  const state = latestDecisions(current.history).get(task.id);
  if (decision === "Reopened" ? !closed : closed || state === decision) return current;
  if (decision === "Approved" && !hasEvidence(evidence)) throw new Error("Supporting evidence is required.");
  const review = prepareReview(task);
  if (decision === "Approved" && review.source && !review.evidence && !evidence.note.trim()) {
    throw new Error("Explain how the added evidence resolves the conflict.");
  }
  const entry: Entry = {
    id: crypto.randomUUID(), task, decision, evidence, at: new Date().toISOString(),
    comparedSource: review.source,
    returnToManager: decision === "Reopened" && previous?.returnToManager ||
      decision !== "Reopened" && state === "Manager review requested",
  };
  return { ...current, drafts: { ...current.drafts, [task.id]: evidence }, history: [entry, ...current.history] };
}

export function workQueue(workspace: Workspace) {
  const latest = latestDecisions(workspace.history);
  return workspace.tasks.filter(({ id }) => !latest.has(id) || latest.get(id) === "Reopened");
}

export function nextRecord(tasks: Task[], queue: Task[], currentId: string) {
  const index = tasks.findIndex(({ id }) => id === currentId);
  const remaining = new Set(queue.filter(({ id }) => id !== currentId).map(({ id }) => id));
  return [...tasks.slice(index + 1), ...tasks.slice(0, index + 1)].find(({ id }) => remaining.has(id));
}

const demoSources = {
  "PKG-221": [{ reference: "Sample receiving log · PKG-221", excerpt: "Receiving check: no batch or lot identifier was recorded for this package." }],
  "PKG-443": [{ reference: "Sample receiving log · PKG-443", excerpt: "Receiving check: a lot identifier was present on the package label." }],
} as const;

export function prepareReview(task: Task) {
  const source = task.sample && Object.hasOwn(demoSources, task.id)
    ? demoSources[task.id as keyof typeof demoSources][0]
    : undefined;
  if (source && task.id === "PKG-221") {
    return {
      source,
      evidence: { ...source, note: "" },
      summary: "The receiving log supports the missing identifier in the inventory export.",
      nextStep: "Confirm the finding if the sources support it. The confirmation records your review here.",
    };
  }
  if (source) {
    return {
      source,
      evidence: undefined,
      summary: "The export is blank, but the receiving log says an identifier was present.",
      nextStep: "Ask a manager to reconcile the two sources, or add evidence that resolves the conflict.",
    };
  }
  return {
    source: undefined,
    evidence: undefined,
    summary: "No supporting record is linked to this observation.",
    nextStep: "Ask a manager to investigate, or add evidence if you have a source.",
  };
}
