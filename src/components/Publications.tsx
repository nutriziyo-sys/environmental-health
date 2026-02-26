import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, BookOpen, Calendar, User } from 'lucide-react';
import { Publication } from '../types';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filterYear, setFilterYear] = useState<number | 'All'>('All');

  useEffect(() => {
    fetch('/api/publications').then(res => res.json()).then(setPublications);
  }, []);

  const years = ['All', ...Array.from(new Set(publications.map(p => p.year)))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return (b as number) - (a as number);
  });

  const filteredPublications = filterYear === 'All' 
    ? publications 
    : publications.filter(p => p.year === filterYear);

  return (
    <div className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-serif font-bold mb-6">Publications</h1>
            <p className="text-slate-600 max-w-xl text-lg">
              A comprehensive list of our peer-reviewed articles, book chapters, and conference papers.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setFilterYear(year as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  filterYear === year 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {filteredPublications.map((pub) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="flex flex-row gap-6 md:gap-12 items-start">
                {/* Journal Image - Same level as text */}
                <div className="w-24 h-32 md:w-48 md:h-64 bg-slate-50 rounded-xl md:rounded-2xl shadow-sm overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center p-2 md:p-4 group-hover:shadow-md transition-all">
                  <img 
                    src={pub.journal_image_url || `https://picsum.photos/seed/${pub.journal}/400/600`} 
                    className="w-full h-full object-contain"
                    alt={pub.journal}
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-grow pt-1 md:pt-2">
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-6">
                    <span className="px-2 md:px-4 py-1 bg-primary/10 text-primary text-[8px] md:text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {pub.journal}
                    </span>
                    {pub.impact_factor && (
                      <span className="px-2 md:px-4 py-1 bg-emerald-50 text-emerald-600 text-[8px] md:text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-100">
                        IF: {pub.impact_factor}
                      </span>
                    )}
                    <span className="flex items-center gap-1 md:gap-1.5 text-slate-400 text-[10px] md:text-sm font-medium">
                      <Calendar size={12} className="md:w-[14px] md:h-[14px]" /> {pub.year}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-3xl font-serif font-bold mb-3 md:mb-6 leading-tight group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>
                  
                  <div className="flex items-start gap-2 md:gap-3 text-slate-600 mb-4 md:mb-8">
                    <User size={16} className="shrink-0 mt-1 text-slate-400 md:w-5 md:h-5" />
                    <p className="text-sm md:text-lg leading-relaxed italic line-clamp-2 md:line-clamp-none">{pub.authors}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <a 
                      href={pub.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-8 md:py-4 bg-slate-900 text-white text-[10px] md:text-sm font-bold rounded-full hover:bg-primary transition-all group/btn shadow-lg shadow-slate-900/10"
                    >
                      Access Article <ExternalLink size={14} className="md:w-[18px] md:h-[18px] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="mt-12 h-px bg-slate-100 w-full"></div>
            </motion.div>
          ))}

          {filteredPublications.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No publications found for this year.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
