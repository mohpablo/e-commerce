import { LoginInput, SignupInput } from "@/services/auth.validation";

export type SignupErrors = Partial<Record<keyof SignupInput, string[]>> & {
  _form?: string[];
};

export type LoginErrors = Partial<Record<keyof LoginInput, string[]>> & {
  _form?: string[];
};
