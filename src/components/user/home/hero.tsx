import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative w-full h-150 bg-brand-primary overflow-hidden">
      <img
        src="https://picsum.photos/seed/arch/1920/1080"
        alt="Gypsum interior"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-none">
        <div className="bg-white border-l-8 border-brand-secondary p-8 md:p-12 max-w-xl pointer-events-auto rounded-r-card animate-fadeIn shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-6 leading-tight font-heading">
            Giải Pháp Trần & Tường <br />{" "}
            <span className="text-brand-secondary">Đẳng Cấp Chuyên Gia</span>
          </h1>
          <p className="text-text-body text-lg mb-8 font-body leading-relaxed">
            Chúng tôi kiến tạo không gian sống hiện đại, bền bỉ và sang trọng
            với công nghệ thạch cao tiên tiến hàng đầu Việt Nam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/projects"
              className="bg-brand-primary text-brand-secondary px-8 py-3 rounded-btn font-semibold flex items-center justify-center hover:bg-[#5a3b2b] transition-all group"
            >
              Xem giải pháp
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contacts"
              className="border border-brand-secondary text-brand-primary px-8 py-3 rounded-btn font-semibold hover:bg-bg-main transition-all flex items-center justify-center"
            >
              Tư vấn kỹ thuật
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
