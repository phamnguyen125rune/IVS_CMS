import { RolePermissions } from '@/types';
import RoleCard from './RoleCard';
import styles from '../Role.module.css';
interface RoleListProps {
  roles: RolePermissions[];
  selectedRole: RolePermissions | null;
  onSelectRole: (role: RolePermissions) => void;
  onEdit: (role: RolePermissions) => void;
  onDelete: (role: RolePermissions) => void;
}

export default function RoleList({
  roles,
  selectedRole,
  onSelectRole,
  onEdit,
  onDelete,
}: RoleListProps) {
  return (
    <section className={styles.roleSection}>
      {roles.map((role) => (
        <RoleCard
          key={role.roleId}
          role={role}
          isActive={selectedRole?.roleId === role.roleId}
          onSelect={onSelectRole}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
