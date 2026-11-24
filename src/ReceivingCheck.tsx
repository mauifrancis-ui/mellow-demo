import { useState, type FormEvent } from "react";
import { compareLots, lotInsight, lotRecords, sampleComparison, type LotCheck } from "./comparison";

export function ReceivingCheck({ result, onResult, showDifferences, onShowDifferences }: {
  result?: LotCheck[];
  onResult: (rows?: LotCheck[]) => void;
  showDifferences: boolean;
  onShowDifferences: (open: boolean) => void;
}) {
  const [filter, setFilter] = useState<"different" | "missing">();
  const [showExports, setShowExports] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const rows = result ?? sampleComparison;
  const exceptions = rows.filter(({ state }) => state !== "match");
  const different = exceptions.filter(({ state }) => state === "different").length;
  const missing = exceptions.length - different;
  const categories = [
    { id: "different", label: "Lot numbers differ", count: different },
    { id: "missing", label: "Missing details", count: missing },
  ] as const;
  const visibleRows = filter ? exceptions.filter(({ state }) => state === filter) : exceptions;
  const priority = visibleRows.find(({ state }) => state === "different") ?? visibleRows[0];
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
      setFilter(undefined);
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
      <h2 id="receiving-title">Lot numbers, side by side</h2>
      <p>{result ? "Your files" : "Sample records"}</p>
    </header>
    <div className="receiving-outcome" aria-live="polite" aria-atomic="true">
      <p>{exceptions.length ? `We compared ${rows.length} ${rows.length === 1 ? "package" : "packages"} across inventory and receiving records.` : `The lot numbers match for all ${rows.length} ${rows.length === 1 ? "package" : "packages"}.`}</p>
    </div>
    {exceptions.length > 0 && <div className="receiving-filters" role="group" aria-label="Compare records by result">
      {categories.filter(({ count }) => count > 0).map(({ id, label, count }) => {
        const selected = showDifferences && filter === id;
        return <button type="button" key={id} data-result={id} aria-pressed={selected} aria-controls="receiving-differences" onClick={() => {
          setFilter(id);
          onShowDifferences(!selected);
        }}>
          <span className="receiving-filter-count">{count}</span>
          <span>{label}</span>
        </button>;
      })}
    </div>}
    <div id="receiving-differences" hidden={!showDifferences || !exceptions.length}>
      {insight && <p className="comparison-insight"><strong>{insight.title}.</strong> {insight.detail}</p>}
      {exceptions.length ? <div className="lot-table">
        <table className="lot-differences">
          <caption className="sr-only">{filter === "different" ? "Packages with different lot numbers" : filter === "missing" ? "Packages with missing details" : "Lot numbers with differences or gaps"}</caption>
          <thead><tr><th scope="col">Package</th><th scope="col">Inventory record</th><th scope="col">Receiving record</th></tr></thead>
          <tbody>
            {visibleRows.map((row) => <tr key={row.packageId}>
              <th scope="row">{row.packageId}</th>
              <td>{row.inventory === null ? "No matching record" : row.inventory || "No lot number"}</td>
              <td>{row.receiving === null ? "No matching record" : row.receiving || "No lot number"}</td>
            </tr>)}
          </tbody>
        </table>
      </div> : <p>All lot numbers match across the two files.</p>}
    </div>
    <div className="receiving-actions">
      <button type="button" className="manual-evidence" aria-expanded={showExports} aria-controls="receiving-exports" onClick={() => setShowExports(!showExports)}>
        {showExports ? "Hide file comparison" : "Compare your own files"}
      </button>
    </div>
    <div id="receiving-exports" hidden={!showExports}>
      <p>Choose two de-identified CSVs with <code>package_id</code> and <code>lot_number</code> columns. The comparison stays on this page and makes no changes to either source.</p>
      <form onSubmit={(event) => void checkFiles(event)} className="lot-uploads">
        <label>Inventory export<input name="inventory" type="file" accept=".csv,text/csv" required /></label>
        <label>Receiving export<input name="receiving" type="file" accept=".csv,text/csv" required /></label>
        <button className="manual-evidence" disabled={busy}>Compare files</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {result && <button className="manual-evidence" onClick={() => { onResult(undefined); setFilter(undefined); onShowDifferences(false); setError(""); }}>Return to sample</button>}
    </div>
  </section>;
}
