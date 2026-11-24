import { checkMetrcSandbox } from "./metrc.mjs";

try {
  const result = await checkMetrcSandbox({
    host: process.env.METRC_SANDBOX_HOST,
    vendorKey: process.env.METRC_VENDOR_KEY,
    userKey: process.env.METRC_USER_KEY,
    facilityLicense: process.env.METRC_FACILITY_LICENSE,
  });
  if (!result.facilityAccessible) {
    console.error("Authenticated, but the configured facility was not returned.");
    process.exitCode = 1;
  } else {
    console.log("Metrc sandbox connection verified for the configured facility.");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Metrc sandbox connection failed.");
  process.exitCode = 1;
}
