'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Save } from 'lucide-react';
import type { Collaborator } from '@/types/collaborator.type';
import { apiFetch } from '@/utils/api-client';

interface Props {
  collaborators: Collaborator[];
  columnsPerRow: number;
  onColumnsChange: (value: number) => void;
}

interface CollaboratorSettingResponse {
  settingId: number;
  columnsPerRow: number;
  updatedAt: string;
  updatedBy: number | null;
}

export default function CollaboratorPreview({
  collaborators,
  columnsPerRow,
  onColumnsChange,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const visibleCollaborators = collaborators
    .filter((item) => item.visible)
    .sort((a, b) => a.position - b.position);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const result = await apiFetch<CollaboratorSettingResponse>(
          '/api/v1/collaborator-settings',
          {
            method: 'GET',
          }
        );

        onColumnsChange(result.columnsPerRow);
      } catch (error) {
        console.error('Load collaborator setting error:', error);
        setMessage('Không thể lấy cấu hình.');
      }
    };

    loadSetting();
  }, [onColumnsChange]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      await apiFetch<CollaboratorSettingResponse>('/api/v1/collaborator-settings', {
        method: 'PUT',
        body: JSON.stringify({
          columnsPerRow,
        }),
      });

      setMessage('Đã lưu cấu hình thành công.');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Save collaborator setting error:', error);
      setMessage('Lưu cấu hình thất bại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="collaborator-preview">
      <div className="preview-header">
        <div>
          <h2>Review giao diện khách hàng</h2>
          <p>Đây là cách danh sách đối tác sẽ hiển thị ở trang khách hàng.</p>
        </div>

        <div className="preview-columns">
          <label htmlFor="columnsPerRow">Số công ty / dòng</label>

          <select
            id="columnsPerRow"
            value={columnsPerRow}
            onChange={(e) => onColumnsChange(Number(e.target.value))}
          >
            <option value={2}>2 công ty</option>
            <option value={3}>3 công ty</option>
            <option value={4}>4 công ty</option>
            <option value={5}>5 công ty</option>
            <option value={6}>6 công ty</option>
          </select>

          <button type="button" className="btn-save-setting" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={
            message.includes('thành công') ? 'setting-message success' : 'setting-message error'
          }
        >
          {message}
        </div>
      )}

      {visibleCollaborators.length === 0 ? (
        <div className="preview-empty">Chưa có đối tác nào đang hiển thị.</div>
      ) : (
        <div
          className="preview-grid"
          style={
            {
              '--columns-per-row': columnsPerRow,
            } as React.CSSProperties
          }
        >
          {visibleCollaborators.map((partner) => (
            <div key={partner.collabId} className="preview-card">
              <div className="preview-card-image">
                {partner.companyImage ? (
                  <img src={partner.companyImage} alt={partner.collabName} />
                ) : (
                  <ImageIcon size={32} />
                )}
              </div>

              <div className="preview-card-name">{partner.collabName}</div>

              {partner.description && (
                <div className="preview-card-description">{partner.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
