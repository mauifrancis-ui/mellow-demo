import type { AskAnswer, Series } from "./ask.ts";

// What the right-hand panel shows. It follows the conversation, and it only
// changes when the person asks something or chooses a view.
export type PanelView =
  | { kind: "queue" }
  | { kind: "package"; id: string }
  | { kind: "series"; series: Series }
  | { kind: "summary" }
  | { kind: "handoff" };

export const queueView: PanelView = { kind: "queue" };

export function panelFor(answer: AskAnswer): PanelView | null {
  switch (answer.intent) {
    case "package": return answer.focusId ? { kind: "package", id: answer.focusId } : null;
    case "gaps": return { kind: "series", series: "missing" };
    case "differences": return { kind: "series", series: "different" };
    case "matched": return { kind: "series", series: "matched" };
    case "summary":
    case "source": return { kind: "summary" };
    case "handoff": return { kind: "handoff" };
    case "list":
    case "next":
    case "label": return queueView;
    default: return null;
  }
}

const seriesLabel: Record<Series, string> = { missing: "Today’s gaps", different: "Disagreements", matched: "Matched packages" };

export function panelLabel(view: PanelView) {
  switch (view.kind) {
    case "queue": return "Today’s queue";
    case "package": return view.id;
    case "series": return seriesLabel[view.series];
    case "summary": return "Today’s checks";
    case "handoff": return "Shift handoff";
  }
}

export function sameView(a: PanelView, b: PanelView) {
  return JSON.stringify(a) === JSON.stringify(b);
}
