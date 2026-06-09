import { motion } from 'framer-motion'
import { Copy, Check, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function Hero() {
  const [copied, setCopied] = useState(false)
  const installCmd = "curl -fsSL https://raw.githubusercontent.com/ananay-nag/gflip/refs/heads/main/install.sh | bash"

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#0c0c0c] border border-zinc-800 p-8 lg:p-12 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10"
    >
      <div className="flex-1 text-left relative">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-zinc-100">
          <span className="text-green-500">$ </span>
          Manage Git Identities <br className="hidden sm:block" />
          <span className="text-green-400">Effortlessly_</span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-xl mb-8 leading-relaxed">
          Git-Flip is a blazing-fast utility to easily set and switch between multiple Git profiles, just like <code className="text-green-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">git config</code>, but managed centrally.
        </p>

        <div className="flex items-center gap-4">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#commands"
            className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/50 px-6 py-3 font-semibold hover:bg-green-500/20 transition-all"
          >
            ./explore-commands.sh <ChevronRight size={18} />
          </motion.a>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full xl:w-auto relative"
      >
        <div className="relative bg-black border border-zinc-800 p-4 flex items-center justify-between group w-full xl:w-[480px]">
          <div className="overflow-x-auto custom-scrollbar pb-1">
            <code className="text-sm text-zinc-300 whitespace-nowrap pr-4">
              <span className="text-zinc-500"># Install via bash</span><br/>
              <span className="text-green-400">curl</span> -fsSL https://raw.githubusercontent.com/ananay-nag/gflip/refs/heads/main/install.sh | <span className="text-green-400">bash</span>
            </code>
          </div>
          <button
            onClick={handleCopy}
            className="ml-4 p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-all shrink-0 hover:text-green-400"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
        </div>
      </motion.div>
    </motion.section>
  )
}
