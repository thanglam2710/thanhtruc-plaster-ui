import { Gender, UserStatus } from "../enums";

// Base Staff Info
export interface BaseStaffInfo {
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  dateOfBirth?: string; // DateTime trả về string
  gender: Gender;
  status: UserStatus;
}

// Login Request
export interface LoginRequest {
  username: string; // Email hoặc Username
  password: string;
}

// Login Response (StaffAuthenticatedDTO)
export interface LoginResponse extends BaseStaffInfo {
  id: string;
  roleName: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

// Refresh Token
export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}