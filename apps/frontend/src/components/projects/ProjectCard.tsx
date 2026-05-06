import Link from 'next/link';
import { Star } from 'lucide-react';
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

const categoryLabels: Record<ProjectCategory, string> = {
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
  return (
    <Link href={`/projects/${id}`} className="card group hover:shadow-md transition-shadow">
      <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
        <span className="text-primary-600 font-semibold text-lg">{categoryLabels[category]}</span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{techStack.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            &#8377;{Number(price).toLocaleString('en-IN')}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
            {reviewCount > 0 && <span>({reviewCount})</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
