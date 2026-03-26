import React, { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import GraphToolbar from './GraphToolbar.js';
import GraphCanvas from './GraphCanvas.js';
import { useGraphDataStore } from './graphDataStore.js';

export default function Graph() {
  const { addNode, addEdge } = useGraphDataStore();

  useEffect(() => {
    addNode({
      id: 'node1',
      label: '开始',
      x: 100,
      y: 100,
      width: 100,
      height: 40,
      shape: 'rect',
      fill: '#f5f5f5',
      stroke: '#333',
      strokeWidth: 1,
    });

    addNode({
      id: 'node2',
      label: '处理',
      x: 300,
      y: 100,
      width: 100,
      height: 40,
      shape: 'rect',
      fill: '#e3f2fd',
      stroke: '#1976d2',
      strokeWidth: 1,
    });

    addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      stroke: '#333',
      strokeWidth: 1,
    });
  }, []);

  return (
    <Stack
      direction="column"
      sx={{
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <GraphToolbar />
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <GraphCanvas />
      </Box>
    </Stack>
  );
}
