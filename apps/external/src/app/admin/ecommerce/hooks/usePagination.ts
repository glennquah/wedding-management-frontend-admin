import { useState, useMemo } from 'react';
import { PaginationState } from '../types';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

interface UsePaginationReturn extends PaginationState {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  setCurrentPage: (page: number) => void;
}

export function usePagination<T>({ items, itemsPerPage }: UsePaginationProps<T>): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentItems
    };
  }, [items, itemsPerPage, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages));
  };

  return {
    currentPage,
    ...paginationData,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage
  };
}