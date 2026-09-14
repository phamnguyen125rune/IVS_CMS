interface MediaHeaderProps {
  count: number;
}

import '@/components/layout/admin/media_styles/MediaHeader.css';

export default function MediaHeader({ count }: MediaHeaderProps) {
  return (
    <div className="media-header">
      <h1 className="media-header__title">Quản lý Media</h1>

      <p className="media-header__count">{count} tệp</p>
    </div>
  );
}
