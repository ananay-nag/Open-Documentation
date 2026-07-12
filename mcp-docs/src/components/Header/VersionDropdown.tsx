import React from 'react';
import { ChevronDown, Layers } from 'lucide-react';

interface VersionDropdownProps {
  version: string;
  setVersion: (ver: string) => void;
  versions: { version: string; isLatest: boolean; isDeprecated: boolean; title: string }[];
}

export const VersionDropdown: React.FC<VersionDropdownProps> = ({ version, setVersion, versions }) => {
  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <label className="hidden sm:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          SDK Ver:
        </label>
        <div className="relative">
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="appearance-none pl-9 pr-8 py-1.5 bg-slate-100 dark:bg-[#20202d] text-slate-800 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700/80 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-mcp-pink transition-all hover:bg-slate-200 dark:hover:bg-[#2c2c3e]"
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
