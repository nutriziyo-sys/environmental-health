import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Mail, GraduationCap, Award, BookOpen } from 'lucide-react';
import { Professor, AcademicJourney } from '../types';

export default function ProfessorPage() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [journey, setJourney] = useState<AcademicJourney[]>([]);

  useEffect(() => {
    fetch('/api/professor').then(res => res.json()).then(setProfessor);
    fetch('/api/academic_journey').then(res => res.json()).then(setJourney);
  }, []);

  if (!professor) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Photo and Quick Info side by side */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-20 bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[3/4] w-full max-w-[320px] rounded-3xl overflow-hidden shadow-2xl shrink-0"
          >
            <img 
              src={professor.photo_url || "https://picsum.photos/seed/prof/800/800"} 
              className="w-full h-full object-cover"
              alt={professor.name}
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="flex-grow space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
                {professor.name.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{professor.name.split(' ').slice(-1)}</span>
              </h1>
              <p className="text-slate-500 font-bold text-2xl mb-6 tracking-tight">Principal Investigator</p>
              
              <div className="flex gap-4 mb-8">
                {professor.linkedin_url && (
                  <a 
                    href={professor.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                <a 
                  href={`mailto:${professor.email}`}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <GraduationCap size={20} />
                </div>
                <span className="font-medium">PhD in Environmental Science</span>
              </div>
              <div className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Award size={20} />
                </div>
                <span className="font-medium">Fellow of the Royal Society</span>
              </div>
              <div className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <BookOpen size={20} />
                </div>
                <span className="font-medium">150+ Peer-reviewed Publications</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Content */}
          <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-slate prose-lg max-w-none"
            >
              <h2 className="text-3xl font-serif font-bold mb-4">
                Background & <span className="text-primary">Vision</span>
              </h2>
              <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
              <div className="whitespace-pre-wrap text-slate-600 leading-relaxed text-lg">
                {professor.bio}
              </div>

              <h3 className="text-2xl font-serif font-bold mt-16 mb-4">
                Academic <span className="text-primary">Journey</span>
              </h3>
              <div className="w-12 h-1 bg-primary mb-8 rounded-full"></div>
              <div className="space-y-8 mt-8">
                {journey.map((item, idx) => (
                  <div key={item.id} className="flex gap-6 relative">
                    <div className="w-px bg-slate-200 absolute left-[11px] top-8 bottom-0"></div>
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center relative z-10">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary mb-1">{item.year}</div>
                      <div className="text-lg font-bold text-slate-900">{item.title}</div>
                      <div className="text-slate-500">{item.organization}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
