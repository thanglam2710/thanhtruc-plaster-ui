// src/types/enums.ts

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

export enum UserStatus {
  Active = 1,
  Inactive = 0,
  Suspended = -1,
}

export enum ContactType {
  Quote = 1,      // Báo giá
  Recruitment = 2, // Tuyển dụng
  Other = 3,
}

export enum ContactStatus {
  Processing = 0,
  Done = 1,
  Cancelled = 2,
}