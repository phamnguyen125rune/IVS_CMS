'use client';

/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { ArrowRight, Play, Eye } from 'lucide-react';
import type { ReqCreateBannerDTO, StatsItem } from '@/types/banner.type';

interface BannerLivePreviewProps {
  banner: ReqCreateBannerDTO;
}

export default function BannerLivePreview({ banner }: BannerLivePreviewProps) {
  let stats: StatsItem[] = [];
  try {
    if (banner.statsJson) {
      stats = JSON.parse(banner.statsJson);
    }
  } catch {
    stats = [];
  }

  return (
    <div className="rounded-2xl border border-slate-700/60 overflow-hidden bg-slate-950 text-white shadow-2xl">
      {/* Preview Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-blue-400" />
          <span className="font-semibold text-slate-300">Xem trước Banner Trang chủ (Live Preview)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
      </div>

      {/* Hero Banner Section Simulation */}
      <div
        className="relative overflow-hidden p-6 sm:p-8 md:p-10"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          minHeight: 380,
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Subtitle / Badge */}
            {banner.subtitle && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{banner.subtitle}</span>
              </div>
            )}

            {/* Title with Highlight */}
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
              {banner.title || 'Tiêu đề banner mẫu'}
              {banner.highlightText && (
                <>
                  <br />
                  <span className="text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                    {banner.highlightText}
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {banner.description ||
                'Mô tả banner sẽ hiển thị tại đây khi bạn nhập nội dung vào biểu mẫu...'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {banner.primaryBtnText && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 shadow-lg shadow-blue-500/25">
                  {banner.primaryBtnText}
                  <ArrowRight size={13} />
                </span>
              )}

              {banner.secondaryBtnText && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10">
                  <Play size={12} />
                  {banner.secondaryBtnText}
                </span>
              )}
            </div>

            {/* Stats Counter Row */}
            {stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                {stats.map((s, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-lg font-bold text-white font-mono">{s.num}</div>
                    <div className="text-[11px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl aspect-[4/3] bg-slate-800">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                    <span>Chưa có hình ảnh</span>
                    <span className="text-[10px] text-slate-600 mt-1">
                      (Nhập URL hoặc chọn từ Media)
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              {banner.floatingBadgeText && (
                <div className="absolute -bottom-3 -left-3 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 shadow-xl flex items-center gap-2 max-w-[85%]">
                  {/* <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    ★
                  </div> */}
                  <span className="text-[11px] font-medium text-slate-200 truncate">
                    {banner.floatingBadgeText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
