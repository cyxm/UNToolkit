import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Button,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { ElectronAPI } from "@un/tool-protocol/electron_api"

export default function Db() {
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [dbReadStatus, setDbReadStatus] = useState<'unread' | 'read'>('unread');
  const [databaseList, setDatabaseList] = useState<Array<{ id: number, name: string }>>([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [dbAnchorEl, setDbAnchorEl] = useState<null | HTMLElement>(null);
  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newDbName, setNewDbName] = useState<string>('');

  const handleAddDatabase = async () => {
    try {
      console.log(newDbName);
      const result = await window.electron.db.databases.create({
        name: newDbName
      });
      if (result.success) {
        setOpenAddDialog(false);
        setNewDbName('');
        // 刷新数据库列表
        const dbs = await window.electron.db.databases.query();
        console.log('Databases:', dbs);
      }
    } catch (err) {
      console.error('Failed to create database:', err);
    }
  };

  useEffect(() => {
    const initDb = async () => {
      try {
        setLoading(true);
        await window.electron.db.start();
        const result = await window.electron.db.databases.query();
        if (result.success) {
          setDatabaseList(result.data.map((db: any) => ({
            id: db.id,
            name: db.name
          })));
          setDbReadStatus('read')
        }
      } catch (err) {
        console.error('Failed to load databases:', err);
      } finally {
        setLoading(false);
      }
    };

    initDb();
    return () => {
      window.electron.db.end();
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2} direction="column" sx={{ flexGrow: 1, height: '100%', p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
        {/* 库操作 */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>数据库</InputLabel>
          <Select
            label="数据库"
            onChange={(e) => setSelectedDb(e.target.value)}
          >
            {databaseList.map(db => (
              <MenuItem key={db.id} value={db.name}>
                {db.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          aria-label="database actions"
          onClick={(e) => setDbAnchorEl(e.currentTarget)}
          sx={{ height: 24, width: 24 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={dbAnchorEl}
          open={Boolean(dbAnchorEl)}
          onClose={() => setDbAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            setDbAnchorEl(null);
            setOpenAddDialog(true);
          }}>添加</MenuItem>
          <MenuItem onClick={() => { setDbAnchorEl(null); /* 删除操作 */ }}>删除</MenuItem>
        </Menu>

        {/* 添加数据库对话框 */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>添加数据库</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="数据库名称"
              fullWidth
              variant="standard"
              value={newDbName}
              onChange={(e) => setNewDbName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>取消</Button>
            <Button onClick={handleAddDatabase}>确定</Button>
          </DialogActions>
        </Dialog>

        <Divider orientation="vertical" flexItem />

        {/* 表操作 */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>表</InputLabel>
          <Select
            label="表"
            onChange={(e) => setSecondLevel(e.target.value)}
          >
            <MenuItem value="option1">选项1</MenuItem>
            <MenuItem value="option2">选项2</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" sx={{ height: 24, minWidth: 60, ml: 1 }}>总览</Button>
        <IconButton
          aria-label="table actions"
          onClick={(e) => setTableAnchorEl(e.currentTarget)}
          sx={{ height: 24, width: 24, ml: 1 }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={tableAnchorEl}
          open={Boolean(tableAnchorEl)}
          onClose={() => setTableAnchorEl(null)}
        >
          <MenuItem onClick={() => { setTableAnchorEl(null); /* 添加操作 */ }}>添加</MenuItem>
          <MenuItem onClick={() => { setTableAnchorEl(null); /* 删除操作 */ }}>删除</MenuItem>
        </Menu>
      </Stack>

      <Stack sx={{ flexGrow: 1, height: '100%' }}>
        <Box sx={{
          flexGrow: 1,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          minHeight: 0,
          p: 2,
          overflow: 'auto'
        }}>
          {queryResult && (
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          )}
        </Box>
      </Stack>

      {/* 数据库读取状态栏 */}
      <Box
        sx={{
          height: '28px', // 缩小高度
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: dbReadStatus === 'read' ? 'success.main' : 'error.main',
          color: 'white',
          borderRadius: 1,
          fontSize: '0.8rem', // 调整字体大小
          transition: 'all 0.3s ease' // 添加过渡效果
        }}
      >
        {dbReadStatus === 'read' ? '数据库已读取' : '数据库未读取'}
      </Box>
    </Stack>
  );
}
