import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  monthsBeforeWedding?: number;
  completed?: boolean;
};

export type ChatbotStage = 'introduction' | 'planning' | 'generated';

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

export type ProgressTrackerStore = {
  stage: ChatbotStage;
  checklist: ChecklistItem[];
  categoryIntro: CategoryIntroState;
  messages: ChatMessage[];
  userPreferences: string;
  setStage: (stage: ChatbotStage) => void;
  setChecklist: (checklist: ChecklistItem[]) => void;
  setCategoryIntro: (categoryIntro: CategoryIntroState) => void;
  nextCategory: () => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setUserPreferences: (preferences: string) => void;
  updateChecklistItem: (id: string, updates: Partial<ChecklistItem>) => void;
  reset: () => void;
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
  },

  // Initial Planning
  {
    id: '2',
    title: 'Create Your Primary Guest List',
    description:
      'Add your closest friends and loved ones to the primary guest list to begin planning.',
    category: 'Initial Planning',
    monthsBeforeWedding: 12,
  },
  {
    id: '3',
    title: 'Find Your Wedding Date',
    description:
      'Use our AI Scheduler to find the most ideal wedding date based on your preferences and your primary guests’ availability.',
    category: 'Initial Planning',
  },
  {
    id: '4',
    title: 'Select Your Wedding Venue',
    description:
      'Explore our e-commerce platform to find and book the perfect wedding venue in Singapore.',
    category: 'Initial Planning',
    monthsBeforeWedding: 12,
  },
  {
    id: '4.1',
    title: 'Make Your First Purchase',
    description:
      'To proceed with the unlocked features, make a purchase using our Shop page. Booking your wedding venue is recommended as it determines your wedding date.',
    category: 'Initial Planning',
    monthsBeforeWedding: 12,
  },

  // Creating the Foundation
  {
    id: '5',
    title: 'Create Your Microsite Template',
    description: 'Design a personalized microsite for your wedding to share with your guests.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 8,
  },
  {
    id: '6',
    title: 'Broadcast Guest Invites',
    description: 'Send RSVP invites to your guests using the Guest List tab.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 3,
  },
  {
    id: '7',
    title: 'Arrange Guest Seating',
    description: 'Use our AI-powered seating arrangement tool to plan your seating chart.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 2,
  },
  {
    id: '8',
    title: 'Create Invite Card Template',
    description: 'Design and customize your wedding invitation cards.',
    category: 'Creating the Foundation',
    monthsBeforeWedding: 4,
  },

  // Detailed Planning
  {
    id: '9',
    title: 'Engage a Wedding Coordinator',
    description:
      'Start your planning by hiring a wedding coordinator to help manage and organize your big day.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 10,
  },
  {
    id: '9.1',
    title: 'Book Photographer and Videographer',
    description:
      'Capture your special moments by booking a professional wedding photographer and videographer.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 8,
  },
  {
    id: '9.2',
    title: 'Arrange Wedding Attire',
    description:
      'Select and arrange for wedding gowns and suits for the bride, groom, and wedding party.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 6,
  },
  {
    id: '9.3',
    title: 'Hire a Stylist and Florist',
    description:
      'Engage a wedding stylist and florist to design the decor and floral arrangements.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 4,
  },
  {
    id: '9.4',
    title: 'Book Hair and Makeup Artist',
    description:
      'Ensure you look your best by hiring a professional bridal hair and makeup artist.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 2,
  },
  {
    id: '9.5',
    title: 'Arrange Cake and Catering Services',
    description:
      'Book a cake designer and catering service to provide delicious food and desserts.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 6,
  },
  {
    id: '9.6',
    title: 'Secure a Solemniser',
    description:
      'Find and confirm a solemniser to officiate your wedding ceremony (not available on our platform).',
    category: 'Detailed Planning',
    monthsBeforeWedding: 4,
  },
  {
    id: '9.7',
    title: 'Purchase Wedding Rings',
    description: 'Select and purchase wedding rings for the ceremony.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 4,
  },
  {
    id: '9.8',
    title: 'Book Wedding Entertainment',
    description: 'Hire entertainment such as a live band, DJ, or performers for your wedding.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 5,
  },
  {
    id: '9.9',
    title: 'Arrange Wedding Transportation',
    description: 'Book a wedding car or other transportation for the couple and guests.',
    category: 'Detailed Planning',
    monthsBeforeWedding: 3,
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
    description: 'Use our platform to track guest attendance on the wedding day.',
    category: 'During the Wedding',
    monthsBeforeWedding: 0,
  },
  {
    id: '14',
    title: 'Wedding Monetary Gifts QR',
    description: 'Set up a QR code for guests to give monetary gifts conveniently.',
    category: 'During the Wedding',
    monthsBeforeWedding: 0,
  },
  {
    id: '15',
    title: 'Photo Album Upload QR',
    description: 'Provide a QR code for guests to upload photos taken during the wedding.',
    category: 'During the Wedding',
    monthsBeforeWedding: 0,
  },

  // After the Wedding
  {
    id: '17',
    title: 'Send E-Thank You Cards',
    description: 'Express your gratitude by sending e-thank you cards to your guests.',
    category: 'After the Wedding',
    monthsBeforeWedding: 0,
  },
  {
    id: '18',
    title: 'Track Your Wedding Budget',
    description: 'Use our budget tracking feature to review and manage your wedding expenses.',
    category: 'After the Wedding',
    monthsBeforeWedding: 0,
  },

  // Additional Details
  {
    id: '19',
    title: 'Finalize Wedding Traditions',
    description: 'Decide on any cultural or family traditions you want to include in your wedding.',
    category: 'Additional Details',
    monthsBeforeWedding: 3,
  },
  {
    id: '20',
    title: 'Plan Your Honeymoon',
    description: 'Allocate time and budget for your first big adventure as a married couple.',
    category: 'Additional Details',
    monthsBeforeWedding: 6,
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

export const useProgressTrackerStore = create<ProgressTrackerStore>()(
  persist(
    (set, get) => ({
      stage: 'introduction',
      checklist: defaultChecklist,
      categoryIntro: {
        currentCategoryIndex: 0,
        categories,
        isIntroductionComplete: false,
      },
      messages: [defaultWelcomeMessage],
      userPreferences: '',

      setStage: (stage) => set({ stage }),
      setChecklist: (checklist) => set({ checklist }),
      setCategoryIntro: (categoryIntro) => set({ categoryIntro }),
      nextCategory: () => {
        const { categoryIntro } = get();
        const nextIndex = categoryIntro.currentCategoryIndex + 1;

        if (nextIndex >= categories.length) {
          // Introduction complete
          set({
            categoryIntro: {
              ...categoryIntro,
              isIntroductionComplete: true,
            },
            stage: 'planning',
          });
          get().addMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              "Great! You've reviewed all the default checklist categories. 🎉\n\nNext, share a few details about your wedding—preferences, constraints, priorities, or anything unique. I'll use what you share to generate your personalized Progress Tracker timeline and Checklist table. I'm here to help with planning and coordination.\n\nWhat would you like to add or clarify to get your plan generated?",
          });
        } else {
          // Show next category
          const category = categories[nextIndex];
          const categoryItems = defaultChecklist.filter((item) => item.category === category);

          set({
            categoryIntro: {
              ...categoryIntro,
              currentCategoryIndex: nextIndex,
            },
          });

          get().addMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              `**${category}**\n\n` +
              categoryItems.map((item) => `• **${item.title}**: ${item.description}`).join('\n\n') +
              "\n\nClick 'Next' to continue to the next category.",
          });
        }
      },
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setUserPreferences: (preferences) => set({ userPreferences: preferences }),
      updateChecklistItem: (id, updates) => {
        const checklist = get().checklist;
        const updatedChecklist = checklist.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        );
        set({ checklist: updatedChecklist });
      },
      reset: () =>
        set({
          stage: 'introduction',
          checklist: defaultChecklist,
          categoryIntro: {
            currentCategoryIndex: 0,
            categories,
            isIntroductionComplete: false,
          },
          messages: [defaultWelcomeMessage],
          userPreferences: '',
        }),
    }),
    {
      name: 'progress-tracker-store',
    },
  ),
);
