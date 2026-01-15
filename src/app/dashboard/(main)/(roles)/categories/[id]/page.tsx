"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { ArrowLeft, Pencil, Save, X, Upload, ListFilter } from "lucide-react";
import {
  useGetCategoryById,
  useUpdateCategoryMutation,
  useGetAllCategories
} from "@/hooks/dashboard/categories/useCategories";
import { CategoryDTO } from "@/types/dashboard/categories";
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary";
import { toastSuccess, handleErrorApi } from "@/lib/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const categorySchema = z.object({
  name: z.string().min(2, { message: "Tên danh mục phải có ít nhất 2 ký tự" }),
  description: z.string().optional(),
  parentId: z.number().optional(),
  isActive: z.boolean(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || !(file instanceof File)) return true;
        return file.size <= MAX_FILE_SIZE;
      },
      { message: "Dung lượng ảnh phải nhỏ hơn 5MB" }
    )
    .refine(
      (file) => {
        if (!file || !(file instanceof File)) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      { message: "Chỉ hỗ trợ JPG, PNG, WebP" }
    ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useGetCategoryById(id);
  const updateMutation = useUpdateCategoryMutation();
  const uploadImage = useUploadImage();
  const { data: allCategories } = useGetAllCategories();

  // Filter for potential parent categories (those without a parent)
  // Also exclude current category from being its own parent
  const parentCategories = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter((c: CategoryDTO) => !c.parentId && c.id !== id);
  }, [allCategories, id]);

  // Filter based on search term in dialog
  const filteredParents = useMemo(() => {
    if (!searchTerm) return parentCategories;
    return parentCategories.filter((c: CategoryDTO) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parentCategories, searchTerm]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      parentId: undefined,
    },
  });

  const selectedParentId = form.watch("parentId");
  const selectedParent = parentCategories.find(c => c.id === selectedParentId);

  // Update form when data loads
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        name: data.name,
        description: data.description || "",
        isActive: data.isActive,
        parentId: data.parentId,
      });
      // Only set preview if we have valid image URL
      if (data.image && data.image.startsWith('http')) {
        setPreviewUrl(data.image);
      }
      setImageRemoved(false);
    }
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("image", file, { shouldValidate: true });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    form.setValue("image", undefined);
    setPreviewUrl(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      let imageUrl: string | undefined = data?.image;

      // If image was removed, set to undefined
      if (imageRemoved) {
        imageUrl = undefined;
      }
      
      // Upload new image if changed
      if (values.image instanceof File) {
        setIsUploadingImage(true);
        const uploadResult = await uploadImage.mutateAsync({ image: values.image });
        if (!uploadResult) {
          throw new Error("Upload ảnh lên Cloudinary thất bại");
        }
        imageUrl = uploadResult.secure_url;
        setIsUploadingImage(false);
      }

      await updateMutation.mutateAsync({
        id,
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        parentId: values.parentId,
        image: imageUrl,
      });

      toastSuccess("Cập nhật danh mục thành công");
      setIsEditing(false);
    } catch (error) {
      setIsUploadingImage(false);
      handleErrorApi({ error });
    }
  };

  const handleCancel = () => {
    form.reset({
      name: data?.name || "",
      description: data?.description || "",
      isActive: data?.isActive ?? true,
      parentId: data?.parentId,
    });
    // Reset preview to original image
    if (data?.image && data.image.startsWith('http')) {
      setPreviewUrl(data.image);
    } else {
      setPreviewUrl(null);
    }
    setImageRemoved(false);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy danh mục</h2>
          <Button onClick={() => router.push("/dashboard/categories")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const category = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">Chi tiết danh mục</p>
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
          <CardTitle>Thông tin danh mục</CardTitle>
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
                      <FormLabel>Tên danh mục *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Trần thạch cao..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục cha (Tùy chọn)</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input 
                            value={selectedParent ? selectedParent.name : "Không có (Là danh mục gốc)"} 
                            disabled 
                            className={!selectedParent ? "text-muted-foreground italic" : "font-medium"}
                          />
                        </FormControl>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline">Chọn</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Chọn danh mục cha</DialogTitle>
                              <DialogDescription>
                                Tìm kiếm và chọn một danh mục cha từ danh sách bên dưới.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                              <Input
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <div className="max-h-[300px] overflow-y-auto border rounded-md p-2 space-y-1">
                                <div 
                                  className={`p-2 rounded-md cursor-pointer hover:bg-muted ${!selectedParentId ? "bg-muted font-medium" : ""}`}
                                  onClick={() => {
                                    form.setValue("parentId", undefined);
                                    setIsDialogOpen(false);
                                  }}
                                >
                                  Không có (Là danh mục gốc)
                                </div>
                                {filteredParents.map((parent: CategoryDTO) => (
                                  <div
                                    key={parent.id}
                                    className={`p-2 rounded-md cursor-pointer hover:bg-muted ${parent.id === selectedParentId ? "bg-muted font-medium" : ""}`}
                                    onClick={() => {
                                      form.setValue("parentId", parent.id);
                                      setIsDialogOpen(false);
                                    }}
                                  >
                                    {parent.name}
                                  </div>
                                ))}
                                {filteredParents.length === 0 && (
                                  <p className="text-center text-muted-foreground p-4">Không tìm thấy danh mục nào</p>
                                )}
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Đóng</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {selectedParentId && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => form.setValue("parentId", undefined)}
                            title="Xóa lựa chọn"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormDescription>
                        Nếu chọn danh mục cha, danh mục này sẽ trở thành danh mục con.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả về danh mục..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Hình ảnh</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {previewUrl && (previewUrl.startsWith('http') || previewUrl.startsWith('blob:')) ? (
                            <div className="relative w-full max-w-md">
                              <div className="relative h-48 w-full border rounded-lg overflow-hidden">
                                <Image
                                  src={previewUrl}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleRemoveImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click để chọn ảnh
                              </p>
                            </div>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kích hoạt</FormLabel>
                        <FormDescription>
                          Danh mục sẽ hiển thị trên website
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || isUploadingImage}
                  >
                    {updateMutation.isPending || isUploadingImage ? (
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
              {category.image && category.image.startsWith('http') && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Hình ảnh</p>
                  <div className="relative h-48 w-full max-w-md border rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên</p>
                <p className="text-lg">{category.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <p className="text-lg text-muted-foreground">{category.slug}</p>
              </div>
              {category.parentName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Danh mục cha</p>
                  <p className="text-lg font-medium text-blue-600">{category.parentName}</p>
                </div>
              )}
              {category.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                  <p className="text-lg">{category.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <p className="text-lg">{category.isActive ? "Kích hoạt" : "Không kích hoạt"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
