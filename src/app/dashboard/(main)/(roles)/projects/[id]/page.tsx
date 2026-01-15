"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ArrowLeft, Pencil, Save, X, ImageIcon, Star, MapPin, Calendar } from "lucide-react";
import {
  useGetProjectById,
  useUpdateProjectMutation,
} from "@/hooks/dashboard/projects/useProjects";
import { useGetAllCategories } from "@/hooks/dashboard/categories/useCategories";
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
import MultiImageUpload from "@/components/dashboard/multi-image-upload";

const TinyMCEEditor = dynamic(() => import("@/components/dashboard/tinymce-editor"), {
  ssr: false,
  loading: () => <div className="min-h-[400px] border rounded-md flex items-center justify-center">Đang tải editor...</div>
});

const projectSchema = z.object({
  name: z.string().min(2, { message: "Tên dự án phải có ít nhất 2 ký tự" }),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  location: z.string().optional(),
  completedAt: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  categoryId: z.number().min(1, { message: "Vui lòng chọn danh mục" }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const { data, isLoading, error } = useGetProjectById(id);
  const updateMutation = useUpdateProjectMutation();
  const uploadImage = useUploadImage();
  const { data: categories } = useGetAllCategories();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      thumbnail: "",
      gallery: [],
      description: "",
      content: "",
      location: "",
      completedAt: "",
      isFeatured: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        name: data.name,
        thumbnail: data.thumbnail || "",
        gallery: data.gallery || [],
        description: data.description || "",
        content: data.content || "",
        location: data.location || "",
        completedAt: data.completedAt || "",
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        categoryId: data.categoryId,
      });
      if (data.thumbnail && data.thumbnail.startsWith('http')) {
        setThumbnailUrl(data.thumbnail);
      }
    }
  }, [data, form]);

  // Filter to get only leaf categories (categories without children)
  const leafCategories = useMemo(() => {
    if (!categories) return [];
    
    // Only show child categories (categories with parentId)
    return categories.filter(cat => cat.parentId !== null && cat.parentId !== undefined);
  }, [categories]);

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

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      await updateMutation.mutateAsync({ id, ...values });
      toastSuccess("Cập nhật dự án thành công");
      setIsEditing(false);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleCancel = () => {
    form.reset({
      name: data?.name || "",
      thumbnail: data?.thumbnail || "",
      gallery: data?.gallery || [],
      description: data?.description || "",
      content: data?.content || "",
      location: data?.location || "",
      completedAt: data?.completedAt || "",
      isFeatured: data?.isFeatured || false,
      isActive: data?.isActive || true,
      categoryId: data?.categoryId,
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
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy dự án</h2>
          <Button onClick={() => router.push("/dashboard/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const project = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {project.name}
            {project.isFeatured && (
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            )}
          </h1>
          <p className="text-muted-foreground">Chi tiết dự án</p>
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
          <CardTitle>Thông tin dự án</CardTitle>
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
                      <FormLabel>Tên dự án *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên dự án..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leafCategories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.parentName ? `${cat.parentName} > ${cat.name}` : cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa điểm</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: Quận 7, TP.HCM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="completedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm hoàn thành</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập mô tả ngắn gọn..." 
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
                  name="gallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thư viện ảnh</FormLabel>
                      <FormControl>
                        <MultiImageUpload
                          images={field.value || []}
                          onChange={field.onChange}
                          maxImages={20}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload nhiều ảnh cho dự án (tối đa 20 ảnh)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung chi tiết</FormLabel>
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

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Dự án nổi bật</FormLabel>
                          <FormDescription>
                            Hiển thị ở trang chủ
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Hoạt động</FormLabel>
                          <FormDescription>
                            Hiển thị công khai
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

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
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Danh mục</p>
                  <Badge variant="outline" className="mt-1">{project.categoryName}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <div className="flex gap-2 mt-1">
                    {project.isActive ? (
                      <Badge variant="default" className="bg-green-600">Hoạt động</Badge>
                    ) : (
                      <Badge variant="secondary">Ẩn</Badge>
                    )}
                    {project.isFeatured && (
                      <Badge variant="default" className="bg-yellow-600">Nổi bật</Badge>
                    )}
                  </div>
                </div>
                {project.location && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Địa điểm</p>
                    <p className="text-lg flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </p>
                  </div>
                )}
                {project.completedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Năm hoàn thành</p>
                    <p className="text-lg flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {project.completedAt}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="text-sm text-muted-foreground mt-1">{project.slug}</p>
                </div>
              </div>

              {/* Thumbnail */}
              {project.thumbnail && project.thumbnail.startsWith('http') && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Ảnh đại diện</p>
                  <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Thư viện ảnh ({project.gallery.length} ảnh)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {project.gallery.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả</p>
                  <p className="text-base">{project.description}</p>
                </div>
              )}

              {/* Content */}
              {project.content && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Nội dung chi tiết</p>
                  <div 
                    className="prose max-w-none border rounded-lg p-6"
                    dangerouslySetInnerHTML={{ __html: project.content }}
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
