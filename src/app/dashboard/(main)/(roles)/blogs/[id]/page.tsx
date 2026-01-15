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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Pencil, Save, X, ImageIcon, Eye } from "lucide-react";
import {
  useGetBlogById,
  useUpdateBlogMutation,
  useGetAllBlogTypes,
} from "@/hooks/dashboard/blogs/useBlogs";
import { toastSuccess, handleErrorApi } from "@/lib/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function BlogDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const { data, isLoading, error } = useGetBlogById(id);
  const updateMutation = useUpdateBlogMutation();
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
    },
  });

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        summary: data.summary || "",
        content: data.content || "",
        thumbnail: data.thumbnail || "",
        isPublished: data.isPublished,
        blogTypeId: data.blogTypeId,
      });
      if (data.thumbnail && data.thumbnail.startsWith('http')) {
        setThumbnailUrl(data.thumbnail);
      }
    }
  }, [data, form]);

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
      await updateMutation.mutateAsync({ id, ...values });
      toastSuccess("Cập nhật bài viết thành công");
      setIsEditing(false);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleCancel = () => {
    form.reset({
      title: data?.title || "",
      summary: data?.summary || "",
      content: data?.content || "",
      thumbnail: data?.thumbnail || "",
      isPublished: data?.isPublished || true,
      blogTypeId: data?.blogTypeId,
    });
    setThumbnailUrl(data?.thumbnail || null);
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
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy bài viết</h2>
          <Button onClick={() => router.push("/dashboard/blogs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const blog = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{blog.title}</h1>
          <p className="text-muted-foreground">Chi tiết bài viết</p>
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
          <CardTitle>Thông tin bài viết</CardTitle>
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
                        <FormLabel>Xuất bản</FormLabel>
                        <FormDescription>
                          Bài viết sẽ hiển thị công khai
                        </FormDescription>
                      </div>
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
            <div className="space-y-6">
              {/* Author Info */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar>
                  <AvatarImage src={blog.authorAvatar} />
                  <AvatarFallback>{blog.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Tác giả</p>
                  <p className="text-lg">{blog.authorName}</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loại bài viết</p>
                  <Badge variant="outline" className="mt-1">{blog.blogTypeName}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  {blog.isPublished ? (
                    <Badge variant="default" className="bg-green-600 mt-1">Đã xuất bản</Badge>
                  ) : (
                    <Badge variant="secondary" className="mt-1">Nháp</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lượt xem</p>
                  <p className="text-lg flex items-center gap-2 mt-1">
                    <Eye className="h-4 w-4" />
                    {blog.viewCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="text-sm text-muted-foreground mt-1">{blog.slug}</p>
                </div>
              </div>

              {/* Thumbnail */}
              {blog.thumbnail && blog.thumbnail.startsWith('http') && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Ảnh đại diện</p>
                  <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Summary */}
              {blog.summary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tóm tắt</p>
                  <p className="text-base">{blog.summary}</p>
                </div>
              )}

              {/* Content */}
              {blog.content && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Nội dung</p>
                  <div 
                    className="prose max-w-none border rounded-lg p-6"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
