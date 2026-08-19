export function formatDate(dateStr?: string) {
  if (!dateStr) {
    return 'N/A';
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
