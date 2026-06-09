import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const commandsSequence = [
  { text: "gflip status", isInput: true },
  { text: "Current Git Identity:\n  Name:  Personal User\n  Email: personal@example.com\n  Matched Profile: personal", isInput: false },
  { text: "gflip add", isInput: true },
  { text: "Enter profile name: personal-github\n  Enter Git User Name: ananay-nag\n  Enter Git Email: ananaynag1994s@gmail.com", isInput: false },
  { text: "gflip use personal-github", isInput: true },
  { text: "Switched to 'personal-github' [--global]\n  Name:  ananay-nag\n  Email: ananaynag1994s@gmail.com", isInput: false },
  { text: "gflip status", isInput: true },
  { text: "Current Git Identity:\n  Name:  Work User\n  Email: ananay.work@company.com\n  Matched Profile: work", isInput: false }
];

export function TerminalDemo() {
  const [lines, setLines] = useState<{ text: string, isInput: boolean }[]>([])
  const [currentCmdIndex, setCurrentCmdIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (currentCmdIndex >= commandsSequence.length) {
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentCmdIndex(0);
        setCharIndex(0);
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const currentLine = commandsSequence[currentCmdIndex];

    if (currentLine.isInput) {
      if (charIndex < currentLine.text.length) {
        const timeout = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, 50 + Math.random() * 50); // Typewriter effect
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, { text: currentLine.text, isInput: true }]);
          setCurrentCmdIndex(prev => prev + 1);
          setCharIndex(0);
        }, 400); // Wait after typing before enter
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, { text: currentLine.text, isInput: false }]);
        setCurrentCmdIndex(prev => prev + 1);
      }, 300); // Wait before output
      return () => clearTimeout(timeout);
    }
  }, [currentCmdIndex, charIndex]);

  return (
    <section className="w-full h-full bg-[#0c0c0c] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-[#1a1a1a] border-b border-zinc-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-zinc-500 text-xs font-sans select-none">
          ananay@linux: ~/projects
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-6 text-sm sm:text-base text-zinc-300 h-full overflow-y-auto custom-scrollbar font-mono">
        {lines.map((line, i) => (
          <div key={i} className="mb-2 whitespace-pre-wrap">
            {line.isInput ? (
              <div>
                <span className="text-green-500 mr-2">ananay@linux:~$</span>
                <span className="text-white">{line.text}</span>
              </div>
            ) : (
              <div className="text-zinc-400">{line.text}</div>
            )}
          </div>
        ))}

        {/* Active Typing Line */}
        {currentCmdIndex < commandsSequence.length && commandsSequence[currentCmdIndex].isInput && (
          <div>
            <span className="text-green-500 mr-2">ananay@linux:~$</span>
            <span className="text-white">{commandsSequence[currentCmdIndex].text.substring(0, charIndex)}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2.5 h-4 bg-zinc-400 ml-1 translate-y-1"
            />
          </div>
        )}

        {/* Blinking cursor at end if finished */}
        {currentCmdIndex >= commandsSequence.length && (
          <div>
            <span className="text-green-500 mr-2">ananay@linux:~$</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2.5 h-4 bg-zinc-400 translate-y-1"
            />
          </div>
        )}
      </div>
    </section>
  )
}
