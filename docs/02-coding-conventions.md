# Quy Chuẩn Viết Code (Coding Conventions)

## TypeScript — Strict Mode

### Bắt buộc khai báo kiểu dữ liệu
Tất cả props, state, tham số hàm, và giá trị trả về từ API phải có type rõ ràng.
Interface dùng chung đặt trong `src/types/index.ts`.

```typescript
// ✅ Đúng
interface User {
  id: string;
  fullname: string;
  email: string;
}

async function getUser(id: string): Promise<User> { ... }

// ❌ Sai — mất đi lợi ích của TypeScript
async function getUser(id: any): Promise<any> { ... }
```

### Cấm dùng `any`
Thay bằng `unknown` khi kiểu chưa xác định, sau đó dùng type guard để thu hẹp:

```typescript
// ✅ Đúng
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}

// ❌ Sai
} catch (err: any) {
  console.error(err.message);
}
```

### Xử lý null / undefined an toàn

```typescript
// ✅ Optional chaining + nullish coalescing
const name = user?.profile?.fullname ?? 'Người dùng ẩn danh';

// ❌ Gây crash nếu user là null
const name = user.profile.fullname;
```

---

## Import — Bắt buộc dùng Alias `@/`

Không dùng đường dẫn tương đối nhiều cấp:

```typescript
// ✅ Đúng — alias @/ trỏ đến src/
import { userService } from '@/services';
import { User } from '@/types';
import Navbar from '@/components/navbar/Navbar';

// ❌ Sai — khó đọc, dễ vỡ khi di chuyển file
import { userService } from '../../../../services/user.service';
```

---

## Đặt tên (Naming)

### PascalCase — Viết hoa chữ cái đầu mỗi từ, không dấu phân cách

Dùng cho: **React Component**, **Class**, **Interface**, **Type**, **Enum**.

```typescript
// React Component
export default function UserCard() { ... }
export default function LoginPage() { ... }

// Class
class AuthService { ... }
class UserRepository { ... }

// Interface & Type
interface UserProfile { ... }
type ApiResponse<T> = { data: T; error: string | null };

// Enum
enum UserRole { ADMIN = 'ADMIN', USER = 'USER' }
```

### camelCase — Viết hoa chữ cái đầu từ thứ hai trở đi

Dùng cho: **biến**, **hàm**, **tham số**, **prop của component**.

```typescript
// Biến
const isLoading = true;
const userList: User[] = [];
const currentPage = 1;

// Hàm
function fetchUsers() { ... }
function handleSubmit(e: React.FormEvent) { ... }
async function loadProfile(userId: string) { ... }

// Prop
<UserCard fullname="Nguyen Van A" isActive={true} />
```

**Quy ước đặt tên biến boolean:** Luôn bắt đầu bằng `is`, `has`, `can`, `should`:
```typescript
const isLoggedIn = true;
const hasPermission = false;
const canEdit = user.role === 'ADMIN';
const shouldRedirect = !token;
```

**Quy ước đặt tên hàm:** Bắt đầu bằng động từ:
```typescript
fetchUsers()       // lấy dữ liệu từ API
handleSubmit()     // xử lý sự kiện form
loadProfile()      // tải dữ liệu vào state
formatDate()       // biến đổi / xử lý dữ liệu
buildQueryString() // tạo ra thứ gì đó
```

### UPPER_SNAKE_CASE — Viết hoa toàn bộ, phân cách bằng `_`

Dùng cho: **hằng số cố định trong suốt vòng đời ứng dụng** — không bao giờ thay đổi theo state hay prop.

```typescript
// ✅ Đúng — hằng số cấu hình, không thay đổi khi runtime
const JAVA_API_URL = 'http://localhost:8080';
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 20;

// ❌ Sai — đây là biến thông thường, không phải hằng số
const CURRENT_USER = await getUser(); // giá trị thay đổi theo từng request
```

### kebab-case — Chữ thường, phân cách bằng `-`

Dùng cho: **tên file** (trừ component), **tên thư mục route**.

```
// File service và util
src/services/user.service.ts
src/services/auth.service.ts
src/utils/api-client.ts
src/utils/format-date.ts

// Thư mục route — tên thư mục = đường dẫn URL
src/app/ping-result/     → localhost:3000/ping-result
src/app/user-detail/     → localhost:3000/user-detail
src/app/(dashboard)/my-profile/ → localhost:3000/my-profile
```

### Tên file Component — PascalCase, trùng với tên function bên trong

```
UserCard.tsx      → export default function UserCard()
Navbar.tsx        → export default function Navbar()
PingButton.tsx    → export default function PingButton()
```

### Tổng hợp nhanh

| Loại | Convention | Ví dụ cụ thể |
|------|-----------|---------------|
| React Component | PascalCase | `UserCard`, `LoginPage` |
| Class / Interface / Type | PascalCase | `AuthService`, `UserProfile` |
| Hàm / Biến / Param | camelCase | `fetchUsers`, `isLoading`, `userId` |
| Hằng số bất biến | UPPER_SNAKE_CASE | `JAVA_API_URL`, `MAX_RETRY` |
| File component | PascalCase | `UserCard.tsx`, `Navbar.tsx` |
| File service / util | kebab-case | `user.service.ts`, `api-client.ts` |
| Thư mục route | kebab-case | `ping-result/`, `user-detail/` |

---

## Server Component vs Client Component

### Vấn đề gốc rễ: Next.js chạy code ở đâu?

Trước khi hiểu Server/Client Component, cần hiểu Next.js có **hai môi trường chạy code**:

| Môi trường | Là gì | Có quyền làm gì |
|---|---|---|
| **Server** (Node.js) | Máy chủ chạy Next.js | Đọc file, gọi DB, đọc cookie server, gọi API nội bộ |
| **Browser** | Máy tính người dùng | Nhận HTML, tương tác chuột/bàn phím, dùng `localStorage`, `window` |

Một file `.tsx` trong Next.js **mặc định chạy trên server**. Nghĩa là: React render ra HTML trên máy chủ → gửi HTML đó về browser → browser hiển thị.

Browser **không nhận JS** của component đó → không thể tương tác, không có state.

---

### Server Component — mặc định, không cần khai báo gì

**Mục đích cụ thể:** Lấy dữ liệu từ Java/DB và đưa vào HTML ngay trên server, trước khi người dùng thấy trang.

```tsx
// src/app/(dashboard)/users/page.tsx
// KHÔNG có 'use client' → đây là Server Component
// Hàm này chạy trên Node.js server, không phải browser

export default async function UsersPage() {
  // Gọi Java API từ server — browser không biết request này tồn tại
  const res = await fetch('http://localhost:8080/api/users');
  const users = await res.json();

  // Trả về HTML đã có dữ liệu — browser nhận HTML tĩnh, không cần chạy thêm JS
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.fullname}</li>)}
    </ul>
  );
}
```

**Kết quả:** Browser nhận HTML đã có danh sách user. Không cần chờ JS load, không flash trắng, Google đọc được nội dung.

---

### Client Component — thêm `'use client'`, chạy trên browser

**Mục đích cụ thể:** Xử lý tương tác người dùng — click, nhập liệu, hiện/ẩn, thay đổi trạng thái.

```tsx
// src/components/AdditionForm.tsx
'use client'; // Khai báo: file này sẽ được gửi xuống browser dưới dạng JS

import { useState } from 'react';

export default function AdditionForm() {
  // useState chỉ tồn tại trong browser — server không có khái niệm "state"
  const [result, setResult] = useState<number | null>(null);

  // Hàm này chạy trong browser khi người dùng click
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const a = Number(form.a.value);
    const b = Number(form.b.value);

    const res = await fetch(`http://localhost:8080/api/addition?a=${a}&b=${b}`);
    const data = await res.json();
    setResult(data.result); // cập nhật giao diện không cần reload trang
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="a" type="number" />
      <input name="b" type="number" />
      <button type="submit">Tính</button>
      {result !== null && <p>Kết quả: {result}</p>}
    </form>
  );
}
```

---

### Quy tắc chọn loại component

**Câu hỏi:** Component này có cần phản ứng với hành động của người dùng không?

```
Người dùng click / nhập / scroll / hover?
    ├── CÓ  → Client Component ('use client')
    └── KHÔNG → Server Component (mặc định, không cần khai báo)
```

**Các trường hợp cụ thể:**

| Tình huống | Loại | Lý do |
|---|---|---|
| Trang danh sách user (chỉ hiển thị) | **Server** | Fetch + render sẵn, không cần JS phía client |
| Form đăng nhập (có `onChange`, `onSubmit`) | **Client** | Cần `useState` để lưu giá trị input |
| Nút "Xóa user" (có `onClick`) | **Client** | Event handler chỉ chạy được trong browser |
| Trang profile (đọc cookie rồi hiển thị) | **Server** | `next/headers` chỉ dùng được trong Server Component |
| Dropdown bộ lọc (mở/đóng theo click) | **Client** | Cần `useState` để lưu trạng thái mở/đóng |
| Navbar (có nút, có state active menu) | **Client** | Có tương tác người dùng |
| Layout bọc ngoài (chỉ bố cục) | **Server** | Không có logic tương tác |

---

### Tại sao không đặt tất cả là Client Component cho tiện?

Vì Client Component tốn tài nguyên hơn:
- JavaScript phải **gửi xuống browser** → tăng kích thước trang
- Browser phải **parse và chạy JS** → tốn thêm thời gian
- Dữ liệu **không có trong HTML ban đầu** → SEO kém, flash trắng khi load, cần xử lí loading state

Quy tắc: **Server Component là mặc định. Chỉ chuyển sang Client Component khi không còn cách nào khác.**
