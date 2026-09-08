export interface AuthorInfo {
    userId: number;
    fullName: string;
    avatarUrl?: string;
}

export interface ResCommentDTO {
    commentId: number;
    postId: number;
    parentId?: number;
    commentText: string;
    imageUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'spam';
    createdAt: string;
    updatedAt?: string;
    author: AuthorInfo;
    replies: ResCommentDTO[];
}

export interface ReqCommentCreateDTO {
    postId: number;
    parentId?: number;
    commentText: string;
    imageUrl?: string;
}

export interface ReqCommentUpdateDTO {
    commentText: string;
    imageUrl?: string;
}