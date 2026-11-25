import { MonitorChart } from "./MonitorChart";
import type { ReceivingPosture } from "./monitoring";
import type { Series } from "./ask";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function ReceivingMonitor({ posture, open, onToggleDelay, onSimulateCheck, focusSeries = null, onFocusSeries }: {
  posture: ReceivingPosture;
  open: number;
  onSimulateCheck?: () => void;
  focusSeries?: Series | null;
  onFocusSeries?: (series: Series | null) => void;
  onToggleDelay: () => void;
}) {
  const delayed = posture.receiving === "delayed";
  const run = posture.lastSuccessfulRun;
  return <section className="receiving-monitor" data-delayed={delayed} aria-label="Sample monitoring">
    <MonitorChart runs={posture.runs} delayedAt={delayed ? posture.delayedAt : null} focus={focusSeries} onFocus={onFocusSeries} open={open} />
    <details className="monitor-details">
      <summary>
        <span>What I checked</span>
        {run && <time dateTime={run.checkedAt}>{delayed ? "Receiving delayed · last" : "Last"} {clock(run.checkedAt)}</time>}
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
        <div className="monitor-actions">
          {onSimulateCheck && <button className="ledger-button" data-variant="line" onClick={onSimulateCheck} disabled={delayed}>Simulate a new check</button>}
          <button className="ledger-button" data-variant="line" onClick={onToggleDelay}>{delayed ? "Restore sample source" : "Simulate a source delay"}</button>
        </div>
      </div>
    </details>
  </section>;
}
