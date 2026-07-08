# CMS_NEXTJS — Tài Liệu Dự Án

Dự án **CMS_NEXTJS** là frontend viết bằng Next.js (App Router), kết nối đến backend Java Spring Boot (`CMS`).

## Khởi động nhanh

```bash
# Next.js (cổng 3000)
npm run dev

# Java Spring Boot (cổng 8080) — chạy ở thư mục CMS/
.\gradlew.bat bootRun
```

## Tài liệu nội bộ

| File | Nội dung |
|------|----------|
| [docs/01-structure.md](./docs/01-structure.md) | Cấu trúc thư mục, quy tắc đặt file mới |
| [docs/02-coding-conventions.md](./docs/02-coding-conventions.md) | Quy chuẩn TypeScript, import, naming |
| [docs/03-commenting.md](./docs/03-commenting.md) | Quy chuẩn viết comment, JSDoc |
| [docs/04-git.md](./docs/04-git.md) | Quy trình Git, đặt tên branch, commit message |
| [docs/05-flow.md](./docs/05-flow.md) | Luồng kết nối Java ↔ Next.js, SSR vs CSR |
| [docs/06-features.md](./docs/06-features.md) | Ánh xạ tính năng → vị trí file, trạng thái |

## Lệnh thường dùng

| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Chạy server dev |
| `npm run build` | Build production / kiểm tra lỗi compile |
| `npm run lint` | Kiểm tra ESLint |
| `npm run lint:fix` | Tự động sửa lỗi lint |
| `npm run format` | Format code bằng Prettier |
