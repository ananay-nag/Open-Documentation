import React from 'react';
import { CodeBlock } from './CodeBlock';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';

interface TabItem {
  name: string;
  code: string;
  language?: string;
}

interface ContentBlock {
  type: string;
  text?: string;
  code?: string;
  language?: string;
  level?: number;
  items?: string[];
  style?: 'note' | 'tip' | 'important' | 'warning';
  headers?: string[];
  rows?: string[][];
  tabs?: TabItem[];
}

interface MarkdownRendererProps {
  content: ContentBlock[];
}

const CodeTabs: React.FC<{ tabs: TabItem[] }> = ({ tabs }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  
  if (!tabs || tabs.length === 0) return null;
  const activeTab = tabs[activeIdx];

  return (
    <div className="my-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-slate-50/50 dark:bg-slate-900/10">
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 px-2 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all shrink-0 ${
              activeIdx === idx
                ? 'border-mcp-primary text-mcp-primary dark:border-mcp-primary-light dark:text-mcp-primary-light font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="p-0">
        <CodeBlock
          language={activeTab.language || 'typescript'}
          code={activeTab.code}
        />
      </div>
    </div>
  );
};

// Simple inline parser for **bold** and `code`
const parseInlineText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 font-mono text-xs text-indigo-600 dark:text-mcp-primary-light bg-slate-100 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-800/85">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-base text-slate-650 dark:text-slate-300 leading-7 my-4">
                {block.text ? parseInlineText(block.text) : ''}
              </p>
            );
            
          case 'heading': {
            const level = block.level || 2;
            const text = block.text || '';
            const classes =
              level === 1
                ? 'text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-6'
                : level === 2
                ? 'text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2'
                : 'text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-200 mt-6 mb-3';

            if (level === 1) {
              return <h1 key={index} className={classes}>{parseInlineText(text)}</h1>;
            } else if (level === 3) {
              return <h3 key={index} className={classes}>{parseInlineText(text)}</h3>;
            } else {
              return <h2 key={index} className={classes}>{parseInlineText(text)}</h2>;
            }
          }

          case 'code':
            return (
              <CodeBlock
                key={index}
                language={block.language || 'typescript'}
                code={block.code || ''}
              />
            );

          case 'list':
            return (
              <ul key={index} className="list-disc pl-6 space-y-2.5 my-4 text-slate-700 dark:text-slate-300 text-sm md:text-base">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>{parseInlineText(item)}</li>
                ))}
              </ul>
            );

          case 'alert': {
            const style = block.style || 'note';
            let bgClass = 'bg-blue-50/70 border-blue-500/80 dark:bg-blue-950/20 dark:border-blue-500/40 text-blue-800 dark:text-blue-200';
            let Icon = Info;
            let label = 'Note';

            if (style === 'warning') {
              bgClass = 'bg-amber-50/70 border-amber-500/80 dark:bg-amber-950/20 dark:border-amber-500/40 text-amber-800 dark:text-amber-200';
              Icon = AlertTriangle;
              label = 'Warning';
            } else if (style === 'tip') {
              bgClass = 'bg-emerald-50/70 border-emerald-500/80 dark:bg-emerald-950/20 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200';
              Icon = Lightbulb;
              label = 'Tip';
            } else if (style === 'important') {
              bgClass = 'bg-indigo-50/70 border-indigo-500/80 dark:bg-indigo-950/20 dark:border-indigo-500/40 text-indigo-800 dark:text-indigo-200';
              Icon = Info;
              label = 'Important';
            }

            return (
              <div key={index} className={`my-6 flex gap-3 px-4 py-3 border-l-4 rounded-r-lg ${bgClass}`}>
                <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm leading-6">{block.text ? parseInlineText(block.text) : ''}</div>
                </div>
              </div>
            );
          }

          case 'table':
            return (
              <div key={index} className="my-6 overflow-x-auto border border-slate-200 dark:border-slate-800/80 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800/80">
                      {block.headers?.map((header: string, hIdx: number) => (
                        <th key={hIdx} className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                    {block.rows?.map((row: string[], rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                        {row.map((cell: string, cIdx: number) => (
                          <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                            {parseInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'code-tabs':
            return (
              <CodeTabs key={index} tabs={block.tabs || []} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
