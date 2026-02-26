import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Save, LogOut, LayoutDashboard, Newspaper, Microscope, BookOpen, BarChart3, MessageSquare, UserCircle, X, Target, Award, Edit2 } from 'lucide-react';
import { NewsItem, ResearchArea, Publication, Stat, Message, Professor, Specialization, AcademicJourney } from '../types';
import { cn, formatDate } from '../lib/utils';

type Tab = 'dashboard' | 'news' | 'research' | 'specializations' | 'publications' | 'stats' | 'journey' | 'messages' | 'professor';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [research, setResearch] = useState<ResearchArea[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [journey, setJourney] = useState<AcademicJourney[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async () => {
    const [n, r, p, s, spec, j, m, prof] = await Promise.all([
      fetch('/api/news').then(res => res.json()),
      fetch('/api/research').then(res => res.json()),
      fetch('/api/publications').then(res => res.json()),
      fetch('/api/stats').then(res => res.json()),
      fetch('/api/specializations').then(res => res.json()),
      fetch('/api/academic_journey').then(res => res.json()),
      fetch('/api/messages').then(res => res.json()),
      fetch('/api/professor').then(res => res.json()),
    ]);
    setNews(n);
    setResearch(r);
    setPublications(p);
    setStats(s);
    setSpecializations(spec);
    setJourney(j);
    setMessages(m);
    setProfessor(prof);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Access</h1>
            <p className="text-slate-500 mt-2">Please enter your password to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      let endpoint = `/api/${type}`;
      if (type === 'journey') endpoint = '/api/academic_journey';
      if (type === 'specializations') endpoint = '/api/specializations';

      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting');
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      let endpoint = '';
      if (activeTab === 'news') endpoint = '/api/news';
      if (activeTab === 'publications') endpoint = '/api/publications';
      if (activeTab === 'research') endpoint = '/api/research';
      if (activeTab === 'stats') endpoint = '/api/stats';
      if (activeTab === 'specializations') endpoint = '/api/specializations';
      if (activeTab === 'journey') endpoint = '/api/academic_journey';

      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowAddModal(false);
        setEditingItem(null);
        fetchData();
      } else {
        alert('Failed to save item');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'research', label: 'Research Projects', icon: Microscope },
    { id: 'specializations', label: 'Specializations', icon: Target },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'journey', label: 'Academic Journey', icon: Award },
    { id: 'professor', label: 'Site Settings', icon: UserCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8">
          <div className="text-xl font-serif font-bold text-primary">Admin Panel</div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">E&H Research Group</div>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                setShowAddModal(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 capitalize">{activeTab}</h1>
              <p className="text-slate-500">Manage your website content and information.</p>
            </div>
            {activeTab !== 'dashboard' && activeTab !== 'messages' && activeTab !== 'professor' && (
              <button 
                onClick={() => {
                  setEditingItem(null);
                  setShowAddModal(true);
                }}
                className="px-6 py-3 bg-primary text-white rounded-full font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Plus size={18} /> Add New
              </button>
            )}
          </header>

          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 p-8 bg-white rounded-3xl shadow-xl border border-primary/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold">{editingItem ? 'Edit' : 'Add New'} {activeTab}</h2>
                <button onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-6">
                {activeTab === 'news' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input name="title" defaultValue={editingItem?.title} placeholder="News Title" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                      <input name="date" type="date" defaultValue={editingItem?.date?.split('T')[0]} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    </div>
                    <input name="image_url" defaultValue={editingItem?.image_url} placeholder="Image URL" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    <textarea name="content" defaultValue={editingItem?.content} placeholder="News Content" rows={4} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary resize-none"></textarea>
                  </>
                )}
                {activeTab === 'publications' && (
                  <>
                    <input name="title" defaultValue={editingItem?.title} placeholder="Publication Title" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="authors" defaultValue={editingItem?.authors} placeholder="Authors" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                      <input name="journal" defaultValue={editingItem?.journal} placeholder="Journal Name" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input name="year" type="number" defaultValue={editingItem?.year} placeholder="Year" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                      <input name="impact_factor" defaultValue={editingItem?.impact_factor} placeholder="Impact Factor (e.g. 5.8)" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input name="link" defaultValue={editingItem?.link} placeholder="Article Link" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                      <input name="journal_image_url" defaultValue={editingItem?.journal_image_url} placeholder="Journal Image URL" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    </div>
                  </>
                )}
                {activeTab === 'research' && (
                  <>
                    <input name="title" defaultValue={editingItem?.title} placeholder="Research Area Title" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="image_url" defaultValue={editingItem?.image_url} placeholder="Image URL" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                      <select name="icon_name" defaultValue={editingItem?.icon_name || 'Microscope'} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary">
                        <option value="Microscope">Microscope</option>
                        <option value="Zap">Zap</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                        <option value="Beaker">Beaker</option>
                        <option value="Target">Target</option>
                        <option value="Award">Award</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Icon Color</label>
                        <input name="icon_color" type="color" defaultValue={editingItem?.icon_color || "#3b82f6"} className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary p-1" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Box Color</label>
                        <input name="box_color" type="color" defaultValue={editingItem?.box_color || "#ffffff"} className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary p-1" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Box Shape</label>
                        <select name="box_shape" defaultValue={editingItem?.box_shape || 'rounded-xl'} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary">
                          <option value="rounded-xl">Rounded XL</option>
                          <option value="rounded-2xl">Rounded 2XL</option>
                          <option value="rounded-3xl">Rounded 3XL</option>
                          <option value="rounded-full">Circle</option>
                          <option value="rounded-none">Square</option>
                        </select>
                      </div>
                    </div>
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Brief Description" rows={2} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary resize-none"></textarea>
                    <textarea name="full_content" defaultValue={editingItem?.full_content} placeholder="Full Detailed Content" rows={6} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary resize-none"></textarea>
                  </>
                )}
                {activeTab === 'stats' && (
                  <div className="grid grid-cols-2 gap-4">
                    <input name="label" defaultValue={editingItem?.label} placeholder="Stat Label (e.g. PhD Students)" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    <input name="value" defaultValue={editingItem?.value} placeholder="Stat Value (e.g. 12)" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                  </div>
                )}
                {activeTab === 'specializations' && (
                  <div className="grid grid-cols-2 gap-4">
                    <select name="cluster" defaultValue={editingItem?.cluster || 'Food Systems & Safety'} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary">
                      <option value="Food Systems & Safety">Food Systems & Safety</option>
                      <option value="Molecular Sciences">Molecular Sciences</option>
                      <option value="Environmental Health">Environmental Health</option>
                    </select>
                    <input name="label" defaultValue={editingItem?.label} placeholder="Specialization Label" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                  </div>
                )}
                {activeTab === 'journey' && (
                  <div className="space-y-4">
                    <input name="year" defaultValue={editingItem?.year} placeholder="Year Range (e.g. 2015 - Present)" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="title" defaultValue={editingItem?.title} placeholder="Title (e.g. Full Professor)" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                      <input name="organization" defaultValue={editingItem?.organization} placeholder="Organization" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary" />
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">Save Item</button>
                  <button type="button" onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total News</div>
                    <div className="text-4xl font-serif font-bold text-slate-900">{news.length}</div>
                  </div>
                  <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Publications</div>
                    <div className="text-4xl font-serif font-bold text-slate-900">{publications.length}</div>
                  </div>
                  <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">New Messages</div>
                    <div className="text-4xl font-serif font-bold text-slate-900">{messages.length}</div>
                  </div>
                </div>
              )}

              {activeTab === 'news' && (
                <div className="space-y-4">
                  {news.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="text-sm text-slate-500">{formatDate(item.date)}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          title="Edit Item"
                          className="p-3 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete('news', item.id)} 
                          title="Delete Item"
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'research' && (
                <div className="space-y-4">
                  {research.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="text-sm text-slate-500 truncate max-w-md">{item.description}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          title="Edit Item"
                          className="p-3 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete('research', item.id)} 
                          title="Delete Item"
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'publications' && (
                <div className="space-y-4">
                  {publications.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-sm text-slate-500">{item.journal} ({item.year})</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          title="Edit Item"
                          className="p-3 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete('publications', item.id)} 
                          title="Delete Item"
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-4">
                  {stats.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{item.label}</div>
                        <div className="text-sm text-primary font-bold">{item.value}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          title="Edit Item"
                          className="p-3 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete('stats', item.id)} 
                          title="Delete Item"
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'specializations' && (
                <div className="space-y-4">
                  {specializations.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{item.cluster}</div>
                        <div className="font-bold text-slate-900">{item.label}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          title="Edit Item"
                          className="p-3 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete('specializations', item.id)} 
                          title="Delete Item"
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'journey' && (
                <div className="space-y-4">
                  {journey.map(item => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-primary mb-1">{item.year}</div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-sm text-slate-500">{item.organization}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          title="Edit Item"
                          className="p-3 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete('journey', item.id)} 
                          title="Delete Item"
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'professor' && professor && (
                <form 
                  className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = Object.fromEntries(formData.entries());
                    try {
                      const res = await fetch('/api/professor', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                      });
                      if (res.ok) {
                        alert('Site settings updated!');
                        fetchData();
                      } else {
                        alert('Failed to update settings');
                      }
                    } catch (error) {
                      console.error('Settings save error:', error);
                      alert('An error occurred while saving settings');
                    }
                  }}
                >
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold border-b pb-2">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Professor Name</label>
                        <input name="name" defaultValue={professor.name} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email</label>
                        <input name="email" defaultValue={professor.email} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">LinkedIn URL</label>
                        <input name="linkedin_url" defaultValue={professor.linkedin_url} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Logo URL</label>
                        <input name="logo_url" defaultValue={professor.logo_url} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" placeholder="Leave empty for default icon" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold border-b pb-2">Hero Section (Home Page)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Hero Title</label>
                        <input name="hero_title" defaultValue={professor.hero_title} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Hero Image URL</label>
                        <input name="hero_image_url" defaultValue={professor.hero_image_url} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Hero Background Color</label>
                        <div className="flex gap-4 items-center">
                          <input name="hero_bg_color" type="color" defaultValue={professor.hero_bg_color || "#0f172a"} className="w-20 h-12 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary p-1" />
                          <span className="text-xs text-slate-400">Used if image is missing or as overlay base</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Secondary Background Color</label>
                        <div className="flex gap-4 items-center">
                          <input name="secondary_bg_color" type="color" defaultValue={professor.secondary_bg_color || "#f8fafc"} className="w-20 h-12 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary p-1" />
                          <span className="text-xs text-slate-400">Used for alternating sections</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Hero Subtitle</label>
                      <textarea name="hero_subtitle" defaultValue={professor.hero_subtitle} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all resize-none"></textarea>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold border-b pb-2">Biography & Photo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Professor Photo URL</label>
                        <input name="photo_url" defaultValue={professor.photo_url} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Address</label>
                        <input name="address" defaultValue={professor.address} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Phone</label>
                        <input name="phone" defaultValue={professor.phone} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Biography</label>
                      <textarea name="bio" defaultValue={professor.bio} rows={8} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-primary transition-all resize-none"></textarea>
                    </div>
                  </div>

                  <button type="submit" className="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all">
                    <Save size={20} /> Save All Settings
                  </button>
                </form>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-lg font-bold text-slate-900">{msg.name}</div>
                          <div className="text-sm text-primary font-bold">{msg.email}</div>
                        </div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{formatDate(msg.date)}</div>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                        "{msg.message}"
                      </p>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-center text-slate-400 py-20">No messages yet.</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
