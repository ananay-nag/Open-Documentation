import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  id: string;
  title: string;
}

interface SidebarProps {
  features: Feature[];
  activeSection: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ features, activeSection }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0 sticky top-32 self-start max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
          Developer Guide
        </h3>
        <nav className="flex flex-col gap-1 border-l border-white/10 ml-3">
          {features.map((f) => {
            const isActive = activeSection === f.id;
            return (
              <button
                key={f.id}
                onClick={() => scrollToSection(f.id)}
                className={`text-left px-4 py-2.5 text-sm transition-all relative ${
                  isActive 
                    ? 'text-blue-400 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 rounded-r-lg'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -left-px top-0 bottom-0 w-0.5 bg-blue-500 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {f.title}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
