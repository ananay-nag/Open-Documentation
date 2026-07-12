import React, { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, Command, FileText } from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  content?: Array<{ type: string; text?: string; code?: string; items?: string[] }>;
  items?: DocItem[];
}

interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

interface SearchBarProps {
  sections: DocSection[];
  onSelectResult: (sectionId: string, itemId: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ sections, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Array<{ sectionId: string; sectionTitle: string; item: DocItem }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Command+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/') {
        // If not typing in input, focus search
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
          setIsOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const matches: Array<{ sectionId: string; sectionTitle: string; item: DocItem }> = [];
    const searchVal = query.toLowerCase();

    for (const sec of sections) {
      for (const item of sec.items) {
        if (item.items) {
          // Folder item: search inside its nested sub-items
          for (const subItem of item.items) {
            const titleMatch = subItem.title.toLowerCase().includes(searchVal);
            const contentMatch = subItem.content && subItem.content.some((block: any) => {
              if (block.text && block.text.toLowerCase().includes(searchVal)) return true;
              if (block.code && block.code.toLowerCase().includes(searchVal)) return true;
              if (block.items && block.items.some((i: any) => i.toLowerCase().includes(searchVal))) return true;
              return false;
            });
            if (titleMatch || contentMatch) {
              matches.push({
                sectionId: sec.id,
                sectionTitle: `${sec.title} › ${item.title}`,
                item: subItem
              });
            }
          }
        } else {
          // Standard document leaf
          const titleMatch = item.title.toLowerCase().includes(searchVal);
          const contentMatch = item.content && item.content.some((block: any) => {
            if (block.text && block.text.toLowerCase().includes(searchVal)) return true;
            if (block.code && block.code.toLowerCase().includes(searchVal)) return true;
            if (block.items && block.items.some((i: any) => i.toLowerCase().includes(searchVal))) return true;
            return false;
          });
          if (titleMatch || contentMatch) {
            matches.push({
              sectionId: sec.id,
              sectionTitle: sec.title,
              item
            });
          }
        }
      }
    }

    setResults(matches.slice(0, 8)); // limit to 8 results
  }, [query, sections]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search docs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-12 py-1.5 bg-slate-100 dark:bg-[#161E2E] text-slate-900 dark:text-slate-100 text-sm border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mcp-primary focus:border-transparent transition-all"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 rounded shadow-sm">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Documentation Matches ({results.length})
              </div>
              {results.map(({ sectionId, sectionTitle, item }) => (
                <button
                  key={`${sectionId}-${item.id}`}
                  onClick={() => {
                    onSelectResult(sectionId, item.id);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors duration-150 group border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                >
                  <div className="p-1.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-md mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {sectionTitle}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-mcp-primary dark:group-hover:text-mcp-primary-light transition-colors">
                      {item.title}
                    </div>
                  </div>
                  <div className="hidden group-hover:flex items-center text-[10px] text-slate-400 gap-1 mt-2">
                    <span>Jump</span>
                    <CornerDownLeft className="h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for "<span className="font-semibold">{query}</span>"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
