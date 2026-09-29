import { notFound } from "next/navigation";
import { getGiftWrapById } from "@/lib/data";
import { updateGiftWrapAction } from "@/lib/actions";
import GiftWrapForm from "@/components/GiftWrapForm";

export default async function EditGiftWrapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const giftWrap = await getGiftWrapById(Number(id));
  if (!giftWrap) notFound();

  const action = updateGiftWrapAction.bind(null, giftWrap.id);
  return <GiftWrapForm action={action} giftWrap={giftWrap} />;
}
