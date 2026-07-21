'use client';

// ============================================================
// TRANG CSR — Client-Side Rendering
//
// Luồng:
//   Browser (React) ---fetch---> Java Spring Boot :8080
//                   <---JSON----
//
// Ưu điểm: không cần server Next.js xử lý, nhẹ.
// Nhược điểm: lộ địa chỉ Java API ra trình duyệt; không SEO. Tuy nhiên nó có thể gọi tới endpoint của Next.js API route,
// sau đó mới gọi tới Java API
// ============================================================

import { useState } from 'react';

// Địa chỉ Java Spring Boot — browser gọi thẳng vào đây
const JAVA_API = 'http://localhost:8080/api/addition';

export default function CsrPage() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showText, setShowText] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult('');

    try {
      // Browser gọi thẳng Java — không qua Next.js server
      const res = await fetch(`${JAVA_API}?a=${a}&b=${b}`);

      // Kiểm tra HTTP status trước khi parse JSON
      if (!res.ok) {
        setError(`Lỗi ${res.status}: Java server trả về lỗi. Kiểm tra SecurityConfig.`);
        return;
      }

      const data = await res.json();
      setResult(`${data.a} + ${data.b} = ${data.result}`);
    } catch {
      // Network error — Java chưa chạy hoặc CORS bị chặn
      setError('Không kết nối được Java (:8080). Kiểm tra server đã chạy chưa và CORS.');
    }
  }

  return (
    <div>
      <h1>CSR — browser gọi Java trực tiếp</h1>

      <form onSubmit={handleSubmit}>
        <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="Số a" />
        <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="Số b" />
        <button type="submit">Tính</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p>{result}</p>}

      {/* Nút hiển thị chữ tạm thời (biến mất khi F5/reload) */}
      <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 max-w-md shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Ví dụ Client State (CSR)</h3>
        <button
          onClick={() => setShowText(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        >
          Hiện dòng chữ
        </button>
        {showText && (
          <p className="mt-3 text-sm text-green-600 font-medium">
            Dòng chữ này sẽ biến mất khi bạn tải lại trang!
          </p>
        )}
      </div>
    </div>
  );
}
