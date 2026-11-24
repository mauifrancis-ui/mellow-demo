import { useState, type FormEvent } from "react";
import { compareLots, lotRecords, type LotCheck } from "./comparison";

export function ReceivingCheck({ onCompared }: {
  onCompared: (rows: LotCheck[], inventoryFile: string, receivingFile: string) => boolean;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
      if (!onCompared(compareLots(lotRecords(left), lotRecords(right)), inventory.name, receiving.name)) {
        setError("Couldn’t save these reviews on this device. Try again.");
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Couldn’t read the files.");
    } finally {
      setBusy(false);
    }
  }

  return <details className="comparison-import">
    <summary>Compare inventory and receiving files</summary>
    <p>Use two de-identified CSVs with <code>package_id</code> and <code>lot_number</code> columns. Packages with a difference or gap go into To check.</p>
    <form onSubmit={(event) => void checkFiles(event)} className="lot-uploads">
      <label>Inventory export<input name="inventory" type="file" accept=".csv,text/csv" required /></label>
      <label>Receiving export<input name="receiving" type="file" accept=".csv,text/csv" required /></label>
      <button className="manual-evidence" disabled={busy}>Compare files</button>
    </form>
    {error && <p role="alert" className="error">{error}</p>}
  </details>;
}
