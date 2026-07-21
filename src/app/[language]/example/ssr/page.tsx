// ============================================================
// TRANG SSR — Server-Side Rendering
//
// Luồng:
//   Browser ---[GET /example/ssr?a=3&b=5]---> Next.js Server
//   Next.js Server ---fetch---> Java Spring Boot :8080
//                  <---JSON----
//   Next.js render HTML xong ---> trả về Browser
//
// Ưu điểm: ẩn địa chỉ Java khỏi browser; hỗ trợ SEO.
// Nhược điểm: mỗi request đều render trên server.
// ============================================================

import ShowTextButton from './ShowTextButton';

// Địa chỉ Java Spring Boot — Node.js (server) gọi, không lộ ra browser
const JAVA_API = 'http://localhost:8080/api/addition';

// searchParams được Next.js truyền tự động từ query string URL:
//   /example/ssr?a=3&b=5
interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function SsrPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const a = params.a ?? '';
  const b = params.b ?? '';

  let result = '';

  // Chỉ fetch khi có đủ hai số
  if (a !== '' && b !== '') {
    // Server Next.js gọi Java — browser không biết địa chỉ này
    const res = await fetch(`${JAVA_API}?a=${a}&b=${b}`, {
      cache: 'no-store', // luôn gọi lại, không cache
    });
    const data = await res.json();
    result = `${data.a} + ${data.b} = ${data.result}`;
  }

  return (
    <div>
      <h1>SSR — Next.js server gọi Java, rồi render HTML</h1>

      {/* Form submit → reload trang với query string mới */}
      <form method="GET" action="/example/ssr">
        <input type="number" name="a" defaultValue={a} placeholder="Số a" />
        <input type="number" name="b" defaultValue={b} placeholder="Số b" />
        <button type="submit">Tính</button>
      </form>

      {result && <p>{result}</p>}

      {/* Nút hiển thị chữ tạm thời (biến mất khi F5/reload) */}
      <ShowTextButton />
    </div>
  );
}
