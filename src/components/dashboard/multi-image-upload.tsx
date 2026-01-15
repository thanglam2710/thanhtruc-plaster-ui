"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, ImageIcon } from "lucide-react"
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary"
import Image from "next/image"

interface MultiImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function MultiImageUpload({ 
  images, 
  onChange, 
  maxImages = 10 
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const uploadImage = useUploadImage()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remainingSlots = maxImages - images.length
    const filesToUpload = files.slice(0, remainingSlots)

    if (filesToUpload.length === 0) {
      alert(`Đã đạt giới hạn ${maxImages} ảnh`)
      return
    }

    setIsUploading(true)
    try {
      const uploadPromises = filesToUpload.map(file => 
        uploadImage.mutateAsync({ image: file })
      )
      const results = await Promise.all(uploadPromises)
      const urls = results
        .filter(result => result?.secure_url)
        .map(result => result!.secure_url)
      onChange([...images, ...urls])
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload ảnh thất bại, vui lòng thử lại")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading || images.length >= maxImages}
          onClick={() => document.getElementById("multi-image-input")?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Đang upload..." : "Thêm ảnh"}
        </Button>
        <span className="text-sm text-muted-foreground">
          {images.length}/{maxImages} ảnh
        </span>
        <input
          id="multi-image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || images.length >= maxImages}
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Chưa có ảnh nào. Click "Thêm ảnh" để upload.
          </p>
        </div>
      )}
    </div>
  )
}
