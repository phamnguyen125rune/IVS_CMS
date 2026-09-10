import { Pencil, Trash2, Users } from 'lucide-react';

import { RolePermissions } from '@/types';

import styles from '../Role.module.css';

interface RoleCardProps {
  role: RolePermissions;
  isActive: boolean;
  onSelect: (role: RolePermissions) => void;
  onEdit: (role: RolePermissions) => void;
  onDelete: (role: RolePermissions) => void;
}

export default function RoleCard({
  role,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: RoleCardProps) {
  return (
    <div
      className={`${styles.roleCard} ${
        isActive ? styles.roleCardActive : ''
      }`}
      onClick={() => onSelect(role)}
    >
      <div className={styles.roleCardTop}>
        <div className={styles.roleIcon}>
          <Users size={22} />
        </div>

        <div className={styles.roleActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(role);
            }}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.deleteBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(role);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h2 className={styles.roleName}>
        {role.roleName}
      </h2>

      <p className={styles.roleDescription}>
        {role.roleDescription || 'Chưa có mô tả'}
      </p>

      <div className={styles.memberCount}>
        <Users size={15} />
        <span>
          {role.memmberCount ?? 0} thành viên
        </span>
      </div>
    </div>
  );
}