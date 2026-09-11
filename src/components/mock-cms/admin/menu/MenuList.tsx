'use client';

import { Edit, Eye, EyeOff, GripVertical, Menu as MenuIcon, Trash2 } from 'lucide-react';

import '@/components/layout/admin/menu_styles/MenuList.css';

interface MenuItem {
  menuId: number;
  parentId: number | null;
  title: string;
  url: string;
  displayOrder: number;
  level: number;
  visible: boolean;
}

interface MenuListProps {
  menus: MenuItem[];
  loading: boolean;
  draggedId: number | null;
  dragOverId: number | null;
  onDragStart: (id: number) => void;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDrop: (id: number) => void;
  onDragEnd: () => void;
  onToggleVisible: (menu: MenuItem) => void;
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: number) => void;
}

export default function MenuList({
  menus,
  loading,
  draggedId,
  dragOverId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleVisible,
  onEdit,
  onDelete,
}: MenuListProps) {
  return (
    <div className="admin-list">
      <div className="admin-list-header">
        <h3 className="admin-list-header-title">Danh sách Menu</h3>
      </div>

      <div className="admin-list-content">
        {loading ? (
          <div className="admin-list-empty">
            <p>Đang tải menu...</p>
          </div>
        ) : menus.length === 0 ? (
          <div className="admin-list-empty">
            <MenuIcon size={28} />
            <p>Chưa có menu nào</p>
          </div>
        ) : (
          menus.map((menu) => (
            <div
              key={menu.menuId}
              draggable
              onDragStart={() => onDragStart(menu.menuId)}
              onDragOver={(e) => onDragOver(e, menu.menuId)}
              onDrop={() => onDrop(menu.menuId)}
              onDragEnd={onDragEnd}
              className={`menu-item ${dragOverId === menu.menuId ? 'drag-over' : ''} ${
                draggedId === menu.menuId ? 'dragging' : ''
              }`}
              style={{
                paddingLeft: `${12 + Math.max(menu.level - 1, 0) * 24}px`,
              }}
            >
              <GripVertical size={16} className="menu-drag-icon" />

              <MenuIcon
                size={15}
                className={menu.level === 1 ? 'menu-level-icon primary' : 'menu-level-icon'}
              />

              <div className="menu-item-info">
                <div className="menu-item-title">{menu.title}</div>

                <div className="menu-item-url">{menu.url}</div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisible(menu);
                }}
                title={menu.visible ? 'Ẩn menu' : 'Hiện menu'}
                className="admin-icon-btn"
              >
                {menu.visible ? (
                  <Eye size={14} className="visible-icon" />
                ) : (
                  <EyeOff size={14} className="hidden-icon" />
                )}
              </button>

              <div className="menu-actions">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(menu);
                  }}
                  className="admin-icon-btn edit"
                  title="Chỉnh sửa"
                >
                  <Edit size={12} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(menu.menuId);
                  }}
                  className="admin-icon-btn delete"
                  title="Xóa"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
