'use client';

import React from 'react';
import { Lock, RotateCcw, Save, ShieldCheck } from 'lucide-react';

import { usePermissions } from './usePermissions';
import styles from './Permissions.module.css';

export default function PermissionPage() {
  const {
    roles,
    apis,
    actions,
    selectedRole,
    setSelectedRole,
    rolePermissions,
    hasPermission,
    isActionSupported,
    handleTogglePermission,
    handleSave,
    isLoading,
  } = usePermissions();

  const selectedRoleData = roles.find((role) => role.roleId === selectedRole);

  const totalPermissions = apis.reduce((total, api) => total + (api.actions?.length ?? 0), 0);

  const enabledPermissions = rolePermissions.filter((permission) => {
    const [apiLink, actionName] = permission.split(':');

    return isActionSupported(apiLink, actionName);
  }).length;

  return (
    <div
      className="relative p-6"
      style={{
        color: 'var(--text)',
      }}
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="
              font-display text-xl
              font-bold
            "
            style={{
              color: 'var(--text)',
            }}
          >
            Quản lý quyền truy cập
          </h1>

          <p
            className="mt-0.5 text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Quản lý quyền View, Create, Update và Delete cho từng role trên các màn hình trong hệ
            thống.
          </p>
        </div>

        {/* ROLE ĐANG CHỌN */}

        <div
          className="
            flex items-center
            gap-2.5 rounded-lg
            border px-3 py-2
          "
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <ShieldCheck
            size={18}
            style={{
              color: 'var(--primary)',
            }}
          />

          <div>
            <div
              className="text-xs"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              Role đang chọn
            </div>

            <div
              className="text-sm font-semibold"
              style={{
                color: 'var(--text)',
              }}
            >
              {selectedRoleData?.roleName ?? '-'}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          ROLE SELECT
      ================================================== */}

      <div
        className="
          mb-5 rounded-xl
          border p-4
        "
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                color: 'var(--primary)',
              }}
            >
              Quyền của role
            </div>

            <h2
              className="mt-1 text-lg font-bold"
              style={{
                color: 'var(--text)',
              }}
            >
              {selectedRoleData?.roleName ?? '-'}
            </h2>

            <p
              className="mt-0.5 text-sm"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              Quản lý quyền API/action cho role đang chọn.
            </p>
          </div>

          <select
            className="
              rounded-lg border
              px-3 py-2
              text-sm outline-none
              focus:border-[var(--primary)]
            "
            value={selectedRole ?? ''}
            onChange={(event) => setSelectedRole(Number(event.target.value))}
            disabled={isLoading}
            style={{
              minWidth: '180px',
              background: 'var(--surface)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          >
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =================================================
          PERMISSION MATRIX
      ================================================== */}

      <div className={styles.matrix}>
        <div className={styles.matrixHeader}>
          <div className={styles.matrixHeaderContent}>
            <div>
              <h2 className={styles.matrixTitle}>Ma trận phân quyền</h2>

              <p className={styles.matrixDescription}>
                Bật/tắt từng Action mà role được phép thực hiện trên API.
              </p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.resetBtn}
                disabled={isLoading}
                onClick={() => window.location.reload()}
              >
                <RotateCcw size={15} />
                Reset
              </button>

              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save size={15} />

                {isLoading ? 'Đang lưu...' : 'Lưu phân quyền'}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Đang tải dữ liệu phân quyền...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Chức năng / Màn hình</th>

                  {actions.map((action) => (
                    <th key={action.actionId}>{action.actionName}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {apis.map((api) => (
                  <tr key={api.apiId}>
                    <td>
                      <div className={styles.apiName}>{api.apiDescription}</div>
                    </td>

                    {actions.map((action) => {
                      const actionName = action.actionName.toUpperCase();

                      const supported = isActionSupported(api.apiLink, actionName);

                      if (!supported) {
                        return (
                          <td key={action.actionId} className={styles.permissionCell}>
                            <span className={styles.notSupported}>-</span>
                          </td>
                        );
                      }

                      const checked = hasPermission(api.apiLink, actionName);

                      return (
                        <td key={action.actionId} className={styles.permissionCell}>
                          <label className={styles.switch}>
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isLoading}
                              onChange={() => handleTogglePermission(api.apiLink, actionName)}
                            />

                            <span className={styles.slider} />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          NOTE
      ================================================== */}

      <div className={styles.note}>
        <div className={styles.noteIcon}>
          <Lock size={17} />
        </div>

        <div>
          <div className={styles.black}>Tổng quan quyền</div>

          <p className={styles.noteText}>
            Role hiện tại đang có <strong>{enabledPermissions}</strong> / {totalPermissions} quyền
            được kích hoạt. Những ô có dấu <strong>-</strong> nghĩa là API đó không hỗ trợ Action
            tương ứng trong hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
}
