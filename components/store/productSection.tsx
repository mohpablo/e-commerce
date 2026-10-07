import { ProductCardData } from "@/services/home/home.service";
import { ProductCard } from "../products/productCard";
import { SectionHeading } from "./sectionHeading";

type Props = {
  title: string;
  description?: string;
  href: string;
  cta?: string;
  products: ProductCardData[];
  className?: string;
};

export function ProductSection({
  title,
  description,
  href,
  cta,
  products,
  className = "py-10",
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <SectionHeading
        title={title}
        description={description}
        href={href}
        cta={cta}
      />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
