import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { User } from "better-auth/types";
import { SearchForm } from "./searchForm";
import { Category } from "@/types/category.type";


type Props = {
  categories: Category[];
  cartCount?: number;
  user?: User | null;
};

export function Header({ categories, cartCount = 0, user }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu sheet */}
        <MobileNav categories={categories} user={user} />

        {/* Store Brand Link */}
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          store
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="ml-4 hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/products" />}
                className={navigationMenuTriggerStyle()}
              >
                Shop
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-100 grid-cols-2 gap-1 p-2">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <NavigationMenuLink
                        render={<Link href={`/categories/${c.slug}`} />}
                      >
                        {c.name}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/products?sort=newest" />}
                className={navigationMenuTriggerStyle()}
              >
                New arrivals
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search */}
        <SearchForm className="ml-auto hidden max-w-sm flex-1 md:block" />

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            render={<Link href="/cart" />}
            nativeButton={false}
          >
            <ShoppingBag />
            <span className="sr-only">Cart, {cartCount} items</span>
            {cartCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {cartCount > 9 ? "9+" : cartCount}
              </Badge>
            )}
          </Button>

          {/* User Account Menu */}
          <UserMenu user={user} />
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="border-t px-4 py-2 md:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
