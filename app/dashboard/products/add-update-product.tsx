"use client";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type AddUpdateProductFormProps = {
  initialValues?: {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    image?: string;
  };
  mode: "add" | "update";
};

export default function AddUpdateProductForm({ initialValues, mode }: AddUpdateProductFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: initialValues || {
      name: "",
      description: "",
      price: 0,
      image: "",
    },
  });

  const addMutation = trpc.products.addProduct.useMutation();
  const updateMutation = trpc.products.updateProduct.useMutation();

  const onSubmit = async (data: any) => {
    if (mode === "add") {
      await addMutation.mutateAsync({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image,
      });
    } else if (mode === "update" && initialValues?.id) {
      await updateMutation.mutateAsync({
        id: initialValues.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image,
      });
    }
    router.push("/dashboard/products");
  };

  return (
    <div className="max-w-xl mx-auto ">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            {mode === "add" ? "Add Product" : "Update Product"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input {...register("name", { required: true })} placeholder="Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register("description")} placeholder="Description" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input {...register("price", { required: true })} type="number" placeholder="Price" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input {...register("image")} placeholder="Image URL" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-150"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting
              ? mode === "add"
                ? "Adding..."
                : "Updating..."
              : mode === "add"
              ? "Add Product"
              : "Update Product"}
          </button>
          {(addMutation.error || updateMutation.error) && (
            <div className="text-red-500 text-center mt-2">
              {addMutation.error?.message || updateMutation.error?.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
