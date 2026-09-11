export function formatPostDate(value?: string): string {
  if (!value) return '';
  const date = value.slice(0, 10);
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}/${month}/${year}` : date;
}

export function paginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push('ellipsis');
  for (let value = start; value <= end; value += 1) items.push(value);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}
