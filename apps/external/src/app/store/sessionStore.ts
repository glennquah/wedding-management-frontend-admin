import { getCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';

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
}

export const useSessionStore = create<SessionState>((set) => ({
  name: "",
  email: "",
  password: "",
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
}));

export const initSessionFromCookie = () => {
  const token = getCookie('session_token') as string | undefined;
  if (token) {
    useSessionStore.getState().setToken(token);
  }
};
