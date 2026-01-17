"use client";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPublicProjects } from "@/hooks/user/usePublicData";
import Link from "next/link";

export const FeaturedProjects = () => {
  const { data: projectData } = useGetPublicProjects({
    pageSize: 4,
    pageIndex: 1,
    isFeatured: true,
    isActive: true,
  });
  const projects = projectData?.items || [];

  return (
    <section className="py-24 bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-brand-primary uppercase tracking-tight font-heading">
              Dự án tiêu biểu
            </h2>
            <div className="w-20 h-1 bg-brand-secondary mt-2"></div>
          </div>
          {/* Có thể thêm nút Prev/Next xử lý slide sau này */}
          <div className="flex space-x-4">
            <button className="p-3 border border-brand-secondary rounded-full hover:bg-brand-secondary transition-colors">
              <ChevronLeft className="w-6 h-6 text-brand-primary" />
            </button>
            <button className="p-3 border border-brand-secondary rounded-full hover:bg-brand-secondary transition-colors">
              <ChevronRight className="w-6 h-6 text-brand-primary" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group cursor-pointer"
            >
              <div className="aspect-4/5 overflow-hidden rounded-card border border-brand-secondary mb-6">
                <img
                  src={project.thumbnail || "https://placehold.co/600x800"}
                  alt={project.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 protected-image"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <h3 className="text-xl font-bold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors font-heading">
                {project.name}
              </h3>
              <div className="flex items-center text-text-muted">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm font-body">
                  {project.location || "Đang cập nhật"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
