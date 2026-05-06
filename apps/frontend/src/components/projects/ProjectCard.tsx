'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectCategory } from '@project-hub/shared';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProjectCategory;
  techStack: string[];
  thumbnailUrl?: string;
  averageRating: number;
  reviewCount: number;
}

const categoryGradients: Record<string, string> = {
  WEB_DEVELOPMENT: 'from-accent-cyan to-accent-blue',
  MOBILE_APP: 'from-accent-blue to-accent-cyan',
  MACHINE_LEARNING: 'from-accent-violet to-accent-pink',
  DATA_SCIENCE: 'from-green-400 to-accent-cyan',
  BLOCKCHAIN: 'from-accent-violet to-accent-gold',
  IOT: 'from-accent-blue to-accent-violet',
  CLOUD_COMPUTING: 'from-accent-cyan to-neon-blue',
  CYBERSECURITY: 'from-accent-pink to-accent-violet',
  GAME_DEVELOPMENT: 'from-accent-gold to-accent-pink',
  DEVOPS: 'from-neon-blue to-accent-violet',
  OTHER: 'from-gray-500 to-gray-700',
};

const categoryLabels: Record<string, string> = {
  WEB_DEVELOPMENT: 'Web Dev',
  MOBILE_APP: 'Mobile',
  MACHINE_LEARNING: 'ML/AI',
  DATA_SCIENCE: 'Data Science',
  BLOCKCHAIN: 'Blockchain',
  IOT: 'IoT',
  CLOUD_COMPUTING: 'Cloud',
  CYBERSECURITY: 'Security',
  GAME_DEVELOPMENT: 'Games',
  DEVOPS: 'DevOps',
  OTHER: 'Other',
};

export function ProjectCard({
  id,
  title,
  description,
  price,
  category,
  techStack,
  averageRating,
  reviewCount,
}: ProjectCardProps) {
  const gradient = categoryGradients[category] || categoryGradients.OTHER;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Link href={`/projects/${id}`} className="block card-glow group">
        <div className={`h-36 bg-gradient-to-br ${gradient} relative overflow-hidden flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          <span className="text-white/90 font-display font-bold text-lg">{categoryLabels[category]}</span>
        </div>

        <div className="p-5">
          <h3 className="font-display font-semibold text-white group-hover:text-accent-cyan transition-colors line-clamp-1 text-lg">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mt-1.5 line-clamp-2">{description}</p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-0.5 bg-accent-cyan/5 text-accent-cyan/80 text-xs rounded-full border border-accent-cyan/10">
                {tech}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="px-2 py-0.5 bg-surface-200/50 text-gray-500 text-xs rounded-full">
                +{techStack.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-300/30">
            <span className="text-xl font-display font-bold gradient-text">
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent-gold text-accent-gold" />
              <span className="text-gray-400">{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
              {reviewCount > 0 && <span className="text-gray-600">({reviewCount})</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
