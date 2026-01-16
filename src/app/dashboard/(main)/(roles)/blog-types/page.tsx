"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Search, CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import TablePagination from "@/components/dashboard/table-pagination";
import { useGetBlogTypesPagination, useDeleteBlogTypeMutation } from "@/hooks/dashboard/blogs/useBlogs";
import type { SearchPaginationRequest } from "@/types/dashboard/search-params";
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

function BlogTypesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<SearchPaginationRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 10,
    searchValue: searchParams.get("searchValue") || "",
  });
  const [searchTerm, setSearchTerm] = useState(queryParams.searchValue || "");

  // Sync queryParams with URL searchParams when URL changes
  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    setSearchTerm(searchValue);
    
    setQueryParams(prev => ({
      ...prev,
      pageIndex: Number(searchParams.get("pageIndex")) || 1,
      searchValue: searchValue
    }));
  }, [searchParams]);

  const { data, isLoading, error } = useGetBlogTypesPagination(queryParams);
  const deleteMutation = useDeleteBlogTypeMutation();

  const updateUrlParams = (newParams: SearchPaginationRequest) => {
    const urlParams = new URLSearchParams();
    if (newParams.searchValue) urlParams.set("searchValue", newParams.searchValue);
    if (newParams.pageIndex) urlParams.set("pageIndex", newParams.pageIndex.toString());
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
    const resetParams: SearchPaginationRequest = {
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
      toastSuccess("Xóa loại bài viết thành công");
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

  const blogTypes = data?.items || [];
  const totalRecords = data?.totalRecords || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loại bài viết</h1>
          <p className="text-muted-foreground">Quản lý các loại bài viết</p>
        </div>
        <Link href="/dashboard/blog-types/create">
          <Button>
            <CirclePlus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        </Link>
      </div>

      {/* Search Form */}
      <div className="bg-white border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="searchValue"
              placeholder="Tìm kiếm loại bài viết..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Đặt lại
          </Button>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
      ) : blogTypes.length > 0 ? (
        <>
          <p className="text-muted-foreground">
            Hiển thị {blogTypes.length} kết quả trong tổng số {totalRecords} loại bài viết
          </p>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">STT</TableHead>
                  <TableHead className="text-center">Tên</TableHead>
                  <TableHead className="text-center">Slug</TableHead>
                  <TableHead className="w-[150px] text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogTypes.map((blogType: any, index: number) => (
                  <TableRow key={blogType.id}>
                    <TableCell className="font-medium text-center">
                      {(queryParams.pageIndex! - 1) * queryParams.pageSize! + index + 1}
                    </TableCell>
                    <TableCell className="text-center">{blogType.name}</TableCell>
                    <TableCell className="text-muted-foreground text-center">{blogType.slug}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1">
                        <div className="bg-gray-50 border rounded-md p-1">
                          <Link href={`/dashboard/blog-types/${blogType.id}`}>
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
                                  Bạn có chắc chắn muốn xóa loại bài viết "{blogType.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(blogType.id)}>
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
          <p className="text-xl font-medium mb-4">Không tìm thấy loại bài viết nào</p>
          <Link href="/dashboard/blog-types/create">
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

export default function BlogTypesPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <BlogTypesContent />
    </Suspense>
  );
}