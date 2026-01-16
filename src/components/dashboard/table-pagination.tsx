import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  // Smart pagination logic
  const createPageList = () => {
    const pages: (number | "...")[] = [];
    const add = (value: number | "...") => pages.push(value);
    const near = [currentPage - 1, currentPage, currentPage + 1];

    // First page
    add(1);

    // Dots before near pages
    if (currentPage > 3) add("...");

    // Pages near current
    near.forEach((p) => {
      if (p > 1 && p < totalPages) add(p);
    });

    // Dots after near pages
    if (currentPage < totalPages - 2) add("...");

    // Last page
    if (totalPages > 1) add(totalPages);

    return pages;
  };

  const pages = createPageList();

  const renderButton = (page: number) => {
    const isActive = page === currentPage;

    return (
      <Button
        key={page}
        className={
          isActive
            ? "bg-brand-secondary text-black hover:bg-brand-secondary/90"
            : "text-gray-700"
        }
        variant={isActive ? "default" : "outline"}
        size="icon"
        onClick={() => onPageChange(page)}
      >
        {page}
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Previous */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      {pages.map((p, index) =>
        p === "..." ? (
          <span key={`dots-${index}`} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          renderButton(p)
        )
      )}

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
