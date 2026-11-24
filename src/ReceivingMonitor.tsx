import type { ReceivingPosture } from "./monitoring";

export function ReceivingMonitor({ posture, record, onReview, onToggleDelay }: {
  posture: ReceivingPosture;
  record?: string;
  onReview?: () => void;
  onToggleDelay: () => void;
}) {
  const delayed = posture.receiving === "delayed";
  const run = posture.lastSuccessfulRun;
  const time = run ? new Date(run.checkedAt) : null;
  return <section className="receiving-monitor" data-delayed={delayed} aria-labelledby="monitor-title">
    <div className="monitor-copy" aria-live="polite">
      <p className="monitor-label">Sample monitoring</p>
      <h2 id="monitor-title">{delayed ? "Receiving records are delayed" : record ? `Can you check the label on ${record}?` : "Receiving check is up to date"}</h2>
      <p>{delayed
        ? "I can’t check newer arrivals until receiving records are current. Existing reviews are still available."
        : record ? "Inventory has no lot number, but receiving has one. Check the original package label."
          : "I compared the sample records. Any open findings are still in To check."}</p>
      {!delayed && record && onReview && <button className="manual-evidence monitor-open" onClick={onReview}>Open {record}</button>}
    </div>
    <div className="monitor-map" role="group" aria-label="Sample source coverage" key={posture.receiving}>
      <div className="monitor-source"><span>Inventory</span><strong>{delayed ? "Available" : "Checked"}</strong></div>
      <div className="monitor-source" data-receiving><span>Receiving</span><strong>{delayed ? "Delayed" : "Checked"}</strong></div>
      <span className="monitor-link monitor-link-inventory" aria-hidden="true" />
      <span className="monitor-link monitor-link-receiving" aria-hidden="true" />
      <div className="monitor-map-result"><span>Comparison</span><strong>{delayed ? "Paused" : run ? `${run.checked} packages` : "Pending"}</strong></div>
    </div>
    <details className="monitor-details">
      <summary>
        <span>What I checked</span>
        {time && <time dateTime={run?.checkedAt}>Last completed {time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>}
      </summary>
      <div className="monitor-detail-body">
        {run && time ? <p><time dateTime={run.checkedAt}>{time.toLocaleString()}</time> · {run.matched} matched and {run.exceptions} had a difference or a gap.</p>
          : <p>No sample check has completed yet.</p>}
        <p>These records can show a difference. A person verifies the physical package.</p>
        <button className="manual-evidence" onClick={onToggleDelay}>{delayed ? "Restore sample source" : "Simulate a source delay"}</button>
      </div>
    </details>
  </section>;
}
