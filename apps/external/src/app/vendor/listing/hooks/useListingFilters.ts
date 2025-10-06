import { useMemo, useState, useCallback } from 'react';
import { FilterOptions, Listing, UseListingFiltersReturn } from '../types';
import { DEFAULT_FILTERS } from '../constants';

export function useListingFilters(listings: Listing[]): UseListingFiltersReturn {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(listing =>
        listing.listingName.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    if (filters.priceRange.min !== null) {
      result = result.filter(listing => listing.price >= filters.priceRange.min!);
    }
    if (filters.priceRange.max !== null) {
      result = result.filter(listing => listing.price <= filters.priceRange.max!);
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareValue = 0;

      switch (filters.sortBy) {
        case 'name':
          compareValue = a.listingName.localeCompare(b.listingName);
          break;
        case 'price':
          compareValue = a.price - b.price;
          break;
        case 'createdAt':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          compareValue = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          compareValue = 0;
      }

      return filters.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [listings, filters]);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const updateFilter = useCallback((key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    filters,
    setFilters,
    clearFilters,
    filteredListings: filteredAndSortedListings,
    updateFilter,
  };
}