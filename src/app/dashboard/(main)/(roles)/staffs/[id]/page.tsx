"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useGetStaffById, useUpdateStaffStatusMutation } from "@/hooks/dashboard/staffs/useStaffs";
import { UserStatus } from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toastSuccess } from "@/lib/utils/api";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getStaff } from "@/lib/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { CacheKeys } from "@/hooks/base/cacheKey";

// Hardcoded status options matching backend enum
const STATUS_OPTIONS = [
  { id: UserStatus.Inactive, name: "Ngừng hoạt động" },
  { id: UserStatus.Active, name: "Đang hoạt động" },
  { id: UserStatus.Suspended, name: "Bị khóa" },
];

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: staff, isLoading, error, refetch } = useGetStaffById(id);
  const updateStatusMutation = useUpdateStaffStatusMutation();
  const queryClient = useQueryClient();

  // Get current logged-in user ID
  const currentUser = getStaff();
  const currentUserId = currentUser?.id;
  const isCurrentUser = staff?.id === currentUserId;

  const [pendingStatus, setPendingStatus] = useState<UserStatus | null>(null);

  const getStatusId = (status: UserStatus | string | undefined): number => {
    if (typeof status === 'number') return status;
    if (!status) return UserStatus.Inactive;
    const option = STATUS_OPTIONS.find(opt => opt.name === status);
    return option ? option.id : UserStatus.Active; // Fallback
  };

  const getStatusBadge = (status: UserStatus | string, statusName: string) => {
    let statusId = getStatusId(status);
    let label = (typeof status === 'string' ? status : statusName);
    
    // Fallback: if label is missing or "Không xác định", look it up by ID
    if (!label || label === "Không xác định") {
         label = STATUS_OPTIONS.find(opt => opt.id === statusId)?.name || "Không xác định";
    }

    switch (statusId) {
      case UserStatus.Active:
        return <Badge className="bg-green-600">{label}</Badge>;
      case UserStatus.Inactive:
        return <Badge variant="secondary">{label}</Badge>;
      case UserStatus.Suspended:
        return <Badge variant="destructive">{label}</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  const getStatusName = (statusId: number): string => {
    return STATUS_OPTIONS.find((s) => s.id === statusId)?.name || "";
  };

  const handleStatusChange = async () => {
    if (!staff || pendingStatus === null) return;

    try {
      await updateStatusMutation.mutateAsync({
        userId: staff.id,
        status: pendingStatus,
      });
      toastSuccess("Cập nhật trạng thái thành công");
      setPendingStatus(null);
      
      // Invalidate cache explicitly
      await queryClient.invalidateQueries({
        queryKey: [CacheKeys.Staffs],
      });

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refetch to update UI immediately
      await refetch();
    } catch (error) {
      console.error(error);
      setPendingStatus(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">Không tìm thấy nhân viên</p>
          <Link href="/dashboard/staffs">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusId = getStatusId(staff.status);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staffs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chi tiết nhân viên
            {isCurrentUser && (
              <Badge variant="outline" className="ml-3 text-sm font-normal">Tài khoản của bạn</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Xem thông tin nhân viên</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {staff.avatarUrl && staff.avatarUrl.startsWith('http') ? (
                <div className="relative h-24 w-24">
                  <Image
                    src={staff.avatarUrl}
                    alt={staff.fullName}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{staff.fullName}</h2>
                <Badge variant="outline" className="mt-1">{staff.roleName}</Badge>
              </div>
            </div>

            {/* Details */}
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-base">{staff.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                <p className="text-base">{staff.phoneNumber || "-"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                <div className="mt-1">
                  {getStatusBadge(staff.status, staff.statusName)}
                </div>
              </div>

              {staff.createdTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                  <p className="text-base">{new Date(staff.createdTime).toLocaleString('vi-VN')}</p>
                </div>
              )}

              {staff.updatedTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</label>
                  <p className="text-base">{new Date(staff.updatedTime).toLocaleString('vi-VN')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý trạng thái</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCurrentUser ? (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Bạn không thể thay đổi trạng thái của chính mình.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Thay đổi trạng thái</label>
                  <Select
                    value={pendingStatus !== null ? pendingStatus.toString() : currentStatusId.toString()}
                    onValueChange={(value) => setPendingStatus(Number(value) as UserStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {pendingStatus !== null && pendingStatus !== currentStatusId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full">
                        Cập nhật trạng thái
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn thay đổi trạng thái của nhân viên "{staff.fullName}" 
                          từ <strong>{getStatusName(currentStatusId)}</strong> sang <strong>{getStatusName(pendingStatus)}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingStatus(null)}>
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleStatusChange}>
                          Xác nhận
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Đang hoạt động:</strong> Nhân viên có quyền truy cập đầy đủ.<br/>
                <strong>Ngừng hoạt động:</strong> Tạm thời vô hiệu hóa quyền truy cập.<br/>
                <strong>Bị khóa:</strong> Khóa tài khoản vĩnh viễn.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
