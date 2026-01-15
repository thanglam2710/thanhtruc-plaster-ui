"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ArrowLeft, Pencil, Save, X } from "lucide-react";
import {
  useGetBlogTypeById,
  useUpdateBlogTypeMutation,
} from "@/hooks/dashboard/blogs/useBlogs";
import { toastSuccess, handleErrorApi } from "@/lib/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

const blogTypeSchema = z.object({
  name: z.string().min(2, { message: "Tên loại bài viết phải có ít nhất 2 ký tự" }),
});

type BlogTypeFormValues = z.infer<typeof blogTypeSchema>;

export default function BlogTypeDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, error } = useGetBlogTypeById(id);
  const updateMutation = useUpdateBlogTypeMutation();

  const form = useForm<BlogTypeFormValues>({
    resolver: zodResolver(blogTypeSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({ name: data.name });
    }
  }, [data, form]);

  const onSubmit = async (values: BlogTypeFormValues) => {
    try {
      await updateMutation.mutateAsync({ id, ...values });
      toastSuccess("Cập nhật loại bài viết thành công");
      setIsEditing(false);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleCancel = () => {
    form.reset({ name: data?.name || "" });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy loại bài viết</h2>
          <Button onClick={() => router.push("/dashboard/blog-types")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const blogType = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{blogType.name}</h1>
          <p className="text-muted-foreground">Chi tiết loại bài viết</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin loại bài viết</CardTitle>
          <CardDescription>
            {isEditing ? "Chỉnh sửa thông tin" : "Xem thông tin chi tiết"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
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
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <>Đang lưu...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên</p>
                <p className="text-lg">{blogType.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="text-lg text-muted-foreground">{blogType.slug}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
