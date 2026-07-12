import React from 'react';
import { Menu, X } from 'lucide-react';
import { VersionDropdown } from './VersionDropdown';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import mcpLogo from '../../assets/mcp-hex-pink.svg';
import { motion } from 'framer-motion';

interface HeaderProps {
  version: string;
  setVersion: (ver: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sections: any[];
  onSelectResult: (sectionId: string, itemId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: 'home' | 'docs';
  setActiveTab: (tab: 'home' | 'docs') => void;
  versions: { version: string; isLatest: boolean; isDeprecated: boolean; title: string }[];
}

export const Header: React.FC<HeaderProps> = ({
  version,
  setVersion,
  darkMode,
  toggleDarkMode,
  sections,
  onSelectResult,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
  versions,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[90rem] mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">

        {/* Left: Brand/Logo & Mobile Hamburger toggle */}
        <div className="flex items-center gap-3">
          {activeTab === 'docs' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 md:hidden rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 py-1">
            <motion.img
              src={mcpLogo}
              alt="MCP Decorators Logo"
              className="h-12 w-12 object-contain"
              // animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            />
            <span className="text-[20px] font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
              MCP{'  '}Decorators
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 ml-8 border-l border-slate-200 dark:border-slate-800 pl-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-semibold transition-colors duration-150 ${activeTab === 'home'
                ? 'text-mcp-primary dark:text-mcp-primary-light font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('docs');
                onSelectResult(sections[0].id, sections[0].items[0].id);
              }}
              className={`text-sm font-semibold transition-colors duration-150 ${activeTab === 'docs'
                ? 'text-mcp-primary dark:text-mcp-primary-light font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              Docs
            </button>
          </nav>
        </div>

        {/* Middle: Desktop Search Bar (docs page only) */}
        <div className="hidden md:flex flex-1 max-w-md justify-center">
          {activeTab === 'docs' && (
            <SearchBar sections={sections} onSelectResult={(secId, itmId) => {
              setActiveTab('docs');
              onSelectResult(secId, itmId);
            }} />
          )}
        </div>

        {/* Right: Desktop Version Select, Theme Toggle, Github */}
        <div className="flex items-center gap-3.5">
          {/* Version select dropdown only on desktop and only inside doc page */}
          <div className="hidden md:block">
            {activeTab === 'docs' && (
              <VersionDropdown version={version} setVersion={setVersion} versions={versions} />
            )}
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          <a
            href="https://github.com/ananay-nag/mcp-decorators"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Mobile search bar block (only on docs page) */}
      {activeTab === 'docs' && (
        <div className="max-w-[90rem] mx-auto px-4 pb-3 md:hidden">
          <SearchBar sections={sections} onSelectResult={(secId, itmId) => {
            setActiveTab('docs');
            onSelectResult(secId, itmId);
          }} />
        </div>
      )}
    </header>
  );
};
