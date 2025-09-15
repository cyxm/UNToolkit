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
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel
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
  const [tableLoading, setTableLoading] = useState(false);
  const [dbAnchorEl, setDbAnchorEl] = useState<null | HTMLElement>(null);
  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newDbName, setNewDbName] = useState<string>('');

  useEffect(() => {
    const fetchTableData = async () => {
      if (!selectedTable) return;

      try {
        setTableLoading(true);
        const result = await window.electron.db.tables.query({
          table: selectedTable
        });
        if (result.success) {
          setQueryResult(result.data);
        }
      } catch (err) {
        console.error('Failed to load table data:', err);
      } finally {
        setTableLoading(false);
      }
    };

    fetchTableData();
  }, [selectedTable]);

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
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          {tableLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width="33%">域名</TableCell>
                  <TableCell align="center">类型</TableCell>
                  <TableCell align="center">非空</TableCell>
                  <TableCell align="center">默认</TableCell>
                  <TableCell align="center">唯一</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queryResult?.map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row" width="33%">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell align="center">{row.notNull ? '是' : '否'}</TableCell>
                    <TableCell align="center">{row.defaultValue || '-'}</TableCell>
                    <TableCell align="center">{row.unique ? '是' : '否'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
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
