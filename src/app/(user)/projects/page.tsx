"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSearchProjects } from "@/hooks/user/projects/useProjects";
import type { ProjectSearchRequest } from "@/types/user/projects";
import TablePagination from "@/components/dashboard/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FolderOpen, MapPin, Calendar } from "lucide-react";
import { getValidImageUrl } from "@/lib/utils/image";
import { formatFullDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useGetCategoryById } from "@/hooks/dashboard/categories/useCategories";

function ProjectsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [queryParams, setQueryParams] = useState<ProjectSearchRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 12,
    searchValue: searchParams.get("searchValue") || "",
    categoryId: searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : undefined,
    isActive: true,
  });

  // Sync queryParams with URL changes
  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const categoryId = searchParams.get("categoryId");
    const pageIndex = Number(searchParams.get("pageIndex")) || 1;

    setQueryParams({
      pageIndex,
      pageSize: 12,
      searchValue,
      categoryId: categoryId ? Number(categoryId) : undefined,
      isActive: true,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useSearchProjects(queryParams);
  
  // Fetch category info to get image (only when categoryId exists)
  const { data: category } = useGetCategoryById(queryParams.categoryId || 0);

  const updateUrlParams = (params: ProjectSearchRequest) => {
    const urlParams = new URLSearchParams();

    if (params.searchValue) urlParams.set("searchValue", params.searchValue);
    if (params.pageIndex)
      urlParams.set("pageIndex", params.pageIndex.toString());
    if (params.categoryId !== undefined && params.categoryId !== null)
      urlParams.set("categoryId", params.categoryId.toString());

    router.push(`?${urlParams.toString()}`, { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newParams: ProjectSearchRequest = {
      ...queryParams,
      pageIndex: 1,
      isActive: true,
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
    const newParams: ProjectSearchRequest = {
      ...queryParams,
      pageIndex: newPage,
      isActive: true,
    };
    setQueryParams(newParams);
    updateUrlParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    const resetParams: ProjectSearchRequest = {
      pageIndex: 1,
      pageSize: 12,
      searchValue: "",
      categoryId: queryParams.categoryId, // Keep categoryId if from URL
      isActive: true,
    };
    setQueryParams(resetParams);
    updateUrlParams(resetParams);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const projectsData = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.pageIndex || 1;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Có lỗi xảy ra khi tải dự án. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Category Image (if categoryId exists) */}
      <div className="relative h-[400px] overflow-hidden">
        {/* Background Image or Gradient */}
        {queryParams.categoryId && category?.image ? (
          <>
            <img 
              src={getValidImageUrl(category.image)} 
              alt={category.name}
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
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {category?.name || "Dự Án Của Chúng Tôi"}
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              Chất lượng là ưu tiên hàng đầu
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {category?.description || "Khám phá các dự án thi công thạch cao chuyên nghiệp"}
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
                    placeholder="Tìm kiếm theo tên dự án..."
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

        {/* Projects List Section - Centered */}
        <div className="w-full max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <span className="animate-spin h-8 w-8 border-4 border-brand-secondary border-t-transparent rounded-full mr-3"></span>
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {projectsData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={getValidImageUrl(project.thumbnail)}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {/* Category badge overlay */}
                          {project.categoryName && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-brand-secondary hover:bg-brand-secondary text-white">
                                {project.categoryName}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-brand-primary mb-3 group-hover:text-brand-secondary transition-colors line-clamp-2">
                            {project.name}
                          </h3>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            {project.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-brand-secondary shrink-0" />
                                <span className="line-clamp-1">{project.location}</span>
                              </div>
                            )}
                            {project.completedAt && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-secondary shrink-0" />
                                <span>{formatFullDateTime(project.completedAt)}</span>
                              </div>
                            )}
                          </div>
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
                  <p className="text-xl text-gray-600">Chưa có dự án nào được công bố.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsListPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Đang tải...</div>}>
      <ProjectsListContent />
    </Suspense>
  );
}
