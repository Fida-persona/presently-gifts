import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { getGiftWraps, getUserById } from "@/lib/data";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in?next=/checkout");

  const user = await getUserById(userId);
  if (!user) redirect("/sign-in?next=/checkout");

  const giftWraps = await getGiftWraps();

  return <CheckoutForm user={user} giftWraps={giftWraps} />;
}
