# sample-v1 · Mellow prototype dataset (fictional)

**Every record here is invented.**
- License numbers start with `SAMPLE-`.
- Certificate links point to `example.com`.
- Store and supplier names are made up.

The data is shaped like how tracked cannabis states record packages, manifests and receiving (Metrc-like). It isn't Metrc data. Real package tags are 24 characters; these use short `PKG-` labels so they read on a phone.

- **Generate:** `node scripts/generate-dataset.mjs` (seed `20261126`). The output is identical every time.
- **Time:** `day` runs from -89 to 0. Day 0 is "today" in the app, which places deliveries before the current time.

| Table | Rows (about) | Columns |
| --- | --- | --- |
| facilities | 2 | license_number, name, type, city |
| suppliers | 6 | license_number, name, license_type |
| items | 19 | item_id, name, category, unit_of_measure (Grams or Each) |
| batches | 141 | batch_id, item_id, supplier_license, batch_day, coa_url, coa_issued_day, coa_expires_day, lab_testing_state |
| manifests | 641 | manifest_number, shipper_license, recipient_license, departed_day/time, arrived_day/time |
| manifest_lines | 1,906 | manifest_number, package_label, item_id, batch_id, shipped_quantity, unit |
| receiving_log | 1,903 | received_day/time, facility, package_label, manifest_number, batch_id_recorded, received_quantity, unit, received_by_role, note |
| inventory | 1,915 | facility, package_label, item_id, batch_id_listed, quantity_on_hand, unit, location, last_counted_day |
| answer_key | 130 | package_label, facility, day, issue, injected_by |

## Planted problems (answer_key)

| Issue | How it's planted | Rate (assumption) |
| --- | --- | --- |
| lot_mismatch | Inventory lists another batch of the same item | 0.8% of packages |
| missing_lot | Inventory's batch field is blank | 0.6% |
| missing_receipt | Manifest and inventory have it; the receiving log doesn't | 0.4% |
| left_off_manifest | Received and in inventory, but no manifest line | 0.3% |
| quantity_variance | Received short of the shipped quantity (with a note) | 0.9% |
| coa_missing | The batch has no COA link (batch-level, about 2.5% of batches) | |
| coa_expired | The COA expired before the batch arrived (about 1.5% of batches) | |

**About the rates:**
- **They're assumptions, about 3.5% overall.** They mirror the error types in Metrc's transfer best-practice bulletins (wrong package, wrong quantity, packages left off). Interviews (V1) should replace them.
- **Day 0 is a staged shift** with more problems than the base rate, so the demo has work: 5 at North Store, 4 at River Store. The answer key marks these `staged shift`.

## Accuracy (tests/dataset.test.mjs, D5)

- **Result:** Mellow's comparison scores 100% precision and recall against this answer key, for every shipment issue type.
- **What that proves:** the comparison logic is correct on a known set.
- **What it doesn't prove:** how Mellow would do on real operator data, where errors are messier. Don't quote these scores as a product claim.
