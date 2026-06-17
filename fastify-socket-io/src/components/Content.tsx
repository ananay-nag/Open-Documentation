import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CodeBlock } from './CodeBlock';

interface Feature {
  id: string;
  title: string;
  description: string | string[];
  code: string;
  language: string;
}

interface ContentProps {
  features: Feature[];
  onSectionVisible: (id: string) => void;
}

export const Content: React.FC<ContentProps> = ({ features, onSectionVisible }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionVisible(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    features.forEach((f) => {
      const el = document.getElementById(f.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [features, onSectionVisible]);

  return (
    <main className="w-full relative z-20">
      <div className="w-full space-y-32">
        {features.map((feature, index) => (
          <motion.section
            key={feature.id}
            id={feature.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="scroll-mt-32 relative"
          >
            {/* Subtle glow behind section */}
            <div className="absolute -inset-4 bg-blue-500/5 blur-2xl rounded-[3rem] -z-10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight flex items-center gap-4">
              <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></span>
              {feature.title}
            </h2>
            <div className="text-slate-400 mb-10 leading-relaxed text-lg md:text-xl font-light max-w-3xl space-y-6">
              {Array.isArray(feature.description) 
                ? feature.description.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                : <p>{feature.description}</p>
              }
            </div>
            <CodeBlock code={feature.code} language={feature.language} />
          </motion.section>
        ))}
      </div>
    </main>
  );
};
