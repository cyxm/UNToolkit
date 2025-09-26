import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '@/store.js';
import {
  setLoading,
  setQueryResult,
  setDatabaseList,
  setSelectedDb,
  setSelectedTable,
  setTableList,
  setTablesLoading,
  setFieldList,
  setSelectedFields,
  setOpenAddTableDialog,
  setOpenAddFieldDialog,
  setDataType
} from './dbSlice.js';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Button,
  IconButton,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Chip
} from '@mui/material';
import InputDialog from '@/ui/dialog/InputDialog.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddFieldDialog from './AddFieldDialog.js';
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
    fieldList,
    selectedDb,
    selectedTable,
    selectedFields,
    tablesLoading,
    tableLoading,
    fieldLoading,
    dbAnchorEl,
    tableAnchorEl,
    dataType,
    openAddFieldDialog,
    editingField,
    fieldToDelete,
    openAddDialog,
    openAddTableDialog
  } = useSelector((state: RootState) => state.db);

  const handleEditField = (field: Field) => {
    setEditingField(field);
  };

  useEffect(() => {
    const fetchTableData = async () => {
      if (!selectedTable) return;

      try {
        setTableLoading(true);
        setFieldLoading(true);
        const tableResult = await window.electron.db.tables.query({
          name: selectedTable
        });
        if (tableResult.success) {
          dispatch(setQueryResult(tableResult.data));
        }

        const fieldsResult = await window.electron.db.fields.query({
          table_name: selectedTable
        });
        if (fieldsResult.success) {
          dispatch(setFieldList(fieldsResult.data));
        }
      } catch (err) {
        console.error('Failed to load table data:', err);
      } finally {
        setTableLoading(false);
        setFieldLoading(false);
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
        const result = await window.electron.db.databases.query();
        if (result.success) {
          dispatch(setDatabaseList(result.data.map((db: any) => ({
            id: db.id,
            name: db.name
          }))));
        }
      } catch (err) {
        console.error('Failed to load databases:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initDb();
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

        <InputDialog
          open={openAddDialog}
          title="添加数据库"
          label="数据库名称"
          onClose={() => setOpenAddDialog(false)}
          onSubmit={handleAddDatabase}
        />

        <InputDialog
          open={openAddTableDialog}
          title="添加表"
          label="表名称"
          onClose={() => dispatch(setOpenAddTableDialog(false))}
          onSubmit={async (tableName) => {
            try {
              if (!selectedDb || !tableName) return;

              const selectedDbObj = databaseList.find(db => db.name === selectedDb);
              if (!selectedDbObj) return;

              const result = await window.electron.db.tables.create({
                name: tableName,
                database_id: selectedDbObj.id
              });

              if (result.success) {
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
          }}
        />

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
        <Box sx={{ width: 160, p: 2 }}>
          <Stack spacing={2}>
            {/* 数据类型选择 */}
            <Button
              variant={dataType === 'data' ? 'contained' : 'outlined'}
              onClick={() => dispatch(setDataType('data'))}
              fullWidth
            >
              数据
            </Button>
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

            <Divider />

            {/* 表格操作按钮 - 仅在选中表时显示 */}
            {selectedTable && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => dispatch(setOpenAddFieldDialog(true))}
                fullWidth
              >
                添加字段
              </Button>
            )}
          </Stack>
        </Box>

        {/* 添加字段对话框 */}
        <AddFieldDialog
          open={openAddFieldDialog && !editingField}
          onClose={() => dispatch(setOpenAddFieldDialog(false))}
          onSubmit={async (fieldData) => {
            try {
              if (!selectedTable || !fieldData.name) return;

              const table = tableList.find(t => t.name === selectedTable);
              if (!table) {
                alert('找不到对应的表');
                return;
              }

              let result;
              if (fieldData.dataType === 'primary') {
                result = await window.electron.db.fields.create({
                  name: fieldData.name,
                  table_id: table.id,
                  type: "int",
                  primary: 1,
                  auto_increment: 1
                });
              } else {
                result = await window.electron.db.fields.create({
                  name: fieldData.name,
                  table_id: table.id,
                  type: fieldData.type || "string",
                  not_null: fieldData.required ? 1 : 0,
                  default: fieldData.defaultValue,
                  unique: fieldData.unique ? 1 : 0,
                  primary: 0,
                  auto_increment: 0
                });
              }
              if (result.success) {
                // 刷新字段列表
                const fieldsResult = await window.electron.db.fields.query({
                  where: {
                    table_id: table.id
                  }
                });
                if (fieldsResult.success) {
                  dispatch(setFieldList(fieldsResult.data));
                }
              } else {
                alert('字段添加失败: ' + result.message);
              }
            } catch (err) {
              console.error('添加字段失败:', err);
            }
          }}
          fieldList={fieldList}
        />

        {/* 编辑字段对话框 */}
        {editingField && (
          <AddFieldDialog
            open={true}
            onClose={() => setEditingField(null)}
            onSubmit={async (fieldData) => {
              try {
                if (!selectedTable || !fieldData.name) return;

                const table = tableList.find(t => t.name === selectedTable);
                if (!table) return;

                const result = await window.electron.db.fields.update({
                  id: editingField.id,
                  name: fieldData.name,
                  type: fieldData.type || "string",
                  not_null: fieldData.required ? 1 : 0,
                  default: fieldData.defaultValue,
                  unique: fieldData.unique ? 1 : 0
                });

                if (result.success) {
                  // 刷新字段列表
                  const fieldsResult = await window.electron.db.fields.query({
                    where: {
                      table_id: table.id
                    }
                  });
                  if (fieldsResult.success) {
                    dispatch(setFieldList(fieldsResult.data));
                  }
                }
              } catch (err) {
                console.error('更新字段失败:', err);
              } finally {
                setEditingField(null);
              }
            }}
            fieldList={fieldList}
            initialData={{
              name: editingField.name,
              type: editingField.type,
              required: editingField.required,
              defaultValue: editingField.defaultValue,
              unique: editingField.unique,
              dataType: editingField.primary ? 'primary' : 'data'
            }}
          />
        )}

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
                  <TableCell width="30%">域名</TableCell>
                  <TableCell align="center" width="20%">类型</TableCell>
                  <TableCell align="center" width="10%">非空</TableCell>
                  <TableCell align="center" width="10%">默认</TableCell>
                  <TableCell align="center" width="10%">唯一</TableCell>
                  <TableCell align="center" width="20%">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fieldList?.map((field, index) => {
                  // 根据数据类型过滤显示
                  const showField =
                    (dataType === 'primary' && field.primary) ||
                    (dataType === 'data' && !field.primary);

                  if (!showField) return null;

                  return (
                    <TableRow
                      key={field.id}
                      sx={{
                        backgroundColor: (theme) =>
                          index % 2 === 0
                            ? theme.palette.background.default
                            : theme.palette.action.hover
                      }}
                    >
                      <TableCell component="th" scope="row" width="30%">
                        {field.name}
                      </TableCell>
                      <TableCell width="20%" align="center">
                        {field.type}
                        {field.primary && <Chip label="主键" size="small" sx={{ ml: 1 }} />}
                        {field.foreignKey && <Chip label="外键" size="small" sx={{ ml: 1 }} />}
                      </TableCell>
                      <TableCell width="10%" align="center">{field.required ? '是' : '否'}</TableCell>
                      <TableCell width="10%" align="center">{field.defaultValue || '-'}</TableCell>
                      <TableCell width="10%" align="center">{field.unique ? '是' : '否'}</TableCell>
                      <TableCell width="20%" align="center">
                        <IconButton size="small" onClick={() => handleEditField(field)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteField(field)}
                          disabled={field.primary} // 主键字段不允许删除
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Stack>
    </Stack>
  );
}
