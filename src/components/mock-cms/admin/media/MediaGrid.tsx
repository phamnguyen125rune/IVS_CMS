'use client';

import { Media } from '@/types/media/media';
import MediaCard from './MediaCard';

import '@/components/layout/admin/media_styles/MediaGrid.css';

interface MediaGridProps {
  groups: [string, Media[]][];
  onPreview: (item: Media) => void;
  onDownload: (item: Media) => void;
  onDelete: (id: number) => void;
}

export default function MediaGrid({ groups, onPreview, onDownload, onDelete }: MediaGridProps) {
  return (
    <div className="media-grid">
      {groups.map(([date, items]) => (
        <div key={date} className="media-grid__group">
          <h2 className="media-grid__title">{date}</h2>

          <div className="media-grid__items">
            {items.map((item) => (
              <MediaCard
                key={item.mediaId}
                item={item}
                onPreview={onPreview}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
