import { motion } from 'motion/react';
import { Star, Award, ShieldCheck, Clock } from 'lucide-react';

const stats = [
  { label: 'Craftsmanship', icon: Star, text: 'Exquisite attention to every detail' },
  { label: 'Expertise', icon: Award, text: 'Award-winning design philosophy' },
  { label: 'Reliability', icon: ShieldCheck, text: 'Highly rated by 23+ happy clients' },
  { label: 'Timeliness', icon: Clock, text: 'On-time project completion' },
];

export default function About() {
  return (
    <section id="about" className="py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl skew-y-2">
              <img
                src="https://images.unsplash.com/photo-1616486701797-0f33f61038ec?q=80&w=1000&auto=format&fit=crop"
                alt="Our Studio Craftsmanship"
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Artistic accents */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-luxury-gold/20 rounded-full animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" />
            
            <div className="absolute bottom-10 -right-10 z-20 bg-white p-8 rounded-2xl shadow-xl max-w-[200px] border border-luxury-gold/10 hidden md:block">
              <div className="text-4xl font-serif text-luxury-gold mb-1">8+</div>
              <div className="text-[10px] uppercase tracking-widest font-accent font-bold opacity-60">Years of Creative Excellence</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.5em] text-luxury-gold font-accent font-semibold block mb-4">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
              Transforming Houses into <br />
              <span className="italic">Luxury Personal Havens</span>
            </h2>
            <p className="text-luxury-ink/70 leading-relaxed font-light mb-10 text-lg">
              Located in the vibrant area of Dera Bassi, Thakur Interior Studio is your go-to destination for premium interior solutions. 
              We specialize in transforming spaces with high-quality PVC panels, wallpaper, and blinds. Our dedicated team is committed 
              to bringing your vision to life with precision and style.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg mb-1">{stat.label}</h4>
                    <p className="text-xs text-luxury-ink/50 leading-relaxed uppercase tracking-wider">{stat.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="border border-luxury-ink px-10 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-luxury-ink hover:text-white transition-all duration-500">
              Read Our Full Story
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
