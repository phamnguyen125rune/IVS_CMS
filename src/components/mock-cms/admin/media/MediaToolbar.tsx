'use client';

import { Search, Grid3X3, List, X } from 'lucide-react';

import { useState } from 'react';

import { ViewMode } from '@/types/media/media';

import '@/components/layout/admin/media_styles/MediaToolbar.css';

export type MediaFilter = 'all' | 'image' | 'pdf' | 'word' | 'excel' | 'other';

interface MediaToolbarProps {
  search: string;
  viewMode: ViewMode;

  fileFilter: MediaFilter;

  onSearch: (value: string) => void;

  onFilterChange: (value: MediaFilter) => void;

  onViewModeChange: (mode: ViewMode) => void;
}

export default function MediaToolbar({
  search,
  viewMode,
  fileFilter,
  onSearch,
  onFilterChange,
  onViewModeChange,
}: MediaToolbarProps) {
  const [inputValue, setInputValue] = useState(search);

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="media-toolbar">
      <div className="media-toolbar__left">
        <div className="media-toolbar__search">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm tệp..."
            className="media-toolbar__input"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="media-toolbar__search-button"
            title="Tìm kiếm"
            aria-label="Tìm kiếm"
          >
            <Search size={20} />
          </button>

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="media-toolbar__clear-button"
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <select
          value={fileFilter}
          onChange={(e) => onFilterChange(e.target.value as MediaFilter)}
          className="media-toolbar__filter"
          aria-label="Lọc loại file"
        >
          <option value="all">Tất cả loại file</option>

          <option value="image">Hình ảnh</option>

          <option value="pdf">PDF</option>

          <option value="word">Word</option>

          <option value="excel">Excel</option>

          <option value="other">Khác</option>
        </select>
      </div>

      <div className="media-toolbar__view-mode">
        <button
          type="button"
          onClick={() => onViewModeChange('grid')}
          className={`media-toolbar__view-button ${
            viewMode === 'grid' ? 'media-toolbar__view-button--active' : ''
          }`}
          title="Xem dạng lưới"
          aria-label="Xem dạng lưới"
        >
          <Grid3X3 size={19} />
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          className={`media-toolbar__view-button ${
            viewMode === 'list' ? 'media-toolbar__view-button--active' : ''
          }`}
          title="Xem dạng danh sách"
          aria-label="Xem dạng danh sách"
        >
          <List size={19} />
        </button>
      </div>
    </div>
  );
}
