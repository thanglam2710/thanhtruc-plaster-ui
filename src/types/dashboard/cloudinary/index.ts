// src/types/dashboard/cloudinary/index.ts

// Kết quả trả về sau khi xóa ảnh
export interface DeletionResult {
  result: string;  // e.g., 'ok'
}

// Kết quả trả về sau khi Upload thành công
// (Backend thường trả về object này hoặc chuỗi URL)
export interface ImageUploadResult {
  secure_url: string;
  public_id: string;
}

export interface VideoUploadResult {
  secure_url: string;
  public_id: string;
}

// DTO dùng để gửi file lên API (Map với UploadMediaDTO bên C#)
export interface UploadMediaDTO {
  media: File;
}

// Map với UploadImageDTO bên C#
export interface UploadImageDTO {
  image: File;
}

// Map với UploadVideoDTO bên C#
export interface UploadVideoDTO {
  video: File;
}