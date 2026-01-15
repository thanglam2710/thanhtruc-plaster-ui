import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-heading text-brand-primary">
          Đăng Nhập
        </h1>
        <p className="text-text-muted">
          Nhập thông tin tài khoản quản trị của bạn
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
