import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, CheckCircle2 } from 'lucide-react';
import { Instrument } from '../types';
import { cn } from '../lib/utils';

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    fetch('/api/instruments').then(res => res.json()).then(setInstruments);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 mb-6"
          >
            <Wrench size={16} />
            <span className="text-sm font-bold tracking-wider uppercase">Laboratory Equipment</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            Advanced <span className="text-primary italic">Instrumentation</span>
          </motion.h1>
          <div className="w-24 h-1.5 bg-primary mx-auto mb-8 rounded-full"></div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Our laboratory is equipped with state-of-the-art instruments for precise environmental and biological analysis.
          </motion.p>
        </div>
      </section>

      {/* Instruments Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instruments.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={item.image_url || 'https://picsum.photos/seed/instrument/800/600'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm">
                      <Wrench size={18} className="text-primary" />
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{item.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                  
                  {item.specifications && (
                    <div className="mt-auto pt-6 border-t border-slate-50">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Key Specs</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.specifications.split('\n').slice(0, 3).map((spec, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <CheckCircle2 className="text-primary" size={12} />
                            <span className="text-[10px] font-semibold text-slate-600">{spec}</span>
                          </div>
                        ))}
                        {item.specifications.split('\n').length > 3 && (
                          <div className="text-[10px] font-bold text-primary px-2 py-1">
                            +{item.specifications.split('\n').length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
