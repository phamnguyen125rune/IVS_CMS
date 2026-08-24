'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import { Upload, Search, Grid, List, Trash2, Download, Copy, Check } from 'lucide-react';

const mediaItems = [
  {
    id: 1,
    name: 'hero-banner-homepage.jpg',
    size: '2.4 MB',
    type: 'image',
    date: '14/07/2024',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'team-photo-2024.jpg',
    size: '3.1 MB',
    type: 'image',
    date: '13/07/2024',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'office-hanoi-exterior.jpg',
    size: '1.8 MB',
    type: 'image',
    date: '12/07/2024',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'product-dashboard-ui.png',
    size: '890 KB',
    type: 'image',
    date: '11/07/2024',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'conference-keynote.jpg',
    size: '4.2 MB',
    type: 'image',
    date: '10/07/2024',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'data-analytics-chart.png',
    size: '1.2 MB',
    type: 'image',
    date: '09/07/2024',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 7,
    name: 'mobile-app-mockup.png',
    size: '2.8 MB',
    type: 'image',
    date: '08/07/2024',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 8,
    name: 'client-event-2024.jpg',
    size: '5.1 MB',
    type: 'image',
    date: '07/07/2024',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 9,
    name: 'logo-CMS-main.svg',
    size: '45 KB',
    type: 'image',
    date: '06/07/2024',
    url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 10,
    name: 'infographic-tech-2024.png',
    size: '3.4 MB',
    type: 'image',
    date: '05/07/2024',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 11,
    name: 'blog-cover-ai-trends.jpg',
    size: '1.9 MB',
    type: 'image',
    date: '04/07/2024',
    url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=300&h=200&fit=crop&auto=format',
  },
  {
    id: 12,
    name: 'workspace-photo.jpg',
    size: '2.2 MB',
    type: 'image',
    date: '03/07/2024',
    url: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=300&h=200&fit=crop&auto=format',
  },
];

export default function Media() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = mediaItems.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const copyUrl = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Media</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {mediaItems.length} tệp • {selected.length > 0 && `${selected.length} đã chọn`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 size={14} />
              Xóa ({selected.length})
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'var(--primary)' }}
          >
            <Upload size={15} />
            Tải lên
          </button>
          <input ref={fileRef} type="file" multiple className="hidden" accept="image/*" />
        </div>
      </div>

      {/* Upload drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-5 transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <Upload
          size={24}
          className={`mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-slate-300'}`}
        />
        <p className="text-sm text-slate-500">
          {isDragging ? 'Thả tệp vào đây...' : 'Kéo thả tệp vào đây hoặc '}
          {!isDragging && <span className="text-blue-600 font-medium">chọn tệp từ máy tính</span>}
        </p>
        <p className="text-xs text-slate-400 mt-1">Hỗ trợ: JPG, PNG, SVG, GIF, WebP tối đa 10MB</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tệp..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`relative rounded-xl overflow-hidden cursor-pointer border-2 group transition-all ${
                selected.includes(item.id)
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-transparent hover:border-slate-200'
              }`}
              style={{ background: '#f1f5f9' }}
            >
              <img src={item.url} alt={item.name} className="w-full aspect-square object-cover" />
              {selected.includes(item.id) && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                <span className="text-white text-xs truncate max-w-[80%]">
                  {item.name.split('.')[0]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(item.id);
                  }}
                  className="text-white hover:text-blue-300"
                >
                  {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="bg-white rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={(e) => setSelected(e.target.checked ? filtered.map((i) => i.id) : [])}
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Tên tệp
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Kích thước
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Ngày tải
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-slate-50"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <span className="text-slate-700 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{item.size}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{item.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                        <Copy size={13} />
                      </button>
                      <button className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                        <Download size={13} />
                      </button>
                      <button className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
