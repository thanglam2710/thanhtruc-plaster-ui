"use client";
import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

// Dữ liệu giải pháp (Đặt trực tiếp tại đây)
const SOLUTIONS = [
  {
    id: "heat",
    title: "Giải pháp chống nóng",
    description:
      "Giảm nhiệt độ trong nhà lên đến 5 độ C so với bên ngoài, giúp tiết kiệm điện năng và tạo không gian sống thoải mái.",
    benefits: [
      "Tiết kiệm điện năng",
      "Tạo không gian mát mẻ",
      "Bền bỉ với thời tiết",
    ],
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "noise",
    title: "Giải pháp chống ồn",
    description:
      "Hệ thống vách và trần cách âm hoàn hảo cho phòng ngủ và không gian làm việc, mang lại sự yên tĩnh tuyệt đối.",
    benefits: [
      "Giảm tiếng ồn đến 60dB",
      "Cải thiện sự riêng tư",
      "Lắp đặt nhanh chóng",
    ],
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "moisture",
    title: "Giải pháp chống ẩm",
    description:
      "Công nghệ tấm thạch cao chịu ẩm ngăn ngừa nấm mốc và bảo vệ cấu trúc nhà tại các khu vực ẩm ướt như nhà tắm, nhà bếp.",
    benefits: [
      "Chống thấm nước vượt trội",
      "Ngăn ngừa vi khuẩn",
      "Phù hợp nhà tắm/bếp",
    ],
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
  },
];

export const SolutionFinder = () => {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const currentSolution =
    SOLUTIONS.find((s) => s.id === activeTab) || SOLUTIONS[0];

  return (
    <section className="py-24 bg-white border-y border-brand-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4 uppercase font-heading">
            Tìm Kiếm Giải Pháp Tối Ưu
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto font-body">
            Lựa chọn giải pháp phù hợp với nhu cầu của công trình để đảm bảo
            chất lượng và độ bền cao nhất.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 bg-bg-main border border-brand-secondary rounded-section overflow-hidden">
          {/* Tabs Sidebar */}
          <div className="lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-brand-secondary">
            {SOLUTIONS.map((solution) => (
              <button
                key={solution.id}
                onClick={() => setActiveTab(solution.id)}
                className={`flex-1 px-8 py-8 text-left transition-all font-semibold uppercase tracking-wider ${
                  activeTab === solution.id
                    ? "bg-brand-primary text-brand-secondary"
                    : "bg-transparent text-brand-primary hover:bg-white"
                }`}
              >
                {solution.title}
              </button>
            ))}
          </div>

          {/* Solution Content */}
          <div className="lg:w-2/3 p-8 md:p-12 flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl font-bold text-brand-primary uppercase font-heading">
                {currentSolution.title}
              </h3>
              <p className="text-text-body text-lg leading-relaxed font-body">
                {currentSolution.description}
              </p>
              <ul className="space-y-4">
                {currentSolution.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary mr-3 shrink-0" />
                    <span className="text-text-body font-medium">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="h-full min-h-75 w-full relative rounded-card overflow-hidden border border-brand-secondary">
                <img
                  src={currentSolution.image}
                  alt={currentSolution.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
