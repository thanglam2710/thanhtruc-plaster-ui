"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { useCreateBlogTypeMutation } from "@/hooks/dashboard/blogs/useBlogs";
import { toastSuccess } from "@/lib/utils/api";
import { handleErrorApi } from "@/lib/utils/api";
import { CacheKeys } from "@/hooks/base/cacheKey";

const blogTypeSchema = z.object({
  name: z.string().min(2, { message: "Tên loại bài viết phải có ít nhất 2 ký tự" }),
});

type BlogTypeFormValues = z.infer<typeof blogTypeSchema>;

export default function CreateBlogTypePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useCreateBlogTypeMutation();

  const form = useForm<BlogTypeFormValues>({
    resolver: zodResolver(blogTypeSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: BlogTypeFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      // Manually invalidate cache to ensure refetch
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const firstPart = query.queryKey[0];
          return typeof firstPart === "string" && firstPart.startsWith(CacheKeys.BlogTypes);
        }
      });
      toastSuccess("Tạo loại bài viết thành công");
      router.push("/dashboard/blog-types");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo loại bài viết mới</h1>
          <p className="text-muted-foreground">Thêm loại bài viết mới vào hệ thống</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin loại bài viết</CardTitle>
          <CardDescription>Nhập thông tin cho loại bài viết mới</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên loại bài viết *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Tin tức, Sự kiện..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>Đang tạo...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Tạo mới
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Hủy
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
