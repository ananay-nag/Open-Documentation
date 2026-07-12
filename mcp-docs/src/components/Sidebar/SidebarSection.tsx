import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

interface DocItem {
  id: string;
  title: string;
}

interface SidebarSectionProps {
  sectionId: string;
  title: string;
  items: DocItem[];
  activeItemId: string;
  activeSectionId: string;
  onItemClick: (sectionId: string, itemId: string) => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  sectionId,
  title,
  items,
  activeItemId,
  activeSectionId,
  onItemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 last:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 hover:text-slate-800 dark:hover:text-slate-350 transition-colors"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-slate-400"
        >
          <ChevronRight className="h-3 w-3" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden mt-1 pl-1 flex flex-col gap-0.5"
          >
            {items.map((item: any) => {
              if (item.items) {
                return (
                  <CollapsibleSubList
                    key={item.id}
                    sectionId={sectionId}
                    item={item}
                    activeItemId={activeItemId}
                    activeSectionId={activeSectionId}
                    onItemClick={onItemClick}
                  />
                );
              }
              return (
                <SidebarItem
                  key={item.id}
                  itemId={item.id}
                  sectionId={sectionId}
                  title={item.title}
                  isActive={activeSectionId === sectionId && activeItemId === item.id}
                  onClick={() => onItemClick(sectionId, item.id)}
                  isDeprecated={item.isDeprecated}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CollapsibleSubList: React.FC<{
  sectionId: string;
  item: any;
  activeItemId: string;
  activeSectionId: string;
  onItemClick: (sectionId: string, itemId: string) => void;
}> = ({ sectionId, item, activeItemId, activeSectionId, onItemClick }) => {
  const isSubActive = item.items.some((sub: any) => sub.id === activeItemId) && activeSectionId === sectionId;
  const [expanded, setExpanded] = useState(isSubActive);

  React.useEffect(() => {
    if (isSubActive) {
      setExpanded(true);
    }
  }, [isSubActive]);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-between group ${
          isSubActive
            ? 'text-mcp-primary dark:text-mcp-primary-light font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <span className="relative z-10 whitespace-nowrap">{item.title}</span>
        <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? 'rotate-90 text-mcp-primary' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden pl-3.5 border-l border-slate-200/60 dark:border-slate-800 ml-3.5 mt-0.5 flex flex-col gap-0.5"
          >
            {item.items.map((sub: any) => (
              <SidebarItem
                key={sub.id}
                itemId={sub.id}
                sectionId={sectionId}
                title={sub.title}
                isActive={activeSectionId === sectionId && activeItemId === sub.id}
                onClick={() => onItemClick(sectionId, sub.id)}
                isDeprecated={sub.isDeprecated}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
