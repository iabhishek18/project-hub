import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-7 w-7 text-primary-400" />
              <span className="text-lg font-bold text-white">Project Hub</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your one-stop marketplace for academic and industry-ready projects.
              Built for students, colleges, and companies.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/projects" className="hover:text-white transition-colors">Browse Projects</Link></li>
              <li><Link href="/request" className="hover:text-white transition-colors">Custom Request</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/projects?category=WEB_DEVELOPMENT" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link href="/projects?category=MACHINE_LEARNING" className="hover:text-white transition-colors">Machine Learning</Link></li>
              <li><Link href="/projects?category=MOBILE_APP" className="hover:text-white transition-colors">Mobile Apps</Link></li>
              <li><Link href="/projects?category=DATA_SCIENCE" className="hover:text-white transition-colors">Data Science</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Project Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
