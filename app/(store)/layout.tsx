import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCategories } from "@/services/category/category.service";


export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;
  const cartCount = 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header categories={categories} cartCount={cartCount} user={user} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}
