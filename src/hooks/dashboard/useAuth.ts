import { AUTH_API_ENDPOINTS } from "@/constants/api/dashboard/auth";
import { useApiMutation, useApiQuery } from "../base/useApi";
import { LoginRequest, LoginResponse, RefreshTokenResponse } from "@/types/dashboard/auth-model";
import { CacheKeys } from "../base/cacheKey";

export const useLoginMutation = () => {
  return useApiMutation<LoginResponse, LoginRequest>(AUTH_API_ENDPOINTS.AUTH.LOGIN);
};

export const useForgotPasswordMutation = () => {
  return useApiMutation<any, { email: string }>(AUTH_API_ENDPOINTS.AUTH.FORGOT_PASSWORD);
};

export const useResetPasswordMutation = () => {
  return useApiMutation<any, { email: string; password: string; confirmPassword: string; token: string }>(
    AUTH_API_ENDPOINTS.AUTH.RESET_PASSWORD
  );
};

// Lấy thông tin Staff đang đăng nhập
export const useGetProfileQuery = (id: string, options: { skip: boolean }) =>
  useApiQuery<any>(
    CacheKeys.Profile,
    AUTH_API_ENDPOINTS.PROFILE, 
    {
      params: { id },
      skip: options.skip,
    }
  );