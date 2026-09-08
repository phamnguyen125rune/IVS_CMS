'use client';

import { useState, useEffect } from 'react';
import { LocalizedLink as Link } from '@/components/navigation/LocalizedLink';
import { ArrowLeft, Clock, MessageCircle, Send, User, Image as ImageIcon } from 'lucide-react';
import { postService } from '@/services/post.service';
import { commentService } from '@/services/comment.service';
import { ResPostDTO, ResPostListDTO } from '@/types/post.type';
import { ResCommentDTO } from '@/types/comment.type';

interface Props {
  initialPost?: ResPostDTO | null;
  slug?: string;
}

export default function PostDetail({ initialPost, slug }: Props) {
  // Nhận dữ liệu sẵn từ Server, Component KHÔNG CẦN CHỜ FETCH DỮ LIỆU CHÍNH NỮA (hết lỗi xoay vô tận)
  const [post, setPost] = useState<ResPostDTO | null>(initialPost || null);
  const [relatedPosts, setRelatedPosts] = useState<ResPostListDTO[]>([]);

  // Nếu server đã có data, loading tắt ngay lập tức
  const [loading, setLoading] = useState(!initialPost);

  const [comments, setComments] = useState<ResCommentDTO[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadExtraData = async (postData: ResPostDTO) => {
      try {
        const promises = [];
        promises.push(
          commentService.getPostComments(postData.id, 'approved')
            .then(data => setComments(data || []))
            .catch(() => setComments([]))
        );

        if (postData.category?.id) {
          promises.push(
            postService.getPosts({ categoryId: postData.category.id, status: 'PUBLISHED' }, 1, 4)
              .then(related => {
                setRelatedPosts(related.result?.filter((p: any) => p.id !== postData.id).slice(0, 3) || []);
              })
              .catch(() => { })
          );
        }
        await Promise.allSettled(promises);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (initialPost) {
      loadExtraData(initialPost);
    } else if (slug) {
      // Dùng làm Fallback cho cực kỳ an toàn
      const fetchClient = async () => {
        try {
          const resList = await postService.getPosts({ keyword: slug, status: 'PUBLISHED' }, 1, 10);
          const found = resList.result?.find((p) => p.slug === slug);
          if (found) {
            const data = await postService.getPostById(found.id);
            setPost(data);
            await loadExtraData(data);
          } else {
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
        }
      };
      fetchClient();
    } else {
      setLoading(false);
    }
  }, [initialPost, slug]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;

    setSubmittingComment(true);
    try {
      await commentService.createComment({
        postId: post.id,
        commentText: newComment.trim(),
      });
      alert('Bình luận của bạn đang chờ kiểm duyệt!');
      setNewComment('');
    } catch (error: any) {
      alert('Lỗi: ' + (error?.message || 'Bạn cần đăng nhập để bình luận.'));
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center text-slate-500 min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Đang tải bài viết...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center text-slate-500 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy bài viết</h2>
        <Link href="/bai-viet" className="text-blue-600 mt-4 inline-block hover:underline">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  // Loại bỏ hoàn toàn mock URL Unsplash, ưu tiên dùng dữ liệu ảnh thật[cite: 3]
  const heroImage = post.metadata?.openGraph?.imageUrl || post.mediaList?.[0]?.filePath;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ================= NỘI DUNG CHÍNH ================= */}
        <div className="lg:col-span-2">
          <Link
            to="/bai-viet"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            Quay lại danh sách
          </Link>

          <div className="flex items-center gap-2 mb-4">
            {post.category && (
              <span
                className="text-xs font-medium text-white px-3 py-1 rounded-full"
                style={{ background: 'var(--primary)' }}
              >
                {post.category.name}
              </span>
            )}
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">{post.author?.name || 'Ẩn danh'}</p>
            </div>
          </div>

          {heroImage && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-8 border border-slate-100 shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose max-w-none">
            {post.summary && (
              <p className="text-slate-800 text-lg font-medium leading-relaxed mb-6 italic border-l-4 border-blue-600 pl-4 bg-blue-50/50 py-3 rounded-r-lg">
                {post.summary}
              </p>
            )}

            <div
              className="text-slate-700 text-base leading-relaxed space-y-5 content-html"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Nội dung đang cập nhật...</p>' }}
            />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-3 py-1.5 rounded-full border text-slate-600 hover:bg-slate-50 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* ================= KHU VỰC BÌNH LUẬN ================= */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-6 flex items-center gap-2">
              <MessageCircle className="text-blue-600" />
              Bình luận ({comments.length})
            </h3>

            <form onSubmit={handleSubmitComment} className="mb-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  <User className="text-slate-400" size={20} />
                </div>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận..."
                    className="w-full px-4 py-3 border rounded-xl text-sm outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 focus:bg-white"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'} <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.commentId} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">
                      {comment.author?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-slate-900">
                          {comment.author?.fullName || 'Người dùng'}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {comment.commentText}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed rounded-2xl border-slate-200">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= CỘT SIDEBAR BÊN PHẢI ================= */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 text-center shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <h4 className="font-display font-semibold text-slate-900 text-lg">{post.author?.name || 'Ẩn danh'}</h4>
            <p className="text-xs font-medium text-blue-600 mt-1 mb-4 bg-blue-50 inline-block px-3 py-1 rounded-full">
              Tác giả nội dung
            </p>
          </div>

          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h4 className="font-display font-bold text-slate-900 mb-4 text-base">Bài viết liên quan</h4>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <Link key={related.id} to={`/bai-viet/${related.slug}`} className="flex gap-3 group items-center">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border flex items-center justify-center">
                      {related.featuredMedia ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={related.featuredMedia} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <ImageIcon size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">
                        {related.category?.name || 'Tin tức'}
                      </p>
                      <h5 className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-blue-600 line-clamp-2">
                        {related.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
