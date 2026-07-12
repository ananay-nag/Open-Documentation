import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Cpu } from 'lucide-react';

interface ComparisonData {
  decorators: string;
  original: string;
  decoratorFile: string;
  originalFile: string;
}

const SERVER_COMP: ComparisonData = {
  decoratorFile: "calculator-server.ts",
  decorators: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { RegisterServer, UseServer, Tool } from "@ananay-nag/mcp-decorators";
import { z } from "zod";

@RegisterServer()
export class CalculatorServer extends Server {}

@UseServer({ name: "calc-server" })
export class CalcHandlers {
  @Tool({
    name: "add",
    description: "Add two numbers",
    inputSchema: z.object({
      a: z.number(),
      b: z.number()
    })
  })
  async add(args: { a: number; b: number }) {
    return {
      content: [{ type: "text", text: String(args.a + args.b) }]
    };
  }
}`,
  originalFile: "server-monolith.ts",
  original: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  { name: "calc-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "add") {
    const args = request.params.arguments as any;
    return {
      content: [{ type: "text", text: String(args.a + args.b) }]
    };
  }
  throw new Error("Tool not found");
});`
};

const CLIENT_COMP: ComparisonData = {
  decoratorFile: "app-client.ts",
  decorators: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { RegisterClient, UseClient, CallTool } from "@ananay-nag/mcp-decorators";

@RegisterClient()
export class AppClient extends Client {}

@UseClient({ name: "calc-client" })
export class AppController {
  client: any;

  @CallTool("add")
  async addNumbers(a: number, b: number): Promise<any> {}
}

const controller = new AppController();
const result = await controller.addNumbers(5, 10);`,
  originalFile: "client-raw.ts",
  original: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const client = new Client(
  { name: "calc-client", version: "1.0.0" },
  { capabilities: {} }
);

// Call tool manually via JSON-RPC request methods
const result = await client.request(
  {
    method: "tools/call",
    params: {
      name: "add",
      arguments: { a: 5, b: 10 }
    }
  },
  CallToolResultSchema
);`
};

const highlightCode = (code: string, language: string) => {
  const cleanLang = language.toLowerCase();
  
  if (cleanLang !== 'typescript' && cleanLang !== 'javascript' && cleanLang !== 'ts' && cleanLang !== 'js' && cleanLang !== 'tsx') {
    return <code>{code}</code>;
  }

  const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
};

export const CodeComparison: React.FC = () => {
  const [role, setRole] = useState<'server' | 'client'>('server');
  const activeData = role === 'server' ? SERVER_COMP : CLIENT_COMP;

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          See the Difference
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Compare how standard Model Context Protocol SDK code compares to cleaner, declarative classes using decorators.
        </p>

        {/* Role Selector Tabs */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-[#161E2E]/50 rounded-xl border border-slate-200/80 dark:border-slate-800/80 mt-6 shadow-inner">
          <button
            onClick={() => setRole('server')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              role === 'server'
                ? 'bg-white dark:bg-[#161E2E] text-mcp-primary dark:text-mcp-primary-light shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Server-Side</span>
          </button>
          <button
            onClick={() => setRole('client')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              role === 'client'
                ? 'bg-white dark:bg-[#161E2E] text-mcp-primary dark:text-mcp-primary-light shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Client-Side</span>
          </button>
        </div>
      </div>

      {/* Editor Panels Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <AnimatePresence mode="wait">
          {/* Left panel: MCP Decorators */}
          <motion.div
            key={`${role}-decorators`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col rounded-2xl overflow-hidden border border-mcp-primary/20 dark:border-mcp-primary/30 bg-slate-950 text-slate-100 shadow-xl"
          >
            {/* Editor Title Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-mono text-mcp-accent-light dark:text-mcp-accent-light font-semibold ml-2">
                  {activeData.decoratorFile}
                </span>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-mcp-accent-light bg-slate-900 border border-slate-800 rounded-md tracking-wider uppercase">
                mcp-decorators
              </span>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed max-h-[600px] min-h-[460px]">
              <pre className="whitespace-pre">
                {highlightCode(activeData.decorators, 'typescript')}
              </pre>
            </div>
          </motion.div>

          {/* Right panel: Standard SDK */}
          <motion.div
            key={`${role}-original`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-950 text-slate-100 shadow-xl"
          >
            {/* Editor Title Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold ml-2">
                  {activeData.originalFile}
                </span>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-800/60 border border-slate-700/50 rounded-md tracking-wider uppercase">
                typescript-sdk
              </span>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed max-h-[600px] min-h-[460px]">
              <pre className="whitespace-pre">
                {highlightCode(activeData.original, 'typescript')}
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
