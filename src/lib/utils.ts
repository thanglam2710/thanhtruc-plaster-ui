import { clsx, type ClassValue } from "clsx"
import { ApiError, ApiResponse } from "@/lib/api/base-api";
import { UseFormSetError, FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import {
  format,
  parseISO,
  differenceInDays,
  formatDistanceToNow,
} from "date-fns";
import { vi } from "date-fns/locale";

interface ErrorDetail {
  field: string;
  message: string;
}

interface ApiErrors {
  errorsDetail?: ErrorDetail[];
}

interface FormData extends FieldValues {
  [key: string]: unknown;
}

type HandleApiResponseOptions<T = unknown> = {
  response: ApiResponse<T>;
  setError?: UseFormSetError<FormData> | null;
  message?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BaseSearchPaginationRequest {
  searchValue?: string;
  pageIndex?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  status?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export function stripHtml(html: string = "") {
  const plainText = html
    .replace(/<[^>]*>/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.slice(0, 320);
}

export function objectToQueryParams(
  obj: any
): Record<string, string> {
  if (!obj) return {};
  
  return (
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
  );
}

export function handleApiResponse<T = unknown>({
  response,
  setError,
  message,
}: HandleApiResponseOptions<T>) {
  if (!response.isSuccessed) {
    if (setError) {
      handleErrorApi({
        error: new Error(response.message),
        setError: setError,
      });
    } else {
      toastError(response.message);
    }
    return false;
  } else {
    toastSuccess(message ?? response.message);
    return true;
  }
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: unknown;
  setError?: UseFormSetError<FormData>;
  duration?: number;
}) => {
  if (error instanceof ApiError && setError) {
    const apiError = error as ApiError & { errors?: ApiErrors };
    if (apiError?.errors?.errorsDetail?.length !== 0) {
      apiError?.errors?.errorsDetail?.forEach((item: ErrorDetail) => {
        setError(item.field as string, {
          type: "server",
          message: item.message,
        });
      });
    }
  }

  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : "Có lỗi xảy ra";

  toast.error(errorMessage, {
    duration: duration || 3000,
    richColors: true,
    position: "top-right",
    style: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const toastError = (message: string, duration?: number) => {
  toast.error(message || "Có lỗi xảy ra", {
    duration: duration || 3000,
    richColors: true,
    position: "top-right",
    style: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const toastSuccess = (message: string, duration?: number) => {
  toast.success(message, {
    duration: duration || 3000,
    richColors: true,
    position: "top-right",
    style: {
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      borderRadius: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const toastWarning = (message: string, duration?: number) => {
  toast.warning(message, {
    duration: duration || 3000,
    richColors: true,
    position: "top-right",
    style: {
      backgroundColor: "#fff3cd",
      color: "#856404",
      border: "1px solid #ffeeba",
      borderRadius: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export function formatDateTime(isoDate: string): string {
  try {
    const date = parseISO(isoDate);
    const now = new Date();
    const daysDiff = differenceInDays(now, date);
    if (daysDiff < 7) {
      return formatDistanceToNow(date, { locale: vi, addSuffix: true });
    }
    return format(date, "dd MMM yyyy", { locale: vi });
  } catch (error) {
    console.error("Lỗi format ngày:", error);
    return "";
  }
}