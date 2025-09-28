import { CartItemResponseDto, CartService, WeddingResponseDto } from '@shared/api';
import { getCookie, setCookie } from 'cookies-next';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useSessionStore = create<SessionState>((set, get, store) => ({
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
  setSelectedWeddingId: (id: number | null) => void;
  setMainWeddingId: (id: number | null) => void;
  setWeddings: (weddings: WeddingResponseDto[]) => void;
  clearWeddings: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  reset: () => void;
}

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set, get, store) => ({
      selectedWeddingId: null,
      mainWeddingId: null,
      weddings: [],
      hasHydrated: false,
      setSelectedWeddingId: (id: number | null) => set({ selectedWeddingId: id }),
      setMainWeddingId: (id: number | null) => set({ mainWeddingId: id }),
      setWeddings: (weddings: WeddingResponseDto[]) => set({ weddings }),
      clearWeddings: () => set({ weddings: [], selectedWeddingId: null, mainWeddingId: null }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
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
  fetchCart: (adminId: number) => Promise<void>;
  addItem: (adminId: number, item: CartItem) => Promise<void>;
  removeItem: (adminId: number, listingId: number) => Promise<void>;
  clearCart: (adminId: number) => Promise<void>;
  deleteCart: (adminId: number) => Promise<void>;
  setHasHydrated: (v: boolean) => void;
  reset: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get, store) => ({
      cartItems: [],
      hasHydrated: false,

      fetchCart: async (adminId: number) => {
        const res = await CartService.cartControllerGetCart(adminId);
        set({ cartItems: res.items });
      },

      addItem: async (adminId: number, item: CartItem) => {
        const res = await CartService.cartControllerAddToCart({
          adminId,
          listingId: parseInt(item.id),
        });
        set({ cartItems: res.items });
      },

      removeItem: async (adminId: number, listingId: number) => {
        const res = await CartService.cartControllerRemoveItem(adminId, listingId);
        set({ cartItems: res.items });
      },

      clearCart: async (adminId: number) => {
        const res = await CartService.cartControllerClearCart(adminId);
        set({ cartItems: res.items });
      },

      deleteCart: async (adminId: number) => {
        await CartService.cartControllerDeleteCart(adminId);
        set({ cartItems: [] });
      },

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),

      reset: () => set(store.getInitialState()),
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

  if (data?.url) {
    window.location.href = data.url;
  }
};

export { resetAllStores };
