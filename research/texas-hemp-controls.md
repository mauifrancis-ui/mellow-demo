# Texas hemp · draft controls for inspection prep (sprint 5, C1)

**Status: drafted from the rule text · citations checked against the rule text by the founder (2026-11-25) · not reviewed by a regulatory expert.** This is a working list for sprint 6. It isn't legal advice, and nothing here ships until Compliance and Risk sign off.

- **Prepared by:** Research, with Compliance and Risk.
- **Sources** (opened 2026-11-25):
  - Texas Health and Safety Code ch. 443: https://tcss.legis.texas.gov/resources/HS/htm/HS.443.htm
  - 25 TAC ch. 300, DSHS's published copy of the adopted rules (file dated 3.31.26): https://www.dshs.texas.gov/sites/default/files/CP-Hemp/docs/chapter-300-chp-rules-3.31.26.pdf
  - Texas Register, March 20, 2026, adopted rules: https://www.sos.texas.gov/texreg/archive/March202026/Adopted%20Rules/25.HEALTH%20SERVICES.html
- **Caveats:**
  - The rule text was read through a summarizing fetch tool, so every citation and quote below needs a person to check it against the PDF before sprint 6 builds it.
  - The PDF's own text doesn't state its effective date; the Rules registry records 2026-03-31 from DSHS's program page.
  - Parts of the rules are in litigation; see the Rules entry.

## Scope

- **Segment:** retail hemp registrants, the first segment.
- **Inputs Mellow has:** an inventory export and a receiving log, each with a package ID and a lot or batch column. Optional columns some files have, like a batch date or a COA link, would let more controls be checked.

## Statuses

Each control reports only these, as counts per package. Never met, compliant or ready.
- On file
- Missing
- Can't check from these files

## Draft controls

| # | Control (plain words) | Cited rule | What Mellow can check from records | Status from two CSVs today |
| --- | --- | --- | --- | --- |
| H1 | Each package has a batch ID on file. | 25 TAC §300.402(a)(1); HSC §443.205(a) (label must carry a batch identification number) | Inventory batch/lot field present and not blank, per package | **Checkable:** On file / Missing |
| H2 | The batch you received is the batch you list. | Supports recall identification under 25 TAC §300.207(a)(1). *The rule doesn't itself require two records to agree; say so in the UI.* | Inventory batch equals receiving batch, per package | **Checkable:** On file (agree) / Missing (one side blank). Disagreements are already Mellow's core finding. |
| H3 | Each batch has a batch date on file. | 25 TAC §300.402(a)(2); HSC §443.205(a) | Only if a batch-date column exists | **Can't check from these files** unless that column is present |
| H4 | Each batch has a certificate of analysis link on file. | 25 TAC §300.402(a)(6); HSC §443.205(a) | Only if a COA URL column exists. Mellow doesn't open or judge the COA. | **Can't check from these files** unless that column is present |
| H5 | The certificate of analysis isn't expired. | 25 TAC §300.301(f) | Needs COA dates | **Can't check from these files** |
| H6 | Records are kept on site for at least three years. | 25 TAC §300.203(a), (c) | Mellow only knows this device. The decision trail export is evidence the person can keep. | **Can't check from these files** |
| H7 | Every buyer's age is checked with a valid ID before a sale. | 25 TAC §300.701(b), (c); 16 TAC §35.6 (TABC licensees) | Sales aren't in receiving files | **Can't check from these files** |
| H8 | Each retail location is registered. | HSC §443.2025(b), (e) | Not in records | **Can't check from these files** |
| H9 | There's a written recall procedure. | 25 TAC §300.207(a) | Not in records | **Can't check from these files** |

## What this means for sprint 6

- Two controls (H1, H2) can be counted from today's files. Two more (H3, H4) can be counted when the files carry those columns, so remembered columns should learn them.
- The rest are honestly "Can't check from these files". The binder lists them with their citation as "Evidence you'll want on hand", without counting them.
- Every count opens into: the rule (linked), the evidence (which file, which row), and the packages.
- The labels "Drafted from the rule text · not reviewed by a regulatory expert" and "For a decision about your business, talk to a licensed attorney" stay until the founder names a reviewer.

## Open questions for an expert
1. Does a retailer's own inventory and receiving record count as part of the records under §300.203?
2. Should H2 (batch agreement) appear in an inspection binder at all, given no rule requires two records to agree?
3. Which "Can't check" items does an inspector typically ask to see first?
