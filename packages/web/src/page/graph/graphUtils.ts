import { GraphNode, GraphEdge, GraphData } from './types.js';

export function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateEdgeId(): string {
  return `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createNode(
  label: string,
  x: number,
  y: number,
  options?: Partial<GraphNode>
): GraphNode {
  return {
    id: generateNodeId(),
    label,
    x,
    y,
    width: 100,
    height: 40,
    shape: 'rect',
    fill: '#f5f5f5',
    stroke: '#333',
    strokeWidth: 1,
    ...options,
  };
}

export function createEdge(
  source: string,
  target: string,
  options?: Partial<GraphEdge>
): GraphEdge {
  return {
    id: generateEdgeId(),
    source,
    target,
    stroke: '#333',
    strokeWidth: 1,
    ...options,
  };
}

export function findNodeById(data: GraphData, id: string): GraphNode | undefined {
  return data.nodes.find((node) => node.id === id);
}

export function findEdgeById(data: GraphData, id: string): GraphEdge | undefined {
  return data.edges.find((edge) => edge.id === id);
}

export function findEdgesByNode(data: GraphData, nodeId: string): GraphEdge[] {
  return data.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

export function findConnectedNodes(data: GraphData, nodeId: string): GraphNode[] {
  const connectedEdges = findEdgesByNode(data, nodeId);
  const connectedNodeIds = new Set<string>();
  
  connectedEdges.forEach((edge) => {
    if (edge.source === nodeId) {
      connectedNodeIds.add(edge.target);
    } else if (edge.target === nodeId) {
      connectedNodeIds.add(edge.source);
    }
  });
  
  return data.nodes.filter((node) => connectedNodeIds.has(node.id));
}

export function validateGraph(data: GraphData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const nodeIds = new Set(data.nodes.map((node) => node.id));
  
  data.edges.forEach((edge) => {
    if (!nodeIds.has(edge.source)) {
      errors.push(`边 ${edge.id} 的源节点 ${edge.source} 不存在`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`边 ${edge.id} 的目标节点 ${edge.target} 不存在`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function cloneGraph(data: GraphData): GraphData {
  return {
    nodes: data.nodes.map((node) => ({ ...node })),
    edges: data.edges.map((edge) => ({ ...edge })),
  };
}
