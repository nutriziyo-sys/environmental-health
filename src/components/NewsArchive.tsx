import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { NewsItem } from '../types';
import { formatDate } from '../lib/utils';

export default function NewsArchive() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/news').then(res => res.json()).then(setNews);
  }, []);

  const archivedNews = news.slice(3);

  return (
    <div className="py-24 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-serif font-bold mb-12">News Archive</h1>
        
        <div className="space-y-8">
          {archivedNews.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8"
            >
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                <img src={item.image_url} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                  {formatDate(item.date)}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}

          {archivedNews.length === 0 && (
            <div className="text-center py-20 text-slate-400 italic">
              No archived news items found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
