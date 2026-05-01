import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook, Loader2, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'messages');
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-24 bg-luxury-ink text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.5em] text-luxury-gold font-accent font-semibold block mb-4">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-12">
              Start Your <span className="italic">Design Journey</span>
            </h2>

            <div className="space-y-10 mb-16">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-accent font-bold opacity-60 mb-2">Our Studio</h4>
                  <p className="text-lg font-light max-w-xs">
                    Thakur Interior Studio, Ambala - Chandigarh Expy, opp. SBI Bank, Dadpura Mohalla, Mohan Nagar, Dera Bassi, Punjab 140507
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-accent font-bold opacity-60 mb-2">Call Us</h4>
                  <p className="text-lg font-light">
                    <a href="tel:+916283090578" className="hover:text-luxury-gold transition-colors">062830 90578</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-accent font-bold opacity-60 mb-2">Email Us</h4>
                  <p className="text-lg font-light">thakurinterior@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase tracking-widest font-accent opacity-50">Follow Us</span>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:border-luxury-gold transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:border-luxury-gold transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="mt-12 overflow-hidden rounded-2xl h-64 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.553258752345!2d76.8407!3d30.5907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f95e5d1797e85%3A0xc3cf0f7e1b7e8d1!2sThakur%20Interior%20Studio!5e0!3m2!1sen!2sin!4v1714492000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-xl border border-white/10"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-luxury-gold" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">Message Sent!</h3>
                  <p className="text-white/60">
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-luxury-gold text-xs uppercase tracking-widest font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h3 className="text-2xl font-serif mb-8">Send Us a Message</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-accent opacity-60">Full Name</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border-b border-white/10 py-3 focus:border-luxury-gold outline-none transition-all"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-accent opacity-60">Phone</label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border-b border-white/10 py-3 focus:border-luxury-gold outline-none transition-all"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-accent opacity-60">Email</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border-b border-white/10 py-3 focus:border-luxury-gold outline-none transition-all"
                          placeholder="example@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-accent opacity-60">Your Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border-b border-white/10 py-3 focus:border-luxury-gold outline-none transition-all resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-luxury-gold py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-luxury-ink disabled:opacity-50 disabled:hover:bg-luxury-gold disabled:hover:text-white transition-all duration-500 mt-4 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Submit Message'
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-10 pt-10 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest font-accent opacity-60">
                <span>Working Hours</span>
                <span>Mon - Sun: 9AM - 8PM</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
