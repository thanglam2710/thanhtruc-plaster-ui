"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-heading text-brand-primary">
          Đặt lại mật khẩu
        </h1>
        <p className="text-text-muted">
          Nhập mật khẩu mới an toàn hơn cho tài khoản của bạn
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center text-sm text-gray-500">
            Đang tải biểu mẫu...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
