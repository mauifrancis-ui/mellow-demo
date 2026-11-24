import { useState, type FormEvent } from "react";
import { compareLots, lotRecords, sampleComparison, type LotCheck } from "./comparison";

const categories = [
  { id: "match", label: "Match" },
  { id: "different", label: "Different" },
  { id: "missing", label: "Missing information" },
] as const;

export function ReceivingCheck({ openSample }: { openSample?: () => void }) {
  const [result, setResult] = useState<LotCheck[]>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const rows = result ?? sampleComparison;
  const totals = categories.map((category) => ({ ...category, count: rows.filter((row) => row.state === category.id).length }));
  const exceptions = rows.filter(({ state }) => state !== "match");

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
      setResult(compareLots(lotRecords(left), lotRecords(right)));
    } catch (failure) {
      setResult(undefined);
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
      {!result && openSample && <button className="manual-evidence" onClick={openSample}>Review label mismatch</button>}
    </header>
    <div className="comparison-meter" aria-hidden="true">
      {totals.filter(({ count }) => count).map(({ id, count }) => <span key={id} data-result={id} style={{ flexGrow: count }} />)}
    </div>
    <ul className="comparison-key" aria-label="Receiving check results">
      {totals.map(({ id, label, count }) => <li key={id} data-result={id}><strong>{count}</strong> {label}</li>)}
    </ul>
    <details>
      <summary>See differences and gaps</summary>
      {exceptions.length ? <ul className="lot-differences">{exceptions.map((row) => <li key={row.packageId} className="activity-row">
        <strong>{row.packageId}</strong>
        <span>Inventory: {row.inventory ?? "No record"}{row.inventory === "" ? "Blank" : ""}</span>
        <span>Receiving: {row.receiving ?? "No record"}{row.receiving === "" ? "Blank" : ""}</span>
      </li>)}</ul> : <p>All lot numbers match across the two files.</p>}
    </details>
    <details>
      <summary>Compare your own exports</summary>
      <p>Choose two de-identified CSVs with <code>package_id</code> and <code>lot_number</code> columns. The comparison stays on this page and makes no changes to either source.</p>
      <form onSubmit={(event) => void checkFiles(event)} className="lot-uploads">
        <label>Inventory export<input name="inventory" type="file" accept=".csv,text/csv" required /></label>
        <label>Receiving export<input name="receiving" type="file" accept=".csv,text/csv" required /></label>
        <button className="manual-evidence" disabled={busy}>Compare files</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {result && <button className="manual-evidence" onClick={() => { setResult(undefined); setError(""); }}>Return to sample</button>}
    </details>
  </section>;
}
