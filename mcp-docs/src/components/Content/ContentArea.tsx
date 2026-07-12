import React from 'react';
import { motion } from 'framer-motion';
import { Breadcrumbs } from './Breadcrumbs';
import { MarkdownRenderer } from './MarkdownRenderer';
import { PrevNextNavigation } from './PrevNextNavigation';

interface ContentBlock {
  type: string;
  text?: string;
  code?: string;
  language?: string;
  level?: number;
  items?: string[];
  style?: 'note' | 'tip' | 'important' | 'warning';
}

interface DocItem {
  id: string;
  title: string;
  content: ContentBlock[];
}

interface NavPage {
  sectionId: string;
  itemId: string;
  title: string;
}

interface ContentAreaProps {
  sectionTitle: string;
  item: DocItem;
  prevPage: NavPage | null;
  nextPage: NavPage | null;
  onPageChange: (sectionId: string, itemId: string) => void;
  isVersionDeprecated?: boolean;
  versionDeprecationMessage?: string;
  isItemDeprecated?: boolean;
  itemDeprecationMessage?: string;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  sectionTitle,
  item,
  prevPage,
  nextPage,
  onPageChange,
  isVersionDeprecated,
  versionDeprecationMessage,
  isItemDeprecated,
  itemDeprecationMessage,
}) => {
  return (
    <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 md:py-12 overflow-y-auto max-w-4xl mx-auto transition-colors duration-200">
      <Breadcrumbs sectionTitle={sectionTitle} itemTitle={item.title} />

      {/* 1. Version-level deprecation notice */}
      {isVersionDeprecated && (
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 flex items-start gap-3 shadow-sm">
          <div className="mt-0.5 shrink-0 bg-amber-500/20 p-1.5 rounded-lg">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-sm font-medium leading-relaxed">
            {versionDeprecationMessage || "This version is deprecated. Please switch to the latest SDK version."}
          </div>
        </div>
      )}

      {/* 2. Item-level (decorator/class/function) deprecation notice */}
      {isItemDeprecated && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-800 dark:text-red-300 flex items-start gap-3 shadow-sm">
          <div className="mt-0.5 shrink-0 bg-red-500/20 p-1.5 rounded-lg">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-sm font-medium leading-relaxed">
            <strong>Deprecation Warning:</strong> {itemDeprecationMessage || "This function, class, or decorator is deprecated and will be removed in future versions."}
          </div>
        </div>
      )}

      {/* Slide-fade entry animation on item change */}
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 mt-6 flex flex-wrap items-center gap-3">
          <span>{item.title}</span>
          {isItemDeprecated && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 uppercase tracking-widest border border-red-500/20 shadow-sm">
              Deprecated
            </span>
          )}
        </h1>

        <MarkdownRenderer content={item.content} />

        <PrevNextNavigation prev={prevPage} next={nextPage} onPageChange={onPageChange} />
      </motion.div>
    </main>
  );
};
