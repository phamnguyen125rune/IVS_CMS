'use client';

import { FormEvent } from 'react';
import { Save, X } from 'lucide-react';

import { RolePermissions } from '@/types';

import styles from '../../Role.module.css';

interface RoleFormModalProps {
  open: boolean;
  editingRole: RolePermissions | null;

  roleName: string;
  roleDescription: string;

  onRoleNameChange: (value: string) => void;
  onRoleDescriptionChange: (value: string) => void;

  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export default function RoleFormModal({
  open,
  editingRole,
  roleName,
  roleDescription,
  onRoleNameChange,
  onRoleDescriptionChange,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  if (!open) {
    return null;
  }

  const isEdit = Boolean(editingRole);

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <h3>
            {isEdit
              ? 'Chỉnh sửa role'
              : 'Thêm role mới'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Tên role</label>

            <input
              required
              value={roleName}
              onChange={(e) =>
                onRoleNameChange(e.target.value)
              }
              placeholder="Ví dụ: Manager"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>

            <textarea
              rows={4}
              value={roleDescription}
              onChange={(e) =>
                onRoleDescriptionChange(e.target.value)
              }
              placeholder="Nhập mô tả cho role..."
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Hủy
          </button>

          <button
            type="submit"
            className={styles.saveBtn}
          >
            <Save size={16} />

            {isEdit ? 'Cập nhật' : 'Tạo role'}
          </button>
        </div>
      </form>
    </div>
  );
}