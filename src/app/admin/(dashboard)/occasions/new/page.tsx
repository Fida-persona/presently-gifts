import { createOccasionAction } from "@/lib/actions";
import OccasionForm from "@/components/OccasionForm";

export default function NewOccasionPage() {
  return <OccasionForm action={createOccasionAction} />;
}
