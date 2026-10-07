"use server";

import { login, signUp } from "@/services/auth.service";
import { LoginInput, SignupInput } from "@/services/auth.validation";
import { LoginErrors, SignupErrors } from "@/types/auth.type";

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

  return {};
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

  return {};
}
