"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/providers/auth-provider";

// Schema validation
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ.",
  }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      // Logic redirection handled in provider or here if needed, but provider usually throws if fails.
      // Based on provider code: it does NOT redirect. It just toasts.
      // So we should redirect here.
      router.push(
        `/dashboard/verify-otp?email=${encodeURIComponent(values.email)}`
      );
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email đăng ký</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nguyenvana@example.com"
                    className="focus-visible:ring-brand-primary"
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...
              </>
            ) : (
              "Gửi mã xác nhận"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link
          href="/dashboard/login"
          className="text-sm text-text-muted hover:text-brand-primary hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
