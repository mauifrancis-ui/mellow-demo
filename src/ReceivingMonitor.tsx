import { MonitorChart } from "./MonitorChart";
import type { ReceivingPosture } from "./monitoring";
import type { Series } from "./ask";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function ReceivingMonitor({ posture, record, onReview, onToggleDelay, focusSeries = null, onFocusSeries }: {
  posture: ReceivingPosture;
  focusSeries?: Series | null;
  onFocusSeries?: (series: Series | null) => void;
  record?: string;
  onReview?: () => void;
  onToggleDelay: () => void;
}) {
  const delayed = posture.receiving === "delayed";
  const run = posture.lastSuccessfulRun;
  const state = delayed ? "delayed" : record ? "finding" : "clear";
  return <section className="receiving-monitor" data-delayed={delayed} aria-labelledby="monitor-title">
    <div className="monitor-copy" aria-live="polite">
      <p className="monitor-label">Sample monitoring</p>
      <div className="monitor-message" key={state}>
        <h2 id="monitor-title">{delayed ? "Receiving records are delayed" : record ? `Can you check the label on ${record}?` : "Receiving check is up to date"}</h2>
        <p>{delayed
          ? "I can’t check newer arrivals until receiving records are current. Existing reviews are still available."
          : record ? "Inventory has no lot number, but receiving has one. Check the original package label."
            : "I compared the sample records. Any open findings are still in To check."}</p>
      </div>
      {!delayed && record && onReview && <button className="manual-evidence monitor-open" onClick={onReview}>Open {record}</button>}
    </div>
    <MonitorChart runs={posture.runs} delayedAt={delayed ? posture.delayedAt : null} focus={focusSeries} onFocus={onFocusSeries} />
    <details className="monitor-details">
      <summary>
        <span>What I checked</span>
        {run && <time dateTime={run.checkedAt}>Last completed {clock(run.checkedAt)}</time>}
      </summary>
      <div className="monitor-detail-body">
        {run ? <p><time dateTime={run.checkedAt}>{new Date(run.checkedAt).toLocaleString()}</time> · {run.matched} matched and {run.exceptions} had a difference or a gap.</p>
          : <p>No sample check has completed yet.</p>}
        {posture.runs.length > 0 && <table className="monitor-table">
          <caption>Sample checks, earliest first</caption>
          <thead><tr><th scope="col">Time</th><th scope="col">Compared</th><th scope="col">Matched</th><th scope="col">Difference</th><th scope="col">Gap</th></tr></thead>
          <tbody>
            {posture.runs.map((entry) => <tr key={entry.checkedAt}>
              <th scope="row"><time dateTime={entry.checkedAt}>{clock(entry.checkedAt)}</time></th>
              <td>{entry.checked}</td><td>{entry.matched}</td><td>{entry.different}</td><td>{entry.missing}</td>
            </tr>)}
            {delayed && posture.delayedAt && <tr><th scope="row"><time dateTime={posture.delayedAt}>{clock(posture.delayedAt)}</time></th><td colSpan={4}>Delayed, no check ran</td></tr>}
          </tbody>
        </table>}
        <p>Earlier checks are fictional sample data. These records can show a difference. A person verifies the physical package.</p>
        <button className="manual-evidence" onClick={onToggleDelay}>{delayed ? "Restore sample source" : "Simulate a source delay"}</button>
      </div>
    </details>
  </section>;
}
