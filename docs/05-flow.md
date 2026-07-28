# Luồng Kết Nối Java ↔ Next.js (CSR vs SSR)

## Tổng quan kiến trúc

```
Browser ←→ Next.js :3000 ←→ Java Spring Boot :8080 ←→ Database
```

Next.js đóng vai trò **trung gian** giữa browser và Java. Tuỳ từng trường hợp, Next.js có thể để browser gọi thẳng Java (CSR) hoặc tự gọi Java rồi render kết quả (SSR).

---

## So sánh CSR và SSR

|                             | CSR                              | SSR                           |
| --------------------------- | -------------------------------- | ----------------------------- |
| **Ai gọi Java?**            | Browser                          | Next.js server (Node.js)      |
| **Khi nào gọi?**            | Sau khi browser nhận HTML        | Trước khi gửi HTML về browser |
| **Java API lộ ra browser?** | ✅ Có (thấy trong DevTools)      | ❌ Không                      |
| **SEO**                     | ❌ Kém (nội dung điền sau)       | ✅ Tốt (HTML đã có dữ liệu)   |
| **Cần `'use client'`?**     | ✅ Bắt buộc                      | ❌ Không                      |
| **Phù hợp với**             | Dashboard real-time, filter động | Trang kết quả, trang profile  |

---

## Luồng CSR — Browser gọi Java trực tiếp

```
Browser --[useEffect/onClick]--> Java :8080/api/addition?a=3&b=5
        <---------{ result: 8 }------------------------------------------
        React setState → cập nhật DOM
```

### Yêu cầu phía Java

Java phải bật `@CrossOrigin` để browser được phép gọi (CORS):

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AdditionController {

    @GetMapping("/addition")
    public Map<String, Integer> add(@RequestParam int a, @RequestParam int b) {
        return Map.of("a", a, "b", b, "result", a + b);
    }
}
```

### Code phía Next.js (CSR)

```tsx
'use client'; // Bắt buộc — dùng useState + useEffect

import { useState, useEffect } from 'react';

export default function CsrPage() {
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    // Browser gọi Java sau khi component mount
    fetch('http://localhost:8080/api/addition?a=3&b=5')
      .then((res) => res.json())
      .then((data) => setResult(data.result));
  }, []);

  return <p>Kết quả: {result ?? 'Đang tải...'}</p>;
}
```

---

## Luồng SSR — Next.js server gọi Java, render HTML rồi gửi về browser

```
Browser --[GET /addition/ssr?a=3&b=5]--> Next.js Server
                                             --fetch--> Java :8080
                                             <--{ result: 8 }--
                                         render HTML với kết quả
        <--------[HTML đã có "3 + 5 = 8"]--------------------
```

### Code phía Next.js (SSR)

```tsx
// Không có 'use client' — đây là Server Component
// Next.js chạy hàm này trên server, render ra HTML, rồi mới gửi về browser

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function SsrPage({ searchParams }: PageProps) {
  const { a = '0', b = '0' } = await searchParams;

  // Server Node.js gọi Java — browser không thấy request này
  const res = await fetch(`http://localhost:8080/api/addition?a=${a}&b=${b}`, {
    cache: 'no-store', // luôn gọi mới, không cache
  });
  const data = await res.json();

  return (
    <div>
      <p>Kết quả (render trên server): {data.result}</p>
    </div>
  );
}
```

---

## Luồng 5 bước xây dựng một tính năng hoàn chỉnh

### Bước 1 — Java: Viết Controller

```java
@RestController
@RequestMapping("/api/v1")
public class SystemController {

    @PostMapping("/ping")
    public ResponseEntity<Map<String, String>> triggerPing() {
        return ResponseEntity.ok(Map.of(
            "status",  "SUCCESS",
            "message", "Kết nối Spring Boot hoạt động ổn định!"
        ));
    }
}
```

### Bước 2 — Next.js: Viết Service

```typescript
// src/services/system.service.ts
import { apiFetch } from '@/utils/api-client';

export interface ISystemService {
  ping(): Promise<{ status: string; message: string }>;
}

export class SystemService implements ISystemService {
  async ping() {
    // apiFetch tự đính kèm JWT token
    return apiFetch<{ status: string; message: string }>('/api/v1/ping', {
      method: 'POST',
    });
  }
}

export const systemService = new SystemService();
```

### Bước 3 — Next.js: Viết Server Action

```typescript
// src/app/actions/system.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { systemService } from '@/services/system.service';

export async function sendPingAction() {
  try {
    const result = await systemService.ping();

    // Truyền dữ liệu sang trang tiếp theo qua cookie tạm thời
    const cookieStore = await cookies();
    cookieStore.set('ping_message', result.message, { maxAge: 60 });
  } catch {
    return { error: 'Không thể kết nối đến server' };
  }

  redirect('/ping-result');
}
```

### Bước 4 — Next.js: Viết Client Component (nút bấm)

```tsx
// src/components/PingButton.tsx
'use client'; // Cần onClick + useTransition

import { useTransition } from 'react';
import { sendPingAction } from '@/app/actions/system.actions';

export default function PingButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button onClick={() => startTransition(() => sendPingAction())} disabled={isPending}>
      {isPending ? 'Đang gửi...' : 'Gửi Ping'}
    </button>
  );
}
```

### Bước 5a — Next.js: Trang kết quả (SSR — đọc cookie)

```tsx
// src/app/(dashboard)/ping-result/page.tsx
import { cookies } from 'next/headers';

export default async function PingResultPage() {
  const cookieStore = await cookies();
  const message = cookieStore.get('ping_message')?.value ?? 'Không có dữ liệu';

  return (
    <div>
      <h1>Kết Quả Ping (SSR)</h1>
      <p>{message}</p>
    </div>
  );
}
```

### Bước 5b — Next.js: Trang kết quả (CSR — fetch từ browser)

Dùng khi dữ liệu thay đổi liên tục hoặc cần tương tác động (filter, phân trang...).

```tsx
// src/app/(dashboard)/ping-live/page.tsx
'use client'; // Bắt buộc — dùng useState + useEffect

import { useState, useEffect } from 'react';

interface PingData {
  status: string;
  message: string;
}

export default function PingLivePage() {
  const [data, setData] = useState<PingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // CSR: browser tự gọi Java sau khi component mount
    fetch('http://localhost:8080/api/v1/ping', { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []); // [] = chỉ chạy 1 lần khi mount

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Kết Quả Ping (CSR)</h1>
      <p>Status: {data?.status}</p>
      <p>Message: {data?.message}</p>
    </div>
  );
}
```
