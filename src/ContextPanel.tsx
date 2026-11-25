import type { ReactNode } from "react";
import { panelLabel, type PanelView } from "./panel";
import { issueOf, type Series } from "./ask";
import { sampleComparison, type LotCheck } from "./comparison";
import { lotValueLabel, taskReference, type Decision, type Entry, type Task } from "./workspace";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

// The right-hand panel on Today. It shows whatever supports the current turn,
// keeps the "needs you" count visible when collapsed, and never moves on its own.
export function ContextPanel({ view, collapsed, needYou, fresh = 0, lastCheck, onBack, onToggle, children }: {
  view: PanelView;
  fresh?: number;
  collapsed: boolean;
  needYou: number;
  lastCheck?: string;
  onBack: () => void;
  onToggle: () => void;
  children: ReactNode;
}) {
  const label = panelLabel(view);
  return <aside className="ledger-side context-panel" data-collapsed={collapsed || undefined} aria-label="Context">
    <div className="panel-bar">
      <button type="button" className="panel-summary" aria-expanded={!collapsed} aria-controls="context-body" onClick={onToggle}>
        <span className="panel-count" data-open={needYou > 0 || undefined}>{needYou}</span>
        <span className="panel-count-label">need you</span>
        {fresh > 0 && <span className="panel-new">· {fresh} new</span>}
        {lastCheck && <span className="panel-last">Last check {clock(lastCheck)}</span>}
      </button>
      <div className="panel-head">
        <p className="kicker" aria-live="polite">Showing · {label}</p>
        <span className="panel-actions">
          {view.kind !== "queue" && <button type="button" className="text-link" onClick={onBack}>Back to queue</button>}
          <button type="button" className="tool panel-toggle" aria-expanded={!collapsed} aria-controls="context-body" onClick={onToggle}
            aria-label={collapsed ? "Show the panel" : "Hide the panel"}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><path d="M14.5 4.5v15" />
            </svg>
          </button>
        </span>
      </div>
    </div>
    {!collapsed && <div className="panel-body" id="context-body" key={JSON.stringify(view)}>{children}</div>}
  </aside>;
}

const decisionText: Record<Decision, string> = {
  Approved: "Issue recorded", Dismissed: "Marked not an issue", "Manager review requested": "Left for a manager", Reopened: "Reopened",
};

export function PackageTrail({ id, task, row, queued, decision, entries, lastCheck, isActive, onOpen }: {
  id: string;
  task?: Task;
  row?: LotCheck;
  queued: boolean;
  decision?: Decision;
  entries: Entry[];
  lastCheck?: string;
  isActive: boolean;
  onOpen: (task: Task) => void;
}) {
  const inventory = task?.lotComparison ? task.lotComparison.inventory : row?.inventory ?? null;
  const receiving = task?.lotComparison ? task.lotComparison.receiving : row?.receiving ?? null;
  const status = queued ? "Needs you"
    : decision === "Manager review requested" ? "With a manager"
      : decision === "Approved" ? "Issue recorded" : decision === "Dismissed" ? "Not an issue"
        : row?.state === "match" ? "Matched" : "Not in today’s records";
  const checked = lastCheck ? clock(lastCheck) : "latest";
  const flagged = task?.sample ? `Flagged on the ${checked} check` : task ? "Added from an imported file" : row ? `Compared on the ${checked} check` : "";
  const issue = task ? issueOf(task, sampleComparison) : undefined;
  return <section className="package-trail" aria-labelledby="trail-title">
    <div className="trail-head">
      <h2 id="trail-title" className="queue-id">{id}</h2>
      <span className="trail-status" data-state={queued ? "open" : undefined}>{status}</span>
    </div>
    {issue && <p className="trail-issue">{issue.label}</p>}
    {(row || task) && <dl className="trail-sources">
      <div><dt>Inventory record</dt><dd>{lotValueLabel(inventory)}</dd><dd className="trail-ref">{task ? taskReference(task) : "Sample inventory export"}</dd></div>
      <div><dt>Receiving record</dt><dd>{lotValueLabel(receiving)}</dd><dd className="trail-ref">{task?.lotComparison?.receivingFile ?? "Sample receiving log"}</dd></div>
    </dl>}
    <h3 className="kicker">Trail</h3>
    <ol className="trail">
      {flagged && <li><span className="queue-mark" aria-hidden="true" /><span>{flagged}</span></li>}
      {[...entries].reverse().map((entry) => <li key={entry.id}><span className="queue-mark" aria-hidden="true" />
        <span>{decisionText[entry.decision]}<small><time dateTime={entry.at}>{clock(entry.at)}</time>{entry.evidence.reference ? ` · ${entry.evidence.reference}` : ""}</small></span></li>)}
      {!flagged && !entries.length && <li><span className="queue-mark" aria-hidden="true" /><span>No activity today.</span></li>}
    </ol>
    {task && (isActive ? <p className="trail-note">You’re on this record.</p>
      : <button type="button" className="ledger-button" data-variant="line" onClick={() => onOpen(task)}>Open {id}</button>)}
  </section>;
}

export function SeriesList({ series, rows, open, latest, matched, activeId, onOpen }: {
  series: Series;
  rows: LotCheck[];
  open: Task[];
  latest: Map<string, Decision>;
  matched: number;
  activeId?: string;
  onOpen: (task: Task) => void;
}) {
  if (series === "matched") return <p className="trail-note">{matched} packages matched today. Matching records stay quiet, so there’s nothing to check.</p>;
  const shown = rows.filter(({ state }) => state === series);
  return <section className="ledger-queue" aria-label={series === "missing" ? "Packages with a gap" : "Packages where the records disagree"}>
    <div className="queue-head"><h3 className="kicker">{series === "missing" ? "Gaps" : "Disagreements"} · {shown.length}</h3></div>
    {shown.length ? <ul>{shown.map((row) => {
      const task = open.find((item) => item.id === row.packageId);
      const label = task ? issueOf(task, rows).label : latest.get(row.packageId) === "Dismissed" ? "Not an issue" : "Decided";
      return <li key={row.packageId}>{task
        ? <button className="queue-row" data-kind={series} aria-current={activeId === task.id ? "true" : undefined} onClick={() => onOpen(task)}>
          <span className="queue-mark" aria-hidden="true" /><span className="queue-id">{task.record}</span><span className="queue-issue">{label}</span><span className="queue-time">Open</span>
        </button>
        : <span className="queue-row" data-kind={series}><span className="queue-mark" aria-hidden="true" /><span className="queue-id">{row.packageId}</span><span className="queue-issue">{label}</span><span /></span>}</li>;
    })}</ul> : <p className="empty">None in the latest check.</p>}
  </section>;
}

export function HandoffPanel({ handoff, status, onCopy, onOpen }: {
  handoff: { task: Task; summary: string }[];
  status: string;
  onCopy: () => void;
  onOpen: (task: Task) => void;
}) {
  return <section className="ledger-queue" aria-labelledby="panel-handoff-title">
    <div className="queue-head">
      <h2 id="panel-handoff-title" className="kicker">Shift handoff · {handoff.length}</h2>
      {handoff.length > 0 && <button type="button" className="ledger-button" data-variant="ink" onClick={onCopy}>Copy handoff</button>}
    </div>
    <p className="handoff-status" role="status">{status}</p>
    {handoff.length ? <ul className="handoff-notes">{handoff.map(({ task, summary }) => <li key={task.id}>
      <span className="queue-mark" aria-hidden="true" />
      <div><p className="queue-id">{task.record}</p><p>{summary}</p>
        <button type="button" className="ledger-button" data-variant="line" onClick={() => onOpen(task)}>Open {task.record}</button></div>
    </li>)}</ul> : <p className="empty">Nothing is waiting on a manager.</p>}
  </section>;
}
