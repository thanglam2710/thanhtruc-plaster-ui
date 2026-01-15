"use client";

import { useEffect, useState } from "react";
import { useGetStaffById } from "@/hooks/dashboard/staffs/useStaffs";
import { getStaff } from "@/lib/providers/auth-provider";
import { LoginResponse } from "@/types/dashboard/auth-model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, Mail, Phone, Calendar, Shield } from "lucide-react";
import Image from "next/image";
import { UserStatus } from "@/types/enums";

import { EditProfileDialog } from "./edit-profile-dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<LoginResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getStaff());
  }, []);

  const { data: staff, isLoading, error } = useGetStaffById(currentUser?.id || "");

  // ... (Keep existing Loading/Error states)
  if (isLoading || !currentUser) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground">Không thể tải thông tin hồ sơ.</p>
      </div>
    );
  }

  // Helper to display status badge
  const getStatusBadge = (status: UserStatus | string) => {
    if (status === UserStatus.Active || status === "Active" || status === "Đang hoạt động") {
      return <Badge className="bg-green-600">Đang hoạt động</Badge>;
    }
    return <Badge variant="outline">{staff.statusName || "Không xác định"}</Badge>;
  };

  const getGenderText = (gender?: number) => {
    switch(gender) {
        case 1: return "Nam";
        case 2: return "Nữ";
        case 3: return "Khác";
        default: return "Chưa cập nhật";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
           <p className="text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
        </div>
        <Button onClick={() => setEditOpen(true)}>
            <Edit className="w-4 h-4 mr-2" /> Cập nhật
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {staff.avatarUrl && staff.avatarUrl.startsWith('http') ? (
                <div className="relative h-32 w-32 shrink-0">
                  <Image
                    src={staff.avatarUrl}
                    alt={staff.fullName}
                    fill
                    className="object-cover rounded-full border-4 border-muted"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-muted border-4 border-muted">
                  <UserIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              
              <div className="text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-bold">{staff.fullName}</h2>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                   <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {staff.roleName}
                   </Badge>
                   {getStatusBadge(staff.status)}
                </div>
                <p className="text-muted-foreground text-sm max-w-md">
                  Chào mừng trở lại! Đây là trang hồ sơ cá nhân của bạn.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-6 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <p className="text-base font-medium">{staff.email}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Số điện thoại
                </label>
                <p className="text-base font-medium">{staff.phoneNumber || "Chưa cập nhật"}</p>
              </div>

               <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Ngày sinh
                </label>
                <p className="text-base font-medium">
                  {staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Giới tính
                </label>
                <p className="text-base font-medium">
                  {getGenderText(staff.gender)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions / Side Card */}
        <Card>
          <CardHeader>
             <CardTitle>Bảo mật & Cài đặt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                Nếu bạn muốn đổi mật khẩu, vui lòng liên hệ quản trị viên cấp cao hoặc sử dụng chức năng Quên mật khẩu.
            </div>
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} user={staff} />
    </div>
  );
}
