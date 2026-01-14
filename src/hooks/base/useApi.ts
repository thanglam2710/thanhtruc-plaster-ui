/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { apiClient } from "@/lib/api/base-api"
import { ApiError } from "@/lib/api/base-api"
import type { NextApiResponse } from "next"
import { broadcastInvalidation } from "@/lib/api/queryClient"

// Helper: Invalidate local + broadcast
function invalidateQueryKeys(queryClient: ReturnType<typeof useQueryClient>, keys?: string[]) {
  if (Array.isArray(keys) && keys.length > 0) {
    keys.forEach((key) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const firstPart = query.queryKey[0]
          return typeof firstPart === "string" && firstPart.startsWith(key)
        },
        refetchType: "active",
      })
    })
    broadcastInvalidation(keys)
  }
}

// Hook GET
export function useApiQuery<T = any>(
  baseKey: string,
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> & {
    params?: Record<string, string>
    headers?: HeadersInit
    skip?: boolean
  },
) {
  const { params, headers, skip = false, ...queryOptions } = options || {}
  const normalizedEndpoint = endpoint.replace(/[?&]/g, "_")
  const fullQueryKey = params
    ? [`${baseKey}:${normalizedEndpoint}`, params]
    : [`${baseKey}:${normalizedEndpoint}`]

  return useQuery<T>({
    queryKey: fullQueryKey,
    queryFn: async () => {
      if (skip) return null as T
      const response = await apiClient.get<NextApiResponse<T>>(endpoint, { params, headers })
      if (!response.isSuccessed) {
        throw new ApiError(response.message, response.statusCode)
      }
      // Lưu ý: Tùy backend trả về, có thể return response.resultObj hoặc response
      return response.resultObj as T 
    },
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  })
}

// Hook POST
export function useApiMutation<TData = any, TVariables = any>(
  endpoint: string,
  isMultipart = false,
  options?: UseMutationOptions<TData, Error, TVariables> & {
    headers?: HeadersInit
    invalidateQueries?: string[]
  },
) {
  const queryClient = useQueryClient()
  const { headers, invalidateQueries, ...mutationOptions } = options || {}

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.post<TData>(endpoint, variables, { headers }, isMultipart)
      if (!response.isSuccessed) throw new ApiError(response.message, response.statusCode)
      return response.resultObj as TData
    },
    onSuccess: (...args) => {
      invalidateQueryKeys(queryClient, invalidateQueries)
      options?.onSuccess?.(...args)
    },
    ...mutationOptions,
  })
}

// Hook PUT
export function useApiPutMutation<TData = any, TVariables = any>(
  endpoint: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, Error, TVariables> & {
    headers?: HeadersInit
    invalidateQueries?: string[]
  },
  isMultipart = false,
) {
  const queryClient = useQueryClient()
  const { headers, invalidateQueries, ...mutationOptions } = options || {}

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const finalEndpoint = typeof endpoint === "function" ? endpoint(variables) : endpoint
      const response = await apiClient.put<TData>(finalEndpoint, variables, { headers }, isMultipart)
      if (!response.isSuccessed) {
        throw new ApiError(response.message, response.statusCode)
      }
      return response.resultObj as TData
    },
    onSuccess: (...args) => {
      invalidateQueryKeys(queryClient, invalidateQueries)
      options?.onSuccess?.(...args)
    },
    ...mutationOptions,
  })
}

// Hook DELETE
export function useApiDeleteMutation<TData = any, TVariables = string>(
  getEndpoint: (variables: TVariables) => string,
  options?: UseMutationOptions<TData, Error, TVariables> & {
    headers?: HeadersInit
    invalidateQueries?: string[]
  },
) {
  const queryClient = useQueryClient()
  const { headers, invalidateQueries, ...mutationOptions } = options || {}

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.delete<TData>(getEndpoint(variables), { headers })
      if (!response.isSuccessed) {
        throw new ApiError(response.message, response.statusCode)
      }
      return response.resultObj as TData
    },
    onSuccess: (...args) => {
      invalidateQueryKeys(queryClient, invalidateQueries)
      options?.onSuccess?.(...args)
    },
    ...mutationOptions,
  })
}