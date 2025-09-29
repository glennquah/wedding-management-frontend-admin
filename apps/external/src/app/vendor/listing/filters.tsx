import { Button } from '@shared/components';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/form/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/ui/select';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from './types';

interface ListingFiltersProps {
  filters: FilterOptions & { rating?: number | null; vendorSearchQuery?: string };
  onFiltersChange: (filters: FilterOptions & { rating?: number | null; vendorSearchQuery?: string }) => void;
  onClearFilters: () => void;
  showRatingFilter?: boolean;
  showVendorSearch?: boolean;
}

export const ListingFilters = ({ filters, onFiltersChange, onClearFilters, showRatingFilter = false, showVendorSearch = false }: ListingFiltersProps) => {
  const updateFilter = (key: string, value: string | number | null | { min: number | null; max: number | null }) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updatePriceRange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    updateFilter('priceRange', {
      ...filters.priceRange,
      [type]: numValue
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null ||
    filters.sortBy !== 'name' ||
    filters.sortOrder !== 'asc' ||
    (showRatingFilter && (filters as any).rating !== null) ||
    (showVendorSearch && (filters as any).vendorSearchQuery !== '');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-900">Filter & Sort Listings</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${showRatingFilter && showVendorSearch ? 'lg:grid-cols-6' : showRatingFilter || showVendorSearch ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
        {/* Search by listing name */}
        <div>
          <Label htmlFor="search" className="text-xs font-medium text-gray-700">
            Search by listing name
          </Label>
          <div className="mt-1">
            <Input
              id="search"
              placeholder="Search listings..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
            />
          </div>
        </div>

        {/* Search by vendor name - only shown when showVendorSearch is true */}
        {showVendorSearch && (
          <div>
            <Label htmlFor="vendor-search" className="text-xs font-medium text-gray-700">
              Search by vendor name
            </Label>
            <div className="mt-1">
              <Input
                id="vendor-search"
                placeholder="Search vendors..."
                value={(filters as any).vendorSearchQuery ?? ''}
                onChange={(e) => updateFilter('vendorSearchQuery', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Price range */}
        <div>
          <Label className="text-xs font-medium text-gray-700">Price range</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Min"
              type="number"
              min="0"
              step="0.01"
              value={filters.priceRange.min ?? ''}
              onChange={(e) => updatePriceRange('min', e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Max"
              type="number"
              min="0"
              step="0.01"
              value={filters.priceRange.max ?? ''}
              onChange={(e) => updatePriceRange('max', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Rating filter - only shown when showRatingFilter is true */}
        {showRatingFilter && (
          <div>
            <Label className="text-xs font-medium text-gray-700">Minimum rating</Label>
            <Select
              value={(filters as any).rating?.toString() ?? 'all'}
              onValueChange={(value: string) => updateFilter('rating', value === 'all' ? null : parseFloat(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any rating</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="3">3+ stars</SelectItem>
                <SelectItem value="2">2+ stars</SelectItem>
                <SelectItem value="1">1+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort by */}
        <div>
          <Label className="text-xs font-medium text-gray-700">Sort by</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: 'name' | 'createdAt' | 'updatedAt' | 'price') =>
              updateFilter('sortBy', value)
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="updatedAt">Updated Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort order */}
        <div>
          <Label className="text-xs font-medium text-gray-700">Sort order</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Order..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};