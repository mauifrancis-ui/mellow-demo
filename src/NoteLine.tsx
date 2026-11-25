import { useId, useState } from "react";
import type { Note } from "./notes";

import { notUsefulReasons } from "./notes";

/** Mellow speaking first: the MELLOW margin label, one italic line, "Why this?" and dismiss. Never a popup. */
export function NoteLine({ note, onDismiss, onNotUseful, compact = false }: {
  note: Note; onDismiss: (note: Note) => void; onNotUseful?: (note: Note, reason: string) => void; compact?: boolean;
}) {
  const [reason, setReason] = useState("");
  const name = useId();
  return <div className="mellow-note" data-kind={note.kind} data-compact={compact || undefined}>
    <span className="kicker" aria-hidden="true">Mellow</span>
    <p className="mellow-voice"><span className="sr-only">Mellow: </span>{note.text}</p>
    <details className="note-why"
      onKeyDown={(event) => { if (event.key === "Escape") (event.currentTarget as HTMLDetailsElement).open = false; }}>
      <summary>Why this?</summary>
      <div className="note-why-body">
        <p className="kicker">Why you’re seeing this</p>
        <p><b>Trigger:</b> {note.trigger}</p>
        <p><b>Compared:</b> {note.compared.join(", ")}.</p>
        <p className="note-why-small">You’ll see this once. Dismissing it doesn’t change the record.</p>
        {onNotUseful && <fieldset className="not-useful">
          <legend>Not useful? Tell Mellow why</legend>
          {notUsefulReasons.map((option) => <label key={option}>
            <input type="radio" name={name} value={option} checked={reason === option} onChange={() => setReason(option)} />{option}
          </label>)}
          <button type="button" className="ledger-button" data-variant="line" disabled={!reason} onClick={() => onNotUseful(note, reason)}>Mark not useful</button>
          <p className="note-why-small">Saved on this device with the note. Nothing is sent.</p>
        </fieldset>}
      </div>
    </details>
    <button type="button" className="tool note-dismiss" aria-label={`Dismiss note: ${note.text}`} onClick={() => onDismiss(note)}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>
  </div>;
}
