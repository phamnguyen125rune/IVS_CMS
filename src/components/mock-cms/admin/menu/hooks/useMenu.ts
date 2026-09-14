import { useEffect, useMemo, useState } from 'react';
import { initialForm, MenuFormData, Menu } from '@/types/menu.type';

export function useMenu() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [form, setForm] = useState<MenuFormData>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/v1/menus');
      if (!response.ok) throw new Error(`Không thể tải danh sách menu (${response.status})`);
      const data = await response.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Không thể tải menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMenus();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const getDescendantIds = (parentId: number): number[] => {
    const children = menus.filter((menu) => menu.parentId === parentId);
    return children.reduce<number[]>(
      (ids, child) => [...ids, child.menuId, ...getDescendantIds(child.menuId)],
      []
    );
  };

  const handleParentChange = (parentId: string) => {
    if (!parentId) {
      setError('');
      setForm((prev) => ({ ...prev, parentId: null, level: 1 }));
      return;
    }

    const selectedParentId = Number(parentId);

    if (editingId !== null && selectedParentId === editingId) {
      setError('Menu không thể làm parent của chính nó');
      setForm((prev) => ({ ...prev, parentId: null, level: 1 }));
      return;
    }

    const descendantIds = editingId !== null ? getDescendantIds(editingId) : [];

    if (descendantIds.includes(selectedParentId)) {
      setError('Không thể chọn menu con của chính menu đang sửa');
      setForm((prev) => ({ ...prev, parentId: null, level: 1 }));
      return;
    }

    const parent = menus.find((menu) => menu.menuId === selectedParentId);

    if (!parent) {
      setError('');
      setForm((prev) => ({ ...prev, parentId: null, level: 1 }));
      return;
    }

    const nextLevel = parent.level + 1;

    if (nextLevel > 3) {
      setError('Menu chỉ được phép tối đa 3 cấp');
      setForm((prev) => ({ ...prev, parentId: null, level: 1 }));
      return;
    }

    setError('');
    setForm((prev) => ({
      ...prev,
      parentId: parent.menuId,
      level: nextLevel,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Vui lòng nhập tên menu');
      return;
    }

    if (!form.url.trim()) {
      setError('Vui lòng nhập đường dẫn');
      return;
    }

    if (editingId !== null && form.parentId === editingId) {
      setError('Menu không thể làm parent của chính nó');
      return;
    }

    if (editingId !== null && form.parentId !== null) {
      const descendantIds = getDescendantIds(editingId);
      if (descendantIds.includes(form.parentId)) {
        setError('Không thể chọn menu con của chính menu đang sửa');
        return;
      }
    }

    if (form.level < 1 || form.level > 3) {
      setError('Cấp menu không hợp lệ');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const url = editingId ? `/api/v1/menus/${editingId}` : '/api/v1/menus';
      const currentMenu = editingId ? menus.find((menu) => menu.menuId === editingId) : null;
      const nextDisplayOrder = editingId
        ? (currentMenu?.displayOrder ?? 1)
        : menus.length > 0
          ? Math.max(...menus.map((menu) => menu.displayOrder)) + 1
          : 1;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          url: form.url.trim(),
          parentId: form.parentId,
          displayOrder: nextDisplayOrder,
          level: form.level,
          visible: form.visible,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Thao tác thất bại (${response.status})`);
      }

      setForm(initialForm);
      setEditingId(null);

      const channel = new BroadcastChannel('menu-updated');
      channel.postMessage({ type: 'updated' });
      channel.close();

      await loadMenus();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Không thể lưu menu');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingId(menu.menuId);
    setForm({
      title: menu.title,
      url: menu.url,
      parentId: menu.parentId ?? null,
      level: menu.level,
      visible: menu.visible,
    });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError('');
  };

  const handleDelete = async (id: number) => {
    const menu = menus.find((item) => item.menuId === id);
    if (!menu) return;

    if (!window.confirm(`Bạn có chắc muốn xóa menu "${menu.title}"?`)) return;

    try {
      setError('');

      const response = await fetch(`/api/v1/menus/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Không thể xóa menu (${response.status})`);
      }

      if (editingId === id) handleCancelEdit();

      const channel = new BroadcastChannel('menu-updated');
      channel.postMessage({ type: 'updated' });
      channel.close();

      await loadMenus();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Không thể xóa menu');
    }
  };

  const handleToggleVisible = async (menu: Menu) => {
    try {
      setError('');

      const response = await fetch(`/api/v1/menus/${menu.menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: menu.title,
          url: menu.url,
          parentId: menu.parentId,
          displayOrder: menu.displayOrder,
          level: menu.level,
          visible: !menu.visible,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Không thể cập nhật trạng thái menu');
      }

      const channel = new BroadcastChannel('menu-updated');
      channel.postMessage({ type: 'updated' });
      channel.close();

      await loadMenus();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái menu');
    }
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
    setDragOverId(null);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();

    if (draggedId === null || draggedId === id) return;

    const descendantIds = getDescendantIds(draggedId);

    if (descendantIds.includes(id)) {
      setDragOverId(null);
      return;
    }

    setDragOverId(id);
  };

  const sortedMenus = useMemo(() => {
    const result: Menu[] = [];

    const addMenus = (parentId: number | null) => {
      const children = menus
        .filter((menu) => menu.parentId === parentId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      children.forEach((menu) => {
        result.push(menu);
        addMenus(menu.menuId);
      });
    };

    addMenus(null);

    if (result.length !== menus.length) {
      const existingIds = new Set(result.map((menu) => menu.menuId));

      menus
        .filter((menu) => !existingIds.has(menu.menuId))
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .forEach((menu) => result.push(menu));
    }

    return result;
  }, [menus]);

  const updateBranchLevels = (menuList: Menu[], rootId: number, rootLevel: number): Menu[] => {
    let result = menuList.map((menu) =>
      menu.menuId === rootId ? { ...menu, level: rootLevel } : menu
    );

    const updateChildren = (parentId: number, parentLevel: number) => {
      result = result.map((menu) =>
        menu.parentId === parentId ? { ...menu, level: parentLevel + 1 } : menu
      );

      const children = result.filter((menu) => menu.parentId === parentId);

      children.forEach((child) => {
        updateChildren(child.menuId, child.level);
      });
    };

    updateChildren(rootId, rootLevel);
    return result;
  };

  const normalizeDisplayOrders = (menuList: Menu[]): Menu[] => {
    const result = [...menuList];
    const parentIds: (number | null)[] = [null, ...result.map((menu) => menu.menuId)];

    parentIds.forEach((parentId) => {
      const children = result
        .filter((menu) => menu.parentId === parentId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      children.forEach((child, index) => {
        const position = result.findIndex((menu) => menu.menuId === child.menuId);

        if (position !== -1) {
          result[position] = {
            ...result[position],
            displayOrder: index + 1,
          };
        }
      });
    });

    return result;
  };

  const handleDrop = async (targetId: number) => {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedMenu = menus.find((menu) => menu.menuId === draggedId);
    const targetMenu = menus.find((menu) => menu.menuId === targetId);

    if (!draggedMenu || !targetMenu) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const descendantIds = getDescendantIds(draggedId);

    if (descendantIds.includes(targetId)) {
      setError('Không thể kéo menu cha vào menu con của nó');
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    let updatedMenus: Menu[];

    if (draggedMenu.parentId === targetMenu.parentId) {
      const siblings = menus
        .filter((menu) => menu.parentId === draggedMenu.parentId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const draggedIndex = siblings.findIndex((menu) => menu.menuId === draggedId);

      const targetIndex = siblings.findIndex((menu) => menu.menuId === targetId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const [draggedItem] = siblings.splice(draggedIndex, 1);

      siblings.splice(targetIndex, 0, draggedItem);

      const orderMap = new Map<number, number>();

      siblings.forEach((menu, index) => {
        orderMap.set(menu.menuId, index + 1);
      });

      updatedMenus = menus.map((menu) => {
        const newOrder = orderMap.get(menu.menuId);

        return newOrder !== undefined ? { ...menu, displayOrder: newOrder } : menu;
      });
    } else if (draggedMenu.level === 2 && targetMenu.level === 2) {
      const newParentId = targetMenu.parentId;

      if (newParentId === null) {
        setError('Không xác định được menu cha');
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      updatedMenus = menus.map((menu) =>
        menu.menuId === draggedId
          ? {
              ...menu,
              parentId: newParentId,
              level: 2,
            }
          : menu
      );

      const siblings = updatedMenus
        .filter((menu) => menu.parentId === newParentId && menu.menuId !== draggedId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const targetIndex = siblings.findIndex((menu) => menu.menuId === targetId);

      const [draggedItem] = updatedMenus.filter((menu) => menu.menuId === draggedId);

      if (draggedItem) {
        siblings.splice(targetIndex >= 0 ? targetIndex : siblings.length, 0, draggedItem);
      }

      const orderMap = new Map<number, number>();

      siblings.forEach((menu, index) => {
        orderMap.set(menu.menuId, index + 1);
      });

      updatedMenus = updatedMenus.map((menu) => {
        const newOrder = orderMap.get(menu.menuId);

        return newOrder !== undefined ? { ...menu, displayOrder: newOrder } : menu;
      });

      updatedMenus = updateBranchLevels(updatedMenus, draggedId, 2);

      updatedMenus = normalizeDisplayOrders(updatedMenus);
    } else if (draggedMenu.level === 2 && targetMenu.level === 1) {
      const newParentId = targetMenu.menuId;
      const newLevel = 2;

      updatedMenus = menus.map((menu) =>
        menu.menuId === draggedId
          ? {
              ...menu,
              parentId: newParentId,
              level: newLevel,
            }
          : menu
      );

      updatedMenus = updateBranchLevels(updatedMenus, draggedId, newLevel);

      const siblings = updatedMenus
        .filter((menu) => menu.parentId === newParentId && menu.menuId !== draggedId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const targetIndex = siblings.length;

      const draggedItem = updatedMenus.find((menu) => menu.menuId === draggedId);

      if (draggedItem) {
        siblings.splice(targetIndex, 0, draggedItem);
      }

      const orderMap = new Map<number, number>();

      siblings.forEach((menu, index) => {
        orderMap.set(menu.menuId, index + 1);
      });

      updatedMenus = updatedMenus.map((menu) => {
        const newOrder = orderMap.get(menu.menuId);

        return newOrder !== undefined ? { ...menu, displayOrder: newOrder } : menu;
      });

      updatedMenus = normalizeDisplayOrders(updatedMenus);
    } else if (draggedMenu.level === 1 && targetMenu.level === 1) {
      const siblings = menus
        .filter((menu) => menu.parentId === null)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const draggedIndex = siblings.findIndex((menu) => menu.menuId === draggedId);

      const targetIndex = siblings.findIndex((menu) => menu.menuId === targetId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const [draggedItem] = siblings.splice(draggedIndex, 1);

      siblings.splice(targetIndex, 0, draggedItem);

      const orderMap = new Map<number, number>();

      siblings.forEach((menu, index) => {
        orderMap.set(menu.menuId, index + 1);
      });

      updatedMenus = menus.map((menu) => {
        const newOrder = orderMap.get(menu.menuId);

        return newOrder !== undefined
          ? {
              ...menu,
              parentId: null,
              level: 1,
              displayOrder: newOrder,
            }
          : menu;
      });
    } else {
      if (targetMenu.level >= 3) {
        setError('Menu chỉ được phép tối đa 3 cấp');
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const newParentId = targetMenu.menuId;
      const newLevel = targetMenu.level + 1;

      updatedMenus = menus.map((menu) =>
        menu.menuId === draggedId
          ? {
              ...menu,
              parentId: newParentId,
              level: newLevel,
            }
          : menu
      );

      updatedMenus = updateBranchLevels(updatedMenus, draggedId, newLevel);

      const siblings = updatedMenus
        .filter((menu) => menu.parentId === newParentId && menu.menuId !== draggedId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

      const maxOrder =
        siblings.length > 0 ? Math.max(...siblings.map((menu) => menu.displayOrder)) : 0;

      updatedMenus = updatedMenus.map((menu) =>
        menu.menuId === draggedId
          ? {
              ...menu,
              displayOrder: maxOrder + 1,
            }
          : menu
      );

      updatedMenus = normalizeDisplayOrders(updatedMenus);
    }

    setMenus(updatedMenus);
    setDraggedId(null);
    setDragOverId(null);

    try {
      setError('');

      await Promise.all(
        updatedMenus.map(async (menu) => {
          const response = await fetch(`/api/v1/menus/${menu.menuId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: menu.title,
              url: menu.url,
              parentId: menu.parentId,
              displayOrder: menu.displayOrder,
              level: menu.level,
              visible: menu.visible,
            }),
          });

          if (!response.ok) {
            const message = await response.text();

            throw new Error(message || `Không thể cập nhật menu (${response.status})`);
          }
        })
      );

      const channel = new BroadcastChannel('menu-updated');
      channel.postMessage({ type: 'updated' });
      channel.close();

      await loadMenus();
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : 'Không thể cập nhật menu');

      await loadMenus();
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const totalMenus = menus.length;
  const level1Menus = menus.filter((menu) => menu.level === 1).length;
  const visibleMenus = menus.filter((menu) => menu.visible).length;
  const hiddenMenus = totalMenus - visibleMenus;

  const descendantIds = editingId !== null ? getDescendantIds(editingId) : [];

  const availableParents = menus.filter(
    (menu) => menu.menuId !== editingId && !descendantIds.includes(menu.menuId) && menu.level < 3
  );

  return {
    menus,
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
    level1Menus,
    visibleMenus,
    hiddenMenus,
    setForm,
    handleParentChange,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    handleToggleVisible,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
