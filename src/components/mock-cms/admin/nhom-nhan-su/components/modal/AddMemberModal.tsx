'use client';

import { FormEvent } from 'react';
import { Search, X } from 'lucide-react';

import { RolePermissions, RoleUser2 } from '@/types';

import styles from '../../Role.module.css';

interface AddMemberModalProps {
  open: boolean;
  role: RolePermissions;

  members: RoleUser2[];
  availableMembers: RoleUser2[];
  selectedNewMembers: RoleUser2[];

  searching: boolean;
  saving: boolean;
  error: string | null;

  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;

  onClose: () => void;
  onSearch: (e: FormEvent) => void;

  onSelectMember: (user: RoleUser2) => void;
  onCancelMember: (user: RoleUser2) => void;

  onComplete: () => void;
}

export default function AddMemberModal({
  open,
  role,
  members,
  availableMembers,
  selectedNewMembers,
  searching,
  saving,
  error,
  searchKeyword,
  onSearchKeywordChange,
  onClose,
  onSearch,
  onSelectMember,
  onCancelMember,
  onComplete,
}: AddMemberModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addMemberModal}>
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <div>
            <h2>Thêm thành viên</h2>

            <p>
              Thêm thành viên vào role: <strong>{role.roleName}</strong>
            </p>
          </div>

          <button type="button" className={styles.closeModalBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className={styles.addMemberContent}>
          {/* LEFT */}
          <div className={styles.availableMembersPanel}>
            <div className={styles.panelTitle}>Tìm kiếm thành viên</div>

            <form className={styles.addMemberSearch} onSubmit={onSearch}>
              <div className={styles.searchInputWrapper}>
                <Search size={17} className={styles.searchIcon} />

                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => onSearchKeywordChange(e.target.value)}
                  placeholder="Nhập mã nhân viên, họ tên hoặc email..."
                  className={styles.searchInput}
                />
              </div>

              <button type="submit" className={styles.searchBtn} disabled={searching}>
                <Search size={16} />

                {searching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </form>

            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.availableMembersList}>
              {searching ? (
                <div className={styles.emptySearchResult}>Đang tìm kiếm thành viên...</div>
              ) : availableMembers.length === 0 ? (
                <div className={styles.emptySearchResult}>Thành viên không tồn tại</div>
              ) : (
                availableMembers.map((user) => (
                  <button
                    key={user.userId}
                    type="button"
                    className={styles.availableUserItem}
                    onClick={() => onSelectMember(user)}
                  >
                    <div className={styles.availableUserEmployeeCode}>{user.employeeCode}</div>

                    <div className={styles.availableUserName}>{user.fullName}</div>

                    <div className={styles.availableUserRole}>Đang thuộc role: {user.roleId}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.selectedMembersPanel}>
            <div className={styles.panelTitle}>Thành viên trong role</div>

            <div className={styles.selectedMembersList}>
              {members.length === 0 && selectedNewMembers.length === 0 ? (
                <div className={styles.emptyMemberList}>Chưa có thành viên</div>
              ) : (
                <>
                  {/* EXISTING */}
                  {members.map((user) => (
                    <div key={`existing-${user.userId}`} className={styles.selectedMemberItem}>
                      <div>
                        <div className={styles.memberEmployeeCode}>{user.employeeCode}</div>

                        <div className={styles.memberFullName}>{user.fullName}</div>

                        <div className={styles.memberEmail}>{user.email}</div>
                      </div>
                    </div>
                  ))}

                  {/* NEW */}
                  {selectedNewMembers.map((user) => (
                    <div key={`new-${user.userId}`} className={styles.selectedMemberItem}>
                      <div>
                        <div className={styles.memberEmployeeCode}>{user.employeeCode}</div>

                        <div className={styles.memberFullName}>{user.fullName}</div>

                        <div className={styles.memberEmail}>{user.email}</div>
                      </div>

                      <button
                        type="button"
                        className={styles.cancelAddBtn}
                        onClick={() => onCancelMember(user)}
                      >
                        <X size={14} />
                        Hủy
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>

          <button
            type="button"
            className={styles.completeBtn}
            onClick={onComplete}
            disabled={saving || selectedNewMembers.length === 0}
          >
            {saving ? 'Đang xử lý...' : 'Hoàn tất'}
          </button>
        </div>
      </div>
    </div>
  );
}
