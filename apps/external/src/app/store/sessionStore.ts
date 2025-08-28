import { create } from "zustand";
import { setCookie, getCookie } from "cookies-next";

interface SessionState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  setToken: (token: string) => {
    set({ token });
    setCookie("session_token", token, { path: "/", maxAge: 60 * 60 * 24 }); // 1 day
  },
  clearToken: () => {
    set({ token: null });
    setCookie("session_token", "", { path: "/", maxAge: 0 });
  },
}));

export const initSessionFromCookie = () => {
  const token = getCookie("session_token") as string | undefined;
  if (token) {
    useSessionStore.getState().setToken(token);
  }
};
