import { useLayoutEffect, useRef, useState } from "react";
import { ReceivingCheck } from "./ReceivingCheck";
import { ReceivingMonitor } from "./ReceivingMonitor";
import { Briefing, Conversation } from "./AskMellow";
import { brief, issueOf, orderQueue, type AskAction, type Series } from "./ask";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
import { monitorReceiving, sampleHistory } from "./monitoring";
import { comparisonTasks, sampleComparison, type LotCheck } from "./comparison";

import {
  emptyDraft, hasEvidence, initial, inspectRow, latestDecisions, lotValueLabel, nextRecord, parseCsv, prepareReview, readWorkspace, recordDecision, shiftHandoff, storageKey, taskReference, workQueue,
  type Decision, type Draft, type Task, type Workspace,
} from "./workspace";


const tabs = ["Today", "Activity", "Learn"] as const;
type Tab = typeof tabs[number];
const references = [
  { title: "USDA Hemp Program", jurisdiction: "Federal", url: "https://www.ams.usda.gov/rules-regulations/hemp" },
  { title: "Texas DSHS Consumable Hemp Program", jurisdiction: "Texas", url: "https://www.dshs.texas.gov/consumable-hemp-program" },
  { title: "Texas State Law Library Hemp Products Guide", jurisdiction: "Texas", url: "https://guides.sll.texas.gov/cannabis/hemp-products" },
];

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

function SourceComparison({ task, review }: { task: Task; review: ReturnType<typeof prepareReview> }) {
  const sample = task.sample ? sampleComparison.find(({ packageId }) => task.id === packageId) : undefined;
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
  const nav = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [workspace, setWorkspace] = useState(() => {
    try { return readWorkspace(); } catch { return initial; }
  });
  const [posture, setPosture] = useState(() => {
    const now = new Date().toISOString();
    return monitorReceiving(undefined, sampleComparison, "current", now, sampleHistory(now));
  });
  const [focusSeries, setFocusSeries] = useState<Series | null>(null);
  const [compareRequest, setCompareRequest] = useState(0);
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
  const ordered = orderQueue(queue, sampleComparison);
  const askContext = { queue, manager, comparison: sampleComparison, runs: posture.runs, receiving: posture.receiving };
  const briefing = brief(askContext);
  const doneToday = [...latest.entries()].filter(([, decision]) => decision === "Approved" || decision === "Dismissed")
    .map(([id, decision]) => ({ id, decision, entry: workspace.history.find((item) => item.task.id === id && item.decision === decision) }))
    .filter(({ entry }) => entry && new Date(entry.at).toDateString() === new Date().toDateString());
  const active = [...queue, ...manager].find((task) => task.id === activeId) ?? ordered[0]?.task;
  const activeIssue = active ? issueOf(active, sampleComparison) : undefined;
  const following = active && nextRecord(workspace.tasks, queue, active.id);
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
  const instruction = pendingManager ? "Already in the manager handoff."
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
      const next = update(readWorkspace());
      localStorage.setItem(storageKey, JSON.stringify(next));
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
    if (file.size > 2_000_000) throw new Error("Choose a CSV of 2 MB or less.");
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
      if (changed && decision !== "Reopened") nextId = nextRecord(next.tasks, workQueue(next), task.id)?.id ?? "";
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

  function openTask(task: Task) {
    setActiveId(task.id);
    setEditRecordId("");
    setTab("Today");
    focusRecord();
  }

  function queueRow(task: Task, kind: string, label: string) {
    const time = task.sample && posture.lastSuccessfulRun ? clock(posture.lastSuccessfulRun.checkedAt) : "Import";
    return <li key={task.id}>
      <button className="queue-row" data-kind={kind} aria-current={active?.id === task.id ? "true" : undefined} onClick={() => openTask(task)}>
        <span className="queue-mark" aria-hidden="true" />
        <span className="queue-id">{task.record}</span>
        <span className="queue-issue">{label}</span>
        <span className="queue-time">{time}</span>
      </button>
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
    setPosture((current) => monitorReceiving(current, sampleComparison, current.receiving === "current" ? "delayed" : "current", time));
  }

  function onAsk(action: AskAction) {
    if (action.kind === "open") {
      const task = [...queue, ...manager].find((item) => item.id === action.id);
      if (task) openTask(task);
    } else if (action.kind === "tab") setTab(action.tab);
    else if (action.kind === "compare") setCompareRequest((count) => count + 1);
    else if (action.kind === "series") setFocusSeries(action.series);
    else if (action.kind === "evidence") openEvidence();
    else toggleDelay();
  }

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
    <div className="shell" data-palette="ledger">
      <header className="masthead"><div className="masthead-inner">
        <div className="wordmark">mellow<span aria-hidden="true">.</span></div>
        <nav aria-label="Main navigation" ref={nav} data-pill={pill ? "" : undefined}>
          {pill && <span className="nav-pill" aria-hidden="true" style={{ width: pill.width, transform: `translate(${pill.x}px, ${pill.y + pill.height - 2}px)` }} />}
          {tabs.map((item) => <button key={item} aria-current={tab === item ? "page" : undefined} onClick={() => setTab(item)}>{item}</button>)}
        </nav>
        <p className="local-label">{new Date().toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })} · Sample workspace</p>
      </div></header>
      <main className="page" key={tab}>
        {tab === "Today" ? null
          : <header className="page-header">
            <div className="shift-briefing">
              <p className="kicker">{tab === "Activity" ? "Decisions and handoffs" : "Field guide"}</p>
              <h1>{tab}</h1>
              <p>{tab === "Activity" ? "See what was decided and what still needs a manager." : "A field guide for the dispensary floor."}</p>
            </div>
          </header>}
        {tab !== "Today" && <p className="feedback" ref={feedback} role="status" tabIndex={-1}>{status}</p>}
        {tab !== "Today" && error && <p className="error" role="alert">{error}</p>}
        {tab === "Today" && <div className="ledger">
          <div className="ledger-main">
            <Briefing brief={briefing} lastCheck={posture.lastSuccessfulRun?.checkedAt} delayed={posture.receiving === "delayed"}
              aside={<ReceivingCheck onCompared={addComparison} onImport={importCsv} openRequest={compareRequest} />} />
            <section className="primary ledger-record" aria-labelledby="task-title">
              <p className="record-marker" data-manager={pendingManager || undefined} aria-hidden="true">{active ? (pendingManager ? "With manager" : "Now") : ""}</p>
              <div className="ledger-record-body">
                <div className="review-heading">
                  <div key={active?.id} className="record-identity">
                    {active && <p className="eyebrow">{active.sample ? "Sample package" : "Imported record"}</p>}
                    <h2 id="task-title" tabIndex={-1} ref={editor} aria-describedby={status ? "review-feedback" : undefined}>{active ? `${active.record} · ${activeIssue?.label.toLowerCase()}` : "You’re caught up"}</h2>
                  </div>
                  <a className="queue-link" href="#work-queue">View queue</a>
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
                      <details className="review-options" key={active.id}>
                        <summary>More options</summary>
                        <div className="review-options-body">
                          {!editing && primaryAction !== "evidence" && <button onClick={openEvidence}>{evidenceAction}</button>}
                          <button onClick={() => decide(active, "Dismissed")}>Not an issue</button>
                          {!needsRationale && <DecisionNote note={draft.note} onChange={(value) => updateDraft("note", value)} />}
                        </div>
                      </details>
                    </div>
                    {following && <button className="next-record" onClick={() => openTask(following)}>Next record <span className="next-id">{following.record}</span></button>}
                  </div>
                </> : <div className="completion">
                  <p>{manager.length ? "Your checks are done. The next shift can see what still needs a manager." : "Everything in the queue has been checked. Your decisions are saved in Activity."}</p>
                  <button className="manual-evidence" onClick={() => setTab("Activity")}>{manager.length ? "Open shift handoff" : "See what was checked"}</button>
                </div>}
                <p className="feedback review-feedback" id="review-feedback" role="status">{status}</p>
              </div>
            </section>
            <Conversation context={askContext} chips={briefing.chips} onAction={onAsk} />
          </div>
          <aside className="ledger-side" aria-label="Today at a glance">
            <ReceivingMonitor posture={posture} open={queue.length} focusSeries={focusSeries} onFocusSeries={setFocusSeries} onToggleDelay={toggleDelay} />
            <section className="ledger-queue" id="work-queue" tabIndex={-1} aria-labelledby="queue-title">
              <div className="queue-head">
                <h2 id="queue-title" className="kicker">Needs you · <span className="count" key={queue.length}>{queue.length}</span></h2>
                {queue.length > 1 && <span>Disagreements first</span>}
              </div>
              {ordered.length ? <ul>{ordered.map(({ task, issue }) => queueRow(task, issue.kind, issue.label))}</ul>
                : <p className="empty">Nothing needs you right now.</p>}
              {manager.length > 0 && <>
                <div className="queue-head"><h3 className="kicker">With a manager · {manager.length}</h3></div>
                <ul>{manager.map((task) => queueRow(task, "manager", "Left for a manager"))}</ul>
              </>}
              {doneToday.length > 0 && <p className="done-line">
                <span className="kicker">Done today · {doneToday.length}</span>
                <span>{doneToday.map(({ id, decision }) => `${id} ${decision === "Approved" ? "recorded" : "not an issue"}`).join(", ")}</span>
                <button className="text-link" onClick={() => setTab("Activity")}>Activity</button>
              </p>}
            </section>
          </aside>
        </div>}
        {tab === "Activity" && <section className="panel handoff" aria-labelledby="handoff-title">
          <div className="handoff-header">
            <div><h2 id="handoff-title">Shift handoff</h2><p>Give the next person the record, the gap, and the source.</p></div>
            {handoff.length > 0 && <button className="manual-evidence" onClick={() => void copyHandoff()}>Copy handoff</button>}
          </div>
          <p className="handoff-status" role="status">{handoffStatus}</p>
          {handoff.length ? <ul>{handoff.map(({ task, summary, text }) => <li className="handoff-record" key={task.id}>
            <strong>{task.record}</strong><p>{summary}</p>
            <details><summary>View handoff text</summary><pre>{text}</pre></details>
            <button className="manual-evidence" onClick={() => openTask(task)}>Open {task.record}</button>
          </li>)}</ul> : <p className="empty">Nothing waiting for a manager.</p>}
        </section>}
        {tab === "Activity" && <section className="panel"><h2>Decision history</h2>
          {workspace.history.length ? <ul>{workspace.history.map((entry) => (
            <li className="activity-row" key={entry.id}>
              <div><strong>{entry.task.record} · {entry.decision === "Approved" ? "Issue confirmed" : entry.decision === "Manager review requested" ? "Needs a manager" : entry.decision === "Dismissed" ? "Not an issue" : entry.decision}</strong><small><time dateTime={entry.at}>{new Date(entry.at).toLocaleString()}</time> · {entry.task.source}</small>
                {(entry.evidence.reference || entry.comparedSource) && <details>
                  <summary>Evidence reviewed</summary>
                  {entry.comparedSource && entry.comparedSource.reference !== entry.evidence.reference &&
                    <><p>{entry.comparedSource.reference}</p><p>{entry.comparedSource.excerpt}</p></>}
                  {entry.evidence.reference && <><p>{entry.evidence.reference}</p><p>{entry.evidence.excerpt}</p></>}
                  {entry.evidence.note && <p>{entry.evidence.note}</p>}
                </details>}
              </div>
              {latest.get(entry.task.id) === entry.decision && workspace.history.find((item) => item.task.id === entry.task.id)?.id === entry.id &&
                (entry.decision === "Approved" || entry.decision === "Dismissed") &&
                <button onClick={() => { decide(entry.task, "Reopened"); }}>Reopen <span className="sr-only">{entry.task.record}</span></button>}
            </li>
          ))}</ul> : <p className="empty">No decisions recorded yet.</p>}
        </section>}
        {tab === "Learn" && <section className="panel field-guide" aria-labelledby="guide-title">
          <h2 id="guide-title">From receiving to the shelf</h2>
          <div className="guide-grid">
            <article><h3>Lot or batch number</h3><p>The identifier that helps you trace a product to the group it came from. Compare what’s on the label with what’s in your records.</p></article>
            <article><h3>Receiving log</h3><p>The record of what showed up and what staff saw when it arrived. It gives the next person a place to start when inventory looks wrong.</p></article>
            <article><h3>Shift handoff</h3><p>Leave the package ID, what disagrees, and where to check next. Keep the original source with the note.</p></article>
          </div>
        </section>}
        {tab === "Learn" && <section className="panel learn">
          <p>Effective dates and license applicability have yet to be verified. Use the issuing authority’s current materials to confirm what applies.</p>
          <label>Search references<input type="search" className="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <ul>{references.filter((item) => `${item.title} ${item.jurisdiction}`.toLowerCase().includes(query.trim().toLowerCase())).map((item) => (
            <li key={item.url}><a className="queue-row" href={item.url}><span><strong>{item.title}</strong><small>{item.jurisdiction} · Reference</small></span><span className="chevron" aria-hidden="true">›</span></a></li>
          ))}</ul>
        </section>}
      </main>
    </div>
  );
}
