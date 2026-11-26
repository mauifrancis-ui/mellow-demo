// The sample workspace, from the prototype dataset (sprint 7, DB2). Two fictional stores; today's
// shift for the chosen store. Each manifest that arrived today is one check. Store-scoped keys keep
// each store's decisions apart on this device.
import today from "./today.json" with { type: "json" };
import type { Run } from "../monitoring.ts";
import { summarizeLots } from "../comparison.ts";
import { compareShipments, shipmentIssue, type ShipmentCheck, type ShipmentData } from "../shipments.ts";
import type { Task, Workspace } from "../workspace.ts";

export const datasetVersion = today.version;
export const stores = today.facilities.map((f) => ({ id: f.license_number, name: f.name }));
export const storeKey = "mellow.store";

export function currentStore(storage: Pick<Storage, "getItem"> | undefined = typeof localStorage === "undefined" ? undefined : localStorage) {
  try {
    const saved = storage?.getItem(storeKey);
    return stores.some(({ id }) => id === saved) ? saved! : stores[0].id;
  } catch { return stores[0].id; }
}

/** A storage key scoped to the current store, so each store keeps its own decisions. */
export function scoped(key: string, store = currentStore()) {
  return store === stores[0].id ? key : `${key}.${store}`;
}

export type StoreSample = { store: string; name: string; comparison: ShipmentCheck[]; tasks: Task[]; runs: Run[] };

export function sampleFor(store: string, now = new Date()): StoreSample {
  const comparison = compareShipments(today as unknown as ShipmentData, store);
  const tasks: Task[] = comparison.filter(({ state }) => state !== "match").map((row, index) => ({
    id: row.packageId, record: row.packageId, source: "Sample inventory export", line: index + 1, sample: true,
    observation: shipmentIssue(row)?.detail ?? "Check this package.",
  }));
  // One check per manifest that arrived today. If it's earlier in the day than the sample's last
  // delivery, the deliveries are spread between midnight and now, so every check is in the past.
  const arrivals = today.manifests.filter((m) => m.recipient_license === store)
    .map((m) => ({ ...m, minute: Number(m.arrived_time.slice(0, 2)) * 60 + Number(m.arrived_time.slice(3)) }))
    .sort((a, b) => a.minute - b.minute);
  const nowMinute = now.getHours() * 60 + now.getMinutes();
  const first = arrivals[0]?.minute ?? 0, last = arrivals.at(-1)?.minute ?? 0;
  const end = Math.max(1, nowMinute - 1);
  const start = Math.max(1, end - (last - first));
  const place = (minute: number) => last <= end ? minute : start + (last === first ? 0 : Math.round(((minute - first) / (last - first)) * (end - start)));
  const runs: Run[] = arrivals.map((manifest, index) => {
    const when = new Date(now); when.setHours(0, place(manifest.minute), 0, 0);
    // Packages that aren't on any manifest arrive with the last delivery.
    const batch = comparison.filter((row) => row.manifest === manifest.manifest_number
      || (index === arrivals.length - 1 && !arrivals.some((m) => m.manifest_number === row.manifest)));
    const summary = summarizeLots(batch);
    return { checkedAt: when.toISOString(), checked: summary.checked, matched: summary.matched, different: summary.different.length,
      missing: summary.missing.length, exceptions: summary.different.length + summary.missing.length, ids: batch.map(({ packageId }) => packageId) };
  });
  return { store, name: stores.find(({ id }) => id === store)?.name ?? store, comparison, tasks, runs };
}

export function sampleWorkspace(sample: StoreSample): Workspace {
  return { tasks: sample.tasks, drafts: {}, history: [] };
}
