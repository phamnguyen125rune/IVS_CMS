import '@/components/layout/admin/menu_styles/MenuStats.css';

interface MenuStatsProps {
  totalMenus: number;
  visibleMenus: number;
  hiddenMenus: number;
}

export default function MenuStats({ totalMenus, visibleMenus, hiddenMenus }: MenuStatsProps) {
  return (
    <div className="menu-card menu-stats">
      <h3>Thống kê</h3>

      <div className="menu-stats-list">
        <div className="menu-stat-row">
          <span>Tổng Menu</span>
          <strong>{totalMenus}</strong>
        </div>

        <div className="menu-stat-row">
          <span>Đang hiển thị</span>
          <strong className="stat-visible">{visibleMenus}</strong>
        </div>

        <div className="menu-stat-row">
          <span>Đang ẩn</span>
          <strong className="stat-hidden">{hiddenMenus}</strong>
        </div>
      </div>
    </div>
  );
}
