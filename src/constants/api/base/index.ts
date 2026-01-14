// src/constants/api/base/index.ts

// API Base URL (Ưu tiên lấy từ .env, fallback về localhost)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7182";

export const API_RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60000, // 1 phút
};

export const API_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_REQUEST_TIMEOUT = 30000; // 30 giây