import { useEffect, useRef, useState } from "react";
import { controlLabel, controlScope, countLine, prepSummary, statusOf, type ControlResult } from "./controls";
import { texasHempRules } from "./rules-tx";
import { trailRows, type TrailNote } from "./trail";
import type { Entry } from "./workspace";

const ruleUrl = (id: string) => texasHempRules.find((rule) => rule.id === id)?.url ?? "";
const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const spell = (n: number) => words[n] ?? String(n);
const listIds = (ids: string[], limit = 8) => ids.length > limit ? `${ids.slice(0, limit).join(", ")} and ${ids.length - limit} more` : ids.join(", ");

/** Activity · Inspection prep (sprint 6, C2 and C3). Counts from your records, each opening into rule, evidence and packages. */
export function InspectionPrep({ results, onBinder, onOpenPackage }: {
  results: ControlResult[]; onBinder: () => void; onOpenPackage: (packageId: string) => void;
}) {
  const summary = prepSummary(results);
  return <section className="prep" aria-labelledby="prep-title">
    <p className="kicker">Inspection prep · {controlScope}</p>
    <h2 id="prep-title" className="prep-title" tabIndex={-1}>What an inspector may ask to see</h2>
    <p className="prep-lead">Mellow can count {spell(summary.counted)} of these from your records. The other {spell(summary.cantCheck)} it can’t check from these files, so they’re listed for you to have on hand.</p>
    <p className="prep-label">{controlLabel}</p>
    <ul className="prep-list">{results.map((result) => <li key={result.control.id} className="prep-item" data-checkable={result.checkable || undefined}>
      <details>
        <summary>
          <span className="prep-id">{result.control.id}</span>
          <span className="prep-name">{result.control.title}</span>
          <span className="prep-status">{statusOf(result)}</span>
          <span className="prep-counts">{result.checkable ? countLine(result) : result.control.where}</span>
        </summary>
        <div className="prep-body">
          <p><span className="kicker">Rule</span> <a href={ruleUrl(result.control.ruleId)} target="_blank" rel="noreferrer">{result.control.citation}<span className="sr-only"> (opens in a new tab)</span></a></p>
          <p><span className="kicker">Evidence</span> {result.control.evidence} · {result.control.where.toLowerCase()}</p>
          {result.control.note && <p className="prep-note">{result.control.note}</p>}
          {result.checkable && <>
            {result.disagree.length > 0 && <p><span className="kicker">Records disagree</span> {result.disagree.map((id) => <button key={id} type="button" className="text-link" onClick={() => onOpenPackage(id)}>{id}</button>)}</p>}
            {result.missing.length > 0 && <p><span className="kicker">Missing</span> {result.missing.slice(0, 12).map((id) => <button key={id} type="button" className="text-link" onClick={() => onOpenPackage(id)}>{id}</button>)}{result.missing.length > 12 ? ` and ${result.missing.length - 12} more` : ""}</p>}
            <p className="prep-note">On file for {listIds(result.onFile)}.</p>
          </>}
        </div>
      </details>
    </li>)}</ul>
    <button type="button" className="ledger-button" onClick={onBinder}>Make the inspection prep binder</button>
  </section>;
}

/** The binder (sprint 6, C4): opens from the trail, prints in the record mode. */
export function BinderDialog({ open, results, history, notes, workspaceName, onClose }: {
  open: boolean; results: ControlResult[]; history: Entry[]; notes: TrailNote[]; workspaceName: string; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [made] = useState(() => new Date());
  useEffect(() => {
    const node = dialog.current;
    if (open && node && !node.open) node.showModal();
    if (!open && node?.open) node.close();
  }, [open]);
  const counted = results.filter(({ checkable }) => checkable);
  const onHand = results.filter(({ checkable }) => !checkable);
  const rows = trailRows(history);
  const when = (iso: string) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return <dialog ref={dialog} className="findings-dialog binder-dialog" aria-labelledby="binder-title" onClose={onClose}>
    <article className="findings-sheet">
      <header className="findings-head">
        <span className="wordmark">mellow<span aria-hidden="true">.</span></span>
        <span className="kicker">{workspaceName} · {made.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
      </header>
      <h2 id="binder-title">Inspection prep binder</h2>
      <p className="findings-scope">{controlScope}</p>
      <p className="prep-label">{controlLabel}</p>

      <h3 className="binder-h">1 · What your records show</h3>
      <table className="findings-table binder-table">
        <thead><tr><th scope="col">Item</th><th scope="col">Rule</th><th scope="col">Your records</th></tr></thead>
        <tbody>{counted.map((result) => <tr key={result.control.id}>
          <th scope="row" data-label="Item">{result.control.id} · {result.control.title}</th>
          <td data-label="Rule">{result.control.citation}</td>
          <td data-label="Your records">{statusOf(result)} · {countLine(result)}{result.missing.length ? ` (${listIds(result.missing, 6)})` : ""}{result.disagree.length ? `; disagree: ${listIds(result.disagree, 6)}` : ""}</td>
        </tr>)}</tbody>
      </table>
      {counted.some(({ control }) => control.note) && <p className="prep-note">{counted.find(({ control }) => control.note)?.control.note}</p>}

      <h3 className="binder-h">2 · Have these on hand</h3>
      <p className="prep-note">Mellow can’t check these from your files.</p>
      <ul className="binder-onhand">{onHand.map((result) => <li key={result.control.id}>
        <strong>{result.control.id} · {result.control.evidence}</strong>
        <span>{result.control.citation} · {ruleUrl(result.control.ruleId)}</span>
      </li>)}</ul>

      <h3 className="binder-h">3 · Decisions recorded on this device</h3>
      {rows.length ? <ul className="findings-decisions">{rows.map((row) => <li key={`${row.at}-${row.packageId}`}>
        <span className="mono">{when(row.at)}</span> {row.packageId} · {row.decision}{row.evidenceSource ? ` · ${row.evidenceSource}${row.evidenceShows ? `: ${row.evidenceShows}` : ""}` : ""}
      </li>)}</ul> : <p>No decisions recorded yet.</p>}
      <p className="prep-note">Who decided: Mellow can’t record who made each decision yet. This prototype has no accounts.</p>
      {notes.length > 0 && <p className="prep-note">Mellow raised {notes.length} note{notes.length === 1 ? "" : "s"} today. They’re in the decision trail export.</p>}

      <p className="findings-disclaimer">This lists what your records show and what to have on hand. It’s not a compliance assessment, and it isn’t legal advice. For a decision about your business, talk to a licensed attorney.</p>
    </article>
    <div className="findings-actions">
      <button type="button" className="ledger-button" data-variant="line" onClick={() => dialog.current?.close()}>Close</button>
      <button type="button" className="ledger-button" onClick={() => window.print()}>Print or save as PDF</button>
    </div>
  </dialog>;
}
