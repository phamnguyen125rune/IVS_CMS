import { Media } from '@/types/media/media';

export const getFileName = (item: Media) => {
  return item.fileName || 'Không có tên';
};

export const getFileExtension = (item: Media) => {
  if (item.fileType?.trim()) {
    const fileType = item.fileType.toLowerCase().trim();

    if (!fileType.includes('/')) {
      return fileType.replace('.', '').trim();
    }
  }

  const cleanName = (item.fileName || '').split('?')[0].split('#')[0];

  const parts = cleanName.split('.');

  if (parts.length <= 1) {
    return '';
  }

  return parts.pop()?.toLowerCase().trim() || '';
};

export const getMimeType = (item: Media) => {
  return (item.mimeType || item.fileType || '').toLowerCase().trim();
};

export const isImage = (item: Media) => {
  const mimeType = getMimeType(item);

  if (mimeType.startsWith('image/')) {
    return true;
  }

  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif'].includes(
    getFileExtension(item)
  );
};

export const isPdf = (item: Media) => {
  return getMimeType(item) === 'application/pdf' || getFileExtension(item) === 'pdf';
};

export const isWord = (item: Media) => {
  return ['doc', 'docx'].includes(getFileExtension(item));
};

export const isExcel = (item: Media) => {
  return ['xls', 'xlsx', 'xlsm', 'csv'].includes(getFileExtension(item));
};

export const isPowerPoint = (item: Media) => {
  return ['ppt', 'pptx'].includes(getFileExtension(item));
};

export const isArchive = (item: Media) => {
  return ['zip', 'rar', '7z'].includes(getFileExtension(item));
};

export const canPreview = (item: Media) => {
  return isImage(item) || isPdf(item) || isWord(item) || isExcel(item);
};

export const getFileTypeLabel = (item: Media) => {
  const extension = getFileExtension(item);

  if (isImage(item)) return 'Hình ảnh';
  if (isPdf(item)) return 'PDF';
  if (isWord(item)) return 'Word';
  if (isExcel(item)) return 'Excel';
  if (isPowerPoint(item)) return 'PowerPoint';
  if (isArchive(item)) return 'Archive';

  return extension.toUpperCase() || 'FILE';
};
