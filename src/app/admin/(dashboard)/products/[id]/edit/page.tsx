import { notFound } from "next/navigation";
import { getCategories, getOccasions, getProductById } from "@/lib/data";
import { updateProductAction } from "@/lib/actions";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  const categories = await getCategories();
  const occasions = await getOccasions();
  const action = updateProductAction.bind(null, product.id);

  return <ProductForm action={action} categories={categories} occasions={occasions} product={product} />;
}
