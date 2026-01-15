"use client"; // Cần use client vì dùng useSearchParams bên trong form

import { Suspense } from "react";
import { VerifyOtpForm } from "./_components/verify-otp-form";

export default function VerifyOtpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-heading text-brand-primary">
          Nhập mã OTP
        </h1>
        <p className="text-text-muted">
          Mã xác thực đã được gửi đến email của bạn.
        </p>
      </div>
      <Suspense fallback={<div>Đang tải form...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
