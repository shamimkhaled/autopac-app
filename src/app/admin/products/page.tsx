'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Filter, ExternalLink, MoreVertical, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  categoryId: string;
  category?: { nameEn: string };
  images: string | string[];
  featured: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this machine?')) return;
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.slug !== slug));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Machine Inventory</h1>
          <p className="text-gray-500 font-medium">Manage your product catalog and technical specs</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 px-8 py-4 bg-action-orange text-white font-black rounded-3xl shadow-xl shadow-action-orange/30 hover:bg-orange-600 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
          Add New Machine
        </Link>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or slug..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-action-orange/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-px h-8 bg-gray-200 hidden md:block" />
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="flex-1 md:flex-none bg-transparent text-sm font-bold text-industrial-dark outline-none cursor-pointer pr-8">
              <option>All Categories</option>
              <option>Packing Machines</option>
              <option>Processing Units</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
            <p className="text-gray-500 font-medium uppercase tracking-widest animate-pulse">Scanning Inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 opacity-30" />
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-industrial-dark opacity-40 uppercase tracking-tight">Catalog is empty</p>
              <p className="text-gray-400 mt-1">Start by adding your first industrial machine</p>
            </div>
            <Link href="/admin/products/new" className="px-8 py-3 bg-industrial-dark text-white font-bold rounded-2xl">Create Product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Machine Info</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="text-right py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => {
                  let images = [];
                  try {
                    images = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []);
                  } catch (e) {
                    console.error(`Error parsing images for product ${p.id}:`, e);
                  }
                  const firstImage = images[0] || '';
                  
                  return (
                    <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100">
                            {firstImage ? (
                              <Image src={firstImage} alt={p.nameEn} fill className="object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-300 absolute inset-0 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-industrial-dark group-hover:text-action-orange transition-colors">{p.nameEn}</p>
                            <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 font-bold text-[10px] uppercase rounded-lg border border-gray-200">
                          {p.category?.nameEn || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {p.featured ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-action-orange">
                            <span className="w-2 h-2 bg-action-orange rounded-full animate-pulse" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">Standard</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/products/${p.slug}`} 
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-industrial-dark hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            title="View Live"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/admin/products/${p.slug}`} 
                            className="p-2 text-gray-400 hover:text-action-orange hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => deleteProduct(p.slug)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
