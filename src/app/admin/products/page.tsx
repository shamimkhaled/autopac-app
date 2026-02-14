'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<{ id: string; slug: string; nameEn: string }[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-industrial-dark">Products</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-action-orange text-white rounded-lg font-medium">
          Add Product
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-industrial-light">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Slug</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">{p.nameEn}</td>
                <td className="p-4 text-industrial-silver">{p.slug}</td>
                <td className="p-4">
                  <Link href={`/admin/products/${p.slug}`} className="text-action-orange hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
