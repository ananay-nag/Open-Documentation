import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavPage {
  sectionId: string;
  itemId: string;
  title: string;
}

interface PrevNextNavigationProps {
  prev: NavPage | null;
  next: NavPage | null;
  onPageChange: (sectionId: string, itemId: string) => void;
}

export const PrevNextNavigation: React.FC<PrevNextNavigationProps> = ({ prev, next, onPageChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-slate-200/80 dark:border-slate-800/85">
      {prev ? (
        <button
          onClick={() => onPageChange(prev.sectionId, prev.itemId)}
          className="w-full sm:w-auto px-5 py-3 flex flex-col items-start gap-1 rounded-xl border border-slate-200 dark:border-slate-850 hover:border-mcp-primary/50 dark:hover:border-mcp-primary-light/40 bg-white hover:bg-slate-50/50 dark:bg-[#161E2E]/50 dark:hover:bg-[#161E2E] text-left transition-all duration-200 group"
        >
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest flex items-center gap-1">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" /> Previous
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-mcp-primary dark:group-hover:text-mcp-primary-light transition-colors">
            {prev.title}
          </span>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <button
          onClick={() => onPageChange(next.sectionId, next.itemId)}
          className="w-full sm:w-auto px-5 py-3 flex flex-col items-end gap-1 rounded-xl border border-slate-200 dark:border-slate-850 hover:border-mcp-primary/50 dark:hover:border-mcp-primary-light/40 bg-white hover:bg-slate-50/50 dark:bg-[#161E2E]/50 dark:hover:bg-[#161E2E] text-right transition-all duration-200 group"
        >
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest flex items-center gap-1">
            Next <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-mcp-primary dark:group-hover:text-mcp-primary-light transition-colors">
            {next.title}
          </span>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
};
