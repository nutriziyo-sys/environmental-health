import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, MapPin, Leaf, Phone } from 'lucide-react';
import { Professor } from '../types';

export default function Footer() {
  const [settings, setSettings] = useState<Professor | null>(null);

  useEffect(() => {
    fetch('/api/professor').then(res => res.json()).then(setSettings);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-slate-800">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Leaf size={32} />
              )}
            </div>
            <span className="font-serif font-bold text-2xl text-white">
              {settings?.hero_title?.split(' ')[0] || 'E&H'} <span className="text-primary">Research</span>
            </span>
          </div>
          <p className="max-w-md text-slate-400 leading-relaxed mb-8">
            Dedicated to advancing environmental health through rigorous research, 
            innovative technology, and global collaboration.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="/professor" className="hover:text-primary transition-colors">Professor</a></li>
            <li><a href="/research" className="hover:text-primary transition-colors">Research Areas</a></li>
            <li><a href="/publications" className="hover:text-primary transition-colors">Publications</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-primary shrink-0" />
              <span>{settings?.address || '123 University Ave, Science Building, Room 405'}</span>
            </li>
            {settings?.phone && (
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <span>{settings.phone}</span>
              </li>
            )}
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-primary shrink-0" />
              <span>{settings?.email || 'contact@eh-research.edu'}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2025 Environmental Health Research Group. All rights reserved.</p>
        <p>Designed for Professional Academic Excellence.</p>
      </div>
    </footer>
  );
}
