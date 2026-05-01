import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, X, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Interior Design'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'consultations';
      await addDoc(collection(db, path), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', phone: '', service: 'Interior Design' });
        onClose();
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'consultations');
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-luxury-bg shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-luxury-ink/50 hover:text-luxury-ink"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-12">
              {isSuccess ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-luxury-gold" />
                  </motion.div>
                  <h2 className="text-3xl font-serif mb-4">Request Received!</h2>
                  <p className="text-luxury-ink/70">
                    Thank you, {formData.name}. Our design experts will call you shortly on {formData.phone}.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-serif mb-4 text-center">Free Design Consultation</h2>
                  <p className="text-luxury-ink/70 text-center mb-8">
                    Tell us about your project and we'll help you create the space of your dreams.
                  </p>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-70">Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-b border-luxury-ink/20 bg-transparent py-2 focus:border-luxury-gold focus:outline-none transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-70">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border-b border-luxury-ink/20 bg-transparent py-2 focus:border-luxury-gold focus:outline-none transition-colors"
                        placeholder="Enter your contact number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-70">Service Interested In</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full border-b border-luxury-ink/20 bg-transparent py-2 focus:border-luxury-gold focus:outline-none transition-colors"
                      >
                        <option>PVC Panels & Wallpapers</option>
                        <option>Custom Blinds</option>
                        <option>Bedroom Design</option>
                        <option>Cabinetry & Hardware</option>
                        <option>Commercial Interios</option>
                      </select>
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-luxury-gold text-white py-4 rounded-full mt-6 hover:bg-luxury-gold-dark transition-colors font-medium tracking-wide flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Schedule My Call'
                      )}
                    </button>
                  </form>
                </>
              )}
 
              <div className="mt-8 flex items-center justify-center gap-6 border-t border-luxury-ink/10 pt-8">
                <a href="tel:+916283090578" className="flex items-center gap-2 text-sm font-medium hover:text-luxury-gold transition-colors">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <a href="https://wa.me/916283090578" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-luxury-gold transition-colors">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
