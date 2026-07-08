> ⚠️ **File này đã được thay thế bởi [docs/05-flow.md](./docs/05-flow.md).** Nội dung bên dưới chỉ giữ lại để tham khảo.

# Hướng Dẫn Phát Triển Một Luồng Tính Năng (End-to-End Flow Guide)

Tài liệu này hướng dẫn cách hiện thực hóa một luồng thao tác hoàn chỉnh từ **Java Backend API** đến **Nút bấm trên Next.js** và **Chuyển hướng trang (Redirect)** bằng cách sử dụng **Server Actions**.

Ví dụ cụ thể: Xây dựng tính năng **"Gửi tín hiệu Ping kiểm tra kết nối hệ thống"**. Khi bấm nút, Next.js gọi Java, chuyển hướng sang trang kết quả `/ping-result`.

Hiện tại đang gọi API backend theo Fetch, có thể thay đổi sang promise hoặc axios nếu muốn.

---

## BƯỚC 1: Xây dựng API ở Java Backend (`ThucHanh`)

Tạo một Endpoint REST API trong Java Controller.

- **File:** `com/IVS/ThucHanh/controllers/SystemController.java` (ví dụ)

```java
@RestController
@RequestMapping("/api/v1")
public class SystemController {

    @PostMapping("/ping")
    public ResponseEntity<Map<String, String>> triggerPing() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Kết nối Spring Boot hoạt động ổn định!");
        return ResponseEntity.ok(response);
    }
}
```

---

## BƯỚC 2: Gọi API bên Next.js Dịch vụ (`Services`)

Khai báo hàm gọi API này trong Interface và thực thi nó trong Service.

- **File:** `src/services/system.service.ts`

```typescript
import { apiFetch } from '@/utils/api-client';

export interface ISystemService {
  ping(): Promise<{ status: string; message: string }>;
}

export class SystemService implements ISystemService {
  async ping() {
    // Tự động đính kèm Token JWT nhờ apiFetch
    return apiFetch<{ status: string; message: string }>('/api/v1/ping', {
      method: 'POST',
    });
  }
}

export const systemService = new SystemService();
```

---

## BƯỚC 3: Viết Server Action để Xử lý và Chuyển Hướng (`Server Action`)

Tạo một Server Action nhận lệnh từ Client Component, gọi Service chạy phía máy chủ, và thực hiện chuyển hướng.

- **File:** `src/app/actions/system.actions.ts`

```typescript
'use server';

import { redirect } from 'next/navigation';
import { systemService } from '@/services/system.service';
import { cookies } from 'next/headers';

export async function sendPingAction() {
  try {
    // 1. Gọi API sang Spring Boot từ server Next.js
    const result = await systemService.ping();

    // 2. Lưu trạng thái vào Cookie nếu cần truyền sang trang tiếp theo
    const cookieStore = await cookies();
    cookieStore.set('ping_message', result.message, { maxAge: 60 });
  } catch (error) {
    console.error('Lỗi gửi ping:', error);
    return { success: false, error: 'Không thể kết nối' };
  }

  // 3. Chuyển hướng sang trang kết quả sau khi hoàn thành
  redirect('/ping-result');
}
```

---

## BƯỚC 4: Tạo Nút Bấm ở Giao diện (Client Component)

Tạo một nút bấm trong Form để kích hoạt Server Action.

- **File:** `src/components/PingButton.tsx`

```tsx
'use client'; // Cần tương tác người dùng

import { useTransition } from 'react';
import { sendPingAction } from '@/app/actions/system.actions';

export default function PingButton() {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      await sendPingAction();
    });
  };

  return (
    <button
      onClick={handleAction}
      disabled={isPending}
      className="px-4 py-2 bg-white text-black font-bold rounded text-sm hover:bg-zinc-200 transition-all disabled:opacity-50"
    >
      {isPending ? 'Đang gửi...' : 'Gửi tín hiệu Ping'}
    </button>
  );
}
```

---

## BƯỚC 5a: Tạo trang kết quả hiển thị dữ liệu (SSR Mode)

Đọc thông tin từ cookie do Server Action thiết lập trước đó và render HTML ngay trên server trước khi gửi về browser (tối ưu SEO).

- **File:** `src/app/(dashboard)/ping-result/page.tsx`

```tsx
import { cookies } from 'next/headers';
import Link from 'next/link';

// Đây là Server Component (async, không có 'use client')
// Next.js chạy hàm này trên server, render ra HTML rồi mới gửi về browser
export default async function PingResultPage() {
  const cookieStore = await cookies();
  const message = cookieStore.get('ping_message')?.value || 'Không có dữ liệu';

  return (
    <div>
      <h1>Kết Quả Ping (SSR)</h1>
      <p>{message}</p>
      <Link href="/users">Quay lại trang chủ</Link>
    </div>
  );
}
```

---

## BƯỚC 5b: Tạo trang hiển thị dữ liệu real-time từ Java (CSR Mode)

Thay vì đọc cookie, trang này **tự gọi Java API từ browser** sau khi render, không cần Server Action.  
Phù hợp khi dữ liệu thay đổi liên tục hoặc cần tương tác người dùng (bộ lọc, phân trang…).

- **File:** `src/app/(dashboard)/ping-live/page.tsx`

```tsx
'use client'; // Bắt buộc vì dùng useState + useEffect

import { useState, useEffect } from 'react';

// -------------------------------------------------------
// Luồng CSR:
//   1. Next.js gửi HTML "khung trống" về browser trước
//   2. Browser chạy JS, useEffect kích hoạt
//   3. Browser fetch thẳng tới Java :8080
//   4. Nhận JSON → setState → React cập nhật DOM
// -------------------------------------------------------

interface PingData {
  status: string;
  message: string;
}

export default function PingLivePage() {
  const [data, setData]       = useState<PingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // useEffect chỉ chạy phía client — server không thực thi đoạn này
  useEffect(() => {
    async function fetchFromJava() {
      try {
        const res = await fetch('http://localhost:8080/api/v1/ping', {
          method: 'POST',
        });

        if (!res.ok) {
          setError(`Lỗi ${res.status} từ Java server`);
          return;
        }

        const json: PingData = await res.json();
        setData(json);
      } catch {
        setError('Không kết nối được Java. Kiểm tra server đã chạy và CORS.');
      } finally {
        setLoading(false);
      }
    }

    fetchFromJava();
  }, []); // [] = chỉ chạy 1 lần khi component mount

  if (loading) return <p>Đang tải từ Java...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Kết Quả Ping (CSR — browser gọi Java)</h1>
      <p>Status: {data?.status}</p>
      <p>Message: {data?.message}</p>
    </div>
  );
}
```

### So sánh 5a vs 5b

| | 5a — SSR | 5b — CSR |
|---|---|---|
| **Ai gọi Java?** | Server Next.js (qua Service + Action) | Browser (fetch trong useEffect) |
| **Khi nào gọi?** | Trước khi gửi HTML về browser | Sau khi browser nhận HTML |
| **Dữ liệu thấy trong nguồn trang?** | ✅ Có (đã render sẵn) | ❌ Không (JS điền sau) |
| **SEO** | ✅ Tốt | ❌ Kém |
| **Phù hợp với** | Dữ liệu tĩnh / kết quả action | Dashboard real-time, bộ lọc động |
| **Cần `'use client'`?** | ❌ Không | ✅ Bắt buộc |
