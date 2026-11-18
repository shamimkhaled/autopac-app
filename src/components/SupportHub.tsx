'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Markdown from 'react-markdown';
import { useCompany } from '@/hooks/useSiteData';
import { useLocale } from '@/context/LocaleContext';
import {
  Bot,
  MessageCircle,
  PhoneCall,
  Send,
  X,
  FileText,
  RotateCcw,
  Globe,
  Loader2,
  AlertCircle,
  Headphones,
  ArrowUpRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface SupportHubProps {
  showMobileStickyBar?: boolean;
  showWhatsAppButton?: boolean;
  showSupportChat?: boolean;
}

const STARTER_PROMPTS = {
  en: [
    'Which machine packs rice, atta, or dal?',
    'Show RO water plant & bottle filling line',
    'How do I visit your Kawran Bazar showroom?',
  ],
  bn: [
    'চাল, আটা বা মসলা প্যাকিং মেশিন দেখতে চাই',
    'আরও ওয়াটার প্ল্যান্ট ও বোতল ফিলিং লাইন',
    'কাওরান বাজার শোরুমে কীভাবে যোগাযোগ করব?',
  ],
};

export default function SupportHub({
  showMobileStickyBar = true,
  showWhatsAppButton = true,
  showSupportChat = true,
}: SupportHubProps) {
  const pathname = usePathname();
  const [company] = useCompany();
  const { locale } = useLocale();
  const isBn = locale === 'bn';

  const [open, setOpen] = useState(false);
  const [chatLang, setChatLang] = useState<'auto' | 'en' | 'bn'>('auto');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rawWhatsapp = (company?.whatsapp || '8801818496642').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    isBn
      ? 'আসসালামু আলাইকুম, অটো প্যাক মেশিনারি সম্পর্কে জানতে চাই।'
      : 'Hello Auto Pac Engineering Desk, I would like machinery details and pricing.'
  )}`;
  const rawPhone = (company?.phone || '01631769707').split(/[,،\s]+/)[0].trim().replace(/\D/g, '');
  const telHref = rawPhone ? `tel:+88${rawPhone}` : '#';
  const isOnContact = pathname?.startsWith('/contact');

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [open, messages.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!showMobileStickyBar && !showWhatsAppButton && !showSupportChat) {
    return null;
  }

  const sendMessage = async (textOverride?: string) => {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setErrorMsg('');
    setSending(true);

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: chatLang,
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.reply) {
        setErrorMsg(
          data?.error ||
            (isBn
              ? 'সাপোর্ট এজেন্ট থেকে উত্তর পাওয়া যায়নি। অনুগ্রহ করে হোয়াটসঅ্যাপ বা কোটেশন ফর্ম ব্যবহার করুন।'
              : 'Support agent is temporarily unavailable. Please use WhatsApp or the Quotation form below.')
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', text: data.reply },
        ]);
      }
    } catch {
      setErrorMsg(
        isBn
          ? 'নেটওয়ার্ক সংযোগ সমস্যা। সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন।'
          : 'Network error. Please reach us directly on WhatsApp.'
      );
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setErrorMsg('');
  };

  const latestTopic =
    messages.filter((m) => m.role === 'user').slice(-1)[0]?.text || '';
  const whatsappHandoffUrl = latestTopic
    ? `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
        `Hello Auto Pac, regarding: ${latestTopic}`
      )}`
    : whatsappUrl;

  const starters = isBn || chatLang === 'bn' ? STARTER_PROMPTS.bn : STARTER_PROMPTS.en;

  return (
    <>
      {/* 1. MOBILE & PWA STANDALONE UNIFIED BOTTOM DOCK (< md) — Zero Overlapping Floating Stickers */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
        {showMobileStickyBar ? (
          <nav
            aria-label={isBn ? 'দ্রুত যোগাযোগ ও সহায়তা' : 'Quick actions & support'}
            className="bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-[0_-8px_24px_-16px_rgba(28,25,23,0.22)] px-2.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
          >
            <div className="grid grid-flow-col auto-cols-fr gap-2">
              {isOnContact ? (
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-md bg-brand-maroon text-white text-xs font-semibold active:scale-[0.98] transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{isBn ? 'সরাসরি কল' : 'Call Office'}</span>
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-md bg-brand-maroon text-white text-xs font-semibold active:scale-[0.98] transition"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{isBn ? 'কোটেশন' : 'Get Quote'}</span>
                </Link>
              )}

              {showSupportChat && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs font-semibold active:scale-[0.98] transition"
                >
                  <Bot className="w-4 h-4 text-brand-ink shrink-0" aria-hidden="true" />
                  <span className="truncate">{isBn ? 'সহায়তা চ্যাট' : 'Support AI'}</span>
                </button>
              )}

              {showWhatsAppButton && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-md border border-emerald-600/35 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold active:scale-[0.98] transition"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">WhatsApp</span>
                </a>
              )}
            </div>
          </nav>
        ) : (
          (showSupportChat || showWhatsAppButton) && (
            <div className="flex justify-end items-center gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              {showWhatsAppButton && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex items-center gap-1.5 h-11 px-3.5 rounded-md border border-emerald-600/35 bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-md"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              )}
              {showSupportChat && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1.5 h-11 px-4 rounded-md bg-brand-maroon text-white text-xs font-semibold shadow-md"
                >
                  <Headphones className="w-4 h-4" aria-hidden="true" />
                  <span>{isBn ? 'সাপোর্ট এজেন্ট' : 'Ask Agent'}</span>
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* 2. DESKTOP UNIFIED SUPPORT DOCK (md+) */}
      {(showSupportChat || showWhatsAppButton) && !open && (
        <div className="hidden md:flex fixed bottom-5 right-5 z-40 items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md shadow-[0_12px_32px_-12px_rgba(28,25,23,0.28)] overflow-hidden">
          {showSupportChat && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 h-11 px-4 text-xs font-semibold text-stone-900 dark:text-stone-100 hover:bg-brand-paper dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-brand-ink" aria-hidden="true" />
              <span>{isBn ? 'সাপোর্ট এজেন্ট (EN/বাংলা)' : 'Machinery Support'}</span>
            </button>
          )}
          {showSupportChat && showWhatsAppButton && (
            <div className="w-px h-6 bg-stone-200 dark:bg-stone-700" aria-hidden="true" />
          )}
          {showWhatsAppButton && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
              className="inline-flex items-center gap-2 h-11 px-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </a>
          )}
        </div>
      )}

      {/* 3. MULTI-LINGUAL CUSTOMER SUPPORT DRAWER (PWA Full Sheet on Mobile, Card on Desktop) */}
      {open && showSupportChat && (
        <div
          className="fixed inset-0 z-[130] md:inset-auto md:bottom-5 md:right-5 md:w-[410px] md:max-w-[calc(100vw-2rem)] md:h-[580px] md:max-h-[82vh] flex flex-col bg-white dark:bg-stone-950 md:border md:border-stone-200 md:dark:border-stone-800 md:rounded-md md:shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? 'অটো প্যাক সাপোর্ট এজেন্ট' : 'Auto Pac Support Agent'}
        >
          {/* Header */}
          <div className="bg-brand-maroon text-white px-4 py-3 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-base font-semibold leading-tight truncate">
                  {isBn ? 'অটো প্যাক সাপোর্ট এজেন্ট' : 'Auto Pac Engineering Desk'}
                </h2>
                <p className="text-[11px] text-white/80 truncate">
                  {isBn ? 'বাংলা, English এবং বহুভাষী সহায়তা' : 'Multi-lingual · EN / বাংলা / Catalog AI'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetChat}
                  title={isBn ? 'নতুন চ্যাট' : 'New chat'}
                  className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close support chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Language Selector + Human Handoff Bar */}
          <div className="px-3.5 py-2 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold">
              <Globe className="w-3.5 h-3.5 text-stone-400 mr-0.5" aria-hidden="true" />
              {(['auto', 'en', 'bn'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setChatLang(code)}
                  className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                    chatLang === code
                      ? 'bg-brand-maroon text-white border-brand-maroon'
                      : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-brand-maroon'
                  }`}
                >
                  {code === 'auto' ? 'Auto' : code === 'en' ? 'EN' : 'বাংলা'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {showWhatsAppButton && (
                <a
                  href={whatsappHandoffUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3 h-3" aria-hidden="true" />
                  WhatsApp
                </a>
              )}
              <Link
                href={
                  latestTopic
                    ? `/contact?product=${encodeURIComponent(latestTopic.slice(0, 80))}`
                    : '/contact'
                }
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-200 text-[11px] font-semibold hover:border-brand-maroon transition-colors"
              >
                {isBn ? 'কোটেশন' : 'Quote'}
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-paper/50 dark:bg-stone-950">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="surface-card p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink">
                    {isBn ? 'স্বাগতম · Auto Pac Dhaka' : 'Welcome · Auto Pac Dhaka'}
                  </p>
                  <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
                    {isBn
                      ? 'আপনার কারখানার পণ্য (চাল, আটা, চানাচুর, পানি, জুস, তেল বা কসমেটিকস) বা কাঙ্ক্ষিত উৎপাদন ক্ষমতা লিখুন — আমি সঠিক মেশিন, ক্যাটালগ পৃষ্ঠা ও কোটেশন গাইড করে দেব।'
                      : 'Ask in English, বাংলা, Banglish, or any language. Share what you pack or produce and I will match Auto Pac machinery, catalog pages, and quotation links.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    {isBn ? 'দ্রুত প্রশ্ন' : 'Quick questions'}
                  </p>
                  <div className="flex flex-col gap-2">
                    {starters.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="text-left px-3.5 py-2.5 rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-medium text-stone-800 dark:text-stone-200 hover:border-brand-maroon dark:hover:border-brand-ink hover:text-brand-ink transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-maroon text-white'
                        : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_strong]:font-semibold [&_a]:text-brand-maroon [&_a]:underline [&_a]:font-medium dark:[&_a]:text-amber-300">
                        <Markdown
                          components={{
                            a: ({ href, children }) => {
                              const url = href || '#';
                              if (url.startsWith('/')) {
                                return (
                                  <Link href={url} onClick={() => setOpen(false)}>
                                    {children}
                                  </Link>
                                );
                              }
                              return (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-maroon" />
                  <span>{isBn ? 'উত্তর তৈরি হচ্ছে…' : 'Checking catalog…'}</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {showWhatsAppButton && (
                    <a
                      href={whatsappHandoffUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-700 text-white font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {isBn ? 'হোয়াটসঅ্যাপে চ্যাট' : 'Chat on WhatsApp'}
                    </a>
                  )}
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-brand-maroon text-white font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {isBn ? 'কোটেশন ফর্ম' : 'Open Quote Form'}
                  </Link>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex items-center gap-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:pb-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isBn || chatLang === 'bn'
                  ? 'মেশিন বা পণ্য সম্পর্কে লিখুন…'
                  : 'Ask in any language (EN / বাংলা)…'
              }
              className="input-field h-10 text-sm flex-1"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label={isBn ? 'পাঠান' : 'Send message'}
              className="btn-primary h-10 min-h-[40px] px-3.5 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
