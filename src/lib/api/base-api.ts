/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from "@/constants/api/base";
import { getStaff, setStaff } from "@/lib/providers/auth-provider";
import NProgress from "nprogress";
import type { JSX } from "react";
import { handleErrorApi } from "@/lib/utils";
import { DASHBOARD_AUTH_ROUTES } from "@/constants/routes/dashboard/auth";
import { AUTH_API_ENDPOINTS } from "@/constants/api/dashboard/auth";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  data?: any;
  headers?: HeadersInit;
  responseType?: "json" | "blob" | "text";
}

export interface ApiResponse<T = any> {
  status: number;
  data: any;
  errors: any;
  statusCode: number;
  message: string;
  isSuccessed: boolean;
  resultObj: T | null;
}

export interface ApiResponseWithPagination<T = any> extends ApiResponse<T[]> {
  map(
    arg0: (status: { id: number; name: string }) => JSX.Element
  ): import("react").ReactNode;
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: T[];
}

type EntityErrorPayload = {
  errorsDetail: {
    field: string;
    message: string;
  }[];
};

export class ApiError extends Error {
  statusCode: number;
  errors?: EntityErrorPayload | null;
  constructor(
    message: string,
    statusCode: number,
    errors?: EntityErrorPayload | null
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function baseApiRequest<T = any>(
  endpoint: string,
  method: RequestMethod = "GET",
  options: FetchOptions = {},
  isMultipart = false
): Promise<ApiResponse<T> | Blob> {
  const {
    params,
    data,
    headers,
    responseType = "json",
    ...restOptions
  } = options;

  const url = new URL(`${API_BASE_URL}/api${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
  };

  if (responseType === "blob") {
    defaultHeaders["Accept"] =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*";
  } else {
    defaultHeaders["Accept"] = "application/json";
  }

  let authToken: string | null = null;

  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const isAdminPath = currentPath.startsWith(DASHBOARD_AUTH_ROUTES.MAIN);

    if (isAdminPath) {
      if (
        !currentPath.startsWith(DASHBOARD_AUTH_ROUTES.LOGIN) &&
        !currentPath.startsWith(DASHBOARD_AUTH_ROUTES.FORGOT_PASSWORD) &&
        !currentPath.startsWith(DASHBOARD_AUTH_ROUTES.RESET_PASSWORD)
      ) {
        const adminToken = getStaff()?.accessToken;
        const refreshToken = getStaff()?.refreshToken;

        if (!adminToken && !refreshToken) {
          setStaff(null);
          window.location.href = DASHBOARD_AUTH_ROUTES.LOGIN;
        } else {
          authToken = await refreshTokenIfNeeded(adminToken!, refreshToken!);
        }
      }
    }
  }

  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  let body: BodyInit | undefined;

  if (method !== "GET") {
    if (isMultipart) {
      body = data;
      delete defaultHeaders["Content-Type"];
    } else {
      body = data ? JSON.stringify(data) : undefined;
    }
  }

  try {
    NProgress.start();
    const response = await fetch(url.toString(), {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: method !== "GET" ? body : undefined,
      credentials: "include",
      ...restOptions,
    });

    if (responseType === "blob") {
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          errorText || `Download failed with status ${response.status}`,
          response.status
        );
      }
      const blob = await response.blob();
      return blob;
    } else {
      const contentType = response.headers.get("content-type");
      let responseData;

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          responseData?.message || "API request failed",
          response.status,
          responseData
        );
      }

      return responseData as ApiResponse<T>;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError((error as Error).message || "Network error", 500);
  } finally {
    NProgress.done();
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    baseApiRequest<T>(endpoint, "GET", options) as Promise<ApiResponse<T>>,

  post: <T = any>(
    endpoint: string,
    data?: any,
    options?: FetchOptions,
    isMultipart?: boolean
  ) =>
    baseApiRequest<T>(
      endpoint,
      "POST",
      { ...options, data },
      isMultipart
    ) as Promise<ApiResponse<T>>,

  put: <T = any>(
    endpoint: string,
    data?: any,
    options?: FetchOptions,
    isMultipart?: boolean
  ) =>
    baseApiRequest<T>(
      endpoint,
      "PUT",
      { ...options, data },
      isMultipart
    ) as Promise<ApiResponse<T>>,

  patch: <T = any>(
    endpoint: string,
    data?: any,
    options?: FetchOptions,
    isMultipart?: boolean
  ) =>
    baseApiRequest<T>(
      endpoint,
      "PATCH",
      { ...options, data },
      isMultipart
    ) as Promise<ApiResponse<T>>,

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    baseApiRequest<T>(endpoint, "DELETE", options) as Promise<ApiResponse<T>>,

  download: (endpoint: string, options?: FetchOptions) =>
    baseApiRequest<Blob>(endpoint, "GET", {
      ...options,
      responseType: "blob",
    }) as Promise<Blob>,
};

function parseJwt(token: string): { exp: number } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    handleErrorApi({ error });
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const tokenData = parseJwt(token);
  if (!tokenData || !tokenData.exp) return true;
  const now = Date.now() / 1000;
  return tokenData.exp <= now;
}

function willTokenExpireSoon(token: string): boolean {
  const tokenData = parseJwt(token);
  if (!tokenData || !tokenData.exp) return true;
  const now = Date.now() / 1000;
  const expiresIn = tokenData.exp - now;
  return expiresIn < 30;
}

async function refreshTokenIfNeeded(
  accessToken: string,
  refreshToken: string
): Promise<string> {
  if (isTokenExpired(accessToken)) {
    setStaff(null);
    window.location.href = DASHBOARD_AUTH_ROUTES.LOGIN;
    return accessToken;
  }

  if (willTokenExpireSoon(accessToken)) {
    try {
      // ✅ SỬA LỖI: Dùng AUTH_API_ENDPOINTS thay vì DASHBOARD_API_ENDPOINTS
      const refreshEndpoint = AUTH_API_ENDPOINTS.AUTH.REFRESH_TOKEN;

      const res = await fetch(API_BASE_URL + "/api" + refreshEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
        cache: "no-store",
      });

      if (!res.ok) {
        setStaff(null);
        window.location.href = DASHBOARD_AUTH_ROUTES.LOGIN;
        // toastError chưa được import tại đây để tránh circular dependency nếu không cần thiết
        // Nếu cần dùng toastError, hãy import nó
        return accessToken;
      }

      const result = await res.json();
      const staff = getStaff();
      if (staff) {
        const updatedStaff = {
          ...staff,
          accessToken: result.resultObj.accessToken,
          refreshToken: result.resultObj.refreshToken,
          accessTokenExpiration: result.resultObj.accessTokenExpiration,
          refreshTokenExpiration: result.resultObj.refreshTokenExpiration,
        };
        setStaff(updatedStaff);
      }

      return result.accessToken;
    } catch (err) {
      handleErrorApi({ error: err });
      setStaff(null);
      window.location.href = DASHBOARD_AUTH_ROUTES.LOGIN;
      return accessToken;
    }
  }
  return accessToken;
}