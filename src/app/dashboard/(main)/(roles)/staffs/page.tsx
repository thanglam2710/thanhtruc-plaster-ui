"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, CirclePlus, Eye, User as UserIcon } from "lucide-react";
import { useGetStaffsPagination } from "@/hooks/dashboard/staffs/useStaffs";
import type { SearchStaffRequest } from "@/types/dashboard/staffs";
import { UserStatus } from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getStaff } from "@/lib/providers/auth-provider";

// Hardcoded status options matching backend enum text if possible
const STATUS_OPTIONS = [
  { id: UserStatus.Inactive, name: "Ngừng hoạt động" },
  { id: UserStatus.Active, name: "Đang hoạt động" },
  { id: UserStatus.Suspended, name: "Bị khóa" },
];

function StaffsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<SearchStaffRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 10,
    searchValue: searchParams.get("searchValue") || "",
  });
  const [searchTerm, setSearchTerm] = useState(queryParams.searchValue || "");

  // Get current logged-in user ID
  const currentUser = getStaff();
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const status = searchParams.get("status");
    
    setSearchTerm(searchValue);
    
    setQueryParams(prev => ({
      ...prev,
      pageIndex: Number(searchParams.get("pageIndex")) || 1,
      searchValue: searchValue,
      status: status ? Number(status) as UserStatus : undefined,
    }));
  }, [searchParams]);

  const { data, isLoading, error } = useGetStaffsPagination(queryParams);

  const updateUrlParams = (newParams: SearchStaffRequest) => {
    const urlParams = new URLSearchParams();
    if (newParams.searchValue) urlParams.set("searchValue", newParams.searchValue);
    if (newParams.pageIndex) urlParams.set("pageIndex", newParams.pageIndex.toString());
    if (newParams.status !== undefined) urlParams.set("status", newParams.status.toString());
    router.push(`?${urlParams.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = { ...queryParams, pageIndex: 1, searchValue: searchTerm };
    setQueryParams(newParams);
    updateUrlParams(newParams);
  };

  const handleReset = () => {
    setSearchTerm("");
    const resetParams: SearchStaffRequest = {
      pageIndex: 1,
      pageSize: 10,
      searchValue: "",
    };
    setQueryParams(resetParams);
    updateUrlParams(resetParams);
  };

  const getStatusId = (status: UserStatus | string): number => {
    if (typeof status === 'number') return status;
    const option = STATUS_OPTIONS.find(opt => opt.name === status);
    return option ? option.id : UserStatus.Active; 
  };

  const getStatusBadge = (status: UserStatus | string, statusName?: string) => {
    let statusId = getStatusId(status);
    let label = (typeof status === 'string' ? status : statusName);
    
    // Fallback: if label is missing, look it up by ID
    if (!label) {
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-6">Có lỗi xảy ra, vui lòng thử lại sau.</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  const staffs = data?.items || [];
  const totalRecords = data?.totalRecords || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhân viên</h1>
          <p className="text-muted-foreground">Quản lý nhân viên</p>
        </div>
        <Link href="/dashboard/staffs/create">
          <Button>
            <CirclePlus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        </Link>
      </div>

      {/* Search & Filter Form */}
      <div className="bg-white border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="searchValue"
                placeholder="Tìm kiếm nhân viên..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={queryParams.status?.toString() || "all"}
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  status: value === "all" ? undefined : Number(value) as UserStatus,
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Tìm kiếm</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Đặt lại
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
           <Skeleton className="h-8 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
      ) : staffs.length > 0 ? (
        <>
          <p className="text-muted-foreground">
            Hiển thị {staffs.length} kết quả trong tổng số {totalRecords} nhân viên
          </p>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[150px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffs.map((staff: any, index: number) => {
                  const isCurrentUser = staff.id === currentUserId;
                  
                  return (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        {(queryParams.pageIndex! - 1) * queryParams.pageSize! + index + 1}
                      </TableCell>
                      <TableCell>
                        {staff.avatarUrl && 
                         staff.avatarUrl.startsWith('http') ? (
                          <div className="relative h-10 w-10">
                            <Image
                              src={staff.avatarUrl}
                              alt={staff.fullName}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {staff.fullName}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">Bạn</Badge>
                        )}
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell className="text-muted-foreground">{staff.phoneNumber || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.roleName}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(staff.status, staff.statusName)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/staffs/${staff.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-4">Không tìm thấy nhân viên nào</p>
          <Link href="/dashboard/staffs/create">
            <Button>
              <CirclePlus className="mr-2 h-4 w-4" />
              Tạo mới
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function StaffsPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <StaffsContent />
    </Suspense>
  );
}
