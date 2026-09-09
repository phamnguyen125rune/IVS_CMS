export interface PostCategory {
  categoryId: number;
  categoryName: string;
  slug?: string;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface ReqCategoryCreateDTO {
  categoryName: string;
  slug?: string;
}

export interface ReqCategoryUpdateDTO {
  categoryName: string;
  slug?: string;
}
