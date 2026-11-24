import { summarizeLots, type LotCheck } from "./comparison.ts";

type Run = {
  checkedAt: string;
  checked: number;
  matched: number;
  exceptions: number;
};

export type ReceivingPosture = {
  receiving: "current" | "delayed";
  lastSuccessfulRun: Run | null;
};

export function monitorReceiving(
  previous: ReceivingPosture | undefined,
  rows: LotCheck[],
  receiving: ReceivingPosture["receiving"],
  time: string,
): ReceivingPosture {
  if (receiving === "delayed") {
    return { receiving, lastSuccessfulRun: previous?.lastSuccessfulRun ?? null };
  }
  const summary = summarizeLots(rows);
  return {
    receiving,
    lastSuccessfulRun: {
      checkedAt: time,
      checked: summary.checked,
      matched: summary.matched,
      exceptions: summary.different.length + summary.missing.length,
    },
  };
}
