'use client';

import { useEffect, useState } from 'react';

import { Media } from '@/types/media/media';

import '@/components/layout/admin/media_styles/PdfPreview.css';

interface PdfPreviewProps {
  file: Media;
  onDownload: (file: Media) => void;
}

export default function PdfPreview({ file, onDownload }: PdfPreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v1/media/${file.mediaId}/view`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();

        objectUrl = URL.createObjectURL(blob);

        setBlobUrl(objectUrl);
      } catch (error) {
        console.error('Lỗi preview PDF:', error);

        setError('Không thể xem file PDF.');
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file.mediaId]);

  if (loading) {
    return (
      <div className="pdf-loading">
        <div className="pdf-spinner" />

        <p>Đang tải PDF...</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="pdf-error">
        <div>
          <h3>Không thể xem PDF</h3>

          <p>{error || 'Không thể tải file PDF.'}</p>

          <button type="button" onClick={() => onDownload(file)}>
            Tải file xuống
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-preview-container">
      <iframe src={blobUrl} className="pdf-preview-frame" title={file.fileName} />
    </div>
  );
}
