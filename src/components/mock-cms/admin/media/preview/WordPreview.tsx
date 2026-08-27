'use client';

import { useEffect, useRef, useState } from 'react';

import { renderAsync } from 'docx-preview';

import { Media } from '@/types/media/media';

import '@/components/layout/admin/media_styles/WordPreview.css';

interface WordPreviewProps {
  file: Media;
  onDownload: (file: Media) => void;
}

export default function WordPreview({ file, onDownload }: WordPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadWord = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v1/media/${file.mediaId}/view`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            resolve();
          });
        });

        if (cancelled) {
          return;
        }

        const container = previewRef.current;

        if (!container) {
          throw new Error('Không tìm thấy vùng preview Word.');
        }

        container.innerHTML = '';

        await renderAsync(blob, container, undefined, {
          className: 'docx-preview',
          inWrapper: true,
          breakPages: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          useBase64URL: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderComments: false,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error('Lỗi preview Word:', error);

        setError('Không thể xem file Word.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWord();

    return () => {
      cancelled = true;

      if (previewRef.current) {
        previewRef.current.innerHTML = '';
      }
    };
  }, [file.mediaId]);

  return (
    <div className="word-preview-container">
      <div
        ref={previewRef}
        className={loading || error ? 'word-preview word-preview--hidden' : 'word-preview'}
      />

      {loading && (
        <div className="word-preview-loading">
          <div className="word-preview-loading__content">
            <div className="word-preview-loading__spinner" />

            <p className="word-preview-loading__text">Đang tải Word...</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="word-preview-error">
          <div className="word-preview-error__card">
            <h3 className="word-preview-error__title">Không thể xem Word</h3>

            <p className="word-preview-error__message">{error}</p>

            <button
              type="button"
              onClick={() => onDownload(file)}
              className="word-preview-error__download"
            >
              Tải file xuống
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
