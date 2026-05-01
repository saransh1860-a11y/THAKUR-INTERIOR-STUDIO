import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getInteriorAdvice } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'Hello! I am your personal design assistant from **Thakur Interior Studio**.\n\nI can help you with:\n* **PVC Panels** and Modern **Wallpaper**\n* Custom **Blinds** for windows\n* **Bedroom Design** and Luxury Renovations\n\nHow can I help you transform your space today?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Prepare history for Gemini (skip the initial greeting)
    const chatHistory = messages.slice(1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await getInteriorAdvice(userMsg, chatHistory);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I am currently experiencing some technical difficulties. Please feel free to reach out to us via WhatsApp for immediate assistance." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 items-end flex flex-col">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[calc(100vw-4rem)] sm:w-[400px] h-[550px] max-h-[calc(100vh-120px)] bg-luxury-bg rounded-3xl shadow-2xl overflow-hidden border border-luxury-gold/20 flex flex-col"
          >
            {/* Header */}
            <div className="bg-luxury-ink text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg leading-tight">Thakur Interior Studio</h3>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">AI Design Assistant</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-luxury-gold transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-luxury-bg scrollbar-hide"
            >
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-luxury-gold text-white rounded-tr-none' 
                        : 'bg-white border border-luxury-ink/5 text-luxury-ink/80 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.role === 'user' ? (
                      m.text
                    ) : (
                      <div className="space-y-2">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-4 space-y-1 mb-2">{children}</ul>,
                            li: ({ children }) => <li className="pl-1">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-luxury-ink">{children}</strong>,
                          }}
                        >
                          {m.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-luxury-ink/5 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-luxury-gold" />
                    <span className="text-xs text-luxury-ink/40 font-medium">Assistant is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-luxury-ink/5">
              <div className="flex items-center gap-2 bg-luxury-bg rounded-full px-4 py-2 border border-luxury-ink/5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your space..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-luxury-ink text-white flex items-center justify-center hover:bg-luxury-gold transition-colors disabled:opacity-50"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-luxury-ink text-white shadow-2xl flex items-center justify-center relative group"
        aria-label="Toggle Thakur Interior Studio AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-luxury-gold"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
