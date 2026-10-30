/** Locale-aware reference implementation for the date defects in #4471. */
export type ParsedDate = { year: number; month: number; day: number };

function orderFor(locale: string): string[] {
  if (!locale || Intl.DateTimeFormat.supportedLocalesOf([locale]).length !== 1) throw new Error('Supported tenant locale required');
  return new Intl.DateTimeFormat(locale, { calendar: 'gregory', numberingSystem: 'latn', timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(Date.UTC(2026, 0, 2, 12)))
    .filter(part => ['day', 'month', 'year'].includes(part.type))
    .map(part => part.type);
}

/** Derive both parser order and the user-facing hint from the tenant locale. */
export function dateHint(locale: string): string {
  return orderFor(locale).map(part => part === 'year' ? 'YYYY' : part === 'month' ? 'MM' : 'DD').join('/');
}

/** Strictly parse a numeric date in the tenant's order, rejecting invalid values and incomplete years. */
export function parseTenantDate(input: string, locale: string): ParsedDate {
  const order = orderFor(locale);
  const values = input.trim().split(/[/.\-]/);
  if (values.length !== 3 || values.some((value, i) => !(order[i] === 'year' ? /^\d{4}$/ : /^\d{1,2}$/).test(value))) {
    throw new Error(`Expected date in ${dateHint(locale)} format`);
  }
  const numbers = values.map(Number);
  const parts = Object.fromEntries(order.map((part, index) => [part, numbers[index]])) as Record<string, number>;
  const year = parts.year;
  const { month, day } = parts;
  const check = new Date(0);
  check.setUTCFullYear(year, month - 1, day);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) {
    throw new Error(`Invalid calendar date in ${dateHint(locale)} format`);
  }
  return { year, month, day };
}
