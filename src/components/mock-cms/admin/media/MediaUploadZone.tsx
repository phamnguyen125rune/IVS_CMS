'use client';

import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import '@/components/layout/admin/media_styles/MediaUploadZone.css';

interface MediaUploadZoneProps {
  uploading: boolean;
  onUpload: (files: File[]) => void;
}

export default function MediaUploadZone({ uploading, onUpload }: MediaUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | File[]) => {
    onUpload(Array.from(files));
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="*/*"
        className="media-upload-zone__input"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          handleFiles(e.dataTransfer.files);
        }}
        className={`media-upload-zone ${dragging ? 'media-upload-zone--dragging' : ''}`}
      >
        <Upload size={32} className="media-upload-zone__icon" />

        <p className="media-upload-zone__text">
          Kéo thả tệp vào đây hoặc{' '}
          <span className="media-upload-zone__link">chọn tệp từ máy tính</span>
        </p>

        <p className="media-upload-zone__description">
          Hỗ trợ hình ảnh, PDF, Word, Excel, PowerPoint, ZIP, RAR... tối đa 10MB
        </p>

        {uploading && <p className="media-upload-zone__status">Đang tải file lên...</p>}
      </div>
    </>
  );
}
