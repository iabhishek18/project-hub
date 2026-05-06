import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-gray-200 dark:border-surface-300/30 bg-gray-50 dark:bg-transparent">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 dark:via-accent-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="text-lg font-display font-bold text-gray-900 dark:text-white">Project Hub</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
              Your premium marketplace for production-ready academic and industry projects.
              Built for developers who ship fast.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Github className="h-4 w-4" />, href: '#' },
                { icon: <Twitter className="h-4 w-4" />, href: '#' },
                { icon: <Linkedin className="h-4 w-4" />, href: '#' },
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-surface-100 border border-gray-200 dark:border-surface-300/50 flex items-center justify-center text-gray-500 hover:text-accent-blue dark:hover:text-accent-cyan hover:border-accent-blue/30 dark:hover:border-accent-cyan/30 transition-all">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-display font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/projects">Browse Projects</FooterLink>
              <FooterLink href="/projects?category=WEB_DEVELOPMENT">Web Development</FooterLink>
              <FooterLink href="/projects?category=MACHINE_LEARNING">Machine Learning</FooterLink>
              <FooterLink href="/projects?category=MOBILE_APP">Mobile Apps</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-display font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              <FooterLink href="/request">Custom Request</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/auth/signup">Create Account</FooterLink>
              <FooterLink href="/auth/login">Sign In</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-surface-300/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Project Hub. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-600 text-xs">
            Built with passion and caffeine ☕
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-500 hover:text-accent-blue dark:hover:text-accent-cyan text-sm transition-colors">
        {children}
      </Link>
    </li>
  );
}
