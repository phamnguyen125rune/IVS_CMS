'use client';

import { Trash2 } from 'lucide-react';

import { RolePermissions } from '@/types';

import styles from '../../Role.module.css';

interface DeleteRoleModalProps {
  role: RolePermissions | null;
  saving: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteRoleModal({
  role,
  saving,
  onCancel,
  onConfirm,
}: DeleteRoleModalProps) {
  if (!role) {
    return null;
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => {
        if (!saving) {
          onCancel();
        }
      }}
    >
      <div
        className={styles.deleteModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.deleteIcon}>
          <Trash2 size={24} />
        </div>

        <h3>Xóa role?</h3>

        <p>
          Bạn có chắc chắn muốn xóa role{' '}
          <strong>{role.roleName}</strong>?
        </p>

        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className={styles.cancelBtn}
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={styles.confirmDeleteBtn}
          >
            {saving ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}