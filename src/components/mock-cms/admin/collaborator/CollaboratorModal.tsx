'use client';

import { Image as ImageIcon, Upload, X } from 'lucide-react';

import type { CollaboratorForm } from '@/types/collaborator.type';

interface Props {
  form: CollaboratorForm;
  editingId: number | null;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: React.Dispatch<React.SetStateAction<CollaboratorForm>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenMedia: () => void;
}

export default function CollaboratorModal({
  form,
  editingId,
  loading,
  fileInputRef,
  onChange,
  onClose,
  onSubmit,
  onFileSelect,
  onOpenMedia,
}: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="collaborator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{editingId ? 'Chỉnh sửa đối tác' : 'Thêm đối tác'}</h2>

            <p>{editingId ? 'Cập nhật thông tin đối tác' : 'Nhập thông tin đối tác mới'}</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-body">
            <div className="form-group">
              <label>
                Tên đối tác<span>*</span>
              </label>

              <input
                type="text"
                value={form.collabName}
                onChange={(e) =>
                  onChange({
                    ...form,
                    collabName: e.target.value,
                  })
                }
                placeholder="Nhập tên đối tác"
                required
              />
            </div>

            <div className="form-group">
              <label>Giới thiệu công ty</label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  onChange({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Nhập giới thiệu ngắn về công ty đối tác..."
                rows={6}
                maxLength={500}
              />

              <small>{form.description.length}/500 ký tự</small>
            </div>

            <div className="form-group">
              <label>
                Logo công ty<span>*</span>
              </label>

              <div className="image-source-buttons">
                <button
                  type="button"
                  className="image-source-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload size={17} />
                  Chọn ảnh từ máy
                </button>

                <button
                  type="button"
                  className="image-source-btn"
                  onClick={onOpenMedia}
                  disabled={loading}
                >
                  <ImageIcon size={17} />
                  Chọn từ Media
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileSelect}
                style={{ display: 'none' }}
              />

              {form.companyImage && (
                <>
                  <div className="preview-image">
                    <img src={form.companyImage} alt="Preview" />
                  </div>

                  <div className="selected-image-text">Ảnh đã chọn</div>
                </>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
