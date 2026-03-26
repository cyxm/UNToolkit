import React from 'react';
import { Stack, Button, Divider, IconButton, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useGraphStore } from './graphStore.js';
import { useGraphDataStore } from './graphDataStore.js';

export default function GraphToolbar() {
  const { zoomIn, zoomOut, zoomToFit, centerContent } = useGraphStore();
  const { addNode, addEdge, clearGraph } = useGraphDataStore();

  const [addNodeOpen, setAddNodeOpen] = React.useState(false);
  const [newNodeLabel, setNewNodeLabel] = React.useState('');
  const [newNodeShape, setNewNodeShape] = React.useState<'rect' | 'circle' | 'ellipse'>('rect');

  const handleAddNode = () => {
    if (newNodeLabel) {
      addNode({
        id: `node-${Date.now()}`,
        label: newNodeLabel,
        x: 200 + Math.random() * 400,
        y: 150 + Math.random() * 200,
        width: 100,
        height: 40,
        shape: newNodeShape,
        fill: '#f5f5f5',
        stroke: '#333',
        strokeWidth: 1,
      });
      setNewNodeLabel('');
      setAddNodeOpen(false);
    }
  };

  const handleClear = () => {
    if (confirm('确定要清空画布吗？')) {
      clearGraph();
    }
  };

  const handleSave = () => {
    console.log('保存图数据');
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Tooltip title="添加节点">
          <IconButton size="small" onClick={() => setAddNodeOpen(true)}>
            <AddBoxIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="清空画布">
          <IconButton size="small" onClick={handleClear}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="撤销">
          <IconButton size="small">
            <UndoIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="重做">
          <IconButton size="small">
            <RedoIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="放大">
          <IconButton size="small" onClick={zoomIn}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="缩小">
          <IconButton size="small" onClick={zoomOut}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="适应画布">
          <IconButton size="small" onClick={zoomToFit}>
            <FitScreenIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="居中内容">
          <IconButton size="small" onClick={centerContent}>
            <CenterFocusStrongIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="保存">
          <IconButton size="small" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Dialog open={addNodeOpen} onClose={() => setAddNodeOpen(false)}>
        <DialogTitle>添加节点</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="节点名称"
            fullWidth
            variant="standard"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>节点形状</InputLabel>
            <Select
              value={newNodeShape}
              label="节点形状"
              onChange={(e) => setNewNodeShape(e.target.value as 'rect' | 'circle' | 'ellipse')}
            >
              <MenuItem value="rect">矩形</MenuItem>
              <MenuItem value="circle">圆形</MenuItem>
              <MenuItem value="ellipse">椭圆</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddNodeOpen(false)}>取消</Button>
          <Button onClick={handleAddNode} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
