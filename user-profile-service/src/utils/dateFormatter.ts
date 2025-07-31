export function convertDMYToISO(dateStr: string): string | null {
  const [day, month, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString();
}
