import { motion } from 'motion/react';
import { useState } from 'react';

const portfolioItems = [
  {
    title: 'Modern Minimalist Villa',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    title: 'Corporate HQ Design',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'Boutique Hotel Lobby',
    category: 'Hospitality',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'Art Deco Living Space',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-2'
  },
  {
    title: 'Minimalist Home Office',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'Sleek Urban Penthouse',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'High-End Retail Space',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    title: 'Royal Master Bedroom',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
    span: 'md:col-span-2 md:row-span-1'
  },
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const filters = ['All', 'Residential', 'Commercial', 'Luxury'];

  const filteredItems = activeFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, 5);

  return (
    <section id="portfolio" className="py-24 bg-luxury-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.5em] text-luxury-gold font-accent font-semibold block mb-4">
            Our Gallery
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10">
            Showcasing <span className="italic">Excellence</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-luxury-ink/5 pb-8 inline-flex mx-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowAll(false);
                }}
                className={`text-[10px] uppercase tracking-[0.2em] font-accent font-bold transition-all duration-300 relative pb-2 ${
                  activeFilter === filter ? 'text-luxury-gold' : 'text-luxury-ink/40 hover:text-luxury-ink'
                }`}
              >
                {filter}
                {activeFilter === filter && (
                  <motion.div
                    layoutId="filter-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          {visibleItems.map((item, index) => (
            <motion.div
              layout
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`relative group overflow-hidden rounded-2xl ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-[10px] uppercase tracking-widest text-white/70 mb-2 font-accent">
                  {item.category}
                </span>
                <h3 className="text-xl md:text-2xl text-white font-serif translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredItems.length > 5 && (
          <div className="mt-16 text-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="bg-luxury-ink text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest hover:bg-luxury-gold transition-all duration-500 shadow-xl"
              >
                  {showAll ? 'Show Less' : 'View Full Portfolio'}
              </button>
          </div>
        )}
      </div>
    </section>
  );
}
