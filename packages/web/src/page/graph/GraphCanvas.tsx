import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Graph, Selection, Transform, Snapline } from '@antv/x6';
import { useGraphDataStore } from './graphDataStore.js';
import { useGraphStore } from './graphStore.js';
import { fileService } from '@/services/serviceFactory.js';

Graph.registerNode('triangle', {
  inherit: 'polygon',
  attrs: {
    body: {
      refPoints: '30,0 60,60 0,60',
    },
  },
});

Graph.registerNode('diamond', {
  inherit: 'polygon',
  attrs: {
    body: {
      refPoints: '30,0 60,40 30,80 0,40',
    },
  },
});

Graph.registerNode('pentagon', {
  inherit: 'polygon',
  attrs: {
    body: {
      refPoints: '30,0 60,22 48,60 12,60 0,22',
    },
  },
});

Graph.registerNode('hexagon', {
  inherit: 'polygon',
  attrs: {
    body: {
      refPoints: '15,0 45,0 60,30 45,60 15,60 0,30',
    },
  },
});

Graph.registerNode('star', {
  inherit: 'polygon',
  attrs: {
    body: {
      refPoints: '30,0 36,22 60,22 42,36 48,60 30,46 12,60 18,36 0,22 24,22',
    },
  },
});

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const { graphData, selectedNodeId, selectNode, selectEdge, addNode, updateNode, setGraphData, setFileName, setCollectionName } = useGraphDataStore();
  const { setGraph, setZoom } = useGraphStore();

  // 自动加载上次打开的图形
  useEffect(() => {
    const loadLastOpenedFile = async () => {
      try {
        // 先尝试加载上次打开的图形集
        const collections = await fileService.listCollections();
        if (collections.length > 0) {
          // 获取最近使用的图形集
          const lastOpened = localStorage.getItem('lastOpenedFile');
          if (lastOpened) {
            const parsed = JSON.parse(lastOpened);
            if (parsed.type === 'collection' && parsed.collection && parsed.name) {
              const data = await fileService.loadFromCollection(parsed.collection, parsed.name);
              if (data) {
                setGraphData(data);
                setFileName(parsed.name);
                setCollectionName(parsed.collection);
                return;
              }
            } else if (parsed.type === 'file' && parsed.name) {
              const data = await fileService.load(parsed.name);
              if (data) {
                setGraphData(data);
                setFileName(parsed.name);
                setCollectionName('');
                return;
              }
            }
          }

          // 如果没有上次打开的记录，加载最近使用的图形集的main.json文件
          const recentCollection = collections[0];
          const files = await fileService.listFilesInCollection(recentCollection.name);
          if (files.includes('main.json')) {
            const data = await fileService.loadFromCollection(recentCollection.name, 'main.json');
            if (data) {
              setGraphData(data);
              setFileName('main.json');
              setCollectionName(recentCollection.name);
              return;
            }
          } else if (files.length > 0) {
            // 如果没有main.json，加载第一个文件
            const data = await fileService.loadFromCollection(recentCollection.name, files[0]);
            if (data) {
              setGraphData(data);
              setFileName(files[0]);
              setCollectionName(recentCollection.name);
              return;
            }
          }
        }
      } catch (error) {
        console.error('加载上次文件失败:', error);
      }
    };

    loadLastOpenedFile();
  }, [setGraphData, setFileName, setCollectionName]);

  // 初始化和管理Graph实例
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建Graph实例
    const graph = new Graph({
      container: containerRef.current,
      grid: true,
      panning: true,
      mousewheel: true,
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        snap: true,
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#47C769',
              strokeWidth: 4,
            },
          },
        },
      },
    });

    // 使用插件
    graph.use(
      new Selection({
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
        showEdgeSelectionBox: true,
        movable: true,
      }),
    );

    graph.use(
      new Transform({
        resizing: {
          enabled: true,
          minWidth: 20,
          minHeight: 20,
          maxWidth: 500,
          maxHeight: 500,
          orthogonal: true,
          restricted: false,
          autoScroll: true,
          preserveAspectRatio: false,
          allowReverse: true,
        },
        rotating: {
          enabled: false,
        },
      }),
    );

    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      }),
    );

    // 设置缩放状态
    setZoom(graph.zoom());

    // 事件监听
    graph.on('node:click', ({ node }: any) => {
      selectNode(node.id);
      selectEdge(null);
    });

    graph.on('edge:click', ({ edge }: any) => {
      selectEdge(edge.id);
      selectNode(null);
    });

    graph.on('blank:click', () => {
      selectNode(null);
      selectEdge(null);
    });

    graph.on('node:moved', ({ node }: any) => {
      updateNode(node.id, {
        x: node.position().x,
        y: node.position().y,
      });
    });

    graph.on('node:resized', ({ node }: any) => {
      const size = node.size();
      updateNode(node.id, {
        width: size.width,
        height: size.height,
      });
    });

    // 存储Graph实例
    graphRef.current = graph;
    setGraph(graph);

    // 清理函数
    return () => {
      graph.dispose();
      graphRef.current = null;
      setGraph(null);
    };
  }, [setGraph, setZoom, selectNode, selectEdge, updateNode]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    // 防御性检查：确保 graphData 存在且包含 nodes 和 edges 属性
    if (!graphData || !Array.isArray(graphData.nodes) || !Array.isArray(graphData.edges)) {
      return;
    }

    const existingNodes = graph.getNodes();
    const existingEdges = graph.getEdges();

    const existingNodeIds = new Set(existingNodes.map((node: any) => node.id));
    const existingEdgeIds = new Set(existingEdges.map((edge: any) => edge.id));

    graphData.nodes.forEach((node) => {
      if (!existingNodeIds.has(node.id)) {
        graph.addNode({
          id: node.id,
          shape: node.shape,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          attrs: {
            body: {
              fill: node.fill,
              stroke: node.stroke,
              strokeWidth: node.strokeWidth,
            },
            label: {
              text: node.label,
              fill: '#333',
            },
          },
        });
      }
    });

    graphData.edges.forEach((edge) => {
      if (!existingEdgeIds.has(edge.id)) {
        graph.addEdge({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          attrs: {
            line: {
              stroke: edge.stroke,
              strokeWidth: edge.strokeWidth,
            },
          },
        });
      }
    });

    existingNodes.forEach((node: any) => {
      if (!graphData.nodes.find((n) => n.id === node.id)) {
        graph.removeNode(node.id);
      }
    });

    existingEdges.forEach((edge: any) => {
      if (!graphData.edges.find((e) => e.id === edge.id)) {
        graph.removeEdge(edge.id);
      }
    });
  }, [graphData]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    // 防御性检查：确保 graphData 存在且包含 nodes 属性
    if (!graphData || !Array.isArray(graphData.nodes)) {
      return;
    }

    graph.getNodes().forEach((node: any) => {
      const isSelected = selectedNodeId === node.id;
      if (isSelected) {
        node.setAttrs({
          body: {
            strokeDasharray: 5,
            strokeWidth: 3,
          },
        });
      } else {
        const nodeData = graphData.nodes.find((n) => n.id === node.id);
        if (nodeData) {
          node.setAttrs({
            body: {
              strokeDasharray: 0,
              strokeWidth: nodeData.strokeWidth,
            },
          });
        }
      }
    });
  }, [selectedNodeId, graphData.nodes]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const shapeData = e.dataTransfer.getData('shape');
    if (!shapeData) return;

    const shape = JSON.parse(shapeData);
    const graph = graphRef.current;
    if (!graph) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const newNode = {
      id: `node-${Date.now()}`,
      label: shape.name,
      x: x,
      y: y,
      width: shape.width,
      height: shape.height,
      shape: shape.shape,
      fill: '#e3f2fd',
      stroke: '#1976d2',
      strokeWidth: 2,
    };

    addNode(newNode);
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffffc5',
      }}
    />
  );
}
