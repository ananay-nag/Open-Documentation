import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  sectionTitle: string;
  itemTitle: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ sectionTitle, itemTitle }) => {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
      <div className="flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Docs</span>
      </div>
      <ChevronRight className="h-3 w-3 shrink-0" />
      <span>{sectionTitle}</span>
      <ChevronRight className="h-3 w-3 shrink-0" />
      <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{itemTitle}</span>
    </nav>
  );
};
