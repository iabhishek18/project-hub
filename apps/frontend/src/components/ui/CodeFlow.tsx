'use client';

import { motion } from 'framer-motion';

const languages = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Python', color: '#3776AB' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Flutter', color: '#02569B' },
  { name: 'Go', color: '#00ADD8' },
  { name: 'Rust', color: '#CE422B' },
  { name: 'Swift', color: '#F05138' },
  { name: 'Kotlin', color: '#7F52FF' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Next.js', color: '#6366f1' },
  { name: 'Vue', color: '#4FC08D' },
  { name: 'Solidity', color: '#363636' },
  { name: 'TensorFlow', color: '#FF6F00' },
];

export function CodeFlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {languages.map((lang, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const xStart = 10 + col * 20;
        const yStart = -10 - row * 25;

        return (
          <motion.div
            key={lang.name}
            className="absolute"
            style={{ left: `${xStart}%` }}
            initial={{ y: `${yStart}vh`, opacity: 0 }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              delay: i * 0.8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border backdrop-blur-sm whitespace-nowrap"
              style={{
                color: lang.color,
                borderColor: `${lang.color}30`,
                backgroundColor: `${lang.color}08`,
              }}
            >
              {lang.name}
            </div>
          </motion.div>
        );
      })}

      <div className="absolute inset-0 hidden dark:block">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute w-px h-32 opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              background: `linear-gradient(to bottom, transparent, ${languages[i % languages.length].color}, transparent)`,
            }}
            animate={{ y: ['-20%', '120%'] }}
            transition={{
              duration: 8 + i * 2,
              delay: i * 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
