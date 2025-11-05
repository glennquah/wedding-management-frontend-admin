import React, { useMemo, useState } from 'react';

import { DataTable, DeleteConfirmationModal, Card, CardContent, CardHeader, CardTitle } from './index';
import { FormDialog } from './ui/form/form-dialog';
import { Input } from './ui/form/input';
import { Label } from './ui/form/label';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { getOrderColumns } from '@shared/columns/order-columns';
import { UpdateOrderDto, OrderResponseDto, OrderStatus } from '@wedding/api-types';
import { ChevronDown, Filter } from 'lucide-react';

interface OrderTableProps {
  // Data
  orders: OrderResponseDto[];
  isLoading: boolean;

  // Edit Modal State
  isEditingOrder: boolean;
  editOrder: Partial<UpdateOrderDto & { id?: number }>;
  setEditOrder: React.Dispatch<React.SetStateAction<Partial<UpdateOrderDto & { id?: number }>>>;
  isSubmitting: boolean;

  // Delete Modal State
  deleteConfirmOrder: OrderResponseDto | null;

  // Handlers
  onEditOrder: (order: OrderResponseDto) => void;
  onDeleteOrder: (order: OrderResponseDto) => void;
  handleEditOrder: () => Promise<void>;
  closeEditOrderModal: () => void;
  confirmDeleteOrder: () => Promise<void>;
  closeDeleteConfirmModal: () => void;

  // Form fields for editing
  editFormFields: any[];
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading,
  isEditingOrder,
  isSubmitting,
  deleteConfirmOrder,
  onEditOrder,
  onDeleteOrder,
  handleEditOrder,
  closeEditOrderModal,
  confirmDeleteOrder,
  closeDeleteConfirmModal,
  editFormFields,
}) => {
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [weddingIdSearch, setWeddingIdSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PAID,
    OrderStatus.CANCELLED,
    OrderStatus.COMPLETED,
  ]);

  const columns = getOrderColumns({
    onEditOrder,
    onDeleteOrder,
    includeId: true,
  });

  // Filter orders based on search and status filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by Order ID
      if (orderIdSearch && !order.id.toString().includes(orderIdSearch)) {
        return false;
      }

      // Filter by Wedding ID
      if (weddingIdSearch && !order.weddingId.toString().includes(weddingIdSearch)) {
        return false;
      }

      // Filter by Status
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) {
        return false;
      }

      return true;
    });
  }, [orders, orderIdSearch, weddingIdSearch, selectedStatuses]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="flex flex-col gap-4">
      {/* Custom Filters */}
      <Card className="border-brand-200 bg-transparent">
        <CardHeader>
          <CardTitle className="text-foreground">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order ID Search */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="orderIdSearch">Search by Order ID</Label>
              <Input
                id="orderIdSearch"
                placeholder="Enter order ID..."
                value={orderIdSearch}
                onChange={(e) => setOrderIdSearch(e.target.value)}
              />
            </div>

            {/* Wedding ID Search */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="weddingIdSearch">Search by Wedding ID</Label>
              <Input
                id="weddingIdSearch"
                placeholder="Enter wedding ID..."
                value={weddingIdSearch}
                onChange={(e) => setWeddingIdSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="statusFilter">Filter by Status</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    id="statusFilter"
                    className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-0 focus-visible:ring-ring/50 focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 text-gray-800"
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {selectedStatuses.length === Object.values(OrderStatus).length
                        ? 'All Statuses'
                        : `${selectedStatuses.length} selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="start">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium mb-2">Select Statuses</div>
                    {Object.values(OrderStatus).map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                        />
                        <Label
                          htmlFor={`status-${status}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {capitalizeFirst(status)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order List Table */}
      <div className="w-full">
        <DataTable
          data={filteredOrders}
          columns={columns}
          searchableColumns={[]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Orders (${filteredOrders.length} of ${orders.length})`}
          isLoading={isLoading}
          loadingMessage="Loading orders..."
          emptyMessage="No orders found."
          emptyDescription="Try adjusting your filters or search criteria."
        />
      </div>

      {/* Edit Order Modal */}
      <FormDialog
        open={isEditingOrder}
        onOpenChange={closeEditOrderModal}
        title="Edit Order"
        isSubmitting={isSubmitting}
        onSubmit={handleEditOrder}
        onCancel={closeEditOrderModal}
        submitButtonText="Update Order"
        formFields={editFormFields}
        noOfColumns={2}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmOrder}
        onOpenChange={closeDeleteConfirmModal}
        itemName={`Order #${deleteConfirmOrder?.id || ''}`}
        description={
          deleteConfirmOrder && (
            <>
              Are you sure you want to delete Order #{deleteConfirmOrder.id}? This action cannot be
              undone and will permanently remove the order data and all associated information.
            </>
          )
        }
        onConfirm={confirmDeleteOrder}
        onCancel={closeDeleteConfirmModal}
      />
    </div>
  );
};
