'use client';

import { useEffect, useState } from 'react';
import { Package, MessageSquare, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // In a real app, these would come from an API
  const stats = [
    { title: 'Total Products', value: '124', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Quote Requests', value: '48', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Partners', value: '12', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Page Views', value: '8.4k', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-industrial-dark">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-industrial-dark">Recent Quotation Requests</h3>
            <Link href="/admin/quotes" className="text-sm font-medium text-action-orange hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-industrial-dark">Shamim Khaled</p>
                <p className="text-sm text-gray-500">Granules Packing Machine</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-industrial-dark">John Doe</p>
                <p className="text-sm text-gray-500">Juice Filling Line</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Reviewed</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-industrial-dark">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors border border-gray-100 group">
              <Package className="w-8 h-8 text-gray-400 group-hover:text-action-orange mb-3 transition-colors" />
              <span className="font-medium text-industrial-dark group-hover:text-action-orange transition-colors">Add Product</span>
            </Link>
            <Link href="/admin/blog/new" className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors border border-gray-100 group">
              <MessageSquare className="w-8 h-8 text-gray-400 group-hover:text-action-orange mb-3 transition-colors" />
              <span className="font-medium text-industrial-dark group-hover:text-action-orange transition-colors">Write Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
