import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

const highlightCode = (code: string, language: string) => {
  const cleanLang = language.toLowerCase();
  
  if (cleanLang !== 'typescript' && cleanLang !== 'javascript' && cleanLang !== 'ts' && cleanLang !== 'js' && cleanLang !== 'tsx' && cleanLang !== 'json' && cleanLang !== 'bash' && cleanLang !== 'shell' && cleanLang !== 'sh') {
    return <code>{code}</code>;
  }

  // Helper to escape HTML
  const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (cleanLang === 'typescript' || cleanLang === 'javascript' || cleanLang === 'ts' || cleanLang === 'js' || cleanLang === 'tsx') {
    // Tokenize comments, strings, decorators, numbers, words, and single non-word characters
    const parts = code.split(/(\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`|@\w+|\b\d+\b|\b\w+\b|[^\w\s])/g);
    
    const keywords = new Set(['class', 'const', 'export', 'import', 'from', 'return', 'async', 'await', 'function', 'let', 'get', 'set', 'extends', 'implements', 'new', 'this', 'throw', 'try', 'catch', 'finally', 'default', 'interface', 'type', 'as', 'of', 'super', 'constructor']);
    const types = new Set(['string', 'number', 'boolean', 'void', 'any', 'Promise', 'Client', 'Server', 'McpServer', 'McpClient', 'Tool', 'Prompt', 'Resource', 'Notification', 'StdioClientTransport', 'ServerCapabilities', 'McpServerOptions', 'ListToolsResult', 'CallToolResult']);

    let html = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      if (part.startsWith('//') || part.startsWith('/*')) {
        html += `<span class="text-slate-500 italic">${escapeHtml(part)}</span>`;
      } else if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
        html += `<span class="text-emerald-400">${escapeHtml(part)}</span>`;
      } else if (part.startsWith('@')) {
        html += `<span class="text-pink-400 font-bold">${escapeHtml(part)}</span>`;
      } else if (/^\d+$/.test(part)) {
        html += `<span class="text-sky-400">${escapeHtml(part)}</span>`;
      } else if (keywords.has(part)) {
        html += `<span class="text-mcp-accent-light font-medium">${escapeHtml(part)}</span>`;
      } else if (types.has(part)) {
        html += `<span class="text-cyan-400 font-medium">${escapeHtml(part)}</span>`;
      } else if (/^\w+$/.test(part)) {
        // Lookahead to see if next non-empty part is '('
        let isFunc = false;
        for (let j = i + 1; j < parts.length; j++) {
          if (parts[j] && parts[j].trim()) {
            if (parts[j] === '(') {
              isFunc = true;
            }
            break;
          }
        }
        if (isFunc) {
          html += `<span class="text-amber-300 font-medium">${escapeHtml(part)}</span>`;
        } else {
          html += escapeHtml(part);
        }
      } else {
        html += escapeHtml(part);
      }
    }
    
    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (cleanLang === 'json') {
    const parts = code.split(/(\/\/.*|"(?:\\.|[^\\"])*"|\b(?:true|false|null|\d+)\b|[^\w\s])/g);
    
    let html = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      if (part.startsWith('"')) {
        // Check if this is a key (followed by colon)
        let isKey = false;
        for (let j = i + 1; j < parts.length; j++) {
          if (parts[j] && parts[j].trim()) {
            if (parts[j] === ':') {
              isKey = true;
            }
            break;
          }
        }
        if (isKey) {
          html += `<span class="text-mcp-accent-light">${escapeHtml(part)}</span>`;
        } else {
          html += `<span class="text-emerald-400">${escapeHtml(part)}</span>`;
        }
      } else if (/^(?:true|false|null|\d+)$/.test(part)) {
        html += `<span class="text-sky-400">${escapeHtml(part)}</span>`;
      } else {
        html += escapeHtml(part);
      }
    }
    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (cleanLang === 'bash' || cleanLang === 'shell' || cleanLang === 'sh') {
    const parts = code.split(/(#.*|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|-\w+|--\w+(-\w+)*|\b\w+\b|[^\w\s])/g);
    const commands = new Set(['npm', 'npx', 'git', 'node', 'tsc', 'curl', 'install', 'run', 'build', 'dev', 'cli', 'start']);

    let html = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      if (part.startsWith('#')) {
        html += `<span class="text-slate-500 italic">${escapeHtml(part)}</span>`;
      } else if (part.startsWith('"') || part.startsWith("'")) {
        html += `<span class="text-emerald-400">${escapeHtml(part)}</span>`;
      } else if (part.startsWith('-')) {
        html += `<span class="text-cyan-400">${escapeHtml(part)}</span>`;
      } else if (commands.has(part)) {
        html += `<span class="text-mcp-accent-light font-semibold">${escapeHtml(part)}</span>`;
      } else {
        html += escapeHtml(part);
      }
    }
    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Default fallback
  return <code>{code}</code>;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
      
      {/* Codeblock Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          {/* macOS window controls */}
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="uppercase tracking-wider font-bold text-[9px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-mcp-accent-light">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="overflow-x-auto p-4 text-sm font-mono leading-relaxed max-h-[500px]">
        <pre className="whitespace-pre">
          {highlightCode(code, language)}
        </pre>
      </div>
    </div>
  );
};
