export interface Menu {
  menuId: number;
  parentId: number | null;
  title: string;
  url: string;
  displayOrder: number;
  level: number;
  visible: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface MenuFormData {
  title: string;
  url: string;
  parentId: number | null;
  level: number;
  visible: boolean;
}

export const initialForm: MenuFormData = {
  title: '',
  url: '',
  parentId: null,
  level: 1,
  visible: true,
};
