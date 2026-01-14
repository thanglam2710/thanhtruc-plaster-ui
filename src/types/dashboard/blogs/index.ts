import { SearchPaginationRequest } from "../search-params";

// --- BLOG TYPE ---
export interface BlogTypeDTO {
  id: number;
  name: string;
  slug: string;
}

export interface CreateBlogTypeRequest {
  name: string;
}

export interface UpdateBlogTypeRequest extends CreateBlogTypeRequest {
  id: number;
}

// --- BLOG ---
export interface BlogDTO {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  thumbnail?: string;
  isPublished: boolean;
  viewCount: number;
  
  blogTypeId: number;
  blogTypeName: string;
  
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  
  createdTime?: string;
  updatedTime?: string;
}

export interface CreateBlogRequest {
  title: string;
  summary?: string;
  content?: string;
  thumbnail?: string;
  isPublished?: boolean;
  blogTypeId: number;
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  id: number;
}

export interface SearchBlogRequest extends SearchPaginationRequest {
  blogTypeId?: number;
  isPublished?: boolean;
  authorId?: string;
}