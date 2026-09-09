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
    <div className={styles.container}>
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

      <main className={styles.main}>
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
