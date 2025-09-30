import type { MicrositeResponseDto } from '@shared/api';
import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';

// Non-persisted, in-memory store to transfer preview payload
export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    return store;
  };
}) as typeof actualCreate;

interface PreviewState {
  data: MicrositeResponseDto | null;
  setData: (data: MicrositeResponseDto) => void;
  clear: () => void;
}

export const useMicrositePreviewStore = create<PreviewState>()((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clear: () => set({ data: null }),
}));
