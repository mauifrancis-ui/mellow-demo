import { useState, type CSSProperties } from "react";
import type { Decision, Entry, Task } from "./workspace";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const count = (n: number) => words[n] ?? String(n);
const list = (ids: string[]) => ids.length < 3 ? ids.join(" and ") : `${ids.slice(0, -1).join(", ")} and ${ids.at(-1)}`;

const decisionMeta: Record<Decision, { label: string; mark: string }> = {
  Approved: { label: "Issue recorded", mark: "recorded" },
  Dismissed: { label: "Not an issue", mark: "dismissed" },
  "Manager review requested": { label: "Left for a manager", mark: "manager" },
  Reopened: { label: "Reopened", mark: "reopened" },
};
const filters: { key: "all" | Decision; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Approved", label: "Issues recorded" },
  { key: "Dismissed", label: "Not an issue" },
  { key: "Manager review requested", label: "With a manager" },
  { key: "Reopened", label: "Reopened" },
];

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

export function ActivityPage({ history, latest, handoff, open, flaggedToday, handoffStatus, notes = [], onReopen, onOpen, onCopy, onShare }: {
  onShare?: () => void;
  history: Entry[];
  notes?: { id: string; text: string; trigger: string; at: string; dismissedAt?: string }[];
  latest: Map<string, Decision>;
  handoff: { task: Task; summary: string; text: string }[];
  open: number;
  flaggedToday: number;
  handoffStatus: string;
  onReopen: (task: Task) => void;
  onOpen: (task: Task) => void;
  onCopy: () => void;
}) {
  const [filter, setFilter] = useState<"all" | Decision>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const todayKey = new Date().toDateString();
  const today = history.filter((entry) => new Date(entry.at).toDateString() === todayKey && entry.decision !== "Reopened");
  const dismissed = [...new Set(today.filter((entry) => entry.decision === "Dismissed" && latest.get(entry.task.id) === "Dismissed").map((entry) => entry.task.record))];
  const recorded = today.filter((entry) => entry.decision === "Approved" && latest.get(entry.task.id) === "Approved").length;
  const managerIds = handoff.map(({ task }) => task.record);
  const headline = today.length
    ? `${count(today.length)} decision${today.length === 1 ? "" : "s"} today.${managerIds.length ? ` ${count(managerIds.length)} ${managerIds.length === 1 ? "is" : "are"} waiting on a manager.` : ""}`
    : "No decisions yet today.";
  const note = [
    managerIds.length && `${list(managerIds)} ${managerIds.length === 1 ? "is" : "are"} with a manager. The handoff is ready to copy for the next shift.`,
    recorded && `${count(recorded)} issue${recorded === 1 ? " was" : "s were"} recorded with evidence.`,
    dismissed.length && `You marked ${list(dismissed)} not an issue. You can reopen ${dismissed.length === 1 ? "it" : "them"} if that changes.`,
  ].filter(Boolean).join(" ") || "When you decide on a record, it lands here with the evidence you checked.";
  const shown = history.filter((entry) => filter === "all" || entry.decision === filter);
  const days = [...new Set(shown.map((entry) => dayLabel(entry.at)))];

  return <div className="ledger">
    <div className="ledger-main">
      <header className="briefing" aria-labelledby="activity-title">
        <p className="kicker">Activity · {new Date().toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}</p>
        <h1 id="activity-title">{headline}</h1>
        <div className="mellow-says">
          <span className="kicker" aria-hidden="true">Mellow</span>
          <p className="mellow-voice" key={note}><span className="sr-only">Mellow says: </span>{note}</p>
        </div>
      </header>

      <section className="decision-ledger" aria-label="Decision history">
        <div className="reply-chips" role="group" aria-label="Filter decisions">
          {filters.map(({ key, label }) => {
            const total = key === "all" ? history.length : history.filter((entry) => entry.decision === key).length;
            return <button key={key} type="button" className="chip" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label} · {total}</button>;
          })}
        </div>
        {days.length === 0 && <p className="ledger-empty">{history.length ? "Nothing matches this filter." : "No decisions recorded yet."}</p>}
        {days.map((day) => <div key={day} className="ledger-day">
          <div className="queue-head"><h2 className="kicker">{day}</h2><span>Time · Package · Decision · Evidence</span></div>
          <ul>
            {shown.filter((entry) => dayLabel(entry.at) === day).map((entry, index) => {
              const meta = decisionMeta[entry.decision];
              const newest = history.find((item) => item.task.id === entry.task.id)?.id === entry.id;
              const canReopen = newest && latest.get(entry.task.id) === entry.decision && (entry.decision === "Approved" || entry.decision === "Dismissed");
              const withManager = newest && entry.decision === "Manager review requested" && latest.get(entry.task.id) === entry.decision;
              const reference = entry.evidence.reference || entry.comparedSource?.reference;
              const hasDetail = Boolean(entry.evidence.reference || entry.comparedSource || entry.evidence.note);
              const open = expanded === entry.id;
              return <li key={entry.id}>
                <div className="decision-row" data-mark={meta.mark} style={{ "--i": index } as CSSProperties}>
                  <time dateTime={entry.at}>{clock(entry.at)}</time>
                  <span className="queue-mark" aria-hidden="true" />
                  <span className="queue-id">{entry.task.record}</span>
                  <span>{meta.label}</span>
                  {hasDetail ? <button type="button" className="evidence-toggle" aria-expanded={open} onClick={() => setExpanded(open ? null : entry.id)}>{reference ?? "Note"}</button>
                    : <span className="evidence-none">No evidence added</span>}
                  <span className="decision-action">
                    {canReopen && <button type="button" className="chip" onClick={() => onReopen(entry.task)}>Reopen<span className="sr-only"> {entry.task.record}</span></button>}
                    {withManager && <button type="button" className="chip" onClick={() => onOpen(entry.task)}>Open<span className="sr-only"> {entry.task.record}</span></button>}
                  </span>
                </div>
                {open && <div className="evidence-detail">
                  <p className="kicker">Evidence reviewed · {entry.task.record}</p>
                  {entry.comparedSource && <p className="evidence-line">{entry.comparedSource.reference} · {entry.comparedSource.excerpt}</p>}
                  {entry.evidence.reference && entry.evidence.reference !== entry.comparedSource?.reference && <p className="evidence-line">{entry.evidence.reference} · {entry.evidence.excerpt}</p>}
                  {entry.evidence.note && <p>Note: “{entry.evidence.note}”</p>}
                </div>}
              </li>;
            })}
          </ul>
        </div>)}
      </section>
    </div>

    <aside className="ledger-side" aria-label="Today at a glance">
      {onShare && <section className="share-block">
        <p className="kicker">Take it to whoever signs off</p>
        <p>A one-page summary of what was compared and what differed. No verdicts.</p>
        <button type="button" className="ledger-button" data-variant="line" onClick={onShare}>Share these findings</button>
      </section>}
      {notes.length > 0 && <section className="mellow-events" aria-labelledby="notes-title">
        <h2 id="notes-title" className="kicker">Mellow notes today · {notes.length}</h2>
        <p className="mellow-events-help">What Mellow said first, and what was dismissed. These are not decisions.</p>
        <ul>{notes.map((note) => <li key={note.id}>
          <time dateTime={note.at}>{new Date(note.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
          <span><span className="mellow-voice">{note.text}</span><small>{note.trigger}{note.dismissedAt ? ` · Dismissed ${new Date(note.dismissedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : " · Shown"}</small></span>
        </li>)}</ul>
      </section>}
      <section aria-labelledby="numbers-title">
        <h2 id="numbers-title" className="kicker">Today in numbers</h2>
        <dl className="day-numbers">
          <div><dt>flagged</dt><dd>{flaggedToday}</dd></div>
          <div><dt>decided</dt><dd>{today.length}</dd></div>
          <div data-open={open > 0 || undefined}><dt>still open</dt><dd>{open}</dd></div>
        </dl>
      </section>
      <section className="ledger-queue" aria-labelledby="handoff-title">
        <div className="queue-head">
          <h2 id="handoff-title" className="kicker">Shift handoff · {handoff.length}</h2>
          {handoff.length > 0 && <button type="button" className="ledger-button" data-variant="ink" onClick={onCopy}>Copy handoff</button>}
        </div>
        <p className="handoff-status" role="status">{handoffStatus}</p>
        {handoff.length ? <ul className="handoff-notes">{handoff.map(({ task, summary, text }) => <li key={task.id}>
          <span className="queue-mark" aria-hidden="true" />
          <div>
            <p className="queue-id">{task.record}</p>
            <p>{summary}</p>
            <details><summary>Handoff text</summary><pre>{text}</pre></details>
            <button type="button" className="ledger-button" data-variant="line" onClick={() => onOpen(task)}>Open {task.record}</button>
          </div>
        </li>)}</ul> : <p className="empty">Nothing is waiting on a manager.</p>}
      </section>
    </aside>
  </div>;
}
