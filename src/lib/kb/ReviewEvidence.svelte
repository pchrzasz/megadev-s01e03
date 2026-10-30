<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const reports = uniqueById(raw as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const exceptions = reports.filter(r => notes.oneDayMove.includes(r.id));
  const months = [...new Set(reports.map(r => r.receivedAt.slice(0, 7)))].sort();
</script>

<p>The export has {raw.length} rows: {raw.length - uniqueById(raw as Report[]).length} repeated IDs are removed before counting. All {reports.length} distinct reports belong to #4471. Intake tags disagree with tenant-based classification on {groups.reduce((n, g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0)} reports.</p>

<h3>Receipt time is not merge time</h3>
<table>
  <thead><tr><th>Month</th><th>Received</th><th>Merged</th></tr></thead>
  <tbody>{#each months as month}<tr><td>{month}</td><td>{reports.filter(r => r.receivedAt.startsWith(month)).length}</td><td>{reports.filter(r => r.mergedAt?.startsWith(month)).length}</td></tr>{/each}</tbody>
</table>

<h3>Unresolved symptoms within the parser group</h3>
<p>The desk flags {exceptions.length} reports as one-day moves. They remain counted in parser according to the supplied classification, but the text does not establish that they share its root cause. Preserve their evidence for follow-up; do not invent a timezone diagnosis or count them twice.</p>
<ul>{#each exceptions as report}<li><strong>{report.id}</strong> — {report.body}</li>{/each}</ul>
