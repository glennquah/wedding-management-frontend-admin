import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className = "text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
}: EmptyStateProps) {
  return (
    <div className={className}>
      <div className="text-gray-500">
        {Icon && <Icon className="w-12 h-12 mx-auto mb-4 text-gray-400" />}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm mb-4">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}