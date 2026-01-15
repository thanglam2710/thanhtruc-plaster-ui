export const AUTH_API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/Auths/staff/login",
    REFRESH_TOKEN: "/Auths/staff/refresh-token",
    FORGOT_PASSWORD: "/Auths/staff/forgot-password",
    RESET_PASSWORD: "/Auths/staff/reset-password",
    RESEND_OTP: "/Auths/staff/resend-otp-forgot-password",

    // Các API lấy thông tin phụ trợ
    GET_GENDER: "/Auths/get-gender",
    GET_USER_STATUS: "/Auths/get-user-status",
  },
  // API Lấy thông tin cá nhân staff đang đăng nhập
  PROFILE: "/Staffs/get-by-id",
};