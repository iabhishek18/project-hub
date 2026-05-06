import Link from 'next/link';
import { ArrowRight, Code, Zap, Shield, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Production-Ready Projects for Your Next Big Idea
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100">
              Browse curated academic and industry projects. Perfect for students,
              colleges, and companies looking for battle-tested solutions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/projects" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Browse Projects <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Project Hub?</h2>
            <p className="mt-3 text-gray-500 text-lg">Everything you need to kickstart your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Code className="h-8 w-8" />}
              title="Production Ready"
              description="Clean code, proper architecture, and industry best practices"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Instant Access"
              description="Download immediately after purchase. No waiting."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure Payments"
              description="Powered by Razorpay. Your transactions are always safe."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Custom Projects"
              description="Need something specific? Request a custom project build."
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
            <p className="mt-3 text-gray-500 text-lg">Find projects across multiple domains</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Web Development', slug: 'WEB_DEVELOPMENT' },
              { name: 'Mobile Apps', slug: 'MOBILE_APP' },
              { name: 'Machine Learning', slug: 'MACHINE_LEARNING' },
              { name: 'Data Science', slug: 'DATA_SCIENCE' },
              { name: 'Blockchain', slug: 'BLOCKCHAIN' },
              { name: 'IoT', slug: 'IOT' },
              { name: 'Cloud Computing', slug: 'CLOUD_COMPUTING' },
              { name: 'Cybersecurity', slug: 'CYBERSECURITY' },
              { name: 'Game Dev', slug: 'GAME_DEVELOPMENT' },
              { name: 'DevOps', slug: 'DEVOPS' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/projects?category=${cat.slug}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200"
              >
                <span className="font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Build Something Amazing?</h2>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
            Join hundreds of students and companies who have accelerated their projects with our ready-to-deploy solutions.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}
