import { GraphNode, GraphEdge, GraphData } from './types.js';

export type LayoutType = 'tree' | 'force' | 'grid' | 'circular' | 'hierarchical';

export interface LayoutOptions {
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  spacing?: number;
  centerX?: number;
  centerY?: number;
}

/**
 * 构建图的邻接表结构
 */
function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  
  nodes.forEach(node => {
    adj.set(node.id, []);
  });
  
  edges.forEach(edge => {
    const neighbors = adj.get(edge.source) || [];
    neighbors.push(edge.target);
    adj.set(edge.source, neighbors);
  });
  
  return adj;
}

/**
 * 查找根节点（没有入边的节点）
 */
function findRootNodes(nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const hasIncoming = new Set<string>();
  edges.forEach(edge => hasIncoming.add(edge.target));
  return nodes.filter(node => !hasIncoming.has(node.id)).map(node => node.id);
}

/**
 * 树形布局 - 适用于有层次结构的图
 */
export function treeLayout(data: GraphData, options: LayoutOptions = {}): GraphNode[] {
  const { 
    nodeWidth = 120, 
    nodeHeight = 60, 
    spacing = 50,
    centerX = 400,
    centerY = 100 
  } = options;
  
  const adj = buildAdjacencyList(data.nodes, data.edges);
  const roots = findRootNodes(data.nodes, data.edges);
  
  // 如果没有根节点，使用第一个节点作为根
  const rootIds = roots.length > 0 ? roots : [data.nodes[0]?.id].filter(Boolean);
  
  const nodePositions = new Map<string, { x: number; y: number }>();
  const visited = new Set<string>();
  
  function calculateSubtreeWidth(nodeId: string): number {
    if (visited.has(nodeId)) return nodeWidth;
    visited.add(nodeId);
    
    const children = adj.get(nodeId) || [];
    if (children.length === 0) return nodeWidth;
    
    let totalWidth = 0;
    children.forEach((childId, index) => {
      totalWidth += calculateSubtreeWidth(childId);
      if (index < children.length - 1) totalWidth += spacing;
    });
    
    return Math.max(nodeWidth, totalWidth);
  }
  
  function layoutNode(nodeId: string, x: number, y: number): void {
    nodePositions.set(nodeId, { x, y });
    
    const children = adj.get(nodeId) || [];
    if (children.length === 0) return;
    
    // 重新计算子树宽度
    visited.clear();
    let currentX = x;
    
    children.forEach((childId) => {
      visited.clear();
      const childWidth = calculateSubtreeWidth(childId);
      layoutNode(childId, currentX + childWidth / 2, y + nodeHeight + spacing);
      currentX += childWidth + spacing;
    });
  }
  
  // 布局每个根节点
  let currentRootX = centerX;
  rootIds.forEach((rootId) => {
    visited.clear();
    const rootWidth = calculateSubtreeWidth(rootId);
    layoutNode(rootId, currentRootX, centerY);
    currentRootX += rootWidth + spacing * 2;
  });
  
  return data.nodes.map(node => ({
    ...node,
    x: nodePositions.get(node.id)?.x ?? node.x,
    y: nodePositions.get(node.id)?.y ?? node.y,
  }));
}

/**
 * 力导向布局 - 模拟物理引力和斥力
 */
export function forceLayout(data: GraphData, options: LayoutOptions = {}): GraphNode[] {
  const {
    width = 800,
    height = 600,
    spacing = 100,
  } = options;
  
  const nodes = data.nodes.map(n => ({ ...n }));
  const edges = data.edges;
  
  if (nodes.length === 0) return nodes;
  
  // 初始化随机位置
  nodes.forEach(node => {
    node.x = width / 2 + (Math.random() - 0.5) * 200;
    node.y = height / 2 + (Math.random() - 0.5) * 200;
  });
  
  const iterations = 100;
  const k = Math.sqrt((width * height) / nodes.length) * 0.8; // 理想边长
  const temperature = width / 10;
  const cooling = 0.95;
  
  let currentTemp = temperature;
  
  for (let iter = 0; iter < iterations; iter++) {
    // 计算斥力
    const forces = nodes.map(() => ({ fx: 0, fy: 0 }));
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const force = (k * k) / dist;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        forces[i].fx += fx;
        forces[i].fy += fy;
        forces[j].fx -= fx;
        forces[j].fy -= fy;
      }
    }
    
    // 计算引力（边的拉力）
    edges.forEach(edge => {
      const sourceIdx = nodes.findIndex(n => n.id === edge.source);
      const targetIdx = nodes.findIndex(n => n.id === edge.target);
      
      if (sourceIdx >= 0 && targetIdx >= 0) {
        const dx = nodes[targetIdx].x - nodes[sourceIdx].x;
        const dy = nodes[targetIdx].y - nodes[sourceIdx].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const force = (dist * dist) / k;
        const fx = (dx / dist) * force * 0.1;
        const fy = (dy / dist) * force * 0.1;
        
        forces[sourceIdx].fx += fx;
        forces[sourceIdx].fy += fy;
        forces[targetIdx].fx -= fx;
        forces[targetIdx].fy -= fy;
      }
    });
    
    // 应用力并限制温度
    nodes.forEach((node, i) => {
      const dist = Math.sqrt(forces[i].fx ** 2 + forces[i].fy ** 2) || 1;
      const scale = Math.min(dist, currentTemp) / dist;
      
      node.x += forces[i].fx * scale;
      node.y += forces[i].fy * scale;
      
      // 保持在边界内
      node.x = Math.max(50, Math.min(width - 50, node.x));
      node.y = Math.max(50, Math.min(height - 50, node.y));
    });
    
    currentTemp *= cooling;
  }
  
  return nodes;
}

/**
 * 网格布局 - 将节点排列成网格
 */
export function gridLayout(data: GraphData, options: LayoutOptions = {}): GraphNode[] {
  const {
    nodeWidth = 120,
    nodeHeight = 60,
    spacing = 50,
    centerX = 400,
    centerY = 300,
  } = options;
  
  const nodes = data.nodes;
  if (nodes.length === 0) return [];
  
  // 计算网格尺寸
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const totalWidth = cols * (nodeWidth + spacing) - spacing;
  const totalHeight = Math.ceil(nodes.length / cols) * (nodeHeight + spacing) - spacing;
  
  const startX = centerX - totalWidth / 2 + nodeWidth / 2;
  const startY = centerY - totalHeight / 2 + nodeHeight / 2;
  
  return nodes.map((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    return {
      ...node,
      x: startX + col * (nodeWidth + spacing),
      y: startY + row * (nodeHeight + spacing),
    };
  });
}

/**
 * 环形布局 - 将节点排列成圆形
 */
export function circularLayout(data: GraphData, options: LayoutOptions = {}): GraphNode[] {
  const {
    centerX = 400,
    centerY = 300,
    spacing = 150,
  } = options;
  
  const nodes = data.nodes;
  if (nodes.length === 0) return [];
  
  const radius = Math.max(spacing * 2, (nodes.length * spacing) / (2 * Math.PI));
  const angleStep = (2 * Math.PI) / nodes.length;
  
  return nodes.map((node, index) => {
    const angle = index * angleStep - Math.PI / 2; // 从顶部开始
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

/**
 * 层次布局 - 按层级排列节点
 */
export function hierarchicalLayout(data: GraphData, options: LayoutOptions = {}): GraphNode[] {
  const {
    nodeWidth = 120,
    nodeHeight = 60,
    spacing = 80,
    centerX = 400,
    centerY = 100,
  } = options;
  
  const adj = buildAdjacencyList(data.nodes, data.edges);
  const reverseAdj = new Map<string, string[]>();
  
  data.nodes.forEach(node => reverseAdj.set(node.id, []));
  data.edges.forEach(edge => {
    const neighbors = reverseAdj.get(edge.target) || [];
    neighbors.push(edge.source);
    reverseAdj.set(edge.target, neighbors);
  });
  
  // 计算每个节点的层级
  const levels = new Map<string, number>();
  const visited = new Set<string>();
  
  function calculateLevel(nodeId: string): number {
    if (levels.has(nodeId)) return levels.get(nodeId)!;
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);
    
    const parents = reverseAdj.get(nodeId) || [];
    if (parents.length === 0) {
      levels.set(nodeId, 0);
      return 0;
    }
    
    const parentLevels = parents.map(p => calculateLevel(p));
    const level = Math.max(...parentLevels) + 1;
    levels.set(nodeId, level);
    return level;
  }
  
  data.nodes.forEach(node => calculateLevel(node.id));
  
  // 按层级分组
  const levelGroups = new Map<number, string[]>();
  levels.forEach((level, nodeId) => {
    const group = levelGroups.get(level) || [];
    group.push(nodeId);
    levelGroups.set(level, group);
  });
  
  // 布局节点
  const nodePositions = new Map<string, { x: number; y: number }>();
  
  levelGroups.forEach((nodeIds, level) => {
    const y = centerY + level * (nodeHeight + spacing);
    const totalWidth = nodeIds.length * nodeWidth + (nodeIds.length - 1) * spacing;
    const startX = centerX - totalWidth / 2 + nodeWidth / 2;
    
    nodeIds.forEach((nodeId, index) => {
      nodePositions.set(nodeId, {
        x: startX + index * (nodeWidth + spacing),
        y,
      });
    });
  });
  
  return data.nodes.map(node => ({
    ...node,
    x: nodePositions.get(node.id)?.x ?? node.x,
    y: nodePositions.get(node.id)?.y ?? node.y,
  }));
}

/**
 * 应用布局
 */
export function applyLayout(
  data: GraphData,
  layoutType: LayoutType,
  options?: LayoutOptions
): GraphNode[] {
  switch (layoutType) {
    case 'tree':
      return treeLayout(data, options);
    case 'force':
      return forceLayout(data, options);
    case 'grid':
      return gridLayout(data, options);
    case 'circular':
      return circularLayout(data, options);
    case 'hierarchical':
      return hierarchicalLayout(data, options);
    default:
      return data.nodes;
  }
}
