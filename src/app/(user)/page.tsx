import { Hero } from "@/components/user/home/hero";
import { ProductGrid } from "@/components/user/home/product-grid";
import { SolutionFinder } from "@/components/user/home/solution-finder";
import { FeaturedProjects } from "@/components/user/home/featured-projects";
import { Navbar } from "@/components/user/layout/navbar";
import { Footer } from "@/components/user/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <Hero />
        <ProductGrid />
        <SolutionFinder />
        <FeaturedProjects />
      </main>
      <Footer />
    </div>
  );
}
