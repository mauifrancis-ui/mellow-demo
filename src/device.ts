// What Mellow keeps on this device, in plain words, and how to clear it (sprint 4, End use).
// Every key Mellow writes starts with "mellow.", so clearing removes exactly Mellow's data.

export const storagePrefix = "mellow.";

export const storedItems = [
  "Your decisions, the evidence you added and your notes",
  "The packages from files you compared, and the file names (not the files themselves)",
  "The columns you chose for your files, and your workspace name",
  "Notes you dismissed or marked not useful, and why",
  "Whether the side panel is open",
];

export function mellowKeys(storage: Pick<Storage, "length" | "key">) {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(storagePrefix)) keys.push(key);
  }
  return keys;
}

export function clearDevice(storage: Pick<Storage, "length" | "key" | "removeItem">) {
  const keys = mellowKeys(storage);
  keys.forEach((key) => storage.removeItem(key));
  return keys.length;
}
