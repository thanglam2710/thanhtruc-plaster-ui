"use client";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { LoginResponse } from "@/types/dashboard/auth-model";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useResetPasswordMutation,
} from "@/hooks/dashboard/useAuth";
import { handleErrorApi, toastSuccess } from "@/lib/utils/api";
import { DASHBOARD_AUTH_ROUTES } from "@/constants/routes/dashboard/auth";

interface AuthContextType {
  loading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    pass: string,
    confirmPass: string,
    token: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check trạng thái đăng nhập dựa trên localStorage
  const isAuthenticated = !!getStaff();

  useEffect(() => {
    setLoading(false);
  }, []);

  // API Hooks
  const loginMutation = useLoginMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  // --- 1. LOGIN ---
  const login = async (data: any) => {
    setLoading(true);
    try {
      // Gọi API Login
      const resultObj = await loginMutation.mutateAsync(data);

      // Backend trả về resultObj là AuthStaffDTO (đã fix ở bước trước)
      const staff = resultObj;

      // Lưu Role vào Cookie để Middleware (nếu có) check
      Cookies.set("role", staff.roleName ?? "", { expires: 1 });

      // Lưu thông tin Staff vào LocalStorage
      setStaff(staff);

      toastSuccess("Đăng nhập thành công!");

      // Điều hướng dựa trên Role (Dự án này chỉ quan tâm Admin)
      if (staff.roleName === "Admin") {
        router.push("/dashboard/admin"); // Hoặc dùng ADMIN_ROUTES.MAIN
      } else {
        // Nếu lỡ có user thường đăng nhập vào đây -> đá về trang chủ
        router.push("/");
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGOUT ---
  const logout = async () => {
    setLoading(true);
    try {
      setStaff(null);
      Cookies.remove("role");
      router.push(DASHBOARD_AUTH_ROUTES.LOGIN);
      toastSuccess("Đã đăng xuất.");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FORGOT PASSWORD ---
  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      // Logic điều hướng sau khi gửi mail thành công (thường là sang trang nhập OTP)
      // router.push(...) -> Login form sẽ tự xử lý chuyển trang
      toastSuccess("Mã xác nhận đã được gửi đến email.");
    } catch (error) {
      handleErrorApi({ error });
      throw error; // Ném lỗi để Form bắt được
    } finally {
      setLoading(false);
    }
  };

  // --- 4. RESET PASSWORD ---
  const resetPassword = async (
    email: string,
    pass: string,
    confirmPass: string,
    token: string
  ) => {
    setLoading(true);
    try {
      await resetPasswordMutation.mutateAsync({
        email,
        password: pass,
        confirmPassword: confirmPass,
        token,
      });
      router.push(DASHBOARD_AUTH_ROUTES.LOGIN);
      toastSuccess("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
    } catch (error) {
      handleErrorApi({ error });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    login,
    logout,
    isAuthenticated,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// --- HELPER FUNCTIONS ---

export const setStaff = (staff: LoginResponse | null) => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!staff) {
    localStorage.removeItem("staff");
    return;
  }
  localStorage.setItem("staff", JSON.stringify(staff));
};

export const getStaff = (): LoginResponse | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const data = localStorage.getItem("staff");
  if (!data) return null;

  try {
    return JSON.parse(data) as LoginResponse;
  } catch (error) {
    console.error("Lỗi parse staff từ localStorage:", error);
    return null;
  }
};
