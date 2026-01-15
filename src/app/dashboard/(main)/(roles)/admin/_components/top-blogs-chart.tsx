"use client";

import { useGetTopViewBlogs } from "@/hooks/dashboard/dashboard/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function TopBlogsChart() {
  const { data, isLoading, error } = useGetTopViewBlogs();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bài viết được xem nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.resultObj || data.resultObj.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bài viết được xem nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chưa có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  const blogs = data.resultObj;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bài viết được xem nhiều nhất</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {blog.imageUrl ? (
                <div className="relative h-12 w-12 shrink-0">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted shrink-0">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{blog.title}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{blog.viewCount} lượt xem</span>
                  <span>•</span>
                  <span>
                    {format(new Date(blog.createdDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
