# Feature Map — Ánh xạ Yêu Cầu Tính Năng

Tài liệu này liên kết từng yêu cầu từ team nội dung đến vị trí file tương ứng trong dự án.

> Trạng thái: `PLACEHOLDER` = thư mục/file đã có, chưa implement  
> Trạng thái: `PENDING` = chưa có file, cần tạo  
> Trạng thái: `DONE` = đã implement

---

## Phân hệ Admin — Trang quản trị

| Tính năng | File / Thư mục | Trạng thái |
|-----------|----------------|------------|
| **Xác thực (JWT)** | `src/app/[locale]/(auth)/login/page.tsx` | PLACEHOLDER |
| | `src/app/api/auth/login/route.ts` | PLACEHOLDER |
| | `src/app/api/auth/logout/route.ts` | PLACEHOLDER |
| | `src/middleware.ts` — auth guard | ✅ Có cơ bản |
| **Quản lý phân quyền (RBAC)** | `src/types/index.ts` — `Role`, `User` | PLACEHOLDER |
| | `src/app/[locale]/(admin)/users/page.tsx` — danh sách user | PLACEHOLDER |
| | Java: `controller/UserController.java` | PLACEHOLDER |
| **Quản lý Profile** | `src/app/[locale]/(admin)/profile/page.tsx` | PLACEHOLDER |
| **Quản lý nội dung (CRUD bài viết)** | `src/app/[locale]/(admin)/posts/page.tsx` | PENDING |
| | `src/app/[locale]/(admin)/posts/[id]/edit/page.tsx` | PENDING |
| | `src/types/index.ts` — `Post`, `ContentStatus` | PLACEHOLDER |
| **Trình soạn thảo phong phú** | `src/components/editor/RichTextEditor.tsx` | PENDING |
| | Thư viện: CKEditor / TinyMCE / Quill | PENDING |
| | NOTE: Bắt buộc dùng `dynamic(() => import(...), { ssr: false })` | — |
| **Trạng thái bài viết (Workflow)** | `src/types/index.ts` — `ContentStatus` enum | PLACEHOLDER |
| | `Draft → Pending → Published → Archived → Trash` | — |
| **Quản lý danh mục (Categories & Tags)** | `src/app/[locale]/(admin)/categories/page.tsx` | PENDING |
| | `src/app/[locale]/(admin)/tags/page.tsx` | PENDING |
| | `src/types/index.ts` — `Category`, `Tag` | PLACEHOLDER |
| **Thư viện media (Grid view)** | `src/app/[locale]/(admin)/media/page.tsx` | PENDING |
| | `src/components/media/MediaGrid.tsx` | PENDING |
| | `src/types/index.ts` — `MediaFile` | PLACEHOLDER |
| **Tải lên file (Upload + WebP)** | `src/services/storage.service.ts` — skeleton | PLACEHOLDER |
| | `src/app/api/upload/route.ts` — API endpoint | PENDING |
| | NOTE: Hỗ trợ Local và S3, chọn qua `STORAGE_TYPE` env | — |
| **Quản lý thông tin liên hệ** | `src/app/[locale]/(admin)/contacts/page.tsx` | PENDING |
| **Cấu hình hệ thống (Settings)** | `src/app/[locale]/(admin)/settings/page.tsx` | PENDING |
| | `src/types/index.ts` — `SystemSettings` | PLACEHOLDER |

---

## Phân hệ Client — Trang công khai

| Tính năng | File / Thư mục | Trạng thái |
|-----------|----------------|------------|
| **Hiển thị nội dung động** | `src/app/[locale]/(client)/news/page.tsx` | PLACEHOLDER |
| | `src/app/[locale]/(client)/news/[slug]/page.tsx` — chi tiết | PENDING |
| **SEO (SSR + CSR)** | Tất cả trang `(client)/` đều là Server Component mặc định | ✅ Thiết kế sẵn |
| | Metadata API: `export const metadata` trong từng `page.tsx` | PENDING |
| **Đa ngôn ngữ (i18n)** | `src/app/[locale]/` — locale prefix trong URL | ✅ Cấu trúc sẵn |
| | `src/middleware.ts` — tự redirect theo Accept-Language | ✅ Có |
| | NOTE: Thư viện i18n (next-intl) chưa cài, tích hợp sau | — |
| **Giới thiệu doanh nghiệp** | `src/app/[locale]/(client)/about/page.tsx` | PLACEHOLDER |
| | Nội dung: lịch sử, sứ mệnh, tầm nhìn, đội ngũ | — |
| **Danh mục sản phẩm / dịch vụ** | `src/app/[locale]/(client)/products/page.tsx` | PLACEHOLDER |
| | `src/app/[locale]/(client)/products/[slug]/page.tsx` — chi tiết | PENDING |
| **Tin tức & Sự kiện** | `src/app/[locale]/(client)/news/page.tsx` | PLACEHOLDER |
| | `src/app/[locale]/(client)/news/[slug]/page.tsx` — chi tiết | PENDING |
| **Form thu thập (Contact Form)** | `src/components/forms/ContactForm.tsx` | PENDING |
| | `src/app/api/contact/route.ts` — xử lý gửi form | PENDING |
| **Liên hệ & Bản đồ** | `src/app/[locale]/(client)/contact/page.tsx` | PLACEHOLDER |
| | NOTE: Google Maps cần `'use client'` và API key | — |
| **Tìm kiếm và Lọc** | `src/components/search/SearchBar.tsx` | PENDING |
| | NOTE: Full-text search cần Java backend hỗ trợ (PostgreSQL FTS hoặc Elasticsearch) | — |

---

## Môi trường và biến cấu hình

Các biến môi trường cần thiết (khai báo trong `.env.local`):

| Biến | Mục đích | Ví dụ |
|------|---------|-------|
| `JAVA_API_URL` | Địa chỉ Java Spring Boot | `http://localhost:8080` |
| `STORAGE_TYPE` | Chiến lược lưu file | `local` hoặc `s3` |
| `S3_BUCKET_NAME` | Tên S3 bucket | `cms-media-bucket` |
| `S3_REGION` | AWS region | `ap-southeast-1` |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps embed | `AIza...` |

---

## Ghi chú kỹ thuật

- **Rich Text Editor** — Bắt buộc `dynamic import` với `ssr: false` vì tất cả thư viện (CKEditor, Quill, TinyMCE) dùng `window/document`. Xem `docs/02-coding-conventions.md`.
- **Google Maps** — Cần `'use client'` vì là browser-only. Dùng `@vis.gl/react-google-maps` hoặc `react-leaflet` (open-source thay thế).
- **Content Workflow** — Logic trạng thái (`Draft → Published`) phần lớn nằm ở Java backend. Next.js chỉ hiển thị và gọi API thay đổi trạng thái.
