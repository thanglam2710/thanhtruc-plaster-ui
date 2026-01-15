import { ForgotPasswordForm } from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-heading text-brand-primary">
          Quên mật khẩu
        </h1>
        <p className="text-text-muted">
          Nhập email của bạn để nhận mã xác thực (OTP)
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
