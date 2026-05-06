import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SplashLoader } from '@/components/ui/SplashLoader';
import './globals.css';

const CursorGlow = dynamic(() => import('@/components/ui/CursorGlow').then(m => ({ default: m.CursorGlow })), { ssr: false });
const GradientOrbs = dynamic(() => import('@/components/ui/GradientOrbs').then(m => ({ default: m.GradientOrbs })), { ssr: false });

export const metadata: Metadata = {
  title: 'Project Hub - Ship Production-Ready Projects Instantly',
  description: 'Premium marketplace for academic and industry-ready projects. Built for students, colleges, and companies who ship fast.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-body">
        <SplashLoader />
        <GradientOrbs />
        <CursorGlow />
        <div className="min-h-screen flex flex-col relative bg-mesh-light cyber-grid">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f0f1a',
              color: '#fff',
              border: '1px solid rgba(0,245,212,0.2)',
              boxShadow: '0 0 20px rgba(0,245,212,0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
