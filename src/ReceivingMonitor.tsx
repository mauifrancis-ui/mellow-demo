import type { ReceivingPosture } from "./monitoring";

export function ReceivingMonitor({ posture, record, onReview, onToggleDelay }: {
  posture: ReceivingPosture;
  record?: string;
  onReview?: () => void;
  onToggleDelay: () => void;
}) {
  const delayed = posture.receiving === "delayed";
  const run = posture.lastSuccessfulRun;
  return <section className="receiving-monitor" aria-labelledby="monitor-title">
    <div className="monitor-copy" aria-live="polite">
      <p className="monitor-label">Sample monitoring</p>
      <h2 id="monitor-title">{delayed ? "Receiving records are delayed" : record ? `Can you check the label on ${record}?` : "Sample receiving check is up to date"}</h2>
      <p>{delayed
        ? "I can’t check newer arrivals until receiving records are current. Existing reviews are still available."
        : record ? "Inventory has no lot number, but receiving has one. Check the original package label."
          : "I compared the sample records. Any open findings are still in To check."}</p>
    </div>
    {!delayed && record && onReview && <button className="manual-evidence" onClick={onReview}>Open {record}</button>}
    <details className="monitor-details">
      <summary>What I checked</summary>
      {run ? <p>Last completed sample check <time dateTime={run.checkedAt}>{new Date(run.checkedAt).toLocaleString()}</time>. Compared {run.checked} packages across inventory and receiving. {run.matched} matched and {run.exceptions} had a difference or a gap.</p>
        : <p>No sample check has completed yet.</p>}
      <p>These records can show a difference. A person verifies the physical package.</p>
      <button className="manual-evidence" onClick={onToggleDelay}>{delayed ? "Restore sample source" : "Simulate a source delay"}</button>
    </details>
  </section>;
}
