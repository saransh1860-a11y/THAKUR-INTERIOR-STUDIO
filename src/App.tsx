/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ConsultationModal from './components/ConsultationModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Listen for custom trigger if any
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple routing
  if (currentPath === '/admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="relative overflow-x-hidden">
      <Navbar onConsultationClick={() => setIsModalOpen(true)} />
      
      <main>
        <Hero onConsultationClick={() => setIsModalOpen(true)} />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      
      <Chatbot />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
