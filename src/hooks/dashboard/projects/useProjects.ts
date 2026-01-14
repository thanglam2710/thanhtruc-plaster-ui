import { DASHBOARD_API_ENDPOINTS } from "@/constants/api/dashboard/main";
import { useApiDeleteMutation, useApiMutation, useApiPutMutation, useApiQuery } from "@/hooks/base/useApi";
import { objectToQueryParams } from "@/lib/utils";
import { CacheKeys } from "@/hooks/base/cacheKey";
import { CreateProjectRequest, ProjectDTO, SearchProjectRequest, UpdateProjectRequest } from "@/types/dashboard/projects";
import { PaginationResponse } from "@/types/dashboard/search-params";

// GET ALL (Pagination)
export const useGetProjectsPagination = (request?: SearchProjectRequest | null, options?: { skip?: boolean }) => {
  return useApiQuery<PaginationResponse<ProjectDTO>>(
    CacheKeys.Projects,
    DASHBOARD_API_ENDPOINTS.PROJECTS.SEARCH,
    {
      params: objectToQueryParams(request || {}),
      skip: options?.skip,
      ...options,
    }
  );
};

// GET BY ID
export const useGetProjectById = (id: number) => {
  return useApiQuery<ProjectDTO>(
    CacheKeys.Projects, 
    DASHBOARD_API_ENDPOINTS.PROJECTS.GET_BY_ID.replace("{id}", id.toString()), 
    { skip: !id }
  );
};

// CREATE
export const useCreateProjectMutation = () => {
  return useApiMutation<ProjectDTO, CreateProjectRequest>(
    DASHBOARD_API_ENDPOINTS.PROJECTS.CREATE, 
    false, 
    { invalidateQueries: [CacheKeys.Projects] }
  );
};

// UPDATE
export const useUpdateProjectMutation = () => {
  return useApiPutMutation<ProjectDTO, UpdateProjectRequest>(
    DASHBOARD_API_ENDPOINTS.PROJECTS.UPDATE,
    { invalidateQueries: [CacheKeys.Projects] },
    false
  );
};

// DELETE
export const useDeleteProjectMutation = () => {
  return useApiDeleteMutation<any, number>(
    (id) => DASHBOARD_API_ENDPOINTS.PROJECTS.DELETE.replace("{id}", id.toString()),
    { invalidateQueries: [CacheKeys.Projects] }
  );
};