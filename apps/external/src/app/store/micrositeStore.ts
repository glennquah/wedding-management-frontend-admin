import type { CreateMicrositeDto } from '@shared/api';
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

const emptyForm = (weddingId?: number): CreateMicrositeDto => ({
  templateNumber: 1,
  slug: '',
  coupleName: '',
  heroImages: [],
  imageGallery: [],
  schedule: [{ time: '', title: '', description: '' }],
  faqs: [{ q: '', a: '' }],
  password: '',
  weddingId: weddingId ?? 0,
});

export const createEmptyMicrositeForm = emptyForm;

type DraftState = {
  formData: CreateMicrositeDto;
  dirty: boolean;
  modifiedFields: (keyof CreateMicrositeDto | string)[];
  originalData: CreateMicrositeDto | null;
};

interface MicrositeFormState {
  // Drafts keyed by weddingId
  drafts: Record<number, DraftState>;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  ensureDraft: (weddingId: number) => void;
  setFormData: (weddingId: number, data: CreateMicrositeDto) => void;
  patchFormData: (weddingId: number, patch: Partial<CreateMicrositeDto>) => void;
  updateFormData: (
    weddingId: number,
    updater: (prev: CreateMicrositeDto) => CreateMicrositeDto,
  ) => void;
  resetFormData: (weddingId: number) => void;
  setDirty: (weddingId: number, v: boolean) => void;
  clearDirty: (weddingId: number) => void;
  ingestServerData: (
    weddingId: number,
    data: CreateMicrositeDto,
    opts?: { force?: boolean },
  ) => void;
}

export const useMicrositeFormStore = create<MicrositeFormState>()(
  persist(
    (set) => ({
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
                formData: emptyForm(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              },
            },
          };
        }),

      setFormData: (weddingId, data) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [weddingId]: {
              ...(s.drafts[weddingId] ?? {
                formData: emptyForm(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              }),
              formData: data,
            },
          },
        })),

      patchFormData: (weddingId, patch) =>
        set((s) => {
          const prevDraft =
            s.drafts[weddingId] ??
            ({
              formData: emptyForm(weddingId),
              dirty: false,
              modifiedFields: [],
              originalData: null,
            } as DraftState);
          const prev = prevDraft.formData;
          const next = { ...prev, ...patch } as CreateMicrositeDto;
          const touched: (keyof CreateMicrositeDto | string)[] = [];
          for (const key of Object.keys(patch) as (keyof CreateMicrositeDto)[]) {
            if (prev[key] !== next[key]) touched.push(key);
          }
          return {
            drafts: {
              ...s.drafts,
              [weddingId]: {
                ...prevDraft,
                formData: next,
                dirty: prevDraft.dirty || touched.length > 0,
                modifiedFields: Array.from(
                  new Set([...(prevDraft.modifiedFields || []), ...touched]),
                ),
              },
            },
          };
        }),

      updateFormData: (weddingId, updater) =>
        set((s) => {
          const prevDraft =
            s.drafts[weddingId] ??
            ({
              formData: emptyForm(weddingId),
              dirty: false,
              modifiedFields: [],
              originalData: null,
            } as DraftState);
          const prev = prevDraft.formData;
          const next = updater(prev);
          const touched: (keyof CreateMicrositeDto | string)[] = [];
          for (const k of Object.keys(next) as (keyof CreateMicrositeDto)[]) {
            if (prev[k] !== next[k]) touched.push(k);
          }
          return {
            drafts: {
              ...s.drafts,
              [weddingId]: {
                ...prevDraft,
                formData: next,
                dirty: prevDraft.dirty || touched.length > 0,
                modifiedFields: Array.from(
                  new Set([...(prevDraft.modifiedFields || []), ...touched]),
                ),
              },
            },
          };
        }),

      resetFormData: (weddingId) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [weddingId]: {
              formData: emptyForm(weddingId),
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
                formData: emptyForm(weddingId),
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
                formData: emptyForm(weddingId),
                dirty: false,
                modifiedFields: [],
                originalData: null,
              }),
              dirty: false,
              modifiedFields: [],
            },
          },
        })),

      ingestServerData: (weddingId, data, opts) =>
        set((s) => {
          const prevDraft =
            s.drafts[weddingId] ??
            ({
              formData: emptyForm(weddingId),
              dirty: false,
              modifiedFields: [],
              originalData: null,
            } as DraftState);
          const force = opts?.force;
          if (!prevDraft.dirty || force) {
            return {
              drafts: {
                ...s.drafts,
                [weddingId]: {
                  ...prevDraft,
                  formData: data,
                  originalData: data,
                  dirty: false,
                  modifiedFields: [],
                },
              },
            };
          }
          // Preserve only the fields the user modified locally, overlaying them on server data
          const overrideKeys = (
            Object.keys(prevDraft.formData) as (keyof CreateMicrositeDto)[]
          ).filter((k) => prevDraft.modifiedFields.includes(k as string));
          const overrides = overrideKeys.reduce(
            (acc, k) => ({
              ...acc,
              [k]: prevDraft.formData[k],
            }),
            {} as Partial<CreateMicrositeDto>,
          );
          const merged: CreateMicrositeDto = { ...data, ...overrides };
          return {
            drafts: {
              ...s.drafts,
              [weddingId]: {
                ...prevDraft,
                formData: merged,
                originalData: data,
              },
            },
          };
        }),
    }),
    {
      name: 'microsite-form-v1',
      version: 1,
      partialize: (state) => {
        const drafts: Record<
          number,
          {
            formData: CreateMicrositeDto;
            dirty: boolean;
            modifiedFields: (keyof CreateMicrositeDto | string)[];
          }
        > = {};
        for (const [idStr, draft] of Object.entries(state.drafts)) {
          const id = Number(idStr);
          if (Number.isNaN(id)) continue;
          drafts[id] = {
            formData: { ...draft.formData, password: '' },
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
