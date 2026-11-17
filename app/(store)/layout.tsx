import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCategories } from "@/services/category/category.service";
import { getCartCount } from "@/services/cart/cart.service";
import { StorefrontBackground } from "@/components/store/storefrontBackground";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  const [categories, cartCount] = await Promise.all([
    getCategories(),
    user ? getCartCount(user.id) : Promise.resolve(0),
  ]);

  return (
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <StorefrontBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header categories={categories} cartCount={cartCount} user={user} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} />
      </div>
    </div>
  );
}
