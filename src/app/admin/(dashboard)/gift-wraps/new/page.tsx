import { createGiftWrapAction } from "@/lib/actions";
import GiftWrapForm from "@/components/GiftWrapForm";

export default function NewGiftWrapPage() {
  return <GiftWrapForm action={createGiftWrapAction} />;
}
