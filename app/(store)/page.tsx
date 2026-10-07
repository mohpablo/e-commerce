import { CategoryGrid } from "@/components/store/categoryGrid";
import { Hero } from "@/components/store/hero";
import { ProductSection } from "@/components/store/productSection";
import { PromoBanner } from "@/components/store/promoBanner";
import { getHomeData } from "@/services/home/home.service";


export default async function Home() {
  const { categories, newest, popular } = await getHomeData();

  return (
    <>
      <Hero products={newest} />
      <CategoryGrid categories={categories} />
      <ProductSection
        title="New arrivals"
        description="The latest additions to the store."
        href="/products?sort=newest"
        products={newest}
      />
      <PromoBanner />
      <ProductSection
        title="Popular right now"
        description="What customers are ordering most."
        href="/products"
        cta="See all"
        products={popular}
        className="pb-20 pt-10"
      />
    </>
  );
}