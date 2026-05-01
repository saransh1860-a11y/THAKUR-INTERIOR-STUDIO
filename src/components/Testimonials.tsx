import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Harpreet Singh',
    role: 'Homeowner, Dera Bassi',
    text: 'Thakur Interior Studio did an amazing job with the PVC panels and wallpaper in our living room. Their collection is top-notch and service is very fast.',
    rating: 5,
  },
  {
    name: 'Anjali Verma',
    role: 'Apartment Owner',
    text: 'Best interior designer in the area. They modified our bedroom with beautiful blinds and a custom wall design. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Suresh Raina',
    role: 'Local Business Owner',
    text: 'Professional team and high-quality materials. They transformed my showroom with great attention to detail. 5 stars for Thakur Interior Studio.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.5em] text-luxury-gold font-accent font-semibold block mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif">
            What Our <span className="italic">Clients Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-luxury-bg p-8 md:p-10 rounded-3xl border border-luxury-ink/5 relative group hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-luxury-gold text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Quote className="w-5 h-5 fill-current" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(testimonial.rating)
                        ? 'text-luxury-gold fill-current'
                        : 'text-luxury-ink/10'
                    }`}
                  />
                ))}
              </div>

              <p className="text-luxury-ink/70 italic leading-relaxed mb-8 font-light italic">
                "{testimonial.text}"
              </p>

              <div className="border-t border-luxury-ink/10 pt-6">
                <h4 className="font-serif text-lg">{testimonial.name}</h4>
                <p className="text-[10px] uppercase tracking-widest font-accent opacity-50 mt-1">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 flex items-center justify-center gap-12 opacity-30 grayscale saturate-0 pointer-events-none">
            {/* Mocking some brand logos associated with reviews style */}
            <span className="text-xl font-serif tracking-widest">GOOGLE REVIEWS</span>
            <span className="text-xl font-serif tracking-widest">JUSTDIAL</span>
            <span className="text-xl font-serif tracking-widest">SULEKHA</span>
        </div>
      </div>
    </section>
  );
}
