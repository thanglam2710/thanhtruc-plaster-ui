"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProfileMutation } from "@/hooks/dashboard/staffs/useStaffs";
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary";
import { StaffDTO } from "@/types/dashboard/staffs";
import { toastSuccess, handleErrorApi } from "@/lib/utils/api";
import { Upload, X, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: StaffDTO;
  onSuccess?: () => void;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: EditProfileDialogProps) {
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadImageMutation = useUploadImage();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "0",
      dateOfBirth: "",
    },
  });

  // Reset form values when user changes or dialog opens
  useEffect(() => {
    if (user && open) {
      const genderValue = user.gender !== undefined && user.gender !== null 
        ? user.gender.toString() 
        : "0";
      
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        gender: genderValue,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      });
      
      // Force update gender field to ensure Select component updates
      setTimeout(() => {
        form.setValue('gender', genderValue);
      }, 0);
      
      setAvatarPreview(user.avatarUrl || "");
      setAvatarFile(null);
    }
  }, [user, open, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user.avatarUrl || "");
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user.id) return;

      let avatarUrl = user.avatarUrl;

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadResult = await uploadImageMutation.mutateAsync({
          image: avatarFile,
        });
        if (uploadResult?.secure_url) {
          avatarUrl = uploadResult.secure_url;
        }
      }

      await updateProfileMutation.mutateAsync({
        id: user.id,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        avatarUrl: avatarUrl,
        gender: values.gender ? parseInt(values.gender) : 0,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : undefined,
      });

      toastSuccess("Cập nhật hồ sơ thành công!");
      onOpenChange(false);
      
      // Trigger refetch if callback provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const isUploading = uploadImageMutation.isPending;
  const isSubmitting = updateProfileMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật hồ sơ</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin cá nhân của bạn tại đây.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-muted">
                  {avatarPreview && avatarPreview.trim() !== '' ? (
                    avatarPreview.startsWith('data:') ? (
                      // Use regular img for data URLs (file preview)
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : avatarPreview.startsWith('http://') || avatarPreview.startsWith('https://') ? (
                      // Use Next Image for remote URLs
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploading || isSubmitting}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    disabled={isUploading || isSubmitting}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {avatarPreview && avatarPreview.trim() !== '' ? "Đổi ảnh" : "Chọn ảnh"}
                  </Button>
                  {avatarFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeAvatar}
                      disabled={isUploading || isSubmitting}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-1" /> Xóa ảnh đã chọn
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      key={`gender-${user.id}-${field.value}`}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Nam</SelectItem>
                        <SelectItem value="2">Nữ</SelectItem>
                        <SelectItem value="3">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUploading || isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUploading || isSubmitting}>
                {isUploading && (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải ảnh...
                  </>
                )}
                {!isUploading && isSubmitting && (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                )}
                {!isUploading && !isSubmitting && "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
