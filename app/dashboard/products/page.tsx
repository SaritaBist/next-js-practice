"use client";
import { trpc } from "@/lib/utils";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

export default function ProductsPage() {
  const { data, isLoading, error, refetch } = trpc.products.getAllProducts.useQuery();
  const deleteMutation = trpc.products.deleteProduct.useMutation();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <a
          href="/dashboard/products/add"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
        >
          + Add Product
        </a>
      </div>
      <div className="bg-white rounded shadow p-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error.message}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data || []).map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{`$${product.price}`}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <img src={product.image} alt="Product" className="h-10 w-10 object-cover rounded" />
                    ) : null}
                  </TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <a
                        href={`/dashboard/products/update?id=${product.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onClick={() => setConfirmId(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                    {/* Confirmation Dialog */}
                    {confirmId === product.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
                          <p className="mb-6 text-gray-600">Are you sure you want to delete this product?</p>
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                              onClick={async () => {
                                await deleteMutation.mutateAsync({ id: product.id });
                                setConfirmId(null);
                                refetch();
                              }}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                          {deleteMutation.error && (
                            <div className="text-red-500 mt-2 text-sm text-center">{deleteMutation.error.message}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total Products: {(data || []).length}</TableCell>
              </TableRow>
            </TableFooter>
            <TableCaption>List of all products</TableCaption>
          </Table>
        )}
      </div>
    </div>
  );
}
