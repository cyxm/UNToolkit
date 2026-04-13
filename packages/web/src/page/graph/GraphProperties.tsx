import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Paper,
} from '@mui/material';
import { useGraphDataStore } from './graphDataStore.js';

export default function GraphProperties() {
  const {
    selectedNodeId,
    selectedEdgeId,
    graphData,
    updateNode,
    updateEdge,
  } = useGraphDataStore();

  const selectedNode = selectedNodeId
    ? graphData.nodes.find((n) => n.id === selectedNodeId)
    : null;
  const selectedEdge = selectedEdgeId
    ? graphData.edges.find((e) => e.id === selectedEdgeId)
    : null;

  const handleNodeChange = (field: string, value: any) => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, { [field]: value });
    }
  };

  const handleEdgeChange = (field: string, value: any) => {
    if (selectedEdgeId) {
      updateEdge(selectedEdgeId, { [field]: value });
    }
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <Box
        sx={{
          width: 250,
          height: '100%',
          p: 2,
          borderLeft: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          未选择任何元素
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          点击画布中的节点或连线查看属性
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 250,
        height: '100%',
        p: 2,
        borderLeft: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        overflow: 'auto',
      }}
    >
      {selectedNode && (
        <Stack spacing={2}>
          <Typography variant="h6">节点属性</Typography>
          <Divider />

          <TextField
            label="ID"
            value={selectedNode.id}
            disabled
            size="small"
            fullWidth
          />

          <TextField
            label="名称"
            value={selectedNode.label}
            onChange={(e) => handleNodeChange('label', e.target.value)}
            size="small"
            fullWidth
          />

          <FormControl size="small" fullWidth>
            <InputLabel>形状</InputLabel>
            <Select
              value={selectedNode.shape}
              label="形状"
              onChange={(e) => handleNodeChange('shape', e.target.value)}
            >
              <MenuItem value="rect">矩形</MenuItem>
              <MenuItem value="circle">圆形</MenuItem>
              <MenuItem value="ellipse">椭圆</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="X 坐标"
            type="number"
            value={selectedNode.x}
            onChange={(e) => handleNodeChange('x', Number(e.target.value))}
            size="small"
            fullWidth
          />

          <TextField
            label="Y 坐标"
            type="number"
            value={selectedNode.y}
            onChange={(e) => handleNodeChange('y', Number(e.target.value))}
            size="small"
            fullWidth
          />

          <TextField
            label="宽度"
            type="number"
            value={selectedNode.width}
            onChange={(e) => handleNodeChange('width', Number(e.target.value))}
            size="small"
            fullWidth
          />

          <TextField
            label="高度"
            type="number"
            value={selectedNode.height}
            onChange={(e) => handleNodeChange('height', Number(e.target.value))}
            size="small"
            fullWidth
          />

          <Divider />

          <Typography variant="subtitle2">样式</Typography>

          <TextField
            label="填充颜色"
            type="color"
            value={selectedNode.fill}
            onChange={(e) => handleNodeChange('fill', e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="边框颜色"
            type="color"
            value={selectedNode.stroke}
            onChange={(e) => handleNodeChange('stroke', e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="边框宽度"
            type="number"
            value={selectedNode.strokeWidth}
            onChange={(e) =>
              handleNodeChange('strokeWidth', Number(e.target.value))
            }
            size="small"
            fullWidth
          />
        </Stack>
      )}

      {selectedEdge && (
        <Stack spacing={2}>
          <Typography variant="h6">连线属性</Typography>
          <Divider />

          <TextField
            label="ID"
            value={selectedEdge.id}
            disabled
            size="small"
            fullWidth
          />

          <TextField
            label="源节点"
            value={selectedEdge.source}
            disabled
            size="small"
            fullWidth
          />

          <TextField
            label="目标节点"
            value={selectedEdge.target}
            disabled
            size="small"
            fullWidth
          />

          <Divider />

          <Typography variant="subtitle2">样式</Typography>

          <TextField
            label="线条颜色"
            type="color"
            value={selectedEdge.stroke}
            onChange={(e) => handleEdgeChange('stroke', e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="线条宽度"
            type="number"
            value={selectedEdge.strokeWidth}
            onChange={(e) =>
              handleEdgeChange('strokeWidth', Number(e.target.value))
            }
            size="small"
            fullWidth
          />
        </Stack>
      )}
    </Box>
  );
}
