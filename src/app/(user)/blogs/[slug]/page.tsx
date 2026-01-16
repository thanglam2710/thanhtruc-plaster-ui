"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetBlogBySlug } from "@/hooks/user/blogs/useBlogs";
import { ArrowLeft, Eye, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getValidImageUrl } from "@/lib/utils/image";

function BlogDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: blog, isLoading, error } = useGetBlogBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="animate-spin h-12 w-12 border-4 border-brand-secondary border-t-transparent rounded-full inline-block"></span>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Không tìm thấy bài viết này.</p>
          <Button onClick={() => router.push("/blogs")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách bài viết
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <Link href="/blogs">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4">
            {blog.blogTypeName && (
              <Badge className="bg-brand-secondary hover:bg-brand-secondary/90 text-white px-4 py-1.5 text-sm">
                <Tag className="w-3.5 h-3.5 mr-1.5" />
                {blog.blogTypeName}
              </Badge>
            )}
            
            {blog.viewCount !== undefined && (
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{blog.viewCount.toLocaleString()} lượt xem</span>
              </div>
            )}

            {blog.publishedDate && (
              <span className="text-sm text-gray-500">
                {formatDate(blog.publishedDate)}
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail - Full width 16:9 */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-12">
          <Image
            src={getValidImageUrl(blog.thumbnail)}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Summary - Highlight Box */}
        {blog.summary && (
          <div className="mb-12">
            <div className="bg-amber-50 border-l-4 border-brand-secondary rounded-r-xl p-6 md:p-8">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium italic">
                {blog.summary}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {blog.content && (
          <div className="mb-16">
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
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        )}

        {/* Author Info (if available) */}
        {blog.authorName && (
          <div className="border-t border-gray-200 pt-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                <span className="text-brand-secondary font-semibold text-lg">
                  {blog.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tác giả</p>
                <p className="font-semibold text-gray-900">{blog.authorName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Back to List Button */}
        <div className="text-center pb-16">
          <Link href="/blogs">
            <Button size="lg" variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Xem thêm bài viết khác
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="animate-spin h-12 w-12 border-4 border-brand-secondary border-t-transparent rounded-full"></span>
        </div>
      }
    >
      <BlogDetailContent />
    </Suspense>
  );
}
