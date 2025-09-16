import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '@/store.js';
import {
  setLoading,
  setQueryResult,
  setDbReadStatus,
  setDatabaseList,
  setSelectedDb,
  setSelectedTable,
  setTableList,
  setTablesLoading
} from '@/slices/dbSlice.js';
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
  const dispatch = useAppDispatch();
  const {
    loading,
    queryResult,
    dbReadStatus,
    databaseList,
    tableList,
    selectedDb,
    selectedTable,
    tablesLoading
  } = useSelector((state: RootState) => state.db);
  const [tableLoading, setTableLoading] = useState(false);
  const [dbAnchorEl, setDbAnchorEl] = useState<null | HTMLElement>(null);
  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddTableDialog, setOpenAddTableDialog] = useState(false);
  const [newDbName, setNewDbName] = useState<string>('');
  const [newTableName, setNewTableName] = useState<string>('');
  const [dataType, setDataType] = useState<'primary' | 'foreign' | 'data'>('primary');
  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldDefaultValue, setNewFieldDefaultValue] = useState('');
  const [newFieldUnique, setNewFieldUnique] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      if (!selectedTable) return;

      try {
        setTableLoading(true);
        const result = await window.electron.db.tables.query({
          name: selectedTable
        });
        if (result.success) {
          dispatch(setQueryResult(result.data));
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
        dispatch(setLoading(true));
        await window.electron.db.start();
        const result = await window.electron.db.databases.query();
        if (result.success) {
          dispatch(setDatabaseList(result.data.map((db: any) => ({
            id: db.id,
            name: db.name
          }))));
          dispatch(setDbReadStatus('read'));
        }
      } catch (err) {
        console.error('Failed to load databases:', err);
      } finally {
        dispatch(setLoading(false));
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
            onChange={async (e) => {
              const dbName = e.target.value as string;
              dispatch(setSelectedDb(dbName));
              dispatch(setSelectedTable(''));

              if (!dbName) {
                dispatch(setTableList([]));
                return;
              }

              // 获取选中数据库的ID
              const selectedDbObj = databaseList.find(db => db.name === dbName);
              if (!selectedDbObj) return;

              try {
                dispatch(setTablesLoading(true));
                const result = await window.electron.db.tables.query({
                  database_id: selectedDbObj.id
                });
                if (result.success) {
                  dispatch(setTableList(result.data));
                }
              } catch (err) {
                console.error('Failed to load tables:', err);
              } finally {
                dispatch(setTablesLoading(false));
              }
            }}
          >
            <MenuItem value="">-- 请选择 --</MenuItem>
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

        {/* 添加表对话框 */}
        <Dialog open={openAddTableDialog} onClose={() => setOpenAddTableDialog(false)}>
          <DialogTitle>添加表</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="表名称"
              fullWidth
              variant="standard"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddTableDialog(false)}>取消</Button>
            <Button onClick={async () => {
              try {
                if (!selectedDb || !newTableName) return;

                // 获取当前选中的数据库ID
                const selectedDbObj = databaseList.find(db => db.name === selectedDb);
                if (!selectedDbObj) return;

                const result = await window.electron.db.tables.create({
                  name: newTableName,
                  database_id: selectedDbObj.id
                });

                if (result.success) {
                  setOpenAddTableDialog(false);
                  setNewTableName('');
                  // 刷新表列表
                  const tables = await window.electron.db.tables.query({
                    database_id: selectedDbObj.id
                  });
                  if (tables.success) {
                    dispatch(setTableList(tables.data));
                  }
                }
              } catch (err) {
                console.error('Failed to add table:', err);
              }
            }}>确定</Button>
          </DialogActions>
        </Dialog>

        <Divider orientation="vertical" flexItem />

        {/* 表操作 */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>表</InputLabel>
          <Select
            label="表"
            onChange={(e) => dispatch(setSelectedTable(e.target.value as string))}
          >
            <MenuItem value="">-- 请选择 --</MenuItem>
            {tableList.map(table => (
              <MenuItem key={table.id} value={table.name}>
                {table.name}
              </MenuItem>
            ))}
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
          <MenuItem onClick={() => {
            setTableAnchorEl(null);
            setOpenAddTableDialog(true);
          }}>添加</MenuItem>
          <MenuItem onClick={() => {
            setTableAnchorEl(null);
            if (selectedTable) {
              // 删除表逻辑
            }
          }}>删除</MenuItem>
        </Menu>
      </Stack>

      <Stack direction="row" sx={{ flexGrow: 1, height: '100%' }}>
        {/* 左侧操作面板 */}
        <Box sx={{ width: 200, p: 2 }}>
          <Stack spacing={2}>
            {/* 数据类型选择 */}
            <Button
              variant={dataType === 'primary' ? 'contained' : 'outlined'}
              onClick={() => setDataType('primary')}
              fullWidth
            >
              主键
            </Button>
            <Button
              variant={dataType === 'foreign' ? 'contained' : 'outlined'}
              onClick={() => setDataType('foreign')}
              fullWidth
            >
              外键
            </Button>
            <Button
              variant={dataType === 'data' ? 'contained' : 'outlined'}
              onClick={() => setDataType('data')}
              fullWidth
            >
              数据
            </Button>

            <Divider />

            {/* 表格操作按钮 */}
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => setOpenAddFieldDialog(true)}
              fullWidth
            >
              添加字段
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => {
                setNewFieldName('');
                setNewFieldType('');
                setNewFieldRequired(false);
                setNewFieldDefaultValue('');
                setNewFieldUnique(false);
              }}
              fullWidth
            >
              取消
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={async () => {
                try {
                  if (selectedTable) {
                    const result = await window.electron.db.tables.update({
                      name: selectedTable,
                      fields: queryResult
                    });
                    if (result.success) {
                      alert('修改保存成功');
                    }
                  }
                } catch (err) {
                  console.error('保存失败:', err);
                  alert('保存失败');
                }
              }}
              fullWidth
            >
              提交修改
            </Button>
          </Stack>
        </Box>

        {/* 添加字段对话框 */}
        <Dialog open={openAddFieldDialog} onClose={() => setOpenAddFieldDialog(false)}>
          <DialogTitle>添加字段</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="字段名称"
              fullWidth
              variant="standard"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddFieldDialog(false)}>取消</Button>
            <Button onClick={async () => {
              try {
                if (!selectedTable || !newFieldName) return;

                const newField = {
                  name: newFieldName,
                  type: 'TEXT', // 默认类型
                  primaryKey: dataType === 'primary',
                  foreignKey: dataType === 'foreign'
                };

                const result = await window.electron.db.tables.addField({
                  tableName: selectedTable,
                  field: newField
                });

                if (result.success) {
                  setOpenAddFieldDialog(false);
                  setNewFieldName('');
                  // 刷新表数据
                  const tableData = await window.electron.db.tables.query({
                    name: selectedTable
                  });
                  if (tableData.success) {
                    dispatch(setQueryResult(tableData.data));
                  }
                }
              } catch (err) {
                console.error('添加字段失败:', err);
              }
            }}>添加</Button>
          </DialogActions>
        </Dialog>

        {/* 表格内容 */}
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
                {queryResult?.map((row: any) => {
                  // 根据数据类型过滤显示
                  const showRow =
                    (dataType === 'primary' && row.primaryKey) ||
                    (dataType === 'foreign' && row.foreignKey) ||
                    (dataType === 'data');

                  if (!showRow) return null;

                  return (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row" width="33%">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.type}</TableCell>
                      <TableCell align="center">{row.notNull ? '是' : '否'}</TableCell>
                      <TableCell align="center">{row.defaultValue || '-'}</TableCell>
                      <TableCell align="center">{row.unique ? '是' : '否'}</TableCell>
                    </TableRow>
                  );
                })}
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
