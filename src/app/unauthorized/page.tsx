"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-main p-6 text-center">
      {/* 1. Logo Thương Hiệu (Dùng dạng text như Navbar vì chưa có file ảnh logo nền trong suốt) */}
      <div className="mb-10 flex flex-col items-center animate-fadeIn">
        <span className="text-4xl md:text-5xl font-bold font-heading text-brand-primary tracking-tighter uppercase">
          THANH TRÚC
        </span>
        <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-brand-primary mt-1">
          Thạch Cao & Nội Thất
        </span>
        <div className="w-24 h-1 bg-brand-secondary mt-4"></div>
      </div>

      {/* 2. Icon & Thông báo lỗi */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-brand-secondary blur-2xl opacity-20 rounded-full"></div>
        <ShieldAlert className="relative w-24 h-24 text-brand-primary mx-auto" />
      </div>

      <h1 className="text-6xl font-bold font-heading text-brand-primary mb-2">
        401
      </h1>
      <h2 className="text-2xl font-bold font-heading text-brand-primary mb-4 uppercase tracking-wide">
        Truy cập bị từ chối
      </h2>

      <p className="text-text-muted max-w-md mb-10 font-body text-lg leading-relaxed">
        Rất tiếc, bạn không có quyền truy cập vào khu vực này. Trang này chỉ
        dành cho nhân viên của ThanhTrucPlaster.
      </p>

      {/* 3. Nút điều hướng */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        {/* Về trang chủ User */}
        <Link
          href="/"
          className="flex items-center justify-center px-6 py-3 rounded-btn border-2 border-brand-primary text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all duration-300 group"
        >
          <Home className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Về trang chủ
        </Link>

        {/* Về trang đăng nhập Admin */}
        <Link
          href="/dashboard/login"
          className="flex items-center justify-center px-6 py-3 rounded-btn bg-brand-primary text-brand-secondary font-bold hover:bg-[#5a3b2b] transition-all duration-300 shadow-lg hover:shadow-xl group"
        >
          <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
          Đăng nhập vào Dashboard
        </Link>
      </div>

      {/* Footer nhỏ */}
      <div className="mt-12 text-xs text-text-muted font-body">
        &copy; {new Date().getFullYear()} Thanh Trúc Plaster. All rights
        reserved.
      </div>
    </div>
  );
}
