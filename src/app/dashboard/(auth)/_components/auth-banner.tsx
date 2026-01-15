import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthBanner() {
  return (
    <div className="relative hidden flex-col bg-[#1A1A1A] p-10 text-white md:flex border-r border-gray-800">
      <div className="absolute inset-0 bg-brand-primary/10" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-brand-secondary" />
          <Link href="/" className="text-xl font-bold uppercase tracking-wider">
            Thanh Trúc Plaster Admin
          </Link>
        </div>

        <div className="grow flex flex-col items-center justify-center space-y-4">
          {/* Logo dạng chữ */}
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold font-heading text-white tracking-tighter uppercase">
              THANH TRÚC
            </span>
            <span className="text-sm uppercase tracking-[0.4em] text-brand-secondary mt-2">
              Thạch Cao & Nội Thất
            </span>
            <div className="w-20 h-1 bg-brand-primary mt-6"></div>
          </div>
          <p className="text-gray-400 text-center max-w-sm mt-4">
            Hệ thống quản trị nội dung website và quản lý dự án chuyên nghiệp.
          </p>
        </div>

        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} Thanh Truc Plaster.
        </div>
      </div>
    </div>
  );
}
