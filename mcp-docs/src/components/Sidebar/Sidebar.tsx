import React from 'react';
import { X, Home, BookOpen, Layers } from 'lucide-react';
import { SidebarSection } from './SidebarSection';

interface DocItem {
  id: string;
  title: string;
}

interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

interface SidebarProps {
  sections: DocSection[];
  activeItemId: string;
  activeSectionId: string;
  onItemClick: (sectionId: string, itemId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: 'home' | 'docs';
  setActiveTab: (tab: 'home' | 'docs') => void;
  version: string;
  setVersion: (ver: string) => void;
  versions: { version: string; isLatest: boolean; isDeprecated: boolean; title: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeItemId,
  activeSectionId,
  onItemClick,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
  version,
  setVersion,
  versions,
}) => {
  return (
    <>
      {/* Desktop Sidebar (Permanent left panel, only shown if activeTab is 'docs') */}
      {activeTab === 'docs' && (
        <aside className="hidden md:block w-70 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F19] md:h-full overflow-y-auto overflow-x-auto px-4 py-6 transition-colors duration-200">
          <nav className="flex flex-col gap-1 min-w-max">
            {sections.map((section) => (
              <SidebarSection
                key={section.id}
                sectionId={section.id}
                title={section.title}
                items={section.items}
                activeItemId={activeItemId}
                activeSectionId={activeSectionId}
                onItemClick={onItemClick}
              />
            ))}
          </nav>
        </aside>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Slide-Out Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto overflow-x-auto transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button Inside Drawer */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-6 mt-12">
          <span className="text-sm font-bold tracking-wider text-slate-400 dark:text-slate-550 uppercase">
            Navigation Menu
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light'
                  : 'text-slate-650 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <Home className="h-4.5 w-4.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('docs');
                // Select first item by default if docs wasn't open
                onItemClick(sections[0].id, sections[0].items[0].id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'docs'
                  ? 'bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light'
                  : 'text-slate-650 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              <span>Docs Hub</span>
            </button>
          </nav>

          {/* Collapsible Options (Only shown if activeTab is 'docs') */}
          {activeTab === 'docs' && (
            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6">
              
              {/* Mobile Version Dropdown */}
              <div className="mb-6 px-3">
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Select Version
                </label>
                <div className="relative">
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2 bg-slate-100 dark:bg-[#161E2E] text-slate-850 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700/80 rounded-xl cursor-pointer focus:outline-none"
                  >
                    {versions.map((v) => (
                      <option key={v.version} value={v.version}>
                        v{v.version} {v.isLatest ? '(Latest)' : v.isDeprecated ? '(Deprecated)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Layers className="h-4 w-4 text-mcp-primary" />
                  </div>
                </div>
              </div>

              {/* Sidebar Content Tree */}
              <nav className="flex flex-col gap-1 min-w-max">
                {sections.map((section) => (
                  <SidebarSection
                    key={section.id}
                    sectionId={section.id}
                    title={section.title}
                    items={section.items}
                    activeItemId={activeItemId}
                    activeSectionId={activeSectionId}
                    onItemClick={(secId, itmId) => {
                      onItemClick(secId, itmId);
                      setMobileMenuOpen(false); // Close on selection
                    }}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
