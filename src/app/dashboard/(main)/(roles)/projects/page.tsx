"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, CirclePlus, Eye, ImageIcon, Star, Trash2 } from "lucide-react";
import TablePagination from "@/components/dashboard/table-pagination";
import { useGetProjectsPagination, useDeleteProjectMutation } from "@/hooks/dashboard/projects/useProjects";
import { useGetAllCategories } from "@/hooks/dashboard/categories/useCategories";
import type { SearchProjectRequest } from "@/types/dashboard/projects";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toastSuccess } from "@/lib/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatFullDateTime } from "@/lib/utils";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<SearchProjectRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 10,
    searchValue: searchParams.get("searchValue") || "",
  });
  const [searchTerm, setSearchTerm] = useState(queryParams.searchValue || "");

  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");
    const isActive = searchParams.get("isActive");
    
    setSearchTerm(searchValue);
    
    setQueryParams(prev => ({
      ...prev,
      pageIndex: Number(searchParams.get("pageIndex")) || 1,
      searchValue: searchValue,
      categoryId: categoryId ? Number(categoryId) : undefined,
      isFeatured: isFeatured === "true" ? true : isFeatured === "false" ? false : undefined,
      isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
    }));
  }, [searchParams]);

  const { data, isLoading, error } = useGetProjectsPagination(queryParams);
  const deleteMutation = useDeleteProjectMutation();
  const { data: categories } = useGetAllCategories();

  // Filter to get only child categories (categories with parentId)
  const leafCategories = useMemo(() => {
    if (!categories) return [];
    
    // Only show child categories (categories with parentId)
    return categories.filter(cat => cat.parentId !== null && cat.parentId !== undefined);
  }, [categories]);

  const updateUrlParams = (newParams: SearchProjectRequest) => {
    const urlParams = new URLSearchParams();
    if (newParams.searchValue) urlParams.set("searchValue", newParams.searchValue);
    if (newParams.pageIndex) urlParams.set("pageIndex", newParams.pageIndex.toString());
    if (newParams.categoryId) urlParams.set("categoryId", newParams.categoryId.toString());
    if (newParams.isFeatured !== undefined) urlParams.set("isFeatured", newParams.isFeatured.toString());
    if (newParams.isActive !== undefined) urlParams.set("isActive", newParams.isActive.toString());
    router.push(`?${urlParams.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = { ...queryParams, pageIndex: 1, searchValue: searchTerm };
    setQueryParams(newParams);
    updateUrlParams(newParams);
  };

  const handleReset = () => {
    setSearchTerm("");
    const resetParams: SearchProjectRequest = {
      pageIndex: 1,
      pageSize: 10,
      searchValue: "",
    };
    setQueryParams(resetParams);
    updateUrlParams(resetParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, pageIndex: page };
    setQueryParams(newParams);
    updateUrlParams(newParams);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toastSuccess("Xóa dự án thành công");
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-6">Có lỗi xảy ra, vui lòng thử lại sau.</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  const projects = data?.items || [];
  const totalRecords = data?.totalRecords || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dự án</h1>
          <p className="text-muted-foreground">Quản lý dự án</p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button>
            <CirclePlus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        </Link>
      </div>

      {/* Search & Filter Form */}
      <div className="bg-white border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="searchValue"
                placeholder="Tìm kiếm dự án..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={queryParams.categoryId?.toString() || "all"}
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  categoryId: value === "all" ? undefined : Number(value),
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {leafCategories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.parentName ? `${cat.parentName} > ${cat.name}` : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                queryParams.isFeatured === undefined
                  ? "all"
                  : queryParams.isFeatured
                  ? "true"
                  : "false"
              }
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  isFeatured: value === "all" ? undefined : value === "true",
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Nổi bật" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Nổi bật</SelectItem>
                <SelectItem value="false">Thường</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                queryParams.isActive === undefined
                  ? "all"
                  : queryParams.isActive
                  ? "true"
                  : "false"
              }
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  isActive: value === "all" ? undefined : value === "true",
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Tìm kiếm</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Đặt lại
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
      ) : projects.length > 0 ? (
        <>
          <p className="text-muted-foreground">
            Hiển thị {projects.length} kết quả trong tổng số {totalRecords} dự án
          </p>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">STT</TableHead>
                  <TableHead className="text-center">Hình ảnh</TableHead>
                  <TableHead className="text-center">Tên dự án</TableHead>
                  <TableHead className="text-center">Danh mục</TableHead>
                  <TableHead className="text-center">Địa điểm</TableHead>
                  <TableHead className="text-center">Hoàn thành</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="w-[150px] text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: any, index: number) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium text-center">
                      {(queryParams.pageIndex! - 1) * queryParams.pageSize! + index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {project.thumbnail && 
                      project.thumbnail.startsWith('http') ? (
                        <div className="relative h-12 w-12 mx-auto">
                          <Image
                            src={project.thumbnail}
                            alt={project.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted mx-auto">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate text-center">
                      <div className="flex items-center gap-2 justify-center">
                        {project.name}
                        {project.isFeatured && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge variant="outline">{project.categoryName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">{project.location || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-center">{project.completedAt ? formatFullDateTime(project.completedAt) : "-"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {project.isActive ? (
                          <Badge variant="default" className="bg-green-600">Hoạt động</Badge>
                        ) : (
                          <Badge variant="secondary">Ẩn</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1">
                        <div className="bg-gray-50 border rounded-md p-1">
                          <Link href={`/dashboard/projects/${project.id}`}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="w-full justify-center h-8 hover:bg-gray-100"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-xs">Xem chi tiết</span>
                            </Button>
                          </Link>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-1">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="w-full justify-center h-8 hover:bg-gray-100"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5 text-destructive" />
                                <span className="text-xs text-destructive">Xóa dữ liệu</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa dự án "{project.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(project.id)}>
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data && data.totalPages > 1 && (
            <TablePagination
              totalPages={data.totalPages}
              currentPage={data.pageIndex}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-4">Không tìm thấy dự án nào</p>
          <Link href="/dashboard/projects/create">
            <Button>
              <CirclePlus className="mr-2 h-4 w-4" />
              Tạo mới
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
