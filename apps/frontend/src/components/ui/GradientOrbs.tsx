'use client';

import { motion } from 'framer-motion';

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(67,97,238,0.4) 0%, transparent 70%)' }}
        animate={{
          x: ['-10%', '5%', '-10%'],
          y: ['-5%', '10%', '-5%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ top: '-10%', left: '-5%' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(123,47,247,0.3) 0%, transparent 70%)' }}
        animate={{
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-10%', '5%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ top: '40%', right: '-5%' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-10 blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.3) 0%, transparent 70%)' }}
        animate={{
          x: ['-5%', '10%', '-5%'],
          y: ['10%', '-5%', '10%'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ bottom: '10%', left: '20%' }}
      />
    </div>
  );
}
