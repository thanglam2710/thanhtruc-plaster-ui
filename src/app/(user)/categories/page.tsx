"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSearchCategories } from "@/hooks/user/categories/useCategories";
import type { CategorySearchRequest } from "@/types/user/categories";
import TablePagination from "@/components/dashboard/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FolderTree, ArrowLeft } from "lucide-react";
import { useGetCategoryById } from "@/hooks/dashboard/categories/useCategories";
import { getValidImageUrl } from "@/lib/utils/image";

function CategoriesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [queryParams, setQueryParams] = useState<CategorySearchRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 12,
    searchValue: searchParams.get("searchValue") || "",
    parentId: searchParams.get("parentId")
      ? Number(searchParams.get("parentId"))
      : undefined,
  });

  // Redirect if no parentId
  useEffect(() => {
    if (!queryParams.parentId) {
      router.push("/");
    }
  }, [queryParams.parentId, router]);

  // Sync queryParams with URL changes
  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const parentId = searchParams.get("parentId");
    const pageIndex = Number(searchParams.get("pageIndex")) || 1;

    setQueryParams({
      pageIndex,
      pageSize: 12,
      searchValue,
      parentId: parentId ? Number(parentId) : undefined,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useSearchCategories(queryParams);
  
  // Fetch parent category info to get image
  const { data: parentCategory } = useGetCategoryById(queryParams.parentId || 0);

  const updateUrlParams = (params: CategorySearchRequest) => {
    const urlParams = new URLSearchParams();

    if (params.searchValue) urlParams.set("searchValue", params.searchValue);
    if (params.pageIndex)
      urlParams.set("pageIndex", params.pageIndex.toString());
    if (params.parentId !== undefined && params.parentId !== null)
      urlParams.set("parentId", params.parentId.toString());

    router.push(`?${urlParams.toString()}`, { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newParams: CategorySearchRequest = {
      ...queryParams,
      pageIndex: 1,
    };
    setQueryParams(newParams);
    updateUrlParams(newParams);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQueryParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    const newParams: CategorySearchRequest = {
      ...queryParams,
      pageIndex: newPage,
    };
    setQueryParams(newParams);
    updateUrlParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    const resetParams: CategorySearchRequest = {
      pageIndex: 1,
      pageSize: 12,
      searchValue: "",
      parentId: queryParams.parentId,
    };
    setQueryParams(resetParams);
    updateUrlParams(resetParams);
  };

  const categoriesData = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.pageIndex || 1;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh mục. Vui lòng thử lại sau.</p>
        <Link
          href="/"
          className="inline-flex items-center text-brand-secondary hover:underline mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Category Image */}
      <div className="relative h-[400px] overflow-hidden">
        {/* Background Image or Gradient */}
        {parentCategory?.image ? (
          <>
            <img 
              src={getValidImageUrl(parentCategory.image)} 
              alt={parentCategory.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-linear-to-br from-brand-primary to-amber-700" />
            <div className="absolute inset-0 bg-black/10" />
          </>
        )}
        
        <div className="relative z-10 container mx-auto px-4 md:px-14 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <FolderTree className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {parentCategory?.name || "Danh Mục Sản Phẩm"}
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              Khám phá các danh mục
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {parentCategory?.description || "Chọn danh mục để xem các dự án liên quan"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-14 py-12">
        {/* Back button */}
        <div className="w-full max-w-7xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-brand-secondary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Link>
        </div>

        {/* Search Section - Centered */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Search className="h-6 w-6 text-brand-secondary" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Tìm kiếm & Sắp xếp
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="searchValue"
                    placeholder="Tìm kiếm theo tên danh mục..."
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 bg-white w-full"
                    value={queryParams.searchValue || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-4 sm:w-auto">
                  <Button
                    type="submit"
                    className="flex-1 py-3 bg-brand-secondary hover:bg-amber-600 rounded-xl text-white font-semibold transition-colors"
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={handleReset}
                  >
                    Đặt lại
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Categories List Section - Centered */}
        <div className="w-full max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <span className="animate-spin h-8 w-8 border-4 border-brand-secondary border-t-transparent rounded-full mr-3"></span>
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {categoriesData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoriesData.map((category) => (
                      <Link
                        key={category.id}
                        href={`/projects?categoryId=${category.id}&isActive=true`}
                        className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        {category.thumbnail && category.thumbnail.trim() !== "" && (
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={category.thumbnail}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12">
                      <TablePagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">Chưa có danh mục nào.</p>
                  <Link
                    href="/"
                    className="inline-flex items-center text-brand-secondary hover:underline mt-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại trang chủ
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoriesListPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Đang tải...</div>}>
      <CategoriesListContent />
    </Suspense>
  );
}
