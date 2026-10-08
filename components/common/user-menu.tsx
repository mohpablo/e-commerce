"use client";

import Link from "next/link";
import {
  LogIn,
  LogOut,
  Package,
  Settings,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import { User } from "better-auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth.action";

type Props = {
  user?: User | null;
};

export function UserMenu({ user }: Props) {
  const initial = user?.name?.charAt(0).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="size-9 rounded-full p-0" />}
      >
        <Avatar className="size-8">
          {user?.image && (
            <AvatarImage
              src={user.image}
              alt={user.name ?? "User avatar"}
              referrerPolicy="no-referrer"
            />
          )}
          <AvatarFallback
            className={!user ? "bg-muted text-muted-foreground" : ""}
          >
            {user ? initial : <UserIcon className="size-4" />}
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">Account menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
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
              <Package className="mr-2 size-4 text-muted-foreground" />
              Orders
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/account" />}>
              <Settings className="mr-2 size-4 text-muted-foreground" />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => logoutAction()}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
                <span className="text-sm font-semibold text-foreground">
                  Welcome to store
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  Sign in or create an account to manage orders and settings.
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/login" />}>
              <LogIn className="mr-2 size-4 text-muted-foreground" />
              Sign in
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/signup" />}>
              <UserPlus className="mr-2 size-4 text-muted-foreground" />
              Create account
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
