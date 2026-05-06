'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, index) => {
          if (index < iteration) return char;
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );

      if (iteration >= text.length) {
        setIsComplete(true);
        clearInterval(interval);
      }
      iteration += 1;
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.span
      className={`font-mono ${className} ${isComplete ? '' : 'text-accent-cyan'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
    </motion.span>
  );
}
