'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Mail,
  Phone,
  Building,
  Trash2,
  Loader2,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Paperclip,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface QuoteAttachment {
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  productInterest?: string;
  message: string;
  attachments?: string | null;
  status: 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
}

function parseAttachments(raw?: string | null): QuoteAttachment[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const PAGE_SIZE = 15;
const STATUS_OPTIONS: Array<'ALL' | QuoteRequest['status']> = ['ALL', 'PENDING', 'REVIEWED', 'RESPONDED', 'CLOSED'];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | QuoteRequest['status']>('ALL');
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quote');
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setNotice({ type: 'err', text: 'Failed to load quotation requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateStatus = async (id: string, status: QuoteRequest['status']) => {
    try {
      const res = await fetch(`/api/quote/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
        if (selectedQuote?.id === id) setSelectedQuote((prev) => (prev ? { ...prev, status } : null));
        setNotice({ type: 'ok', text: `Lead marked ${status.toLowerCase()}.` });
      }
    } catch (e) {
      console.error(e);
      setNotice({ type: 'err', text: 'Failed to update lead status.' });
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/quote/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        if (selectedQuote?.id === id) setSelectedQuote(null);
        setConfirmDeleteId(null);
        setNotice({ type: 'ok', text: 'Quotation request deleted.' });
      }
    } catch (e) {
      console.error(e);
      setNotice({ type: 'err', text: 'Failed to delete quotation.' });
    }
  };

  const countsByStatus = useMemo(
    () => ({
      ALL: quotes.length,
      PENDING: quotes.filter((q) => q.status === 'PENDING').length,
      REVIEWED: quotes.filter((q) => q.status === 'REVIEWED').length,
      RESPONDED: quotes.filter((q) => q.status === 'RESPONDED').length,
      CLOSED: quotes.filter((q) => q.status === 'CLOSED').length,
    }),
    [quotes]
  );

  const filteredQuotes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return quotes.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.companyName?.toLowerCase().includes(q) ?? false) ||
        (item.productInterest?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [quotes, statusFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredQuotes.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const exportCsv = () => {
    const headers = ['Date', 'Name', 'Company', 'Phone', 'Email', 'Product Interest', 'Status', 'Attachments', 'Message'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = filteredQuotes.map((q) => [
      new Date(q.createdAt).toISOString().slice(0, 10),
      q.name,
      q.companyName || '',
      q.phone,
      q.email,
      q.productInterest || '',
      q.status,
      parseAttachments(q.attachments).map((a) => a.url).join(' | '),
      q.message,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => escape(String(c))).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autopac-quotations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadgeClass = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'REVIEWED':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'RESPONDED':
        return 'bg-brand-paper text-brand-maroon border-brand-maroon/30';
      case 'CLOSED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Quotation inquiries
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Review buyer specifications, update CRM lead stages, or export leads for sales follow-up.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filteredQuotes.length === 0}
          className="btn-secondary disabled:opacity-40 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export CSV ({filteredQuotes.length})
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-md border text-sm ${
            notice.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="p-1" aria-label="Dismiss notice">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="surface-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter leads by status">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={statusFilter === st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors tabular-nums ${
                  statusFilter === st
                    ? 'bg-brand-maroon text-white border-brand-maroon'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()} ({countsByStatus[st]})
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="search"
              placeholder="Search name, company, machine..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="input-field pl-9 h-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
            <p className="text-sm text-stone-500">Loading inquiries…</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-stone-200 rounded-md">
            <Mail className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">No quotation requests match your filter.</p>
          </div>
        ) : (
          <>
            {/* Desktop CRM Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    <th className="py-3 pr-4">Client / Company</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Machine Interest</th>
                    <th className="py-3 px-3">Stage</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pageItems.map((q) => (
                    <tr key={q.id} className="hover:bg-brand-paper/40 transition-colors">
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-stone-900">{q.name}</p>
                        {q.companyName && (
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            {q.companyName}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <a href={`tel:${q.phone}`} className="block text-stone-700 hover:text-brand-maroon tabular-nums">
                          {q.phone}
                        </a>
                        <a href={`mailto:${q.email}`} className="block text-xs text-stone-500 hover:text-brand-maroon truncate max-w-[180px]">
                          {q.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-stone-800 max-w-[180px] truncate">
                            {q.productInterest || 'General inquiry'}
                          </p>
                          {parseAttachments(q.attachments).length > 0 && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-brand-paper text-brand-maroon text-[10px] font-semibold border border-brand-maroon/20 shrink-0"
                              title="Has attachments"
                            >
                              <Paperclip className="w-2.5 h-2.5" />
                              {parseAttachments(q.attachments).length}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 max-w-[200px] truncate">{q.message}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <select
                          aria-label={`Status for ${q.name}`}
                          value={q.status}
                          onChange={(e) => updateStatus(q.id, e.target.value as QuoteRequest['status'])}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border outline-none cursor-pointer ${statusBadgeClass(q.status)}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="RESPONDED">Responded</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-stone-500 tabular-nums whitespace-nowrap">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedQuote(q)}
                            className="p-2 text-stone-500 hover:text-brand-maroon rounded-md hover:bg-stone-100"
                            title="Inspect full inquiry"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {confirmDeleteId === q.id ? (
                            <div className="inline-flex items-center gap-1 ml-1">
                              <button
                                type="button"
                                onClick={() => deleteQuote(q.id)}
                                className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded-md"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-xs text-stone-600 border border-stone-200 rounded-md"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(q.id)}
                              className="p-2 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {pageItems.map((q) => (
                <div key={q.id} className="p-4 rounded-md border border-stone-200 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-stone-900">{q.name}</p>
                      {q.companyName && <p className="text-xs text-stone-500">{q.companyName}</p>}
                    </div>
                    <span className="text-xs text-stone-400 tabular-nums">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-maroon">{q.productInterest || 'General inquiry'}</p>
                  <p className="text-sm text-stone-600 line-clamp-2">{q.message}</p>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    <select
                      aria-label={`Status for ${q.name}`}
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value as QuoteRequest['status'])}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border ${statusBadgeClass(q.status)}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="RESPONDED">Responded</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(q)}
                        className="btn-secondary text-xs min-h-[36px] px-3 py-1"
                      >
                        Details
                      </button>
                      {confirmDeleteId === q.id ? (
                        <button
                          type="button"
                          onClick={() => deleteQuote(q.id)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-md"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(q.id)}
                          className="p-2 text-stone-400 hover:text-red-600"
                          aria-label="Delete quotation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs text-stone-500">
                <span className="tabular-nums">
                  Page {safePage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn-secondary text-xs min-h-[36px] px-3 py-1 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="btn-secondary text-xs min-h-[36px] px-3 py-1 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Inspect Inquiry Modal */}
      {selectedQuote && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4"
          onClick={() => setSelectedQuote(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Quotation details"
        >
          <div
            className="bg-white border border-stone-200 rounded-md max-w-lg w-full p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <p className="section-kicker">Inquiry · {new Date(selectedQuote.createdAt).toLocaleString()}</p>
                <h3 className="font-display text-2xl font-semibold text-stone-900 mt-1">
                  {selectedQuote.name}
                </h3>
                {selectedQuote.companyName && (
                  <p className="text-sm text-stone-500">{selectedQuote.companyName}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-md"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a
                href={`tel:${selectedQuote.phone}`}
                className="p-3 rounded-md border border-stone-200 hover:border-brand-maroon flex items-center gap-2.5"
              >
                <Phone className="w-4 h-4 text-brand-maroon shrink-0" />
                <span className="tabular-nums truncate">{selectedQuote.phone}</span>
              </a>
              <a
                href={`mailto:${selectedQuote.email}`}
                className="p-3 rounded-md border border-stone-200 hover:border-brand-maroon flex items-center gap-2.5"
              >
                <Mail className="w-4 h-4 text-brand-maroon shrink-0" />
                <span className="truncate">{selectedQuote.email}</span>
              </a>
            </div>

            <div>
              <p className="field-label">Machine requested</p>
              <p className="text-sm font-semibold text-brand-maroon">
                {selectedQuote.productInterest || 'General inquiry'}
              </p>
            </div>

            <div>
              <p className="field-label">Client message</p>
              <p className="text-sm text-stone-700 bg-brand-paper/60 border border-stone-200 rounded-md p-4 whitespace-pre-line leading-relaxed">
                {selectedQuote.message}
              </p>
            </div>

            {parseAttachments(selectedQuote.attachments).length > 0 && (
              <div>
                <p className="field-label">
                  Attachments ({parseAttachments(selectedQuote.attachments).length})
                </p>
                <div className="space-y-2">
                  {parseAttachments(selectedQuote.attachments).map((att) => (
                    <a
                      key={att.url}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 p-2.5 rounded-md border border-stone-200 hover:border-brand-maroon bg-stone-50 text-xs transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0 font-medium text-stone-800">
                        <FileText className="w-4 h-4 text-brand-maroon shrink-0" />
                        <span className="truncate">{att.name}</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200">
              <select
                value={selectedQuote.status}
                onChange={(e) => updateStatus(selectedQuote.id, e.target.value as QuoteRequest['status'])}
                className={`text-xs font-semibold px-3 py-2 rounded-md border ${statusBadgeClass(selectedQuote.status)}`}
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="RESPONDED">Responded</option>
                <option value="CLOSED">Closed</option>
              </select>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedQuote.email}?subject=${encodeURIComponent(`Auto Pac Quotation: ${selectedQuote.productInterest || 'Machinery Inquiry'}`)}`}
                  className="btn-primary text-xs min-h-[38px] px-4 py-1.5"
                >
                  Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="btn-secondary text-xs min-h-[38px] px-4 py-1.5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
