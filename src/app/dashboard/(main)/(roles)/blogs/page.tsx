"use client";

import { useState, Suspense, useEffect } from "react";
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
import { Search, CirclePlus, Eye, ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import TablePagination from "@/components/dashboard/table-pagination";
import { useGetBlogsPagination, useDeleteBlogMutation, useGetAllBlogTypes } from "@/hooks/dashboard/blogs/useBlogs";
import type { SearchBlogRequest } from "@/types/dashboard/blogs";
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
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function BlogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<SearchBlogRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 10,
    searchValue: searchParams.get("searchValue") || "",
  });
  const [searchTerm, setSearchTerm] = useState(queryParams.searchValue || "");

  // Sync queryParams with URL searchParams when URL changes
  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const blogTypeId = searchParams.get("blogTypeId");
    const isPublished = searchParams.get("isPublished");
    
    setSearchTerm(searchValue);
    
    setQueryParams(prev => ({
      ...prev,
      pageIndex: Number(searchParams.get("pageIndex")) || 1,
      searchValue: searchValue,
      blogTypeId: blogTypeId ? Number(blogTypeId) : undefined,
      isPublished: isPublished === "true" ? true : isPublished === "false" ? false : undefined,
    }));
  }, [searchParams]);

  const { data, isLoading, error } = useGetBlogsPagination(queryParams);
  const deleteMutation = useDeleteBlogMutation();
  const { data: blogTypes } = useGetAllBlogTypes();

  const updateUrlParams = (newParams: SearchBlogRequest) => {
    const urlParams = new URLSearchParams();
    if (newParams.searchValue) urlParams.set("searchValue", newParams.searchValue);
    if (newParams.pageIndex) urlParams.set("pageIndex", newParams.pageIndex.toString());
    if (newParams.blogTypeId) urlParams.set("blogTypeId", newParams.blogTypeId.toString());
    if (newParams.isPublished !== undefined) urlParams.set("isPublished", newParams.isPublished.toString());
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
    const resetParams: SearchBlogRequest = {
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
      toastSuccess("Xóa bài viết thành công");
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

  const blogs = data?.items || [];
  const totalRecords = data?.totalRecords || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bài viết</h1>
          <p className="text-muted-foreground">Quản lý bài viết</p>
        </div>
        <Link href="/dashboard/blogs/create">
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
                placeholder="Tìm kiếm bài viết..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={queryParams.blogTypeId?.toString() || "all"}
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  blogTypeId: value === "all" ? undefined : Number(value),
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại bài viết" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {blogTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                queryParams.isPublished === undefined
                  ? "all"
                  : queryParams.isPublished
                  ? "true"
                  : "false"
              }
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  isPublished: value === "all" ? undefined : value === "true",
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đã xuất bản</SelectItem>
                <SelectItem value="false">Nháp</SelectItem>
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
      ) : blogs.length > 0 ? (
        <>
          <p className="text-muted-foreground">
            Hiển thị {blogs.length} kết quả trong tổng số {totalRecords} bài viết
          </p>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">STT</TableHead>
                  <TableHead className="text-center">Hình ảnh</TableHead>
                  <TableHead className="text-center">Tiêu đề</TableHead>
                  <TableHead className="text-center">Loại</TableHead>
                  <TableHead className="text-center">Tác giả</TableHead>
                  <TableHead className="text-center">Lượt xem</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="w-[150px] text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog: any, index: number) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium text-center">
                      {(queryParams.pageIndex! - 1) * queryParams.pageSize! + index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {blog.thumbnail && 
                       blog.thumbnail.startsWith('http') ? (
                        <div className="relative h-12 w-12 mx-auto">
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
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
                    <TableCell className="font-medium max-w-xs truncate text-center">{blog.title}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge variant="outline">{blog.blogTypeName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">{blog.authorName}</TableCell>
                    <TableCell className="text-center">{blog.viewCount}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {blog.isPublished ? (
                          <Badge variant="default" className="bg-green-600">Đã xuất bản</Badge>
                        ) : (
                          <Badge variant="secondary">Nháp</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1">
                        <div className="bg-gray-50 border rounded-md p-1">
                          <Link href={`/dashboard/blogs/${blog.id}`}>
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
                                  Bạn có chắc chắn muốn xóa bài viết "{blog.title}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(blog.id)}>
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
          <p className="text-xl font-medium mb-4">Không tìm thấy bài viết nào</p>
          <Link href="/dashboard/blogs/create">
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

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <BlogsContent />
    </Suspense>
  );
}