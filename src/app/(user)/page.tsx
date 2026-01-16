import { Hero } from "@/components/user/home/hero";
import { CategoryParentGrid } from "@/components/user/home/category-parent-grid";
import { SolutionFinder } from "@/components/user/home/solution-finder";
import { FeaturedProjects } from "@/components/user/home/featured-projects";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <Hero />
        <CategoryParentGrid />
        <SolutionFinder />
        <FeaturedProjects />
      </main>
    </div>
  );
}
