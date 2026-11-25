import { useEffect, useRef, useState } from "react";
import { findingsSummary, findingsText, type FindingsInput } from "./findings";

/** "Share these findings": a printable one-page summary for whoever signs off. Nothing is sent from Mellow. */
export function FindingsDialog({ open, input, onClose }: { open: boolean; input: FindingsInput; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState("");
  const summary = findingsSummary(input);
  useEffect(() => {
    const node = dialog.current;
    if (open && node && !node.open) node.showModal();
    if (!open && node?.open) node.close();
  }, [open]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(findingsText(summary));
      setCopied("Copied as text.");
    } catch {
      setCopied("Couldn’t copy. Select the summary and copy it instead.");
    }
  }

  return <dialog ref={dialog} className="findings-dialog" aria-labelledby="findings-title" onClose={() => { setCopied(""); onClose(); }}>
    <article className="findings-sheet">
      <header className="findings-head">
        <span className="wordmark">mellow<span aria-hidden="true">.</span></span>
        <span className="kicker">Findings · {new Date().toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
      </header>
      <h2 id="findings-title">{summary.title}</h2>
      <p className="findings-scope">A comparison of two files. Not a compliance assessment.</p>
      <p className="kicker">What was compared</p>
      <p>{summary.compared}</p>
      {summary.rows.length > 0 && <table className="findings-table">
        <caption className="sr-only">Packages that need a person</caption>
        <thead><tr><th scope="col">Package</th><th scope="col">Inventory</th><th scope="col">Receiving</th><th scope="col">Finding</th></tr></thead>
        <tbody>{summary.rows.map((row) => <tr key={row.packageId}>
          <th scope="row">{row.packageId}</th><td>{row.inventory}</td><td>{row.receiving}</td><td>{row.finding}</td>
        </tr>)}</tbody>
      </table>}
      <p className="kicker">Decisions so far</p>
      {summary.decisions.length ? <ul className="findings-decisions">{summary.decisions.map((entry) => <li key={`${entry.record}-${entry.at}`}>
        <span className="mono">{entry.record}</span> {entry.decision}
      </li>)}</ul> : <p>None recorded yet.</p>}
      <p className="findings-disclaimer">{summary.disclaimer}</p>
    </article>
    <div className="findings-actions">
      <p role="status" className="findings-status">{copied}</p>
      <button type="button" className="ledger-button" data-variant="line" onClick={() => dialog.current?.close()}>Close</button>
      <button type="button" className="ledger-button" data-variant="line" onClick={() => void copy()}>Copy as text</button>
      <button type="button" className="ledger-button" onClick={() => window.print()}>Print or save as PDF</button>
    </div>
  </dialog>;
}
