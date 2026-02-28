import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Users, BookOpen, Microscope, Send, ChevronRight, ChevronLeft, Mail, MapPin, Zap, ShieldCheck, Beaker, Target, Award, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem, Stat, ResearchArea, Professor } from '../types';
import { formatDate } from '../lib/utils';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [research, setResearch] = useState<ResearchArea[]>([]);
  const [settings, setSettings] = useState<Professor | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    fetch('/api/news').then(res => res.json()).then(setNews);
    fetch('/api/stats').then(res => res.json()).then(setStats);
    fetch('/api/research').then(res => res.json()).then(setResearch);
    fetch('/api/professor').then(res => res.json()).then(setSettings);
  }, []);

  const latestNews = news.slice(0, 3);
  const archivedNewsCount = news.length > 3 ? news.length - 3 : 0;

  const nextNews = () => setNewsIndex((prev) => (prev + 1) % latestNews.length);
  const prevNews = () => setNewsIndex((prev) => (prev - 1 + latestNews.length) % latestNews.length);

  const IconMap: Record<string, any> = {
    Microscope,
    Zap,
    ShieldCheck,
    Beaker,
    Target,
    Award
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center overflow-hidden pt-32"
        style={{ backgroundColor: settings?.hero_bg_color || '#0f172a' }}
      >
        {settings?.hero_image_url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={settings.hero_image_url} 
              className="w-full h-full object-cover opacity-40" 
              alt="Hero" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{ 
            background: `linear-gradient(to right, ${settings?.hero_gradient_start || settings?.hero_bg_color || '#0f172a'}, ${settings?.hero_gradient_end || 'transparent'})`
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          {/* Title Corner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-6 py-2 bg-[#1e3a8a] text-white text-sm font-bold uppercase tracking-widest rounded-lg mb-8 shadow-xl border border-white/10"
            >
              {settings?.hero_badge || 'Advancing Environmental Health'}
            </motion.div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-10 leading-[0.85] tracking-tighter">
              {settings?.hero_title ? (
                <>
                  {settings.hero_title.split(' ').slice(0, 2).join(' ')} <br />
                  <span className="text-primary italic">{settings.hero_title.split(' ').slice(2).join(' ')}</span>
                </>
              ) : (
                <>
                  E&H <span className="text-primary italic">Environmental Health</span> <br className="hidden lg:block" /> Research Group
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 leading-relaxed font-light">
              {settings?.hero_subtitle || "Investigating the complex interactions between environmental factors and human health to build a sustainable future."}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/research" className="px-10 py-5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all flex items-center gap-3 group shadow-xl shadow-primary/20 text-lg">
                Explore Research <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        {!settings?.hero_image_url && (
          <>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 -z-10 skew-x-[-15deg] translate-x-1/4"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </>
        )}
      </section>

      {/* Research Areas Visualization (Schemes) */}
      <section 
        className="py-24 px-6"
        style={{ backgroundColor: settings?.secondary_bg_color || '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Research <span className="text-primary">Landscape</span>
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mb-8 rounded-full"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Our work spans across multiple critical domains of environmental health, 
              integrated through advanced data science and field monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {research.slice(0, 3).map((area, idx) => {
              const IconComponent = IconMap[area.icon_name || ''] || Microscope;
              return (
                <motion.div
                  key={area.id}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group"
                >
                  <div 
                    className={`w-16 h-16 shadow-sm flex items-center justify-center mb-8 transition-all ${area.box_shape || 'rounded-2xl'}`}
                    style={{ backgroundColor: area.box_color || '#ffffff' }}
                  >
                    <IconComponent 
                      size={32} 
                      style={{ color: area.icon_color || '#3b82f6' }}
                    />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4">{area.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  <Link to="/research" className="text-primary font-bold flex items-center gap-2 group/link">
                    Learn More <ChevronRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Latest Updates</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                Group <span className="text-primary">News</span>
              </h2>
              <div className="w-20 h-1.5 bg-primary mt-4 rounded-full"></div>
            </div>
            {archivedNewsCount > 0 && (
              <Link to="/news-archive" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors border border-white/10">
                View Archive ({archivedNewsCount} more)
              </Link>
            )}
          </div>

          <div className="relative">
            {latestNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestNews.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative">
                      <img 
                        src={item.image_url || `https://picsum.photos/seed/${item.id}/800/600`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.title}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        {formatDate(item.date)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No news updates available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat) => (
            <div key={stat.id}>
              <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">{stat.value}</div>
              <div className="text-primary-foreground/70 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
            </div>
          ))}
          {/* Default stats if none in DB */}
          {stats.length === 0 && (
            <>
              <div>
                <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">150+</div>
                <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Publications</div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">25</div>
                <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Research Projects</div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">12</div>
                <div className="text-white/70 uppercase tracking-widest text-xs font-bold">PhD Students</div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">10M+</div>
                <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Funding (USD)</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section 
        className="py-24 px-6"
        style={{ backgroundColor: settings?.secondary_bg_color || '#ffffff' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-10">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl overflow-hidden border-4 border-white">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Leaf size={48} />
                  )}
                </div>
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6">
                Get in <span className="text-primary">Touch</span>
              </h2>
              <div className="w-16 h-1.5 bg-primary mb-8 rounded-full"></div>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Interested in collaboration, joining the group, or learning more about our research? 
                Send us a message and we'll get back to you as soon as possible.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Email Us</div>
                    <div className="text-slate-500">{settings?.email || 'contact@eh-research.edu'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Visit Us</div>
                    <div className="text-slate-500">{settings?.address || 'Science Building, Room 405'}</div>
                  </div>
                </div>
              </div>
            </div>

            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                await fetch('/api/messages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });
                alert('Message sent successfully!');
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input name="name" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
                Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
