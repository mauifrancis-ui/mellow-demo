import { useState, type FormEvent } from "react";
import { compareLots, lotInsight, lotRecords, sampleComparison, type LotCheck } from "./comparison";

const categories = [
  { id: "match", label: "Match" },
  { id: "different", label: "Different" },
  { id: "missing", label: "Missing information" },
] as const;

export function ReceivingCheck({ result, onResult, showDifferences, onShowDifferences }: {
  result?: LotCheck[];
  onResult: (rows?: LotCheck[]) => void;
  showDifferences: boolean;
  onShowDifferences: (open: boolean) => void;
}) {
  const [showExports, setShowExports] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const rows = result ?? sampleComparison;
  const totals = categories.map((category) => ({ ...category, count: rows.filter((row) => row.state === category.id).length }));
  const exceptions = rows.filter(({ state }) => state !== "match");
  const priority = exceptions.find(({ state }) => state === "different") ?? exceptions[0];
  const insight = result && priority ? lotInsight(priority) : undefined;

  async function checkFiles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = new FormData(event.currentTarget);
    const inventory = files.get("inventory");
    const receiving = files.get("receiving");
    if (!(inventory instanceof File) || !(receiving instanceof File) || !inventory.size || !receiving.size) {
      setError("Choose both CSV files.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      if (inventory.size > 500_000 || receiving.size > 500_000) throw new Error("Choose CSV files of 500 KB or less.");
      const [left, right] = await Promise.all([inventory.text(), receiving.text()]);
      onResult(compareLots(lotRecords(left), lotRecords(right)));
      onShowDifferences(true);
    } catch (failure) {
      onResult(undefined);
      setError(failure instanceof Error ? failure.message : "Couldn’t read the files.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="receiving-check" aria-labelledby="receiving-title">
    <header>
      <div>
        <h2 id="receiving-title">Receiving check</h2>
        <p>{result ? "Your two CSV files" : "Simulated inventory and receiving records"} · {rows.length} packages</p>
      </div>
    </header>
    <div className="comparison-meter" aria-hidden="true">
      {totals.filter(({ count }) => count).map(({ id, count }) => <span key={id} data-result={id} style={{ flexGrow: count }} />)}
    </div>
    <ul className="comparison-key" aria-label="Receiving check results">
      {totals.map(({ id, label, count }) => <li key={id} data-result={id}><strong>{count}</strong> {label}</li>)}
    </ul>
    <div className="receiving-actions">
      <button type="button" className="manual-evidence" aria-expanded={showDifferences} aria-controls="receiving-differences" onClick={() => onShowDifferences(!showDifferences)}>
        See differences and gaps
      </button>
      <button type="button" className="manual-evidence" aria-expanded={showExports} aria-controls="receiving-exports" onClick={() => setShowExports(!showExports)}>
        Compare your own exports
      </button>
    </div>
    <div id="receiving-differences" hidden={!showDifferences}>
      {insight && <p className="comparison-insight"><strong>{insight.title}.</strong> {insight.detail}</p>}
      {exceptions.length ? <div className="lot-table">
        <table className="lot-differences">
          <caption className="sr-only">Lot numbers with differences or gaps</caption>
          <thead><tr><th scope="col">Package</th><th scope="col">Inventory</th><th scope="col">Receiving</th></tr></thead>
          <tbody>
            {exceptions.map((row) => <tr key={row.packageId}>
              <th scope="row">{row.packageId}</th>
              <td>{row.inventory === null ? "No record" : row.inventory || "Blank"}</td>
              <td>{row.receiving === null ? "No record" : row.receiving || "Blank"}</td>
            </tr>)}
          </tbody>
        </table>
      </div> : <p>All lot numbers match across the two files.</p>}
    </div>
    <div id="receiving-exports" hidden={!showExports}>
      <p>Choose two de-identified CSVs with <code>package_id</code> and <code>lot_number</code> columns. The comparison stays on this page and makes no changes to either source.</p>
      <form onSubmit={(event) => void checkFiles(event)} className="lot-uploads">
        <label>Inventory export<input name="inventory" type="file" accept=".csv,text/csv" required /></label>
        <label>Receiving export<input name="receiving" type="file" accept=".csv,text/csv" required /></label>
        <button className="manual-evidence" disabled={busy}>Compare files</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {result && <button className="manual-evidence" onClick={() => { onResult(undefined); setError(""); }}>Return to sample</button>}
    </div>
  </section>;
}
