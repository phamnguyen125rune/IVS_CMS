export interface Tag {
  tagId: number;
  tagName: string;
  slug: string;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface ReqTagCreateDTO {
  tagName: string;
  slug: string;
}
