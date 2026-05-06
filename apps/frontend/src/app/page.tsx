'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Zap, Shield, Sparkles, Rocket, Download, CreditCard, Terminal } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlowCard } from '@/components/ui/GlowCard';
import { GlitchText } from '@/components/ui/GlitchText';

const ParticleField = dynamic(() => import('@/components/ui/ParticleField').then(m => ({ default: m.ParticleField })), { ssr: false });

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const featuredProjects = [
  { title: 'E-Commerce Platform', tech: ['Next.js', 'Prisma', 'Stripe'], price: '₹2,999', gradient: 'from-accent-cyan to-accent-blue', rating: 4.8 },
  { title: 'AI Chatbot System', tech: ['Python', 'FastAPI', 'OpenAI'], price: '₹3,499', gradient: 'from-accent-violet to-accent-pink', rating: 4.9 },
  { title: 'Food Delivery App', tech: ['Flutter', 'Firebase', 'Maps'], price: '₹4,999', gradient: 'from-accent-blue to-accent-violet', rating: 4.7 },
];

const categories = [
  { name: 'Web Development', count: 45, icon: '🌐' },
  { name: 'Mobile Apps', count: 32, icon: '📱' },
  { name: 'Machine Learning', count: 28, icon: '🤖' },
  { name: 'Data Science', count: 22, icon: '📊' },
  { name: 'Blockchain', count: 15, icon: '⛓️' },
  { name: 'IoT Projects', count: 18, icon: '🔌' },
  { name: 'Cloud & DevOps', count: 20, icon: '☁️' },
  { name: 'Cybersecurity', count: 12, icon: '🛡️' },
  { name: 'Game Dev', count: 10, icon: '🎮' },
  { name: 'Full Stack', count: 38, icon: '⚡' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center">
        <ParticleField />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface z-[1]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              500+ Projects Shipped
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-6">
              <span className="text-white">Ship </span>
              <span className="gradient-text text-glow">Production-Ready</span>
              <br />
              <span className="text-white">Projects. </span>
              <motion.span 
                className="text-accent-cyan text-glow"
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
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4"
            >
              Curated academic & industry projects built with modern stacks.
              For students, colleges, and companies who ship fast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 text-sm text-accent-cyan/70 font-mono mb-10"
            >
              <Terminal className="h-4 w-4" />
              <GlitchText text="npm install your-next-project" className="text-accent-cyan/70" />
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

          <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
            {['React', 'Node.js', 'Python', 'Flutter', 'AWS'].map((tech, i) => (
              <motion.div
                key={tech}
                className="absolute px-3 py-1.5 rounded-full bg-surface-100/80 border border-surface-300/50 text-xs text-gray-400 backdrop-blur-sm"
                style={{
                  top: `${20 + (i * 15)}%`,
                  left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
                  right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
                }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                <span className="gradient-text">Trending</span> This Week
              </h2>
              <p className="text-gray-400 text-lg">Hand-picked projects flying off the shelf</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <motion.div key={project.title} variants={fadeUp} custom={i}>
                  <GlowCard>
                    <div className={`h-32 rounded-xl bg-gradient-to-br ${project.gradient} opacity-80 mb-5 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                      <Code2 className="h-10 w-10 text-white/80" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-white mb-3">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs border border-accent-cyan/20">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold gradient-text font-display">{project.price}</span>
                      <span className="text-accent-gold text-sm">★ {project.rating}</span>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-50/50 to-surface" />
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

      {/* CATEGORIES */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Find Your <span className="gradient-text">Domain</span>
              </h2>
              <p className="text-gray-400 text-lg">Projects across every tech domain you can imagine</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <motion.div key={cat.name} variants={fadeUp}>
                  <Link
                    href={`/projects?category=${cat.name.toUpperCase().replace(/ /g, '_')}`}
                    className="block p-5 rounded-2xl bg-surface-50/60 border border-surface-300/40 hover:border-accent-cyan/30 hover:bg-surface-100/60 transition-all duration-300 hover:scale-[1.02] group text-center"
                  >
                    <span className="text-3xl mb-3 block">{cat.icon}</span>
                    <span className="font-medium text-white text-sm group-hover:text-accent-cyan transition-colors">{cat.name}</span>
                    <span className="block text-xs text-gray-500 mt-1">{cat.count} projects</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-50/30 to-surface" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Three Steps to <span className="gradient-text">Ship</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-accent-cyan/50 via-accent-violet/50 to-accent-pink/50" />
              {[
                { step: '01', title: 'Browse', desc: 'Explore curated projects across 10+ categories', icon: <Rocket className="h-6 w-6" /> },
                { step: '02', title: 'Purchase', desc: 'Secure checkout via Razorpay. Instant confirmation.', icon: <CreditCard className="h-6 w-6" /> },
                { step: '03', title: 'Download', desc: 'Get immediate access to full source code & docs', icon: <Download className="h-6 w-6" /> },
              ].map((item, i) => (
                <motion.div key={item.step} variants={fadeUp} custom={i}>
                  <GlowCard className="text-center relative">
                    <div className="text-5xl font-display font-bold gradient-text mb-4">{item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-display font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
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
                  <div className="p-6 rounded-2xl bg-surface-50/40 border border-surface-300/30 hover:border-accent-cyan/20 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-5 group-hover:shadow-[0_0_20px_rgba(0,245,212,0.2)] transition-shadow">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 via-surface to-accent-cyan/5" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Build Something{' '}
              <span className="gradient-text">Extraordinary</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
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
