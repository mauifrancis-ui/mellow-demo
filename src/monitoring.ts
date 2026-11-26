import { sampleBatchRows, summarizeLots, type LotCheck } from "./comparison.ts";

export type Run = {
  checkedAt: string;
  checked: number;
  matched: number;
  different: number;
  missing: number;
  exceptions: number;
  /** The packages this check compared for the first time. Each package belongs to one check. */
  ids: string[];
};

export type ReceivingPosture = {
  receiving: "current" | "delayed";
  lastSuccessfulRun: Run | null;
  runs: Run[];
  delayedAt: string | null;
};

const MINUTE = 60 * 1000;

function run(checkedAt: string, rows: LotCheck[]): Run {
  const summary = summarizeLots(rows);
  return { checkedAt, checked: summary.checked, matched: summary.matched, different: summary.different.length,
    missing: summary.missing.length, exceptions: summary.different.length + summary.missing.length, ids: rows.map(({ packageId }) => packageId) };
}

/** Today's sample checks, spread evenly between this morning and now, all on today's date. The last one is "now". */
export function sampleRuns(now: string): Run[] {
  const end = new Date(now).getTime();
  const midnight = new Date(now); midnight.setHours(0, 1, 0, 0);
  const start = Math.max(midnight.getTime(), end - 7 * 60 * MINUTE);
  const batches = sampleBatchRows();
  const step = batches.length > 1 ? (end - start) / (batches.length - 1) : 0;
  return batches.map((rows, index) => run(new Date(Math.round(start + step * index)).toISOString(), rows));
}

/** Checks whose time falls on the same local day as `now`. */
export function checksToday(runs: Run[], now = new Date()) {
  return runs.filter(({ checkedAt }) => new Date(checkedAt).toDateString() === now.toDateString());
}

/**
 * Record a check of newly arrived packages. `batch` holds only the packages compared for the first time,
 * so a package is never counted twice. Restoring a delayed source records no new check.
 */
export function monitorReceiving(
  previous: ReceivingPosture | undefined,
  batch: LotCheck[],
  receiving: ReceivingPosture["receiving"],
  time: string,
  history: Run[] = [],
): ReceivingPosture {
  const runs = previous?.runs ?? history;
  if (receiving === "delayed") {
    return { receiving, lastSuccessfulRun: previous?.lastSuccessfulRun ?? null, runs, delayedAt: time };
  }
  if (previous?.receiving === "delayed" && !batch.length) {
    return { receiving, lastSuccessfulRun: previous.lastSuccessfulRun, runs, delayedAt: null };
  }
  const latest = run(time, batch);
  return { receiving, lastSuccessfulRun: latest, runs: [...runs, latest], delayedAt: null };
}

/** The opening sample state: today's checks, all current. */
export function samplePosture(now: string): ReceivingPosture {
  const runs = sampleRuns(now);
  return { receiving: "current", lastSuccessfulRun: runs.at(-1) ?? null, runs, delayedAt: null };
}
