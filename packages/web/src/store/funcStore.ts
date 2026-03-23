import { create } from 'zustand';

export enum PageState {
  loading,
  loaded
}

export interface FuncState {
  pageState: PageState;
  setPageState: (pageState: PageState) => void;
}

export const useFuncStore = create<FuncState>((set) => ({
  pageState: PageState.loading,
  setPageState: (pageState) => set({ pageState }),
}));
