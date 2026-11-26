import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ReceivingCheck } from "./ReceivingCheck";
import { ReceivingMonitor } from "./ReceivingMonitor";
import { Briefing, Conversation } from "./AskMellow";
import { ActivityPage } from "./ActivityPage";
import { LearnPage } from "./LearnPage";
import { ContextPanel, HandoffPanel, PackageTrail, SeriesList } from "./ContextPanel";
import { NoteLine } from "./NoteLine";
import { FindingsDialog } from "./FindingsDialog";
import { TrailDialog } from "./TrailDialog";
import { BinderDialog, InspectionPrep } from "./InspectionPrep";
import { checkControls } from "./controls";
import { maxUploadBytes, maxUploadText } from "./limits";
import { clearDevice } from "./device";
import { defaultName, readSetup, setupKey, setupSteps, type Setup } from "./setup";
import { notesFor, noteTrail, sampleChecks, type NewIssue, type Note, type SourceEvent } from "./notes";
import { panelFor, queueView, sameView, type PanelView } from "./panel";
import { addTurn, ask, type FileSet, brief, issueOf, orderQueue, type AskAction, type AskAnswer, type Series, type Turn } from "./ask";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
import { monitorReceiving, type ReceivingPosture } from "./monitoring";
import { checkFor, ledgerCounts } from "./ledger-math";
import { comparisonTasks, type LotCheck } from "./comparison";
import { shipmentNextStep, type ShipmentCheck } from "./shipments";
import { currentStore, sampleFor, sampleWorkspace, scoped, storeKey, stores } from "./sample/store";

import {
  emptyDraft, hasEvidence, inspectRow, latestDecisions, lotValueLabel, nextRecord, parseCsv, prepareReview, readWorkspace, recordDecision, shiftHandoff, storageKey, taskReference, workQueue,
  type Decision, type Draft, type Task, type Workspace,
} from "./workspace";


// Morph between states with the browser's view transitions where available.
// "page" cross-fades both columns; "panel" morphs only the side panel and
// lets the reading column hold still.
function smooth(update: () => void, kind: "page" | "panel" = "page") {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof document.startViewTransition !== "function") { update(); return; }
  document.documentElement.dataset.vt = kind;
  const transition = document.startViewTransition(() => flushSync(update));
  void transition.finished.finally(() => { delete document.documentElement.dataset.vt; });
}

const tabs = ["Today", "Activity", "Learn"] as const;
const panelKey = "mellow.panel";
const dismissedKey = scoped("mellow.notes.dismissed");
/** Rows and files from the person's own comparisons, kept with the queue they created so Mellow can still explain them after a reload. */
const importedKey = scoped("mellow.imported");
const workspaceKey = scoped(storageKey);
const storeSample = sampleFor(currentStore());
const sampleComparison = storeSample.comparison;
const sampleStart = sampleWorkspace(storeSample);
const readStoreWorkspace = () => readWorkspace(workspaceKey, sampleStart);
type Imported = { rows: LotCheck[]; sets: FileSet[] };
function readImported(): Imported {
  try {
    const saved = JSON.parse(localStorage.getItem(importedKey) ?? "null") as Imported | null;
    return saved && Array.isArray(saved.rows) && Array.isArray(saved.sets) ? saved : { rows: [], sets: [] };
  } catch { return { rows: [], sets: [] }; }
}

type NoteEvent = { id: string; text: string; trigger: string; at: string; dismissedAt?: string; feedback?: string };
function readDismissed(): NoteEvent[] {
  try { return JSON.parse(localStorage.getItem(dismissedKey) ?? "[]") as NoteEvent[]; } catch { return []; }
}

/** Context mode (sprint 5, A5): "floor" on a phone, one task at a time; "desk" with room for the queue. Print is the "record" mode. */
function useContextMode() {
  const query = "(width < 700px)";
  const [floor, setFloor] = useState(() => { try { return window.matchMedia(query).matches; } catch { return false; } });
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setFloor(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return floor ? "floor" : "desk";
}

function initialCollapsed() {
  try {
    const saved = localStorage.getItem(panelKey);
    if (saved) return saved === "collapsed";
    return window.matchMedia("(width < 900px)").matches;
  } catch {
    return false;
  }
}
type Tab = typeof tabs[number];

// Button dropdowns float over the page instead of pushing content down.
function Dropdown({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) ref.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return <details ref={ref} className="review-options dropdown" onToggle={(event) => setOpen(event.currentTarget.open)}
    onKeyDown={(event) => {
      if (event.key !== "Escape" || !ref.current?.open) return;
      ref.current.removeAttribute("open");
      ref.current.querySelector("summary")?.focus();
    }}>
    <summary>{label}</summary>
    <div className="review-options-body" role="group" aria-label={label}
      onClick={(event) => { if ((event.target as HTMLElement).closest("button")) ref.current?.removeAttribute("open"); }}>
      {children}
    </div>
  </details>;
}

function DecisionNote({ note, onChange }: { note: string; onChange: (note: string) => void }) {
  const [open, setOpen] = useState(Boolean(note));
  return (
    <details className="note" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>{note ? "Edit note" : "Add note"}</summary>
      <textarea aria-label="Decision note" value={note} onChange={(event) => onChange(event.target.value)} maxLength={1000} />
    </details>
  );
}

function ReviewDrawing({ kind }: { kind: "package" | "receipt" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 48" className="review-drawing" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {kind === "package" && <>
        <path className="drawing-fill" d="m9 16 21-9 21 9-21 9Z" />
        <path d="M9 16v20l21 9 21-9V16M30 25v20M20 12l21 9v7" />
        <path d="m14 27 10 4v7l-10-4zM17 31l4 2" />
      </>}
      {kind === "receipt" && <>
        <path d="M16 6h27v35l-4-3-5 3-5-3-5 3-4-3-4 3z" />
        <path className="drawing-fill" d="M21 12h16v6H21z" />
        <path d="M22 23h15m-15 5h9m-9 5h13m15-19 4-3m-3 9h5" />
      </>}
    </svg>
  );
}

function evidenceExamples(task: Task) {
  const examples = [];
  if (task.sample || /batch or lot/i.test(task.observation)) examples.push("a package label or receiving log");
  if (/transfer/i.test(task.observation)) examples.push("a transfer manifest or receiving receipt");
  if (/expiration/i.test(task.observation)) examples.push("a dated package label or supplier record");
  return examples.length ? [...new Set(examples)].join(", or ") : "a receiving log, package label, or inventory record";
}

const qtyText = (value: number | null, unit: string) => value === null ? "" : ` · ${value} ${unit === "Each" ? (value === 1 ? "unit" : "units") : unit.toLowerCase()}`;

function SourceComparison({ task, review }: { task: Task; review: ReturnType<typeof prepareReview> }) {
  const sample = task.sample ? sampleComparison.find(({ packageId }) => task.id === packageId) : undefined;
  // Shipment rows (sprint 7): three records side by side, the manifest, receiving and inventory.
  if (sample && "reasons" in sample) {
    const row = sample as ShipmentCheck;
    return <section className="comparison" aria-label="Evidence">
      <div className="comparison-grid" data-three>
        <div className="comparison-source">
          <span className="source-label"><ReviewDrawing kind="receipt" />Manifest</span>
          <strong>{row.onManifest ? `${lotValueLabel(row.manifestLot)}${qtyText(row.shipped, row.unit)}` : "Not on the manifest"}</strong>
          <small>{row.manifest ?? "No manifest"}{row.item ? ` · ${row.item}` : ""}</small>
        </div>
        <div className="comparison-source">
          <span className="source-label"><ReviewDrawing kind="receipt" />Receiving record</span>
          <strong>{row.receiving === null ? "No receiving record" : `${lotValueLabel(row.receiving)}${qtyText(row.received, row.unit)}`}</strong>
          <small>Sample receiving log</small>
        </div>
        <div className="comparison-source">
          <span className="source-label"><ReviewDrawing kind="package" />Inventory record</span>
          <strong>{lotValueLabel(row.inventory)}</strong>
          <small>{taskReference(task)}</small>
        </div>
      </div>
    </section>;
  }
  const comparison = task.lotComparison ?? sample;
  const secondSource = review.source || comparison;
  return <section className="comparison" aria-label="Evidence">
    <div className="comparison-grid" data-single={!secondSource}>
      <div className="comparison-source">
        <span className="source-label"><ReviewDrawing kind="package" />{secondSource ? "Inventory record" : "Imported file"}</span>
        <strong>{comparison ? lotValueLabel(comparison.inventory) : task.observation}</strong>
        <small>{taskReference(task)}</small>
      </div>
      {secondSource && <div className="comparison-source">
        <span className="source-label"><ReviewDrawing kind="receipt" />Receiving record</span>
        <strong>{comparison ? lotValueLabel(comparison.receiving) : review.source?.excerpt}</strong>
        <small>{review.source?.reference ?? "Sample receiving log"}</small>
      </div>}
    </div>
  </section>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Today");
  const contextMode = useContextMode();
  const nav = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [workspace, setWorkspace] = useState(() => {
    try { return readStoreWorkspace(); } catch { return sampleStart; }
  });
  const [posture, setPosture] = useState<ReceivingPosture>(() => ({ receiving: "current", runs: storeSample.runs, lastSuccessfulRun: storeSample.runs.at(-1) ?? null, delayedAt: null }));
  const [focusSeries, setFocusSeries] = useState<Series | null>(null);
  const [panelView, setPanelView] = useState<PanelView>(queueView);
  const [panelCollapsed, setPanelCollapsed] = useState(initialCollapsed);
  const [compareRequest, setCompareRequest] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [askOpen, setAskOpen] = useState(false);
  const [extraRows, setExtraRows] = useState<LotCheck[]>([]);
  const [imported, setImported] = useState<Imported>(readImported);
  const importedRows = imported.rows;
  const fileSets = imported.sets;
  const [sharing, setSharing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [binder, setBinder] = useState(false);
  const [setup, setSetup] = useState<Setup>(() => { try { return readSetup(localStorage); } catch { return { name: defaultName, shared: false }; } });
  const workspaceName = setup.name;
  const [confirmReset, setConfirmReset] = useState(false);
  const [newIssues, setNewIssues] = useState<NewIssue[]>([]);
  const [opened, setOpened] = useState<string[]>([]);
  const [restoredAt, setRestoredAt] = useState<string | null>(null);
  const [dismissedLog, setDismissedLog] = useState<NoteEvent[]>(readDismissed);
  const [sources, setSources] = useState<SourceEvent[]>([]);
  const askButton = useRef<HTMLButtonElement>(null);
  const [activeId, setActiveId] = useState("");
  const [editRecordId, setEditRecordId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [handoffStatus, setHandoffStatus] = useState("");
  const [query, setQuery] = useState("");
  const editor = useRef<HTMLHeadingElement>(null);
  const evidenceInput = useRef<HTMLInputElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const latest = latestDecisions(workspace.history);
  const handoff = shiftHandoff(workspace);
  const manager = handoff.map(({ task }) => task);
  const queue = workQueue(workspace);
  const comparison = extraRows.length || importedRows.length
    ? [...sampleComparison, ...extraRows].filter(({ packageId }) => !importedRows.some((row) => row.packageId === packageId)).concat(importedRows)
    : sampleComparison;
  const ordered = orderQueue(queue, comparison);
  const prepResults = checkControls(comparison);
  const counts = ledgerCounts({ comparison, tasks: workspace.tasks, history: workspace.history, runs: posture.runs });
  const askContext = { queue, manager, comparison, runs: posture.runs, receiving: posture.receiving, fileSets, counts };
  const notes = notesFor({
    checks: posture.runs.map((entry) => entry.checkedAt), newIssues, receiving: posture.receiving, restoredAt,
    lastGoodAt: posture.lastSuccessfulRun?.checkedAt,
    waiting: handoff.map(({ task }) => ({ taskId: task.id, record: task.record,
      since: [...workspace.history].reverse().find((entry) => entry.task.id === task.id && entry.decision === "Manager review requested")?.at ?? new Date().toISOString() })),
    dismissed: new Set(dismissedLog.map(({ id }) => id)), now: new Date().toISOString(),
  });
  const fresh = [...notes.fresh].filter((id) => !opened.includes(id));
  const trail = noteTrail({ checks: posture.runs.map((entry) => entry.checkedAt), newIssues, sources, now: new Date().toISOString(),
    waiting: handoff.map(({ task }) => ({ taskId: task.id, record: task.record,
      since: [...workspace.history].reverse().find((entry) => entry.task.id === task.id && entry.decision === "Manager review requested")?.at ?? new Date().toISOString() })) });
  const briefing = brief(askContext);
  const ownIds = new Set(fileSets.flatMap(({ packageIds }) => packageIds));
  const steps = setupSteps({ name: setup.name, comparedSets: fileSets.length, shared: setup.shared,
    ownDecisions: workspace.history.filter((entry) => !entry.task.sample && ownIds.has(entry.task.record)).length });
  const stepsDone = steps.filter(({ done }) => done).length;
  const noteLog = [...trail.map(({ id, text, trigger, at }) => dismissedLog.find((event) => event.id === id) ?? { id, text, trigger, at }),
    ...dismissedLog.filter((event) => !trail.some(({ id }) => id === event.id)
      && new Date(event.dismissedAt ?? event.at).toDateString() === new Date().toDateString())];
  const doneToday = [...latest.entries()].filter(([, decision]) => decision === "Approved" || decision === "Dismissed")
    .map(([id, decision]) => ({ id, decision, entry: workspace.history.find((item) => item.task.id === id && item.decision === decision) }))
    .filter(({ entry }) => entry && new Date(entry.at).toDateString() === new Date().toDateString());
  const active = [...queue, ...manager].find((task) => task.id === activeId) ?? ordered[0]?.task;
  const activeIssue = active ? issueOf(active, comparison) : undefined;
  // "Next" follows the same order as "1 of N": what needs you most first (sprint 5, B2).
  const following = active ? (ordered.map(({ task }) => task).find((task, index, list) => index > list.findIndex(({ id }) => id === active.id) && task.id !== active.id)
    ?? ordered.map(({ task }) => task).find(({ id }) => id !== active.id) ?? nextRecord(workspace.tasks, queue, active.id)) : undefined;
  const followingIssue = following ? issueOf(following, comparison) : undefined;
  const position = active ? ordered.findIndex(({ task }) => task.id === active.id) + 1 : 0;
  const draft = active ? workspace.drafts[active.id] ?? emptyDraft : emptyDraft;
  const review = active ? prepareReview(active) : undefined;
  const hasManualEvidence = Boolean(draft.reference || draft.excerpt)
    && (draft.reference !== review?.evidence?.reference || draft.excerpt !== review?.evidence?.excerpt);
  const editing = active?.id === editRecordId;
  const preparedEvidence = !editing && !hasManualEvidence ? review?.evidence : undefined;
  const needsRationale = editing && Boolean(review?.requiresRationale);
  const canApprove = Boolean(preparedEvidence) || (editing && hasEvidence(draft) && (!needsRationale || Boolean(draft.note.trim())));
  const pendingManager = Boolean(active && latest.get(active.id) === "Manager review requested");
  const primaryAction = editing || canApprove ? "record"
    : hasManualEvidence || !review?.requiresRationale || pendingManager ? "evidence" : "manager";
  const shipmentRow = active?.sample ? sampleComparison.find(({ packageId }) => packageId === active.id) : undefined;
  const instruction = pendingManager ? "Already in the manager handoff."
    : shipmentRow && "reasons" in shipmentRow && !hasManualEvidence ? shipmentNextStep(shipmentRow as ShipmentCheck)
    : hasManualEvidence ? "Check the evidence you added before recording this issue."
      : review?.evidence ? "If neither record lists a lot number, record the issue."
        : active?.lotComparison ? review?.nextStep
          : review?.requiresRationale ? "The records disagree. Leave this for a manager to check the label."
          : "Only the import is available. Add a supporting record or leave this for a manager.";
  const missingEvidence = !draft.reference.trim() && !draft.excerpt.trim() ? "Add the source and what it shows."
    : !draft.reference.trim() ? "Add where you found it."
      : !draft.excerpt.trim() ? "Add what the source shows."
        : needsRationale && !draft.note.trim() ? "Explain which record you trust and why."
          : "";
  const evidenceAction = hasManualEvidence ? "Review saved evidence" : "Add evidence";
  const hasDraft = Object.values(draft).some((value) => value.trim());

  function save(update: (current: Workspace) => Workspace) {
    try {
      const next = update(readStoreWorkspace());
      localStorage.setItem(workspaceKey, JSON.stringify(next));
      setWorkspace(next);
      setError("");
      return true;
    } catch (failure) {
      setError(failure instanceof Error && ["Supporting evidence is required.", "Explain how the added evidence resolves the conflict."].includes(failure.message)
        ? failure.message : "Couldn’t save to this browser. Check storage and try again.");
      return false;
    }
  }

  function addComparison(rows: LotCheck[], inventoryFile: string, receivingFile: string) {
    const tasks = comparisonTasks(rows, inventoryFile, receivingFile);
    const ids = rows.map(({ packageId }) => packageId);
    setImported((current) => {
      const next = {
        rows: [...current.rows.filter(({ packageId }) => !ids.includes(packageId)), ...rows],
        sets: [...current.sets.map((set) => ({ ...set, packageIds: set.packageIds.filter((id) => !ids.includes(id)) })).filter((set) => set.packageIds.length),
          { files: [inventoryFile, receivingFile], packageIds: ids, at: new Date().toISOString() }],
      };
      try { localStorage.setItem(importedKey, JSON.stringify(next)); } catch { /* Kept for this visit only. */ }
      return next;
    });
    let first: Task | undefined;
    let added = 0;
    const saved = save((current) => {
      const existing = new Set(current.tasks.map(({ id }) => id));
      const additions = tasks.filter(({ id }) => !existing.has(id));
      first = additions[0];
      added = additions.length;
      return added ? { ...current, tasks: [...current.tasks, ...additions] } : current;
    });
    if (saved) {
      setStatus(`Compared ${rows.length} packages. ${added ? `${added} added to To check.` : tasks.length ? "These differences are already in Mellow." : "All lot numbers match."}`);
      if (first) openTask(first);
    }
    return saved;
  }

  async function importCsv(file: File) {
    if (file.size > maxUploadBytes) throw new Error(`Choose a CSV of ${maxUploadText} or less.`);
    const rows = parseCsv(await file.text());
    const batchId = crypto.randomUUID();
    const tasks = rows.flatMap((row, index): Task[] => {
      const observation = inspectRow(row);
      if (!observation) return [];
      return [{
        id: `${batchId}:${index}`, source: file.name, line: index + 1, observation,
        record: row.package_id || row.metrc_package_id || row.pkg_id || row.package || row.id || `Record ${index + 1}`,
      }];
    });
    if (!save((current) => ({ ...current, tasks: [...current.tasks, ...tasks] }))) {
      throw new Error("Couldn’t save these reviews on this device. Try again.");
    }
    setStatus(`Read ${rows.length} CSV records. Added ${tasks.length} observations to review.`);
    if (tasks[0]) openTask(tasks[0]);
  }

  function updateDraft(field: keyof Draft, value: string) {
    if (!active) return;
    const id = active.id;
    const update = (current: Workspace) => ({ ...current, drafts: {
      ...current.drafts, [id]: { ...(current.drafts[id] ?? emptyDraft), ...draft, [field]: value },
    } });
    if (!save(update)) setWorkspace((current) => ({ ...current, drafts: { ...current.drafts, [id]: { ...draft, [field]: value } } }));
  }

  function focusRecord() {
    requestAnimationFrame(() => {
      const heading = editor.current;
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  }

  function decide(task: Task, decision: Decision) {
    let changed = false;
    let nextId = "";
    const saved = save((current) => {
      const savedDraft = workspace.drafts[task.id] ?? current.drafts[task.id] ?? emptyDraft;
      const evidence = decision === "Approved" && preparedEvidence
        ? { ...preparedEvidence, note: savedDraft.note }
        : savedDraft;
      const next = recordDecision(current, task, decision, evidence);
      changed = next !== current;
      if (changed && decision !== "Reopened") {
        // Advance in the same order as "1 of N": the next one after this, by what needs you most.
        const remaining = orderQueue(workQueue(next), comparison).map(({ task: item }) => item);
        const before = ordered.map(({ task: item }) => item.id);
        const here = before.indexOf(task.id);
        nextId = (remaining.find(({ id }) => before.indexOf(id) > here) ?? remaining[0])?.id ?? "";
      }
      return next;
    });
    if (saved && changed) {
      const result = decision === "Approved" ? "Issue confirmed" : decision === "Manager review requested" ? "Added to manager handoff" : decision === "Dismissed" ? "Marked not an issue" : "Reopened";
      setStatus(`${task.record} · ${result}. Saved on this device.`);
      setHandoffStatus("");
      if (decision === "Reopened") {
        requestAnimationFrame(() => feedback.current?.focus());
      } else {
        setActiveId(nextId);
        setEditRecordId("");
        focusRecord();
      }
    }
  }

  function openEvidence() {
    if (!active) return;
    setEditRecordId(active.id);
    requestAnimationFrame(() => evidenceInput.current?.focus());
  }

  function goTo(next: Tab, question?: string) {
    const update = () => {
      setTab(next);
      setStatus("");
      setError("");
      setAskOpen(false);
      if (question) {
        const answer = ask(question, askContext);
        setTurns((previous) => addTurn(previous, question, answer));
        applyView(panelFor(answer));
      }
    };
    if (next === tab && !question) update(); else smooth(update);
  }

  function applyView(next: PanelView | null) {
    if (!next) return;
    setPanelView(next);
    setFocusSeries(next.kind === "series" ? next.series : null);
  }

  function showAnswer(answer: AskAnswer) {
    const next = panelFor(answer);
    if (!next) return;
    if (sameView(next, panelView)) applyView(next); else smooth(() => applyView(next), "panel");
  }

  function backToQueue() {
    if (sameView(panelView, queueView)) { setFocusSeries(null); return; }
    smooth(() => applyView(queueView), "panel");
  }

  function focusComposer(scroll: boolean) {
    requestAnimationFrame(() => {
      const field = document.getElementById("ask-input") as HTMLTextAreaElement | null;
      if (!field) return;
      if (scroll) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        field.closest(".conversation")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
      }
      field.focus({ preventScroll: true });
    });
  }

  function openAsk() {
    if (tab === "Today") { focusComposer(true); return; }
    if (askOpen) { closeAsk(); return; }
    setAskOpen(true);
    focusComposer(false);
  }

  function closeAsk() {
    setAskOpen(false);
    requestAnimationFrame(() => askButton.current?.focus());
  }

  /** "See all": open the queue where it lives (the panel on a desk, the list below on a phone) and move focus to it. */
  function showQueue() {
    const focusQueue = (tries = 0) => {
      const node = document.getElementById("work-queue");
      if (node && node.offsetParent !== null) {
        node.scrollIntoView({ block: "start" });
        node.focus({ preventScroll: true });
      } else if (tries < 30) requestAnimationFrame(() => focusQueue(tries + 1));
    };
    if (panelCollapsed) {
      try { localStorage.setItem(panelKey, "open"); } catch { /* Kept for this visit. */ }
      smooth(() => { setPanelView(queueView); setPanelCollapsed(false); }, "panel");
      focusQueue();
    } else { if (!sameView(panelView, queueView)) setPanelView(queueView); focusQueue(); }
  }

  function togglePanel() {
    const next = !panelCollapsed;
    try { localStorage.setItem(panelKey, next ? "collapsed" : "open"); } catch { /* Keep the choice for this visit. */ }
    smooth(() => setPanelCollapsed(next), "panel");
  }

  function updateSetup(change: Partial<Setup>) {
    setSetup((current) => {
      const next = { ...current, ...change };
      try { localStorage.setItem(setupKey, JSON.stringify(next)); } catch { /* Kept for this visit. */ }
      return next;
    });
  }

  function markNotUseful(note: Note, reason: string) {
    dismissNote(note, reason);
    setStatus("Marked not useful. Saved on this device. Nothing was sent.");
  }

  function dismissNote(note: Note, feedback?: string) {
    const event: NoteEvent = { id: note.id, text: note.text, trigger: note.trigger, at: note.at, dismissedAt: new Date().toISOString(), ...(feedback ? { feedback } : {}) };
    setDismissedLog((current) => {
      const next = [...current.filter(({ id }) => id !== note.id), event];
      try { localStorage.setItem(dismissedKey, JSON.stringify(next)); } catch { /* Keep it for this visit. */ }
      return next;
    });
  }

  function resetSample() {
    try {
      localStorage.removeItem(workspaceKey);
      localStorage.removeItem(dismissedKey);
      localStorage.removeItem(importedKey);
    } catch { /* Nothing stored to clear. */ }
    window.location.reload();
  }

  function simulateCheck() {
    const index = Math.min(newIssues.length ? 1 : 0, sampleChecks.length - 1);
    const rows: LotCheck[] = sampleChecks[index].map((row) => ({ ...row, state: row.receiving === null ? "missing" : "different" }));
    const fresh = rows.filter((row) => !comparison.some(({ packageId }) => packageId === row.packageId));
    if (!fresh.length) { setStatus("No new sample checks left. Reload the page to start over."); return; }
    const time = new Date().toISOString();
    const tasks = comparisonTasks(fresh, "Sample inventory export", "Sample receiving log");
    if (!save((current) => ({ ...current, tasks: [...current.tasks, ...tasks.filter(({ id }) => !current.tasks.some((task) => task.id === id))] }))) return;
    setExtraRows((current) => [...current, ...fresh]);
    setPosture((current) => monitorReceiving(current, fresh, "current", time));
    setNewIssues((current) => [...current, ...tasks.map((task, i) => ({ taskId: task.id, record: task.record, kind: fresh[i].state === "different" ? "different" as const : "missing" as const, at: time }))]);
    setRestoredAt(null);
  }

  function openTask(task: Task) {
    setOpened((current) => current.includes(task.id) ? current : [...current, task.id]);
    setActiveId(task.id);
    setEditRecordId("");
    goTo("Today");
    focusRecord();
  }

  function queueRow(task: Task, kind: string, label: string, index = 0) {
    const foundIn = newIssues.find((issue) => issue.taskId === task.id)?.at;
    const foundBy = checkFor(posture.runs, task.record);
    const time = foundIn ? clock(foundIn) : foundBy ? clock(foundBy.checkedAt) : "Import";
    return <li key={task.id} style={{ "--i": index } as CSSProperties}>
      <button className="queue-row" data-kind={kind} aria-current={active?.id === task.id ? "true" : undefined} onClick={() => openTask(task)}>
        <span className="queue-mark" aria-hidden="true" />
        <span className="queue-id">{task.record}</span>
        <span className="queue-issue">{label}</span>
        {fresh.includes(task.id) && <span className="queue-new">New</span>}
        <span className="queue-time">{time}</span>
      </button>
      {notes.rows.get(task.id) && <NoteLine note={notes.rows.get(task.id)!} onDismiss={dismissNote} onNotUseful={markNotUseful} compact />}
    </li>;
  }

  async function copyHandoff() {
    const content = ["Mellow shift handoff · Sample workspace", ...handoff.map(({ text }) => text)].join("\n\n");
    try {
      await navigator.clipboard.writeText(content);
      setHandoffStatus("Handoff copied.");
    } catch {
      setHandoffStatus("Couldn’t copy. Select the handoff text below.");
    }
  }

  function toggleDelay() {
    const time = new Date().toISOString();
    setRestoredAt(posture.receiving === "delayed" ? time : null);
    setSources((current) => [...current, posture.receiving === "delayed"
      ? { kind: "restored", at: time } : { kind: "delayed", at: time, lastGoodAt: posture.lastSuccessfulRun?.checkedAt }]);
    setPosture((current) => monitorReceiving(current, [], current.receiving === "current" ? "delayed" : "current", time));
  }

  function onAsk(action: AskAction) {
    if (action.kind === "open") {
      const task = [...queue, ...manager].find((item) => item.id === action.id);
      if (task) openTask(task);
    } else if (action.kind === "tab") goTo(action.tab);
    else if (action.kind === "prep" || action.kind === "binder") {
      goTo("Activity");
      if (action.kind === "binder") { setBinder(true); updateSetup({ shared: true }); }
      else requestAnimationFrame(() => requestAnimationFrame(() => {
        const node = document.getElementById("prep-title");
        node?.closest("section")?.scrollIntoView({ block: "start" });
        (node as HTMLElement | null)?.focus({ preventScroll: true });
      }));
    }
    else if (action.kind === "rules") {
      goTo("Learn");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const node = document.getElementById("rules-title");
        node?.scrollIntoView({ block: "start" });
        (node as HTMLElement | null)?.focus({ preventScroll: true });
      }));
    }
    else if (action.kind === "compare") {
      if (tab !== "Today") goTo("Today");
      requestAnimationFrame(() => setCompareRequest((count) => count + 1));
    } else if (action.kind === "series") setFocusSeries(action.series);
    else if (action.kind === "evidence") {
      if (tab !== "Today") goTo("Today");
      requestAnimationFrame(openEvidence);
    }
    else toggleDelay();
  }

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      askButton.current?.click();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useLayoutEffect(() => {
    const node = nav.current;
    if (!node) return;
    const place = () => {
      const current = node.querySelector<HTMLElement>("button[aria-current]");
      setPill(current ? { x: current.offsetLeft, y: current.offsetTop, width: current.offsetWidth, height: current.offsetHeight } : null);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(node);
    return () => observer.disconnect();
  }, [tab]);

  return (
    <div className="shell" data-palette="ledger" data-context={contextMode}>
      <header className="masthead"><div className="masthead-inner">
        <div className="wordmark">mellow<span aria-hidden="true">.</span></div>
        <nav aria-label="Main navigation" ref={nav} data-pill={pill ? "" : undefined}>
          {pill && <span className="nav-pill" aria-hidden="true" style={{ width: pill.width, transform: `translate(${pill.x}px, ${pill.y + pill.height - 2}px)` }} />}
          {tabs.map((item) => <button key={item} aria-current={tab === item ? "page" : undefined} onClick={() => goTo(item)}>{item}</button>)}
        </nav>
        <p className="local-label">{new Date().toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })} · {workspaceName} ·{" "}
          <label className="store-switch"><span className="sr-only">Store</span>
            <select value={storeSample.store} onChange={(event) => {
              try { localStorage.setItem(storeKey, event.target.value); } catch { /* Can't remember the store. */ }
              window.location.reload();
            }}>{stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select>
          </label>
        </p>
        <button ref={askButton} type="button" className="ask-trigger" onClick={openAsk} aria-keyshortcuts="/"
          aria-expanded={tab === "Today" ? undefined : askOpen} aria-controls={tab === "Today" ? "ask-input" : "ask-drawer"}
          data-open={tab !== "Today" && askOpen ? "" : undefined} title="Ask Mellow (/)">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5H4.5z" /><path d="M8.5 10.5h7" />
          </svg>
          <span className="ask-trigger-label">Ask Mellow</span>
          {turns.length > 0 && tab !== "Today" && !askOpen && <span className="ask-waiting">1 waiting</span>}
          <kbd aria-hidden="true">/</kbd>
        </button>
      </div></header>
      <main className="page" key={tab}>
        {tab !== "Today" && <p className="feedback" ref={feedback} role="status" tabIndex={-1}>{status}</p>}
        {tab !== "Today" && error && <p className="error" role="alert">{error}</p>}
        {tab === "Today" && <div className="ledger">
          <div className="ledger-main">
            {active && <a className="phone-next" href="#task-title" onClick={(event) => { event.preventDefault(); openTask(active); }}>
              <span className="kicker">Your next package{position && !pendingManager ? ` · ${position} of ${ordered.length}` : ""}</span>
              <span className="phone-next-id">{active.record}</span>
              <span className="phone-next-issue">{activeIssue?.label}</span>
            </a>}
            <section className="sample-bar" aria-label="Sample workspace controls">
              <p className="kicker">Sample workspace</p>
              <p className="sample-bar-text">Fictional records. Try what a shift feels like:</p>
              <div className="sample-bar-actions">
                <button type="button" className="ledger-button" data-variant="line" onClick={simulateCheck} disabled={posture.receiving === "delayed"}>Simulate a new check</button>
                <button type="button" className="ledger-button" data-variant="line" onClick={toggleDelay}>{posture.receiving === "delayed" ? "Restore the source" : "Simulate a delay"}</button>
                <button type="button" className="ledger-button" onClick={() => setCompareRequest((count) => count + 1)}>Use my files</button>
              </div>
              {confirmReset
                ? <p className="sample-bar-reset" role="group" aria-label="Confirm reset">
                    <span>Clear this device’s decisions and start over?</span>
                    <button type="button" className="text-link" onClick={resetSample}>Reset</button>
                    <button type="button" className="text-link" onClick={() => setConfirmReset(false)}>Cancel</button>
                  </p>
                : <button type="button" className="text-link sample-bar-reset" onClick={() => setConfirmReset(true)}>Reset sample</button>}
              <details className="setup">
                <summary>Set up your workspace · {stepsDone} of {steps.length} done</summary>
                <div className="setup-body">
                  <label className="setup-name">Workspace name
                    <input defaultValue={setup.name === defaultName ? "" : setup.name} placeholder="For example, Riverside store" maxLength={60}
                      onBlur={(event) => updateSetup({ name: event.target.value.trim() || defaultName })}
                      onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} />
                  </label>
                  <ol className="setup-steps">{steps.map((step) => <li key={step.id} data-done={step.done || undefined}>
                    <span className="setup-state">{step.done ? "Done" : "To do"}</span><span>{step.label}</span>
                  </li>)}</ol>
                  <p className="setup-help">Mellow ticks a step only when it has happened on this device. Columns you choose are remembered for files with the same headers.</p>
                </div>
              </details>
            </section>
            <Briefing brief={briefing} lastCheck={posture.lastSuccessfulRun?.checkedAt} delayed={posture.receiving === "delayed"}
              note={notes.briefing ? <NoteLine key={notes.briefing.id} note={notes.briefing} onDismiss={dismissNote} onNotUseful={markNotUseful} /> : undefined}
              aside={<ReceivingCheck onCompared={addComparison} onImport={importCsv} openRequest={compareRequest} />} />
            <section className="primary ledger-record" aria-labelledby="task-title">
              <p className="record-marker" data-manager={pendingManager || undefined}>{active ? (pendingManager ? "With a manager"
                : position ? <span className="record-position">{position} of {ordered.length}</span> : "Now") : ""}</p>
              <div className="ledger-record-body">
                <div className="review-heading">
                  <div key={active?.id} className="record-identity">
                    {active && <p className="eyebrow">{active.sample ? "Sample package" : "Imported record"}{position && !pendingManager ? " · sorted by what needs you most" : ""}</p>}
                    <h2 id="task-title" tabIndex={-1} ref={editor} aria-describedby={status ? "review-feedback" : undefined}>{active ? `${active.record} · ${activeIssue?.label.toLowerCase()}` : "You’re caught up"}</h2>
                  </div>
                  {ordered.length > 1 && (panelCollapsed || contextMode === "floor") && <button type="button" className="queue-link" onClick={showQueue}>See all {ordered.length}</button>}
                </div>
                {error && <p className="error review-feedback" role="alert">{error}</p>}
                {active && review ? <>
                  <p className="review-instruction" id="evidence-help">{instruction}</p>
                  <SourceComparison key={active.id} task={active} review={review} />
                  {editing && <section className="evidence" aria-label="Add supporting evidence">
                    <div className="evidence-header">
                      <h3>Add evidence</h3>
                      {hasDraft && <span className="draft-label">{error ? "Draft on this page" : "Draft on this device"}</span>}
                    </div>
                    <p className="evidence-hint">Use {evidenceExamples(active)} for <strong>{active.record}</strong>.</p>
                    <div className="evidence-fields">
                      <div className="evidence-field">
                        <label htmlFor="evidence-source">Where did you find it?</label>
                        <input id="evidence-source" ref={evidenceInput} aria-describedby="evidence-source-hint" value={draft.reference} onChange={(event) => updateDraft("reference", event.target.value)} maxLength={500} />
                        <p className="supporting-text" id="evidence-source-hint">File name, record ID, or link.</p>
                      </div>
                      <div className="evidence-field">
                        <label htmlFor="evidence-excerpt">What does it show?</label>
                        <textarea id="evidence-excerpt" rows={2} aria-describedby="evidence-excerpt-hint" value={draft.excerpt} onChange={(event) => updateDraft("excerpt", event.target.value)} maxLength={2000} />
                        <p className="supporting-text" id="evidence-excerpt-hint">Copy the relevant line or describe exactly what you see.</p>
                      </div>
                      {needsRationale && <div className="evidence-field">
                        <label htmlFor="evidence-conflict">How does this resolve the conflict?</label>
                        <textarea id="evidence-conflict" rows={2} aria-describedby="evidence-conflict-hint" value={draft.note} onChange={(event) => updateDraft("note", event.target.value)} maxLength={1000} />
                        <p className="supporting-text" id="evidence-conflict-hint">Say which record you trust and why.</p>
                      </div>}
                    </div>
                    {missingEvidence && <p className="evidence-hint" id="evidence-missing">{missingEvidence}</p>}
                  </section>}
                  <div className="decision-footer" id="review-decision" role="group" aria-label="Decision controls">
                    <div className="actions">
                      {primaryAction === "record" && <button className="solid" aria-describedby={editing && missingEvidence ? "evidence-missing" : "evidence-help"} disabled={!canApprove} onClick={() => decide(active, "Approved")}>Record issue</button>}
                      {primaryAction === "evidence" && <button className="solid" onClick={openEvidence}>{evidenceAction}</button>}
                      {!pendingManager && <button className={primaryAction === "manager" ? "solid" : "secondary"} onClick={() => decide(active, "Manager review requested")}>Leave for manager</button>}
                      <Dropdown key={active.id} label="More options">
                        {!editing && primaryAction !== "evidence" && <button onClick={openEvidence}>{evidenceAction}</button>}
                        <button onClick={() => decide(active, "Dismissed")}>Not an issue</button>
                        {!needsRationale && <DecisionNote note={draft.note} onChange={(value) => updateDraft("note", value)} />}
                      </Dropdown>
                    </div>
                    {following && <button className="next-record" onClick={() => openTask(following)}>Next <span className="next-id">{following.record}</span>{followingIssue && <span className="next-issue"> · {followingIssue.label}</span>}</button>}
                  </div>
                </> : <div className="completion">
                  <p>{manager.length ? "Your checks are done. The next shift can see what still needs a manager." : "Everything in the queue has been checked. Your decisions are saved in Activity."}</p>
                  <button className="manual-evidence" onClick={() => goTo("Activity")}>{manager.length ? "Open shift handoff" : "See what was checked"}</button>
                </div>}
                <p className="feedback review-feedback" id="review-feedback" role="status">{status}</p>
              </div>
            </section>
            <Conversation context={askContext} chips={briefing.chips} turns={turns} onTurns={setTurns} onAction={onAsk} onAnswer={showAnswer} onClear={backToQueue} />
          </div>
          <ContextPanel view={panelView} collapsed={panelCollapsed} needYou={queue.length} fresh={fresh.length} lastCheck={posture.lastSuccessfulRun?.checkedAt}
            onBack={backToQueue} onToggle={togglePanel}>
            {panelView.kind === "queue" && <>
            <ReceivingMonitor posture={posture} open={queue.length} focusSeries={focusSeries} onFocusSeries={setFocusSeries} />
            <section className="ledger-queue" id="work-queue" tabIndex={-1} aria-labelledby="queue-title">
              <div className="queue-head">
                <h2 id="queue-title" className="kicker">Needs you · <span className="count" key={queue.length}>{queue.length}</span></h2>
                {queue.length > 1 && <span>Disagreements first</span>}
              </div>
              {ordered.length > 0 && <button type="button" className="text-link share-link" onClick={() => { setSharing(true); updateSetup({ shared: true }); }}>Share these findings</button>}
              {ordered.length ? <ul>{ordered.map(({ task, issue }, index) => queueRow(task, issue.kind, issue.label, index))}</ul>
                : <p className="empty">Nothing needs you right now.</p>}
              {manager.length > 0 && <>
                <div className="queue-head"><h3 className="kicker">With a manager · {manager.length}</h3></div>
                <ul>{manager.map((task) => queueRow(task, "manager", "Left for a manager"))}</ul>
              </>}
              {doneToday.length > 0 && <p className="done-line">
                <span className="kicker">Done today · {doneToday.length}</span>
                <span>{doneToday.map(({ id, decision }) => `${id} ${decision === "Approved" ? "recorded" : "not an issue"}`).join(", ")}</span>
                <button className="text-link" onClick={() => goTo("Activity")}>Activity</button>
              </p>}
            </section>
            </>}
            {panelView.kind === "package" && <PackageTrail id={panelView.id} task={[...queue, ...manager, ...workspace.tasks].find((item) => item.id === panelView.id)}
              row={comparison.find(({ packageId }) => packageId === panelView.id)} queued={queue.some((item) => item.id === panelView.id)}
              decision={latest.get(panelView.id)} entries={workspace.history.filter((entry) => entry.task.id === panelView.id)}
              lastCheck={posture.lastSuccessfulRun?.checkedAt} isActive={active?.id === panelView.id} onOpen={openTask} comparison={comparison} />}
            {panelView.kind === "series" && <>
              <ReceivingMonitor posture={posture} open={queue.length} focusSeries={focusSeries} onFocusSeries={setFocusSeries} />
              <SeriesList series={panelView.series} rows={comparison} open={[...queue, ...manager]} latest={latest}
                matched={counts.matched} activeId={active?.id} onOpen={openTask} />
            </>}
            {panelView.kind === "summary" && <ReceivingMonitor posture={posture} open={queue.length} focusSeries={focusSeries} onFocusSeries={setFocusSeries} />}
            {panelView.kind === "handoff" && <HandoffPanel handoff={handoff} status={handoffStatus} onCopy={() => void copyHandoff()} onOpen={openTask} />}
          </ContextPanel>
        </div>}
        {tab === "Activity" && <ActivityPage history={workspace.history} latest={latest} handoff={handoff} open={queue.length}
          counts={counts} handoffStatus={handoffStatus}
          notes={noteLog} onExport={() => { setExporting(true); updateSetup({ shared: true }); }}
          onPrep={() => onAsk({ kind: "prep" })}
          prep={<InspectionPrep results={prepResults} onBinder={() => { setBinder(true); updateSetup({ shared: true }); }}
            onOpenPackage={(id) => { const task = workspace.tasks.find(({ record }) => record === id); if (task) openTask(task); else goTo("Today", `Anything wrong with ${id}?`); }} />}
          onReopen={(task) => decide(task, "Reopened")} onOpen={openTask} onCopy={() => void copyHandoff()} onShare={() => { setSharing(true); updateSetup({ shared: true }); }} />}
        {tab === "Learn" && <LearnPage issues={ordered.map(({ issue }) => issue)} query={query} onQuery={setQuery} onAsk={(question) => goTo("Today", question)}
          onClearDevice={() => { try { clearDevice(localStorage); } catch { /* Nothing stored. */ } window.location.reload(); }} />}
      </main>
      <FindingsDialog open={sharing} onClose={() => setSharing(false)} input={{
        rows: comparison,
        sources: [
          ...(importedRows.length < comparison.length ? [{ files: ["Sample inventory export", "Sample receiving log"], at: posture.lastSuccessfulRun?.checkedAt, kind: "check" as const }] : []),
          ...fileSets.map(({ files, at }) => ({ files, at, kind: "compared" as const })),
        ],
        decisions: workspace.history.slice(-8).map(({ task, decision, at }) => ({ record: task.record, decision, at })),
      }} />
      <BinderDialog open={binder} results={prepResults} history={workspace.history} notes={noteLog} workspaceName={workspaceName} onClose={() => setBinder(false)} />
      <TrailDialog open={exporting} history={workspace.history} notes={noteLog} workspaceName={workspaceName} onClose={() => setExporting(false)} />
      {tab !== "Today" && askOpen && <aside className="ask-drawer" id="ask-drawer" role="dialog" aria-label="Talk with Mellow"
        onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); closeAsk(); } }}>
        <div className="ask-drawer-bar">
          <span className="kicker">Mellow · from {tab}</span>
          <button type="button" className="tool" aria-label="Close" onClick={closeAsk}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="ask-drawer-body">
          {turns.length === 0 && <p className="mellow-voice ask-drawer-lead">{briefing.message}</p>}
          <Conversation context={askContext} chips={briefing.chips} turns={turns} onTurns={setTurns} onAction={onAsk}
            onAnswer={(answer) => applyView(panelFor(answer))} onClear={() => applyView(queueView)} />
        </div>
      </aside>}
    </div>
  );
}
