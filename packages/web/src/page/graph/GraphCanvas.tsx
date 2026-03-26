import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Graph } from '@antv/x6';
import { useGraphDataStore } from './graphDataStore.js';
import { useGraphStore } from './graphStore.js';

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const { graphData } = useGraphDataStore();
  const { setGraph } = useGraphStore();

  useEffect(() => {
    if (!containerRef.current) return;

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

    graphRef.current = graph;
    setGraph(graph);

    return () => {
      graph.dispose();
      graphRef.current = null;
      setGraph(null);
    };
  }, [setGraph]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

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

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fafafa',
      }}
    />
  );
}
