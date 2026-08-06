# [GUIDE-01] QUY CHUẨN PHÁT TRIỂN SERVER-SIDE RENDERING (SSR)

## Hướng Dẫn Chi Tiết (Next.js App Router & Spring Boot)

Tài liệu này hướng dẫn chi tiết từng bước xây dựng một tính năng hoàn chỉnh theo phương pháp **Server-Side Rendering (SSR)**. Ví dụ minh họa xuyên suốt tài liệu là **Mô-đun Hiển thị Chi tiết Bài viết (`/news/[slug]`)**.

---

## 📚 1. NGUYÊN LÝ KỸ THUẬT: SERVER-SIDE RENDERING (SSR) LÀ GÌ?

### ⚙️ Định nghĩa & Sơ đồ Luồng Kỹ thuật:

Server-Side Rendering (SSR) là cơ chế trong đó Server (Node.js/Next.js Runtime) nhận yêu cầu HTTP từ trình duyệt, trực tiếp gọi dữ liệu từ Database/Spring Boot Backend, biên dịch toàn bộ giao diện React cùng dữ liệu thành một chuỗi HTML hoàn chỉnh, sau đó gửi chuỗi HTML này về cho trình duyệt người dùng hiển thị.

```
[Browser Client] ------------(1) HTTP Request URL ----------> [Next.js Server]
[Browser Client] <---(4) Trả về chuỗi HTML đã render hoàn chỉnh-- [Next.js Server]
                                                                        |
                                                              (2) Truy vấn Data trực tiếp
                                                                        v
                                                              [Spring Boot / Database]
```

### 💡 Ưu thế kỹ thuật của SSR:

1. **Tối ưu SEO (Search Engine Optimization)**: Con bot tìm kiếm của Google/Bing/Baidu đọc trực tiếp chuỗi HTML tĩnh được render sẵn từ Server. Tất cả các thẻ `<title>`, `<meta description>`, OpenGraph/Twitter Cards đều có sẵn dữ liệu giúp bài viết lên TOP tìm kiếm.
2. **Bảo mật hạ tầng mạng**: Mọi tham số Secret Key, truy vấn Database nội bộ đều thực thi khép kín tại Server. Máy chủ giao tiếp với Spring Boot qua mạng nội bộ (Internal Network), không rò rỉ địa chỉ API nhạy cảm xuống trình duyệt.

---

## 🛠️ BƯỚC 1: BÓC TÁCH GIAO DIỆN TỪ TEMPLATE MẪU SANG NGUYÊN MẪU LAYOUT

Giả sử bạn có giao diện mẫu từ Template (`Comprehensive CMS Platform`). Nhiệm vụ của bạn là đưa HTML/Tailwind CSS này vào đúng vị trí trong kiến trúc Next.js App Router (`IVS_CMS`).

### 1.1 Cấu trúc Layout Nối Tiếp (Nested Layouts)

Trong `IVS_CMS`, một trang hiển thị bài viết được bao bọc bởi 3 tầng Layout:

```
src/app/layout.tsx                       <-- (1) Root Layout: Chứa <html> và <body> toàn cục
  └── src/app/[language]/layout.tsx        <-- (2) Language Layout: Xử lý thuộc tính lang="vi|en|ja"
        └── src/app/[language]/(client)/layout.tsx  <-- (3) Client Layout: Chứa Header & Footer trang công cộng
              └── news/[slug]/page.tsx      <-- (4) Target Page: Nội dung chi tiết bài viết (SSR)
```

### 1.2 Phân tích Kỹ thuật: Tại sao KHÔNG khai báo `'use client'`?

> [!CAUTION]
> **TẠI SAO KHÔNG THÊM DIRECTIVE `'use client'` Ở DÒNG ĐẦU TỆP TRANG SSR?**
>
> - **WHAT (Lỗi gì xảy ra)**: Nếu bạn ghi `'use client';` ở dòng đầu tiên của file `page.tsx` trong trang SSR, Next.js sẽ ép buộc chuyển Component này từ Server Component thành Client Component.
> - **WHY (Tại sao đây là lỗi nghiêm trọng)**:
>   1. **Lỗi Biên dịch Build Error**: Không thể xuất hàm `generateMetadata` (Next.js sẽ nổ lỗi: `generateMetadata is not supported in Client Components`).
>   2. **Mất tác dụng SEO**: Trang web không còn được render HTML sẵn tại Server nữa mà đẩy toàn bộ công đoạn render về trình duyệt client.
>   3. **Không thể dùng `async/await` ở Component**: Client Component của React không hỗ trợ `async/await` trực tiếp ở cấp độ top-level function.
> - **WHO (Ai hay mắc lỗi)**: Người nhầm lẫn giữa dùng CSR và SSR.
> - **WHEN (Khi nào dùng / Không dùng)**: KHÔNG DÙNG cho file trang (`page.tsx`) cần SEO & nạp dữ liệu. CHỈ DÙNG tại các component lá nhỏ cần `useState`, `useEffect`, hoặc bắt sự kiện click (`onClick`).
> - **WHERE (Vị trí)**: Dòng đầu tiên (Line 1) của file.
> - **HOW (Quy tắc thực hành)**: Trong Next.js App Router, mặc định **MỌI TỆP TRONG `app/` ĐỀU LÀ SERVER COMPONENT**. Bạn không cần khai báo bất kỳ directive nào, chỉ đơn giản là **KHÔNG VIẾT `'use client'`**.

---

### 1.3 Quy tắc JSX Return Element (Single Root Element)

> [!IMPORTANT]
> **QUY TẮC BẮT BUỘC TRONG JSX: CHỈ TRẢ VỀ MỘT PHẦN TỬ GỐC DUY NHẤT**
>
> Một hàm React Component trong JavaScript/TypeScript chỉ được phép `return` về **duy nhất 1 phần tử gốc (Single Root Element)**.
>
> ```tsx
> // ❌ SAI (Báo lỗi biên dịch: Adjacent JSX elements must be wrapped in an enclosing tag)
> return (
>   <div>Phần tử 1</div>
>   <div>Phần tử 2</div>
> );
>
> // ✅ ĐÚNG CÁCH 1: Bọc tất cả vào một thẻ chung (như <article>, <main>, hoặc <div>)
> return (
>   <article>
>     <div>Phần tử 1</div>
>     <div>Phần tử 2</div>
>   </article>
> );
>
> // ✅ ĐÚNG CÁCH 2: Dùng React Fragment (<>...</>) nếu không muốn sinh thêm thẻ HTML thừa vào DOM
> return (
>   <>
>     <div>Phần tử 1</div>
>     <div>Phần tử 2</div>
>   </>
> );
> ```

---

### 1.4 Mã nguồn Giao diện Tĩnh bóc tách từ Template Mẫu (`page.tsx`)

Tạo file mới tại `src/app/[language]/(client)/news/[slug]/page.tsx`:

```tsx
// src/app/[language]/(client)/news/[slug]/page.tsx
// LƯU Ý: Mặc định file này là Server Component (Không thêm 'use client')

export default async function NewsDetailPage() {
  return (
    // Bọc toàn bộ giao diện trong một thẻ phần tử gốc duy nhất (<article>)
    <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 font-['Plus_Jakarta_Sans']">
      {/* Vùng Tiêu đề & Meta */}
      <header className="border-b border-slate-100 pb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
          Tin tức hệ thống
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 leading-tight">
          Hướng dẫn chuyển đổi hệ thống sang kiến trúc Next.js 15 và Spring Boot
        </h1>
        <div className="flex items-center gap-4 mt-6 text-sm text-slate-500">
          <span>
            Tác giả: <strong>Nguyễn Văn A</strong>
          </span>
          <span>•</span>
          <span>Ngày đăng: 06/08/2026</span>
          <span>•</span>
          <span>Lượt xem: 1,250</span>
        </div>
      </header>

      {/* Vùng Nội dung chính */}
      <div className="mt-8 prose prose-slate max-w-none text-slate-700 leading-relaxed">
        <p className="text-lg font-medium text-slate-600">
          Đây là nội dung tóm tắt ban đầu được bóc tách từ bản giao diện mẫu...
        </p>
      </div>
    </article>
  );
}
```

---

## 🌐 BƯỚC 2: TÍCH HỢP ĐA NGÔN NGỮ (i18n DICTIONARY)

Thay vì hardcode các chuỗi tiếng Việt như `"Tin tức hệ thống"`, `"Tác giả"`, `"Ngày đăng"`, chúng ta đưa chúng vào hệ thống Dictionary đa ngôn ngữ của `IVS_CMS`.

### 2.1 Khai báo Từ khóa vào Dictionary JSON

Thêm các từ khóa tương ứng vào `src/dictionaries/vi.json` và `src/dictionaries/en.json`:

- **`src/dictionaries/vi.json`**:

```json
{
  "news": {
    "systemNews": "Tin tức hệ thống",
    "author": "Tác giả",
    "publishedDate": "Ngày đăng",
    "views": "Lượt xem",
    "notFound": "Bài viết không tồn tại trên hệ thống"
  }
}
```

- **`src/dictionaries/en.json`**:

```json
{
  "news": {
    "systemNews": "System News",
    "author": "Author",
    "publishedDate": "Published Date",
    "views": "Views",
    "notFound": "Article does not exist on the system"
  }
}
```

### 2.2 Đọc Dictionary trực tiếp tại Server Component

```tsx
import { getDictionary } from '@/utils/i18n';

interface NewsDetailPageProps {
  params: Promise<{ language: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  // Lấy params async đúng chuẩn
  const { language, slug } = await params;

  // Tải dictionary ngay trên Server
  const dict = getDictionary(language);

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
        {dict.news.systemNews}
      </span>
      {/* ... */}
    </article>
  );
}
```

---

## 📐 BƯỚC 3: ĐỊNH NGHĨA HỢP ĐỒNG DỮ LIỆU (DATA CONTRACT: FE & BE)

Một lập trình viên chuyên nghiệp luôn định nghĩa kiểu dữ liệu (Type/DTO) trước khi viết code xử lý logic.

### 3.1 Phía Backend Java Spring Boot (`PostEntity.java` & `PostDetailResponseDTO.java`)

```java
// 1. Entity ánh xạ bảng MySQL 'posts'
@Entity
@Table(name = "posts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String authorName;
    private Integer viewCount;
    private LocalDateTime createdAt;
}

// 2. DTO trả về cho Client
@Getter @Setter
@Builder
public class PostDetailResponseDTO {
    private Long id;
    private String slug;
    private String title;
    private String summary;
    private String content;
    private String authorName;
    private Integer viewCount;
    private String createdAt;
}
```

### 3.2 Phía Frontend Next.js TypeScript (`src/types/index.ts`)

Đảm bảo kiểu dữ liệu TypeScript ở Frontend trùng khớp 100% với DTO của Spring Boot Backend:

```typescript
// src/types/index.ts

export interface PostDetail {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  authorName: string;
  viewCount: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}
```

---

## 🔌 BƯỚC 4: PHÁT TRUYỂN TẦNG DỊCH VỤ (SERVICE LAYER & REST CONTROLLER)

### 4.1 Phía Backend Spring Boot Controller (`PostController.java`)

```java
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PostDetailResponseDTO>> getPostBySlug(@PathVariable String slug) {
        PostDetailResponseDTO data = postService.findPostBySlug(slug);

        ApiResponse<PostDetailResponseDTO> response = ApiResponse.<PostDetailResponseDTO>builder()
                .success(true)
                .code("SUCCESS")
                .message("Lấy thông tin bài viết thành công")
                .data(data)
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.ok(response);
    }
}
```

### 4.2 Phía Frontend Service Layer (`src/services/post-service.ts`)

Viết hàm fetch dữ liệu chạy riêng ở môi trường Server Component:

```typescript
// src/services/post-service.ts
import { apiFetch, ApiError } from '@/utils/api-client';
import { ApiResponse, PostDetail } from '@/types';

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    // Sử dụng apiFetch: Tự động ghép Base URL (JAVA_API_URL) và tự đính kèm Auth Cookie
    const result = await apiFetch<ApiResponse<PostDetail>>(`/api/v1/posts/${slug}`, {
      next: { revalidate: 60, tags: [`post-${slug}`] },
    });

    return result.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null; // Bài viết không tồn tại trong DB
    }
    console.error(`[PostService Error] Không thể tải bài viết ${slug}:`, error);
    return null;
  }
}
```

---

## 🚀 BƯỚC 5: LẮP RÁP SERVER COMPONENT & DYNAMIC SEO METADATA

Bây giờ chúng ta lắp toàn bộ Service, Dictionary và Dữ liệu thực tế vào file `page.tsx`.

```tsx
// src/app/[language]/(client)/news/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/utils/i18n';
import { getPostBySlug } from '@/services/post-service';

interface NewsDetailPageProps {
  params: Promise<{ language: string; slug: string }>;
}

// 1. Tự động sinh thẻ Meta SEO động trên Server
export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Bài viết không tồn tại | IVS CMS' };
  }

  return {
    title: `${post.title} | IVS CMS`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
    },
  };
}

// 2. Server Component chính
export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { language, slug } = await params;

  // Gọi Dictionary và API Data trên Server
  const dict = getDictionary(language);
  const post = await getPostBySlug(slug);

  // Nếu Backend trả về null (không thấy bài viết) -> Chuyển sang trang 404 chuẩn
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 font-['Plus_Jakarta_Sans']">
      <header className="border-b border-slate-100 pb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
          {dict.news.systemNews}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mt-6 text-sm text-slate-500">
          <span>
            {dict.news.author}: <strong>{post.authorName}</strong>
          </span>
          <span>•</span>
          <span>
            {dict.news.publishedDate}: {post.createdAt}
          </span>
          <span>•</span>
          <span>
            {dict.news.views}: {post.viewCount.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Render nội dung HTML an toàn */}
      <div
        className="mt-8 prose prose-slate max-w-none text-slate-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
```

---

## 🧪 BƯỚC 6: KIỂM THỬ VÀ XỬ LÝ NGOẠI LỆ (ERROR & NOT FOUND)

### 6.1 Xử lý khi bài viết không tồn tại (`not-found.tsx`)

Tạo file `src/app/[language]/(client)/news/[slug]/not-found.tsx`:

```tsx
import Link from 'next/link';

export default function NewsNotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-800">404 - Không tìm thấy bài viết</h2>
      <p className="text-slate-500 mt-2">
        Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không đúng.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}
```

---

## 📋 BẢNG TÓM TẮT CHECKLIST QUY TRÌNH SSR

- [x] **Không dùng `'use client'`** ở trang đọc dữ liệu tĩnh.
- [x] **Luôn bọc kết quả trả về trong một thẻ phần tử gốc duy nhất** (Single Root Element).
- [x] **Khai báo `generateMetadata`** để tự động tạo SEO Tags.
- [x] **Dùng `await params`** để trích xuất tham số `language` và `slug`.
- [x] **Định nghĩa kiểu 1:1** giữa `Spring Boot DTO` và `TypeScript Interface`.
- [x] **Gọi `notFound()`** khi dữ liệu trả về bị rỗng để render màn hình 404 thân thiện.
