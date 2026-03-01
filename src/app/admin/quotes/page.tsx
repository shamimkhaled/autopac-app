'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, Building, Calendar, CheckCircle, Clock, Trash2, Loader2, Search, Filter } from 'lucide-react';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  productInterest?: string;
  message: string;
  status: 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quote');
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/quote/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: status as any } : q));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm('Delete this quotation request?')) return;
    try {
      const res = await fetch(`/api/quote/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotes(quotes.filter(q => q.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RESPONDED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CLOSED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark tracking-tight uppercase">Quotation Requests</h1>
          <p className="text-gray-500 font-medium">Manage leads and potential business inquiries</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-9 pr-4 py-2 bg-transparent text-sm font-medium outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-px h-6 bg-gray-200" />
          <div className="flex items-center gap-2 px-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              className="bg-transparent text-sm font-bold text-industrial-dark outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="RESPONDED">Responded</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse uppercase tracking-widest">Accessing Lead Database...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 opacity-30" />
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-industrial-dark opacity-40 uppercase tracking-tight">No leads found</p>
            <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredQuotes.map((q) => (
            <div key={q.id} className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-8 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(q.status)}`}>
                      {q.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-industrial-dark mb-4 leading-tight">{q.name}</h3>
                  
                  <div className="space-y-3">
                    <a href={`mailto:${q.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-action-orange transition-colors">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-action-orange group-hover:border-orange-100 transition-all">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{q.email}</span>
                    </a>
                    <a href={`tel:${q.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-action-orange transition-colors">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-action-orange group-hover:border-orange-100 transition-all">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{q.phone}</span>
                    </a>
                    {q.companyName && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{q.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-8 flex flex-col">
                  <div className="mb-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Product Interest</h4>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 text-action-orange rounded-xl font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      {q.productInterest || 'General Inquiry'}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Client Message</h4>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/80 p-6 rounded-2xl border border-gray-100 italic">
                      "{q.message}"
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Quick Actions</h4>
                      <select 
                        onChange={(e) => updateStatus(q.id, e.target.value)}
                        value={q.status}
                        className="text-xs font-bold bg-industrial-dark text-white px-4 py-2 rounded-xl outline-none cursor-pointer hover:bg-black transition-colors"
                      >
                        <option value="PENDING">Mark Pending</option>
                        <option value="REVIEWED">Mark Reviewed</option>
                        <option value="RESPONDED">Mark Responded</option>
                        <option value="CLOSED">Mark Closed</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => deleteQuote(q.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
