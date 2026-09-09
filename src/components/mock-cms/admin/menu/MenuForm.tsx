'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import '@/components/layout/admin/menu_styles/MenuForm.css';

interface MenuItem {
  menuId: number;
  parentId: number | null;
  title: string;
  url: string;
  displayOrder: number;
  level: number;
  visible: boolean;
}

interface MenuFormData {
  title: string;
  url: string;
  parentId: number | null;
  level: number;
  visible: boolean;
}

interface MenuFormProps {
  form: MenuFormData;
  editingId: number | null;
  availableParents: MenuItem[];
  saving: boolean;
  onChange: (form: MenuFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function MenuForm({
  form,
  editingId,
  availableParents,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [selectedLevel1Id, setSelectedLevel1Id] = useState<number | null>(null);

  const level1Menus = availableParents.filter((menu) => menu.level === 1);

  const level2Menus = availableParents.filter((menu) => menu.level === 2);

  const filteredLevel2Menus = level2Menus.filter((menu) => menu.parentId === selectedLevel1Id);

  const handleLevelChange = (value: string) => {
    const newLevel = Number(value);

    setSelectedLevel1Id(null);

    onChange({
      ...form,
      level: newLevel,
      parentId: null,
    });
  };

  const handleLevel1Change = (value: string) => {
    const level1Id = value ? Number(value) : null;

    setSelectedLevel1Id(level1Id);

    if (form.level === 2) {
      onChange({
        ...form,
        level: 2,
        parentId: level1Id,
      });

      return;
    }

    if (form.level === 3) {
      onChange({
        ...form,
        level: 3,
        parentId: null,
      });
    }
  };

  const handleLevel2Change = (value: string) => {
    const level2Id = value ? Number(value) : null;

    onChange({
      ...form,
      level: 3,
      parentId: level2Id,
    });
  };

  return (
    <div className="menu-form-wrapper">
      <div className="menu-card">
        <div className="menu-card-header">
          <h3>{editingId ? 'Chỉnh sửa Menu' : 'Tạo Menu mới'}</h3>

          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="menu-cancel-btn"
              title="Hủy chỉnh sửa"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="menu-form-fields">
          <div className="menu-field">
            <label>Tên Menu</label>

            <input
              value={form.title}
              onChange={(e) =>
                onChange({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Nhập tên menu..."
            />
          </div>

          <div className="menu-field">
            <label>Đường dẫn</label>

            <input
              value={form.url}
              onChange={(e) =>
                onChange({
                  ...form,
                  url: e.target.value,
                })
              }
              placeholder="/products"
              className="menu-url-input"
            />
          </div>

          <div className="menu-field">
            <label>Cấp</label>

            <select value={form.level} onChange={(e) => handleLevelChange(e.target.value)}>
              <option value={1}>Cấp 1</option>
              <option value={2}>Cấp 2</option>
              <option value={3}>Cấp 3</option>
            </select>
          </div>

          <div className="menu-field">
            <label>Menu cấp 1</label>

            <select
              value={selectedLevel1Id ?? ''}
              onChange={(e) => handleLevel1Change(e.target.value)}
              disabled={form.level === 1}
            >
              <option value="">-- Chọn menu cấp 1 --</option>

              {level1Menus.map((menu) => (
                <option key={menu.menuId} value={menu.menuId}>
                  {menu.title}
                </option>
              ))}
            </select>
          </div>

          <div className="menu-field">
            <label>Menu cấp 2</label>

            <select
              value={form.level === 3 && form.parentId !== null ? form.parentId : ''}
              onChange={(e) => handleLevel2Change(e.target.value)}
              disabled={form.level !== 3 || selectedLevel1Id === null}
            >
              <option value="">-- Chọn menu cấp 2 --</option>

              {filteredLevel2Menus.map((menu) => (
                <option key={menu.menuId} value={menu.menuId}>
                  {menu.title}
                </option>
              ))}
            </select>
          </div>

          <label className="menu-checkbox">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) =>
                onChange({
                  ...form,
                  visible: e.target.checked,
                })
              }
            />

            <span>Hiển thị Menu</span>
          </label>
        </div>

        <button type="button" onClick={onSubmit} disabled={saving} className="menu-submit-btn">
          <Plus size={16} />

          {saving ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Tạo Menu'}
        </button>
      </div>
    </div>
  );
}
