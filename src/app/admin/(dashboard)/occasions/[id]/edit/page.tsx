import { notFound } from "next/navigation";
import { getOccasionById } from "@/lib/data";
import { updateOccasionAction } from "@/lib/actions";
import OccasionForm from "@/components/OccasionForm";

export default async function EditOccasionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const occasion = await getOccasionById(Number(id));
  if (!occasion) notFound();

  const action = updateOccasionAction.bind(null, occasion.id);
  return <OccasionForm action={action} occasion={occasion} />;
}
