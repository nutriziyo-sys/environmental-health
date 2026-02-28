import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Microscope, ArrowRight, Target, Award, Zap, Beaker, ShieldCheck, HelpCircle } from 'lucide-react';
import { ResearchArea, Specialization } from '../types';

const IconMap: Record<string, any> = {
  Microscope,
  Zap,
  ShieldCheck,
  Beaker,
  Target,
  Award
};

export default function ResearchPage() {
  const [areas, setAreas] = useState<ResearchArea[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [expandedFocus, setExpandedFocus] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/research').then(res => res.json()).then(setAreas);
    fetch('/api/specializations').then(res => res.json()).then(setSpecializations);
  }, []);

  const clusters = [
    { id: 'Food Systems & Safety', icon: Zap, color: 'emerald' },
    { id: 'Molecular Sciences', icon: Beaker, color: 'blue' },
    { id: 'Environmental Health', icon: Microscope, color: 'amber' }
  ];

  return (
    <div className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-8">
              Research <span className="text-primary italic">Areas</span>
            </h1>
            <div className="w-24 h-1.5 bg-primary mb-8 rounded-full"></div>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              Our research group operates at the cutting edge of environmental health, 
              analytical chemistry, and plasma technology to address global health challenges.
            </p>
          </motion.div>
        </div>

        {/* Major Fields of Specialization - Schematic Visualization */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Award size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              Major Fields of <span className="text-primary">Specialization</span>
            </h2>
          </div>
          <div className="w-20 h-1 bg-primary/20 mb-16 rounded-full"></div>

          <div className="relative">
            {/* Schematic Background Grid */}
            <div className="absolute inset-0 grid grid-cols-3 gap-8 opacity-[0.03] pointer-events-none">
              <div className="border-x border-slate-900"></div>
              <div className="border-x border-slate-900"></div>
              <div className="border-x border-slate-900"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              {clusters.map((cluster, idx) => {
                const Icon = cluster.icon;
                const clusterSpecs = specializations.filter(s => s.cluster === cluster.id);
                const colorClass = cluster.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                                 cluster.color === 'blue' ? 'bg-blue-500 shadow-blue-500/20' : 
                                 'bg-amber-500 shadow-amber-500/20';
                const hoverBorder = cluster.color === 'emerald' ? 'group-hover:border-emerald-500/30' : 
                                  cluster.color === 'blue' ? 'group-hover:border-blue-500/30' : 
                                  'group-hover:border-amber-500/30';
                const hoverLine = cluster.color === 'emerald' ? 'group-hover:bg-emerald-500' : 
                                cluster.color === 'blue' ? 'group-hover:bg-blue-500' : 
                                'group-hover:bg-amber-500';

                return (
                  <motion.div 
                    key={cluster.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`p-3 text-white rounded-xl shadow-lg ${colorClass}`}>
                        <Icon size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase text-sm">{cluster.id}</h3>
                    </div>
                    
                    <div className="space-y-4 relative">
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>
                      
                      {clusterSpecs.map((item, i) => (
                        <div key={item.id} className="flex items-center gap-4 group pl-12 relative">
                          <div className={`absolute left-6 w-6 h-px bg-slate-100 transition-colors ${hoverLine}`}></div>
                          <div className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all w-full ${hoverBorder}`}>
                            <span className="text-slate-600 font-medium text-sm">{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Research Focus */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Target size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              Research <span className="text-primary">Focus</span>
            </h2>
          </div>
          <div className="w-20 h-1 bg-primary/20 mb-12 rounded-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {areas.map((focus, i) => {
              const IconComponent = IconMap[focus.icon_name || ''] || HelpCircle;
              return (
                <motion.div
                  key={focus.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={focus.image_url || `https://picsum.photos/seed/${focus.id}/800/600`} 
                      alt={focus.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-8">
                      <div 
                        className={`w-12 h-12 flex items-center justify-center shadow-lg transition-all ${focus.box_shape || 'rounded-xl'}`}
                        style={{ backgroundColor: focus.box_color || '#ffffff' }}
                      >
                        <IconComponent 
                          size={24} 
                          style={{ color: focus.icon_color || '#3b82f6' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{focus.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-lg font-light mb-6">
                      {focus.description}
                    </p>
                    
                    <AnimatePresence>
                      {expandedFocus === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-slate-100 mt-6 text-slate-600 leading-relaxed">
                            {focus.full_content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={() => setExpandedFocus(expandedFocus === i ? null : i)}
                      className="mt-6 text-primary font-bold flex items-center gap-2 group/btn"
                    >
                      {expandedFocus === i ? 'Show less' : 'Read more'} 
                      <ArrowRight size={18} className={`transition-transform ${expandedFocus === i ? '-rotate-90' : 'group-hover/btn:translate-x-1'}`} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
