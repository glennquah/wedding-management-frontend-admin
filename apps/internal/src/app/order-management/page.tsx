'use client';

import { useEffect, useState } from 'react';

import { getEditOrderFormFields } from '../components/formFields/OrderManagement';
import { PageHeader } from '@shared/components';
import { OrderTable } from '@shared/components/OrderTable';
import { OrderResponseDto, OrdersService, UpdateOrderDto } from '@wedding/api-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function OrderManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Core data
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<OrderResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [editOrder, setEditOrder] = useState<Partial<UpdateOrderDto & { id?: number }>>({});

  // Fetch orders data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const ordersData = await OrdersService.orderControllerFindAll();
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user, router]);

  // Modal controls
  const openEditOrderModal = (order: OrderResponseDto) => {
    setEditOrder({
      id: order.id,
      orderStatus: order.status as any,
      remark: order.remark,
    });
    setIsEditingOrder(true);
  };

  const closeEditOrderModal = () => {
    setIsEditingOrder(false);
    setEditOrder({});
  };

  const openDeleteConfirmModal = (order: OrderResponseDto) => {
    setDeleteConfirmOrder(order);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmOrder(null);
  };

  // Handlers
  const handleEditOrder = async () => {
    if (!editOrder.id) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateOrderDto = {
        orderStatus: editOrder.orderStatus,
        remark: editOrder.remark,
      };

      await OrdersService.orderControllerUpdate(editOrder.id, updateData);
      toast.success('Order updated successfully!');
      closeEditOrderModal();
      // Refresh orders list
      const ordersData = await OrdersService.orderControllerFindAll();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!deleteConfirmOrder?.id) return;

    setIsSubmitting(true);
    try {
      await OrdersService.orderControllerDelete(deleteConfirmOrder.id);
      toast.success('Order deleted successfully!');
      closeDeleteConfirmModal();
      // Refresh orders list
      const ordersData = await OrdersService.orderControllerFindAll();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error('Failed to delete order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full px-4 py-8 min-w-0 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Order Management"
          description="View and manage all orders placed by users"
        />
      </div>

      {/* Order Table with Edit/Delete Modals */}
      <div className="w-full">
        <OrderTable
          orders={orders}
          isLoading={isLoading}
          isEditingOrder={isEditingOrder}
          editOrder={editOrder}
          setEditOrder={setEditOrder}
          isSubmitting={isSubmitting}
          deleteConfirmOrder={deleteConfirmOrder}
          onEditOrder={openEditOrderModal}
          onDeleteOrder={openDeleteConfirmModal}
          handleEditOrder={handleEditOrder}
          closeEditOrderModal={closeEditOrderModal}
          confirmDeleteOrder={confirmDeleteOrder}
          closeDeleteConfirmModal={closeDeleteConfirmModal}
          editFormFields={getEditOrderFormFields({
            order: editOrder,
            setOrder: setEditOrder,
          })}
        />
      </div>
    </div>
  );
}
