import { motion } from 'framer-motion'
import { Database, Zap, Search, Edit3 } from 'lucide-react'

const features = [
  {
    name: 'Central Database',
    description: 'Store unlimited Git identities centrally.',
    icon: Database,
  },
  {
    name: 'Instant Switch',
    description: 'Apply your configs globally or locally instantly.',
    icon: Zap,
  },
  {
    name: 'Smart Status',
    description: 'Auto-detects active profile.',
    icon: Search,
  },
  {
    name: 'Interactive UI',
    description: 'Add, update, or remove profiles via prompts.',
    icon: Edit3,
  },
]

export function Features() {
  return (
    <section className="h-full bg-[#0c0c0c] border border-zinc-800 p-6 lg:p-8">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">~/features</h2>
        <p className="mt-2 text-sm text-zinc-500">
          # Everything you need for Git identities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ x: 2, borderColor: '#4ade80' }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-black border border-zinc-800 transition-colors relative group"
          >
            <div className="flex items-center gap-3 mb-3 text-zinc-400 group-hover:text-green-400 transition-colors">
              <feature.icon size={18} />
              <h3 className="text-base font-semibold text-zinc-100">{feature.name}</h3>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              <span className="text-zinc-700">{'> '}</span>{feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
