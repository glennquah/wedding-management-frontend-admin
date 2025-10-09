'use client';

import { useEffect, useState } from 'react';
import { useWeddingStore } from '../../store/sessionStore';
import {
  useProgressTrackerStore,
  createEmptyProgressTrackerData,
  ChecklistItem,
} from '../../store/progressTrackerStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { PageHeader } from '@shared/components/ui/page-header';
import { Button } from '@shared/components/ui/button';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { Input } from '@shared/components/ui/form/input';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import { DeleteConfirmationModal } from '@shared/components/ui/delete-confirmation-modal';
import { Plus } from 'lucide-react';
import Chat from './components/chat';
import TimelineOverview from './components/TimelineOverview';
import ChecklistTable from './components/ChecklistTable';
import { WeddingResponseDto } from '@shared/api';
import { useProgressTrackerManager } from '../../hooks/useProgressTrackerManager';
import { useSidebar } from '@shared/components/ui/sidebar';

export default function Home() {
  const { selectedWeddingId, weddings } = useWeddingStore();
  const { ensureDraft, hasHydrated } = useProgressTrackerStore();
  const {
    fetchChecklistFromBackend,
    isSubmitting,
    isAddingItem,
    editingItem,
    deleteConfirmItem,
    newItem,
    setNewItem,
    setEditingItem,
    handleAddItem: hookHandleAddItem,
    handleEditItem,
    handleUpdateItem: hookHandleUpdateItem,
    confirmDeleteItem: hookConfirmDeleteItem,
    toggleItemCompletion: hookToggleItemCompletion,
    openAddItemModal,
    closeAddItemModal,
    closeEditItemModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
  } = useProgressTrackerManager(selectedWeddingId);

  // Wrapper functions to update local state after operations
  const handleAddItem = async () => {
    const updatedChecklist = await hookHandleAddItem();
    if (updatedChecklist) {
      setBackendChecklist(updatedChecklist);
    }
  };

  const handleUpdateItem = async () => {
    const updatedChecklist = await hookHandleUpdateItem();
    if (updatedChecklist) {
      setBackendChecklist(updatedChecklist);
    }
  };

  const confirmDeleteItem = async () => {
    const updatedChecklist = await hookConfirmDeleteItem();
    if (updatedChecklist) {
      setBackendChecklist(updatedChecklist);
    }
  };

  const toggleItemCompletion = async (itemId: string, completed: boolean) => {
    const updatedChecklist = await hookToggleItemCompletion(itemId, completed);
    if (updatedChecklist) {
      setBackendChecklist(updatedChecklist);
    }
  };

  // Get wedding-specific progress data to access stage
  const progressData = useProgressTrackerStore((s) =>
    typeof selectedWeddingId === 'number'
      ? (s.drafts[selectedWeddingId]?.data ?? createEmptyProgressTrackerData(selectedWeddingId))
      : createEmptyProgressTrackerData(0),
  );

  const [selectedWedding, setSelectedWedding] = useState<WeddingResponseDto | null>(null);
  const [backendChecklist, setBackendChecklist] = useState<ChecklistItem[] | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);
  const [checklistError, setChecklistError] = useState<string | null>(null);
  const { setOpen } = useSidebar();

  // Create a wrapper function to handle state updates
  const handleFetchChecklist = async (weddingId: number) => {
    try {
      setIsLoadingChecklist(true);
      setChecklistError(null);

      const result = await fetchChecklistFromBackend(weddingId);
      setBackendChecklist(result);
      return result;
    } catch (error) {
      console.error('Error fetching checklist:', error);
      setChecklistError('Failed to load checklist. Please try again.');
      setBackendChecklist(null);
      return null;
    } finally {
      setIsLoadingChecklist(false);
    }
  };

  // Ensure draft exists for selected wedding and fetch checklist from backend
  useEffect(() => {
    if (!hasHydrated) return;
    if (typeof selectedWeddingId === 'number') {
      ensureDraft(selectedWeddingId);
      // Fetch checklist from backend
      handleFetchChecklist(selectedWeddingId);
    }
  }, [selectedWeddingId, ensureDraft, hasHydrated, progressData.stage]);

  useEffect(() => {
    if (selectedWeddingId && weddings.length > 0) {
      const wedding = weddings.find((w) => w.id === selectedWeddingId);
      setSelectedWedding(wedding || null);
    }
  }, [selectedWeddingId, weddings]);

  // Close sidebar by default when landing on this page
  useEffect(() => {
    setOpen(false);
  }, []);

  const getHeaderDescription = () => {
    if (!selectedWedding) {
      return 'Track your wedding planning progress and manage your checklist.';
    }

    const description = `Planning for ${selectedWedding.name}`;
    if (selectedWedding.date) {
      return `${description} • Wedding Date: ${new Date(selectedWedding.date).toLocaleDateString()}`;
    }
    return description;
  };

  const hasBackendChecklist = backendChecklist && backendChecklist.length > 0;

  // Categories for checklist items
  const categories = [
    'Getting Started',
    'Initial Planning',
    'Creating the Foundation',
    'Detailed Planning',
    'During the Wedding',
    'After the Wedding',
    'Additional Details',
  ];

  // Form fields for adding new checklist item
  const addItemFormFields = [
    <div key="title" className="md:col-span-2">
      <label className="text-foreground mb-1 block text-sm font-medium">Title *</label>
      <Input
        type="text"
        value={newItem.title || ''}
        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
        placeholder="Task title"
        required
      />
    </div>,

    <div key="description" className="md:col-span-2">
      <label className="text-foreground mb-1 block text-sm font-medium">Description *</label>
      <Input
        type="text"
        value={newItem.description || ''}
        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        placeholder="Task description"
        required
      />
    </div>,

    <div key="category" className="md:col-span-1">
      <SingleSelectDropdown
        label="Category *"
        options={categories}
        selected={newItem.category || ''}
        setSelected={(category) => setNewItem({ ...newItem, category })}
        placeholder="Select category"
      />
    </div>,

    <div key="monthsBeforeWedding" className="md:col-span-1">
      <label className="text-foreground mb-1 block text-sm font-medium">
        Months Before Wedding
      </label>
      <Input
        type="number"
        value={newItem.monthsBeforeWedding || 0}
        onChange={(e) =>
          setNewItem({ ...newItem, monthsBeforeWedding: parseInt(e.target.value) || 0 })
        }
        placeholder="0"
        min="-36"
        max="36"
      />
    </div>,
  ];

  // Form fields for editing checklist item
  const editItemFormFields = editingItem
    ? [
        <div key="title" className="md:col-span-2">
          <label className="text-foreground mb-1 block text-sm font-medium">Title *</label>
          <Input
            type="text"
            value={editingItem.title || ''}
            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
            placeholder="Task title"
            required
          />
        </div>,

        <div key="description" className="md:col-span-2">
          <label className="text-foreground mb-1 block text-sm font-medium">Description *</label>
          <Input
            type="text"
            value={editingItem.description || ''}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            placeholder="Task description"
            required
          />
        </div>,

        <div key="category" className="md:col-span-1">
          <SingleSelectDropdown
            label="Category *"
            options={categories}
            selected={editingItem.category || ''}
            setSelected={(category) => setEditingItem({ ...editingItem, category })}
            placeholder="Select category"
          />
        </div>,

        <div key="monthsBeforeWedding" className="md:col-span-1">
          <label className="text-foreground mb-1 block text-sm font-medium">
            Months Before Wedding
          </label>
          <Input
            type="number"
            value={editingItem.monthsBeforeWedding || 0}
            onChange={(e) =>
              setEditingItem({ ...editingItem, monthsBeforeWedding: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
            min="-36"
            max="36"
          />
        </div>,
      ]
    : [];

  return (
    <main className="to-brand-100 text-foreground flex min-h-screen w-full flex-col bg-gradient-to-b from-white px-4 py-8">
      <PageHeader
        title="Wedding Planning Progress Tracker"
        description={getHeaderDescription()}
        buttonText={hasBackendChecklist ? 'Add Checklist Item' : undefined}
        onButtonClick={hasBackendChecklist ? openAddItemModal : undefined}
        buttonIcon={hasBackendChecklist ? <Plus className="h-4 w-4" /> : undefined}
        isButtonDisabled={isSubmitting}
      />

      <Tabs defaultValue="timeline" className="flex w-full flex-1 flex-col overflow-hidden">
        <TabsList className="grid w-full flex-shrink-0 grid-cols-2">
          <TabsTrigger value="timeline">Timeline Overview</TabsTrigger>
          <TabsTrigger value="checklist">Checklist Table</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6 flex-1 overflow-x-hidden overflow-y-hidden">
          {isLoadingChecklist ? (
            <div className="flex items-center justify-center py-8">
              <p>Loading your checklist...</p>
            </div>
          ) : checklistError ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-red-600">Error loading checklist: {checklistError}</p>
              <p className="text-gray-600">
                Please try the Planning Assistant to create a new checklist.
              </p>
            </div>
          ) : hasBackendChecklist ? (
            <TimelineOverview checklist={backendChecklist} selectedWedding={selectedWedding} />
          ) : (
            <div className="text-sm text-gray-600">
              Complete the wedding planner guide through our chatbot assistant to generate your
              personalized timeline.
            </div>
          )}
        </TabsContent>

        <TabsContent value="checklist" className="mt-6 flex-1 overflow-auto">
          {isLoadingChecklist ? (
            <div className="flex items-center justify-center py-8">
              <p>Loading your checklist...</p>
            </div>
          ) : checklistError ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-red-600">Error loading checklist: {checklistError}</p>
              <p className="text-gray-600">
                Please try the Planning Assistant to create a new checklist.
              </p>
            </div>
          ) : hasBackendChecklist ? (
            <ChecklistTable
              checklist={backendChecklist}
              onEditItem={handleEditItem}
              onDeleteItem={openDeleteConfirmModal}
              onToggleCompletion={toggleItemCompletion}
            />
          ) : (
            <div className="text-sm text-gray-600">
              Complete the wedding planner guide through our chatbot assistant to generate your
              personalized checklist.
            </div>
          )}
        </TabsContent>

        <Chat selectedWedding={selectedWedding} />
      </Tabs>

      {/* Add Checklist Item Modal */}
      <FormDialog
        open={isAddingItem}
        onOpenChange={(open) => !open && closeAddItemModal()}
        title="Add Checklist Item"
        formFields={addItemFormFields}
        onSubmit={handleAddItem}
        onCancel={closeAddItemModal}
        submitButtonText="Add Item"
        isSubmitting={isSubmitting}
        noOfColumns={2}
      />

      {/* Edit Checklist Item Modal */}
      <FormDialog
        open={!!editingItem}
        onOpenChange={(open) => !open && closeEditItemModal()}
        title="Edit Checklist Item"
        formFields={editItemFormFields}
        onSubmit={handleUpdateItem}
        onCancel={closeEditItemModal}
        submitButtonText="Update Item"
        isSubmitting={isSubmitting}
        noOfColumns={2}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && closeDeleteConfirmModal()}
        title="Delete Checklist Item"
        itemName={deleteConfirmItem?.title || 'this item'}
        description={`Are you sure you want to delete "${deleteConfirmItem?.title}"? This action cannot be undone.`}
        onConfirm={confirmDeleteItem}
        onCancel={closeDeleteConfirmModal}
        isLoading={isSubmitting}
      />
    </main>
  );
}
