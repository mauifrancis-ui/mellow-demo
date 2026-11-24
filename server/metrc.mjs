import { Buffer } from "node:buffer";

/** A server-only, read-only V2 sandbox connection probe. */
export async function checkMetrcSandbox({
  host, vendorKey, userKey, facilityLicense,
}, fetchImpl = fetch) {
  if (typeof host !== "string" || !/^sandbox-api-[a-z]{2}\.metrc\.com$/.test(host)) {
    throw new Error("Set an approved Metrc sandbox hostname such as sandbox-api-co.metrc.com.");
  }
  if (!vendorKey?.trim() || !userKey?.trim() || !facilityLicense?.trim() || vendorKey.includes(":")) {
    throw new Error("Metrc sandbox vendor key, user key, and facility license are required.");
  }
  const authorization = `Basic ${Buffer.from(`${vendorKey}:${userKey}`, "utf8").toString("base64")}`;
  let response;
  try {
    response = await fetchImpl(`https://${host}/facilities/v2`, {
      method: "GET",
      headers: { Authorization: authorization, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new Error("Could not reach the Metrc sandbox.");
  }
  if (response.status === 401 || response.status === 403) throw new Error("Metrc sandbox denied access.");
  if (response.status === 429) throw new Error("Metrc sandbox rate limited the request. Try again later.");
  if (!response.ok) throw new Error(`Metrc sandbox returned HTTP ${response.status}.`);

  const facilities = await response.json().catch(() => null);
  if (!Array.isArray(facilities)) throw new Error("Metrc sandbox returned an unexpected facilities response.");
  return { facilityAccessible: facilities.some((facility) => facility?.License?.Number === facilityLicense) };
}
