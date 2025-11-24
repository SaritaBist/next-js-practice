"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col p-4">
      <h3 className="text-xl font-bold mb-8">Dashboard</h3>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard/products" className="hover:bg-gray-700 rounded px-3 py-2">List Products</Link>
        <Link href="/dashboard/products/add" className="hover:bg-gray-700 rounded px-3 py-2">Add Product</Link>
       
      </nav>
    </aside>
  );
}
