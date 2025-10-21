'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import {
  useProgressTrackerStore,
  createEmptyProgressTrackerData,
  ChecklistItem,
  ChatbotStage,
} from '../store/progressTrackerStore';
import { useWeddingStore } from '../store/sessionStore';
import {
  ChecklistService,
  CreateChecklistDto,
  CreateChecklistItemDto,
  CreateChatMessageDto,
  UpdateChecklistItemDto,
  UpdateChecklistDto,
  WeddingResponseDto,
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

  const { setChecklist, nextCategory, addMessage, setStage, setMessages } =
    useProgressTrackerStore();
  const { firstPurchaseMade } = useWeddingStore();

  // Function to get current messages from store
  const getCurrentMessages = useCallback(() => {
    if (typeof weddingId !== 'number') return [];
    const currentState = useProgressTrackerStore.getState();
    const currentData =
      currentState.drafts[weddingId]?.data ?? createEmptyProgressTrackerData(weddingId);
    return currentData.messages;
  }, [weddingId]);

  // Categories mapping for stage progression
  const categories = [
    'Getting Started',
    'Initial Planning',
    'Creating the Foundation',
    'Detailed Planning',
    'During the Wedding',
    'After the Wedding',
    'Additional Details',
  ];

  // Stage to category mapping
  const stageToCategory: Record<ChatbotStage, string> = {
    GETTING_STARTED: 'Getting Started',
    INITIAL_PLANNING: 'Initial Planning',
    CREATING_THE_FOUNDATION: 'Creating the Foundation',
    DETAILED_PLANNING: 'Detailed Planning',
    DURING_THE_WEDDING: 'During the Wedding',
    AFTER_THE_WEDDING: 'After the Wedding',
    ADDITIONAL_DETAILS: 'Additional Details',
    CHECKLIST_GENERATED: 'Additional Details',
  };

  // Get wedding-specific data
  const progressData = useProgressTrackerStore((s) =>
    typeof weddingId === 'number'
      ? (s.drafts[weddingId]?.data ?? createEmptyProgressTrackerData(weddingId))
      : createEmptyProgressTrackerData(0),
  );

  const handleNextCategory = async () => {
    if (typeof weddingId !== 'number') return;

    const currentStage = progressData.stage;

    // Define stage progression
    const stageProgression: Record<ChatbotStage, ChatbotStage | null> = {
      GETTING_STARTED: 'INITIAL_PLANNING',
      INITIAL_PLANNING: 'CREATING_THE_FOUNDATION',
      CREATING_THE_FOUNDATION: 'DETAILED_PLANNING',
      DETAILED_PLANNING: 'DURING_THE_WEDDING',
      DURING_THE_WEDDING: 'AFTER_THE_WEDDING',
      AFTER_THE_WEDDING: 'ADDITIONAL_DETAILS',
      ADDITIONAL_DETAILS: 'CHECKLIST_GENERATED',
      CHECKLIST_GENERATED: null, // No further progression
    };

    const nextStage = stageProgression[currentStage];

    if (!nextStage) {
      console.log('Already at final stage');
      return;
    }

    // MANDATORY BLOCK: Check firstPurchaseMade for INITIAL_PLANNING -> CREATING_THE_FOUNDATION transition
    if (currentStage === 'INITIAL_PLANNING' && nextStage === 'CREATING_THE_FOUNDATION') {
      if (!firstPurchaseMade) {
        toast.error(
          'Please make your first purchase before proceeding to Creating the Foundation stage.',
        );
        console.log('Progression blocked: First purchase required');
        return;
      }
    }

    try {
      setIsLoading(true);

      // Determine the new assistant message content first
      let newAssistantMessage: string;
      let additionalMessage: string | null = null; // For ADDITIONAL_DETAILS stage

      if (nextStage === 'CHECKLIST_GENERATED') {
        newAssistantMessage =
          '🎉 Great! You’ve gone through all the checklist categories. Now tell me what’s unique about your wedding — any special plans, themes, or details I might’ve missed — and I’ll help you add personalized tasks to your checklist.';
      } else {
        const nextCategoryName = stageToCategory[nextStage];
        const categoryItems = progressData.checklist.filter(
          (item) => item.category === nextCategoryName,
        );

        newAssistantMessage =
          `**${nextCategoryName}**\n\n` +
          categoryItems.map((item) => `• **${item.title}**: ${item.description}`).join('\n\n') +
          "\n\nClick 'Next Category' to continue.";

        // If this is ADDITIONAL_DETAILS stage, add the completion message as well
        if (nextStage === 'ADDITIONAL_DETAILS') {
          additionalMessage =
            "🎉 Great! You've gone through all the checklist categories. Now tell me what’s unique about your wedding — any special plans, themes, or details I might’ve missed — and I’ll help you add personalized tasks to your checklist.";
        }
      }

      // Prepare chat history for backend INCLUDING the new assistant message(s)
      const newAssistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: newAssistantMessage,
      };

      // Get current messages from store (this ensures we have the most up-to-date messages)
      const currentMessages = getCurrentMessages();
      let updatedMessages = [...currentMessages, newAssistantMsg];

      // Add the additional message if it exists (for ADDITIONAL_DETAILS stage)
      if (additionalMessage) {
        const additionalMsg = {
          id: crypto.randomUUID(),
          role: 'assistant' as const,
          content: additionalMessage,
        };
        updatedMessages = [...updatedMessages, additionalMsg];
      }

      // Set createdAt with incrementing milliseconds to preserve order
      const baseTime = new Date();
      const chatHistoryForBackend = updatedMessages.map((msg, index) => ({
        role: msg.role as CreateChatMessageDto.role,
        content: msg.content,
        createdAt: new Date(baseTime.getTime() + index).toISOString(),
      }));

      // Try to find existing checklist first
      let checklistResponse;
      try {
        checklistResponse = await ChecklistService.checklistControllerFindByWeddingId(weddingId);
      } catch (error) {
        // If checklist doesn't exist (404), we'll create it below
        if (error && typeof error === 'object' && 'status' in error) {
          const apiError = error as { status: number };
          if (apiError.status === 404) {
            checklistResponse = null;
          } else {
            throw error; // Re-throw other errors
          }
        } else {
          throw error;
        }
      }

      if (checklistResponse?.id) {
        // Update existing checklist
        const updateData: UpdateChecklistDto = {
          currentStage: nextStage as UpdateChecklistDto.currentStage,
          items: progressData.checklist.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            monthsBeforeWedding: item.monthsBeforeWedding,
            completed: item.completed || false,
          })),
          chatHistory: chatHistoryForBackend,
        };

        await ChecklistService.checklistControllerUpdate(checklistResponse.id, updateData);

        // Update local state after successful backend update
        setStage(weddingId, nextStage);
      } else {
        // Create new checklist if none exists
        const createData: CreateChecklistDto = {
          weddingId: weddingId,
          items: progressData.checklist.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            monthsBeforeWedding: item.monthsBeforeWedding,
            completed: item.completed || false,
          })),
          chatHistory: chatHistoryForBackend,
        };

        const newChecklistResponse = await ChecklistService.checklistControllerCreate(createData);

        // Now update the newly created checklist with the correct stage
        if (newChecklistResponse.id) {
          const updateData: UpdateChecklistDto = {
            currentStage: nextStage as UpdateChecklistDto.currentStage,
            items: progressData.checklist.map((item) => ({
              title: item.title,
              description: item.description,
              category: item.category,
              monthsBeforeWedding: item.monthsBeforeWedding,
              completed: item.completed || false,
            })),
            chatHistory: chatHistoryForBackend,
          };

          await ChecklistService.checklistControllerUpdate(newChecklistResponse.id, updateData);
        }

        // Update local state after successful backend creation and update
        setStage(weddingId, nextStage);
      }

      // Fetch updated checklist to get the chat history from backend (source of truth)
      const updatedChecklistResponse =
        await ChecklistService.checklistControllerFindByWeddingId(weddingId);
      if (updatedChecklistResponse.chatHistory && updatedChecklistResponse.chatHistory.length > 0) {
        const frontendChatHistory = updatedChecklistResponse.chatHistory.map((msg) => ({
          id: msg.id,
          role: msg.role as 'assistant' | 'user',
          content: msg.content,
        }));
        setMessages(weddingId, frontendChatHistory);
      }

      console.log(`Stage progression: ${currentStage} -> ${nextStage}`);
    } catch (error) {
      console.error('Error updating checklist stage:', error);
      toast.error('Failed to update progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChecklistFromBackend = useCallback(
    async (targetWeddingId: number): Promise<ChecklistItem[] | null> => {
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

          // Update the local store with checklist
          setChecklist(targetWeddingId, frontendChecklist);

          // Set stage based on backend currentStage if available
          if (checklistResponse.currentStage) {
            const backendStage = checklistResponse.currentStage as ChatbotStage;
            setStage(targetWeddingId, backendStage);

            // Update chat history if available
            if (checklistResponse.chatHistory && checklistResponse.chatHistory.length > 0) {
              const frontendChatHistory = checklistResponse.chatHistory.map((msg) => ({
                id: msg.id,
                role: msg.role as 'assistant' | 'user',
                content: msg.content,
              }));

              setMessages(targetWeddingId, frontendChatHistory);
            } else {
              // No chat history from backend, add appropriate message for current stage if needed
              // Check if we only have the default welcome message (which has id 'welcome-msg')
              const hasOnlyDefaultMessage =
                progressData.messages.length === 1 &&
                progressData.messages[0]?.id === 'welcome-msg';

              if (progressData.messages.length === 0 || hasOnlyDefaultMessage) {
                // Clear existing messages first if we have the default message
                if (hasOnlyDefaultMessage) {
                  setMessages(targetWeddingId, []);
                }

                if (backendStage === 'CHECKLIST_GENERATED') {
                  addMessage(targetWeddingId, {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content:
                      'Welcome back! Your checklist has been generated. You can ask me anything about your wedding planning or make modifications to your checklist.',
                  });
                } else if (backendStage === 'ADDITIONAL_DETAILS') {
                  // Show completion message for the final stage
                  addMessage(targetWeddingId, {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content:
                      "🎉 Great! You've reviewed all the checklist categories. You can now generate your personalized checklist or continue planning with the existing items.",
                  });
                } else if (backendStage !== 'GETTING_STARTED') {
                  // For non-initial stages, show the current category content
                  const categoryName = stageToCategory[backendStage];
                  const categoryItems = frontendChecklist.filter(
                    (item) => item.category === categoryName,
                  );

                  addMessage(targetWeddingId, {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content:
                      `**${categoryName}**\n\n` +
                      categoryItems
                        .map((item) => `• **${item.title}**: ${item.description}`)
                        .join('\n\n') +
                      "\n\nClick 'Next Category' to continue, or 'Generate Checklist' when you're ready.",
                  });
                }
              }
            }
          } else {
            // Fallback to CHECKLIST_GENERATED if no currentStage but items exist
            setStage(targetWeddingId, 'CHECKLIST_GENERATED');
          }

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
    },
    [setChecklist, setStage, setMessages, addMessage],
  );

  const handleChecklist = async (input: string) => {
    if (typeof weddingId !== 'number') return;

    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user' as const, content: text };

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

      if (!Array.isArray(llmData?.checklist)) {
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            llmData.message ||
            "I could not generate a checklist. Please provide more specific details about what you'd like to add.",
        });
        return;
      }

      // Step 2: Process LLM response and merge with existing checklist
      // Always preserve existing items and add new ones from LLM
      const existingItems = progressData.checklist || [];

      // Extract only NEW items from LLM response (items not already in existing checklist)
      const newItemsFromLLM = llmData.checklist.filter((llmItem: CreateChecklistItemDto) => {
        // Check if this item already exists (by title and category)
        return !existingItems.some(
          (existingItem) =>
            existingItem.title.toLowerCase().trim() === llmItem.title.toLowerCase().trim() &&
            existingItem.category === llmItem.category,
        );
      });

      console.log(
        `Existing items: ${existingItems.length}, New items from LLM: ${newItemsFromLLM.length}`,
      );

      // Handle case where LLM returns 0 new items but provides a message
      if (newItemsFromLLM.length === 0) {
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            llmData.message ||
            "I didn't find any new items to add based on your request. Your existing checklist already covers what you mentioned, or you might want to be more specific about what you'd like to add.",
        });
        return;
      }

      // Convert new LLM items to frontend format
      const newFrontendItems: ChecklistItem[] = newItemsFromLLM.map(
        (item: CreateChecklistItemDto) => ({
          id: crypto.randomUUID(), // Generate temporary ID for frontend
          title: item.title,
          description: item.description,
          category: item.category,
          monthsBeforeWedding: item.monthsBeforeWedding,
          completed: item.completed || false,
        }),
      );

      // Merge existing items with new items
      const mergedChecklist = [...existingItems, ...newFrontendItems];

      // Update local state immediately with merged data
      setChecklist(weddingId, mergedChecklist);

      // Step 3: Save the merged checklist to the backend
      // Convert merged checklist to backend format
      const checklistItems: CreateChecklistItemDto[] = mergedChecklist.map((item) => ({
        title: item.title,
        description: item.description,
        category: item.category,
        monthsBeforeWedding: item.monthsBeforeWedding,
        completed: item.completed || false,
      }));

      // Prepare chat history for backend (including the new user message and LLM response)
      const llmResponseMsg = {
        role: 'assistant' as const,
        content:
          llmData.message ||
          'I have generated your personalized wedding checklist based on your requirements.',
      };

      // Build chat history for backend: existing messages + new userMsg + new llmResponseMsg
      const currentMessages = getCurrentMessages();
      const newMessages = [
        { role: userMsg.role, content: userMsg.content },
        { role: llmResponseMsg.role, content: llmResponseMsg.content },
      ];

      // Set createdAt with incrementing milliseconds to preserve order
      const baseTime = new Date();
      const chatHistoryForBackend = [...currentMessages, ...newMessages].map((msg, index) => ({
        role: msg.role as CreateChatMessageDto.role,
        content: msg.content,
        createdAt: new Date(baseTime.getTime() + index).toISOString(),
      }));

      // Check if checklist already exists for this wedding
      let checklistResponse;
      let isUpdating = false;

      try {
        checklistResponse = await ChecklistService.checklistControllerFindByWeddingId(weddingId);
        isUpdating = true;
      } catch (error) {
        // If checklist doesn't exist (404), we'll create it
        if (error && typeof error === 'object' && 'status' in error) {
          const apiError = error as { status: number };
          if (apiError.status === 404) {
            isUpdating = false;
          } else {
            throw error; // Re-throw other errors
          }
        } else {
          throw error;
        }
      }

      if (isUpdating && checklistResponse?.id) {
        // Update existing checklist
        const updateData: UpdateChecklistDto = {
          items: checklistItems,
          currentStage: 'CHECKLIST_GENERATED' as UpdateChecklistDto.currentStage,
          chatHistory: chatHistoryForBackend,
        };

        checklistResponse = await ChecklistService.checklistControllerUpdate(
          checklistResponse.id,
          updateData,
        );
      } else {
        // Create new checklist
        const createChecklistDto: CreateChecklistDto = {
          weddingId: weddingId,
          items: checklistItems,
          chatHistory: chatHistoryForBackend,
        };

        checklistResponse = await ChecklistService.checklistControllerCreate(createChecklistDto);
      }

      // Step 4: Update the local state with backend response
      if (checklistResponse.items && checklistResponse.items.length > 0) {
        // Convert backend response to frontend format with real IDs
        const finalChecklist = checklistResponse.items.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          category: item.category,
          monthsBeforeWedding: item.monthsBeforeWedding ?? undefined,
          completed: item.completed,
        }));

        // Update local state with backend IDs
        setChecklist(weddingId, finalChecklist);

        // Update chat messages from backend response (source of truth)
        if (checklistResponse.chatHistory && checklistResponse.chatHistory.length > 0) {
          const frontendChatHistory = checklistResponse.chatHistory.map((msg) => ({
            id: msg.id,
            role: msg.role as 'assistant' | 'user',
            content: msg.content,
          }));
          setMessages(weddingId, frontendChatHistory);
        }

        // Add success message about saving to backend
        const totalItems = checklistResponse.items.length;
        const newItemsCount = newItemsFromLLM.length;
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `✅ Checklist successfully ${isUpdating ? 'updated' : 'saved'} with ${totalItems} total items (${newItemsCount} new items added)! Your wedding planning checklist is now stored in the system and ready to use.`,
        });

        // Inform user that subsequent queries will be handled by the assistant
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Going forward, your follow-up queries will be answered by our Wedding Planner Assistant. You can also edit your checklist items directly in the checklist table.',
        });

        if (progressData.stage !== 'CHECKLIST_GENERATED') {
          setStage(weddingId, 'CHECKLIST_GENERATED');
        }
      } else {
        // Backend save failed but local state is already updated with LLM data
        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: llmData.message || 'I have generated your checklist.',
        });

        addMessage(weddingId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            '⚠️ The checklist was generated and is available locally, but could not be saved to the system. You can still use it, but it may not persist across sessions.',
        });
      }
    } catch (error) {
      console.error('Error in handleChecklist:', error);

      // Check if this is a backend save error (after successful LLM call)
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; body?: { message?: string } };
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

  const handleWeddingAssistant = async (
    input: string,
    context?: { wedding?: WeddingResponseDto },
  ) => {
    if (typeof weddingId !== 'number') return;

    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user' as const, content: text };

    try {
      setIsLoading(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'assistant',
          messages: [...getCurrentMessages(), userMsg],
          checklist: progressData.checklist,
          wedding: context?.wedding ?? null,
        }),
      });

      const data = await res.json();
      const reply = typeof data?.message === 'string' ? data.message : 'How can I help further?';
      const assistantMsg = { role: 'assistant' as const, content: reply };

      // Save updated chat history to backend if checklist exists
      try {
        const checklistResponse =
          await ChecklistService.checklistControllerFindByWeddingId(weddingId);
        if (checklistResponse?.id) {
          // Build complete message list with new messages
          const currentMessages = getCurrentMessages();
          const newMessages = [
            { role: userMsg.role, content: userMsg.content },
            { role: assistantMsg.role, content: assistantMsg.content },
          ];

          // Set createdAt with incrementing milliseconds to preserve order
          const baseTime = new Date();
          const chatHistoryForBackend = [...currentMessages, ...newMessages].map((msg, index) => ({
            role: msg.role as CreateChatMessageDto.role,
            content: msg.content,
            createdAt: new Date(baseTime.getTime() + index).toISOString(),
          }));

          const updateData: UpdateChecklistDto = {
            chatHistory: chatHistoryForBackend,
          };

          const updatedChecklist = await ChecklistService.checklistControllerUpdate(
            checklistResponse.id,
            updateData,
          );

          // Update local chat messages from backend response (source of truth)
          if (updatedChecklist.chatHistory && updatedChecklist.chatHistory.length > 0) {
            const frontendChatHistory = updatedChecklist.chatHistory.map((msg) => ({
              id: msg.id,
              role: msg.role as 'assistant' | 'user',
              content: msg.content,
            }));
            setMessages(weddingId, frontendChatHistory);
          }
        }
      } catch (error) {
        // If no checklist exists or update fails, just log it - don't interrupt the user experience
        console.log('Could not save chat history to backend:', error);
        // Add messages to local state as fallback
        addMessage(weddingId, { id: crypto.randomUUID(), ...assistantMsg });
      }
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
        if (progressData.stage !== 'CHECKLIST_GENERATED') {
          setStage(weddingId, 'CHECKLIST_GENERATED');
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
      let checklistResponse = null as Awaited<
        ReturnType<typeof ChecklistService.checklistControllerFindByWeddingId>
      > | null;
      try {
        checklistResponse = await ChecklistService.checklistControllerFindByWeddingId(weddingId);
      } catch (err) {
        // If not found (404), we'll create a new checklist on-the-fly
        if (
          err &&
          typeof err === 'object' &&
          'status' in err &&
          (err as { status: number }).status === 404
        ) {
          const itemsForCreate: CreateChecklistItemDto[] = (progressData.checklist || []).map(
            (item) => ({
              title: item.title,
              description: item.description,
              category: item.category,
              monthsBeforeWedding: item.monthsBeforeWedding,
              completed: item.completed || false,
            }),
          );

          const created = await ChecklistService.checklistControllerCreate({
            weddingId,
            items: itemsForCreate,
            chatHistory: [],
          });
          checklistResponse = created;
        } else {
          throw err;
        }
      }

      if (!checklistResponse || !checklistResponse.id) {
        throw new Error('No checklist found or created for this wedding');
      }

      // Add the new item to the checklist
      const newItemResponse = await ChecklistService.checklistControllerAddItem(
        checklistResponse.id,
        newItem as CreateChecklistItemDto,
      );

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = await fetchChecklistFromBackend(weddingId);

      // Also sync local store immediately
      if (updatedChecklist) {
        setChecklist(weddingId, updatedChecklist);
      }

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

      const parsedId = Number(editingItem.id);
      if (!Number.isFinite(parsedId)) {
        toast.error('Cannot update this item: it has not been saved to the server yet.');
        return null;
      }

      const updateData: UpdateChecklistItemDto = {
        title: editingItem.title,
        description: editingItem.description,
        category: editingItem.category,
        monthsBeforeWedding: editingItem.monthsBeforeWedding,
        completed: editingItem.completed,
      };

      await ChecklistService.checklistControllerUpdateItem(parsedId, updateData);

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = weddingId ? await fetchChecklistFromBackend(weddingId) : null;

      if (updatedChecklist) {
        if (typeof weddingId === 'number') {
          setChecklist(weddingId, updatedChecklist);
        }
      }

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

      const parsedId = Number(deleteConfirmItem.id);
      if (!Number.isFinite(parsedId)) {
        toast.error('Cannot delete this item: it has not been saved to the server yet.');
        return null;
      }

      await ChecklistService.checklistControllerRemoveItem(parsedId);

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = weddingId ? await fetchChecklistFromBackend(weddingId) : null;

      if (updatedChecklist) {
        if (typeof weddingId === 'number') {
          setChecklist(weddingId, updatedChecklist);
        }
      }

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
      const parsedId = Number(itemId);
      if (!Number.isFinite(parsedId)) {
        toast.error('Cannot update completion: item has not been saved to the server yet.');
        return null;
      }
      // Use the appropriate API call based on the new completion state
      if (completed) {
        await ChecklistService.checklistControllerMarkItemCompleted(parsedId);
      } else {
        await ChecklistService.checklistControllerMarkItemUncompleted(parsedId);
      }

      // Refresh the checklist from backend and return the updated data
      const updatedChecklist = weddingId ? await fetchChecklistFromBackend(weddingId) : null;

      if (updatedChecklist) {
        if (typeof weddingId === 'number') {
          setChecklist(weddingId, updatedChecklist);
        }
      }

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
