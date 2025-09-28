import { ShoppingBag } from 'lucide-react';
import { HeaderProps } from '../../types';

export function Header({ totalListings, vendorCount, categoryCount }: HeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold text-gray-900">Wedding Services Marketplace</h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-3xl">
        Discover and book the perfect wedding services for your special day. Browse through our curated collection
        of venues, catering, photography, and more from trusted vendors.
      </p>
      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
        <span>{totalListings} total listings</span>
        <span>{vendorCount} trusted vendors</span>
        <span>{categoryCount} service categories</span>
      </div>
    </div>
  );
}