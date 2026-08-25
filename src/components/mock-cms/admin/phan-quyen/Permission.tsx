'use client';

import React from 'react';
import { Check, Edit3, Eye, Lock, Save, ShieldCheck, Users, RotateCcw } from 'lucide-react';

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
    handleTogglePermission,
    hasPermission,
    handleSave,
    isLoading,
  } = usePermissions();

  const API_ACTIONS: Record<string, string[]> = {
    user: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],

    role: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],

    permission: ['VIEW', 'UPDATE'],

    post: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],

    category: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],

    media: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],

    contact: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],

    global: ['VIEW', 'UPDATE'],

    logs: ['VIEW'],
  };

  const selectedRoleData = roles.find((role) => role.roleId === selectedRole);

  const getActionClass = (actionName: string) => {
    const normalized = actionName.toUpperCase();

    if (normalized === 'VIEW') {
      return `${styles.actionBadge} ${styles.actionView}`;
    }

    if (normalized === 'CREATE') {
      return `${styles.actionBadge} ${styles.actionCreate}`;
    }

    if (normalized === 'UPDATE') {
      return `${styles.actionBadge} ${styles.actionUpdate}`;
    }

    if (normalized === 'DELETE') {
      return `${styles.actionBadge} ${styles.actionDelete}`;
    }

    return styles.actionBadge;
  };

  const totalPermissions = apis.reduce((total, api) => {
    const supportedActions = API_ACTIONS[api.apiLink] ?? [];

    return total + supportedActions.length;
  }, 0);

  const enabledPermissions = rolePermissions.filter((permission) => {
    const [apiLink, actionName] = permission.split(':');

    return API_ACTIONS[apiLink]?.includes(actionName) ?? false;
  }).length;

  return (
    <div className={styles.container}>
      {/* =====================================================
          Header
      ====================================================== */}

      <section className={styles.headerSection}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <div>
              <div className={styles.headerLabel}>Phân quyền</div>

              <h1 className={styles.headerTitle}>Quản lý quyền truy cập</h1>

              <p className={styles.headerDescription}>
                Quản lý quyền View, Create, Update và Delete cho từng role trên các màn hình trong
                hệ thống.
              </p>
            </div>

            <div className={styles.roleIndicator}>
              <ShieldCheck size={20} className={styles.roleIndicatorIcon} />

              <div>
                <div className={styles.roleIndicatorLabel}>Role đang chọn</div>

                <div className={styles.roleIndicatorValue}>{selectedRoleData?.roleName ?? '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Main
      ====================================================== */}

      <main className={styles.main}>
        {/* ===================================================
            Selected Role
        ==================================================== */}

        <div className={styles.permissionHeaderGrid}>
          <div className={styles.permissionHeaderCard}>
            <div className={styles.permissionHeaderContent}>
              <div>
                <div className={styles.permissionLabel}>Quyền của role</div>

                <h2 className={styles.permissionTitle}>{selectedRoleData?.roleName ?? '-'}</h2>

                <p className={styles.permissionDescription}>
                  Quản lý quyền API/action cho role đang chọn.
                </p>
              </div>

              <select
                className={styles.roleSelect}
                value={selectedRole ?? ''}
                onChange={(event) => setSelectedRole(Number(event.target.value))}
                disabled={isLoading}
              >
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===================================================
            Permission Matrix
        ==================================================== */}

        <div className={styles.matrix}>
          {/* Matrix Header */}

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

          {/* =================================================
              Table
          ================================================== */}

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
                  {apis.map((api) => {
                    const supportedActions = API_ACTIONS[api.apiLink] ?? [];

                    return (
                      <tr key={api.apiId}>
                        <td>
                          <div className={styles.apiName}>{api.apiDescription}</div>
                        </td>

                        {actions.map((action) => {
                          const actionName = action.actionName.toUpperCase();

                          const isSupported = supportedActions.includes(actionName);

                          /**
                           * API khﾃｴng h盻・tr盻｣ action nﾃy
                           */
                          if (!isSupported) {
                            return (
                              <td key={action.actionId} className={styles.permissionCell}>
                                <span
                                  style={{
                                    opacity: 0.4,
                                    fontWeight: 600,
                                  }}
                                >
                                  -
                                </span>
                              </td>
                            );
                          }

                          /**
                           * API cﾃｳ h盻・tr盻｣ action
                           */
                          const checked = hasPermission(api.apiLink, actionName);

                          return (
                            <td key={action.actionId} className={styles.permissionCell}>
                              <label className={styles.switch}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleTogglePermission(api.apiLink, actionName)}
                                />

                                <span className={styles.slider} />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===================================================
            Permission Detail
        ==================================================== */}

        <div className={styles.note}>
          <div className={styles.noteIcon}>
            <Lock size={17} />
          </div>

          <div>
            <div className={styles.noteTitle}>Tổng quan quyền</div>

            <p className={styles.noteText}>
              Role hiện tại đang có <strong>{enabledPermissions}</strong> / {totalPermissions} quyền
              được kích hoạt. Những ô có dấu <strong>-</strong> nghĩa là API đó không hỗ trợ Action
              tương ứng trong hệ thống.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
