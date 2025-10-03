import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListPaymentSchedulePage } from "./components/ListPaymentSchedulePage";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ListPaymentSchedulePage />;
}
