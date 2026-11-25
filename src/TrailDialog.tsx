import { useEffect, useRef, useState } from "react";
import { trailCsv, trailDisclaimer, trailFileName, trailRows, trailTitle, type TrailNote } from "./trail";
import type { Entry } from "./workspace";

const when = (iso: string) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** Export the decision trail as CSV or print. The file is made in this browser; nothing is sent. */
export function TrailDialog({ open, history, notes, workspaceName, onClose }: {
  open: boolean; history: Entry[]; notes: TrailNote[]; workspaceName: string; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");
  const rows = trailRows(history);
  useEffect(() => {
    const node = dialog.current;
    if (open && node && !node.open) node.showModal();
    if (!open && node?.open) node.close();
  }, [open]);

  function download() {
    try {
      const url = URL.createObjectURL(new Blob([trailCsv(rows, notes)], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = trailFileName();
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Saved ${link.download} from this browser.`);
    } catch {
      setStatus("Couldn’t make the file. Try Print or save as PDF instead.");
    }
  }

  return <dialog ref={dialog} className="findings-dialog trail-dialog" aria-labelledby="trail-title" onClose={() => { setStatus(""); onClose(); }}>
    <article className="findings-sheet">
      <header className="findings-head">
        <span className="wordmark">mellow<span aria-hidden="true">.</span></span>
        <span className="kicker">{workspaceName} · {when(new Date().toISOString())}</span>
      </header>
      <h2 id="trail-title">{trailTitle}</h2>
      <p className="findings-scope">{rows.length} decision{rows.length === 1 ? "" : "s"} · {notes.length} Mellow note{notes.length === 1 ? "" : "s"} · recorded on this device</p>
      {rows.length ? <table className="findings-table trail-table">
        <caption className="sr-only">Decisions, oldest first</caption>
        <thead><tr><th scope="col">Time</th><th scope="col">Package</th><th scope="col">Decision</th><th scope="col">Evidence</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={`${row.at}-${row.packageId}`}>
          <td data-label="Time">{when(row.at)}</td>
          <th scope="row" data-label="Package">{row.packageId}</th>
          <td data-label="Decision">{row.decision}</td>
          <td data-label="Evidence">{row.evidenceSource ? `${row.evidenceSource}${row.evidenceShows ? `: ${row.evidenceShows}` : ""}` : "No evidence added"}{row.note ? ` · Note: ${row.note}` : ""}</td>
        </tr>)}</tbody>
      </table> : <p>No decisions recorded yet.</p>}
      {notes.length > 0 && <>
        <p className="kicker">What Mellow said first</p>
        <ul className="findings-decisions">{notes.map((note) => <li key={`${note.at}-${note.text}`}>
          <span className="mono">{when(note.at)}</span> {note.text} <span className="trail-why">({note.trigger.replace(/\.$/, "")}{note.feedback ? `; marked not useful: ${note.feedback}` : note.dismissedAt ? "; dismissed" : ""})</span>
        </li>)}</ul>
      </>}
      <p className="findings-disclaimer">{trailDisclaimer}</p>
    </article>
    <div className="findings-actions">
      <p role="status" className="findings-status">{status}</p>
      <button type="button" className="ledger-button" data-variant="line" onClick={() => dialog.current?.close()}>Close</button>
      <button type="button" className="ledger-button" data-variant="line" onClick={download}>Download CSV</button>
      <button type="button" className="ledger-button" onClick={() => window.print()}>Print or save as PDF</button>
    </div>
  </dialog>;
}
