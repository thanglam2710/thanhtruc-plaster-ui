import { SearchPaginationRequest } from "../search-params";

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  
  parentId?: number;
  parentName?: string;
  
  createdTime?: string;
  updatedTime?: string;
}

export interface CreateCategoryRequest {
  name: string;
  image?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: number;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: number;
}

export interface SearchCategoryRequest extends SearchPaginationRequest {
  parentId?: number;
  isActive?: boolean;
}