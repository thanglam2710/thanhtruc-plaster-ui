/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError, ApiResponse } from "@/lib/api/base-api";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

type HandleApiResponseOptions = {
  response: ApiResponse<any>;
  setError?: UseFormSetError<any> | null;
  message?: string;
};

export function handleApiResponse({
  response,
  setError,
  message,
}: HandleApiResponseOptions) {
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
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {

  if (error instanceof ApiError && setError) {
    if (error?.errors?.errorsDetail?.length !== 0) {
      error?.errors?.errorsDetail.forEach((item: any) => { // Fix type implicit any
        setError(item.field, {
          type: "server",
          message: item.message,
        });
      });
    }
  }

  toast.error(error?.message || "Có lỗi xảy ra", {
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

export const toastInfo = (message: string, duration?: number) => {
  toast(message, {
    duration: duration || 3000,
    richColors: true,
    position: "top-right",
    style: {
      backgroundColor: "#d1ecf1",
      color: "#0c5460",
      border: "1px solid #bee5eb",
      borderRadius: "10px",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};