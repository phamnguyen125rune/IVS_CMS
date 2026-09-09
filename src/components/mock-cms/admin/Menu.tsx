'use client';

import { useMenu } from './menu/hooks/useMenu';
import MenuList from './menu/MenuList';
import MenuForm from './menu/MenuForm';
import MenuStats from './menu/MenuStats';

import '@/components/layout/admin/menu_styles/Menu.css';

export default function Categories() {
  const {
    sortedMenus,
    form,
    editingId,
    loading,
    saving,
    error,
    draggedId,
    dragOverId,
    availableParents,
    totalMenus,
    visibleMenus,
    hiddenMenus,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    handleToggleVisible,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    setForm,
  } = useMenu();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Menu</h1>

          <p className="text-slate-500 text-sm mt-0.5">Quản lý menu điều hướng của website</p>
        </div>
      </div>

      {error && <div className="menu-error">{error}</div>}

      <div className="menu-layout">
        <MenuList
          menus={sortedMenus}
          loading={loading}
          draggedId={draggedId}
          dragOverId={dragOverId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onToggleVisible={handleToggleVisible}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="menu-right">
          <MenuForm
            form={form}
            editingId={editingId}
            availableParents={availableParents}
            saving={saving}
            onChange={setForm}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />

          <MenuStats
            totalMenus={totalMenus}
            visibleMenus={visibleMenus}
            hiddenMenus={hiddenMenus}
          />
        </div>
      </div>
    </div>
  );
}
