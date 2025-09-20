import { Button } from "@shared/components";
import { Input } from "@shared/components/ui/form/input";
import { Label } from "@shared/components/ui/form/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { Filter, Search, X } from "lucide-react";
import { FilterOptions } from "./types";

interface ListingFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export const ListingFilters = ({ filters, onFiltersChange, onClearFilters }: ListingFiltersProps) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
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
    filters.sortOrder !== 'asc';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by name */}
        <div>
          <Label htmlFor="search" className="text-xs font-medium text-gray-700">
            Search by name
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search listings..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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