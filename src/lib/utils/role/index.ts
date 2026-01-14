import Cookies from "js-cookie";

// Vì ta chưa định nghĩa ROLE type cụ thể trong constants, tạm thời để string
// Sau này sẽ import từ @/types/enums hoặc constants
export function checkRole(allowedRoles: string[]): boolean {
  const currentRole = Cookies.get("role"); // Lấy tên Role từ Cookie
  return currentRole !== undefined && allowedRoles.includes(currentRole);
}

export const getCurrentUserRole = () => Cookies.get("role");