import React from 'react';
import { Box, Stack } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import GraphToolbar from './GraphToolbar.js';
import GraphCanvas from './GraphCanvas.js';
import GraphProperties from './GraphProperties.js';
import GraphSidebar from './GraphSidebar.js';

export default function Graph() {
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
      <PanelGroup direction="horizontal" style={{ flexGrow: 1 }}>
        <Panel defaultSize={15} minSize={10} maxSize={25}>
          <GraphSidebar />
        </Panel>
        <PanelResizeHandle style={{ width: 4, backgroundColor: '#e0e0e0' }} />
        <Panel defaultSize={65} minSize={40}>
          <GraphCanvas />
        </Panel>
        <PanelResizeHandle style={{ width: 4, backgroundColor: '#e0e0e0' }} />
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <GraphProperties />
        </Panel>
      </PanelGroup>
    </Stack>
  );
}
