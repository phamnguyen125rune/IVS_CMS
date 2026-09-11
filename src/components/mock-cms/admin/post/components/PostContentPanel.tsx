'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { FileText, Maximize2, Minimize2 } from 'lucide-react';

import type { ReqPostCreateDTO } from '@/types/post.type';

const RichTextEditor = dynamic(() => import('@/config/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] border rounded-xl bg-slate-50 animate-pulse flex flex-col items-center justify-center text-slate-400">
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
          ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 flex flex-col justify-center items-center'
          : 'bg-white rounded-2xl border shadow-sm p-6 sm:p-8 relative'
      }
      style={!fullscreen ? { borderColor: 'var(--border)' } : {}}
    >
      <div
        className={
          fullscreen
            ? 'bg-white w-full max-w-5xl h-full rounded-2xl shadow-2xl border flex flex-col overflow-hidden'
            : 'w-full'
        }
        style={fullscreen ? { borderColor: 'var(--border)' } : {}}
      >
        {fullscreen && (
          <div
            className="px-6 py-3.5 border-b flex items-center justify-between bg-slate-50/80"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Chế độ tập trung soạn thảo
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={disabled}
                className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm disabled:opacity-50"
                style={{ borderColor: 'var(--border)' }}
              >
                Lưu nháp
              </button>
              <button
                type="button"
                onClick={() => onFullscreenChange(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 transition-colors"
              >
                <Minimize2 size={14} /> Thu nhỏ
              </button>
            </div>
          </div>
        )}

        <div className={fullscreen ? 'flex-1 overflow-y-auto p-6 sm:p-10 space-y-4' : 'space-y-4'}>
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
            className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 outline-none border-b pb-2 focus:border-blue-500 transition-colors resize-none overflow-hidden leading-snug block"
            style={{ borderColor: 'var(--border)' }}
          />

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>slug:</span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={onChange}
              placeholder="duong-dan-tinh"
              className="flex-1 px-2.5 py-1 bg-slate-50 border rounded-lg text-slate-600 outline-none focus:bg-white focus:border-blue-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

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
              className="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none overflow-hidden transition-all placeholder:text-slate-400 block leading-relaxed"
              style={{ borderColor: 'var(--border)' }}
            />
          ) : null}

          <div className={`sticky-editor-container ${fullscreen ? 'fullscreen-editor' : ''}`}>
            <RichTextEditor
              onPendingChange={onPendingChange}
              value={formData.content}
              onChange={onContentChange}
              placeholder="Bắt đầu nội dung bài viết ở đây..."
            />
            <p className="mt-2 text-sm text-slate-500" role="status">
              {uploadingContentImage
                ? 'Đang tải ảnh lên, vui lòng chờ trước khi lưu bài viết…'
                : 'Chèn ảnh bằng nút tải ảnh trên thanh công cụ, kéo thả hoặc dán ảnh vào nội dung. Hỗ trợ JPEG, PNG, GIF, WebP; tối đa 10 MB/ảnh.'}
            </p>
          </div>

          {!fullscreen && (
            <button
              type="button"
              onClick={() => onFullscreenChange(true)}
              className="w-full mt-2 py-2.5 px-4 bg-slate-50 hover:bg-blue-50/60 border border-dashed hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
              style={{ borderColor: 'var(--border)' }}
            >
              <Maximize2 size={14} className="group-hover:scale-110 transition-transform" />
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
