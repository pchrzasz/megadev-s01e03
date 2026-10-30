# Shared parser reads day-first tenant dates month first — 379 reports from #4471

The exported desk classifier assigns **379 distinct reports** in #4471 to the parser problem, across 11 tenants, received 2026-04-01 through 2026-10-04.

The shared parser reads dates month first although these tenants write the day first. R-41200 (harbour.dental, en-GB, app) reports that 7 April became 4 July. R-41201 describes the inverse swap.

Expected: interpret input according to the tenant's configured date convention. Actual: month-first parsing swaps the day and month for ambiguous dates. This is separate from the booking-v3 form hint defect.

Count method: deduplicate reports-4471.json by ID, filter mergedInto === 4471, join tenant configuration, then run causes.ts groupByCause. The 427 exported rows contain only 412 unique reports. Do not group by browserLocale or meta.intakeTag: 23 reports assigned to parser were tagged hint. See analysis.json for the full ID membership and the signed decision page for the rendered evidence.

Caveat: R-41202, R-41209, R-41236, R-41344 and R-41620 remain inside this 379 count under the supplied classifier. desk-notes.json flags them as one-day moves, but their bodies include different or unexplained timing symptoms. This classification does not prove they share the parser root cause. Investigate them without double counting or inventing a timezone cause.

Proposed acceptance checks:
- Use tenant locale for the shared parser; explicitly handle ambiguous or invalid input.
- Test day-first tenants through app, email and booking-v2 form paths, including days above twelve.
- Keep month-first behavior correct in a control tenant.
- Investigate the five exceptional reports and document any evidence-based reassignment.
- Verify new incoming reports after deployment; known status and a queued fix do not establish resolution.
