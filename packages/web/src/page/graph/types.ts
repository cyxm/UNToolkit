export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rect' | 'circle' | 'ellipse' | 'triangle' | 'diamond' | 'pentagon' | 'hexagon' | 'star';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  stroke: string;
  strokeWidth: number;
}

export type GraphType = 
  | 'requirement'
  | 'flowchart'
  | 'architecture'
  | 'mindmap'
  | 'sequence'
  | 'class'
  | 'other';

export const GraphTypeLabels: Record<GraphType, string> = {
  requirement: '需求图',
  flowchart: '流程图',
  architecture: '架构图',
  mindmap: '思维导图',
  sequence: '时序图',
  class: '类图',
  other: '其他',
};

export const GraphTypeColors: Record<GraphType, string> = {
  requirement: '#4caf50',
  flowchart: '#2196f3',
  architecture: '#ff9800',
  mindmap: '#9c27b0',
  sequence: '#00bcd4',
  class: '#f44336',
  other: '#9e9e9e',
};

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  type?: GraphType;
  name?: string;
}
