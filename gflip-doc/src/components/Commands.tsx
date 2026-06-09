import { motion } from 'framer-motion'

const commands = [
  { cmd: 'gflip add', alias: '-a', desc: 'Add new profile' },
  { cmd: 'gflip list', alias: '-l', desc: 'List all profiles' },
  { cmd: 'gflip <name>', alias: '', desc: 'View profile details' },
  { cmd: 'gflip update <name>', alias: '-u', desc: 'Update profile' },
  { cmd: 'gflip delete <name>', alias: '-d', desc: 'Remove profile' },
  { cmd: 'gflip use <name>', alias: '', desc: 'Switch identity' },
  { cmd: 'gflip status', alias: '-s', desc: 'Check active profile' },
  { cmd: 'gflip uninstall', alias: '-un', desc: 'Uninstall tool' },
]

export function Commands() {
  return (
    <section className="h-full bg-[#0c0c0c] border border-zinc-800 p-6 lg:p-8 flex flex-col">
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">~/man-pages</h2>
        <p className="mt-2 text-sm text-zinc-500">
          # Built-in bash tab completion is included.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col gap-2">
          {commands.map((c, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(39, 39, 42, 0.4)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-l-2 border-zinc-800 hover:border-green-500 transition-all group"
            >
              <div className="flex flex-wrap items-center gap-3 mb-1 sm:mb-0">
                <span className="text-green-400 font-bold">{c.cmd}</span>
                {c.alias && (
                  <span className="text-zinc-500 text-xs px-2 py-0.5 bg-zinc-900 border border-zinc-800">
                    {c.alias}
                  </span>
                )}
              </div>
              <div className="text-sm text-zinc-400 sm:text-right">
                {c.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
