import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Divider, Tooltip, List, ListItem, ListItemText, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, ListItemIcon, Chip, Menu, MenuItem } from '@mui/material';
import RectangleIcon from '@mui/icons-material/Rectangle';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import HexagonIcon from '@mui/icons-material/Hexagon';
import PentagonIcon from '@mui/icons-material/Pentagon';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useGraphDataStore } from './graphDataStore.js';
import { fileService } from '@/services/serviceFactory.js';
import { CollectionInfo } from '@/services/file/BaseFileService.js';
import { GraphType, GraphTypeLabels, GraphTypeColors, GraphData } from './types.js';

interface ShapeItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  shape: string;
  width: number;
  height: number;
}

const shapes: ShapeItem[] = [
  { id: 'rect', name: '矩形', icon: <RectangleIcon />, shape: 'rect', width: 100, height: 60 },
  { id: 'circle', name: '圆形', icon: <CircleIcon />, shape: 'circle', width: 60, height: 60 },
  { id: 'ellipse', name: '椭圆', icon: <CircleIcon style={{ transform: 'scaleX(1.5)' }} />, shape: 'ellipse', width: 100, height: 60 },
  { id: 'triangle', name: '三角形', icon: <ChangeHistoryIcon />, shape: 'triangle', width: 60, height: 60 },
  { id: 'diamond', name: '菱形', icon: <DiamondIcon />, shape: 'diamond', width: 60, height: 80 },
  { id: 'pentagon', name: '五边形', icon: <PentagonIcon />, shape: 'pentagon', width: 60, height: 60 },
  { id: 'hexagon', name: '六边形', icon: <HexagonIcon />, shape: 'hexagon', width: 60, height: 60 },
  { id: 'star', name: '星形', icon: <StarIcon />, shape: 'star', width: 60, height: 60 },
];

type ViewMode = 'collections' | 'files';

function getDisplayName(fileName: string): string {
  return fileName.replace(/\.json$/i, '');
}

export default function GraphSidebar() {
  const { setGraphData, setFileName, setCollectionName, collectionName, fileName, graphData, updateGraphType } = useGraphDataStore();
  
  const handleDragStart = (e: React.DragEvent, shape: ShapeItem) => {
    e.dataTransfer.setData('shape', JSON.stringify(shape));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [collectionFiles, setCollectionFiles] = useState<{ [key: string]: string[] }>({});
  const [fileTypes, setFileTypes] = useState<{ [key: string]: GraphType }>({});
  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionPath, setNewCollectionPath] = useState('');
  const [createFileDialogOpen, setCreateFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const [viewMode, setViewMode] = useState<ViewMode>('collections');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [typeMenuAnchor, setTypeMenuAnchor] = useState<null | HTMLElement>(null);
  const [editingFile, setEditingFile] = useState<string | null>(null);

  React.useEffect(() => {
    const loadDefaultPath = async () => {
      const lastPath = localStorage.getItem('lastCollectionPath');
      if (lastPath) {
        setNewCollectionPath(lastPath);
      } else {
        try {
          const defaultFolder = await fileService.getDefaultFolder();
          if (defaultFolder) {
            setNewCollectionPath(defaultFolder);
          }
        } catch (error) {
          console.error('获取默认文件夹失败:', error);
        }
      }
    };
    loadDefaultPath();
  }, []);

  const refreshCollections = useCallback(async () => {
    const collectionList = await fileService.listCollections();
    setCollections(collectionList);
    
    const filesMap: { [key: string]: string[] } = {};
    const typesMap: { [key: string]: GraphType } = {};
    
    for (const collection of collectionList) {
      const files = await fileService.listFilesInCollection(collection.name);
      filesMap[collection.name] = files;
      
      for (const file of files) {
        try {
          const data = await fileService.loadFromCollection(collection.name, file);
          if (data) {
            const key = `${collection}/${file}`;
            typesMap[key] = data.type || 'other';
          }
        } catch {
          // ignore
        }
      }
    }
    
    setCollectionFiles(filesMap);
    setFileTypes(typesMap);
  }, []);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  useEffect(() => {
    if (collectionName && !selectedCollection && !isNavigatingBack) {
      setSelectedCollection(collectionName);
      setViewMode('files');
    }
  }, [collectionName, selectedCollection, isNavigatingBack]);

  const handleSelectDirectory = async () => {
    try {
      const path = await fileService.selectDirectory();
      if (path) {
        setNewCollectionPath(path);
        localStorage.setItem('lastCollectionPath', path);
      }
    } catch (error) {
      console.error('选择目录失败:', error);
    }
  };

  const handleCreateCollection = async () => {
    if (newCollectionName) {
      try {
        await fileService.createCollection(newCollectionName, newCollectionPath);
        const mainData: GraphData = {
          nodes: [],
          edges: [],
          type: 'other',
          name: 'main',
        };
        await fileService.saveToCollection(newCollectionName, 'main.json', mainData);
        await refreshCollections();
        setNewCollectionName('');
        setCreateCollectionDialogOpen(false);
      } catch (error) {
        alert('创建图形集失败: ' + error);
      }
    }
  };

  const handleLoadFromCollection = async (collection: string, name: string) => {
    try {
      const data = await fileService.loadFromCollection(collection, name);
      if (data) {
        setGraphData(data);
        setFileName(name);
        setCollectionName(collection);
        
        localStorage.setItem('lastOpenedFile', JSON.stringify({
          type: 'collection',
          collection,
          name,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      alert('加载失败: ' + error);
    }
  };

  const handleDeleteCollection = async (collection: string) => {
    if (confirm(`确定要删除图形集 "${collection}" 吗？所有包含的文件也会被删除。`)) {
      try {
        await fileService.deleteCollection(collection);
        await refreshCollections();
        if (selectedCollection === collection) {
          setViewMode('collections');
          setSelectedCollection(null);
        }
      } catch (error) {
        alert('删除图形集失败: ' + error);
      }
    }
  };

  const handleDeleteFile = async (collection: string, name: string) => {
    if (confirm(`确定要删除 "${getDisplayName(name)}" 吗？`)) {
      try {
        await fileService.deleteFromCollection(collection, name);
        await refreshCollections();
      } catch (error) {
        alert('删除文件失败: ' + error);
      }
    }
  };

  const handleCollectionClick = (collection: string) => {
    setSelectedCollection(collection);
    setViewMode('files');
    setIsNavigatingBack(false);
  };

  const handleBackToCollections = () => {
    setViewMode('collections');
    setSelectedCollection(null);
    setIsNavigatingBack(true);
  };

  const handleCreateFile = async () => {
    if (newFileName && selectedCollection) {
      try {
        const fileNameWithExt = newFileName.endsWith('.json') ? newFileName : `${newFileName}.json`;
        const newData: GraphData = {
          nodes: [],
          edges: [],
          type: 'other',
          name: newFileName,
        };
        await fileService.saveToCollection(selectedCollection, fileNameWithExt, newData);
        await refreshCollections();
        setNewFileName('');
        setCreateFileDialogOpen(false);
        
        await handleLoadFromCollection(selectedCollection, fileNameWithExt);
      } catch (error) {
        alert('创建文件失败: ' + error);
      }
    }
  };

  const handleTypeMenuOpen = (e: React.MouseEvent<HTMLElement>, file: string) => {
    e.stopPropagation();
    setTypeMenuAnchor(e.currentTarget);
    setEditingFile(file);
  };

  const handleTypeMenuClose = () => {
    setTypeMenuAnchor(null);
    setEditingFile(null);
  };

  const handleTypeChange = async (newType: GraphType) => {
    if (editingFile && selectedCollection) {
      try {
        const data = await fileService.loadFromCollection(selectedCollection, editingFile);
        if (data) {
          const updatedData = { ...data, type: newType };
          await fileService.saveToCollection(selectedCollection, editingFile, updatedData);
          
          const key = `${selectedCollection}/${editingFile}`;
          setFileTypes(prev => ({ ...prev, [key]: newType }));
          
          if (collectionName === selectedCollection && fileName === editingFile) {
            updateGraphType(newType);
          }
        }
      } catch (error) {
        alert('更新类型失败: ' + error);
      }
    }
    handleTypeMenuClose();
  };

  const currentFiles = selectedCollection ? (collectionFiles[selectedCollection] || []) : [];
  const sortedFiles = [...currentFiles].sort((a, b) => {
    if (a === 'main.json') return -1;
    if (b === 'main.json') return 1;
    return a.localeCompare(b);
  });

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#fafafa',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          基础形状
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          {shapes.map((shape) => (
            <Tooltip key={shape.id} title={shape.name} placement="right">
              <Box
                draggable
                onDragStart={(e) => handleDragStart(e, shape)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'grab',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'primary.main',
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    cursor: 'grabbing',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 0.5 }}>
                  {shape.icon}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {shape.name}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {viewMode === 'collections' ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                图形集
              </Typography>
              <Tooltip title="新建图形集">
                <IconButton
                  size="small"
                  onClick={() => setCreateCollectionDialogOpen(true)}
                >
                  <CreateNewFolderIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <List sx={{ flex: 1, overflow: 'auto' }}>
              {collections.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                  暂无图形集
                </Typography>
              ) : (
                collections.map((collection) => (
                  <ListItem
                    key={collection.name}
                    secondaryAction={
                      <Tooltip title="删除图形集">
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCollection(collection.name);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    onClick={() => handleCollectionClick(collection.name)}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FolderIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={collection.name}
                      secondary={`${collectionFiles[collection.name]?.length || 0} 个图`}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Tooltip title="返回图形集列表">
                <IconButton size="small" onClick={handleBackToCollections} sx={{ mr: 1 }}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="subtitle2" color="text.secondary" sx={{ flex: 1 }}>
                {selectedCollection}
              </Typography>
              <Tooltip title="新建图">
                <IconButton
                  size="small"
                  onClick={() => setCreateFileDialogOpen(true)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <List sx={{ flex: 1, overflow: 'auto' }}>
              {sortedFiles.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                  暂无图
                </Typography>
              ) : (
                sortedFiles.map((file) => {
                  const isActive = collectionName === selectedCollection && fileName === file;
                  const fileKey = `${selectedCollection}/${file}`;
                  const fileType = fileTypes[fileKey] || 'other';
                  
                  return (
                    <ListItem
                      key={file}
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="更改类型">
                            <IconButton 
                              size="small"
                              onClick={(e) => handleTypeMenuOpen(e, file)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(selectedCollection!, file);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                      onClick={() => handleLoadFromCollection(selectedCollection!, file)}
                      sx={{ 
                        cursor: 'pointer',
                        borderRadius: 1,
                        mb: 0.5,
                        backgroundColor: isActive ? 'action.selected' : 'transparent',
                        '&:hover': {
                          backgroundColor: isActive ? 'action.selected' : 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InsertDriveFileIcon fontSize="small" color={isActive ? 'primary' : 'action'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ 
                                color: isActive ? 'primary.main' : 'text.primary',
                                fontWeight: isActive ? 'medium' : 'regular',
                              }}
                            >
                              {getDisplayName(file)}
                            </Typography>
                            <Chip
                              label={GraphTypeLabels[fileType]}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: GraphTypeColors[fileType],
                                color: '#fff',
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })
              )}
            </List>
          </>
        )}
      </Box>

      <Menu
        anchorEl={typeMenuAnchor}
        open={Boolean(typeMenuAnchor)}
        onClose={handleTypeMenuClose}
      >
        {(Object.keys(GraphTypeLabels) as GraphType[]).map((type) => (
          <MenuItem 
            key={type} 
            onClick={() => handleTypeChange(type)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: GraphTypeColors[type],
              }}
            />
            {GraphTypeLabels[type]}
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={createCollectionDialogOpen} onClose={() => setCreateCollectionDialogOpen(false)}>
        <DialogTitle>新建图形集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="图形集名称"
            fullWidth
            variant="standard"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="输入图形集名称"
          />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="本地路径（可选）"
              fullWidth
              variant="standard"
              value={newCollectionPath}
              onChange={(e) => setNewCollectionPath(e.target.value)}
              placeholder="选择或输入本地路径"
            />
            <IconButton onClick={handleSelectDirectory} size="small">
              <FolderOpenIcon />
            </IconButton>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCollectionDialogOpen(false)}>取消</Button>
          <Button onClick={handleCreateCollection} variant="contained" disabled={!newCollectionName}>
            创建
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createFileDialogOpen} onClose={() => setCreateFileDialogOpen(false)}>
        <DialogTitle>新建图</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="图名称"
            fullWidth
            variant="standard"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="输入图名称"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateFileDialogOpen(false)}>取消</Button>
          <Button onClick={handleCreateFile} variant="contained" disabled={!newFileName}>
            创建
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
