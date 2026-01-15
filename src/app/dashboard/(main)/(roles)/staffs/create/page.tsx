"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useCreateStaffMutation } from "@/hooks/dashboard/staffs/useStaffs";
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary";
import { toastSuccess } from "@/lib/utils/api";
import Image from "next/image";

const staffSchema = z.object({
  fullName: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export default function CreateStaffPage() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const createMutation = useCreateStaffMutation();
  const uploadImage = useUploadImage();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      avatarUrl: "",
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const result = await uploadImage.mutateAsync({ image: file });
      if (result?.secure_url) {
        setAvatarUrl(result.secure_url);
        form.setValue("avatarUrl", result.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    form.setValue("avatarUrl", "");
  };

  const onSubmit = async (data: StaffFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      toastSuccess("Tạo nhân viên thành công");
      router.push("/dashboard/staffs");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staffs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo nhân viên mới</h1>
          <p className="text-muted-foreground">Thêm nhân viên quản trị mới vào hệ thống</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar</label>
                {avatarUrl ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      fill
                      className="object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingAvatar ? "Đang tải lên..." : "Tải lên avatar"}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                    />
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Đang tạo..." : "Tạo nhân viên"}
                </Button>
                <Link href="/dashboard/staffs">
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
