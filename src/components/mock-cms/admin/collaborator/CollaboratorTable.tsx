'use client';

import { Edit, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';

import type { Collaborator } from '@/types/collaborator.type';

interface Props {
  collaborators: Collaborator[];
  loading: boolean;
  draggedId: number | null;
  onEdit: (collaborator: Collaborator) => void;
  onDelete: (id: number) => void;
  onToggleVisible: (collaborator: Collaborator) => void;
  onDragStart: (e: React.DragEvent<HTMLTableRowElement>, id: number) => void;
  onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDrop: (e: React.DragEvent<HTMLTableRowElement>, id: number) => void;
  onDragEnd: () => void;
}

export default function CollaboratorTable({
  collaborators,
  loading,
  draggedId,
  onEdit,
  onDelete,
  onToggleVisible,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: Props) {
  return (
    <div className="collaborator-card">
      <div className="card-header">
        <div>
          <h2>Danh sách đối tác</h2>
          <span>{collaborators.length} đối tác</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="collaborator-table">
          <thead>
            <tr>
              <th className="drag-column"></th>
              <th className="stt-column">STT</th>
              <th>Hình ảnh</th>
              <th>Tên</th>
              <th>Ngày tạo</th>
              <th className="action-column">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading && collaborators.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : collaborators.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  Chưa có đối tác nào
                </td>
              </tr>
            ) : (
              collaborators.map((collaborator, index) => (
                <tr
                  key={collaborator.collabId}
                  draggable
                  className={`drag-row ${
                    draggedId === collaborator.collabId ? 'dragging-row' : ''
                  }`}
                  onDragStart={(e) => onDragStart(e, collaborator.collabId)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, collaborator.collabId)}
                  onDragEnd={onDragEnd}
                >
                  <td className="drag-column">
                    <span className="drag-handle" title="Kéo để thay đổi vị trí">
                      <GripVertical size={19} />
                    </span>
                  </td>

                  <td>
                    <span className="stt">{index + 1}</span>
                  </td>

                  <td>
                    <div className="company-image">
                      {collaborator.companyImage ? (
                        <img src={collaborator.companyImage} alt={collaborator.collabName} />
                      ) : (
                        <div className="image-placeholder">No image</div>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className="collab-name">{collaborator.collabName}</span>
                  </td>

                  <td>
                    {collaborator.createdAt
                      ? new Date(collaborator.createdAt).toLocaleDateString('vi-VN')
                      : '-'}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className={`btn-visibility ${collaborator.visible ? 'visible' : 'hidden'}`}
                        onClick={() => onToggleVisible(collaborator)}
                        title={collaborator.visible ? 'Ẩn' : 'Hiện'}
                      >
                        {collaborator.visible ? <Eye size={17} /> : <EyeOff size={17} />}
                      </button>

                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEdit(collaborator)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => onDelete(collaborator.collabId)}
                        title="Xóa"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
