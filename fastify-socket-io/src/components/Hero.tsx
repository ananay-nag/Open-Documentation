import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Copy, Check } from 'lucide-react';

export const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyNpm = async () => {
    await navigator.clipboard.writeText("npm i @ananay-nag/fastify-socket-io");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section id="home" className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-[#09090b]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-[#09090b] to-[#09090b]"></div>

      {/* Animated Particles/Nodes */}
      <motion.div
        animate={{ y: [0, -50, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-blue-500/10 mb-6 border border-blue-500/30"
        >
          <Activity className="w-10 h-10 text-blue-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-blue-600 tracking-tighter mb-2"
        >
          Fastify-Socket-IO
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6"
        >
          Real-Time Sockets
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Enterprise-grade WebSocket infrastructure for Fastify. Powering lightning-fast, persistent, and secure connections.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={handleCopyNpm}
            className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-mono text-sm transition-all shadow-lg hover:border-white/20 group"
          >
            <span className="text-blue-400">npm i</span>
            <span>@ananay-nag/fastify-socket-io</span>
            {copied ? <Check className="w-4 h-4 text-emerald-400 ml-2" /> : <Copy className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors ml-2" />}
          </button>

          <a
            href="https://fastify-socket-io.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-100 hover:scale-105"
          >
            <span>See Live Example</span>
            <Activity className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
