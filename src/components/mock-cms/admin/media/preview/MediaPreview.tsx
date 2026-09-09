'use client';

import { Download, X } from 'lucide-react';

import { Media } from '@/types/media/media';

import {
  getFileExtension,
  getFileName,
  getFileTypeLabel,
  isExcel,
  isImage,
  isPdf,
  isWord,
} from '@/utils/media/media-file';

import { formatDate, formatFileSize } from '@/utils/media/media-format';

import ImagePreview from './ImagePreview';
import PdfPreview from './PdfPreview';
import WordPreview from './WordPreview';
import ExcelPreview from './ExcelPreview';
import UnsupportedPreview from './UnsupportedPreview';

interface MediaPreviewProps {
  file: Media;
  onClose: () => void;
  onDownload: (file: Media) => void;
}

export default function MediaPreview({ file, onClose, onDownload }: MediaPreviewProps) {
  const image = isImage(file);

  const pdf = isPdf(file);

  const word = isWord(file);

  const excel = isExcel(file);

  const unsupported = !image && !pdf && !word && !excel;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-[#08142f]" title={getFileName(file)}>
              {getFileName(file)}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {getFileTypeLabel(file)}

              {' • '}

              {formatFileSize(file.fileSize)}

              {' • '}

              {formatDate(file.uploadedAt)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            title="Đóng"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}

        <div className="min-h-0 flex-1 overflow-auto bg-gray-100">
          {image && <ImagePreview file={file} />}

          {pdf && <PdfPreview file={file} onDownload={onDownload} />}

          {word && <WordPreview file={file} onDownload={onDownload} />}

          {excel && <ExcelPreview file={file} onDownload={onDownload} />}

          {unsupported && <UnsupportedPreview file={file} onDownload={onDownload} />}
        </div>

        {/* FOOTER */}

        <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-5 py-4">
          <button
            onClick={() => onDownload(file)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} />
            Tải xuống
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
