import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ask, type AskAction, type AskAnswer, type AskContext, type Brief } from "./ask";

const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const stroke = (path: ReactNode) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;

export function Briefing({ brief, lastCheck, delayed, aside }: {
  brief: Brief;
  lastCheck?: string;
  delayed: boolean;
  aside?: ReactNode;
}) {
  const status = delayed ? "receiving delayed" : lastCheck ? `last check ${clock(lastCheck)}` : "no check yet";
  return <header className="briefing" aria-labelledby="briefing-title">
    <div className="briefing-top">
      <p className="kicker">Today · {status}</p>
      {aside}
    </div>
    <h1 id="briefing-title">{brief.greeting} {brief.headline}</h1>
    <div className="mellow-says">
      <span className="kicker" aria-hidden="true">Mellow</span>
      <p className="mellow-voice" key={brief.message}><span className="sr-only">Mellow says: </span>{brief.message}</p>
    </div>
  </header>;
}

type Attachment = { name: string; size: number };

function formatSize(bytes: number) {
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

export function Conversation({ context, chips, onAction }: {
  context: AskContext;
  chips: string[];
  onAction: (action: AskAction, answer: AskAnswer) => void;
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [thread, setThread] = useState<{ question: string; answer: AskAnswer; id: number } | null>(null);

  function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed && !attachment) { input.current?.focus(); return; }
    const answer: AskAnswer = attachment ? {
      intent: "fallback",
      title: "I can’t read attachments yet",
      body: `Live AI is off, so I can’t look inside ${attachment.name}. Add it to the record as evidence and a person can review it.`,
      actions: [{ label: "Add evidence", action: { kind: "evidence" } }],
    } : ask(trimmed, context);
    const asked = trimmed || attachment?.name || "";
    setThread((previous) => ({ question: asked, answer, id: (previous?.id ?? 0) + 1 }));
    setValue("");
    setAttachment(null);
    if (answer.series) onAction({ kind: "series", series: answer.series }, answer);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(value);
    }
  }

  function attach(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setAttachment({ name: file.name, size: file.size });
    event.target.value = "";
    input.current?.focus();
  }

  function edit(transform: (text: string, start: number, end: number) => { text: string; start: number; end: number }) {
    const node = input.current;
    if (!node) return;
    const next = transform(value, node.selectionStart, node.selectionEnd);
    setValue(next.text);
    requestAnimationFrame(() => { node.focus(); node.setSelectionRange(next.start, next.end); });
  }

  const wrap = (mark: string) => edit((text, start, end) => ({
    text: text.slice(0, start) + mark + text.slice(start, end) + mark + text.slice(end),
    start: start + mark.length, end: end + mark.length,
  }));
  const list = () => edit((text, start, end) => {
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const block = text.slice(lineStart, end).split("\n").map((line) => line.startsWith("- ") ? line : `- ${line}`).join("\n");
    return { text: text.slice(0, lineStart) + block + text.slice(end), start: lineStart + block.length, end: lineStart + block.length };
  });
  const reference = () => edit((text, start, end) => ({
    text: text.slice(0, start) + "PKG-" + text.slice(end), start: start + 4, end: start + 4,
  }));

  return <section className="conversation" aria-label="Talk with Mellow">
    <div className="ask-result" aria-live="polite">
      {thread && <article className="answer" key={thread.id} aria-labelledby="answer-title">
        <p className="answer-question"><span className="sr-only">You asked: </span>{thread.question}</p>
        <h2 id="answer-title">{thread.answer.title}</h2>
        <p className="mellow-voice">{thread.answer.body}</p>
        {thread.answer.items && thread.answer.items.length > 0 && <ul className="answer-items">
          {thread.answer.items.map((item) => <li key={item.label}><strong>{item.label}</strong><span>{item.detail}</span></li>)}
        </ul>}
        <div className="answer-actions">
          {thread.answer.actions.map((item, index) => <button key={item.label} className="ledger-button" data-variant={index === 0 ? "ink" : "line"}
            onClick={() => onAction(item.action, thread.answer)}>{item.label}</button>)}
          <button className="ledger-button" data-variant="quiet" onClick={() => { setThread(null); input.current?.focus(); }}>Clear</button>
        </div>
      </article>}
    </div>

    <div className="reply-chips" role="group" aria-label="Suggested replies">
      {chips.map((chip) => <button key={chip} type="button" className="chip" onClick={() => submit(chip)}>{chip}</button>)}
    </div>

    <form className="composer" onSubmit={onSubmit}>
      <label htmlFor="ask-input" className="sr-only">Reply to Mellow</label>
      <textarea id="ask-input" ref={input} rows={2} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown}
        placeholder="Reply, or ask about anything else" maxLength={600} aria-describedby="ask-note" />
      {attachment && <p className="attachment">
        <span>{stroke(<path d="M20 11.5 12.4 19a5 5 0 0 1-7.1-7.1l7.8-7.8a3.3 3.3 0 0 1 4.7 4.7l-7.6 7.6a1.7 1.7 0 0 1-2.4-2.4l7-7" />)}{attachment.name} · {formatSize(attachment.size)}</span>
        <button type="button" className="tool" aria-label={`Remove ${attachment.name}`} onClick={() => setAttachment(null)}>{stroke(<path d="M6 6l12 12M18 6 6 18" />)}</button>
      </p>}
      <div className="composer-tools" role="toolbar" aria-label="Message tools">
        <button type="button" className="tool" aria-label="Attach a file" onClick={() => fileInput.current?.click()}>{stroke(<path d="M20 11.5 12.4 19a5 5 0 0 1-7.1-7.1l7.8-7.8a3.3 3.3 0 0 1 4.7 4.7l-7.6 7.6a1.7 1.7 0 0 1-2.4-2.4l7-7" />)}</button>
        <button type="button" className="tool" aria-label="Add a photo" onClick={() => photoInput.current?.click()}>{stroke(<><rect x="3" y="5" width="18" height="14" rx="1.5" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-9 8" /></>)}</button>
        <button type="button" className="tool" aria-label="Take a photo of a label" onClick={() => cameraInput.current?.click()}>{stroke(<><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>)}</button>
        <span className="tool-divider" aria-hidden="true" />
        <button type="button" className="tool" aria-label="Bold" onClick={() => wrap("**")}><b>B</b></button>
        <button type="button" className="tool tool-italic" aria-label="Italic" onClick={() => wrap("_")}>I</button>
        <button type="button" className="tool" aria-label="Bulleted list" onClick={list}>{stroke(<><path d="M9 7h11M9 12h11M9 17h11" /><circle cx="4.5" cy="7" r=".8" fill="currentColor" /><circle cx="4.5" cy="12" r=".8" fill="currentColor" /><circle cx="4.5" cy="17" r=".8" fill="currentColor" /></>)}</button>
        <span className="tool-divider" aria-hidden="true" />
        <button type="button" className="tool tool-text" aria-label="Reference a package" onClick={reference}>#PKG</button>
        <button type="submit" className="ledger-button send" data-variant="ink">Send{stroke(<path d="M5 12h14M13 6l6 6-6 6" />)}</button>
      </div>
      <input ref={fileInput} type="file" hidden accept=".csv,.pdf,image/*" onChange={attach} />
      <input ref={photoInput} type="file" hidden accept="image/*" onChange={attach} />
      <input ref={cameraInput} type="file" hidden accept="image/*" capture="environment" onChange={attach} />
    </form>
    <p className="ask-note" id="ask-note">Answers come from the sample records on this device. Live AI is off.</p>
  </section>;
}
