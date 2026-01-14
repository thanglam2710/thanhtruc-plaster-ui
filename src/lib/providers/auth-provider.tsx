"use client";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import type { LoginResponse } from "@/types/dashboard/auth-model";
import //   useForgotPasswordMutation, // Mở lại khi bạn đã tạo hook
//   useLoginMutation,
//   useResetPasswordMutation,
"@/hooks/dashboard/useAuth";
import { handleErrorApi } from "../utils";
import { DASHBOARD_AUTH_ROUTES } from "@/constants/routes/dashboard/auth";
import Cookies from "js-cookie";

// Vì chưa có hook useAuth (sẽ làm ở bước sau), tạm thời tôi comment các hook lại để không lỗi

interface AuthContextType {
  loading: boolean;
  login: (data: any) => Promise<void>; // Tạm để any
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isAuthenticated = !!getStaff();

  useEffect(() => {
    setLoading(false);
  }, []);

  // const loginMutation = useLoginMutation();

  const login = async (data: any) => {
    setLoading(true);
    try {
      // Logic gọi API login sẽ nằm ở đây
      // const response = await loginMutation.mutateAsync(data);
      // const staff = response?.resultObj;
      // Cookies.set("role", staff?.roleName ?? "", { expires: 1 });
      // setStaff(staff);
      // toastSuccess("Đăng nhập thành công");
      // router.push(DASHBOARD_AUTH_ROUTES.MAIN);
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setStaff(null);
      Cookies.remove("role");
      router.push(DASHBOARD_AUTH_ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

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
