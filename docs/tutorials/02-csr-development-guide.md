# [GUIDE-02] QUY CHUẨN PHÁT TRIỂN CLIENT-SIDE RENDERING (CSR)

## Hướng Dẫn Chi Tiết (Next.js App Router & Spring Boot)

Tài liệu này hướng dẫn chi tiết từng bước xây dựng một tính năng hoàn chỉnh theo phương pháp **Client-Side Rendering (CSR)**. Ví dụ minh họa xuyên suốt tài liệu là **Mô-đun Tạo Bài Viết Mới (`/(admin)/posts/create`)**.

---

## 📚 1. NGUYÊN LÝ KỸ THUẬT: CLIENT-SIDE RENDERING (CSR) LÀ GÌ?

### ⚙️ Định nghĩa & Sơ đồ Luồng Kỹ thuật:

Client-Side Rendering (CSR) là cơ chế trong đó Server gửi một khung HTML và mã JavaScript Bundle xuống trình duyệt. Sau đó, **JavaScript Runtime trên chính trình duyệt (Browser)** sẽ đảm nhận việc lắng nghe sự kiện người dùng (gõ phím, click), quản lý trạng thái (`useState`), thực hiện các yêu cầu AJAX/Fetch API tới Spring Boot REST Backend, và cập nhật lại giao diện người dùng một cách linh hoạt không cần reload toàn trang.

```
[Browser Client] ----(1) Tải JS Bundle & HTML khung-----> [Next.js Server]
[Browser Client] <---(2) Trả về Client Component Code------- [Next.js Server]
       |
 (3) Thực thi React trên Browser (useState, Event Handlers, Form Validation)
       |
 (4) Tự gửi yêu cầu AJAX (POST/PUT/DELETE)
       v
 [Spring Boot REST API Backend]
```

### 💡 Ưu thế kỹ thuật của CSR:

1. **Tương tác Thời gian thực (Real-time Interactivity)**: Phản hồi tức thì thao tác gõ phím, chọn ảnh thumbnail, thay đổi nội dung Rich Text area mà không có độ trễ tải trang.
2. **Quản lý Trạng thái Form & Validation**: Cho phép kiểm tra dữ liệu đầu vào (Ví dụ: Tiêu đề từ 5 đến 255 ký tự, định dạng tệp ảnh) ngay trên giao diện Client trước khi gửi request tới Server.
3. **Trải nghiệm UX mượt mà**: Hiển thị Icon Loading Spinner trực tiếp trên nút bấm, hiển thị thông báo Toast sau khi thành công thay vì reload lại toàn bộ trình duyệt.

---

## 🛠️ BƯỚC 1: BÓC TÁCH GIAO DIỆN FORM TỪ TEMPLATE MẪU SANG CLIENT COMPONENT

Giả sử bạn có giao diện Form từ Template (`Comprehensive CMS Platform`). Nhiệm vụ của bạn là tách Form này thành một **Client Component** riêng biệt để giữ cho trang cha (`page.tsx`) vẫn là Server Component.

### 1.1 Phân tích Kỹ thuật: Tại sao BẮT BUỘC dùng `'use client'` tại Client Component? (Mô hình 5W1H)

> [!TIP]
> **KHI NÀO VÀ TẠI SAO BẮT BUỘC KHAI BÁO `'use client'`?**
>
> - **WHAT (Directive này là gì)**: `'use client';` là một chỉ thị (Directive) đánh dấu ranh giới giữa Server Component và Client Component trong React Server Components Architecture.
> - **WHY (Tại sao bắt buộc dùng cho Form/Modal)**:
>   1. **Dùng React Client Hooks**: Chỉ Client Component mới được phép dùng các hook quản lý state & lifecycle như `useState`, `useEffect`, `useReducer`, `useRef`.
>   2. **Gắn Event Listeners**: Chỉ Client Component mới tương tác được với DOM (các thuộc tính `onClick`, `onChange`, `onSubmit`).
>   3. **Dùng Router Navigation ở Client**: Cần các hook như `useRouter()`, `usePathname()` để chuyển trang chủ động sau khi submit.
> - **WHO (Ai cần sử dụng)**: Tất cả lập trình viên khi viết các component chứa Form nhập liệu, Nút bấm xóa/sửa, Modal dialog, Thư viện kéo thả upload file.
> - **WHEN (Khi nào dùng)**: Khai báo ngay tại **Dòng số 1 (Line 1)** của các file component tương tác (ví dụ: `PostForm.tsx`).
> - **WHERE (Tối ưu vị trí sử dụng)**: **Chỉ đặt tại Component lá nhỏ nhất có tương tác**. KHÔNG đặt ở file `page.tsx` cha để giữ cho trang cha vẫn hưởng lợi từ Server Component (SEO, nạp Dictionary).
> - **HOW (Cách khai báo chuẩn)**: Đặt chuỗi `'use client';` ở dòng đầu tiên của file, trước tất cả các lệnh `import`.

---

### 1.2 Quy tắc JSX Return Element (Single Root Element)

> [!IMPORTANT]
> **QUY TẮC BẮT BUỘC: TOÀN BỘ FORM PHẢI ĐƯỢC BỌC TRONG MỘT THẺ PHẦN TỬ GỐC DUY NHẤT**
>
> ```tsx
> // ❌ SAI: Trả về 2 phần tử form và footer ngang hàng
> return (
>   <form>...</form>
>   <div>Footer</div> // 💥 Báo lỗi JSX syntax error
> );
>
> // ✅ ĐÚNG: Bọc toàn bộ trong một thẻ gốc <form> hoặc <div>
> return (
>   <form className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
>     {/* Tất cả các ô input, button nằm bên trong thẻ <form> này */}
>   </form>
> );
> ```

---

### 1.3 Mã nguồn Client Component Form (`PostForm.tsx`)

Tạo file component mới tại `src/app/[language]/(admin)/posts/create/PostForm.tsx`:

```tsx
// src/app/[language]/(admin)/posts/create/PostForm.tsx
'use client'; // BẮT BUỘC: Khai báo ở DÒNG ĐẦU TỆP để chuyển sang Client Component!

export default function PostForm() {
  return (
    // Bọc toàn bộ form trong một thẻ gốc duy nhất (<form>)
    <form className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div>
        <label className="block text-sm font-semibold text-slate-700">Tiêu đề bài viết</label>
        <input
          type="text"
          placeholder="Nhập tiêu đề bài viết..."
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">Tóm tắt ngắn</label>
        <textarea
          rows={3}
          placeholder="Nhập tóm tắt bài viết..."
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">Nội dung bài viết</label>
        <textarea
          rows={8}
          placeholder="Nhập nội dung bài viết..."
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium"
        >
          Đăng bài viết
        </button>
      </div>
    </form>
  );
}
```

---

## 🔄 BƯỚC 2: GẮN CLIENT STATE & EVENT HANDLERS

Bây giờ chúng ta quản lý dữ liệu người dùng nhập bằng `useState` và bắt sự kiện gõ phím/submit form.

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostForm() {
  const router = useRouter();

  // 1. Khai báo State lưu dữ liệu Form
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
  });

  // 2. Khai báo State quản lý trạng thái Submit & Lỗi
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 3. Hàm xử lý thay đổi giá trị Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100">
      {errorMessage && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700">Tiêu đề bài viết</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* ... tương tự cho summary và content */}
    </form>
  );
}
```

---

## 🌐 BƯỚC 3: TÍCH HỢP ĐA NGÔN NGỮ Ở CLIENT COMPONENT

Vì Client Component không thể dùng `async/await` để gọi `getDictionary()`, giải pháp chuẩn của Next.js là **truyền Dictionary từ Server Page cha xuống Client Component qua Props**.

### 3.1 Khai báo Props nhận Dictionary tại Client Component (`PostForm.tsx`)

```tsx
interface PostFormProps {
  language: string;
  labels: {
    titleLabel: string;
    summaryLabel: string;
    contentLabel: string;
    submitBtn: string;
    submittingBtn: string;
    cancelBtn: string;
  };
}

export default function PostForm({ labels }: PostFormProps) {
  return (
    <form className="space-y-6">
      <label>{labels.titleLabel}</label>
      {/* ... */}
      <button type="submit">{labels.submitBtn}</button>
    </form>
  );
}
```

### 3.2 Server Page Cha (`page.tsx`) nạp Dictionary và truyền xuống

```tsx
// src/app/[language]/(admin)/posts/create/page.tsx (Server Component)
import { getDictionary } from '@/utils/i18n';
import PostForm from './PostForm';

interface CreatePostPageProps {
  params: Promise<{ language: string }>;
}

export default async function CreatePostPage({ params }: CreatePostPageProps) {
  const { language } = await params;
  const dict = getDictionary(language);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tạo bài viết mới</h1>
      {/* Truyền dictionary labels xuống Client Form */}
      <PostForm
        language={language}
        labels={{
          titleLabel: dict.news.title || 'Tiêu đề bài viết',
          summaryLabel: dict.news.summary || 'Tóm tắt',
          contentLabel: dict.news.content || 'Nội dung',
          submitBtn: dict.news.submit || 'Đăng bài viết',
          submittingBtn: dict.news.submitting || 'Đang lưu...',
          cancelBtn: dict.news.cancel || 'Hủy bỏ',
        }}
      />
    </div>
  );
}
```

---

## 📐 BƯỚC 4: ĐỊNH NGHĨA HỢP ĐỒNG DỮ LIỆU (REQUEST PAYLOAD: FE & BE)

### 4.1 Phía Backend Java Spring Boot DTO với Validation (`CreatePostRequestDTO.java`)

```java
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreatePostRequestDTO {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(min = 5, max = 255, message = "Tiêu đề phải từ 5 đến 255 ký tự")
    private String title;

    @NotBlank(message = "Tóm tắt không được để trống")
    private String summary;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    private String content;
}
```

### 4.2 Phía Frontend Next.js TypeScript (`src/types/index.ts`)

```typescript
export interface CreatePostInput {
  title: string;
  summary: string;
  content: string;
}

export interface CreatePostResponse {
  id: number;
  slug: string;
  createdAt: string;
}
```

---

## 🔌 BƯỚC 5: PHÁT TRUYỂN SPRING BOOT REST CONTROLLER & API CALL CLIENT

### 5.1 Phía Backend REST Controller (`PostController.java`)

```java
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<ApiResponse<CreatePostResponseDTO>> createPost(
            @Valid @RequestBody CreatePostRequestDTO request) {

        CreatePostResponseDTO result = postService.createNewPost(request);

        ApiResponse<CreatePostResponseDTO> response = ApiResponse.<CreatePostResponseDTO>builder()
                .success(true)
                .code("POST_CREATED")
                .message("Tạo bài viết thành công!")
                .data(result)
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### 5.2 Phân Tích Kỹ Thuật: 2 Phương Thức Gọi API từ Client Component

Trong kiến trúc Next.js + Spring Boot, lập trình viên có **2 phương thức kiến trúc** để gửi yêu cầu dữ liệu từ Client Component:

> [!NOTE]
> **BẢNG SO SÁNH 2 PHƯƠNG THỨC GỌI API TRONG CSR**
>
> | Tiêu chí            | Phương thức A: Gọi Trực Tiếp Spring Boot _(Đang dùng trong ví dụ)_                                                          | Phương thức B: Qua Next.js Route Handler Proxy _(BFF Pattern)_                                                                                                                                         |
> | :------------------ | :-------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | **Luồng di chuyển** | `Browser ➔ Spring Boot (Port 8080)`                                                                                         | `Browser ➔ Next.js Route (/api/posts) ➔ Spring Boot (Port 8080)`                                                                                                                                       |
> | **Ưu điểm**         | • Đường đi ngắn nhất (1 chặng), phản hồi cực nhanh.<br>• Không cần tạo file API Route trung gian ở Next.js.                 | • **Ẩn danh Backend**: Người dùng F12 không thấy IP/Domain Spring Boot.<br>• **Tránh lỗi CORS**: Client gọi về chính domain Next.js.<br>• **Quản lý Secure Cookie**: Tự động set/read HttpOnly Cookie. |
> | **Nhược điểm**      | • Bắt buộc phải cấu hình `@CrossOrigin` phía Spring Boot.<br>• Lộ thông tin địa chỉ REST Backend ở Network Tab trình duyệt. | • Trải qua 2 chặng mạng (tăng nhẹ thời gian trễ latency).<br>• Cần viết thêm file `route.ts` cho từng endpoint.                                                                                        |
> | **Khuyên dùng khi** | Các thao tác CRUD dữ liệu thông thường (Bài viết, Danh mục, Sản phẩm).                                                      | Luồng Đăng nhập/Đăng xuất (Auth), Thanh toán, hoặc các tác vụ bảo mật cao.                                                                                                                             |

#### Mã nguồn minh họa Phương thức B (Nếu muốn dùng Next.js Route Handler Proxy):

Tạo file trung gian `src/app/api/posts/route.ts`:

```typescript
// src/app/api/posts/route.ts (Next.js Server API Proxy)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const backendUrl = process.env.JAVA_API_URL || 'http://localhost:8080';

  const res = await fetch(`${backendUrl}/api/v1/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

---

### 5.3 Xử lý Submit API tại Client Component (`PostForm.tsx`)

Mã nguồn dưới đây áp dụng **Phương thức A (Gọi trực tiếp sang Spring Boot)**:

```tsx
import { apiFetch, ApiError } from '@/utils/api-client';
import { ApiResponse, CreatePostResponse } from '@/types';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage('');

  try {
    // Gọi API trực tiếp sang Spring Boot Backend thông qua tiện ích apiFetch
    const result = await apiFetch<ApiResponse<CreatePostResponse>>('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    // Xử lý thành công
    alert(result.message || 'Tạo bài viết thành công!');

    // 1. Kích hoạt Next.js Revalidate trang danh sách bài viết ở Server
    router.refresh();

    // 2. Chuyển hướng người dùng về trang danh sách
    router.push(`/${language}/dashboard`);
  } catch (err: any) {
    if (err instanceof ApiError) {
      setErrorMessage(`Lỗi (${err.status}): ${err.message}`);
    } else {
      setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🌟 BƯỚC 6: HOÀN THIỆN UX TRẢI NGHIỆM NGƯỜI DÙNG (LOADING & REFRESH)

### Gắn Loading Spinner & Vô hiệu hóa Nút khi đang Submit

```tsx
<button
  type="submit"
  disabled={isSubmitting}
  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
  {isSubmitting ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{labels.submittingBtn}</span>
    </>
  ) : (
    <span>{labels.submitBtn}</span>
  )}
</button>
```

---

## 📋 BẢNG TÓM TẮT CHECKLIST QUY TRÌNH CSR

- [x] **Có directive `'use client'`** ở dòng đầu tiên của Client Component.
- [x] **Chỉ đặt `'use client'` ở component lá**, giữ cho file `page.tsx` cha vẫn là Server Component.
- [x] **Luôn bọc kết quả trả về trong một thẻ phần tử gốc duy nhất** (Single Root Element).
- [x] **Quản lý Form State đầy đủ**: `formData`, `isSubmitting`, `errorMessage`.
- [x] **Nhận Dictionary qua Props** từ Server Component trang cha truyền xuống.
- [x] **Định nghĩa Request DTO có Validation** phía Spring Boot (`@Valid`, `@NotBlank`).
- [x] **Vô hiệu hóa nút Submit (`disabled={isSubmitting}`)** để tránh người dùng click đúp gửi dữ liệu trùng lặp.
- [x] **Dùng `router.refresh()` và `router.push()`** để cập nhật dữ liệu mượt mà không làm trôi vị trí trang.
