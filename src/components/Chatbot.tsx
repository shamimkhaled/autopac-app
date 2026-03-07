'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Add user message
    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const response = locale === 'bn' 
        ? 'আপনার বার্তার জন্য ধন্যবাদ! আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে। জরুরী প্রয়োজনে আমাদের WhatsApp এ নক দিন।'
        : 'Thank you for your message! One of our representatives will contact you shortly. For urgent inquiries, please contact us on WhatsApp.';
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed right-3 sm:right-4 md:right-6 bottom-24 w-[calc(100vw-1.5rem)] max-w-[320px] sm:w-80 sm:max-w-[384px] md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[60] overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)', height: '500px' }}
          >
            {/* Header */}
            <div className="bg-action-orange text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">AutoPac Support</h3>
                  <p className="text-xs text-orange-100">AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.isBot 
                        ? 'bg-white dark:bg-gray-800 text-industrial-dark dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-sm' 
                        : 'bg-action-orange text-white shadow-sm rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 rounded-full text-sm outline-none transition-all dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 bg-action-orange text-white rounded-full hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button — responsive size, positioned to avoid overlap with WhatsApp */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-40 w-11 h-11 sm:w-14 sm:h-14 right-[4.5rem] sm:right-24 md:right-28 bottom-5 sm:bottom-6 md:bottom-8 bg-industrial-dark hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-industrial-dark rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 touch-manipulation group"
        aria-label="Open chat"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with AI
        </span>
      </button>
    </>
  );
}
