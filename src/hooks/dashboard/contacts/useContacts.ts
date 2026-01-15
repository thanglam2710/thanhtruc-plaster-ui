import { DASHBOARD_API_ENDPOINTS } from "@/constants/api/dashboard/main";
import { useApiMutation, useApiPutMutation, useApiQuery } from "@/hooks/base/useApi";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import { ContactDTO, CreateContactRequest, SearchContactRequest, UpdateContactStatusRequest } from "@/types/dashboard/contacts";
import { PaginationResponse } from "@/types/dashboard/search-params";

// GET ALL (Pagination)
export const useGetContactsPagination = (request?: SearchContactRequest | null, options?: { skip?: boolean }) => {
    return useApiQuery<PaginationResponse<ContactDTO>>(
        CacheKeys.Contacts,
        DASHBOARD_API_ENDPOINTS.CONTACTS.SEARCH,
        {
            params: objectToQueryParams(request || {}),
            skip: options?.skip,
            ...options,
        }
    );
};

// GET BY ID
export const useGetContactById = (id: number, options?: { skip?: boolean }) => {
    return useApiQuery<ContactDTO>(
        CacheKeys.Contacts,
        DASHBOARD_API_ENDPOINTS.CONTACTS.GET_BY_ID.replace("{id}", id.toString()),
        {
            skip: !id || options?.skip,
        }
    );
};

// CREATE (JSON) - for user-facing form
export const useCreateContactMutation = () => {
    return useApiMutation<ContactDTO, CreateContactRequest>(
        DASHBOARD_API_ENDPOINTS.CONTACTS.CREATE,
        false, // isMultipart
        { invalidateQueries: [CacheKeys.Contacts] }
    );
};

// UPDATE STATUS (JSON)
export const useUpdateContactStatusMutation = () => {
    return useApiPutMutation<ContactDTO, UpdateContactStatusRequest>(
        DASHBOARD_API_ENDPOINTS.CONTACTS.UPDATE_STATUS,
        { invalidateQueries: [CacheKeys.Contacts] },
        false // isMultipart
    );
};
