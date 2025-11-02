"use client";

import React from "react";
import { DataTable } from "./ui/table";
import { createListingColumns, ListingWithVendor } from "@shared/columns/listing-columns";

interface ListingTableProps {
  listings: ListingWithVendor[];
  onEdit?: (listing: ListingWithVendor) => void;
  onDelete?: (listing: ListingWithVendor) => void;
  onView?: (listing: ListingWithVendor) => void;
  isLoading?: boolean;
}

export const ListingTable = ({
  listings,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ListingTableProps) => {
  const columns = createListingColumns(onEdit, onDelete, onView);

  return (
    <DataTable
      columns={columns}
      data={listings}
      searchableColumns={[
        { id: 'listingName', placeholder: 'Search by listing name...' },
      ]}
      isLoading={isLoading}
      emptyMessage="No listings found."
      title={`Listings (${listings.length})`}
      enableSelection={false}
      enableColumnVisibility={true}
      enablePagination={true}
      defaultPageSize={10}
    />
  );
};
