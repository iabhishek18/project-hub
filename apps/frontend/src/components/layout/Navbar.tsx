'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@project-hub/shared';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardLink = user?.role === UserRole.ADMIN ? '/dashboard/admin' : '/dashboard/buyer';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Project Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/projects" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse Projects
            </Link>
            {isAuthenticated && user?.role !== UserRole.ADMIN && (
              <Link href="/request" className="text-gray-600 hover:text-gray-900 font-medium">
                Custom Request
              </Link>
            )}
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href={dashboardLink} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.name}</span>
                </Link>
                <button onClick={logout} className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary text-sm">Log In</Link>
                <Link href="/auth/signup" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link href="/projects" className="text-gray-600 py-2" onClick={() => setMobileOpen(false)}>
                Browse Projects
              </Link>
              {isAuthenticated && user?.role !== UserRole.ADMIN && (
                <Link href="/request" className="text-gray-600 py-2" onClick={() => setMobileOpen(false)}>
                  Custom Request
                </Link>
              )}
              <Link href="/contact" className="text-gray-600 py-2" onClick={() => setMobileOpen(false)}>
                Contact
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href={dashboardLink} className="text-gray-600 py-2" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-600 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/auth/login" className="btn-secondary text-sm" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link href="/auth/signup" className="btn-primary text-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
