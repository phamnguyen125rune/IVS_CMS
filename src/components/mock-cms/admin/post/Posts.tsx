'use client';

import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';

import PostDeleteDialog from './components/PostDeleteDialog';
import PostTable from './components/PostTable';
import PostToolbar from './components/PostToolbar';
import { usePostList } from './hooks/usePostList';

export default function Posts() {
  const navigate = useNavigate();
  const postList = usePostList();

  return (
    <div className="p-6 relative">
      {postList.errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 flex justify-between gap-4"
        >
          <span>{postList.errorMessage}</span>
          <button className="underline font-medium shrink-0" onClick={postList.fetchPosts}>
            Tải lại
          </button>
        </div>
      )}

      <PostToolbar
        total={postList.total}
        search={postList.search}
        status={postList.status}
        categoryId={postList.categoryId}
        categories={postList.categories}
        onCreate={() => navigate('/admin/bai-viet/tao-moi')}
        onSearchChange={postList.setSearchFilter}
        onStatusChange={postList.setStatusFilter}
        onCategoryChange={postList.setCategoryFilter}
      />

      <PostTable
        posts={postList.posts}
        loading={postList.loading}
        busy={postList.busy}
        page={postList.page}
        pageSize={postList.pageSize}
        total={postList.total}
        totalPages={postList.totalPages}
        onPageChange={postList.setPage}
        onEdit={(post) => navigate(`/admin/bai-viet/sua/${post.id}`)}
        onDelete={postList.setDeletePost}
        onAction={postList.changePostStatus}
      />

      <PostDeleteDialog
        post={postList.deletePost}
        busy={postList.busy}
        onCancel={() => postList.setDeletePost(null)}
        onConfirm={postList.deleteSelectedPost}
      />
    </div>
  );
}
