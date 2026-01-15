"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetContactById, useUpdateContactStatusMutation } from "@/hooks/dashboard/contacts/useContacts";
import { ContactStatus, ContactType } from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toastSuccess } from "@/lib/utils/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { CacheKeys } from "@/hooks/base/cacheKey";

const updateStatusSchema = z.object({
  contactStatus: z.number(),
  adminNote: z.string().optional(),
});

type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

// Hardcoded options from enums.ts
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

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const { data: contact, isLoading, error, refetch } = useGetContactById(id);
  const updateStatusMutation = useUpdateContactStatusMutation();

  const getStatusId = (status: ContactStatus | string | undefined): number => {
    if (typeof status === 'number') return status;
    if (!status) return ContactStatus.Processing;
    const option = CONTACT_STATUS_OPTIONS.find(opt => opt.name === status);
    return option ? option.id : ContactStatus.Processing;
  };

  const getTypeId = (type: ContactType | string | undefined): number => {
    if (typeof type === 'number') return type;
    if (!type) return ContactType.Other;
    
    let option = CONTACT_TYPE_OPTIONS.find(opt => opt.name === type);
    // Fallback if needed
    if (!option && (type === "Khác" || type === "Liên hệ khác")) {
         option = CONTACT_TYPE_OPTIONS.find(opt => opt.id === ContactType.Other);
    }
    return option ? option.id : ContactType.Other;
  };

  const form = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    values: contact ? {
      contactStatus: getStatusId(contact.contactStatus),
      adminNote: contact.adminNote || "",
    } : undefined,
  });

  const onSubmit = async (data: UpdateStatusFormValues) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        contactStatus: data.contactStatus as ContactStatus,
        adminNote: data.adminNote,
      });

      toastSuccess("Cập nhật trạng thái thành công");

      // Invalidate cache explicitly to ensure freshness
      await queryClient.invalidateQueries({
        queryKey: [CacheKeys.Contacts],
      });

      // Small delay to ensure backend commit
      await new Promise(resolve => setTimeout(resolve, 300));

      // Force refetch to update UI
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status: ContactStatus | string, statusName: string) => {
    let statusId: number;
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

  const getTypeBadge = (type: ContactType | string, typeName: string) => {
    const typeId = getTypeId(type);
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

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">Không tìm thấy liên hệ</p>
          <Link href="/dashboard/contacts">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contacts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết liên hệ</h1>
          <p className="text-muted-foreground">Xem và xử lý liên hệ từ khách hàng</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Họ tên</label>
                <p className="text-base font-medium">{contact.customerName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base">{contact.email || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                  <p className="text-base">{contact.phone}</p>
                </div>
              </div>

              {contact.companyName && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Công ty</label>
                  <p className="text-base">{contact.companyName}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loại liên hệ</label>
                  <div className="mt-1">
                    {getTypeBadge(contact.contactType, contact.contactTypeName || "")}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-1">
                    {getStatusBadge(contact.contactStatus, contact.contactStatusName || "")}
                  </div>
                </div>
              </div>

              {/* Conditional fields based on contact type */}
              {getTypeId(contact.contactType) === ContactType.Quote && contact.productLink && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Link sản phẩm (Báo giá)</label>
                  <a 
                    href={contact.productLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base text-blue-600 hover:underline block"
                  >
                    {contact.productLink}
                  </a>
                </div>
              )}

              {getTypeId(contact.contactType) === ContactType.Recruitment && contact.attachmentUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File đính kèm (Tuyển dụng)</label>
                  <a 
                    href={contact.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base text-blue-600 hover:underline block"
                  >
                    {contact.attachmentUrl}
                  </a>
                </div>
              )}

              {contact.message && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tin nhắn</label>
                  <p className="text-base whitespace-pre-wrap bg-muted p-4 rounded-md mt-1">
                    {contact.message}
                  </p>
                </div>
              )}

              {contact.createdTime && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày gửi</label>
                  <p className="text-base">{new Date(contact.createdTime).toLocaleString('vi-VN')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Xử lý liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTACT_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.id} value={status.id.toString()}>
                              {status.name}
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
                  name="adminNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú của Admin</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập ghi chú xử lý..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
