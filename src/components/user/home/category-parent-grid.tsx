"use client";
import { ArrowUpRight } from "lucide-react";
import { useGetPublicCategories } from "@/hooks/user/usePublicData";
import Link from "next/link";
import { useEffect } from "react";

export const CategoryParentGrid = () => {
  const { data: categoryData, isLoading } = useGetPublicCategories({
    pageSize: 4,
    pageIndex: 1,
    parentId: null,
  });

  useEffect(() => {
    if (categoryData?.items) {
      console.log("=== CATEGORY DATA DEBUG ===");
      console.log("Total items:", categoryData.items.length);
      categoryData.items.forEach((cat, idx) => {
        console.log(`[${idx}] ${cat.name}:`, {
          id: cat.id,
          image: cat.image,
          hasImage: !!cat.image,
          imageType: typeof cat.image
        });
      });
    }
  }, [categoryData]);

  const categories = categoryData?.items || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-bg-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Đang tải...</p>
        </div>
      </section>
    );
  }

  // Debug: Kiểm tra nếu không có dữ liệu
  if (categories.length === 0) {
    console.warn("No categories found!");
    return (
      <section className="py-20 bg-bg-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Không có danh mục nào.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-2 uppercase tracking-tight font-heading">
              Hệ thống sản phẩm dịch vụ
            </h2>
            <div className="w-20 h-1 bg-brand-secondary"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const imageUrl = category.image 
              ? (category.image.startsWith('http') 
                  ? category.image 
                  : `https://your-api-domain.com${category.image}`)
              : "https://placehold.co/600x800";
            
            console.log(`Rendering ${category.name} with image:`, imageUrl);
            
            return (
              <Link
                key={category.id}
                href={`/categories?parentId=${category.id}`}
                className="group bg-white border border-brand-secondary rounded-card overflow-hidden transition-all duration-300 hover:border-brand-primary cursor-pointer flex flex-col"
              >
                <div className="h-64 bg-gray-100 overflow-hidden relative">
                  {/* Test image với background color */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.error(`Image failed to load: ${imageUrl}`);
                        e.currentTarget.src = "https://placehold.co/600x800";
                      }}
                      onLoad={() => console.log(`Image loaded: ${imageUrl}`)}
                    />
                  </div>
                </div>
                <div className="p-8 grow flex flex-col">
                  <h3 className="text-xl font-bold text-brand-primary mb-4 transition-colors group-hover:text-brand-secondary uppercase tracking-tight font-heading">
                    {category.name}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-6 grow line-clamp-3">
                    {category.description || "Chưa có mô tả"}
                  </p>
                  <div className="pt-4 border-t border-bg-main">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary flex items-center group-hover:gap-2 transition-all">
                      Xem sản phẩm <ArrowUpRight className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};