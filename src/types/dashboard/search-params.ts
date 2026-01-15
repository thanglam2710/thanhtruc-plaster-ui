// src/types/dashboard/search-params.ts

export interface SearchPaginationRequest {
  searchValue?: string;
  pageIndex?: number;
  pageSize?: number;
  isDeleted?: boolean;
}

export interface PaginationResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}