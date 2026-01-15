"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Mã OTP phải đủ 6 ký tự." })
    .max(6, { message: "Mã OTP không quá 6 ký tự." }),
});

type OtpValues = z.infer<typeof otpSchema>;

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Không gọi API verify mà chỉ chuyển hướng sang trang Reset Password kèm token
  async function onSubmit(values: OtpValues) {
    setIsLoading(true);
    // Giả lập delay UX một chút
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsLoading(false);
    router.push(
      `/dashboard/reset-password?email=${encodeURIComponent(email)}&token=${
        values.otp
      }`
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã xác thực (OTP)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    className="text-center text-2xl tracking-[0.5em] font-bold text-brand-primary focus-visible:ring-brand-primary h-14"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-[#5a3b2b] text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang kiểm
                tra...
              </>
            ) : (
              "Xác minh OTP"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Không nhận được mã?{" "}
          <button
            type="button"
            className="text-brand-primary font-semibold hover:underline"
            onClick={() => alert("Đã gửi lại mã!")}
          >
            Gửi lại
          </button>
        </p>
        <Link
          href="/dashboard/login"
          className="text-sm text-text-muted hover:text-brand-primary hover:underline block pt-2"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
