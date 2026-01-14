import { DASHBOARD_API_ENDPOINTS } from "../main";

export const ADMIN_API_ENDPOINTS = {
  // Kế thừa toàn bộ API của Main Dashboard
  ...DASHBOARD_API_ENDPOINTS,

  // Thêm API riêng của Staffs
  STAFFS: {
    CREATE_ADMIN: "/Staffs/create-admin",
    SEARCH: "/Staffs/search",
    GET_BY_ID: "/Staffs/get-by-id",
    UPDATE_PROFILE: "/Staffs/update-profile",
    UPDATE_STATUS: "/Staffs/update-status",
  },
};