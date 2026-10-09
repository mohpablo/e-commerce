"use server";

import {
  login,
  logout,
  signInWithGoogle,
  signUp,
} from "@/services/auth/auth.service";
import { LoginInput, SignupInput } from "@/services/auth/auth.validation";
import { LoginErrors, SignupErrors } from "@/types/auth.type";
import { redirect } from "next/navigation";

export type SignupState = {
  errors?: SignupErrors;
};
export async function signupAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const raw = Object.fromEntries(formData);
  const data = raw as unknown as SignupInput;

  const result = await signUp(data);

  if (!result.success) {
    return { errors: result.errors };
  }

  redirect("/");
}

export type LoginState = {
  errors?: LoginErrors;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const raw = Object.fromEntries(formData);
  const data = raw as unknown as LoginInput;

  const result = await login(data);

  if (!result.success) {
    return { errors: result.errors };
  }

  redirect("/");
}

export async function logoutAction() {
  await logout();
}

export async function signInWithGoogleAction() {
  let url: string | undefined;

  try {
    const result = await signInWithGoogle();
    url = result.url;
  } catch (error) {
    console.error(error);
    return;
  }

  if (url) {
    redirect(url);
  }
}
