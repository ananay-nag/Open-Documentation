import { Github, TerminalSquare } from 'lucide-react'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Commands } from './components/Commands'
import { TerminalDemo } from './components/TerminalDemo'

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur border-b border-green-900 shadow-[0_4px_30px_rgba(34,197,94,0.05)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-green-400">
          <TerminalSquare size={24} />
          <span>gflip<span className="text-zinc-500">~</span></span>
        </div>
        <a 
          href="https://github.com/ananay-nag/gflip" 
          target="_blank" 
          rel="noreferrer"
          className="p-2 text-zinc-400 hover:text-green-400 transition-colors"
          title="View on GitHub"
        >
          <Github size={20} />
        </a>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="py-6 text-center text-zinc-600 text-sm border-t border-zinc-900 mt-12">
      <p>echo "Built for effortless Git identity management. MIT Licensed."</p>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col font-mono overflow-x-hidden selection:bg-green-500/30">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full flex flex-col gap-8 relative">
        <Hero />
        
        {/* The Animated Terminal Demo */}
        
        <Features />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
           <TerminalDemo />
          </div>
          <div className="lg:col-span-7">
            <Commands />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
