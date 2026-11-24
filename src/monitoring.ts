import { summarizeLots, type LotCheck } from "./comparison.ts";

export type Run = {
  checkedAt: string;
  checked: number;
  matched: number;
  different: number;
  missing: number;
  exceptions: number;
};

export type ReceivingPosture = {
  receiving: "current" | "delayed";
  lastSuccessfulRun: Run | null;
  runs: Run[];
  delayedAt: string | null;
};

const HISTORY = 8;
const HOUR = 60 * 60 * 1000;

// Fictional earlier checks for the preview chart: matched, difference, gap.
const sampleEarlierRuns: [number, number, number][] = [
  [6, 0, 0], [9, 1, 0], [4, 0, 1], [11, 0, 0], [7, 1, 1], [5, 0, 0], [8, 0, 1],
];

function run(checkedAt: string, matched: number, different: number, missing: number): Run {
  return { checkedAt, checked: matched + different + missing, matched, different, missing, exceptions: different + missing };
}

export function sampleHistory(before: string): Run[] {
  const end = new Date(before).getTime();
  return sampleEarlierRuns.map(([matched, different, missing], index) =>
    run(new Date(end - (sampleEarlierRuns.length - index) * HOUR).toISOString(), matched, different, missing));
}

export function monitorReceiving(
  previous: ReceivingPosture | undefined,
  rows: LotCheck[],
  receiving: ReceivingPosture["receiving"],
  time: string,
  history: Run[] = [],
): ReceivingPosture {
  const runs = previous?.runs ?? history;
  if (receiving === "delayed") {
    return { receiving, lastSuccessfulRun: previous?.lastSuccessfulRun ?? null, runs, delayedAt: time };
  }
  const summary = summarizeLots(rows);
  const latest = run(time, summary.matched, summary.different.length, summary.missing.length);
  return { receiving, lastSuccessfulRun: latest, runs: [...runs, latest].slice(-HISTORY), delayedAt: null };
}
