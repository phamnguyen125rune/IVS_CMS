'use client';

import { useState } from 'react';

export default function ShowTextButton() {
  const [showText, setShowText] = useState(false);

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 max-w-md shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Ví dụ Client Interactivity trong SSR</h3>
      <button
        onClick={() => setShowText(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
      >
        Hiện dòng chữ
      </button>
      {showText && (
        <p className="mt-3 text-sm text-green-600 font-medium">
          Dòng chữ này sẽ biến mất khi bạn tải lại trang!
        </p>
      )}
    </div>
  );
}
