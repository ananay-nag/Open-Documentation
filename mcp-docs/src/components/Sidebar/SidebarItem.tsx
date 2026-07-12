import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  itemId: string;
  sectionId: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  isDeprecated?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  isActive,
  onClick,
  isDeprecated,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-between group ${
        isActive
          ? 'text-mcp-primary dark:text-mcp-primary-light font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
    >
      {/* Background slide indicator using Framer Motion layoutId */}
      {isActive && (
        <motion.div
          layoutId="active-sidebar-bg"
          className="absolute inset-0 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 rounded-lg -z-10"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex items-center justify-between w-full min-w-0 gap-2">
        <span className={`truncate ${isDeprecated ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
          {title}
        </span>
        {isDeprecated && (
          <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-wider shrink-0 scale-90 origin-right">
            deprecated
          </span>
        )}
      </div>
    </button>
  );
};
