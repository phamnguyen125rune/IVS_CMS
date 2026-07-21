> ⚠️ **File này đã được tách ra và thay thế bởi thư mục `docs/`.** Xem:
>
> - [docs/02-coding-conventions.md](./docs/02-coding-conventions.md) — Quy chuẩn TypeScript, import, naming
> - [docs/03-commenting.md](./docs/03-commenting.md) — Quy chuẩn viết comment
> - [docs/04-git.md](./docs/04-git.md) — Quy trình Git, commit, branch

# Hướng Dẫn Phát Triển & Quy Chuẩn Mã Nguồn (DEVELOPMENT.md)

Tài liệu này cung cấp các quy chuẩn bắt buộc về lập trình, viết comment, quy trình Git và hướng dẫn sử dụng các công cụ tự động hóa cho đội ngũ phát triển dự án **Apex CMS**.

---

## 1. Quy Chuẩn Viết Code (Coding Conventions)

### Thiết kế Thư mục (Modular Architecture)

Dự án được tổ chức theo module tính năng (`Modular / Feature-Sliced Design`). Yêu cầu:

- **Không nhét chung code:** Tách biệt giao diện (Components/Pages) khỏi logic kết nối API (Services).
- **Absolute Import:** Bắt buộc sử dụng alias `@/*` (ví dụ: `@/components/navbar`, `@/services/user.service`) để tránh tình trạng import tương đối sâu (`../../../../utils`).

### Nguyên tắc TypeScript (Strict Mode)

- **Khai báo kiểu dữ liệu:** Bắt buộc định nghĩa kiểu dữ liệu cho tất cả props, state, tham số của hàm và kiểu trả về của API. Các interface dùng chung phải được khai báo trong `@/types`.
- **Tránh sử dụng `any`:** Việc ép kiểu `any` là hành vi vi phạm quy chuẩn biên dịch. Sử dụng `unknown` hoặc viết custom type/interface nếu kiểu dữ liệu chưa xác định.
- **Xử lý null/undefined:** Sử dụng optional chaining (`user?.role?.name`) và toán tử nullish coalescing (`user.avatarUrl ?? '/default-avatar.png'`) để tránh lỗi runtime.

---

## 2. Quy Chuẩn Viết Comment (Commenting Standards)

### JSDoc cho các hàm/lớp nghiệp vụ

Tất cả các hàm trong thư mục `@/services` và các helper functions phức tạp phải được viết comment JSDoc để lập trình viên khác có thể hiểu ngay mục đích và kiểu dữ liệu:

```typescript
/**
 * Thực hiện gọi API đăng nhập hệ thống và ghi nhận phiên làm việc.
 * @param loginId Email hoặc Mã nhân viên của người dùng.
 * @param password Mật khẩu đăng nhập.
 * @returns Trả về Promise chứa access token và thông tin cơ bản của người dùng.
 * @throws {ApiError} Trả về lỗi 401 nếu thông tin đăng nhập không hợp lệ.
 */
async login(loginId: string, password: string): Promise<AuthResponse> {
  // logic implementation...
}
```

### Comment Phân định Ranh giới Render (RSC vs Client Component)

Next.js sử dụng cơ chế Server Component mặc định để tối ưu SEO. Khi tạo một Client Component (sử dụng `'use client'`), bạn phải viết comment giải thích rõ lý do:

```typescript
'use client'; // Bắt buộc chuyển sang Client Component vì cần sử dụng hooks tương tác

import { useState } from 'react';
// ...
```

---

## 3. Quy Quy Trình Git & Commits (Git Workflow)

### Đặt tên Branch (Nhánh)

Tên nhánh phải được viết bằng tiếng Anh không dấu, chữ thường, kết nối bằng dấu gạch ngang `-` và phân loại rõ ràng:

- **Tính năng mới:** `feature/ten-tinh-nang` (ví dụ: `feature/user-creation-modal`)
- **Sửa lỗi:** `bugfix/ten-loi` (ví dụ: `bugfix/auth-cookie-refresh`)
- **Sửa lỗi khẩn cấp (trên production):** `hotfix/ten-loi` (ví dụ: `hotfix/login-crash`)

### Định dạng Commit Message (Conventional Commits)

Thông điệp commit phải tuân thủ định dạng chuẩn để dễ dàng quản lý lịch sử:
`type(scope): description`

Các loại `type` thường dùng:

- `feat`: Thêm tính năng mới (ví dụ: `feat(users): add role editing support`)
- `fix`: Sửa lỗi (ví dụ: `fix(auth): clear cookies on session timeout`)
- `docs`: Cập nhật tài liệu (ví dụ: `docs(guidelines): update git branch rules`)
- `style`: Sửa định dạng code (không thay đổi logic chạy, ví dụ: chạy prettier)
- `refactor`: Tái cấu trúc mã nguồn (ví dụ: chuyển đổi service sang dùng adapter)

---

## 4. Hướng Dẫn Các Câu Lệnh Thường Dùng (Command Reference)

Dự án tích hợp sẵn các công cụ tự động hóa định dạng và kiểm tra tĩnh. Trước khi thực hiện `git commit` hoặc tạo Pull Request, lập trình viên **bắt buộc** phải chạy kiểm tra cục bộ:

| Lệnh chạy          | Mục đích                                                    | Khi nào dùng                                      |
| :----------------- | :---------------------------------------------------------- | :------------------------------------------------ |
| `npm run dev`      | Khởi động server local phát triển (`http://localhost:3000`) | Hằng ngày khi lập trình                           |
| `npm run build`    | Đóng gói sản phẩm tối ưu hóa                                | Trước khi deploy hoặc muốn check lỗi compile tĩnh |
| `npm run start`    | Chạy dự án đã build ở chế độ production                     | Khi test hiệu năng production                     |
| `npm run lint`     | Kiểm tra tĩnh toàn bộ code bằng ESLint                      | Trước khi commit code                             |
| `npm run lint:fix` | **Tự động sửa** các lỗi cú pháp code cơ bản                 | Khi lệnh lint báo lỗi có thể tự sửa               |
| `npm run format`   | **Tự động format** toàn bộ file trong dự án bằng Prettier   | Trước khi commit code để tránh lệch format        |

### Ví dụ quy trình làm việc chuẩn hằng ngày:

```bash
# 1. Viết code xong, tiến hành tự động format code
npm run format

# 2. Chạy check lỗi cú pháp code
npm run lint

# 3. Nếu lint báo lỗi có thể tự sửa, chạy:
npm run lint:fix

# 4. Kiểm tra biên dịch dự án Next.js xem có lỗi type tĩnh không
npm run build

# 5. Nếu mọi thứ thành công, tiến hành commit code
git add .
git commit -m "feat(profile): implement profile details page"
```
