import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import type { Issue } from "./ask";
import { checkedText, currentRules, effectiveText, rulesHeading, rulesScope } from "./rules-tx";
import { storedItems } from "./device";

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

export function LearnPage({ issues, query, onQuery, onAsk, onClearDevice }: {
  issues: Issue[];
  query: string;
  onQuery: (value: string) => void;
  onAsk: (question: string) => void;
  onClearDevice: () => void;
}) {
  const different = issues.filter(({ kind }) => kind === "different").length;
  const gaps = issues.filter(({ kind }) => kind === "missing").length;
  const receiving = issues.filter(({ kind, label }) => kind === "different" || /receiving/i.test(label)).length;
  const terms = [
    { term: "Lot or batch number", seen: issues.length, text: "The identifier that traces a product to the group it was made in. Compare the label with both records." },
    { term: "Receiving record", seen: receiving, text: "What arrived and what staff saw when it did. The first place to look when inventory looks wrong." },
    { term: "Gap", seen: gaps, text: "A detail missing from one or both records, such as a blank lot or no matching receiving entry." },
    { term: "Difference", seen: different, text: "The records disagree about the same package. A person checks the physical label." },
    { term: "Package ID", seen: 0, text: "The tag that ties one package to its records across inventory, receiving and sales." },
    { term: "Manager review", seen: 0, text: "A record left for someone who can decide. It stays visible until they do." },
    { term: "Shift handoff", seen: 0, text: "The package, what disagrees and where to check next, left for the next person." },
    { term: "Evidence", seen: 0, text: "The source you checked and what it showed. Mellow keeps it with every decision." },
  ];
  const needle = query.trim().toLowerCase();
  const shownTerms = terms.filter(({ term, text }) => `${term} ${text}`.toLowerCase().includes(needle));
  const rules = currentRules().filter((rule) => `${rule.title} ${rule.citation} ${rule.agency} ${rule.jurisdiction}`.toLowerCase().includes(needle));
  const seen = terms.filter(({ seen: n }) => n > 0);
  const note = seen.length
    ? `${words[seen.length] ?? seen.length} of these came up in your queue today. Start with ${seen[0].term.toLowerCase()}, since every open record turns on it.`
    : "Nothing is open right now. These are the words Mellow uses when something is.";

  return <div className="ledger">
    <div className="ledger-main">
      <header className="briefing" aria-labelledby="learn-title">
        <p className="kicker">Learn · field guide</p>
        <h1 id="learn-title">The words behind today’s checks.</h1>
        <div className="mellow-says">
          <span className="kicker" aria-hidden="true">Mellow</span>
          <p className="mellow-voice"><span className="sr-only">Mellow says: </span>{note}</p>
        </div>
      </header>
      <section className="glossary" aria-label="Field guide terms">
        <div className="lookup">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
          <label htmlFor="learn-lookup" className="sr-only">Look up a term or reference</label>
          <input id="learn-lookup" type="search" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Look up a term, like manifest or lot" />
          <span className="lookup-count" aria-live="polite">{shownTerms.length} term{shownTerms.length === 1 ? "" : "s"} · {rules.length} rule{rules.length === 1 ? "" : "s"}</span>
        </div>
        {shownTerms.length ? <dl className="terms">{shownTerms.map(({ term, seen: n, text }, index) => <div key={term} className="term" style={{ "--i": index } as CSSProperties}>
          <dt><span>{term}</span>{n > 0 && <span className="seen-tag">Seen today · {n}</span>}</dt>
          <dd>{text}</dd>
        </div>)}</dl> : <p className="ledger-empty">No terms match. Try asking Mellow on Today.</p>}
      </section>
      <section className="rules" aria-labelledby="rules-title">
        <h2 id="rules-title" className="rules-title" tabIndex={-1}>{rulesHeading}</h2>
        <p className="rules-scope">{rulesScope}</p>
        {rules.length ? <ul className="rule-list">{rules.map((rule) => <li key={rule.id} className="rule-entry">
          <p className="kicker">{rule.jurisdiction} · {rule.agency}</p>
          <h3><a href={rule.url} target="_blank" rel="noreferrer">{rule.title}<span className="sr-only"> (opens in a new tab)</span></a></h3>
          <p className="rule-what">{rule.citation}</p>
          <dl className="rule-facts">
            <div><dt>Status</dt><dd>{rule.status}</dd></div>
            <div><dt>Since</dt><dd>{effectiveText(rule)}</dd></div>
            <div><dt>Checked</dt><dd>{checkedText(rule)}</dd></div>
          </dl>
          {rule.statusNote && <p className="rule-note">{rule.statusNote}</p>}
        </li>)}</ul> : <p className="ledger-empty">No rules match.</p>}
        <p className="rules-foot">These link to official pages and were written down on the date shown. Rules change. Read the source before you rely on one, and talk to a licensed attorney about decisions for your business.</p>
      </section>
    </div>

    <aside className="ledger-side" aria-label="Ask and help">
      <section className="ask-terms" aria-labelledby="ask-terms-title">
        <h2 id="ask-terms-title" className="kicker">Ask Mellow</h2>
        <div className="reply-chips">
          {["What counts as a gap?", "Where is the lot on a label?", "Show me the Texas hemp rules", "What can you do?"].map((chip) => <button key={chip} type="button" className="chip" onClick={() => onAsk(chip)}>{chip}</button>)}
        </div>
      </section>
      <HelpSection onClearDevice={onClearDevice} />
    </aside>
  </div>;
}

const limits = [
  "Mellow compares two files on this device. It doesn’t check them against the law.",
  "It doesn’t decide. A person records every decision.",
  "It doesn’t predict audits, inspections or bills.",
  "Live AI is off. Ask “How do you know?” after any answer to see what it was based on.",
];

function HelpSection({ onClearDevice }: { onClearDevice: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  return <section className="help" id="help" aria-labelledby="help-title">
    <h2 id="help-title" className="kicker">Help · what Mellow can’t do</h2>
    <ul className="help-limits">{limits.map((line) => <li key={line}>{line}</li>)}</ul>
    <h3 className="kicker">A decision about your business</h3>
    <p>For a decision about your business, talk to a licensed attorney. Mellow doesn’t recommend or rank law firms.</p>
    <ul className="help-links">
      <li><a href="https://www.texasbar.com/Content/NavigationMenu/ForThePublic/DoYouNeedaLawyer/LawyerReferralServiceLRIS/default.htm" target="_blank" rel="noreferrer">State Bar of Texas Lawyer Referral &amp; Information Service<span className="sr-only"> (opens in a new tab)</span></a><small>A certified referral service. It refers; it doesn’t give legal advice.</small></li>
      <li><a href="https://www.dshs.texas.gov/consumable-hemp-program" target="_blank" rel="noreferrer">DSHS Consumable Hemp Program<span className="sr-only"> (opens in a new tab)</span></a><small>For questions about the hemp rules. Its page lists dshshempprogram@dshs.texas.gov.</small></li>
    </ul>
    <h3 className="kicker">Your data on this device</h3>
    <p>Everything Mellow keeps is in this browser’s storage on this device. Nothing is sent to a server.</p>
    <ul className="help-limits">{storedItems.map((item) => <li key={item}>{item}</li>)}</ul>
    {confirming
      ? <div className="clear-confirm" role="group" aria-labelledby="clear-q">
          <p id="clear-q">Clear all of it from this device? Your decisions and evidence can’t be brought back. Export the decision trail in Activity first if you need it.</p>
          <button ref={confirmButton} type="button" className="ledger-button" onClick={onClearDevice}>Clear this device’s data</button>
          <button type="button" className="ledger-button" data-variant="line" onClick={() => { setConfirming(false); requestAnimationFrame(() => startButton.current?.focus()); }}>Cancel</button>
        </div>
      : <button ref={startButton} type="button" className="ledger-button" data-variant="line" onClick={() => { setConfirming(true); requestAnimationFrame(() => confirmButton.current?.focus()); }}>Clear this device’s data…</button>}
  </section>;
}
