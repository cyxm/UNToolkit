import { create } from 'zustand';
// @ts-ignore
import { Graph as X6Graph } from '@antv/x6';

export interface GraphState {
  graph: X6Graph | null;
  isLoading: boolean;
  setGraph: (graph: X6Graph | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  centerContent: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  graph: null,
  isLoading: false,
  setGraph: (graph) => set({ graph }),
  setIsLoading: (isLoading) => set({ isLoading }),
  zoomIn: () => {
    const { graph } = get();
    if (graph) {
      graph.zoom(0.1);
    }
  },
  zoomOut: () => {
    const { graph } = get();
    if (graph) {
      graph.zoom(-0.1);
    }
  },
  zoomToFit: () => {
    const { graph } = get();
    if (graph) {
      graph.zoomToFit({ padding: 20 });
    }
  },
  centerContent: () => {
    const { graph } = get();
    if (graph) {
      graph.centerContent();
    }
  },
}));
