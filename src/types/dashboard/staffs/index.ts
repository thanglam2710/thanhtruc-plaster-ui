import { UserStatus } from "@/types/enums";
import { SearchPaginationRequest } from "../search-params";

export interface StaffDTO {
    id: string; // Guid
    fullName: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    roleName: string;
    status: UserStatus | string;
    statusName: string;
    dateOfBirth?: string;
    gender?: number; // 0, 1, 2, 3
    createdTime?: string;
    updatedTime?: string;
}

export interface CreateStaffRequest {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    avatarUrl?: string;
}

export interface UpdateStaffStatusRequest {
    userId: string; // Guid
    status: UserStatus;
}

export interface UpdateProfileRequest {
    id: string;
    fullName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    gender?: number;
    dateOfBirth?: string;
}

export interface SearchStaffRequest extends SearchPaginationRequest {
    roleName?: string;
    status?: UserStatus;
}
