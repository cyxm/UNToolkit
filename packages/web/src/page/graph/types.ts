export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rect' | 'circle' | 'ellipse';
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

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
