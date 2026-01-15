"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useGetCategoriesPagination } from "@/hooks/dashboard/categories/useCategories";
import Link from "next/link";

export const ProductGrid = () => {
  // Lấy category cha (parentId = null)
  const { data: categoryData, isLoading } = useGetCategoriesPagination({
    parentId: undefined, // undefined nghĩa là không lọc theo cha (logic backend cần xử lý lấy root hoặc filter tại client)
    // Nếu backend chưa hỗ trợ lọc root category, ta có thể fetch all rồi filter ở đây
    pageSize: 4,
    pageIndex: 1,
  });

  // Giả sử API trả về list category, ta lọc lấy những cái là cha (nếu backend trả về mixed)
  const products = categoryData?.items || [];

  return (
    <section className="py-20 bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-2 uppercase tracking-tight font-heading">
              Hệ thống sản phẩm dịch vụ
            </h2>
            <div className="w-20 h-1 bg-brand-secondary"></div>
          </div>
          <Link
            href="/categories"
            className="text-brand-primary font-semibold flex items-center hover:text-brand-secondary transition-colors group"
          >
            Khám phá chi tiết danh mục{" "}
            <ArrowUpRight className="ml-1 w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            <p>Đang tải...</p>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/categories/${product.slug}`}
                className="group bg-white border border-brand-secondary rounded-card overflow-hidden transition-all duration-300 hover:border-brand-primary cursor-pointer flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={
                      product.image ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-primary bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <div className="p-8 grow flex flex-col">
                  <h3 className="text-xl font-bold text-brand-primary mb-4 transition-colors group-hover:text-brand-secondary uppercase tracking-tight font-heading">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6 grow line-clamp-3">
                    {product.description || "Chưa có mô tả"}
                  </p>
                  <div className="pt-4 border-t border-bg-main">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary flex items-center group-hover:gap-2 transition-all">
                      Xem sản phẩm <ArrowUpRight className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
