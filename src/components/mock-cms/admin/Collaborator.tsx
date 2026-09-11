'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';

import '@/components/layout/admin/collaborator_styles/Collaborator.css';

import type {
  Collaborator,
  CollaboratorForm,
  Media,
} from '@/types/collaborator.type';

import { initialForm } from '@/types/collaborator.type';

import CollaboratorTable from './collaborator/CollaboratorTable';
import CollaboratorPreview from './collaborator/CollaboratorPreview';
import CollaboratorModal from './collaborator/CollaboratorModal';
import CollaboratorMediaModal from './collaborator/CollaboratorMediaModal';

export default function Collaborator() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [form, setForm] = useState<CollaboratorForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [columnsPerRow, setColumnsPerRow] = useState(4);

  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);

  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch('/api/v1/collaborator');

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách đối tác');
      }

      const result = await response.json();

      setCollaborators(result.data ?? result);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      await fetchCollaborators();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCollaborators();
  }, []);

  const loadMedia = async () => {
    try {
      setMediaLoading(true);

      const response = await fetch('/api/v1/media');

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách media');
      }

      const result = await response.json();
      const data = result.data ?? result;

      const images = (Array.isArray(data) ? data : []).filter(
        (media: Media) =>
          media.mimeType?.startsWith('image/') ||
          media.fileType?.toLowerCase() === 'image'
      );

      setMediaList(images);
    } catch (error) {
      console.error(error);
      alert('Không thể tải danh sách Media');
    } finally {
      setMediaLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);

    setForm({
      collabName: '',
      description: '',
      position: collaborators.length + 1,
      companyImage: '',
    });

    setShowModal(true);
  };

  const openEditModal = (collaborator: Collaborator) => {
    setEditingId(collaborator.collabId);

    setForm({
      collabName: collaborator.collabName,
      description: collaborator.description ?? '',
      position: collaborator.position,
      companyImage: collaborator.companyImage,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Hình ảnh không được vượt quá 10MB');
      e.target.value = '';
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload ảnh thất bại');
      }

      const result = await response.json();
      const media = result.data ?? result;

      if (!media.filePath) {
        throw new Error('API Media không trả về filePath');
      }

      setForm((prev) => ({
        ...prev,
        companyImage: media.filePath,
      }));
    } catch (error) {
      console.error(error);
      alert('Upload ảnh thất bại');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const openMediaModal = async () => {
    await loadMedia();
    setShowMediaModal(true);
  };

  const selectMedia = (media: Media) => {
    setForm((prev) => ({
      ...prev,
      companyImage: media.filePath,
    }));

    setShowMediaModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.companyImage) {
      alert('Vui lòng chọn hình ảnh');
      return;
    }

    try {
      setLoading(true);

      const url = editingId
        ? `/api/v1/collaborator/${editingId}`
        : '/api/v1/collaborator';

      const currentCollaborator = editingId
        ? collaborators.find((item) => item.collabId === editingId)
        : null;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collabName: form.collabName,
          description: form.description,
          position: editingId
            ? form.position
            : collaborators.length + 1,
          companyImage: form.companyImage,
          visible: editingId
            ? (currentCollaborator?.visible ?? true)
            : true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error('Collaborator API error:', errorText);

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      closeModal();
      await loadCollaborators();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa đối tác này không?')) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/v1/collaborator/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Xóa collaborator thất bại');
      }

      await loadCollaborators();
    } catch (error) {
      console.error(error);
      alert('Xóa đối tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisible = async (
    collaborator: Collaborator
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/v1/collaborator/${collaborator.collabId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collabName: collaborator.collabName,
            description: collaborator.description ?? '',
            position: collaborator.position,
            companyImage: collaborator.companyImage,
            visible: !collaborator.visible,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error('Collaborator API error:', errorText);

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      await loadCollaborators();
    } catch (error) {
      console.error('Toggle visible error:', error);
      alert('Không thể thay đổi trạng thái hiển thị');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    id: number
  ) => {
    setDraggedId(id);

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLTableRowElement>
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLTableRowElement>,
    targetId: number
  ) => {
    e.preventDefault();

    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const oldIndex = collaborators.findIndex(
      (item) => item.collabId === draggedId
    );

    const newIndex = collaborators.findIndex(
      (item) => item.collabId === targetId
    );

    if (oldIndex === -1 || newIndex === -1) {
      setDraggedId(null);
      return;
    }

    const newList = [...collaborators];
    const [draggedItem] = newList.splice(oldIndex, 1);

    newList.splice(newIndex, 0, draggedItem);

    const updatedList = newList.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setCollaborators(updatedList);
    setDraggedId(null);

    try {
      await Promise.all(
        updatedList.map((item) =>
          fetch(`/api/v1/collaborator/${item.collabId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              collabName: item.collabName,
              description: item.description ?? '',
              position: item.position,
              companyImage: item.companyImage,
              visible: item.visible,
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Không thể cập nhật vị trí ${item.collabName}`
              );
            }
          })
        )
      );
    } catch (error) {
      console.error(error);
      alert('Không thể lưu thứ tự đối tác');
      await loadCollaborators();
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div
      className="collaborator-page"
      style={{ color: 'var(--text)' }}
    >
      <div className="collaborator-header">
        <div>
          <h1 style={{ color: 'var(--text)' }}>
            Quản lý Đối tác
          </h1>

          <p style={{ color: 'var(--text-secondary)' }}>
            Quản lý danh sách đối tác và cộng tác viên
          </p>
        </div>

        <div className="collaborator-header-actions">
          <div className="preview-setting">
            <span style={{ color: 'var(--text-secondary)' }}>
              Review
            </span>

            <button
              type="button"
              className={`preview-toggle ${
                showPreview ? 'active' : ''
              }`}
              onClick={() =>
                setShowPreview((prev) => !prev)
              }
              aria-label="Bật tắt review"
            >
              <span className="preview-toggle-dot" />
            </button>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Thêm đối tác
          </button>
        </div>
      </div>

      {showPreview ? (
        <CollaboratorPreview
          collaborators={collaborators}
          columnsPerRow={columnsPerRow}
          onColumnsChange={setColumnsPerRow}
        />
      ) : (
        <CollaboratorTable
          collaborators={collaborators}
          loading={loading}
          draggedId={draggedId}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggleVisible={handleToggleVisible}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      )}

      {showModal && (
        <CollaboratorModal
          form={form}
          editingId={editingId}
          loading={loading}
          fileInputRef={fileInputRef}
          onChange={setForm}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onFileSelect={handleFileSelect}
          onOpenMedia={openMediaModal}
        />
      )}

      {showMediaModal && (
        <CollaboratorMediaModal
          mediaList={mediaList}
          loading={mediaLoading}
          onClose={() => setShowMediaModal(false)}
          onSelect={selectMedia}
        />
      )}
    </div>
  );
}