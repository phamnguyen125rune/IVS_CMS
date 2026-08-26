export interface RoleUser {
  roleId: number;
  roleName: string;
}

export interface ResUserDTO {
  userId: number;
  employeeCode?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  isActive: boolean;
  isSystem?: boolean;
  role?: RoleUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ResultPaginationDTO {
  meta: PaginationMeta;
  result: ResUserDTO[];
}
