import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PaymentScheduleDetailPage } from "../components/PaymentScheduleDetailPage";

export default async function Page({
  params,
}: {
  params: { listPaymentId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <PaymentScheduleDetailPage listPaymentId={params.listPaymentId} />;
}
