import { auth } from "@/lib/auth";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "./auth.validation";
import { ServiceResult } from "@/types/ServiceResult";
import { z } from "zod";

export async function signUp(input: SignupInput): Promise<ServiceResult> {
  const result = signupSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: {
        _form: ["Something went wrong while creating your account."],
      },
    };
  }
}

export async function login(input: LoginInput): Promise<ServiceResult> {
  const result = loginSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: {
        _form: ["Something went wrong while signing in your account."],
      },
    };
  }
}

export async function signInWithGoogle() {
  return auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/",
    },
  });
}
