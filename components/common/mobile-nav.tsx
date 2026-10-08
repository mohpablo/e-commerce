"use client";

import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { User } from "better-auth/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Category } from "@/types/category.type";
import { logoutAction } from "@/app/actions/auth.action";


type Props = {
  categories: Category[];
  user?: User | null;
};


const mobileLink =
  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted";

export function MobileNav({ categories, user }: Props) {
  const initial = user?.name?.charAt(0).toUpperCase();
  return (
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

      <SheetContent side="left" className="w-75 flex flex-col">
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

        <SheetFooter className="mt-auto flex-col gap-2">
          <Separator className="mb-2" />
          {user ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="size-8">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name} />
                  )}
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center rounded-full text-destructive hover:text-destructive"
                onClick={() => logoutAction()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
