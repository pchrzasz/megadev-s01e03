import test from 'node:test';
import assert from 'node:assert/strict';
import { dateHint, parseTenantDate } from '../src/lib/kb/tenant-date.ts';

test('parser order and hint agree for day-first and month-first tenants', () => {
  assert.equal(dateHint('de-DE'), 'DD/MM/YYYY');
  assert.deepEqual(parseTenantDate('06/01/2026', 'de-DE'), {day:6, month:1, year:2026});
  assert.equal(dateHint('en-US'), 'MM/DD/YYYY');
  assert.deepEqual(parseTenantDate('06/01/2026', 'en-US'), {month:6, day:1, year:2026});
});

test('leap days are validated and malformed dates rejected', () => {
  assert.deepEqual(parseTenantDate('29/02/2024', 'de-DE'), {day:29, month:2, year:2024});
  assert.throws(() => parseTenantDate('29/02/2025', 'de-DE'), /Invalid calendar date/);
  assert.throws(() => parseTenantDate('31/13/2026', 'de-DE'), /Invalid calendar date/);
  assert.throws(() => parseTenantDate('1 June', 'de-DE'), /Expected date/);
});

test('day-first form hint and form parser use the same convention', () => {
  const hint = dateHint('es-ES');
  const sample = hint.startsWith('DD') ? '06/01/2026' : '01/06/2026';
  assert.deepEqual(parseTenantDate(sample, 'es-ES'), {day:6, month:1, year:2026});
});

test('missing locale and incomplete years cannot silently change the date', () => {
  assert.throws(() => parseTenantDate('06/01/26', 'de-DE'));
  assert.throws(() => parseTenantDate('06/01/2026', ''));
  assert.throws(() => parseTenantDate('06/01/2026', 'zz-ZZ'));
  assert.deepEqual(parseTenantDate('06/01/0099', 'de-DE'), {day:6, month:1, year:99});
});
