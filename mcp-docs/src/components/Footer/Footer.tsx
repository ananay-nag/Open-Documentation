import React from 'react';
import { Heart, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F19] transition-colors duration-200 py-10 px-4 sm:px-6">
      <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Creator Info */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Created with</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://github.com/ananay-nag"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-700 dark:text-slate-200 hover:text-mcp-primary dark:hover:text-mcp-primary-light hover:underline transition-colors"
          >
            ananay-nag
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a
            href="https://github.com/ananay-nag/mcp-decorators"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            <span>GitHub Repository</span>
          </a>
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Official MCP Spec</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>

        {/* License */}
        <div className="text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} MCP Decorators. Released under the MIT License.
        </div>
      </div>
    </footer>
  );
};
