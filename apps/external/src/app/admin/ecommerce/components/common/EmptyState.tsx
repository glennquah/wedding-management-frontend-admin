import { ShoppingBag } from 'lucide-react';
import { EmptyStateProps } from '../../types';

export function EmptyState({ loading = false, totalListings = 0 }: EmptyStateProps) {
  if (loading || totalListings > 0) return null;

  return (
    <div className="text-center py-16">
      <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">No listings available</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        We&rsquo;re working on adding more wedding service listings. Please check back soon!
      </p>
    </div>
  );
}