"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Search, Eye } from "lucide-react";
import TablePagination from "@/components/dashboard/table-pagination";
import { useGetContactsPagination } from "@/hooks/dashboard/contacts/useContacts";
import type { SearchContactRequest } from "@/types/dashboard/contacts";
import { ContactStatus, ContactType } from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Hardcoded options matching Backend Strings if possible
const CONTACT_STATUS_OPTIONS = [
  { id: ContactStatus.Processing, name: "Đang xử lý" },
  { id: ContactStatus.Done, name: "Hoàn thành" },
  { id: ContactStatus.Cancelled, name: "Đã hủy" },
];

const CONTACT_TYPE_OPTIONS = [
  { id: ContactType.Quote, name: "Báo giá" },
  { id: ContactType.Recruitment, name: "Tuyển dụng" },
  { id: ContactType.Other, name: "Liên hệ khác" },
];

function ContactsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<SearchContactRequest>({
    pageIndex: Number(searchParams.get("pageIndex")) || 1,
    pageSize: 10,
    searchValue: searchParams.get("searchValue") || "",
  });
  const [searchTerm, setSearchTerm] = useState(queryParams.searchValue || "");

  useEffect(() => {
    const searchValue = searchParams.get("searchValue") || "";
    const contactType = searchParams.get("contactType");
    const contactStatus = searchParams.get("contactStatus");
    
    setSearchTerm(searchValue);
    
    setQueryParams(prev => ({
      ...prev,
      pageIndex: Number(searchParams.get("pageIndex")) || 1,
      searchValue: searchValue,
      contactType: contactType ? Number(contactType) as ContactType : undefined,
      contactStatus: contactStatus ? Number(contactStatus) as ContactStatus : undefined,
    }));
  }, [searchParams]);

  const { data, isLoading, error } = useGetContactsPagination(queryParams);

  const updateUrlParams = (newParams: SearchContactRequest) => {
    const urlParams = new URLSearchParams();
    if (newParams.searchValue) urlParams.set("searchValue", newParams.searchValue);
    if (newParams.pageIndex) urlParams.set("pageIndex", newParams.pageIndex.toString());
    if (newParams.contactType !== undefined) urlParams.set("contactType", newParams.contactType.toString());
    if (newParams.contactStatus !== undefined) urlParams.set("contactStatus", newParams.contactStatus.toString());
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
    const resetParams: SearchContactRequest = {
      pageIndex: 1,
      pageSize: 10,
      searchValue: "",
    };
    setQueryParams(resetParams);
    updateUrlParams(resetParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, pageIndex: page };
    setQueryParams(newParams);
    updateUrlParams(newParams);
  };

  const getStatusBadge = (status: ContactStatus | string, statusName?: string) => {
    let statusId: number;
    // Map string to ID if needed
    if (typeof status === 'string') {
        const option = CONTACT_STATUS_OPTIONS.find(opt => opt.name === status);
        statusId = option ? option.id : -1;
    } else {
        statusId = status;
    }
    
    const label = (typeof status === 'string' ? status : statusName) || "Không xác định";

    switch (statusId) {
      case ContactStatus.Processing:
        return <Badge className="bg-blue-600">{label}</Badge>;
      case ContactStatus.Done:
        return <Badge className="bg-green-600">{label}</Badge>;
      case ContactStatus.Cancelled:
        return <Badge variant="destructive">{label}</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  const getTypeBadge = (type: ContactType | string, typeName?: string) => {
    let typeId: number;
    if (typeof type === 'string') {
        // Try exact match
        let option = CONTACT_TYPE_OPTIONS.find(opt => opt.name === type);
        // Fallback for "Khác" vs "Liên hệ khác"
        if (!option && type === "Khác") option = CONTACT_TYPE_OPTIONS.find(opt => opt.id === ContactType.Other);
        typeId = option ? option.id : -1;
    } else {
        typeId = type;
    }

    const label = (typeof type === 'string' ? type : typeName) || "Khác";

    switch (typeId) {
      case ContactType.Quote:
        return <Badge variant="outline" className="bg-purple-50">{label}</Badge>;
      case ContactType.Recruitment:
        return <Badge variant="outline" className="bg-orange-50">{label}</Badge>;
      case ContactType.Other:
        return <Badge variant="outline">{label}</Badge>;
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

  const contacts = data?.items || [];
  const totalRecords = data?.totalRecords || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liên hệ</h1>
          <p className="text-muted-foreground">Quản lý liên hệ từ khách hàng</p>
        </div>
      </div>

      {/* Search & Filter Form */}
      <div className="bg-white border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="searchValue"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={queryParams.contactType?.toString() || "all"}
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  contactType: value === "all" ? undefined : Number(value) as ContactType,
                  pageIndex: 1,
                };
                setQueryParams(newParams);
                updateUrlParams(newParams);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại liên hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {CONTACT_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={queryParams.contactStatus?.toString() || "all"}
              onValueChange={(value) => {
                const newParams = {
                  ...queryParams,
                  contactStatus: value === "all" ? undefined : Number(value) as ContactStatus,
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
                {CONTACT_STATUS_OPTIONS.map((status) => (
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
      ) : contacts.length > 0 ? (
        <>
          <p className="text-muted-foreground">
            Hiển thị {contacts.length} kết quả trong tổng số {totalRecords} liên hệ
          </p>

          <div className="rounded-md border">
<Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">STT</TableHead>
                  <TableHead className="text-center">Họ tên</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Số điện thoại</TableHead>
                  <TableHead className="text-center">Công ty</TableHead>
                  <TableHead className="text-center">Loại</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-center">Ngày gửi</TableHead>
                  <TableHead className="w-[120px] text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact: any, index: number) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium text-center">
                      {(queryParams.pageIndex! - 1) * queryParams.pageSize! + index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-center">{contact.customerName}</TableCell>
                    <TableCell className="text-center">{contact.email || "-"}</TableCell>
                    <TableCell className="text-center">{contact.phone}</TableCell>
                    <TableCell className="text-muted-foreground text-center">{contact.companyName || "-"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {getTypeBadge(contact.contactType, contact.contactTypeName)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(contact.contactStatus, contact.contactStatusName)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {new Date(contact.createdTime).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="bg-gray-50 border rounded-md p-1">
                        <Link href={`/dashboard/contacts/${contact.id}`}>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-full justify-center h-8 hover:bg-gray-100"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">Xem chi tiết</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data && data.totalPages > 1 && (
            <TablePagination
              totalPages={data.totalPages}
              currentPage={data.pageIndex}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-4">Không tìm thấy liên hệ nào</p>
          <p className="text-muted-foreground">Chưa có khách hàng nào gửi liên hệ</p>
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
