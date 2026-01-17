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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCreateContactMutation } from "@/hooks/dashboard/contacts/useContacts";
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary";
import { toastSuccess } from "@/lib/utils/api";
import { useContactRateLimit } from "@/hooks/user/useContactRateLimit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { ContactType } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";

// Dynamic schema based on contact type
const createContactSchema = z.object({
  customerName: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
  companyName: z.string().optional(),
  message: z.string().optional(),
  contactType: z.number(),
  productLink: z.string().url({ message: "Link không hợp lệ" }).optional().or(z.literal("")),
  attachmentUrl: z.string().optional(),
});

type ContactFormValues = z.infer<typeof createContactSchema>;

const CONTACT_TYPE_OPTIONS = [
  { id: ContactType.Quote, name: "Báo giá" },
  { id: ContactType.Recruitment, name: "Tuyển dụng" },
  { id: ContactType.Other, name: "Khác" },
];

export default function ContactPage() {
  const router = useRouter();
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const createMutation = useCreateContactMutation();
  const uploadImage = useUploadImage();
  const rateLimit = useContactRateLimit();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      companyName: "",
      message: "",
      contactType: ContactType.Other,
      productLink: "",
      attachmentUrl: "",
    },
  });

  const selectedContactType = form.watch("contactType");

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAttachment(true);
    try {
      const result = await uploadImage.mutateAsync({ image: file });
      if (result?.secure_url) {
        setAttachmentUrl(result.secure_url);
        form.setValue("attachmentUrl", result.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl(null);
    form.setValue("attachmentUrl", "");
  };

  const onSubmit = async (data: ContactFormValues) => {
    // Clear any previous rate limit errors
    setRateLimitError(null);

    // Check frontend rate limit first
    if (rateLimit.isLimited) {
      const resetTime = rateLimit.getResetTimeFormatted();
      setRateLimitError(
        `Bạn đã đạt giới hạn 5 lần gửi liên hệ trong 24 giờ. Vui lòng thử lại sau ${resetTime}.`
      );
      return;
    }

    try {
      // Clean up data based on contact type
      const submitData = {
        ...data,
        email: data.email || undefined,
        companyName: data.companyName || undefined,
        message: data.message || undefined,
        productLink: selectedContactType === ContactType.Quote ? data.productLink : undefined,
        attachmentUrl: selectedContactType === ContactType.Recruitment ? data.attachmentUrl : undefined,
        contactType: data.contactType as ContactType,
      };

      await createMutation.mutateAsync(submitData);
      
      // Record successful submission in localStorage
      rateLimit.recordSubmission();
      
      toastSuccess("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      form.reset();
      setAttachmentUrl(null);
      
      // Optionally redirect after success
      // router.push("/");
    } catch (error: any) {
      console.error(error);
      
      // Handle 429 Too Many Requests from backend
      if (error?.response?.status === 429 || error?.status === 429) {
        const backendMessage = error?.response?.data?.message || error?.data?.message;
        setRateLimitError(
          backendMessage || "Bạn đã gửi quá nhiều yêu cầu liên hệ. Vui lòng thử lại sau 24 giờ."
        );
        // Also record in localStorage to sync with backend
        rateLimit.recordSubmission();
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-gray-600">
            Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
            <CardDescription>
              Vui lòng cung cấp thông tin chính xác để chúng tôi có thể hỗ trợ bạn tốt nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Rate Limit Error Alert */}
            {rateLimitError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Đã đạt giới hạn</AlertTitle>
                <AlertDescription>{rateLimitError}</AlertDescription>
              </Alert>
            )}

            {/* Remaining Submissions Info */}
            {!rateLimit.isLimited && rateLimit.remaining < 5 && (
              <Alert variant="destructive" className="mb-6">
                <Clock className="h-4 w-4" />
                <AlertTitle>Thông báo</AlertTitle>
                <AlertDescription>
                  Bạn còn <strong>{rateLimit.remaining}</strong> lần gửi liên hệ trong 24 giờ tới.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Type */}
                <FormField
                  control={form.control}
                  name="contactType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại liên hệ *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại liên hệ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTACT_TYPE_OPTIONS.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Customer Name */}
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại *</FormLabel>
                        <FormControl>
                          <Input placeholder="0901234567" {...field} />
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
                          <Input type="email" placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên công ty</FormLabel>
                      <FormControl>
                        <Input placeholder="Công ty TNHH ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Field: Product Link (for Quote) */}
                {selectedContactType === ContactType.Quote && (
                  <FormField
                    control={form.control}
                    name="productLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link sản phẩm cần báo giá</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://example.com/product" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Vui lòng cung cấp link sản phẩm để chúng tôi báo giá chính xác
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Conditional Field: Attachment (for Recruitment) */}
                {selectedContactType === ContactType.Recruitment && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CV/Hồ sơ ứng tuyển</label>
                    {attachmentUrl ? (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
                        <a 
                          href={attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex-1 truncate"
                        >
                          {attachmentUrl}
                        </a>
                        <button
                          type="button"
                          onClick={handleRemoveAttachment}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="attachment-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          {isUploadingAttachment ? "Đang tải lên..." : "Tải lên CV"}
                        </label>
                        <input
                          id="attachment-upload"
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleAttachmentUpload}
                          disabled={isUploadingAttachment}
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Hỗ trợ: PDF, DOC, DOCX, hoặc hình ảnh
                    </p>
                  </div>
                )}

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung tin nhắn</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập nội dung bạn muốn gửi..." 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createMutation.isPending || rateLimit.isLimited}
                  >
                    {createMutation.isPending ? "Đang gửi..." : rateLimit.isLimited ? "Đã đạt giới hạn" : "Gửi liên hệ"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setAttachmentUrl(null);
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Hoặc liên hệ trực tiếp qua:</p>
          <p className="mt-2">
            <strong>Hotline:</strong> 1900-xxxx | <strong>Email:</strong> contact@thanhtrucplaster.com
          </p>
        </div>
      </div>
    </div>
  );
}
