import { Hero } from "@/components/user/home/hero";
import { ProductGrid } from "@/components/user/home/product-grid";
import { SolutionFinder } from "@/components/user/home/solution-finder";
import { FeaturedProjects } from "@/components/user/home/featured-projects";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <Hero />
        <ProductGrid />
        <SolutionFinder />
        <FeaturedProjects />
      </main>
    </div>
  );
}
