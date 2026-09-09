'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import { Media } from '@/types/media/media';
import '@/components/layout/admin/media_styles/ExcelPreview.css';

interface ExcelSheet {
  name: string;
  html: string;
}

interface ExcelPreviewProps {
  file: Media;
  onDownload: (file: Media) => void;
}

export default function ExcelPreview({ file, onDownload }: ExcelPreviewProps) {
  const [sheets, setSheets] = useState<ExcelSheet[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        setLoading(true);
        setError(null);
        setSheets([]);
        setActiveSheet(0);

        const response = await fetch(`/api/v1/media/${file.mediaId}/view`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, {
          type: 'array',
        });

        const result = workbook.SheetNames.map((sheetName) => ({
          name: sheetName,
          html: XLSX.utils.sheet_to_html(workbook.Sheets[sheetName], {
            header: '',
            footer: '',
          }),
        }));

        setSheets(result);
      } catch (error) {
        console.error('Lỗi preview Excel:', error);

        setError('Không thể xem file Excel.');
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, [file.mediaId]);

  if (loading) {
    return (
      <div className="excel-loading">
        <div className="excel-spinner" />
        <p>Đang đọc file Excel...</p>
      </div>
    );
  }

  if (error || sheets.length === 0) {
    return (
      <div className="excel-error">
        <div>
          <h3>Không thể xem Excel</h3>

          <p>{error || 'File Excel không có dữ liệu.'}</p>

          <button onClick={() => onDownload(file)}>Tải file xuống</button>
        </div>
      </div>
    );
  }

  return (
    <div className="excel-preview-container">
      <div className="excel-tabs">
        {sheets.map((sheet, index) => (
          <button
            key={sheet.name}
            onClick={() => setActiveSheet(index)}
            className={activeSheet === index ? 'active' : ''}
          >
            {sheet.name}
          </button>
        ))}
      </div>

      <div className="excel-content">
        <div
          className="excel-table"
          dangerouslySetInnerHTML={{
            __html: sheets[activeSheet]?.html || '',
          }}
        />
      </div>
    </div>
  );
}
