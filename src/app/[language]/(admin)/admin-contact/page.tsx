'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Eye,
  Trash2,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  Tag,
  Plus,
  Settings,
  Edit2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { FormDetail, PaginationMeta, FormCategory } from '@/types/contact.type';
import { FormDetailService } from '@/services/contact.service';
import { formatDate } from '@/utils/format';

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  new: { label: 'Chưa xử lý', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  read: { label: 'Đang xử lý', color: 'bg-slate-100 text-slate-600', icon: Eye },
  replied: { label: 'Đã xử lý', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
};

export default function FormDetailsManagement() {
  const [formList, setFormList] = useState<FormDetail[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});
  const [rawCategories, setRawCategories] = useState<FormCategory[]>([]);

  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 10, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedForm, setSelectedForm] = useState<FormDetail | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('new');
  const [isUpdating, setIsUpdating] = useState(false);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isProcessingCat, setIsProcessingCat] = useState(false);

  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const res = await FormDetailService.getAllCategories();
      if (res?.data) {
        setRawCategories(res.data);

        const map: Record<number, string> = {};
        res.data.forEach((cat: FormCategory) => {
          map[cat.formCategoryId] = cat.categoryName;
        });
        setCategoryMap(map);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục form:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return alert('Vui lòng nhập tên danh mục!');
    setIsProcessingCat(true);
    try {
      await FormDetailService.createCategory(newCategoryName);
      setNewCategoryName('');
      loadCategories();
    } catch (error) {
      console.error(error);
      alert('Thêm danh mục thất bại!');
    } finally {
      setIsProcessingCat(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCatName.trim()) return alert('Tên danh mục không được để trống!');
    setIsProcessingCat(true);
    try {
      await FormDetailService.updateCategory(id, editingCatName);
      setEditingCatId(null);
      setEditingCatName('');
      loadCategories();
    } catch (error) {
      console.error(error);
      alert('Cập nhật danh mục thất bại!');
    } finally {
      setIsProcessingCat(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        'Bạn có chắc chắn muốn xóa danh mục này? LƯU Ý: Nếu có form đang dùng danh mục này, việc xóa có thể gây lỗi hiển thị.'
      )
    )
      return;
    setIsProcessingCat(true);
    try {
      await FormDetailService.deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error(error);
      alert('Xóa danh mục thất bại! Vui lòng đảm bảo không có form nào đang dùng danh mục này.');
    } finally {
      setIsProcessingCat(false);
    }
  };

  const getBackendStatus = (filter: string) => {
    switch (filter) {
      case 'Chưa xử lý':
        return 'new';
      case 'Đang xử lý':
        return 'read';
      case 'Đã xử lý':
        return 'replied';
      default:
        return 'ALL';
    }
  };

  const fetchFormDetails = useCallback(async () => {
    setLoading(true);
    try {
      const statusQuery = getBackendStatus(statusFilter);
      const res = await FormDetailService.getFormDetails(currentPage, 10, statusQuery, search);
      if (res?.data) {
        setFormList(res.data.result || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (error) {
      console.error('Lỗi tải form:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchFormDetails(), 300);
    return () => clearTimeout(timer);
  }, [fetchFormDetails]);

  const handleViewDetail = async (form: FormDetail) => {
    try {
      const res = await FormDetailService.getFormDetailById(form.formId);
      if (res?.data) {
        setSelectedForm(res.data);
        setSelectedStatus(res.data.status || 'new');
        if (form.status === 'new') fetchFormDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedForm) return;
    setIsUpdating(true);
    try {
      await FormDetailService.updateFormDetailStatus(selectedForm.formId, selectedStatus);
      setSelectedForm(null);
      fetchFormDetails();
    } catch (error) {
      console.error(error);
      alert('Cập nhật trạng thái thất bại!');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteForm = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa form yêu cầu này?')) return;
    try {
      await FormDetailService.deleteFormDetail(id);
      fetchFormDetails();
    } catch (error) {
      console.error(error);
      alert('Xóa form thất bại!');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý Yêu cầu Form</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Tổng số: <span className="font-semibold">{meta.total}</span> yêu cầu
          </p>
        </div>

        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Settings size={16} />
          Quản lý danh mục
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo mã form, họ tên, email..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-1">
          {['Tất cả', 'Chưa xử lý', 'Đang xử lý', 'Đã xử lý'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Mã Form
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Khách hàng
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Danh mục
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Thời gian
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {formList.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              formList.map((form) => {
                const sc = statusConfig[form.status] || statusConfig.new;
                return (
                  <tr key={form.formId} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {form.formCode || `#${form.formId}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{form.fullName}</div>
                      <div className="text-xs text-slate-400">
                        {form.email} {form.company ? `· ${form.company}` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Tag size={12} className="text-slate-400" />
                        {categoryMap[form.formCategoryId] || `Danh mục #${form.formCategoryId}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={11} />
                        {formatDate(form.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetail(form)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form.formId)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {meta.pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Trang {meta.page} / {meta.pages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage >= meta.pages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showCategoryModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowCategoryModal(false);
            setEditingCatId(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="font-bold text-slate-900">Quản lý Danh Mục Form</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nhập tên danh mục mới..."
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button
                  disabled={isProcessingCat}
                  onClick={handleAddCategory}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {isProcessingCat ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Thêm
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Danh sách hiện tại
                </h4>
                {rawCategories.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Chưa có danh mục nào.</p>
                ) : (
                  rawCategories.map((cat) => (
                    <div
                      key={cat.formCategoryId}
                      className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm"
                    >
                      {editingCatId === cat.formCategoryId ? (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="flex-1 px-3 py-1.5 border border-indigo-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                            autoFocus
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleUpdateCategory(cat.formCategoryId)
                            }
                          />
                          <button
                            onClick={() => handleUpdateCategory(cat.formCategoryId)}
                            disabled={isProcessingCat}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingCatId(null)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-mono">
                              {cat.formCategoryId}
                            </span>
                            <span className="text-sm font-medium text-slate-700">
                              {cat.categoryName}
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ opacity: 1 }}
                          >
                            <button
                              title="Sửa tên"
                              onClick={() => {
                                setEditingCatId(cat.formCategoryId);
                                setEditingCatName(cat.categoryName);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              title="Xóa danh mục"
                              onClick={() => handleDeleteCategory(cat.formCategoryId)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 shrink-0 bg-white flex justify-end">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCatId(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedForm(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900">Chi tiết Form Yêu cầu</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedForm.formCode}</span>
              </div>
              <button
                onClick={() => setSelectedForm(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Họ tên</span>
                  <p className="text-slate-800 mt-0.5 font-medium">{selectedForm.fullName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Email</span>
                  <p className="text-slate-800 mt-0.5">{selectedForm.email}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Số điện thoại</span>
                  <p className="text-slate-800 mt-0.5">{selectedForm.phoneNumber}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Công ty</span>
                  <p className="text-slate-800 mt-0.5">{selectedForm.company || 'Không có'}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Danh mục yêu cầu</span>
                <p className="text-slate-800 mt-0.5 font-medium">
                  {categoryMap[selectedForm.formCategoryId] ||
                    `Danh mục #${selectedForm.formCategoryId}`}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Nội dung tin nhắn</span>
                <div className="mt-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedForm.message}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Trạng thái xử lý</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="new">Chưa xử lý</option>
                  <option value="read">Đang xử lý</option>
                  <option value="replied">Đã xử lý</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedForm(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Đóng
              </button>
              <button
                disabled={isUpdating}
                onClick={handleUpdateStatus}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{' '}
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
