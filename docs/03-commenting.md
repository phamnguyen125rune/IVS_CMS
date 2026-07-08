# Quy Chuẩn Viết Comment

## Nguyên tắc chung

Comment phải giải thích **TẠI SAO**, không giải thích **LÀM GÌ**.
Code tốt tự nói lên mình làm gì — comment bổ sung lý do nghiệp vụ.

```typescript
// ❌ Vô nghĩa — đọc code đã biết rồi
// Tăng count lên 1
count++;

// ✅ Có giá trị — giải thích lý do nghiệp vụ
// Tăng count trước khi gọi API để tránh gọi trùng khi người dùng click nhanh
count++;
```

---

## JSDoc — Bắt buộc cho Service và Helper phức tạp

Tất cả hàm trong `src/services/` và helper function có logic phức tạp phải có JSDoc:

```typescript
/**
 * Gọi API đăng nhập và lưu token vào cookie HTTP-Only.
 *
 * @param loginId  - Email hoặc mã nhân viên.
 * @param password - Mật khẩu dạng plain text (được mã hóa phía Java).
 * @returns        - Thông tin user và access token nếu thành công.
 * @throws {ApiError} - Lỗi 401 nếu sai thông tin, 500 nếu server lỗi.
 */
async login(loginId: string, password: string): Promise<AuthResponse> {
  // ...
}
```

Hàm đơn giản (1–2 dòng, tên hàm đã rõ) thì không cần JSDoc.

---

## Comment Phân định Server / Client Component

Khi dùng `'use client'`, giải thích rõ lý do ngay bên cạnh:

```typescript
'use client'; // Cần useState để lưu kết quả form — không thể dùng Server Component

'use client'; // Dùng useEffect để fetch dữ liệu sau khi render phía client (CSR pattern)

'use client'; // Gắn onClick vào nút — event handler chỉ chạy được phía client
```

---

## Comment Phân định Luồng CSR / SSR

Khi viết code liên quan đến luồng gọi API, comment ngắn gọn luồng chạy ở đầu hàm:

```typescript
// SSR: Next.js server gọi Java trước, render HTML xong mới gửi về browser
const data = await fetch('http://localhost:8080/api/addition?a=3&b=5');

// CSR: browser gọi Java sau khi nhận HTML — dữ liệu điền vào sau
useEffect(() => {
  fetch('http://localhost:8080/api/addition?a=3&b=5').then(...);
}, []);
```

---

## Comment Đánh dấu TODO / FIXME

Dùng prefix chuẩn để dễ tìm kiếm:

```typescript
// TODO: Thêm pagination khi số lượng user vượt 100
// FIXME: Lỗi timezone khi server ở múi giờ UTC+0
// NOTE: API này trả thêm field `legacyId` để tương thích với hệ thống cũ
// DEMO: <Tính năng chưa hoàn thiện, sẽ được hoàn thiện trong tương lai.>
// MOCK: <Ứng dụng sẽ chuẩn bị thêm tính năng Mock dữ liệu để DEV/FE có thể test mà không cần chờ Backend>
// COMMENT_OUT: <Code đang được comment tạm thời để phục vụ mục đích nào đó>
```

> Không để `TODO` tồn tại quá 1 sprint mà không tạo ticket theo dõi.

---

## Những gì KHÔNG nên comment

```typescript
// ❌ Comment thừa — code đã tự mô tả
const isLoggedIn = !!token; // kiểm tra xem đã đăng nhập chưa

// ❌ Comment sai — nguy hiểm hơn không có comment
// Trả về string
function getCount(): number {
  return 42;
}
```
