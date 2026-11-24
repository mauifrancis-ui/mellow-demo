import assert from "node:assert/strict";
import { test } from "node:test";
import { checkMetrcSandbox } from "../server/metrc.mjs";

const config = {
  host: "sandbox-api-co.metrc.com", vendorKey: "fixture-vendor",
  userKey: "fixture-user", facilityLicense: "fixture-license",
};

test("Metrc probe uses only the sandbox facilities GET and reports the configured facility", async () => {
  const result = await checkMetrcSandbox(config, async (url, options) => {
    assert.equal(url, "https://sandbox-api-co.metrc.com/facilities/v2");
    assert.equal(options.method, "GET");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, "Basic " + Buffer.from("fixture-vendor:fixture-user").toString("base64"));
    return Response.json([{ License: { Number: config.facilityLicense } }]);
  });
  assert.deepEqual(result, { facilityAccessible: true });
});

test("Metrc probe blocks production hosts and handles authorization and rate limits", async () => {
  await assert.rejects(checkMetrcSandbox({ ...config, host: "api-co.metrc.com" }, () => assert.fail("unexpected request")), /sandbox hostname/);
  for (const [status, message] of [[403, /denied access/], [429, /rate limited/]]) {
    await assert.rejects(checkMetrcSandbox(config, async () => new Response("", { status })), message);
  }
  assert.deepEqual(await checkMetrcSandbox(config, async () => Response.json([])), { facilityAccessible: false });
});
