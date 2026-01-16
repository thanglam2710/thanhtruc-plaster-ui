import { DASHBOARD_API_ENDPOINTS } from "@/constants/api/dashboard/main";
import { useApiMutation, useApiPutMutation, useApiQuery } from "@/hooks/base/useApi";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import { CreateStaffRequest, SearchStaffRequest, StaffDTO, UpdateStaffStatusRequest, UpdateProfileRequest, ChangePasswordRequest } from "@/types/dashboard/staffs";
import { PaginationResponse } from "@/types/dashboard/search-params";

// GET ALL (Pagination)
export const useGetStaffsPagination = (request?: SearchStaffRequest | null, options?: { skip?: boolean }) => {
    return useApiQuery<PaginationResponse<StaffDTO>>(
        CacheKeys.Staffs,
        DASHBOARD_API_ENDPOINTS.STAFFS.SEARCH,
        {
            params: objectToQueryParams(request || {}),
            skip: options?.skip,
            ...options,
        }
    );
};

// GET BY ID
export const useGetStaffById = (id: string, options?: { skip?: boolean }) => {
    return useApiQuery<StaffDTO>(
        CacheKeys.Staffs,
        DASHBOARD_API_ENDPOINTS.STAFFS.GET_BY_ID,
        {
            params: { id },
            skip: !id || options?.skip,
        }
    );
};

// CREATE (multipart/form-data for avatar upload)
export const useCreateStaffMutation = () => {
    return useApiMutation<StaffDTO, CreateStaffRequest>(
        DASHBOARD_API_ENDPOINTS.STAFFS.CREATE,
        true, // isMultipart
        { invalidateQueries: [CacheKeys.Staffs] }
    );
};

// UPDATE STATUS (JSON)
export const useUpdateStaffStatusMutation = () => {
    return useApiPutMutation<StaffDTO, UpdateStaffStatusRequest>(
        DASHBOARD_API_ENDPOINTS.STAFFS.UPDATE_STATUS,
        { invalidateQueries: [CacheKeys.Staffs] },
        false // isMultipart
    );
};

// UPDATE PROFILE
export const useUpdateProfileMutation = () => {
    return useApiPutMutation<StaffDTO, UpdateProfileRequest>(
        DASHBOARD_API_ENDPOINTS.STAFFS.UPDATE_PROFILE,
        { invalidateQueries: [CacheKeys.Staffs] },
        true // isMultipart
    );
};

// CHANGE PASSWORD
export const useChangePasswordMutation = () => {
    return useApiPutMutation<any, ChangePasswordRequest>(
        DASHBOARD_API_ENDPOINTS.STAFFS.CHANGE_PASSWORD,
        { invalidateQueries: [] }, // No cache invalidation needed
        false // Not multipart
    );
};
