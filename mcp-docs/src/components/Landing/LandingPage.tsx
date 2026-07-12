import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Terminal, Code, Cpu, ShieldCheck, Zap, Layers, RefreshCw, Copy, Check } from 'lucide-react';
import { CodeComparison } from './CodeComparison';
import mcpLogo from '../../assets/mcp-hex-pink.svg';
import { BackgroundAnimation } from './BackgroundAnimation';

interface LandingPageProps {
  onGoToDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDocs }) => {
  const [copied, setCopied] = useState(false);

  // Smooth mouse follow calculations
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const springConfig = { damping: 55, stiffness: 85, mass: 1.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const logo1X = useTransform(smoothX, (x) => x - 290);
  const logo1Y = useTransform(smoothY, (y) => y - 290);

  const logo2X = useTransform(smoothX, (x) => (typeof window !== 'undefined' ? window.innerWidth : 1200) - x - 240);
  const logo2Y = useTransform(smoothY, (y) => (typeof window !== 'undefined' ? window.innerHeight : 800) - y - 240);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText("npm install @ananay-nag/mcp-decorators");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="flex-grow w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-200 overflow-hidden pb-12 relative">
      <BackgroundAnimation />
      <div className="relative z-10 w-full">

        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-28 overflow-hidden max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Animated brand floating graphics */}
          <motion.img
            src={mcpLogo}
            alt="MCP Brand Dec BG 1"
            style={{ x: logo1X, y: logo1Y }}
            className="fixed top-0 left-0 w-[580px] h-[580px] pointer-events-none -z-10 select-none opacity-[0.08] dark:opacity-[0.06] filter blur-[0.5px]"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
          />

          <motion.img
            src={mcpLogo}
            alt="MCP Brand Dec BG 2"
            style={{ x: logo2X, y: logo2Y }}
            className="fixed top-0 left-0 w-[480px] h-[480px] pointer-events-none -z-10 select-none opacity-[0.02] dark:opacity-[0.012] filter blur-[0.5px]"
            animate={{
              rotate: [0, -360]
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
          />

          {/* Animated backdrop glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-mcp-primary/10 via-mcp-secondary/10 to-mcp-accent/10 dark:from-mcp-primary/5 dark:via-mcp-secondary/5 dark:to-mcp-accent/5 blur-3xl rounded-full -z-10 animate-pulse" />

          {/* Text block container with localized blur shield */}
          <div className="relative z-10 flex flex-col items-center w-full mx-auto py-6 px-4 md:px-8">
            {/* Localized blur shield behind text only */}
            <div className="absolute inset-0 dark:bg-slate-900/75 dark:bg-white-900/75 backdrop-blur-[8px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] -z-10 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-full text-xs font-semibold mb-6 border border-mcp-primary/15 dark:border-mcp-primary-light/15 shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 text-mcp-primary" />
              <span>Compatible with MCP Typescript SDK v2.0.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6 leading-[1.1]"
            >
              The Elegant Way to Build{' '} <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Model Context Protocols
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
            >
              Banish monolithic JSON-RPC code. Group tools, prompts, resources, and custom routing into type-safe, declarative TypeScript decorators. Build production-grade MCP integrations with 90% less boilerplate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onGoToDocs}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 dark:from-indigo-500 dark:via-violet-500 dark:to-cyan-400 text-white font-semibold rounded-xl hover:opacity-90 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Explore Documentation
              </button>
              <a
                href="https://github.com/ananay-nag/mcp-decorators"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-all flex items-center justify-center gap-2 focus:outline-none"
              >
                <span>View on GitHub</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Installation Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto px-6 py-6 text-center"
        >
          <h2 className="text-sm font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-4">
            Quick Installation
          </h2>
          <div className="relative flex items-center justify-between px-5 py-3.5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-850 shadow-xl font-mono text-sm max-w-full overflow-x-auto select-all">
            <div className="flex items-center gap-3">
              <span className="text-mcp-accent select-none">$</span>
              <span>npm install @ananay-nag/mcp-decorators</span>
            </div>
            <button
              onClick={handleCopyInstall}
              className="ml-6 p-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-100 rounded-xl transition-colors focus:outline-none"
              title="Copy command"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </motion.section>

        {/* Code Editor Comparison Panel */}
        <section className="bg-slate-150/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/40 py-12">
          <CodeComparison />
        </section>

        {/* Key Core Features */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Designed for Modern Agentic Workflows
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Everything you need to build secure, robust, and extensible Model Context Protocol connections.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >

            {/* Card 1 */}
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(79, 70, 229, 0.45)" }} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="p-2.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-xl w-fit">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Decoupled Handlers</h3>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                Organize code in separate, highly cohesive class modules (e.g. database handlers, file checkers) instead of huge monolith blocks.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(79, 70, 229, 0.45)" }} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="p-2.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-xl w-fit">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Auto-Aggregation</h3>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                When class instances are constructed, the decorator registry automatically scans method metadata and maps dispatch handlers.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(79, 70, 229, 0.45)" }} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="p-2.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-xl w-fit">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Multi-Version SDK Support</h3>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                Run seamlessly on either traditional v1 SDK classes or the modern v2 beta structure (`McpServer`), binding tools and prompts natively.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(79, 70, 229, 0.45)" }} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="p-2.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-xl w-fit">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Capability Self-Detection</h3>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                The decorators automatically evaluate which features (tools, prompts, completions) are loaded and calls `.registerCapabilities()`.
              </p>
            </motion.div>

            {/* Card 5 */}
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(79, 70, 229, 0.45)" }} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="p-2.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-xl w-fit">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Built-in Utility Helpers</h3>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                Standardized functions for tracking progress reports, RFC logs, and initiating custom form inputs (`elicitInput`).
              </p>
            </motion.div>

            {/* Card 6 */}
            <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(79, 70, 229, 0.45)" }} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="p-2.5 bg-mcp-primary/10 dark:bg-mcp-primary-light/10 text-mcp-primary dark:text-mcp-primary-light rounded-xl w-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Routing Filters</h3>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                Utilize `@RequestHandler`, `@NotificationHandler`, and `@ActionHandler` method decorators to capture custom JSON-RPC messages.
              </p>
            </motion.div>

          </motion.div>
        </section>

      </div>
    </div >
  );
};
