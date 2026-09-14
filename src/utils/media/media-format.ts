export const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null) {
    return '-';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (date?: string) => {
  if (!date) {
    return '-';
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return '-';
  }

  return parsedDate.toLocaleDateString('vi-VN');
};
