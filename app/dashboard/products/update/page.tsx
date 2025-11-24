"use client";
import { trpc } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import AddUpdateProductForm from "../add-update-product";
import { Suspense } from "react";

function UpdateProductPageContent() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { data, isLoading, error } = trpc.products.getProductById.useQuery({ id });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error.message}</div>;
  if (!data) return <div className="p-8">Product not found</div>;

  // Map nulls to empty string for form compatibility
  const initialValues = {
    id: data.id,
    name: data.name ?? "",
    description: data.description ?? "",
    price: data.price ?? 0,
    image: data.image ?? "",
  };

  return <AddUpdateProductForm mode="update" initialValues={initialValues} />;
}

export default function UpdateProductPage() {
  return (
    <Suspense>
      <UpdateProductPageContent />
    </Suspense>
  );
}
