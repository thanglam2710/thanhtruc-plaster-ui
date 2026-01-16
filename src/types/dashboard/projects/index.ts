import { SearchPaginationRequest } from "../search-params";

// Project View (ProjectDTO)
export interface ProjectDTO {
  id: number;
  name: string;
  slug: string;
  thumbnail?: string;
  gallery?: string[]; // List<string>
  description?: string;
  content?: string;
  location?: string;
  completedAt?: string; // ISO DateTime string from backend
  isFeatured: boolean;
  isActive: boolean;

  categoryId: number;
  categoryName: string;

  createdTime?: string;
  updatedTime?: string;
}

// Create Project (ProjectCreateDTO)
export interface CreateProjectRequest {
  name: string;
  thumbnail?: string; // URL ảnh
  gallery?: string[]; // Mảng URL ảnh
  description?: string;
  content?: string;
  location?: string;
  completedAt?: string; // ISO DateTime string (e.g., "2024-01-15T10:30:00")
  isFeatured?: boolean;
  isActive?: boolean;
  categoryId: number;
}

// Update Project (ProjectUpdateDTO)
export interface UpdateProjectRequest extends CreateProjectRequest {
  id: number;
}

// Search Project
export interface SearchProjectRequest extends SearchPaginationRequest {
  categoryId?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}