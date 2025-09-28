import { WeddingService } from '@shared/api';
import { Skeleton } from '@shared/components/ui/skeleton';
import { LoadingStateProps } from '../../types';

export function LoadingState({ categories }: LoadingStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <Skeleton className="h-[300px] w-[250px] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}