import { useRef, useState, type FormEvent } from "react";
import { compareLots, lotRecords, type LotCheck } from "./comparison";

type Comparison = { rows: LotCheck[]; inventoryFile: string; receivingFile: string };

function displayValue(value: string | null) {
  return value === null ? "No matching record" : value || "No lot number";
}

export function ReceivingCheck({ onCompared, onImport }: {
  onCompared: (rows: LotCheck[], inventoryFile: string, receivingFile: string) => boolean;
  onImport: (file: File) => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const resultSummary = useRef<HTMLParagraphElement>(null);
  const [singleFile, setSingleFile] = useState(false);
  const [comparison, setComparison] = useState<Comparison>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const exceptions = comparison?.rows.filter(({ state }) => state !== "match") ?? [];

  function reset() {
    dialog.current?.querySelector("form")?.reset();
    setSingleFile(false);
    setComparison(undefined);
    setError("");
  }

  function queueFindings() {
    if (!comparison) return;
    if (onCompared(comparison.rows, comparison.inventoryFile, comparison.receivingFile)) dialog.current?.close();
    else setError("Couldn’t save these reviews on this device. Try again.");
  }

  async function checkFiles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = new FormData(event.currentTarget);
    const inventory = files.get("inventory");
    const receiving = files.get("receiving");
    if (!(inventory instanceof File) || !inventory.size) {
      setError("Choose an inventory CSV.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      if (singleFile) {
        await onImport(inventory);
        dialog.current?.close();
        return;
      }
      if (!(receiving instanceof File) || !receiving.size) throw new Error("Choose a receiving CSV.");
      if (inventory.size > 500_000 || receiving.size > 500_000) throw new Error("Choose CSV files of 500 KB or less.");
      const [left, right] = await Promise.all([inventory.text(), receiving.text()]);
      setComparison({ rows: compareLots(lotRecords(left), lotRecords(right)), inventoryFile: inventory.name, receivingFile: receiving.name });
      requestAnimationFrame(() => resultSummary.current?.focus());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Couldn’t read the files.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <button type="button" className="manual-evidence compare-trigger" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      Compare files
    </button>
    <dialog ref={dialog} className="compare-dialog" aria-labelledby="compare-title" aria-describedby="compare-description"
      onClose={reset} onCancel={(event) => { if (busy) event.preventDefault(); }}>
      <form key={singleFile ? "single" : "pair"} onSubmit={(event) => void checkFiles(event)} onChange={() => {
        setComparison(undefined);
        setError("");
      }}>
        <div className="compare-body">
          <h2 id="compare-title">{singleFile ? "Check one file" : "Compare files"}</h2>
          <p id="compare-description">{singleFile
            ? "Use an inventory CSV to find missing details."
            : "Check which lot numbers match across inventory and receiving. Use two de-identified CSVs with package_id and lot_number columns."}</p>
          <div className="compare-file-grid">
            <label>Inventory export<input name="inventory" type="file" accept=".csv,text/csv" required disabled={busy} /></label>
            {!singleFile && <label>Receiving export<input name="receiving" type="file" accept=".csv,text/csv" required disabled={busy} /></label>}
          </div>
          {comparison && <section className="compare-result" aria-label="Comparison results">
            <p ref={resultSummary} tabIndex={-1}>{exceptions.length
              ? `${exceptions.length} of ${comparison.rows.length} packages had differences or missing details.`
              : `All ${comparison.rows.length} lot numbers match.`}</p>
            {exceptions.length > 0 && <div className="compare-table-wrap" tabIndex={0} role="region" aria-label="Source values">
              <table className="compare-table">
                <caption className="sr-only">Packages with differences or missing details</caption>
                <thead><tr><th scope="col">Package</th><th scope="col">Inventory</th><th scope="col">Receiving</th></tr></thead>
                <tbody>{exceptions.map((row) => <tr key={row.packageId}>
                  <th scope="row">{row.packageId}</th>
                  <td>{displayValue(row.inventory)}</td>
                  <td>{displayValue(row.receiving)}</td>
                </tr>)}</tbody>
              </table>
            </div>}
          </section>}
          {error && <p role="alert" className="error">{error}</p>}
        </div>
        <div className="compare-footer">
          <button type="button" className="compare-mode" disabled={busy} onClick={() => {
            setSingleFile(!singleFile);
            setComparison(undefined);
            setError("");
          }}>{singleFile ? "Compare two files" : "Check one file instead"}</button>
          <div className="actions">
            <button type="button" className="secondary" disabled={busy} onClick={() => dialog.current?.close()}>{comparison && !exceptions.length ? "Done" : "Cancel"}</button>
            {comparison ? (exceptions.length > 0 && <button type="button" className="solid" onClick={queueFindings}>Add to queue</button>)
              : <button type="submit" className="solid" disabled={busy}>{busy ? "Checking…" : singleFile ? "Check file" : "Compare"}</button>}
          </div>
        </div>
      </form>
    </dialog>
  </>;
}
