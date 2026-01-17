import React from "react";
import Link from "next/link";
import { Facebook, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";

// Dữ liệu Footer (Đặt trực tiếp tại đây)
const FOOTER_LINKS = {
  quickLinks: [
    { label: "Về chúng tôi", href: "/about" },
    { label: "Dự án công trình", href: "/projects" },
    { label: "Tin tức sự kiện", href: "/blogs" },
    { label: "Báo giá và tuyển dụng", href: "/contacts" },
  ],
  policies: [
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Chính sách bảo hành", href: "/warranty" },
    { label: "Quy định đổi trả", href: "/return-policy" },
  ],
  contact: {
    address: "02 Đường số 10, Phần Bình Hưng Hòa, TP. Hồ Chí Minh",
    phone: "024 3922 1111",
    email: "thanhtrucplaster@gmail.com",
  },
};

export const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold font-heading tracking-tighter uppercase">
                THANH TRÚC
              </span>
              <span className="text-xs uppercase tracking-[0.4em] -mt-1 text-brand-secondary">
                Thạch Cao & Nội Thất
              </span>
            </div>
            <p className="text-sm text-white text-opacity-80 leading-relaxed font-body">
              Thạch cao Thanh Trúc tự hào mang đến các giải pháp thi công toàn
              diện, kiến tạo không gian sống đẳng cấp và bền vững cho mọi công
              trình.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold uppercase mb-8 border-b border-brand-secondary border-opacity-30 pb-2 font-heading">
              Liên kết nhanh
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-white text-opacity-90 hover:text-brand-secondary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Policies */}
          <div>
            <h4 className="text-lg font-bold uppercase mb-8 border-b border-brand-secondary border-opacity-30 pb-2 font-heading">
              Chính sách
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.policies.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-white text-opacity-90 hover:text-brand-secondary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-lg font-bold uppercase mb-8 border-b border-brand-secondary border-opacity-30 pb-2 font-heading">
              Liên hệ
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 shrink-0 text-brand-secondary" />
                <span className="text-sm text-white text-opacity-90">
                  {FOOTER_LINKS.contact.address}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 shrink-0 text-brand-secondary" />
                <span className="text-sm text-white text-opacity-90">
                  {FOOTER_LINKS.contact.phone}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 shrink-0 text-brand-secondary" />
                <span className="text-sm text-white text-opacity-90">
                  {FOOTER_LINKS.contact.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white border-opacity-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white text-opacity-50">
            © {new Date().getFullYear()} Thạch cao Thanh Trúc. All Rights
            Reserved.
          </p>
          <div className="flex space-x-6 text-xs text-white text-opacity-50 font-body">
            <span>Thiết kế bởi Thang Lam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
