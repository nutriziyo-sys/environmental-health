import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Conference } from '../types';

export default function ConferencesPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);

  useEffect(() => {
    fetch('/api/conferences').then(res => res.json()).then(setConferences);
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
            <Calendar size={16} />
            <span className="text-sm font-bold tracking-wider uppercase">Events & Conferences</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            Global Engagement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Our group actively participates in international conferences to share our research and collaborate with the global scientific community.
          </motion.p>
        </div>
      </section>

      {/* Conferences List */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {conferences.map((conf, index) => (
            <motion.div
              key={conf.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col md:flex-row gap-12"
            >
              {conf.image_url && (
                <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
                  <img src={conf.image_url} alt={conf.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="flex-grow space-y-6">
                <div className="flex flex-wrap gap-4 items-center text-sm font-bold text-primary uppercase tracking-widest">
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    {conf.date}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    <MapPin size={14} />
                    {conf.location}
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {conf.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {conf.description}
                </p>
                {conf.link && (
                  <a
                    href={conf.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                  >
                    View Conference Website <ArrowRight size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
