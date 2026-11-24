import { useRef, useState, type ChangeEvent } from "react";

import {
  emptyDraft, hasEvidence, initial, inspectRow, latestDecisions, nextRecord, parseCsv, prepareReview, readWorkspace, recordDecision, shiftHandoff, storageKey, workQueue,
  type Decision, type Draft, type Task, type Workspace,
} from "./workspace";

const palettes = [
  { id: "solar", label: "Solar olive" },
  { id: "indigo", label: "Indigo ember" },
  { id: "ochre", label: "Ochre clay" },
] as const;
type Palette = typeof palettes[number]["id"];
const paletteKey = "mellow.preview.palette";

function initialPalette(): Palette {
  try {
    return palettes.find(({ id }) => id === localStorage.getItem(paletteKey))?.id ?? "indigo";
  } catch {
    return "indigo";
  }
}

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
      <summary>Decision note <span>(optional)</span></summary>
      <textarea aria-label="Decision note" value={note} onChange={(event) => onChange(event.target.value)} maxLength={1000} />
    </details>
  );
}

function SourceComparison({ task, review }: { task: Task; review: ReturnType<typeof prepareReview> }) {
  return <section className="record-insight comparison" aria-label="What the records say">
    <div className="comparison-heading">
      <h3>What the records say</h3>
      <span className="source-state" data-state={review.state}>{review.state}</span>
    </div>
    <div className="comparison-grid">
      <div className="comparison-source">
        <span>{task.sample ? "Inventory record" : "Imported record"}</span>
        <strong>{task.observation}</strong>
        <small>{task.source} · Record {task.line}</small>
      </div>
      <div className="comparison-source">
        <span>{review.source ? "Receiving log" : "Second source"}</span>
        <strong>{review.source ? review.source.excerpt : "Nothing linked yet"}</strong>
        {review.source && <small>{review.source.reference}</small>}
      </div>
    </div>
  </section>;
}

export default function App() {
  const [palette, setPalette] = useState(initialPalette);
  const [tab, setTab] = useState<Tab>("Today");
  const [workspace, setWorkspace] = useState(() => {
    try { return readWorkspace(); } catch { return initial; }
  });
  const [activeId, setActiveId] = useState("");
  const [editRecordId, setEditRecordId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [handoffStatus, setHandoffStatus] = useState("");
  const [query, setQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const editor = useRef<HTMLHeadingElement>(null);
  const evidenceInput = useRef<HTMLInputElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const latest = latestDecisions(workspace.history);
  const handoff = shiftHandoff(workspace);
  const manager = handoff.map(({ task }) => task);
  const queue = workQueue(workspace);
  const reviewedCount = workspace.tasks.length - queue.length - manager.length;
  const active = [...queue, ...manager].find((task) => task.id === activeId) ?? queue[0];
  const following = active && nextRecord(workspace.tasks, queue, active.id);
  const draft = active ? workspace.drafts[active.id] ?? emptyDraft : emptyDraft;
  const review = active ? prepareReview(active) : undefined;
  const hasManualEvidence = Boolean(draft.reference || draft.excerpt);
  const editing = active?.id === editRecordId || hasManualEvidence;
  const preparedEvidence = !editing ? review?.evidence : undefined;
  const needsRationale = editing && Boolean(review?.source && !review.evidence);
  const canApprove = hasEvidence(preparedEvidence ?? draft) && (!needsRationale || Boolean(draft.note.trim()));
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

  async function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
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
      if (save((current) => ({ ...current, tasks: [...current.tasks, ...tasks] }))) {
        if (tasks[0]) setActiveId(tasks[0].id);
        setStatus(`Read ${rows.length} CSV records. Added ${tasks.length} observations to review.`);
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Couldn’t read this file.");
    } finally {
      setImporting(false);
    }
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

  function openTask(task: Task) {
    setActiveId(task.id);
    setEditRecordId("");
    setTab("Today");
    focusRecord();
  }

  function taskRows(tasks: Task[]) {
    return tasks.map((task) => (
      <li key={task.id}>
        <button className="queue-row" aria-current={tab === "Today" && active?.id === task.id ? "true" : undefined} onClick={() => openTask(task)}>
          <span><strong>{task.record}</strong><small>{latest.get(task.id) === "Manager review requested" ? "Needs a manager" : prepareReview(task).state}</small></span>
          <span className="chevron" aria-hidden="true">›</span>
        </button>
      </li>
    ));
  }

  const managerPanel = <section className="panel manager-panel" aria-labelledby="manager-title">
    <h2 id="manager-title">Needs a manager <span>{manager.length}</span></h2>
    {manager.length ? <ul>{taskRows(manager)}</ul> : <p className="empty">Nothing waiting for a manager.</p>}
  </section>;

  async function copyHandoff() {
    const content = ["Mellow shift handoff · Sample workspace", ...handoff.map(({ text }) => text)].join("\n\n");
    try {
      await navigator.clipboard.writeText(content);
      setHandoffStatus("Handoff copied.");
    } catch {
      setHandoffStatus("Couldn’t copy. Select the handoff text below.");
    }
  }

  function changePalette(value: Palette) {
    setPalette(value);
    try { localStorage.setItem(paletteKey, value); } catch { /* Keep the current choice in memory. */ }
  }

  return (
    <div className="shell" data-palette={palette}>
      <header className="masthead"><div className="masthead-inner">
        <div className="wordmark">mellow<span aria-hidden="true">.</span></div>
        <nav aria-label="Main navigation">
          {tabs.map((item) => <button key={item} aria-current={tab === item ? "page" : undefined} onClick={() => setTab(item)}>{item}</button>)}
        </nav>
        <div className="preview-settings">
          <span className="local-label">Sample workspace</span>
          <label className="palette-picker">
            <span>Palette</span>
            <select value={palette} onChange={(event) => changePalette(event.target.value as Palette)}>
              {palettes.map(({ id, label }) => <option value={id} key={id}>{label}</option>)}
            </select>
          </label>
        </div>
      </div></header>
      <main className="page">
        <header className={tab === "Today" ? "shift-header" : "page-header"}>
          <div><h1>{tab === "Today" ? "Your shift, in focus." : tab}</h1><p>{tab === "Today" ? "See where your records disagree and leave the next shift a clear handoff." : tab === "Activity" ? "See what was decided and what still needs a manager." : "A field guide for the dispensary floor."}</p></div>
          {tab === "Today" && <>
            <dl className="shift-counts">
              <div><dt>To check</dt><dd>{queue.length}</dd></div>
              <div><dt>Needs a manager</dt><dd>{manager.length}</dd></div>
              <div><dt>Checked</dt><dd>{reviewedCount}</dd></div>
            </dl>
          </>}
        </header>
        {tab !== "Today" && <p className="feedback" ref={feedback} role="status" tabIndex={-1}>{status}</p>}
        {tab !== "Today" && error && <p className="error" role="alert">{error}</p>}
        {tab === "Today" && <div className="review-layout">
          <section className="primary" aria-labelledby="task-title">
            <div className="review-heading">
              <div key={active?.id} className="record-identity">
                <p className="eyebrow">{active ? (active.sample ? "Sample package" : "Imported record") : "Shift review"}</p>
                <h2 id="task-title" tabIndex={-1} ref={editor} aria-describedby={status ? "review-feedback" : undefined}>{active?.record ?? "You’re caught up"}</h2>
              </div>
              <a className="queue-link" href="#work-queue">View queue</a>
            </div>
            <p className="feedback review-feedback" id="review-feedback" role="status">{status}</p>
            {error && <p className="error review-feedback" role="alert">{error}</p>}
            {active && review ? <>
              <SourceComparison key={active.id} task={active} review={review} />
              <div className="evidence">
                <div className="evidence-header">
                  <h3>What to do next</h3>
                  {hasDraft && <span className="draft-label">{error ? "Draft on this page" : "Draft on this device"}</span>}
                </div>
                <p className="review-summary">{review.summary}</p>
                <p id="evidence-help" className="evidence-status">{review.nextStep}</p>
                {editing ? <div className="evidence-fields">
                  <label>Evidence source<input ref={evidenceInput} value={draft.reference} onChange={(event) => updateDraft("reference", event.target.value)} maxLength={500} /></label>
                  <label>Supporting excerpt<textarea rows={2} value={draft.excerpt} onChange={(event) => updateDraft("excerpt", event.target.value)} maxLength={2000} /></label>
                  {needsRationale && <label>How does this evidence resolve the conflict?<textarea rows={2} value={draft.note} onChange={(event) => updateDraft("note", event.target.value)} maxLength={1000} /></label>}
                </div> : <button className="manual-evidence" onClick={() => {
                  setEditRecordId(active.id);
                  requestAnimationFrame(() => evidenceInput.current?.focus());
                }}>{review.source ? "Add another source" : "Add evidence"}</button>}
                {!needsRationale && <DecisionNote key={active.id} note={draft.note} onChange={(value) => updateDraft("note", value)} />}
              </div>
              <div className="decision-footer">
                <div className="actions">
                  {(editing || canApprove) && <button className="solid" aria-describedby="evidence-help" disabled={!canApprove} onClick={() => decide(active, "Approved")}>Confirm issue</button>}
                  <button className={!canApprove && !editing ? "solid" : ""} disabled={latest.get(active.id) === "Manager review requested"} onClick={() => decide(active, "Manager review requested")}>Leave for manager</button>
                  <button className="quiet" onClick={() => decide(active, "Dismissed")}>Not an issue</button>
                </div>
                {following && <button className="next-record" onClick={() => openTask(following)}>Next record <span className="next-id">{following.record}</span></button>}
              </div>
            </> : <div className="completion">
              <p>{manager.length ? "Your checks are done. The next shift can see what still needs a manager." : "Everything in the queue has been checked. Your decisions are saved in Activity."}</p>
              <button className="manual-evidence" onClick={() => setTab("Activity")}>{manager.length ? "Open shift handoff" : "See what was checked"}</button>
            </div>}
          </section>
          <aside className="queue-rail" aria-label="Record queues">
            <section className="panel" id="work-queue" tabIndex={-1} aria-labelledby="queue-title">
              <h2 id="queue-title">To check <span>{queue.length}</span></h2>
              {queue.length ? <ul>{taskRows(queue)}</ul> : <p className="empty">No records awaiting review.</p>}
            </section>
            {managerPanel}
            <label className="upload import-queue">Import demo CSV<input type="file" accept=".csv,text/csv" onChange={importCsv} disabled={importing} /></label>
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
