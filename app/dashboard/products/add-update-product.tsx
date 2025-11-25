"use client";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.preprocess((val) => (val === "" ? NaN : Number(val)), z.number({ error: "Price is required" }).nonnegative("Price must be a number >= 0")),
    image: z.string().optional(),
  });

  type ProductForm = z.infer<typeof productSchema>;

  const resolver = zodResolver(productSchema) as unknown as Resolver<ProductForm>;

  const { setValue, register, handleSubmit, formState } = useForm<ProductForm>({
    resolver,
    mode: "onTouched",
    defaultValues: (initialValues as any) || {
      name: "",
      description: "",
      price: 0,
      image: "",
    },
  });

  const addMutation = trpc.products.addProduct.useMutation();
  const updateMutation = trpc.products.updateProduct.useMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setUploadedImageUrl(data.url);
        setValue("image", data.url);
      }
    } catch (err) {
      // Optionally handle error
    }
    setUploading(false);
  };

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
      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            {mode === "add" ? "Add Product" : "Update Product"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input {...register("name")} placeholder="Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">{String(formState.errors.name.message)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register("description")} placeholder="Description" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
            </div>
              {formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">{String(formState.errors.description.message)}</p>
              )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input {...register("price")} type="number" placeholder="Price" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {formState.errors.price && (
                <p className="text-red-500 text-xs mt-1">{String(formState.errors.price.message)}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                disabled={uploading}
              />
              <button
                type="button"
                className="py-2 px-4 bg-blue-500 text-white rounded w-full"
                onClick={() => document.getElementById("hiddenFileInput")?.click()}
                disabled={uploading}
              >
                
                {imageFile ? "Change Image" : "Upload Image"}
              </button>
              <div className="mt-2">
                {!imageFile && !uploadedImageUrl && (
                  <div className="text-xs text-gray-500">No file chosen</div>
                )}
                {imageFile && (
                  <div className="text-xs text-gray-700 mb-1">Selected file: {imageFile.name}</div>
                )}
                {
                  uploading && <div className="text-xs text-gray-500">Uploading...</div>
                }
                {uploadedImageUrl && (
                  <>
                    {/* <img src={uploadedImageUrl} alt="Preview" className="max-h-32 rounded" /> */}
                    <div className="text-xs text-gray-500">Image uploaded!</div>
                  </>
                )}
              </div>
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
