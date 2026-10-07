"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signupAction } from "@/app/actions/auth.action";

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

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, {});

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">
            Create your account
          </CardTitle>

          <CardDescription>
            Enter your details below to get started.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              disabled={isPending}
              aria-invalid={!!state?.errors?.name}
              aria-describedby={state?.errors?.name ? "name-error" : undefined}
            />

            {state?.errors?.name?.[0] && (
              <p id="name-error" className="text-sm text-destructive">
                {state.errors.name[0]}
              </p>
            )}
          </div>

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
              <p id="email-error" className="text-sm text-destructive">
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
              autoComplete="new-password"
              disabled={isPending}
              aria-invalid={!!state?.errors?.password}
              aria-describedby={
                state?.errors?.password ? "password-error" : undefined
              }
            />

            {state?.errors?.password?.[0] && (
              <p id="password-error" className="text-sm text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              aria-invalid={!!state?.errors?.confirmPassword}
              aria-describedby={
                state?.errors?.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
            />

            {state?.errors?.confirmPassword?.[0] && (
              <p
                id="confirm-password-error"
                className="text-sm text-destructive"
              >
                {state.errors.confirmPassword[0]}
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
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-muted-foreground text-center text-xs leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <div className="mt-6 border-t pt-6">
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
