import { useMicrositeFormStore } from './micrositeStore';
import {
  AvailabilitySlotDto,
  CartItemResponseDto,
  CartService,
  OrderResponseDto,
  OrdersService,
  PaymentsService,
  WeddingResponseDto,
} from '@shared/api';
import { getCookie, setCookie } from 'cookies-next';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

const storeResetFns = new Set<() => void>();

const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    storeResetFns.add(() => {
      store.setState(store.getInitialState(), true);
    });
    return store;
  };
}) as typeof actualCreate;

interface SessionState {
  name: string;
  email: string;
  password: string;
  token: string | null;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  reset: () => void;
}

export const useSessionStore = actualCreate<SessionState>((set, get, store) => ({
  name: '',
  email: '',
  password: '',
  token: null,
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setToken: (token: string) => {
    set({ token });
    setCookie('session_token', token, { path: '/', maxAge: 60 * 60 * 24 }); // 1 day
  },
  clearToken: () => {
    set({ token: null });
    setCookie('session_token', '', { path: '/', maxAge: 0 });
  },
  reset: () => {
    set(store.getInitialState());
    setCookie('session_token', '', { path: '/', maxAge: 0 });
  },
}));

interface WeddingState {
  selectedWeddingId: number | null;
  mainWeddingId?: number | null;
  weddings: WeddingResponseDto[];
  hasHydrated: boolean;
  firstPurchaseMade: boolean;
  setSelectedWeddingId: (id: number | null) => void;
  setMainWeddingId: (id: number | null) => void;
  setWeddings: (weddings: WeddingResponseDto[]) => void;
  clearWeddings: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setFirstPurchaseMade: (firstPurchaseMade: boolean) => void;
  checkFirstPurchaseMade: () => Promise<void>;
  reset: () => void;
}

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set, get, store) => ({
      selectedWeddingId: null,
      mainWeddingId: null,
      weddings: [],
      hasHydrated: false,
      firstPurchaseMade: false,
      setSelectedWeddingId: (id: number | null) => set({ selectedWeddingId: id }),
      setMainWeddingId: (id: number | null) => set({ mainWeddingId: id }),
      setWeddings: (weddings: WeddingResponseDto[]) => set({ weddings }),
      clearWeddings: () => set({ weddings: [], selectedWeddingId: null, mainWeddingId: null }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
      setFirstPurchaseMade: (firstPurchaseMade: boolean) => set({ firstPurchaseMade }),
      checkFirstPurchaseMade: async () => {
        const weddingId = get().selectedWeddingId;
        if (!weddingId) {
          set({ firstPurchaseMade: false });
          return;
        }
        try {
          const orders = await OrdersService.orderControllerFindByWedding(weddingId);
          const hasPurchases = orders && orders.length > 0;
          set({ firstPurchaseMade: hasPurchases });
        } catch (error) {
          console.error('Failed to check purchase status:', error);
          set({ firstPurchaseMade: false });
        }
      },
      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: 'wedding-store',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export interface CartItem {
  category: string;
  id: string;
  image: string;
  name: string;
  price: number;
}

interface CartState {
  cartItems: CartItemResponseDto[];
  hasHydrated: boolean;
  order: OrderResponseDto | null;
  paymentStatus: '' | 'idle' | 'creating-order' | 'redirecting' | 'success' | 'error';
  errorMessage: string;

  setOrder: (order: OrderResponseDto | null) => void;
  setHasHydrated: (v: boolean) => void;

  createOrder: (weddingId: number) => Promise<void>;

  fetchCart: (adminId: number) => Promise<void>;
  addItem: (adminId: number, item: CartItem, selectedSlots: AvailabilitySlotDto[]) => Promise<void>;
  removeItem: (adminId: number, listingId: number) => Promise<void>;
  clearCart: (adminId: number, silent?: boolean) => Promise<void>;
  deleteCart: (adminId: number) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      order: null,
      paymentStatus: 'idle',
      errorMessage: '',
      hasHydrated: false,

      createOrder: async (weddingId: number) => {
        const cartItems = get().cartItems;

        if (cartItems.length === 0) return alert('Cart is empty');
        if (!weddingId) throw new Error('No wedding selected');

        set({ paymentStatus: 'creating-order', errorMessage: '' });

        try {
          const order = await OrdersService.orderControllerCreate({
            weddingId: weddingId,
            listings: cartItems.map((item) => ({
              listingId: item.listingId,
              bookedSlots: item.selectedSlots,
            })),
            remark: 'Test order from frontend',
          });

          set({ order });

          useWeddingStore.getState().setFirstPurchaseMade(true);

          const checkoutData = await PaymentsService.paymentControllerCreateCheckoutSession({
            orderId: order.id,
            successUrl: `${window.location.origin}/admin/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/admin/payment/cancel`,
          });

          set({ paymentStatus: 'redirecting' });
          window.location.href = checkoutData.url;
        } catch (error) {
          set({
            paymentStatus: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      },

      fetchCart: async (adminId: number) => {
        const res = await CartService.cartControllerGetCart(adminId);
        set({ cartItems: res.items });
      },

      addItem: async (adminId: number, item: CartItem, selectedSlots: AvailabilitySlotDto[]) => {
        const res = await CartService.cartControllerAddToCart({
          adminId,
          listingId: parseInt(item.id),
          selectedSlots,
        });
        set({ cartItems: res.items });
      },

      removeItem: async (adminId: number, listingId: number) => {
        const res = await CartService.cartControllerRemoveItem(adminId, listingId);
        set({ cartItems: res.items });
        toast.success('Item removed from cart');
      },

      clearCart: async (adminId: number, silent = false) => {
        const res = await CartService.cartControllerClearCart(adminId);
        set({ cartItems: res.items });
        if (!silent) {
          toast.success('Cart cleared');
        }
      },

      deleteCart: async (adminId: number) => {
        await CartService.cartControllerDeleteCart(adminId);
        set({ cartItems: [] });
      },

      setOrder: (order) => set({ order }),
      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
    }),
    {
      name: 'cart-store',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const initSessionFromCookie = () => {
  const token = getCookie('session_token') as string | undefined;
  if (token) {
    useSessionStore.getState().setToken(token);
  }
};

export const signOut = async (options?: Parameters<typeof nextAuthSignOut>[0]) => {
  const data = await nextAuthSignOut({
    callbackUrl: `${window.location.origin}/login`,
    redirect: false,
    ...options,
  });

  useWeddingStore.getState().reset();
  const { hasHydrated } = useWeddingStore.getState();
  useWeddingStore.setState({
    ...useWeddingStore.getState(),
    ...useWeddingStore.getState().reset,
    hasHydrated,
  });

  // Also clear microsite drafts on sign out
  try {
    const msHasHydrated = useMicrositeFormStore.getState().hasHydrated;
    useMicrositeFormStore.setState({ drafts: {}, hasHydrated: msHasHydrated });
  } catch {}

  if (data?.url) {
    window.location.href = data.url;
  }
};

export { resetAllStores };
