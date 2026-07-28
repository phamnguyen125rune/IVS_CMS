# Cấu Trúc Thư Mục Dự Án

## Tổng quan

```
src/
├── app/                         ← Next.js App Router
│   ├── [language]/              ← Wrapper đa ngôn ngữ (vd: /vi/..., /en/...)
│   │   ├── layout.tsx           ← Layout nhận locale, set lang attribute
│   │   ├── page.tsx             ← Trang chủ "/"
│   │   │
│   │   ├── (auth)/              ← Nhóm route xác thực (không xuất hiện trong URL)
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/             ← Nhóm route quản trị (yêu cầu đăng nhập)
│   │   │   ├── users/
│   │   │   └── profile/
│   │   │
│   │   └── (client)/            ← Nhóm route công khai cho khách hàng
│   │       ├── layout.tsx       ← Layout riêng: header/footer công khai
│   │       ├── trang-gioi-thieu/
│   │       ├── san-pham/
│   │       ├── tin-tuc/
│   │       └── lien-he/
│   │
│   ├── api/                     ← API Routes (không cần locale prefix)
│   │   └── auth/
│   │       ├── login/
│   │       ├── logout/
│   │       └── profile/
│   │
│   ├── layout.tsx               ← Root layout tối giản (html, body)
│   └── globals.css
│
├── components/             ← UI Component tái sử dụng
│   └── navbar/
│
├── services/               ← Lớp giao tiếp với Java API
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── index.ts            ← Re-export tất cả service
│
├── types/                  ← Định nghĩa TypeScript interface / type dùng chung
│   └── index.ts
│
├── utils/                  ← Hàm tiện ích thuần túy (không gọi API)
│
└── proxy.ts                 ← Chạy trước mọi request (bảo vệ route)
```

## Quy tắc đặt file mới

### Thêm một trang mới

```
src/app/(dashboard)/ten-tinh-nang/page.tsx
```

- Đặt trong nhóm `(dashboard)/` nếu cần đăng nhập
- Đặt trong nhóm `(auth)/` nếu là trang xác thực
- Đặt thẳng vào `app/` nếu là trang public

### Thêm một component mới

```
src/components/ten-component/TenComponent.tsx
```

- Mỗi component một thư mục riêng
- Tên file PascalCase, trùng với tên thư mục

### Thêm một service mới

```
src/services/ten-tinh-nang.service.ts
```

- Khai báo interface trước: `ITenTinhNangService`
- Sau đó implement class: `TenTinhNangService implements ITenTinhNangService`
- Export singleton ở cuối file: `export const tenTinhNangService = new TenTinhNangService()`
- Thêm re-export vào `src/services/index.ts`

### Thêm một type mới

- Type dùng trong 1 file duy nhất → khai báo **ngay trong file đó**
- Type dùng ở nhiều nơi → khai báo trong `src/types/index.ts`

## Các thư mục KHÔNG chỉnh sửa thủ công

| Thư mục         | Lý do                                |
| --------------- | ------------------------------------ |
| `node_modules/` | Được npm quản lý tự động             |
| `.next/`        | Build output, được Next.js tạo ra    |
| `public/`       | Chỉ chứa tài nguyên tĩnh (ảnh, icon) |
