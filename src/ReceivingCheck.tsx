import { useState, type FormEvent } from "react";
import { compareLots, lotInsight, lotRecords, sampleComparison, type LotCheck } from "./comparison";

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
  const exceptions = rows.filter(({ state }) => state !== "match");
  const different = exceptions.filter(({ state }) => state === "different").length;
  const missing = exceptions.length - different;
  const reasons = [
    different > 0 && (different === 1 ? "1 lot number differs" : `${different} lot numbers differ`),
    missing > 0 && `${missing} with missing information`,
  ].filter(Boolean).join(" · ");
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
      <h2 id="receiving-title">Lot number comparison</h2>
      <p>{result ? "Inventory and receiving exports" : "Sample inventory and receiving records"}</p>
    </header>
    <div className="receiving-outcome" aria-live="polite" aria-atomic="true">
      <strong>{exceptions.length ? `${exceptions.length} of ${rows.length} ${exceptions.length === 1 ? "packages has" : "packages have"} differences or gaps` : `All ${rows.length} lot numbers match`}</strong>
      {reasons && <p>{reasons}</p>}
    </div>
    <div className="receiving-actions">
      {exceptions.length > 0 && <button type="button" className="manual-evidence" aria-expanded={showDifferences} aria-controls="receiving-differences" onClick={() => onShowDifferences(!showDifferences)}>
        {showDifferences ? "Hide differences" : "See differences and gaps"}
      </button>}
      <button type="button" className="manual-evidence" aria-expanded={showExports} aria-controls="receiving-exports" onClick={() => setShowExports(!showExports)}>
        Compare your own exports
      </button>
    </div>
    <div id="receiving-differences" hidden={!showDifferences || !exceptions.length}>
      {insight && <p className="comparison-insight"><strong>{insight.title}.</strong> {insight.detail}</p>}
      {exceptions.length ? <div className="lot-table">
        <table className="lot-differences">
          <caption className="sr-only">Lot numbers with differences or gaps</caption>
          <thead><tr><th scope="col">Package</th><th scope="col">Inventory record</th><th scope="col">Receiving record</th></tr></thead>
          <tbody>
            {exceptions.map((row) => <tr key={row.packageId}>
              <th scope="row">{row.packageId}</th>
              <td>{row.inventory === null ? "No matching record" : row.inventory || "No lot number"}</td>
              <td>{row.receiving === null ? "No matching record" : row.receiving || "No lot number"}</td>
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
