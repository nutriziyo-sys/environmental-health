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

  const isActive = (path: string) => location.pathname === path;
  const isResearchActive = researchLinks.some(link => location.pathname === link.path);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-gradient-to-b from-slate-900/40 to-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg overflow-hidden">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Leaf size={26} />
            )}
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-serif font-bold text-2xl leading-none tracking-tight transition-colors",
              scrolled ? "text-primary" : "text-white drop-shadow-sm"
            )}>
              {settings?.hero_title?.split(' ')[0] || 'E&H'}
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-[0.2em] font-bold transition-colors",
              scrolled ? "text-slate-500" : "text-white/90 drop-shadow-sm"
            )}>
              {settings?.hero_title?.split(' ').slice(1).join(' ') || 'Research Group'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-bold transition-all duration-300',
                isActive(link.path)
                  ? (scrolled ? 'bg-primary text-white shadow-md' : 'bg-white text-primary shadow-lg')
                  : (scrolled ? 'text-slate-600 hover:text-primary hover:bg-slate-50' : 'text-white hover:bg-white/10')
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Research Dropdown */}
          <div className="relative group/dropdown">
            <Link 
              to="/research"
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300',
                isResearchActive
                  ? (scrolled ? 'bg-primary text-white shadow-md' : 'bg-white text-primary shadow-lg')
                  : (scrolled ? 'text-slate-600 hover:text-primary hover:bg-slate-50' : 'text-white hover:bg-white/10')
              )}
            >
              Research <ChevronDown size={14} className={cn("transition-transform duration-300 group-hover/dropdown:rotate-180")} />
            </Link>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all translate-y-2 group-hover/dropdown:translate-y-0 overflow-hidden">
              <div className="px-4 py-2 mb-1 border-b border-slate-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Our Work</span>
              </div>
              {researchLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'block px-6 py-2.5 text-sm font-bold transition-colors',
                    isActive(link.path) ? 'text-primary bg-primary/5' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
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
              'px-4 py-2 rounded-full text-sm font-bold transition-all duration-300',
              isActive('/publications')
                ? (scrolled ? 'bg-primary text-white shadow-md' : 'bg-white text-primary shadow-lg')
                : (scrolled ? 'text-slate-600 hover:text-primary hover:bg-slate-50' : 'text-white hover:bg-white/10')
            )}
          >
            Publications
          </Link>

          <div className="ml-4 pl-4 border-l border-white/20">
            <Link
              to="/admin"
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-all shadow-lg',
                scrolled 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-primary text-white hover:scale-105 active:scale-95'
              )}
            >
              Admin
            </Link>
          </div>
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
