'use client';

import { Download, File, FileArchive, FileSpreadsheet, FileText, Presentation } from 'lucide-react';

import { Media } from '@/types/media/media';
import { getFileExtension, getFileTypeLabel } from '@/utils/media/media-file';

import '@/components/layout/admin/media_styles/UnsupportedPreview.css';

interface UnsupportedPreviewProps {
  file: Media;
  onDownload: (file: Media) => void;
}

export default function UnsupportedPreview({ file, onDownload }: UnsupportedPreviewProps) {
  const extension = getFileExtension(file);

  const getIcon = () => {
    if (['zip', 'rar', '7z'].includes(extension)) {
      return <FileArchive size={50} />;
    }

    if (['ppt', 'pptx'].includes(extension)) {
      return <Presentation size={50} />;
    }

    if (['xls', 'xlsx', 'xlsm', 'csv'].includes(extension)) {
      return <FileSpreadsheet size={50} />;
    }

    if (['doc', 'docx', 'pdf'].includes(extension)) {
      return <FileText size={50} />;
    }

    return <File size={50} />;
  };

  return (
    <div className="unsupported-preview">
      <div className="unsupported-preview__card">
        <div className="unsupported-preview__icon">{getIcon()}</div>

        <div className="unsupported-preview__type">
          <span>{getFileTypeLabel(file)}</span>
        </div>

        <h3 className="unsupported-preview__title">Không hỗ trợ xem trực tiếp</h3>

        <p className="unsupported-preview__description">
          File <strong>{extension.toUpperCase()}</strong> không thể hiển thị trực tiếp trên trình
          duyệt. Vui lòng tải file xuống để mở bằng ứng dụng tương ứng.
        </p>

        <button
          type="button"
          onClick={() => onDownload(file)}
          className="unsupported-preview__download"
        >
          <Download size={17} />
          Tải file xuống
        </button>
      </div>
    </div>
  );
}
