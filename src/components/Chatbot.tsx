'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: 'Hello! I am AutoPac AI Assistant. How can I help you today?', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const { locale } = useLocale();

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput('');

    setTimeout(() => {
      const response = locale === 'bn'
        ? 'আপনার বার্তার জন্য ধন্যবাদ! আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে। জরুরী প্রয়োজনে আমাদের WhatsApp এ নক দিন।'
        : 'Thank you for your message! One of our representatives will contact you shortly. For urgent inquiries, please contact us on WhatsApp.';
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed right-3 sm:right-4 md:right-6 bottom-24 w-[calc(100vw-1.5rem)] max-w-[320px] sm:w-80 sm:max-w-[384px] md:w-96 bg-white dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-700 z-[60] overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 120px)', height: '500px' }}
        >
          <div className="bg-brand-maroon text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">Auto Pac Support</h3>
                <p className="text-xs text-white/70">Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/15 rounded-md"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-brand-paper dark:bg-stone-950 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-md text-sm ${
                    msg.isBot
                      ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
                      : 'bg-brand-maroon text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-brand-maroon text-white rounded-md hover:bg-brand-maroon-hover disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-40 w-11 h-11 sm:w-12 sm:h-12 right-[4.5rem] sm:right-24 md:right-28 bottom-5 sm:bottom-6 md:bottom-8 bg-stone-900 hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-md shadow-md flex items-center justify-center touch-manipulation"
        aria-label="Open chat"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    </>
  );
}
