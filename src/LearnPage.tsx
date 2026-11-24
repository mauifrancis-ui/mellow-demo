import type { CSSProperties } from "react";
import type { Issue } from "./ask";

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

const references = [
  { title: "USDA Hemp Program", authority: "USDA Agricultural Marketing Service", jurisdiction: "Federal", url: "https://www.ams.usda.gov/rules-regulations/hemp" },
  { title: "Texas DSHS Consumable Hemp Program", authority: "Texas Department of State Health Services", jurisdiction: "Texas", url: "https://www.dshs.texas.gov/consumable-hemp-program" },
  { title: "Hemp Products Guide", authority: "Texas State Law Library", jurisdiction: "Texas", url: "https://guides.sll.texas.gov/cannabis/hemp-products" },
];

export function LearnPage({ issues, query, onQuery, onAsk }: {
  issues: Issue[];
  query: string;
  onQuery: (value: string) => void;
  onAsk: (question: string) => void;
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
  const shownRefs = references.filter((item) => `${item.title} ${item.authority} ${item.jurisdiction}`.toLowerCase().includes(needle));
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
          <span className="lookup-count" aria-live="polite">{shownTerms.length} term{shownTerms.length === 1 ? "" : "s"}</span>
        </div>
        {shownTerms.length ? <dl className="terms">{shownTerms.map(({ term, seen: n, text }, index) => <div key={term} className="term" style={{ "--i": index } as CSSProperties}>
          <dt><span>{term}</span>{n > 0 && <span className="seen-tag">Seen today · {n}</span>}</dt>
          <dd>{text}</dd>
        </div>)}</dl> : <p className="ledger-empty">No terms match. Try asking Mellow on Today.</p>}
      </section>
    </div>

    <aside className="ledger-side" aria-label="References">
      <section className="ledger-queue" aria-labelledby="refs-title">
        <div className="queue-head"><h2 id="refs-title" className="kicker">References · {shownRefs.length}</h2><span>Primary sources</span></div>
        <div className="margin-note">
          <span className="kicker">Note</span>
          <p className="mellow-voice">Effective dates and license scope aren’t verified yet. Confirm with the issuing authority before you rely on a rule.</p>
        </div>
        <ul className="references">{shownRefs.map((item, index) => <li key={item.url} style={{ "--i": index } as CSSProperties}>
          <a href={item.url} target="_blank" rel="noreferrer">
            <span className="ref-scope">{item.jurisdiction}</span>
            <span className="ref-body">
              <strong>{item.title}</strong>
              <small>{item.authority}</small>
              <span className="ref-status"><span aria-hidden="true" />Not yet verified</span>
            </span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>)}</ul>
      </section>
      <section className="ask-terms" aria-labelledby="ask-terms-title">
        <h2 id="ask-terms-title" className="kicker">Ask about a term</h2>
        <div className="reply-chips">
          {["What counts as a gap?", "Where is the lot on a label?"].map((chip) => <button key={chip} type="button" className="chip" onClick={() => onAsk(chip)}>{chip}</button>)}
        </div>
      </section>
    </aside>
  </div>;
}
