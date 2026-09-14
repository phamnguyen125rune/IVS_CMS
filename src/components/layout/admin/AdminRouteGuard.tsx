'use client';

import { useEffect, useState } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { localizePath } from '@/components/navigation/LocalizedLink';
import { permissionService } from '@/services/permission.service';

interface NavPermission {
  path: string;
  apiLink: string;
}

/**
 * Các route đặc biệt:
 * - Không cần kiểm tra permission
 * - Không được tính vào hasAnyPermission
 */
const EXCLUDED_PERMISSION_APIS = ['dashboard', 'profile', 'setting'];

const actionName = 'VIEW';

const protectedRoutes: NavPermission[] = [
  {
    path: '/admin/tong-quan',
    apiLink: 'dashboard',
  },
  {
    path: '/admin/nhan-su',
    apiLink: 'user',
  },
  {
    path: '/admin/nhom-nhan-su',
    apiLink: 'role',
  },
  {
    path: '/admin/phan-quyen',
    apiLink: 'permission',
  },
  {
    path: '/admin/bai-viet',
    apiLink: 'post',
  },
  {
    path: '/admin/kiem-duyet',
    apiLink: 'post-review',
  },
  {
    path: '/admin/danh-muc',
    apiLink: 'category',
  },
  {
    path: '/admin/media',
    apiLink: 'media',
  },
  {
    path: '/admin/menu',
    apiLink: 'menu',
  },
  {
    path: '/admin/bieu-mau',
    apiLink: 'form',
  },
  {
    path: '/admin/cai-dat',
    apiLink: 'setting',
  },
  {
    path: '/admin/ho-so',
    apiLink: 'profile',
  },
];

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const language = typeof params?.language === 'string' ? params.language : 'vi';

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkRoutePermission = async () => {
      setChecking(true);

      try {
        /**
         * Tìm route hiện tại
         */
        const currentRoute = protectedRoutes.find((route) => {
          const href = localizePath(route.path, language);

          return pathname === href || pathname.startsWith(`${href}/`);
        });

        /**
         * Không phải route admin được cấu hình
         * -> Cho phép đi tiếp
         */
        if (!currentRoute) {
          if (!cancelled) {
            setChecking(false);
          }
          return;
        }

        /**
         * =====================================================
         * ROUTE ĐẶC BIỆT
         * =====================================================
         *
         * dashboard
         * profile
         * setting
         *
         * Không cần kiểm tra permission.
         */
        if (EXCLUDED_PERMISSION_APIS.includes(currentRoute.apiLink)) {
          if (!cancelled) {
            setChecking(false);
          }
          return;
        }

        /**
         * =====================================================
         * KIỂM TRA QUYỀN CỦA ROUTE HIỆN TẠI
         * =====================================================
         */
        let currentPermission = false;

        try {
          currentPermission = await permissionService.checkPermission({
            apiLink: currentRoute.apiLink,
            actionName: actionName,
          });
        } catch (error) {
          console.error('Check current route permission failed:', error);

          currentPermission = false;
        }

        /**
         * Có quyền VIEW route hiện tại
         * -> Cho phép truy cập
         */
        if (currentPermission) {
          if (!cancelled) {
            setChecking(false);
          }
          return;
        }

        /**
         * =====================================================
         * KHÔNG CÓ QUYỀN ROUTE HIỆN TẠI
         * =====================================================
         *
         * Kiểm tra xem user còn quyền feature nào khác không.
         *
         * dashboard
         * profile
         * setting
         *
         * bị loại khỏi danh sách này.
         */
        const permissionRoutes = protectedRoutes.filter(
          (route) => !EXCLUDED_PERMISSION_APIS.includes(route.apiLink)
        );

        const permissions = await Promise.all(
          permissionRoutes.map(async (route) => {
            try {
              return await permissionService.checkPermission({
                apiLink: route.apiLink,
                actionName: actionName,
              });
            } catch (error) {
              console.error(`Check permission failed: ${route.apiLink}`, error);

              return false;
            }
          })
        );

        /**
         * User có ít nhất 1 quyền feature
         */
        const hasAnyPermission = permissions.some((permission) => permission === true);

        if (cancelled) {
          return;
        }

        /**
         * Có ít nhất 1 quyền feature
         * -> chuyển sang Hồ sơ
         */
        if (hasAnyPermission) {
          router.replace(localizePath('/admin/ho-so', language));

          return;
        }

        /**
         * Không có bất kỳ quyền feature nào
         * -> chuyển về trang chủ
         */
        router.replace('/');
      } catch (error) {
        console.error('Permission check failed:', error);

        if (!cancelled) {
          router.replace('/');
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkRoutePermission();

    return () => {
      cancelled = true;
    };
  }, [pathname, language, router]);

  /**
   * Không render nội dung trong lúc kiểm tra
   */
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">Đang kiểm tra quyền...</div>
    );
  }

  return <>{children}</>;
}
