"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, ImageIcon, X } from "lucide-react";
import { useCreateBlogMutation, useGetAllBlogTypes } from "@/hooks/dashboard/blogs/useBlogs";
import { toastSuccess, handleErrorApi } from "@/lib/utils/api";
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TinyMCEEditor = dynamic(() => import("@/components/dashboard/tinymce-editor"), {
  ssr: false,
  loading: () => <div className="min-h-[400px] border rounded-md flex items-center justify-center">Đang tải editor...</div>
});

const blogSchema = z.object({
  title: z.string().min(2, { message: "Tiêu đề phải có ít nhất 2 ký tự" }),
  summary: z.string().optional(),
  content: z.string().optional(),
  thumbnail: z.string().optional(),
  isPublished: z.boolean(),
  blogTypeId: z.number().min(1, { message: "Vui lòng chọn loại bài viết" }),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const createMutation = useCreateBlogMutation();
  const uploadImage = useUploadImage();
  const { data: blogTypes } = useGetAllBlogTypes();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      thumbnail: "",
      isPublished: true,
      blogTypeId: undefined as any,
    },
  });

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    try {
      const result = await uploadImage.mutateAsync({ image: file });
      if (result?.secure_url) {
        setThumbnailUrl(result.secure_url);
        form.setValue("thumbnail", result.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload ảnh thất bại");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailUrl(null);
    form.setValue("thumbnail", "");
  };

  const onSubmit = async (values: BlogFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toastSuccess("Tạo bài viết thành công");
      router.push("/dashboard/blogs");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo bài viết mới</h1>
          <p className="text-muted-foreground">Thêm bài viết mới vào hệ thống</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin bài viết</CardTitle>
          <CardDescription>Nhập thông tin cho bài viết mới</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề bài viết..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blogTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại bài viết *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ""}
                      defaultValue=""
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại bài viết" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {blogTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tóm tắt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập tóm tắt ngắn gọn..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Tóm tắt ngắn gọn về nội dung bài viết
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ảnh đại diện</label>
                {thumbnailUrl ? (
                  <div className="relative w-full max-w-md">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveThumbnail}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingThumbnail}
                      onClick={() => document.getElementById("thumbnail-input")?.click()}
                    >
                      {isUploadingThumbnail ? "Đang upload..." : "Chọn ảnh"}
                    </Button>
                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <TinyMCEEditor
                        data={field.value || ""}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Nội dung chi tiết của bài viết
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Xuất bản ngay
                      </FormLabel>
                      <FormDescription>
                        Bài viết sẽ hiển thị công khai sau khi tạo
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>Đang lưu...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Tạo bài viết
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
