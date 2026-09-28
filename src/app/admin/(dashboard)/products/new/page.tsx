import { getCategories, getOccasions } from "@/lib/data";
import { createProductAction } from "@/lib/actions";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();
  const occasions = await getOccasions();
  return <ProductForm action={createProductAction} categories={categories} occasions={occasions} />;
}
