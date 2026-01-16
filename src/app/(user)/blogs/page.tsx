"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSearchBlogs } from "@/hooks/user/blogs/useBlogs";
import type { BlogSearchRequest } from "@/types/user/blogs";
import TablePagination from "@/components/dashboard/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { getValidImageUrl } from "@/lib/utils/image";

function BlogsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [queryParams, setQueryParams] = useState<BlogSearchRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 12,
    searchValue: searchParams.get("searchValue") || "",
    blogTypeId: searchParams.get("blogTypeId")
      ? Number(searchParams.get("blogTypeId"))
      : undefined,
    isPublished: true,
  });

  // Sync queryParams with URL changes
  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const blogTypeId = searchParams.get("blogTypeId");
    const pageIndex = Number(searchParams.get("pageIndex")) || 1;

    setQueryParams({
      pageIndex,
      pageSize: 12,
      searchValue,
      blogTypeId: blogTypeId ? Number(blogTypeId) : undefined,
      isPublished: true,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useSearchBlogs(queryParams);

  const updateUrlParams = (params: BlogSearchRequest) => {
    const urlParams = new URLSearchParams();

    if (params.searchValue) urlParams.set("searchValue", params.searchValue);
    if (params.pageIndex)
      urlParams.set("pageIndex", params.pageIndex.toString());
    if (params.blogTypeId !== undefined && params.blogTypeId !== null)
      urlParams.set("blogTypeId", params.blogTypeId.toString());

    router.push(`?${urlParams.toString()}`, { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newParams: BlogSearchRequest = {
      ...queryParams,
      pageIndex: 1,
      isPublished: true,
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
    const newParams: BlogSearchRequest = {
      ...queryParams,
      pageIndex: newPage,
      isPublished: true,
    };
    setQueryParams(newParams);
    updateUrlParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    const resetParams: BlogSearchRequest = {
      pageIndex: 1,
      pageSize: 12,
      searchValue: "",
      blogTypeId: queryParams.blogTypeId, // Keep blogTypeId if from URL
      isPublished: true,
    };
    setQueryParams(resetParams);
    updateUrlParams(resetParams);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const blogsData = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.pageIndex || 1;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-brand-primary to-amber-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 container mx-auto px-4 md:px-14 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Tin Tức & Bài Viết
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              Cập nhật thông tin mới nhất
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Khám phá các bài viết và tin tức về thạch cao
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-14 py-12">
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
                    placeholder="Tìm kiếm theo tiêu đề, tóm tắt..."
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

        {/* Blogs List Section - Centered */}
        <div className="w-full max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <span className="animate-spin h-8 w-8 border-4 border-brand-secondary border-t-transparent rounded-full mr-3"></span>
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {blogsData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogsData.map((blog) => (
                      <Link
                        key={blog.id}
                        href={`/blogs/${blog.slug}`}
                        className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={getValidImageUrl(blog.thumbnail)}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {blog.summary}
                          </p>
                          
                          {blog.blogTypeName && (
                            <span className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-xs font-semibold">
                              {blog.blogTypeName}
                            </span>
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
                  <p className="text-xl text-gray-600">Chưa có bài viết nào được công bố.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogsListPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Đang tải...</div>}>
      <BlogsListContent />
    </Suspense>
  );
}
