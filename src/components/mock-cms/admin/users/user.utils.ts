import { UserGender, UserResponse, UserRole } from '@/types/user.type';

export function getUserInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

export function getRoleLabel(role?: UserRole | null) {
  if (!role?.roleName) return 'Chưa gán';
  return role.roleName
    .trim()
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function isSuperAdmin(user: UserResponse) {
  return user.role?.roleName?.trim().toUpperCase() === 'SUPER_ADMIN';
}

export function isProfileComplete(user: UserResponse) {
  return Boolean(user.phoneNumber && user.address && user.dateOfBirth);
}

export function getGenderLabel(gender?: UserGender | null) {
  if (gender === 'MALE') return 'Nam';
  if (gender === 'FEMALE') return 'Nữ';
  if (gender === 'OTHERS') return 'Khác';
  return 'Chưa cập nhật';
}

export function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN').format(date);
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
