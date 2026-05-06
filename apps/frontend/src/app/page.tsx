'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Zap, Shield, Sparkles, Rocket, Download, CreditCard, Terminal } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlowCard } from '@/components/ui/GlowCard';
import { GlitchText } from '@/components/ui/GlitchText';

const CodeFlow = dynamic(() => import('@/components/ui/CodeFlow').then(m => ({ default: m.CodeFlow })), { ssr: false });

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const featuredProjects = [
  { title: 'Netflix Clone', tech: ['Next.js', 'Prisma', 'Stripe'], price: '₹4,999', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ced95?w=600&h=400&fit=crop', rating: 4.8 },
  { title: 'AI Image Generator', tech: ['Python', 'Stable Diffusion', 'React'], price: '₹4,499', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', rating: 4.9 },
  { title: 'Twitter/X Clone', tech: ['Next.js', 'tRPC', 'Pusher'], price: '₹5,999', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop', rating: 4.7 },
];

const categories = [
  { name: 'Web Development', count: 45, icon: '🌐', gradient: 'from-sky-400 to-blue-600' },
  { name: 'Mobile Apps', count: 32, icon: '📱', gradient: 'from-green-400 to-emerald-600' },
  { name: 'Machine Learning', count: 28, icon: '🤖', gradient: 'from-violet-400 to-purple-600' },
  { name: 'Data Science', count: 22, icon: '📊', gradient: 'from-orange-400 to-red-500' },
  { name: 'Blockchain', count: 15, icon: '⛓️', gradient: 'from-indigo-400 to-violet-600' },
  { name: 'IoT Projects', count: 18, icon: '🔌', gradient: 'from-teal-400 to-cyan-600' },
  { name: 'Cloud & DevOps', count: 20, icon: '☁️', gradient: 'from-blue-400 to-indigo-600' },
  { name: 'Cybersecurity', count: 12, icon: '🛡️', gradient: 'from-red-400 to-rose-600' },
  { name: 'Game Dev', count: 10, icon: '🎮', gradient: 'from-pink-400 to-fuchsia-600' },
  { name: 'Full Stack', count: 38, icon: '⚡', gradient: 'from-amber-400 to-orange-600' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center">
        <CodeFlow />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white dark:from-[#050507]/50 dark:via-[#050507]/80 dark:to-[#050507] z-[1]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 dark:bg-accent-cyan/10 border border-accent-blue/20 dark:border-accent-cyan/20 text-accent-blue dark:text-accent-cyan text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              500+ Projects Shipped
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-6">
              <span className="text-gray-900 dark:text-white">Ship </span>
              <span className="gradient-text text-glow">Production-Ready</span>
              <br />
              <span className="text-gray-900 dark:text-white">Projects. </span>
              <motion.span
                className="text-accent-blue dark:text-accent-cyan text-glow"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Instantly.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4"
            >
              Curated academic & industry projects built with modern stacks.
              For students, colleges, and companies who ship fast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 text-sm text-accent-blue/70 dark:text-accent-cyan/70 font-mono mb-10"
            >
              <Terminal className="h-4 w-4" />
              <GlitchText text="npm install your-next-project" className="text-accent-blue/70 dark:text-accent-cyan/70" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/projects" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Explore Projects <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/signup" className="btn-secondary text-lg px-8 py-4">
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                <span className="gradient-text">Trending</span> This Week
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Hand-picked projects flying off the shelf</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.title}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link href="/projects" className="block group">
                    <GlowCard className="p-0 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-accent-gold text-xs font-medium flex items-center gap-1">
                          ★ {project.rating}
                        </div>
                        <div className="absolute bottom-3 left-4">
                          <h3 className="text-xl font-display font-bold text-white drop-shadow-lg">{project.title}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map(t => (
                            <span key={t} className="px-2.5 py-1 rounded-full bg-accent-blue/10 dark:bg-accent-cyan/10 text-accent-blue dark:text-accent-cyan text-xs border border-accent-blue/20 dark:border-accent-cyan/20">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold bg-gradient-to-r from-neon-green via-accent-cyan to-neon-blue bg-clip-text text-transparent font-display">{project.price}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-accent-blue dark:group-hover:text-accent-cyan transition-colors">View Details →</span>
                        </div>
                      </div>
                    </GlowCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100/50 to-gray-50 dark:from-[#050507] dark:via-surface-50/50 dark:to-[#050507]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-10 md:p-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter value={500} suffix="+" label="Projects" />
              <AnimatedCounter value={2000} suffix="+" label="Students" />
              <AnimatedCounter value={50} suffix="+" label="Colleges" />
              <AnimatedCounter value={10} prefix="₹" suffix="L+" label="Revenue" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                Find Your <span className="gradient-text">Domain</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Projects across every tech domain you can imagine</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {categories.map((cat) => (
                <motion.div
                  key={cat.name}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={`/projects?category=${cat.name.toUpperCase().replace(/ /g, '_')}`}
                    className="block p-6 rounded-2xl bg-white dark:bg-surface-50/60 border border-gray-100 dark:border-surface-300/40 hover:border-transparent hover:shadow-xl dark:hover:shadow-[0_0_40px_rgba(0,245,212,0.08)] transition-all duration-300 group text-center relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12] transition-opacity duration-500`} />
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <span className="text-3xl">{cat.icon}</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm block group-hover:text-gray-900 dark:group-hover:text-accent-cyan transition-colors">{cat.name}</span>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1.5">{cat.count} projects</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-surface-50/30 dark:to-[#050507]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                Three Steps to <span className="gradient-text">Ship</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-accent-blue/50 dark:from-accent-cyan/50 via-accent-violet/50 to-accent-pink/50" />
              {[
                { step: '01', title: 'Browse', desc: 'Explore curated projects across 10+ categories', icon: <Rocket className="h-6 w-6" /> },
                { step: '02', title: 'Purchase', desc: 'Secure checkout via Razorpay. Instant confirmation.', icon: <CreditCard className="h-6 w-6" /> },
                { step: '03', title: 'Download', desc: 'Get immediate access to full source code & docs', icon: <Download className="h-6 w-6" /> },
              ].map((item, i) => (
                <motion.div key={item.step} variants={fadeUp} custom={i}>
                  <GlowCard className="text-center relative">
                    <div className="text-5xl font-display font-bold gradient-text mb-4">{item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-accent-blue/10 dark:bg-accent-cyan/10 flex items-center justify-center text-accent-blue dark:text-accent-cyan mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Code2 className="h-7 w-7" />, title: 'Production Ready', desc: 'Clean architecture, best practices, documented code' },
                { icon: <Zap className="h-7 w-7" />, title: 'Instant Access', desc: 'Download immediately after payment. No waiting.' },
                { icon: <Shield className="h-7 w-7" />, title: 'Secure Payments', desc: 'Powered by Razorpay. Bank-grade security.' },
                { icon: <Sparkles className="h-7 w-7" />, title: 'Custom Builds', desc: 'Need something specific? Request a custom project.' },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <div className="p-6 rounded-2xl bg-white dark:bg-surface-50/40 border border-gray-100 dark:border-surface-300/30 hover:border-accent-blue/20 dark:hover:border-accent-cyan/20 hover:shadow-md dark:hover:shadow-none transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-xl bg-accent-blue/10 dark:bg-accent-cyan/10 flex items-center justify-center text-accent-blue dark:text-accent-cyan mb-5 group-hover:shadow-[0_0_20px_rgba(67,97,238,0.2)] dark:group-hover:shadow-[0_0_20px_rgba(0,245,212,0.2)] transition-shadow">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-violet/5 dark:from-accent-violet/10 dark:via-[#050507] dark:to-accent-cyan/5" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Build Something{' '}
              <span className="gradient-text">Extraordinary</span>?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join 2,000+ developers who ship faster with production-ready project templates.
            </p>
            <Link href="/auth/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Start Building Now <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
