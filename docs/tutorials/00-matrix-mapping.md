# BẢNG MA TRẬN ÁNH XẠ TÀI LIỆU HƯỚNG DẪN KỸ THUẬT

Tài liệu này ánh xạ phân công chuyên môn của 12 thành viên dự án `IVS_CMS` với 2 Bộ tài liệu Kỹ thuật Phát triển Nòng cốt: **SSR (Server-Side Rendering)** và **CSR (Client-Side Rendering)**.

---

## 1. Danh Mục Tài Liệu Kỹ Thuật

| Mã Tài Liệu    | Tên Tài Liệu Hướng Dẫn                                                            | Phạm Vi Kỹ Thuật Chính                                                                |
| :------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **[GUIDE-01]** | [Hướng dẫn Phát triển Server-Side Rendering (SSR)](./01-ssr-development-guide.md) | Next.js App Router, Server Components, Dynamic Routing, SEO, Data Fetching            |
| **[GUIDE-02]** | [Hướng dẫn Phát triển Client-Side Rendering (CSR)](./02-csr-development-guide.md) | Client Components (`'use client'`), Form State, Validation, Event Handlers, API Calls |

---

## 2. Ma Trận Tham Chiếu Tài Liệu Theo Chuyên Môn Nhân Sự

### Chú thích:

- 🟢 **Tài liệu Áp dụng Chính (Core Guide)**: Tài liệu trực tiếp cho các tính năng/mô-đun chịu trách nhiệm chính.
- 🔵 **Tài liệu Phối hợp (Supporting Guide)**: Dùng để tham khảo khi phối hợp tích hợp giữa các mô-đun.

|  STT   | Họ và Tên              | Mô-đun / Vai trò Chuyên môn                                   | GUIDE-01 (SSR) | GUIDE-02 (CSR) |
| :----: | :--------------------- | :------------------------------------------------------------ | :------------: | :------------: |
| **1**  | **Nguyễn Đình Anh**    | Quản lý Xác thực (Auth / Login)                               |       🔵       |       🟢       |
| **2**  | **Nguyễn Phúc Cường**  | Xác thực & Bảo mật Hệ thống (Auth & Security)                 |       🔵       |       🟢       |
| **3**  | **Nguyễn Khánh Quỳnh** | Thiết kế Giao diện & Thư viện Component (UI Design)           |       🔵       |       🟢       |
| **4**  | **Ngô Tấn Phong**      | Ghi nhật ký & Bắt lỗi Hệ thống (Audit Logs & Exceptions)      |       🟢       |       🟢       |
| **5**  | **Nguyễn Ngọc Vinh**   | Quản lý Danh mục & Thẻ bài viết (Category & Tag)              |       🟢       |       🔵       |
| **6**  | **Lê Việt Tường**      | Quản lý Bài viết & Nội dung (Post Management)                 |       🟢       |       🟢       |
| **7**  | **Phạm Trung Nguyên**  | Quản lý Bài viết & Người dùng (Post & User Management)        |       🟢       |       🟢       |
| **8**  | **Trần Cao Minh Đoàn** | Thiết kế & Truy vấn Cơ sở dữ liệu (Database Design)           |       🟢       |       🔵       |
| **9**  | **Trần Minh Hoàng**    | Thiết kế Giao diện & Bố cục Admin (UI & Layouts)              |       🟢       |       🟢       |
| **10** | **Trần Lê Anh Duy**    | Cấu trúc Cơ sở dữ liệu & Xác thực (Database & Auth)           |       🟢       |       🟢       |
| **11** | **Hoàng Thái Tú**      | Cấu hình Bắt lỗi & Trang Thông tin (Exceptions & Global Info) |       🟢       |       🔵       |
| **12** | **Trịnh Vũ Hà**        | Quản lý Thư viện Media & Tải lên tệp (Media Library)          |       🔵       |       🟢       |

---

## 3. Quy Trình Sử Dụng

1. **Tra cứu tên nhân sự** trong Bảng Ma trận ở Section 2.
2. **Đọc và thực hành theo 6 bước** được hướng dẫn trong file [GUIDE-01 (SSR)](./01-ssr-development-guide.md) hoặc [GUIDE-02 (CSR)](./02-csr-development-guide.md) tùy thuộc vào tính năng bạn đang phát triển là trang đọc tĩnh hay form tương tác client.
