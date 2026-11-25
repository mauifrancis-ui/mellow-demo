// Workspace setup (sprint 4, Get started): a name and a first-day checklist. Every step is
// derived from what has happened on this device, never ticked by Mellow on a guess.
export const setupKey = "mellow.workspace";
export const defaultName = "Sample workspace";

export type Setup = { name: string; shared: boolean };

export function readSetup(storage: Pick<Storage, "getItem">): Setup {
  try {
    const saved = JSON.parse(storage.getItem(setupKey) ?? "null") as Partial<Setup> | null;
    return { name: typeof saved?.name === "string" && saved.name.trim() ? saved.name.trim().slice(0, 60) : defaultName, shared: saved?.shared === true };
  } catch { return { name: defaultName, shared: false }; }
}

export type SetupStep = { id: "name" | "compare" | "decide" | "share"; label: string; done: boolean };

export function setupSteps(input: { name: string; comparedSets: number; ownDecisions: number; shared: boolean }): SetupStep[] {
  return [
    { id: "name", label: "Name your workspace", done: input.name !== defaultName },
    { id: "compare", label: "Compare your two files", done: input.comparedSets > 0 },
    { id: "decide", label: "Decide on one of your packages, or leave it for a manager", done: input.ownDecisions > 0 },
    { id: "share", label: "Share the findings or export the decision trail", done: input.shared },
  ];
}
