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
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { DeleteConfirmationModal } from '@shared/components';
import FormField from '@shared/components/FormField';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import Chat from './components/chat';
import TimelineOverview from './components/TimelineOverview';
import ChecklistTable from './components/ChecklistTable';
import { WeddingResponseDto, CreateChecklistItemDto } from '@shared/api';
import { useSidebar } from '@shared/components/ui/sidebar';
import { useProgressTrackerManager } from '../../hooks/useProgressTrackerManager';
import { Plus } from 'lucide-react';

export default function Home() {
  const { selectedWeddingId, weddings, firstPurchaseMade } = useWeddingStore();
  const { ensureDraft, hasHydrated, setStage } = useProgressTrackerStore();
  const {
    fetchChecklistFromBackend,
    handleNextCategory,
    // Modal state
    isAddingItem,
    isSubmitting,
    editingItem,
    deleteConfirmItem,
    // Form data
    newItem,
    setNewItem,
    setEditingItem,
    // Modal handlers
    openAddItemModal,
    closeAddItemModal,
    closeEditItemModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    // CRUD handlers
    handleAddItem,
    handleEditItem,
    handleUpdateItem,
    confirmDeleteItem,
    toggleItemCompletion,
  } = useProgressTrackerManager(selectedWeddingId); // Get wedding-specific data
  const progressData = useProgressTrackerStore((s) =>
    typeof selectedWeddingId === 'number'
      ? (s.drafts[selectedWeddingId]?.data ?? createEmptyProgressTrackerData(selectedWeddingId))
      : createEmptyProgressTrackerData(0),
  );

  // Categories for progressive reveal
  const categories = [
    'Getting Started',
    'Initial Planning',
    'Creating the Foundation',
    'Detailed Planning',
    'During the Wedding',
    'After the Wedding',
    'Additional Details',
  ];

  // Function to determine which checklist items should be visible
  const getVisibleChecklistItems = () => {
    // Map current stage to category index
    const stageToIndex = {
      GETTING_STARTED: 0,
      INITIAL_PLANNING: 1,
      CREATING_THE_FOUNDATION: 2,
      DETAILED_PLANNING: 3,
      DURING_THE_WEDDING: 4,
      AFTER_THE_WEDDING: 5,
      ADDITIONAL_DETAILS: 6,
      CHECKLIST_GENERATED: 6, // Show all categories
    };

    const currentStageIndex = stageToIndex[progressData.stage] ?? 0;

    // If CHECKLIST_GENERATED, show all items
    if (progressData.stage === 'CHECKLIST_GENERATED') {
      return progressData.checklist;
    }

    // Show items from categories up to and including current stage
    const visibleCategories = categories.slice(0, currentStageIndex + 1);
    return progressData.checklist.filter((item) => visibleCategories.includes(item.category));
  };

  const visibleChecklistItems = getVisibleChecklistItems();

  const [selectedWedding, setSelectedWedding] = useState<WeddingResponseDto | null>(null);
  const { setOpen } = useSidebar();

  // Ensure draft exists for selected wedding and handle backend fetching
  useEffect(() => {
    if (!hasHydrated) return;
    if (typeof selectedWeddingId === 'number') {
      ensureDraft(selectedWeddingId);

      // Always attempt to fetch existing checklist from backend (unconditional)
      fetchChecklistFromBackend(selectedWeddingId)
        .then((backendChecklist) => {
          if (!backendChecklist || backendChecklist.length === 0) {
            // No backend checklist found, start from GETTING_STARTED
            console.log('No backend checklist found, starting from GETTING_STARTED stage');
            setStage(selectedWeddingId, 'GETTING_STARTED');
          }
          // If backend checklist exists, fetchChecklistFromBackend already handles setting the stage
        })
        .catch((error) => {
          console.error('Error fetching backend checklist:', error);
          // On error, start from GETTING_STARTED stage
          setStage(selectedWeddingId, 'GETTING_STARTED');
        });
    }
  }, [selectedWeddingId, ensureDraft, hasHydrated, setStage, fetchChecklistFromBackend]);

  useEffect(() => {
    if (selectedWeddingId && weddings.length > 0) {
      const wedding = weddings.find((w) => w.id === selectedWeddingId);
      setSelectedWedding(wedding || null);
    }
  }, [selectedWeddingId, weddings]);

  // Close sidebar by default when landing on this page
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

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

  // Wrapper function to match expected type signature
  const handleToggleCompletion = async (itemId: string, completed: boolean): Promise<void> => {
    await toggleItemCompletion(itemId, completed);
  };

  // Form fields for add/edit item modals
  const getItemFormFields = (
    item: Partial<CreateChecklistItemDto>,
    setItem: React.Dispatch<React.SetStateAction<Partial<CreateChecklistItemDto>>>,
  ) => [
    <div key="title" className="md:col-span-2">
      <FormField
        label="Title *"
        id="title"
        type="text"
        value={item.title || ''}
        onChange={(e) => setItem({ ...item, title: e.target.value })}
        required
        placeholder="Task title"
      />
    </div>,

    <div key="description" className="md:col-span-2">
      <FormField
        label="Description *"
        id="description"
        type="textarea"
        value={item.description || ''}
        onChange={(e) => setItem({ ...item, description: e.target.value })}
        required
        placeholder="Task description"
      />
    </div>,

    <div key="category" className="md:col-span-1">
      <SingleSelectDropdown
        label="Category *"
        options={categories}
        selected={item.category || ''}
        setSelected={(category) => setItem({ ...item, category })}
        placeholder="Select category"
      />
    </div>,

    <div key="monthsBeforeWedding" className="md:col-span-1">
      <FormField
        label="Months Before Wedding"
        id="monthsBeforeWedding"
        type="number"
        value={item.monthsBeforeWedding?.toString() || ''}
        onChange={(e) => setItem({ ...item, monthsBeforeWedding: parseInt(e.target.value) || 0 })}
        placeholder="0"
        min="0"
      />
    </div>,
  ];

  const getEditItemFormFields = (
    item: ChecklistItem,
    setItem: React.Dispatch<React.SetStateAction<ChecklistItem | null>>,
  ) => [
    <div key="title" className="md:col-span-2">
      <FormField
        label="Title *"
        id="title"
        type="text"
        value={item.title || ''}
        onChange={(e) => setItem({ ...item, title: e.target.value })}
        required
        placeholder="Task title"
      />
    </div>,

    <div key="description" className="md:col-span-2">
      <FormField
        label="Description *"
        id="description"
        type="textarea"
        value={item.description || ''}
        onChange={(e) => setItem({ ...item, description: e.target.value })}
        required
        placeholder="Task description"
      />
    </div>,

    <div key="category" className="md:col-span-1">
      <SingleSelectDropdown
        label="Category *"
        options={categories}
        selected={item.category || ''}
        setSelected={(category) => setItem({ ...item, category })}
        placeholder="Select category"
      />
    </div>,

    <div key="monthsBeforeWedding" className="md:col-span-1">
      <FormField
        label="Months Before Wedding"
        id="monthsBeforeWedding"
        type="number"
        value={item.monthsBeforeWedding?.toString() || ''}
        onChange={(e) => setItem({ ...item, monthsBeforeWedding: parseInt(e.target.value) || 0 })}
        placeholder="0"
        min="0"
      />
    </div>,
  ];

  return (
    <main className="to-brand-100 text-foreground flex min-h-screen w-full flex-col bg-gradient-to-b from-white px-4 py-8">
      <PageHeader
        title="Wedding Planning Progress Tracker"
        description={getHeaderDescription()}
        buttonText="Add Checklist Item"
        onButtonClick={openAddItemModal}
        buttonIcon={<Plus className="h-4 w-4" />}
        isButtonDisabled={progressData.stage !== 'CHECKLIST_GENERATED'}
      />

      <Tabs defaultValue="timeline" className="flex w-full flex-1 flex-col overflow-hidden">
        <TabsList className="grid w-full flex-shrink-0 grid-cols-2">
          <TabsTrigger value="timeline">
            Timeline Overview
            {progressData.stage !== 'CHECKLIST_GENERATED' && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                {visibleChecklistItems.length} items
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="checklist">
            Checklist Table
            {progressData.stage !== 'CHECKLIST_GENERATED' && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                {visibleChecklistItems.length} items
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6 flex-1 overflow-x-hidden overflow-y-hidden">
          {visibleChecklistItems.length > 0 ? (
            <div className="flex h-full flex-col gap-4">
              {progressData.stage !== 'CHECKLIST_GENERATED' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📋</span>
                    <p className="text-sm text-blue-700">
                      <strong>Progressive Planning:</strong> Timeline items unlock as you progress
                      through each planning stage.
                      <span className="ml-1 font-medium">
                        Current stage:{' '}
                        {progressData.stage
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              <div
                className="animate-fade-in flex-1"
                key={`timeline-${visibleChecklistItems.length}`}
              >
                <TimelineOverview
                  checklist={visibleChecklistItems}
                  selectedWedding={selectedWedding}
                  onToggleCompletion={toggleItemCompletion}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">📋</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Timeline Will Appear Here
              </h3>
              <p className="max-w-md text-sm text-gray-600">
                Start a conversation with the Planning Assistant to begin revealing your wedding
                planning timeline. Items will appear as you progress through each category.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="checklist" className="mt-6 flex-1 overflow-auto">
          {visibleChecklistItems.length > 0 ? (
            <div className="flex h-full flex-col gap-4">
              {progressData.stage !== 'CHECKLIST_GENERATED' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✅</span>
                    <p className="text-sm text-blue-700">
                      <strong>Progressive Planning:</strong> Checklist items unlock as you progress
                      through each planning stage.
                      <span className="ml-1 font-medium">
                        Current stage:{' '}
                        {progressData.stage
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              <div
                className="animate-fade-in flex-1"
                key={`checklist-${visibleChecklistItems.length}`}
              >
                <ChecklistTable
                  checklist={visibleChecklistItems}
                  onEditItem={handleEditItem}
                  onDeleteItem={openDeleteConfirmModal}
                  onToggleCompletion={handleToggleCompletion}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Checklist Will Appear Here
              </h3>
              <p className="max-w-md text-sm text-gray-600">
                Start a conversation with the Planning Assistant to begin revealing your wedding
                planning checklist. Items will appear as you progress through each category.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Chat
        selectedWedding={selectedWedding}
        currentStage={progressData.stage}
        firstPurchaseMade={firstPurchaseMade}
        onNextCategory={handleNextCategory}
      />

      {/* Add Item Modal */}
      <FormDialog
        open={isAddingItem}
        onOpenChange={closeAddItemModal}
        title="Add New Checklist Item"
        isSubmitting={isSubmitting}
        onSubmit={handleAddItem}
        onCancel={closeAddItemModal}
        submitButtonText="Add Item"
        formFields={getItemFormFields(newItem, setNewItem)}
        noOfColumns={2}
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <FormDialog
          open={!!editingItem}
          onOpenChange={closeEditItemModal}
          title="Edit Checklist Item"
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateItem}
          onCancel={closeEditItemModal}
          submitButtonText="Update Item"
          formFields={getEditItemFormFields(editingItem, setEditingItem)}
          noOfColumns={2}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteConfirmItem}
        onOpenChange={closeDeleteConfirmModal}
        itemName={deleteConfirmItem?.title || 'this item'}
        description={`Are you sure you want to delete "${deleteConfirmItem?.title}"? This action cannot be undone.`}
        onConfirm={confirmDeleteItem}
        onCancel={closeDeleteConfirmModal}
      />
    </main>
  );
}
