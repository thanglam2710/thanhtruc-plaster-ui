// hooks/useCloudinary.ts
// Custom TanStack Query hooks for Cloudinary operations.
// This mirrors the BE CloudinaryService as closely as possible.
// - Uses unsigned uploads (requires upload preset enabled in Cloudinary).
// - To fix "Upload preset not found" error, follow these steps to create an unsigned upload preset:
//   1. Log in to your Cloudinary dashboard at https://console.cloudinary.com/.
//   2. Navigate to Settings > Upload > Upload presets (direct link: https://console.cloudinary.com/settings/upload).
//   3. Click "Add upload preset".
//   4. Give it a unique name, e.g., "unsigned_preset".
//   5. Set the Signing Mode to "Unsigned" (this is crucial for client-side uploads without signatures).
//   6. Optionally, configure fixed transformations (e.g., for images: Width 500, Height 500, Crop "fill") since dynamic ones aren't supported in unsigned mode.
//      For videos, you can't apply dynamic transformations based on dimensions; set a fixed one if needed, or apply transformations on-the-fly via URL when displaying the media.
//   7. Configure other options if desired, like folder, allowed formats, etc.
//   8. Save the preset.
//   9. In your .env.local file (or production env vars), add: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="unsigned_preset" (replace with your preset name).
//   10. Also, correct your cloud name: From the error URL, it's "dx6gvpidy" (not "dx6dy" or "dx6gidy" – fix typos).
//       Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dx6gvpidy"
//   11. Remove NEXT_PUBLIC_CLOUDINARY_API_KEY from env if present, as it's not needed for unsigned uploads and exposing it is insecure.
//   12. Restart your Next.js dev server (npm run dev) to load the new env vars.
// - If the error persists after this, add console.log(`Using preset: ${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`); before fetch to verify it's loaded correctly.
// - Note: If you need dynamic video transformations (based on width/height), unsigned won't work—switch back to signed uploads where your BE generates the signature using ApiSecret.
// - For deletion, use your BE endpoint since it requires ApiSecret (don't expose secrets on frontend).
// - After upload, you can use your existing hooks to send the URL to BE.

import { useMutation } from '@tanstack/react-query';
import { ImageUploadResult, UploadImageDTO, UploadMediaDTO, UploadVideoDTO, VideoUploadResult } from '@/types/dashboard/cloudinary';

// Custom mutation for uploading media (direct to Cloudinary)
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async (uploadMediaDTO: UploadMediaDTO) => {
      return uploadMedia(uploadMediaDTO.media);
    },
  });
};

// Overload-like for File directly
async function uploadMedia(file: File) {
  if (!file || file.size <= 0) return null;
  const isVideo = isVideoFile(file);
  if (isVideo) {
    return uploadVideo(file);
  } else {
    return uploadImage(file);
  }
}

function isVideoFile(file: File): boolean {
  const videoMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/quicktime',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/x-matroska',
  ];
  return videoMimeTypes.some((mimeType) => file.type.startsWith(mimeType));
}

// Hook for uploading image (can use separately)
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (uploadImageDTO: UploadImageDTO) => {
      return uploadImage(uploadImageDTO.image);
    },
  });
};

async function uploadImage(image: File): Promise<ImageUploadResult | null> {
  if (image.size <= 0) return null;
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  // Debug: Log to verify env vars
  console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('Upload preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Upload error details:', errorData);
    throw new Error(`Image upload failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  const dataJson = await response.json();
  return {
    secure_url: dataJson.secure_url,
    public_id: dataJson.public_id,
  };
}

// Hook for uploading video
export const useUploadVideo = () => {
  return useMutation({
    mutationFn: async (uploadVideoDTO: UploadVideoDTO) => {
      return uploadVideo(uploadVideoDTO.video);
    },
  });
};

async function uploadVideo(video: File): Promise<VideoUploadResult | null> {
  if (video.size <= 0) return null;
  const formData = new FormData();
  formData.append('file', video);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  // Debug: Log to verify env vars
  // console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  // console.log('Upload preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Upload error details:', errorData);
    throw new Error(`Video upload failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  const dataJson = await response.json();
  return {
    secure_url: dataJson.secure_url,
    public_id: dataJson.public_id,
  };
}

// // Example usage in component (upload then send URL to BE)
// 'use client';
// import { useState } from 'react';
// import { useUploadMedia } from '@/hooks/useCloudinary'; // Adjust path
// import { useUpdateNutritionMutation } from '@/hooks/nutritions'; // Your existing hook
// export default function UploadForm({ nutritionId }: { nutritionId: number }) {
// const [file, setFile] = useState<File | null>(null);
// const uploadMutation = useUploadMedia();
// const updateMutation = useUpdateNutritionMutation();
// const handleUpload = async () => {
// if (!file) return;
// try {
// const result = await uploadMutation.mutateAsync({ media: file });
// if (result?.secure_url) {
// await updateMutation.mutateAsync({
// // Your UpdateNutritionRequest
// id: nutritionId,
// imageUrl: result.secure_url, // Send URL to BE
// // Other fields...
// });
// }
// } catch (error) {
// console.error('Error:', error);
// }
// };
// return (
// <div>
// <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
// <button onClick={handleUpload} disabled={uploadMutation.isPending}>
// Upload Image & Save URL
// </button>
// {uploadMutation.isError && <p>Error: {uploadMutation.error.message}</p>}
// </div>
// );
// }