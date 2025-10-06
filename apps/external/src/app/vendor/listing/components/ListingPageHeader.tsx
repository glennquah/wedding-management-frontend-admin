import { Button, PageHeader } from '@shared/components';
import { Plus } from 'lucide-react';

interface ListingPageHeaderProps {
  onAddListing: () => void;
}

export function ListingPageHeader({ onAddListing }: ListingPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <PageHeader
        title="My Listings"
        description="Manage your service listings and availability"
      />
      <Button
        onClick={onAddListing}
        className="flex items-center gap-2 self-start md:self-auto"
      >
        <Plus className="w-4 h-4" />
        Add New Listing
      </Button>
    </div>
  );
}