import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Professor } from '../types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<Professor | null>(null);
  const [researchOpen, setResearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const refreshSettings = () => {
      fetch('/api/professor').then(res => res.json()).then(setSettings);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('settingsUpdated', refreshSettings);
    
    refreshSettings();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('settingsUpdated', refreshSettings);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Professor', path: '/professor' },
    { name: 'Team', path: '/team' },
  ];

  const researchLinks = [
    { name: 'Research Areas', path: '/research' },
    { name: 'Instruments', path: '/instruments' },
    { name: 'Conferences', path: '/conferences' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white group-hover:rotate-12 transition-transform overflow-hidden">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Leaf size={24} />
            )}
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-serif font-bold text-xl leading-none",
              scrolled ? "text-primary" : "text-white"
            )}>
              {settings?.hero_title?.split(' ')[0] || 'E&H'}
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-semibold opacity-70",
              scrolled ? "text-slate-600" : "text-white/70"
            )}>
              {settings?.hero_title?.split(' ').slice(1).join(' ') || 'Research Group'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                scrolled ? (location.pathname === link.path ? 'text-primary' : 'text-slate-600') : 'text-white hover:text-white/80'
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Research Dropdown */}
          <div className="relative group/dropdown">
            <button 
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                scrolled ? 'text-slate-600' : 'text-white hover:text-white/80'
              )}
            >
              Research <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all translate-y-2 group-hover/dropdown:translate-y-0">
              {researchLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'block px-6 py-2 text-sm font-medium hover:bg-slate-50 hover:text-primary transition-colors',
                    location.pathname === link.path ? 'text-primary bg-slate-50' : 'text-slate-600'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/publications"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              scrolled ? (location.pathname === '/publications' ? 'text-primary' : 'text-slate-600') : 'text-white hover:text-white/80'
            )}
          >
            Publications
          </Link>

          <Link
            to="/admin"
            className={cn(
              'px-5 py-2 rounded-full text-sm font-bold transition-all',
              scrolled 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30'
            )}
          >
            Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className={cn(
          "md:hidden",
          scrolled ? "text-slate-900" : "text-white"
        )} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-lg font-medium',
                location.pathname === link.path ? 'text-primary' : 'text-slate-600'
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Research</div>
            {researchLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'block text-lg font-medium',
                  location.pathname === link.path ? 'text-primary' : 'text-slate-600'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            to="/publications"
            className={cn(
              'text-lg font-medium border-t border-slate-100 pt-4',
              location.pathname === '/publications' ? 'text-primary' : 'text-slate-600'
            )}
            onClick={() => setIsOpen(false)}
          >
            Publications
          </Link>
          <Link
            to="/admin"
            className="mt-4 w-full py-4 bg-primary text-white text-center font-bold rounded-2xl"
            onClick={() => setIsOpen(false)}
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
