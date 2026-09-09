export interface PostCategory {
  categoryId: number;
  categoryName: string;
  slug: string;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface ReqCategoryCreateDTO {
  categoryName: string;
  slug: string;
}

// Backend chỉ cho đổi tên; slug hiện tại được service backend giữ nguyên.
export interface ReqCategoryUpdateDTO {
  categoryName: string;
}
