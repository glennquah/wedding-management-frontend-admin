import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';
import { persist } from 'zustand/middleware';

// Align with sessionStore's pattern to allow reset hooks if needed later
export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    return store;
  };
}) as typeof actualCreate;

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  monthsBeforeWedding?: number;
  completed?: boolean;
};

export type ChatbotStage =
  | 'GETTING_STARTED'
  | 'INITIAL_PLANNING'
  | 'CREATING_THE_FOUNDATION'
  | 'DETAILED_PLANNING'
  | 'DURING_THE_WEDDING'
  | 'AFTER_THE_WEDDING'
  | 'ADDITIONAL_DETAILS'
  | 'CHECKLIST_GENERATED';

export type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

export type CategoryIntroState = {
  currentCategoryIndex: number;
  categories: string[];
  isIntroductionComplete: boolean;
};

type ProgressTrackerData = {
  stage: ChatbotStage;
  checklist: ChecklistItem[];
  categoryIntro: CategoryIntroState;
  messages: ChatMessage[];
  userPreferences: string;
};

type DraftState = {
  data: ProgressTrackerData;
  dirty: boolean;
  modifiedFields: (keyof ProgressTrackerData | string)[];
  originalData: ProgressTrackerData | null;
};

export const defaultChecklist: ChecklistItem[] = [
  // Getting Started
  {
    id: '1',
    title: 'Wedding Instance Created',
    description:
      "By now you should have already created your wedding instance. This will serve as the base for your wedding planning going forward. Feel free to edit your wedding details in your 'Account' page.",
    category: 'Getting Started',
    monthsBeforeWedding: 18,
    completed: true,
  },

  // Initial Planning
  {
    id: '2',
    title: 'Create Your Primary Guest List',
    description:
      'Use the Guest List Tool to add your closest friends and loved ones to the primary guest list to begin planning.',
    category: 'Initial Planning',
    monthsBeforeWedding: 18,
  },
  {
    id: '3',
    title: 'Find Your Wedding Date',
    description:
      'Use the AI Scheduler Tool to find the most ideal wedding date based on your preferences and your primary guests’ availability.',
    category: 'Initial Planning',
    monthsBeforeWedding: 18,
  },
  {
    id: '4',
    title: 'Select Your Wedding Venue',
    description:
      'Explore the E-commerce Platform to find and book the perfect wedding venue in Singapore.',
    category: 'Initial Planning',
    monthsBeforeWedding: 18,
  },
  {
    id: '4.1',
    title: 'Make Your First Purchase',
    description:
      'To proceed with the unlocked features, make a purchase using the E-commerce Platform. Booking your wedding venue is recommended as it determines your wedding date.',
    category: 'Initial Planning',
    monthsBeforeWedding: 16,
  },

  // Creating the Foundation
  {
    id: '5',
    title: 'Create Your Microsite',
    description:
      'Use the Microsite Builder to create a personalized microsite for your wedding to share with your guests.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 8,
  },
  {
    id: '6',
    title: 'Broadcast Guest Invites',
    description:
      'Continue to update and refine your guest list and send out RSVP invites once ready using the Guest List Tool.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 4,
  },
  {
    id: '7',
    title: 'Arrange Guest Seating',
    description:
      'Use the AI-powered Seating Arrangement Tool to plan your seating arrangement for your wedding.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 3,
  },
  {
    id: '8',
    title: 'Create Photo Album Invite Card',
    description:
      'Design and customize your photo album invite card using the Photo Album Invite Card Builder to share with your guests.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 2,
  },

  // Detailed Planning
  {
    id: '9',
    title: 'Engage a Wedding Coordinator',
    description:
      'Start your planning by hiring a wedding coordinator to help manage and organize your big day. If you need to source for one, check out the E-commerce Platform.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 10,
  },
  {
    id: '9.1',
    title: 'Book Photographer and Videographer',
    description:
      'Capture your special moments by booking a professional wedding photographer and videographer. Hire one from the E-commerce Platform.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 8,
  },
  {
    id: '9.2',
    title: 'Arrange Wedding Attire',
    description:
      'Select and arrange for wedding gowns and suits from the E-commerce Platform for the bride, groom, and wedding party.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 8,
  },
  {
    id: '9.3',
    title: 'Hire a Stylist and Florist',
    description:
      'Engage a wedding stylist and florist from the E-commerce Platform to design the decor and floral arrangements. Hire one from the E-commerce Platform.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 4,
  },
  {
    id: '9.4',
    title: 'Book Hair and Makeup Artist',
    description:
      'Ensure you look your best by hiring a professional bridal hair and makeup artist. Hire one from the E-commerce Platform.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 4,
  },
  {
    id: '9.5',
    title: 'Arrange Cake and Catering Services',
    description:
      'Book a cake designer and catering service from the E-commerce platform to provide delicious food and desserts.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 6,
  },
  {
    id: '9.6',
    title: 'Secure a Solemniser',
    description:
      'Find and confirm a solemniser to officiate your wedding ceremony (not available on our platform).',
    category: 'Detailed Planning',
    monthsBeforeWedding: 8,
  },
  {
    id: '9.7',
    title: 'Purchase Wedding Rings',
    description:
      'Select and purchase wedding rings for the ceremony. Do check out the options from the E-commerce Platform.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 8,
  },
  {
    id: '9.8',
    title: 'Book Wedding Entertainment',
    description:
      'Hire entertainment such as a live band, DJ, or performers for your wedding. Check out the E-commerce Platform for performers specializing in wedding events.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 6,
  },
  {
    id: '9.9',
    title: 'Arrange Wedding Transportation',
    description:
      'Book a wedding car or other transportation for the couple and guests. If you need to source for one, check out the E-commerce Platform.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 4,
  },
  {
    id: '10',
    title: 'Obtain Your Marriage License',
    description:
      'File a notice of marriage with the Registry of Marriages at least 21 days before your wedding.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 1,
  },
  {
    id: '11',
    title: 'Plan Pre-Wedding Parties',
    description: 'Organize hen’s and stag parties to celebrate with your friends.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 3,
  },
  {
    id: '12',
    title: 'Firm Up Wedding Day Schedule',
    description:
      'Work with your wedding coordinator to finalize the schedule for the wedding day, ensuring all events are well-timed and organized.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 1,
  },

  // During the Wedding
  {
    id: '13',
    title: 'Attendance Taking',
    description: 'Use the Attendance Taking tool to track guest attendance on the wedding day.',
    category: 'During the Wedding',
    monthsBeforeWedding: 0,
  },
  {
    id: '14',
    title: 'Wedding Monetary Gifts QR',
    description:
      'Set up a QR code using the Wedding Gifts Tool for guests to give monetary gifts conveniently.',
    category: 'During the Wedding',
    monthsBeforeWedding: 0,
  },
  {
    id: '15',
    title: 'Photo Album Upload QR',
    description:
      'Print the photo album invite card created, to provide guests with a QR code to upload photos taken during the wedding.',
    category: 'During the Wedding',
    monthsBeforeWedding: 0,
  },

  // After the Wedding
  {
    id: '17',
    title: 'Send E-Thank You Cards',
    description:
      'Express your gratitude by sending e-thank you cards using the E-card Tool to your guests.',
    category: 'After the Wedding',
    monthsBeforeWedding: -1,
  },
  {
    id: '18',
    title: 'Track Your Wedding Budget',
    description: 'Use our Budget Tracking Feature to review and manage your wedding expenses.',
    category: 'After the Wedding',
    monthsBeforeWedding: -1,
  },

  // Additional Details
  {
    id: '19',
    title: 'Finalize Wedding Traditions',
    description: 'Decide on any cultural or family traditions you want to include in your wedding.',
    category: 'Additional Details',
    monthsBeforeWedding: 6,
  },
  {
    id: '20',
    title: 'Plan Your Honeymoon',
    description: 'Allocate time and budget for your first big adventure as a married couple.',
    category: 'Additional Details',
    monthsBeforeWedding: 3,
  },
];

const categories = [
  'Getting Started',
  'Initial Planning',
  'Creating the Foundation',
  'Detailed Planning',
  'During the Wedding',
  'After the Wedding',
  'Additional Details',
];

const defaultWelcomeMessage: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content:
    "Welcome to your Wedding Planning Assistant! 🎉\n\nI'll guide you through our comprehensive wedding planning checklist, organized by categories. Let's start with the first category: Getting Started.\n\n" +
    defaultChecklist
      .filter((item) => item.category === 'Getting Started')
      .map((item) => `• **${item.title}**: ${item.description}`)
      .join('\n\n') +
    "\n\nClick 'Next' to continue to the next category.",
};

const emptyProgressTrackerData = (weddingId?: number): ProgressTrackerData => ({
  stage: 'GETTING_STARTED',
  checklist: defaultChecklist,
  categoryIntro: {
    currentCategoryIndex: 0,
    categories,
    isIntroductionComplete: false,
  },
  messages: [defaultWelcomeMessage],
  userPreferences: '',
});

export const createEmptyProgressTrackerData = emptyProgressTrackerData;

interface ProgressTrackerStore {
  // Drafts keyed by weddingId
  drafts: Record<number, DraftState>;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  ensureDraft: (weddingId: number) => void;
  setData: (weddingId: number, data: ProgressTrackerData) => void;
  patchData: (weddingId: number, patch: Partial<ProgressTrackerData>) => void;
  updateData: (
    weddingId: number,
    updater: (prev: ProgressTrackerData) => ProgressTrackerData,
  ) => void;
  resetData: (weddingId: number) => void;
  setDirty: (weddingId: number, v: boolean) => void;
  clearDirty: (weddingId: number) => void;

  // Wedding-specific methods
  setStage: (weddingId: number, stage: ChatbotStage) => void;
  setChecklist: (weddingId: number, checklist: ChecklistItem[]) => void;
  setCategoryIntro: (weddingId: number, categoryIntro: CategoryIntroState) => void;
  nextCategory: (weddingId: number) => void;
  setMessages: (weddingId: number, messages: ChatMessage[]) => void;
  addMessage: (weddingId: number, message: ChatMessage) => void;
  setUserPreferences: (weddingId: number, preferences: string) => void;
  updateChecklistItem: (weddingId: number, id: string, updates: Partial<ChecklistItem>) => void;
  reset: (weddingId: number) => void;
}

export const useProgressTrackerStore = create<ProgressTrackerStore>()(
  persist(
    (set, get) => ({
      drafts: {},
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      ensureDraft: (weddingId) =>
        set((s) => {
          if (s.drafts[weddingId]) return s;
          return {
            drafts: {
              ...s.drafts,
              [weddingId]: {
                data: emptyProgressTrackerData(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              },
            },
          };
        }),

      setData: (weddingId, data) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [weddingId]: {
              ...(s.drafts[weddingId] ?? {
                data: emptyProgressTrackerData(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              }),
              data: data,
            },
          },
        })),

      patchData: (weddingId, patch) =>
        set((s) => {
          const prevDraft =
            s.drafts[weddingId] ??
            ({
              data: emptyProgressTrackerData(weddingId),
              dirty: false,
              modifiedFields: [],
              originalData: null,
            } as DraftState);
          const prev = prevDraft.data;
          const next = { ...prev, ...patch } as ProgressTrackerData;
          const touched: (keyof ProgressTrackerData | string)[] = [];
          for (const key of Object.keys(patch) as (keyof ProgressTrackerData)[]) {
            if (prev[key] !== next[key]) touched.push(key);
          }
          return {
            drafts: {
              ...s.drafts,
              [weddingId]: {
                ...prevDraft,
                data: next,
                dirty: prevDraft.dirty || touched.length > 0,
                modifiedFields: Array.from(
                  new Set([...(prevDraft.modifiedFields || []), ...touched]),
                ),
              },
            },
          };
        }),

      updateData: (weddingId, updater) =>
        set((s) => {
          const prevDraft =
            s.drafts[weddingId] ??
            ({
              data: emptyProgressTrackerData(weddingId),
              dirty: false,
              modifiedFields: [],
              originalData: null,
            } as DraftState);
          const prev = prevDraft.data;
          const next = updater(prev);
          const touched: (keyof ProgressTrackerData | string)[] = [];
          for (const k of Object.keys(next) as (keyof ProgressTrackerData)[]) {
            if (prev[k] !== next[k]) touched.push(k);
          }
          return {
            drafts: {
              ...s.drafts,
              [weddingId]: {
                ...prevDraft,
                data: next,
                dirty: prevDraft.dirty || touched.length > 0,
                modifiedFields: Array.from(
                  new Set([...(prevDraft.modifiedFields || []), ...touched]),
                ),
              },
            },
          };
        }),

      resetData: (weddingId) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [weddingId]: {
              data: emptyProgressTrackerData(weddingId),
              dirty: false,
              modifiedFields: [],
              originalData: null,
            },
          },
        })),

      setDirty: (weddingId, v) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [weddingId]: {
              ...(s.drafts[weddingId] ?? {
                data: emptyProgressTrackerData(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              }),
              dirty: v,
            },
          },
        })),

      clearDirty: (weddingId) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [weddingId]: {
              ...(s.drafts[weddingId] ?? {
                data: emptyProgressTrackerData(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              }),
              dirty: false,
              modifiedFields: [],
            },
          },
        })),

      // Wedding-specific methods
      setStage: (weddingId, stage) => {
        get().patchData(weddingId, { stage });
      },

      setChecklist: (weddingId, checklist) => {
        get().patchData(weddingId, { checklist });
      },

      setCategoryIntro: (weddingId, categoryIntro) => {
        get().patchData(weddingId, { categoryIntro });
      },

      nextCategory: (weddingId) => {
        const draft = get().drafts[weddingId];
        if (!draft) return;

        const categoryIntro = draft.data.categoryIntro;
        const nextIndex = categoryIntro.currentCategoryIndex + 1;

        if (nextIndex >= categories.length) {
          // Introduction complete
          get().patchData(weddingId, {
            categoryIntro: {
              ...categoryIntro,
              isIntroductionComplete: true,
            },
            stage: 'ADDITIONAL_DETAILS',
          });
          get().addMessage(weddingId, {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              "Great! You've reviewed all the default checklist categories. 🎉\n\nNext, share a few details about your wedding—preferences, constraints, priorities, or anything unique. I'll use what you share to generate your personalized Progress Tracker Timeline and Checklist Table. I'm here to help with planning and coordination.\n\nWhat would you like to add or clarify to get your plan generated?",
          });
        } else {
          // Show next category
          const category = categories[nextIndex];
          const categoryItems = defaultChecklist.filter((item) => item.category === category);

          get().patchData(weddingId, {
            categoryIntro: {
              ...categoryIntro,
              currentCategoryIndex: nextIndex,
            },
          });

          get().addMessage(weddingId, {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              `**${category}**\n\n` +
              categoryItems.map((item) => `• **${item.title}**: ${item.description}`).join('\n\n') +
              "\n\nClick 'Next' to continue to the next category.",
          });
        }
      },

      setMessages: (weddingId, messages) => {
        get().patchData(weddingId, { messages });
      },

      addMessage: (weddingId, message) => {
        get().updateData(weddingId, (prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      },

      setUserPreferences: (weddingId, preferences) => {
        get().patchData(weddingId, { userPreferences: preferences });
      },

      updateChecklistItem: (weddingId, id, updates) => {
        get().updateData(weddingId, (prev) => ({
          ...prev,
          checklist: prev.checklist.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        }));
      },

      reset: (weddingId) => {
        get().resetData(weddingId);
      },
    }),
    {
      name: 'progress-tracker-v1',
      version: 1,
      partialize: (state) => {
        const drafts: Record<
          number,
          {
            data: ProgressTrackerData;
            dirty: boolean;
            modifiedFields: (keyof ProgressTrackerData | string)[];
          }
        > = {};
        for (const [idStr, draft] of Object.entries(state.drafts)) {
          const id = Number(idStr);
          if (Number.isNaN(id)) continue;
          drafts[id] = {
            data: draft.data,
            dirty: draft.dirty,
            modifiedFields: draft.modifiedFields,
          };
        }
        return { drafts };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
