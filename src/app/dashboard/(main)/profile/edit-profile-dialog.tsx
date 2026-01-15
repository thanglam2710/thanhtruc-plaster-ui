"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { StaffDTO } from "@/types/dashboard/staffs";
import { Gender } from "@/types/enums";
import { toastSuccess, handleErrorApi } from "@/lib/utils/api";

const formSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
  gender: z.string().optional(), // We'll convert string "1", "2" to number
  dateOfBirth: z.string().optional(),
});

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: StaffDTO;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  user,
}: EditProfileDialogProps) {
  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      avatarUrl: "",
      gender: "1",
      dateOfBirth: "",
    },
  });

  // Reset form values when user changes or dialog opens
  useEffect(() => {
    if (user && open) {
      form.reset({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatarUrl: user.avatarUrl || "",
        gender: user.gender !== undefined ? user.gender.toString() : "0", 
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      });
    }
  }, [user, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user.id) return;

      await updateProfileMutation.mutateAsync({
        id: user.id,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        avatarUrl: values.avatarUrl,
        gender: values.gender ? parseInt(values.gender) : 0,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : undefined,
      });

      toastSuccess("Cập nhật hồ sơ thành công!");
      onOpenChange(false);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật hồ sơ</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin cá nhân của bạn tại đây.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Tạm thời)</FormLabel>
                  <FormControl>
                    <Input placeholder="Link ảnh đại diện..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && "Đang xử lý..."}
                {!updateProfileMutation.isPending && "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
