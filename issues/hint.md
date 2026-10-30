# Booking-v3 date hint contradicts day-first form parsing — 33 reports from #4471

The exported desk classifier assigns **33 distinct reports** in #4471 to the hint problem, across alder.physio, copper.studio and pale.harbour, received 2026-04-17 through 2026-09-22.

These day-first tenants use booking-v3. Its date field prints MM/DD/YYYY while the form reads input using the tenant's day-first convention. Following the hint therefore swaps the intended day and month. R-41230 (copper.studio, es-ES, form) reports that a client arrived on 1 June instead of 6 January. R-41241 (alder.physio, de-DE, form) reports 6 August appearing as 8 June.

Expected: the displayed date hint and the form parser agree with the tenant's configured convention. Actual: the month-first hint contradicts the day-first form parser. Fix the hint independently of the shared-parser issue; do not leave these reports hidden under the queued parser fix.

Count method: deduplicate reports-4471.json by ID, filter mergedInto === 4471, join tenant configuration, then run causes.ts groupByCause. A form-channel report for a day-first booking-v3 tenant is assigned hint. Intake tags are not reliable: 15 of these reports were tagged parser, while 18 were tagged hint. See analysis.json for all report IDs and the signed decision page for rendered evidence.

Proposed acceptance checks:
- Generate the hint from the same locale convention used by the form parser.
- Verify the date shown, submitted, saved and included in the invite agree for all three affected tenants.
- Test ambiguous dates and days above twelve, with booking-v2 and month-first controls.
- Keep app/email reports for these tenants assigned to the separate parser investigation.
