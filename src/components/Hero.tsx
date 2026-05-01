import { motion } from 'motion/react';
import { ArrowRight, Phone, MessageSquare } from 'lucide-react';

interface HeroProps {
  onConsultationClick: () => void;
}

export default function Hero({ onConsultationClick }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1613977252408-aa7e997af763?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Luxury Interior"
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-bg/90 via-luxury-bg/40 to-transparent lg:block hidden" />
        <div className="absolute inset-0 bg-luxury-bg/60 lg:hidden block" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-xs uppercase tracking-[0.5em] font-accent text-luxury-gold mb-6 block font-semibold">
              Premium Interior Designers in Dera Bassi
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8 tracking-tight">
              Design Your <br />
              <span className="italic text-luxury-gold">Dream Space</span>
            </h1>
            <p className="text-lg md:text-xl text-luxury-ink/70 leading-relaxed mb-12 max-w-xl font-light">
              We specialize in PVC Panels, Wallpaper, and Blinds to transform your space into a masterpiece. 
              Top-rated interior design solutions for modern living in Dera Bassi.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={onConsultationClick}
                className="w-full sm:w-auto bg-luxury-ink text-white px-10 py-5 rounded-full flex items-center justify-center gap-3 hover:bg-luxury-gold transition-all duration-500 group shadow-lg"
              >
                <span>Free Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-6">
                <a href="tel:+916283090578" className="group flex items-center gap-3 text-luxury-ink hover:text-luxury-gold transition-colors duration-300">
                  <div className="w-12 h-12 rounded-full border border-luxury-ink/10 flex items-center justify-center group-hover:border-luxury-gold transition-colors underline decoration-luxury-gold/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-accent uppercase tracking-widest font-medium">Call Now</span>
                </a>
              </div>
            </div>

            <div className="mt-16 flex items-center gap-12 border-t border-luxury-ink/10 pt-10">
              <div>
                <span className="block text-2xl font-serif">5.0★</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Google Rating</span>
              </div>
              <div className="h-10 w-[1px] bg-luxury-ink/10" />
              <div>
                <span className="block text-2xl font-serif">23</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Reviews</span>
              </div>
              <div className="h-10 w-[1px] bg-luxury-ink/10" />
              <div>
                <span className="block text-2xl font-serif">8+</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Years Exp.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-luxury-gold to-transparent" />
      </motion.div>
    </section>
  );
}
