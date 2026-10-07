"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signInWithGoogleAction, signupAction } from "@/app/actions/auth.action";

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

  const handleGoogleSignUp = async () => {
    await signInWithGoogleAction();
    console.log("oauth");
  };

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
        {/* Google OAuth */}

        <Button
          type="button"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isPending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-4"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
            />
            <path
              fill="#34A853"
              d="M12 21.91c2.63 0 4.84-.87 6.45-2.29l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.75 9.75 0 0 0 12 21.91Z"
            />
            <path
              fill="#FBBC05"
              d="M6.54 14.08A5.86 5.86 0 0 1 6.23 12c0-.72.12-1.42.31-2.08v-2.5H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.58l3.24-2.5Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.89c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 2.99 14.63 2.09 12 2.09A9.75 9.75 0 0 0 3.3 7.42l3.24 2.5C7.31 7.61 9.46 5.89 12 5.89Z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs uppercase">
            Or continue with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
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
