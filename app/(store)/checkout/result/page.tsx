import { PaymobRedirectCallbackParams } from "@/types/payment.type";

type PageProps = {
  searchParams: Promise<PaymobRedirectCallbackParams>;
};

export default async function resultPage({ searchParams }: PageProps) {
  const { success } = await searchParams;
  return <>{success}</>;
}
