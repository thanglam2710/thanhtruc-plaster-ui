import { BaseStaffInfo } from "../auth-model";
import { SearchPaginationRequest } from "../search-params";

// Staff View DTO (StaffDTO)
export interface StaffDTO extends BaseStaffInfo {
  id: string;
  roleName: string;
  createdTime?: string;
  updatedTime?: string;
}

// Create Staff (AdminRegisterDTO)
export interface CreateStaffRequest extends BaseStaffInfo {
  password: string;
}

// Update Staff
export interface UpdateStaffRequest {
  id: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender: number;
  phoneNumber?: string;
}

// Search Staff Request
export interface SearchStaffRequest extends SearchPaginationRequest {
  roleId?: string;
}