export default async function ProductPage({
  params,
}: PageProps<"/products/[product]">) {
  const { product } = await params;
  return product;
}
