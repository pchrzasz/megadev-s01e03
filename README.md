# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review

New signed proposal: `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`.
Its HTML snapshot is `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.
The original exported pages and classification code are preserved. The new
proposal supersedes decision 0001 only after desk acceptance.

Use Node.js 24 or newer:

```sh
npm ci
npm run analyze
npm run render
python3 -m http.server 8033 --bind 127.0.0.1 --directory rendered
```

Then open http://127.0.0.1:8033/kb/decisions/0002-dedupe-by-cause/ .
The renderer executes mdsvex and the actual Svelte components, including the
locale lookup, report grouping, timeline and signature-derived desk reference.
The HTML files are static snapshots: explorer controls show their initial
state and the computed example table; they are not hydrated interactive apps.
Re-render to refresh values after a data or source change.

`analysis.json` records each group's report IDs. `issues/` contains the two
proposed GitHub issue bodies. No product fix or desk acceptance is claimed.
