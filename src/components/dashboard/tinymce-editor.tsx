"use client"

import { useEffect, useRef, useCallback } from "react"
import { useUploadImage } from "@/hooks/dashboard/cloudinary/useCloudinary"

interface TinyMCEProps {
  data: string
  onChange: (event: { target: { value: string } }, editor: unknown) => void
}

declare global {
  interface Window {
    tinymce: {
      init: (config: Record<string, unknown>) => void
      get: (id: string) =>
        | {
            setContent: (content: string) => void
            getContent: () => string
            on: (event: string, callback: () => void) => void
            destroy: () => void
          }
        | undefined
      remove: (selector?: string) => void
    }
  }
}

const TinyMCEEditor = ({ data, onChange }: TinyMCEProps) => {
  const editorRef = useRef<string>(`tinymce-${Math.random().toString(36).substr(2, 9)}`)
  const containerRef = useRef<HTMLTextAreaElement>(null)
  const scriptLoadedRef = useRef<boolean>(false)
  const editorInitialized = useRef<boolean>(false)
  const uploadImageMutation = useUploadImage()

  const stableOnChange = useCallback(
    (event: { target: { value: string } }, editor: unknown) => {
      onChange(event, editor)
    },
    [onChange]
  )

  const initEditor = useCallback(() => {
    if (!containerRef.current || !window.tinymce || editorInitialized.current) return

    window.tinymce.init({
      target: containerRef.current,
      height: 400,
      menubar: true,
      plugins: [
        "advlist",
        "anchor",
        "autolink",
        "codesample",
        "fullscreen",
        "help",
        "image",
        "lists",
        "link",
        "media",
        "preview",
        "searchreplace",
        "table",
        "visualblocks",
        "wordcount",
      ],
      toolbar: [
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough",
        "link image media table | align lineheight | numlist bullist indent outdent",
        "emoticons charmap | removeformat | fullscreen preview | help",
      ].join(" | "),
      content_style: `
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
          font-size: 14px;
          line-height: 1.6;
        }
      `,
      setup: (editor: unknown) => {
        const typedEditor = editor as {
          on: (event: string, callback: () => void) => void
          getContent: () => string
        }

        typedEditor.on("blur keyup change", () => {
          const content = typedEditor.getContent()
          if (stableOnChange) {
            stableOnChange({ target: { value: content } }, editor)
          }
        })
      },
      init_instance_callback: (editor: unknown) => {
        editorInitialized.current = true
        const typedEditor = editor as { setContent: (content: string) => void }

        if (data) {
          typedEditor.setContent(data)
        }
      },
      images_upload_handler: (blobInfo: { blob: () => Blob }) => {
        return new Promise((resolve, reject) => {
          const file = new File([blobInfo.blob()], "image.jpg", { type: blobInfo.blob().type })

          uploadImageMutation
            .mutateAsync({ image: file })
            .then((result) => {
              if (result?.secure_url) {
                resolve(result.secure_url)
              } else {
                reject("No URL returned from upload")
              }
            })
            .catch((error: unknown) => {
              console.error("Upload error:", error)
              reject(error)
            })
        })
      },
      images_file_types: "jpg,jpeg,png,gif,webp,svg",
      automatic_uploads: true,
      branding: false,
      resize: true,
      elementpath: false,
      statusbar: true,
      paste_data_images: true,
      paste_as_text: false,
      paste_webkit_styles: "none",
      paste_merge_formats: true,
      smart_paste: true,
    })
  }, [uploadImageMutation, stableOnChange, data])

  useEffect(() => {
    const currentEditorId = editorRef.current
    
    if (window.tinymce) {
      initEditor()
      return
    }

    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
      script.async = true

      script.onload = () => {
        initEditor()
      }

      script.onerror = () => {
        console.error("Failed to load TinyMCE")
      }

      document.head.appendChild(script)
    }

    return () => {
      if (window.tinymce && window.tinymce.get(currentEditorId)) {
        window.tinymce.get(currentEditorId)?.destroy()
        editorInitialized.current = false
      }
    }
  }, [initEditor])

  useEffect(() => {
    if (editorInitialized.current && window.tinymce) {
      const editor = window.tinymce.get(editorRef.current)
      if (editor && data !== editor.getContent()) {
        editor.setContent(data || "")
      }
    }
  }, [data])

  return (
    <div className="min-h-[200px] border rounded-md">
      <textarea ref={containerRef} id={editorRef.current} className="min-h-[200px] w-full" defaultValue={data} />
    </div>
  )
}

export default TinyMCEEditor
