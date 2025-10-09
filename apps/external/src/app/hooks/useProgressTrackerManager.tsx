'use client';

import { useState } from 'react';

import {
  useProgressTrackerStore,
  createEmptyProgressTrackerData,
  ChecklistItem,
} from '../store/progressTrackerStore';
import {
  ChecklistService,
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
} from '@shared/api';

export function useProgressTrackerManager(weddingId?: number | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ChecklistItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<CreateChecklistItemDto>>({
    title: '',
    description: '',
    category: '',
    monthsBeforeWedding: 0,
    completed: false,
  });

  const { setChecklist, nextCategory, addMessage, setStage } = useProgressTrackerStore();

  // Get wedding-specific data
  const progressData = useProgressTrackerStore((s) =>
    typeof weddingId === 'number'
      ? (s.drafts[weddingId]?.data ?? createEmptyProgressTrackerData(weddingId))
      : createEmptyProgressTrackerData(0),
  );

  const handleNextCategory = () => {
    if (typeof weddingId === 'number') {
      nextCategory(weddingId);
    }
  };

  const fetchChecklistFromBackend = async (
    targetWeddingId: number,
  ): Promise<ChecklistItem[] | null> => {
    try {
      const checklistResponse =
        await ChecklistService.checklistControllerFindByWeddingId(targetWeddingId);

      if (checklistResponse.items && checklistResponse.items.length > 0) {
        // Convert backend response to frontend format
        const frontendChecklist: ChecklistItem[] = checklistResponse.items.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          category: item.category,
          monthsBeforeWedding: item.monthsBeforeWedding ?? undefined,
          completed: item.completed,
        }));

        // Update the local store
        setChecklist(targetWeddingId, frontendChecklist);
        setStage(targetWeddingId, 'generated');

        return frontendChecklist;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);

      // Handle 404 (no checklist found) as normal case
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number };
        if (apiError.status === 404) {
          return null;
        }
      }

      throw error; // Re-throw other errors for the calling component to handle
    }
  };

  const handleChecklist = async (input: string) => {
    if (typeof weddingId !== 'number') return;

    const text = input.trim();
    if (!text) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: text };
    addMessage(weddingId, userMsg);

    try {
      setIsLoading(true);

      // Step 1: Make LLM call to generate/modify checklist
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'checklist',
          messages: [...progressData.messages, userMsg],
          checklist: progressData.checklist,
        }),
      });

      const llmData = await res.json();

      if (!Array.isArray(llmData?.checklist) || llmData.checklist.length === 0) {
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            llmData.message ||
            "I could not generate a checklist. Please provide more specific details about what you'd like to add.",
        });
        return;
      }

      // Step 2: Save the LLM-generated checklist to the backend
      // Convert LLM response to backend format
      const checklistItems: CreateChecklistItemDto[] = llmData.checklist.map((item: any) => ({
        title: item.title,
        description: item.description,
        category: item.category,
        monthsBeforeWedding: item.monthsBeforeWedding,
        completed: item.completed || false,
      }));

      // Create the checklist payload
      const createChecklistDto: CreateChecklistDto = {
        weddingId: weddingId,
        items: checklistItems,
      };

      // Call the backend to create the checklist
      const checklistResponse =
        await ChecklistService.checklistControllerCreate(createChecklistDto);

      // Step 3: Update the local state with the saved checklist
      if (checklistResponse.items && checklistResponse.items.length > 0) {
        // Convert backend response to frontend format
        const frontendChecklist = checklistResponse.items.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          category: item.category,
          monthsBeforeWedding: item.monthsBeforeWedding ?? undefined,
          completed: item.completed,
        }));

        setChecklist(weddingId, frontendChecklist);

        // Add LLM message first
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            llmData.message ||
            'I have generated your personalized wedding checklist based on your requirements.',
        });

        // Add success message about saving to backend
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `✅ Checklist successfully saved with ${checklistResponse.items.length} items! Your wedding planning checklist is now stored in the system and ready to use.`,
        });

        // Inform user that subsequent queries will be handled by the assistant
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Going forward, your follow-up queries will be answered by our Wedding Planner Assistant. You can also edit your checklist items directly in the checklist table.',
        });

        if (progressData.stage === 'planning') {
          setStage(weddingId, 'generated');
        }
      } else {
        // LLM generated checklist but backend save failed
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: llmData.message || 'I have generated your checklist.',
        });

        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            '⚠️ The checklist was generated but could not be saved to the system. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error in handleChecklist:', error);

      // Check if this is a backend save error (after successful LLM call)
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; body?: any };
        let errorMessage = '';

        switch (apiError.status) {
          case 409:
            // Conflict - checklist already exists, try to load it
            try {
              const existingLoaded = await loadExistingChecklist();
              if (existingLoaded) {
                addMessage(weddingId, {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content:
                    '✅ Found your existing checklist! The AI-generated updates have been applied locally, but your saved checklist in the system remains unchanged.',
                });
                return; // Exit early if we successfully loaded existing checklist
              }
              errorMessage =
                'A checklist already exists for this wedding, but we could not load it. Please refresh the page.';
            } catch (loadError) {
              errorMessage =
                'A checklist already exists for this wedding. You can view and edit it in the checklist table.';
            }
            break;
          case 404:
            errorMessage = 'Wedding not found. Please make sure you have selected a valid wedding.';
            break;
          case 401:
            errorMessage = 'You are not authorized to save the checklist. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to save a checklist for this wedding.';
            break;
          default:
            errorMessage = `Failed to save checklist to system: ${apiError.body?.message || 'Unknown error occurred'}`;
        }

        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: errorMessage,
        });
      } else {
        // This is likely an LLM call error
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Sorry, I encountered an error while generating your checklist. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeddingAssistant = async (input: string, context?: { wedding?: any }) => {
    if (typeof weddingId !== 'number') return;

    const text = input.trim();
    if (!text) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: text };
    addMessage(weddingId, userMsg);

    try {
      setIsLoading(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'assistant',
          messages: [...progressData.messages, userMsg],
          checklist: progressData.checklist,
          wedding: context?.wedding ?? null,
        }),
      });

      const data = await res.json();
      const reply = typeof data?.message === 'string' ? data.message : 'How can I help further?';
      addMessage(weddingId, { id: crypto.randomUUID(), role: 'assistant', content: reply });
    } catch (error) {
      console.error('Assistant chat error:', error);
      addMessage(weddingId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I ran into an error while answering. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingChecklist = async () => {
    if (typeof weddingId !== 'number') return;

    try {
      setIsLoading(true);

      // Try to fetch existing checklist for this wedding
      const checklistResponse =
        await ChecklistService.checklistControllerFindByWeddingId(weddingId);

      if (checklistResponse.items && checklistResponse.items.length > 0) {
        // Convert backend response to frontend format
        const frontendChecklist = checklistResponse.items.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          category: item.category,
          monthsBeforeWedding: item.monthsBeforeWedding ?? undefined,
          completed: item.completed,
        }));

        setChecklist(weddingId, frontendChecklist);
        if (progressData.stage !== 'generated') {
          setStage(weddingId, 'generated');
        }

        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Found your existing checklist with ${checklistResponse.items.length} items! You can view and edit them in the checklist table.`,
        });

        return true; // Successfully loaded existing checklist
      }
    } catch (error) {
      console.error('Error loading existing checklist:', error);
      // If no checklist exists (404), that's fine - user can create a new one
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number };
        if (apiError.status === 404) {
          return false; // No existing checklist found
        }
      }

      addMessage(weddingId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Could not load existing checklist. You can create a new one instead.',
      });
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  // Modal control functions
  const openAddItemModal = () => {
    setNewItem({
      title: '',
      description: '',
      category: '',
      monthsBeforeWedding: 0,
      completed: false,
    });
    setIsAddingItem(true);
  };

  const closeAddItemModal = () => {
    setIsAddingItem(false);
    setNewItem({
      title: '',
      description: '',
      category: '',
      monthsBeforeWedding: 0,
      completed: false,
    });
  };

  const closeEditItemModal = () => {
    setEditingItem(null);
  };

  const openDeleteConfirmModal = (item: ChecklistItem) => {
    setDeleteConfirmItem(item);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmItem(null);
  };

  // CRUD functions for individual checklist items
  const handleAddItem = async (): Promise<ChecklistItem[] | null> => {
    if (!weddingId || !newItem.title || !newItem.description || !newItem.category) return null;

    try {
      setIsSubmitting(true);

      // First, get the current checklist to find the checklist ID
      const checklistResponse =
        await ChecklistService.checklistControllerFindByWeddingId(weddingId);

      if (!checklistResponse.id) {
        throw new Error('No checklist found for this wedding');
      }

      // Add the new item to the checklist
      const newItemResponse = await ChecklistService.checklistControllerAddItem(
        checklistResponse.id,
        newItem as CreateChecklistItemDto,
      );

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = await fetchChecklistFromBackend(weddingId);

      closeAddItemModal();
      return updatedChecklist;
    } catch (error) {
      console.error('Error adding checklist item:', error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = (item: ChecklistItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (): Promise<ChecklistItem[] | null> => {
    if (!editingItem || !editingItem.id) return null;

    try {
      setIsSubmitting(true);

      const updateData: UpdateChecklistItemDto = {
        title: editingItem.title,
        description: editingItem.description,
        category: editingItem.category,
        monthsBeforeWedding: editingItem.monthsBeforeWedding,
        completed: editingItem.completed,
      };

      await ChecklistService.checklistControllerUpdateItem(parseInt(editingItem.id), updateData);

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = weddingId ? await fetchChecklistFromBackend(weddingId) : null;

      closeEditItemModal();
      return updatedChecklist;
    } catch (error) {
      console.error('Error updating checklist item:', error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteItem = async (): Promise<ChecklistItem[] | null> => {
    if (!deleteConfirmItem || !deleteConfirmItem.id) return null;

    try {
      setIsSubmitting(true);

      await ChecklistService.checklistControllerRemoveItem(parseInt(deleteConfirmItem.id));

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = weddingId ? await fetchChecklistFromBackend(weddingId) : null;

      closeDeleteConfirmModal();
      return updatedChecklist;
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItemCompletion = async (
    itemId: string,
    completed: boolean,
  ): Promise<ChecklistItem[] | null> => {
    try {
      // Use the appropriate API call based on the new completion state
      if (completed) {
        await ChecklistService.checklistControllerMarkItemCompleted(parseInt(itemId));
      } else {
        await ChecklistService.checklistControllerMarkItemUncompleted(parseInt(itemId));
      }

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = weddingId ? await fetchChecklistFromBackend(weddingId) : null;

      return updatedChecklist;
    } catch (error) {
      console.error('Error toggling item completion:', error);
      return null;
    }
  };

  return {
    // Loading states
    isLoading,
    isSubmitting,

    // Modal states
    isAddingItem,
    editingItem,
    deleteConfirmItem,

    // Form data
    newItem,
    setNewItem,
    setEditingItem,

    // Handler functions
    handleNextCategory,
    handleChecklist,
    handleWeddingAssistant,
    loadExistingChecklist,
    fetchChecklistFromBackend,

    // CRUD functions for items
    handleAddItem,
    handleEditItem,
    handleUpdateItem,
    confirmDeleteItem,
    toggleItemCompletion,

    // Modal controls
    openAddItemModal,
    closeAddItemModal,
    closeEditItemModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
  };
}
