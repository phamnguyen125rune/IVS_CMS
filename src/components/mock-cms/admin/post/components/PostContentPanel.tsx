'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { FileText, Maximize2, Minimize2 } from 'lucide-react';

import type { ReqPostCreateDTO } from '@/types/post.type';

const RichTextEditor = dynamic(() => import('@/config/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border animate-pulse"
      style={{
        background: 'var(--surface-secondary)',
        borderColor: 'var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <FileText size={32} className="mb-2 opacity-50" />
      <span>Đang tải trình soạn thảo...</span>
    </div>
  ),
});

interface PostContentPanelProps {
  formData: ReqPostCreateDTO;
  fullscreen: boolean;
  disabled: boolean;
  uploadingContentImage: boolean;
  showSummary?: boolean;
  onFullscreenChange: (value: boolean) => void;
  onSaveDraft: () => void;
  onTitleChange: (value: string) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onContentChange: (value: string) => void;
  onPendingChange: (pending: boolean) => void;
}

export default function PostContentPanel({
  formData,
  fullscreen,
  disabled,
  uploadingContentImage,
  showSummary = true,
  onFullscreenChange,
  onSaveDraft,
  onTitleChange,
  onChange,
  onContentChange,
  onPendingChange,
}: PostContentPanelProps) {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) resizeTextarea(titleRef.current);
    if (summaryRef.current) resizeTextarea(summaryRef.current);
  }, [formData.title, formData.summary, fullscreen]);

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-8'
          : 'relative rounded-2xl border p-6 shadow-sm sm:p-8'
      }
      style={
        fullscreen
          ? {}
          : {
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }
      }
    >
      <div
        className={
          fullscreen
            ? 'flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl'
            : 'w-full'
        }
        style={
          fullscreen
            ? {
                background: 'var(--surface)',
                borderColor: 'var(--border)',
              }
            : {}
        }
      >
        {fullscreen && (
          <div
            className="flex items-center justify-between border-b px-6 py-3.5"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Chế độ tập trung soạn thảo
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={disabled}
                className="rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors hover:bg-[var(--hover)] disabled:opacity-50"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-secondary)',
                }}
              >
                Lưu nháp
              </button>

              <button
                type="button"
                onClick={() => onFullscreenChange(false)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  background: 'var(--surface-tertiary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Minimize2 size={14} />
                Thu nhỏ
              </button>
            </div>
          </div>
        )}

        <div
          className={
            fullscreen
              ? 'flex-1 space-y-4 overflow-y-auto p-6 sm:p-10'
              : 'space-y-4'
          }
        >
          {/* ================= TITLE ================= */}
          <textarea
            ref={titleRef}
            name="title"
            value={formData.title}
            onChange={(event) => {
              onTitleChange(event.target.value);
              resizeTextarea(event.currentTarget);
            }}
            rows={1}
            placeholder="Tiêu đề bài viết..."
            className="block w-full resize-none overflow-hidden border-b pb-2 text-2xl font-extrabold leading-snug outline-none transition-colors placeholder:text-[var(--text-placeholder)] focus:border-[var(--primary)] sm:text-3xl"
            style={{
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          />

          {/* ================= SLUG ================= */}
          <div
            className="flex items-center gap-2 font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>slug:</span>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={onChange}
              placeholder="duong-dan-tinh"
              className="flex-1 rounded-lg border px-2.5 py-1 outline-none transition-colors focus:border-[var(--primary)] focus:bg-[var(--surface)]"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            />
          </div>

          {/* ================= SUMMARY ================= */}
          {showSummary ? (
            <textarea
              ref={summaryRef}
              name="summary"
              value={formData.summary || ''}
              onChange={(event) => {
                onChange(event);
                resizeTextarea(event.currentTarget);
              }}
              rows={2}
              placeholder="Tóm tắt ngắn bài viết..."
              className="block w-full resize-none overflow-hidden rounded-xl border px-4 py-2.5 text-sm leading-relaxed outline-none transition-all placeholder:text-[var(--text-placeholder)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                background: 'var(--surface)',
              }}
            />
          ) : null}

          {/* ================= RICH TEXT EDITOR ================= */}
          <div
            className={`sticky-editor-container ${
              fullscreen ? 'fullscreen-editor' : ''
            }`}
          >
            <RichTextEditor
              onPendingChange={onPendingChange}
              value={formData.content}
              onChange={onContentChange}
              placeholder="Bắt đầu nội dung bài viết ở đây..."
            />

            <p
              className="mt-2 text-sm"
              role="status"
              style={{ color: 'var(--text-muted)' }}
            >
              {uploadingContentImage
                ? 'Đang tải ảnh lên, vui lòng chờ trước khi lưu bài viết…'
                : 'Chèn ảnh bằng nút tải ảnh trên thanh công cụ, kéo thả hoặc dán ảnh vào nội dung. Hỗ trợ JPEG, PNG, GIF, WebP; tối đa 10 MB/ảnh.'}
            </p>
          </div>

          {/* ================= FULLSCREEN BUTTON ================= */}
          {!fullscreen && (
            <button
              type="button"
              onClick={() => onFullscreenChange(true)}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-text)]"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Maximize2
                size={14}
                className="transition-transform group-hover:scale-110"
              />

              <span>Mở rộng trình soạn thảo (Toàn màn hình)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function resizeTextarea(element: HTMLTextAreaElement) {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
}