import { Header, type HeaderUser } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { getNavCategories } from "@/services/category/category.service";


export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navCategories = await getNavCategories();

  // TODO: replace with your Better Auth session + cart count, e.g.
  // const session = await auth.api.getSession({ headers: await headers() });
  const user: HeaderUser = null;
  const cartCount = 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header categories={navCategories} cartCount={cartCount} user={user} />
      <main className="flex-1">{children}</main>
      <Footer categories={navCategories} />
    </div>
  );
}
