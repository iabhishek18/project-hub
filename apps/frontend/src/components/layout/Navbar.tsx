'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@project-hub/shared';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardLink = user?.role === UserRole.ADMIN ? '/dashboard/admin' : '/dashboard/buyer';
  const showAuth = isHydrated && isAuthenticated;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surface/90 dark:bg-surface/90 backdrop-blur-xl shadow-sm dark:shadow-[0_1px_0_rgba(0,245,212,0.1)]' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-shadow">
              <span className="text-surface font-bold text-sm">PH</span>
            </div>
            <span className="text-lg font-display font-bold text-white">Project Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/projects">Projects</NavLink>
            {showAuth && user?.role !== UserRole.ADMIN && (
              <NavLink href="/request">Custom Request</NavLink>
            )}
            <NavLink href="/contact">Contact</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {showAuth ? (
              <>
                <Link href={dashboardLink} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-accent-cyan hover:bg-surface-100/50 transition-all">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-lg text-gray-500 hover:text-accent-pink hover:bg-surface-100/50 transition-all">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white font-medium transition-colors">
                  Log In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm px-5 py-2.5">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-50/95 backdrop-blur-xl border-t border-surface-300/30"
          >
            <div className="px-4 py-4 space-y-3">
              <MobileLink href="/projects" onClick={() => setMobileOpen(false)}>Projects</MobileLink>
              {showAuth && user?.role !== UserRole.ADMIN && (
                <MobileLink href="/request" onClick={() => setMobileOpen(false)}>Custom Request</MobileLink>
              )}
              <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>
              {showAuth ? (
                <>
                  <MobileLink href={dashboardLink} onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 text-accent-pink text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/auth/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link href="/auth/signup" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative text-sm text-gray-400 hover:text-accent-cyan font-medium transition-colors group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-cyan group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block px-3 py-2 text-gray-300 hover:text-accent-cyan text-sm transition-colors">
      {children}
    </Link>
  );
}
