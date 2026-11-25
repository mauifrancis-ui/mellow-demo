import { columnQuestion, guessColumns, lotRecordsWith, previewRows, type ColumnGuess } from "./columns";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { compareLots, type LotCheck } from "./comparison";

type Comparison = { rows: LotCheck[]; inventoryFile: string; receivingFile: string };

function displayValue(value: string | null) {
  return value === null ? "No matching record" : value || "No lot number";
}

type Side = { name: string; text: string; guess: ColumnGuess; choice: { package: string | null; lot: string | null } };
type Pending = { inventory: Side; receiving: Side };

export function ReceivingCheck({ onCompared, onImport, openRequest = 0 }: {
  onCompared: (rows: LotCheck[], inventoryFile: string, receivingFile: string) => boolean;
  onImport: (file: File) => Promise<void>;
  openRequest?: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (openRequest && !dialog.current?.open) dialog.current?.showModal();
  }, [openRequest]);
  const resultSummary = useRef<HTMLParagraphElement>(null);
  const [singleFile, setSingleFile] = useState(false);
  const [comparison, setComparison] = useState<Comparison>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending>();
  const exceptions = comparison?.rows.filter(({ state }) => state !== "match") ?? [];

  function reset() {
    dialog.current?.querySelector("form")?.reset();
    setSingleFile(false);
    setComparison(undefined);
    setPending(undefined);
    setError("");
  }

  function choose(side: "inventory" | "receiving", kind: "package" | "lot", header: string) {
    setPending((current) => current && { ...current, [side]: { ...current[side], choice: { ...current[side].choice, [kind]: header || null } } });
  }

  function compareChosen() {
    if (!pending) return;
    const { inventory, receiving } = pending;
    if (!inventory.choice.package || !inventory.choice.lot || !receiving.choice.package || !receiving.choice.lot) {
      setError("Choose a package ID and a lot column for each file.");
      return;
    }
    try {
      const rows = compareLots(
        lotRecordsWith(inventory.text, { package: inventory.choice.package, lot: inventory.choice.lot }),
        lotRecordsWith(receiving.text, { package: receiving.choice.package, lot: receiving.choice.lot }));
      setComparison({ rows, inventoryFile: inventory.name, receivingFile: receiving.name });
      setPending(undefined);
      setError("");
      requestAnimationFrame(() => resultSummary.current?.focus());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Couldn’t read the files.");
    }
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
      const side = (name: string, text: string) => {
        const guess = guessColumns(text);
        return { name, text, guess, choice: { package: guess.package, lot: guess.lot } };
      };
      setPending({ inventory: side(inventory.name, left), receiving: side(receiving.name, right) });
      requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>(".columns-step h3")?.focus());
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
            : "Check which lot numbers match across inventory and receiving. Use two de-identified CSVs, each with a package ID and a lot column. I’ll match the columns and show you a preview before comparing."}</p>
          {!singleFile && !pending && !comparison && <p className="template-links">Need a starting point? Download the templates: <a href="/templates/inventory-template.csv" download>inventory</a> · <a href="/templates/receiving-template.csv" download>receiving</a>.</p>}
          {pending && <section className="columns-step" aria-labelledby="columns-title">
            <h3 id="columns-title" tabIndex={-1}>Which columns hold the package ID and the lot?</h3>
            {(["inventory", "receiving"] as const).map((key) => {
              const side = pending[key];
              const question = columnQuestion(side.name, { ...side.guess, package: side.choice.package, lot: side.choice.lot });
              return <div className="columns-file" key={key}>
                <p className="kicker">{key === "inventory" ? "Inventory" : "Receiving"} · {side.name}</p>
                <div className="columns-pickers">
                  {(["package", "lot"] as const).map((kind) => <label key={kind}>
                    {kind === "package" ? "Package ID column" : "Lot column"}
                    <select value={side.choice[kind] ?? ""} onChange={(event) => choose(key, kind, event.target.value)} aria-invalid={!side.choice[kind] || undefined}>
                      <option value="">Choose a column</option>
                      {side.guess.headers.map((header) => <option key={header} value={header}>{header}</option>)}
                    </select>
                  </label>)}
                </div>
                {question && <p className="mellow-note-inline"><span className="kicker">Mellow</span><span className="mellow-voice">{question}</span></p>}
                <table className="preview-table">
                  <caption>First rows, as I’ll read them</caption>
                  <thead><tr><th scope="col">Package ID</th><th scope="col">Lot</th></tr></thead>
                  <tbody>{previewRows(side.text, side.choice).map((row, index) => <tr key={index}><td>{row.packageId}</td><td>{row.lot}</td></tr>)}</tbody>
                </table>
              </div>;
            })}
            <p className="columns-privacy">Nothing leaves your browser.</p>
          </section>}
          <div className="compare-file-grid" hidden={Boolean(pending)}>
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
            {pending && <button type="button" className="secondary" onClick={() => { setPending(undefined); setError(""); }}>Back</button>}
            {comparison ? (exceptions.length > 0 && <button type="button" className="solid" onClick={queueFindings}>Add to queue</button>)
              : pending ? <button type="button" className="solid" onClick={compareChosen}>Compare 2 files</button>
              : <button type="submit" className="solid" disabled={busy}>{busy ? "Reading…" : singleFile ? "Check file" : "Next: match columns"}</button>}
          </div>
        </div>
      </form>
    </dialog>
  </>;
}
