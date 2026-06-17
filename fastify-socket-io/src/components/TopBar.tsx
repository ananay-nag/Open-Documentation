import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, ChevronDown, GitBranch } from 'lucide-react';

interface TopBarProps {
  versions: string[];
  selectedVersion: string;
  onVersionChange: (v: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ versions, selectedVersion, onVersionChange }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight shrink-0">Fastify Socket.IO</span>
        </div>

        {/* Primary Navigation */}
        <nav className="flex items-center gap-6 md:gap-8 overflow-x-auto custom-scrollbar pb-1">
          <button onClick={() => scrollToSection('home')} className="cursor-pointer text-xs md:text-sm font-bold text-slate-300 hover:text-white transition-colors tracking-widest uppercase">
            Home
          </button>
          <button onClick={() => scrollToSection('docs')} className="cursor-pointer text-xs md:text-sm font-bold text-slate-300 hover:text-white transition-colors tracking-widest uppercase">
            Docs
          </button>
          <a href="https://github.com/ananay-nag/fastify-socket-io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-300 hover:text-white transition-colors tracking-widest uppercase">
            Git
            <GitBranch className="w-4 h-4 hidden md:block" />
          </a>
          <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <select
              value={selectedVersion}
              onChange={(e) => onVersionChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer text-sm font-medium transition-all hover:bg-white/10"
            >
              {versions.map((v) => (
                <option key={v} value={v} className="bg-[#09090b]">
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        </nav>

        {/* Right Controls */}
        {/* <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <select
              value={selectedVersion}
              onChange={(e) => onVersionChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer text-sm font-medium transition-all hover:bg-white/10"
            >
              {versions.map((v) => (
                <option key={v} value={v} className="bg-[#09090b]">
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div> */}
      </div>
    </motion.header>
  );
};
