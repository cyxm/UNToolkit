import { create } from 'zustand';
// @ts-ignore
import { Graph as X6Graph } from '@antv/x6';

export interface GraphState {
  graph: X6Graph | null;
  isLoading: boolean;
  zoom: number;
  setGraph: (graph: X6Graph | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  centerContent: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  graph: null,
  isLoading: false,
  zoom: 1.0,
  setGraph: (graph) => {
    set({ graph });
    if (graph) {
      // 监听缩放事件
      graph.on('scale', (params) => {
        // 确保正确获取缩放值
        let scaleValue = 1.0;
        if (typeof params === 'object' && params !== null) {
          scaleValue = params.scale || params.factor || 1.0;
        } else if (typeof params === 'number') {
          scaleValue = params;
        }
        set({ zoom: scaleValue });
      });
    }
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setZoom: (zoom) => set({ zoom }),
  zoomIn: () => {
    const { graph } = get();
    if (graph) {
      graph.zoom({ factor: 1.1 });
    }
  },
  zoomOut: () => {
    const { graph } = get();
    if (graph) {
      graph.zoom({ factor: 0.9 });
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
