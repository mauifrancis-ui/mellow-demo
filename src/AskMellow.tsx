import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ask, type AskAction, type AskAnswer, type AskContext } from "./ask";

const icon = (path: ReactNode) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;

const quickActions = [
  { title: "What needs me", detail: "Start with the record that matters most", prompt: "What needs me right now?",
    icon: icon(<><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></>) },
  { title: "Today’s recap", detail: "Checks, matches, and flags so far", prompt: "How did receiving go today?",
    icon: icon(<><path d="M5 19V11M10 19V6M15 19v-5M20 19V9" /></>) },
  { title: "Gaps", detail: "Packages missing a lot or a record", prompt: "Show me today’s gaps",
    icon: icon(<><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 10h8M8 14h3" strokeDasharray="2 2" /></>) },
  { title: "Disagreements", detail: "Where inventory and receiving differ", prompt: "Which ones don’t match?",
    icon: icon(<><path d="M7 7h10M7 17h10" /><path d="m14 4 3 3-3 3M10 14l-3 3 3 3" /></>) },
  { title: "Compare files", detail: "Check a new manifest or export", prompt: "I have a new vendor manifest",
    icon: icon(<><path d="M8 4h6l4 4v12H8z" /><path d="M14 4v4h4M4 8v12h4" /></>) },
  { title: "Shift handoff", detail: "What’s waiting on a manager", prompt: "What did I leave for my manager?",
    icon: icon(<><path d="M4 12h12M12 8l4 4-4 4" /><path d="M19 5v14" /></>) },
];

function greeting(date = new Date()) {
  const hour = date.getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export function AskMellow({ context, onAction, aside }: {
  context: AskContext;
  onAction: (action: AskAction, answer: AskAnswer) => void;
  aside?: ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [thread, setThread] = useState<{ question: string; answer: AskAnswer; id: number } | null>(null);

  function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed) { input.current?.focus(); return; }
    const answer = ask(trimmed, context);
    setThread({ question: trimmed, answer, id: Date.now() });
    setValue("");
    if (answer.series) onAction({ kind: "series", series: answer.series }, answer);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(value);
  }

  return <section className="ask" aria-labelledby="ask-title">
    <div className="ask-head">
      <div>
        <p className="kicker">Today · Sample workspace</p>
        <h1 id="ask-title">{greeting()}. What do you need?</h1>
      </div>
      {aside}
    </div>
    <form className="composer" onSubmit={onSubmit} role="search">
      <span className="composer-mark" aria-hidden="true">{icon(<><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z" /><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></>)}</span>
      <label htmlFor="ask-input" className="sr-only">Ask Mellow</label>
      <input id="ask-input" ref={input} value={value} onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about a package or today’s checks" autoComplete="off" maxLength={300}
        aria-describedby="ask-note" />
      <button type="submit" className="composer-send">Ask</button>
    </form>
    <p className="ask-note" id="ask-note">Answers come from the sample records on this device. Live AI is off.</p>

    <div className="ask-result" aria-live="polite">
      {thread && <article className="answer" key={thread.id} aria-labelledby="answer-title">
        <p className="answer-question"><span className="sr-only">You asked: </span>{thread.question}</p>
        <h2 id="answer-title">{thread.answer.title}</h2>
        <p>{thread.answer.body}</p>
        {thread.answer.items && thread.answer.items.length > 0 && <ul className="answer-items">
          {thread.answer.items.map((item) => <li key={item.label}><strong>{item.label}</strong><span>{item.detail}</span></li>)}
        </ul>}
        <div className="answer-actions">
          {thread.answer.actions.map((item, index) => <button key={item.label} className={index === 0 ? "answer-primary" : "answer-secondary"}
            onClick={() => onAction(item.action, thread.answer)}>{item.label}</button>)}
          <button className="answer-secondary" onClick={() => { setThread(null); input.current?.focus(); }}>Ask something else</button>
        </div>
      </article>}
    </div>

    {!thread && <div className="quick-actions" role="group" aria-label="Quick actions">
      <div className="quick-head"><span>Quick actions</span><span>One tap to start</span></div>
      <div className="quick-grid">
        {quickActions.map((item) => <button key={item.title} className="quick-card" onClick={() => submit(item.prompt)}>
          <span className="quick-icon">{item.icon}</span>
          <span><strong>{item.title}</strong><small>{item.detail}</small></span>
        </button>)}
      </div>
    </div>}
  </section>;
}
