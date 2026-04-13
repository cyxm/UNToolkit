import { create } from 'zustand';
import { GraphNode, GraphEdge, GraphData, GraphType } from './types.js';
import { LayoutType, applyLayout, LayoutOptions } from './layoutUtils.js';

export interface GraphDataState {
  graphData: GraphData;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  fileName: string;
  collectionName: string;
  setGraphData: (data: GraphData) => void;
  setFileName: (name: string) => void;
  setCollectionName: (name: string) => void;
  addNode: (node: GraphNode) => void;
  updateNode: (id: string, updates: Partial<GraphNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: GraphEdge) => void;
  updateEdge: (id: string, updates: Partial<GraphEdge>) => void;
  deleteEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearGraph: () => void;
  applyLayout: (layoutType: LayoutType, options?: LayoutOptions) => void;
  updateGraphType: (type: GraphType) => void;
}

export const useGraphDataStore = create<GraphDataState>((set) => ({
  graphData: {
    nodes: [],
    edges: [],
  },
  selectedNodeId: null,
  selectedEdgeId: null,
  fileName: '',
  collectionName: '',
  setGraphData: (data) => set({ graphData: data }),
  setFileName: (name) => set({ fileName: name }),
  setCollectionName: (name) => set({ collectionName: name }),
  addNode: (node) => set((state) => ({
    graphData: {
      ...state.graphData,
      nodes: [...state.graphData.nodes, node],
    },
  })),
  updateNode: (id, updates) => set((state) => ({
    graphData: {
      ...state.graphData,
      nodes: state.graphData.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    },
  })),
  deleteNode: (id) => set((state) => ({
    graphData: {
      ...state.graphData,
      nodes: state.graphData.nodes.filter((node) => node.id !== id),
      edges: state.graphData.edges.filter((edge) => edge.source !== id && edge.target !== id),
    },
  })),
  addEdge: (edge) => set((state) => ({
    graphData: {
      ...state.graphData,
      edges: [...state.graphData.edges, edge],
    },
  })),
  updateEdge: (id, updates) => set((state) => ({
    graphData: {
      ...state.graphData,
      edges: state.graphData.edges.map((edge) =>
        edge.id === id ? { ...edge, ...updates } : edge
      ),
    },
  })),
  deleteEdge: (id) => set((state) => ({
    graphData: {
      ...state.graphData,
      edges: state.graphData.edges.filter((edge) => edge.id !== id),
    },
  })),
  selectNode: (id) => set({ selectedNodeId: id }),
  selectEdge: (id) => set({ selectedEdgeId: id }),
  clearGraph: () => set({
    graphData: {
      nodes: [],
      edges: [],
    },
    selectedNodeId: null,
    selectedEdgeId: null,
    fileName: '',
    collectionName: '',
  }),
  applyLayout: (layoutType, options) => set((state) => {
    const newNodes = applyLayout(state.graphData, layoutType, options);
    return {
      graphData: {
        ...state.graphData,
        nodes: newNodes,
      },
    };
  }),
  updateGraphType: (type) => set((state) => ({
    graphData: {
      ...state.graphData,
      type,
    },
  })),
}));
