import React from 'react';
import {
  Stack,
  Button,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Menu,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  Box,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GridOnIcon from '@mui/icons-material/GridOn';
import HubIcon from '@mui/icons-material/Hub';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import LayersIcon from '@mui/icons-material/Layers';
import { useNavigate } from 'react-router-dom';
import { useGraphStore } from './graphStore.js';
import { useGraphDataStore } from './graphDataStore.js';
import { fileService, windowService } from '@/services/serviceFactory.js';
import { env } from '@/services/common/env.js';
import { LayoutType } from './layoutUtils.js';

export default function GraphToolbar() {
  const { zoomIn, zoomOut, zoomToFit, centerContent, zoom } = useGraphStore();
  const { addNode, clearGraph, graphData, setGraphData, fileName, setFileName, collectionName, setCollectionName, applyLayout } = useGraphDataStore();
  const navigate = useNavigate();

  const [addNodeOpen, setAddNodeOpen] = React.useState(false);
  const [newNodeLabel, setNewNodeLabel] = React.useState('');
  const [newNodeShape, setNewNodeShape] = React.useState<'rect' | 'circle' | 'ellipse'>('rect');

  const [fileMenuAnchor, setFileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [layoutMenuAnchor, setLayoutMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = React.useState(false);
  const [savedFiles, setSavedFiles] = React.useState<string[]>([]);

  const refreshFileList = React.useCallback(async () => {
    const files = await fileService.list();
    setSavedFiles(files);
  }, []);

  React.useEffect(() => {
    refreshFileList();
  }, [refreshFileList]);

  const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFileMenuAnchor(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
  };

  const handleLayoutMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLayoutMenuAnchor(event.currentTarget);
  };

  const handleLayoutMenuClose = () => {
    setLayoutMenuAnchor(null);
  };

  const handleApplyLayout = (layoutType: LayoutType) => {
    applyLayout(layoutType, {
      width: 800,
      height: 600,
      centerX: 400,
      centerY: 300,
    });
    handleLayoutMenuClose();
  };

  const handleNew = () => {
    if (confirm('确定要新建吗？未保存的数据将丢失。')) {
      clearGraph();
    }
    handleFileMenuClose();
  };

  const handleSave = () => {
    if (!fileName) {
      setSaveDialogOpen(true);
    } else {
      doSave(fileName);
    }
    handleFileMenuClose();
  };

  const handleSaveAs = () => {
    setSaveDialogOpen(true);
    handleFileMenuClose();
  };

  const doSave = async (name: string) => {
    try {
      await fileService.save(name, graphData, collectionName);
      setFileName(name);
      await refreshFileList();
      alert(`已保存为: ${name}`);
      setSaveDialogOpen(false);
      
      // 保存到本地存储，记录上次打开的文件
      localStorage.setItem('lastOpenedFile', JSON.stringify({
        type: collectionName ? 'collection' : 'file',
        collection: collectionName,
        name,
        timestamp: Date.now()
      }));
    } catch (error: any) {
      if (error?.message !== 'Save cancelled') {
        alert('保存失败: ' + error);
      }
    }
  };

  const handleLoad = () => {
    setLoadDialogOpen(true);
    handleFileMenuClose();
  };

  const doLoad = async (name: string) => {
    try {
      const data = await fileService.load(name);
      if (data) {
        setGraphData(data);
        setFileName(name);
        setCollectionName('');
        alert(`已加载: ${name}`);
        
        // 保存到本地存储，记录上次打开的文件
        localStorage.setItem('lastOpenedFile', JSON.stringify({
          type: 'file',
          name,
          timestamp: Date.now()
        }));
      }
      setLoadDialogOpen(false);
    } catch (error) {
      alert('加载失败: ' + error);
    }
  };

  const handleExport = async () => {
    const name = fileName || 'graph';
    await fileService.exportFile(name, graphData);
    handleFileMenuClose();
  };

  const handleImport = async () => {
    const result = await fileService.importFile();
    if (result) {
      setGraphData(result.data);
      setFileName(result.name);
      setCollectionName('');
      alert(`已导入: ${result.name}`);
    }
    handleFileMenuClose();
  };

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
        <Tooltip title="返回">
          <IconButton size="small" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Button
          size="small"
          onClick={handleFileMenuOpen}
          sx={{ textTransform: 'none', minWidth: 'auto' }}
        >
          文件
        </Button>

        <Menu
          anchorEl={fileMenuAnchor}
          open={Boolean(fileMenuAnchor)}
          onClose={handleFileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleNew}>
            <CreateNewFolderIcon fontSize="small" sx={{ mr: 1 }} />
            新建
          </MenuItem>
          <MenuItem onClick={handleLoad}>
            <FolderOpenIcon fontSize="small" sx={{ mr: 1 }} />
            读取
          </MenuItem>
          <MenuItem onClick={handleSave}>
            <SaveIcon fontSize="small" sx={{ mr: 1 }} />
            保存
          </MenuItem>
          <MenuItem onClick={handleSaveAs}>
            <SaveAsIcon fontSize="small" sx={{ mr: 1 }} />
            另存为
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleImport}>
            <FileUploadIcon fontSize="small" sx={{ mr: 1 }} />
            导入文件
          </MenuItem>
          <MenuItem onClick={handleExport}>
            <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
            导出文件
          </MenuItem>
        </Menu>

        <Divider orientation="vertical" flexItem />

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

        <Button
          size="small"
          onClick={handleLayoutMenuOpen}
          sx={{ textTransform: 'none', minWidth: 'auto' }}
        >
          布局
        </Button>

        <Menu
          anchorEl={layoutMenuAnchor}
          open={Boolean(layoutMenuAnchor)}
          onClose={handleLayoutMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleApplyLayout('tree')}>
            <AccountTreeIcon fontSize="small" sx={{ mr: 1 }} />
            树形布局
          </MenuItem>
          <MenuItem onClick={() => handleApplyLayout('hierarchical')}>
            <LayersIcon fontSize="small" sx={{ mr: 1 }} />
            层次布局
          </MenuItem>
          <MenuItem onClick={() => handleApplyLayout('force')}>
            <HubIcon fontSize="small" sx={{ mr: 1 }} />
            力导向布局
          </MenuItem>
          <MenuItem onClick={() => handleApplyLayout('grid')}>
            <GridOnIcon fontSize="small" sx={{ mr: 1 }} />
            网格布局
          </MenuItem>
          <MenuItem onClick={() => handleApplyLayout('circular')}>
            <DonutLargeIcon fontSize="small" sx={{ mr: 1 }} />
            环形布局
          </MenuItem>
        </Menu>

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
        <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </Typography>

        <Typography variant="body2" color={fileName ? 'text.primary' : 'text.secondary'} sx={{ ml: 'auto' }}>
          {collectionName ? `${collectionName} / ${fileName || '未保存'}` : (fileName || '未保存')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          ({env})
        </Typography>
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

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>保存文件</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="文件名"
            fullWidth
            variant="standard"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="输入文件名"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>取消</Button>
          <Button onClick={() => doSave(fileName)} variant="contained" disabled={!fileName}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)} maxWidth="md">
        <DialogTitle>读取文件</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>最近文件</Typography>
          {savedFiles.length === 0 ? (
            <Typography color="text.secondary">暂无保存的文件</Typography>
          ) : (
            <Stack spacing={1}>
              {savedFiles.map((name) => (
                <Button
                  key={name}
                  variant="text"
                  onClick={() => doLoad(name)}
                  fullWidth
                  startIcon={<FolderOpenIcon fontSize="small" />}
                >
                  {name}
                </Button>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
