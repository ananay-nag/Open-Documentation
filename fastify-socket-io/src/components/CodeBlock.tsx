import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative group rounded-2xl overflow-hidden bg-[#0c0c0e] border border-white/10 shadow-2xl shadow-black/50"
    >
      {/* Mac OS Window Controls & Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Terminal className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="p-6 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono text-blue-100/90 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </motion.div>
  );
};
