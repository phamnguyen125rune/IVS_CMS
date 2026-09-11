'use client';

import { FormEvent, useMemo, useState } from 'react';
import { RefreshCw, Save, Search, Trash2, UserPlus, Users } from 'lucide-react';

import { RolePermissions, RoleUser2 } from '@/types';

import styles from '../Role.module.css';

interface MemberPanelProps {
  role: RolePermissions;
  members: RoleUser2[];
  currentUserId: number | null;
  saving: boolean;
  hasChanged: boolean;
  onAddMember: () => void;
  onSave: () => void;
  onReset: () => void;
  onRemoveMember: (userId: number) => void;
}

export default function MemberPanel({
  role,
  members,
  currentUserId,
  saving,
  onAddMember,
  onSave,
  onReset,
  onRemoveMember,
}: MemberPanelProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  console.log('MemberPanel currentUserId:', currentUserId);

  const filteredMembers = useMemo(() => {
    const keyword = appliedSearch.trim().toLowerCase();

    if (!keyword) {
      return members;
    }

    return members.filter((member) => {
      return (
        String(member.userId ?? '').includes(keyword) ||
        member.employeeCode?.toLowerCase().includes(keyword) ||
        member.fullName?.toLowerCase().includes(keyword) ||
        member.email?.toLowerCase().includes(keyword)
      );
    });
  }, [members, appliedSearch]);

  return (
    <section className={styles.memberPanel}>
      {/* HEADER */}
      <div className={styles.memberPanelHeader}>
        <div>
          <div className={styles.memberLabel}>Thành viên của nhóm</div>

          <h2 className={styles.memberTitle}>{role.roleName}</h2>

          <p className={styles.memberDescription}>
            Hiện có {members.length} thành viên trong nhóm.
          </p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.addMemberHeaderBtn} onClick={onAddMember}>
            <UserPlus size={16} />
            Thêm thành viên
          </button>

          <button type="button" onClick={onReset} disabled={saving} className={styles.resetBtn}>
            <RefreshCw size={16} />
            Hoàn tác
          </button>

          <button type="button" onClick={onSave} disabled={saving} className={styles.saveBtn}>
            <Save size={16} />

            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <form className={styles.searchSection}>
        <div className={styles.searchInputWrapper}>
          <Search size={18} className={styles.searchIcon} />

          <input
            type="text"
            className={styles.searchInput}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Nhập mã nhân viên, họ tên hoặc email..."
          />
        </div>

        <button
          type="button"
          className={styles.searchBtn}
          onClick={() => setAppliedSearch(searchKeyword)}
        >
          <Search size={16} />
          Tìm kiếm
        </button>
      </form>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Employee ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>

                  <td>{user.employeeCode}</td>

                  <td>
                    <div className={styles.userName}>{user.fullName}</div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    {user.userId !== currentUserId && (
                      <button
                        type="button"
                        className={styles.removeMemberBtn}
                        onClick={() => onRemoveMember(user.userId)}
                      >
                        <Trash2 size={15} />
                        Bỏ khỏi nhóm
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  không tồn tại nhân viên.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
