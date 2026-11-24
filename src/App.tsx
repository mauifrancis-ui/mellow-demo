import { useRef, useState, type ChangeEvent } from "react";

import {
  emptyDraft, hasEvidence, initial, inspectRow, latestDecisions, nextRecord, parseCsv, readWorkspace, recordDecision, storageKey, workQueue,
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

function RecordContext({ task, pending }: { task: Task; pending: boolean }) {
  return (
    <div className="record-insight">
      <div className="insight-label">{task.sample ? "Sample observation" : "CSV observation"}</div>
      <strong>{task.observation}</strong>
      <p>{task.source} · Record {task.line}</p>
      {pending && <p className="pending-review">Manager review pending</p>}
    </div>
  );
}

export default function App() {
  const [palette, setPalette] = useState(initialPalette);
  const [tab, setTab] = useState<Tab>("Today");
  const [workspace, setWorkspace] = useState(() => {
    try { return readWorkspace(); } catch { return initial; }
  });
  const [activeId, setActiveId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const editor = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const latest = latestDecisions(workspace.history);
  const manager = workspace.tasks.filter((task) => latest.get(task.id) === "Manager review requested");
  const queue = workQueue(workspace);
  const active = [...queue, ...manager].find((task) => task.id === activeId) ?? queue[0];
  const following = active && nextRecord(workspace.tasks, queue, active.id);
  const draft = active ? workspace.drafts[active.id] ?? emptyDraft : emptyDraft;
  const canApprove = hasEvidence(draft);
  const hasDraft = Object.values(draft).some((value) => value.trim());
  const evidenceNeeded = !draft.reference.trim() && !draft.excerpt.trim()
    ? "Approval needs an evidence source and an excerpt."
    : !draft.reference.trim() ? "Approval needs an evidence source."
      : "Approval needs a supporting excerpt.";

  function save(update: (current: Workspace) => Workspace) {
    try {
      const next = update(readWorkspace());
      localStorage.setItem(storageKey, JSON.stringify(next));
      setWorkspace(next);
      setError("");
      return true;
    } catch (failure) {
      setError(failure instanceof Error && failure.message === "Supporting evidence is required."
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
      const evidence = workspace.drafts[task.id] ?? current.drafts[task.id] ?? emptyDraft;
      const next = recordDecision(current, task, decision, evidence);
      changed = next !== current;
      if (changed && decision !== "Reopened") nextId = nextRecord(next.tasks, workQueue(next), task.id)?.id ?? "";
      return next;
    });
    if (saved && changed) {
      setStatus(`${decision}: ${task.record}. Saved on this device.`);
      if (decision === "Reopened") {
        requestAnimationFrame(() => feedback.current?.focus());
      } else {
        setActiveId(nextId);
        focusRecord();
      }
    }
  }

  function openTask(task: Task) {
    setActiveId(task.id);
    setTab("Today");
    focusRecord();
  }

  function taskRows(tasks: Task[]) {
    return tasks.map((task) => (
      <li key={task.id}>
        <button className="queue-row" aria-current={tab === "Today" && active?.id === task.id ? "true" : undefined} onClick={() => openTask(task)}>
          <span><strong>{task.record}</strong><small>{task.observation}</small></span>
          <span className="chevron" aria-hidden="true">›</span>
        </button>
      </li>
    ));
  }

  const managerPanel = <section className="panel manager-panel" aria-labelledby="manager-title">
    <h2 id="manager-title">Unresolved manager reviews <span>{manager.length}</span></h2>
    {manager.length ? <ul>{taskRows(manager)}</ul> : <p className="empty">No manager reviews pending.</p>}
  </section>;

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
        <header className="page-header">
          <div><h1>{tab}</h1><p>{tab === "Today" ? (queue.length === 1 ? "One record to review." : `${queue.length} records to review.`) : tab === "Activity" ? "Review decisions saved on this device." : "Find official starting points for your research."}</p></div>
          {tab === "Today" && <label className="upload">Import demo CSV<input type="file" accept=".csv,text/csv" onChange={importCsv} disabled={importing} /></label>}
        </header>
        {tab !== "Today" && <p className="feedback" ref={feedback} role="status" tabIndex={-1}>{status}</p>}
        {tab !== "Today" && error && <p className="error" role="alert">{error}</p>}
        {tab === "Today" && <div className="review-layout">
          <section className="primary" aria-labelledby="task-title">
            <div className="review-heading">
              <div key={active?.id} className="record-identity">
                <p className="eyebrow">{active ? "Record review" : "Work queue"}</p>
                <h2 id="task-title" tabIndex={-1} ref={editor} aria-describedby={status ? "review-feedback" : undefined}>{active?.record ?? "Queue clear"}</h2>
              </div>
              <a className="queue-link" href="#work-queue">View queue</a>
            </div>
            <p className="feedback review-feedback" id="review-feedback" role="status">{status}</p>
            {error && <p className="error review-feedback" role="alert">{error}</p>}
            {active ? <>
              <RecordContext key={active.id} task={active} pending={latest.get(active.id) === "Manager review requested"} />
              <div className="evidence">
                <div className="evidence-header">
                  <h3>Supporting evidence</h3>
                  {hasDraft && <span className="draft-label">{error ? "Draft on this page" : "Draft on this device"}</span>}
                </div>
                <p id="evidence-help" className="evidence-status" data-ready={canApprove}>{canApprove ? "Evidence added. Confirm it supports your decision." : evidenceNeeded}</p>
                <div className="evidence-fields">
                  <label>Evidence source<input value={draft.reference} onChange={(event) => updateDraft("reference", event.target.value)} maxLength={500} /></label>
                  <label>Supporting excerpt<textarea rows={2} value={draft.excerpt} onChange={(event) => updateDraft("excerpt", event.target.value)} maxLength={2000} /></label>
                </div>
                <DecisionNote key={active.id} note={draft.note} onChange={(value) => updateDraft("note", value)} />
              </div>
              <div className="decision-footer">
                <div className="actions">
                  <button className="solid" aria-describedby="evidence-help" disabled={!canApprove} onClick={() => decide(active, "Approved")}>Approve record</button>
                  <button disabled={latest.get(active.id) === "Manager review requested"} onClick={() => decide(active, "Manager review requested")}>Flag for manager</button>
                  <button className="quiet" onClick={() => decide(active, "Dismissed")}>Dismiss</button>
                </div>
                {following && <button className="next-record" onClick={() => openTask(following)}>Next record <span className="next-id">{following.record}</span></button>}
              </div>
            </> : <p className="completion">{manager.length ? "Pending manager reviews are still available in the queue." : "Import a CSV to add records, or reopen a decision from Activity."}</p>}
          </section>
          <aside className="queue-rail" aria-label="Record queues">
            <section className="panel" id="work-queue" tabIndex={-1} aria-labelledby="queue-title">
              <h2 id="queue-title">Work queue <span>{queue.length}</span></h2>
              {queue.length ? <ul>{taskRows(queue)}</ul> : <p className="empty">No records awaiting review.</p>}
            </section>
            {managerPanel}
          </aside>
        </div>}
        {tab === "Activity" && managerPanel}
        {tab === "Activity" && <section className="panel"><h2>Decision history</h2>
          {workspace.history.length ? <ul>{workspace.history.map((entry) => (
            <li className="activity-row" key={entry.id}>
              <div><strong>{entry.task.record} · {entry.decision}</strong><small><time dateTime={entry.at}>{new Date(entry.at).toLocaleString()}</time> · {entry.task.source}</small>
                {entry.evidence.reference && <details><summary>Supporting evidence</summary><p>{entry.evidence.reference}</p><p>{entry.evidence.excerpt}</p><p>{entry.evidence.note}</p></details>}
              </div>
              {latest.get(entry.task.id) === entry.decision && workspace.history.find((item) => item.task.id === entry.task.id)?.id === entry.id &&
                (entry.decision === "Approved" || entry.decision === "Dismissed") &&
                <button onClick={() => { decide(entry.task, "Reopened"); }}>Reopen <span className="sr-only">{entry.task.record}</span></button>}
            </li>
          ))}</ul> : <p className="empty">No decisions recorded yet.</p>}
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
