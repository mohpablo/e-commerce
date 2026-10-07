"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction } from "@/app/actions/auth.action";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">
            Welcome back
          </CardTitle>

          <CardDescription>
            Enter your email and password to sign in to your account.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!state?.errors?.email}
              aria-describedby={
                state?.errors?.email ? "email-error" : undefined
              }
            />

            {state?.errors?.email?.[0] && (
              <p id="email-error" className="text-destructive text-sm">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isPending}
              aria-invalid={!!state?.errors?.password}
              aria-describedby={
                state?.errors?.password ? "password-error" : undefined
              }
            />

            {state?.errors?.password?.[0] && (
              <p id="password-error" className="text-destructive text-sm">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {/* General error */}
          {state?.errors?._form?.[0] && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
            >
              {state.errors._form[0]}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 border-t pt-6">
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
