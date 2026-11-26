// One source for every count Mellow shows (sprint 5, data integrity). Today, the panel, Ask,
// Activity, the findings summary and the trail read their numbers from here, so they can't disagree.
// See MELLOW_EVALS.md, section M.
import type { LotCheck } from "./comparison.ts";
import { checksToday, type Run } from "./monitoring.ts";
import { latestDecisions, type Entry, type Task } from "./workspace.ts";

export type LedgerCounts = {
  /** Unique packages compared, from checks and from your own files. */
  packages: number;
  matched: number;
  /** Packages whose records disagree or are missing something. */
  exceptions: number;
  /** Everything flagged for a person: every task. flagged = open + decided. */
  flagged: number;
  open: number;
  manager: number;
  recorded: number;
  notAnIssue: number;
  /** recorded + notAnIssue + manager */
  decided: number;
  /** Checks run since midnight. */
  checks: number;
  /** Exceptions with no task. Always zero; a test holds it there. */
  untracked: string[];
};

export function ledgerCounts(input: { comparison: LotCheck[]; tasks: Task[]; history: Entry[]; runs: Run[]; now?: Date }): LedgerCounts {
  const latest = latestDecisions(input.history);
  let open = 0, manager = 0, recorded = 0, notAnIssue = 0;
  for (const task of input.tasks) {
    const state = latest.get(task.id);
    if (!state || state === "Reopened") open += 1;
    else if (state === "Manager review requested") manager += 1;
    else if (state === "Approved") recorded += 1;
    else if (state === "Dismissed") notAnIssue += 1;
  }
  const exceptionRows = input.comparison.filter(({ state }) => state !== "match");
  const tracked = new Set(input.tasks.map(({ record }) => record));
  return {
    packages: input.comparison.length,
    matched: input.comparison.length - exceptionRows.length,
    exceptions: exceptionRows.length,
    flagged: input.tasks.length,
    open, manager, recorded, notAnIssue,
    decided: recorded + notAnIssue + manager,
    checks: checksToday(input.runs, input.now).length,
    untracked: exceptionRows.map(({ packageId }) => packageId).filter((id) => !tracked.has(id)),
  };
}

/** The check that first compared a package, if any. */
export function checkFor(runs: Run[], packageId: string) {
  return runs.find(({ ids }) => ids.includes(packageId));
}
