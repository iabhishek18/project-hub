'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const techLogos = ['⚛️', '🐍', '🟢', '📱', '☁️', '🔗', '🎮', '🤖'];

export function SplashLoader() {
  const [loading, setLoading] = useState(true);
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setActiveIcon(prev => (prev + 1) % techLogos.length);
    }, 300);

    const timer = setTimeout(() => {
      setLoading(false);
      clearInterval(iconInterval);
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearInterval(iconInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-[#050507]"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-violet flex items-center justify-center shadow-[0_0_60px_rgba(0,245,212,0.3)]">
              <span className="text-white font-display font-bold text-2xl">PH</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            Project Hub
          </motion.div>

          <div className="flex items-center gap-3 mb-8">
            {techLogos.map((logo, i) => (
              <motion.span
                key={i}
                className="text-xl"
                animate={{
                  scale: activeIcon === i ? 1.4 : 0.8,
                  opacity: activeIcon === i ? 1 : 0.3,
                  y: activeIcon === i ? -8 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {logo}
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-accent-cyan"
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-xs text-gray-400 dark:text-gray-600 font-mono"
          >
            Loading production-ready projects...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
