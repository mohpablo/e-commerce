import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SearchForm } from "./searchForm";
import { NavCategory } from "@/services/category/category.service";

export type HeaderUser = {
  name: string;
  email: string;
  image?: string | null;
} | null;

const mobileLink =
  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted";

export function Header({
  categories,
  cartCount = 0,
  user = null,
}: {
  categories: NavCategory[];
  cartCount?: number;
  user?: HeaderUser;
}) {
  const initial = user?.name?.charAt(0).toUpperCase() ?? "G";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
              />
            }
          >
            <Menu />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>

          <SheetContent side="left" className="w-75">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold tracking-tight">
                store
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4">
              <SheetClose
                nativeButton={false}
                render={<Link href="/products" className={mobileLink} />}
              >
                Shop all
              </SheetClose>
              <SheetClose
                nativeButton={false}
                render={
                  <Link href="/products?sort=newest" className={mobileLink} />
                }
              >
                New arrivals
              </SheetClose>

              <Accordion>
                <AccordionItem value="categories" className="border-b-0">
                  <AccordionTrigger className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted hover:no-underline">
                    Categories
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-0.5 pb-1 pl-3">
                    {categories.map((c) => (
                      <SheetClose
                        key={c.id}
                        nativeButton={false}
                        render={
                          <Link
                            href={`/categories/${c.slug}`}
                            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          />
                        }
                      >
                        {c.name}
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </nav>

            {!user && (
              <SheetFooter className="mt-auto">
                <Separator className="mb-2" />
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/signup"
                      className={buttonVariants({
                        className: "w-full rounded-full",
                      })}
                    />
                  }
                >
                  Create account
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/login"
                      className={buttonVariants({
                        variant: "outline",
                        className: "w-full rounded-full",
                      })}
                    />
                  }
                >
                  Sign in
                </SheetClose>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>

        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          store.
        </Link>

        {/* Desktop nav */}
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

        <SearchForm className="ml-auto hidden max-w-sm flex-1 md:block" />

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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="size-9 rounded-full p-0" />
              }
            >
              <Avatar className="size-8">
                {user?.image && (
                  <AvatarImage src={user.image} alt={user.name} />
                )}
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Account menu</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/orders" />}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/account" />}>
                    Account settings
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem render={<Link href="/login" />}>
                    Sign in
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/signup" />}>
                    Create account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t px-4 py-2 md:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
