"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetProjectBySlug } from "@/hooks/user/projects/useProjects";
import { ArrowLeft, MapPin, Calendar, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getValidImageUrl } from "@/lib/utils/image";
import { formatFullDateTime } from "@/lib/utils";

function ProjectDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: project, isLoading, error } = useGetProjectBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="animate-spin h-12 w-12 border-4 border-brand-secondary border-t-transparent rounded-full inline-block"></span>
          <p className="mt-4 text-gray-600">Đang tải dự án...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Không tìm thấy dự án này.</p>
          <Button onClick={() => router.push("/projects")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách dự án
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return formatFullDateTime(dateString);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <Link href="/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {project.name}
          </h1>
        </div>

        {/* Thumbnail - Main Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-12">
          <Image
            src={getValidImageUrl(project.thumbnail)}
            alt={project.name}
            fill
            className="object-cover protected-image"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            priority
          />
        </div>

        {/* Gallery - Horizontal Scroll */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thư viện ảnh</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {project.gallery.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-80 h-60 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 snap-start cursor-pointer group"
                >
                  <Image
                    src={getValidImageUrl(imageUrl)}
                    alt={`${project.name} - Ảnh ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 protected-image"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description + Meta (2-column on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description - Left (2/3) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả dự án</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Meta - Right (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 lg:sticky lg:top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin dự án</h3>
              <div className="space-y-4">
                {project.categoryName && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Danh mục</p>
                    <p className="text-base font-semibold text-gray-900">{project.categoryName}</p>
                  </div>
                )}
                {project.location && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Địa điểm</p>
                    <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-secondary" />
                      {project.location}
                    </p>
                  </div>
                )}
                {project.completedAt && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Hoàn thành</p>
                    <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-secondary" />
                      {formatDate(project.completedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content - Full Detail */}
        {project.content && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Chi tiết dự án</h2>
            <article 
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-brand-secondary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ol:my-6
                prose-li:text-gray-700 prose-li:my-2
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-brand-secondary 
                prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 
                prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-code:text-brand-secondary prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
        )}

        {/* Back to List Button */}
        <div className="text-center pb-16">
          <Link href="/projects">
            <Button size="lg" variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Xem thêm dự án khác
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="animate-spin h-12 w-12 border-4 border-brand-secondary border-t-transparent rounded-full"></span>
        </div>
      }
    >
      <ProjectDetailContent />
    </Suspense>
  );
}
