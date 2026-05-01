import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
  onConsultationClick: () => void;
}

export default function Navbar({ onConsultationClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex flex-col items-start leading-none group">
            <span className="text-2xl font-serif font-bold tracking-tighter text-luxury-ink group-hover:text-luxury-gold transition-colors duration-300">
              THAKUR INTERIOR
            </span>
            <span className="text-[10px] font-accent tracking-[0.3em] uppercase opacity-60">
              Studio
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-widest font-accent hover:text-luxury-gold transition-colors duration-300 py-2 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
               <a href="tel:+916283090578" className="flex items-center gap-2 text-sm font-medium hover:text-luxury-gold transition-colors">
                  <Phone className="w-4 h-4" /> 062830 90578
                </a>
              <button
                onClick={onConsultationClick}
                className="bg-luxury-ink text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-luxury-gold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Inquiry
              </button>
            </div>
          </div>

          <button
            className="lg:hidden text-luxury-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-luxury-bg flex flex-col items-center justify-center lg:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif hover:text-luxury-gold transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onConsultationClick();
                }}
                className="mt-4 bg-luxury-gold text-white px-10 py-5 rounded-full text-sm uppercase tracking-widest"
              >
                Book Free Consultation
              </motion.button>
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                href="tel:+916283090578"
                className="flex items-center gap-3 text-luxury-ink font-medium uppercase tracking-widest text-xs"
              >
                <div className="w-10 h-10 rounded-full border border-luxury-ink/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                Call Now: 62830 90578
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
