'use client';

import { useEffect, useState } from 'react';

import { useWeddingStore } from '../../store/sessionStore';
import {
  CreateWishlistItemDto,
  UpdateWishlistItemDto,
  WishlistItemResponseDto,
  WishlistService,
} from '@shared/api';
import { getWishlistColumns } from '@shared/columns/wishlist-columns';
import {
  Button,
  DataTable,
  DeleteConfirmationModal,
  PageHeader,
} from '@shared/components';
import FormField from '@shared/components/FormField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

type WishlistFormData = {
  title: string;
  itemUrl: string;
};

export default function WishlistPage() {
  const isMobile = useIsMobileScreen();
  const selectedWeddingId = useWeddingStore((state) => state.selectedWeddingId);

  const [wishlistItems, setWishlistItems] = useState<WishlistItemResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItemResponseDto | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<WishlistItemResponseDto | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newItem, setNewItem] = useState<WishlistFormData>({
    title: '',
    itemUrl: '',
  });

  // Fetch wishlist items when wedding is selected
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!selectedWeddingId || typeof selectedWeddingId !== 'number') {
        setWishlistItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const items = await WishlistService.wishlistControllerFindAllByWeddingId(
          selectedWeddingId,
        );
        setWishlistItems(items);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        toast.error('Failed to load wishlist items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, [selectedWeddingId]);

  // Add item modal handlers
  const openAddItemModal = () => {
    setNewItem({ title: '', itemUrl: '' });
    setIsAddingItem(true);
  };

  const closeAddItemModal = () => {
    setIsAddingItem(false);
    setNewItem({ title: '', itemUrl: '' });
  };

  // Edit item modal handlers
  const handleEditItem = (item: WishlistItemResponseDto) => {
    setEditingItem(item);
  };

  const closeEditItemModal = () => {
    setEditingItem(null);
  };

  // Delete item modal handlers
  const openDeleteConfirmModal = (item: WishlistItemResponseDto) => {
    setDeleteConfirmItem(item);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmItem(null);
  };

  // Add item handler
  const handleAddItem = async () => {
    if (!selectedWeddingId || typeof selectedWeddingId !== 'number') {
      toast.error('Please select a wedding first');
      return;
    }

    if (!newItem.title.trim() || !newItem.itemUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate URL format
    try {
      new URL(newItem.itemUrl.trim());
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com/product)');
      return;
    }

    setIsSubmitting(true);
    try {
      const createDto: CreateWishlistItemDto = {
        title: newItem.title.trim(),
        itemUrl: newItem.itemUrl.trim(),
        weddingId: selectedWeddingId,
      };

      const createdItem = await WishlistService.wishlistControllerCreate(createDto);
      setWishlistItems([createdItem, ...wishlistItems]);
      toast.success('Wishlist item added successfully!');
      closeAddItemModal();
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      toast.error('Failed to add wishlist item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update item handler
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    if (!editingItem.title.trim() || !editingItem.itemUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate URL format
    try {
      new URL(editingItem.itemUrl.trim());
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com/product)');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateDto: UpdateWishlistItemDto = {
        title: editingItem.title.trim(),
        itemUrl: editingItem.itemUrl.trim(),
      };

      const updatedItem = await WishlistService.wishlistControllerUpdate(
        editingItem.id,
        updateDto,
      );
      setWishlistItems(
        wishlistItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
      toast.success('Wishlist item updated successfully!');
      closeEditItemModal();
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      toast.error('Failed to update wishlist item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete item handler
  const confirmDeleteItem = async () => {
    if (!deleteConfirmItem) return;

    setIsSubmitting(true);
    try {
      await WishlistService.wishlistControllerDelete(deleteConfirmItem.id);
      setWishlistItems(wishlistItems.filter((item) => item.id !== deleteConfirmItem.id));
      toast.success('Wishlist item deleted successfully!');
      closeDeleteConfirmModal();
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast.error('Failed to delete wishlist item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Column definitions for DataTable
  const columns = getWishlistColumns({
    onEditItem: handleEditItem,
    onDeleteItem: openDeleteConfirmModal,
  });

  if (!selectedWeddingId) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
        {!isMobile && <div className="mt-6 w-full"></div>}

        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <PageHeader
            title="Wishlist Management"
            description="Please select a wedding first from the sidebar."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader
          title="Wishlist"
          description="Manage your wedding wishlist items that guests can reserve"
          buttonText="Add Item"
          onButtonClick={openAddItemModal}
          buttonIcon={<Plus className="w-4 h-4" />}
          isButtonDisabled={isLoading}
        />

        {/* Wishlist Table */}
        <DataTable
          data={wishlistItems}
          columns={columns}
          searchableColumns={[{ id: 'title', placeholder: 'Search by item name...' }]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Wishlist Items (${wishlistItems.length})`}
          isLoading={isLoading}
          loadingMessage="Loading wishlist items..."
          emptyMessage="No wishlist items added yet."
          emptyDescription='Click "Add Item" to get started!'
        />

        {/* Add Item Modal */}
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Wishlist Item</DialogTitle>
              <DialogDescription>
                Add a new item to your wedding wishlist for guests to reserve.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                id="title"
                label="Item Name"
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g., Kitchen Mixer"
                required
              />
              <FormField
                id="itemUrl"
                label="Item URL"
                type="url"
                value={newItem.itemUrl}
                onChange={(e) => setNewItem({ ...newItem, itemUrl: e.target.value })}
                placeholder="https://example.com/product/kitchen-mixer"
                required
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeAddItemModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Item Modal */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && closeEditItemModal()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Wishlist Item</DialogTitle>
              <DialogDescription>Update the wishlist item details.</DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4 py-4">
                <FormField
                  id="edit-title"
                  label="Item Name"
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  placeholder="e.g., Kitchen Mixer"
                  required
                />
                <FormField
                  id="edit-itemUrl"
                  label="Item URL"
                  type="url"
                  value={editingItem.itemUrl}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, itemUrl: e.target.value })
                  }
                  placeholder="https://example.com/product/kitchen-mixer"
                  required
                />
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeEditItemModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateItem} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!deleteConfirmItem}
          onOpenChange={closeDeleteConfirmModal}
          itemName={deleteConfirmItem?.title || 'this wishlist item'}
          description={
            deleteConfirmItem && (
              <>
                Are you sure you want to delete {deleteConfirmItem.title}? This action cannot be
                undone.
              </>
            )
          }
          onConfirm={confirmDeleteItem}
          onCancel={closeDeleteConfirmModal}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
