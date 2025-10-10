import React, { useRef, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  Button,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { setSelectedTable, addTable, deleteSelectTable } from './DbSlice.js';
import { useAppDispatch } from '@/store.js';
import { useSelector } from 'react-redux';
import InputDialog from '@/ui/dialog/InputDialog.js';
import ConfirmDialog from '@/ui/dialog/ConfirmDialog.js';

export default function TableSelector() {
  const dispatch = useAppDispatch();

  // 从Redux store中获取tableList和selectedTable
  const { tableList, selectedTable, selectedDb } = useSelector((state: any) => state.db);
  
  // 菜单锚点
  const anchorTable = useRef(null);

  // 模块状态
  const [tableMenuState, setTableMenuState] = useState(false);
  const [tableAddDialogState, setTableAddDialogState] = useState(false);
  const [tableDeleteDialogState, setTableDeleteDialogState] = useState(false);

  // 获取选中的表对象
  const selectedTableObj = tableList.find((table: any) => table.id == selectedTable);

  return (
    <>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>表</InputLabel>
        <Select
          label="表"
          value={selectedTable}
          onChange={(e) => dispatch(setSelectedTable(e.target.value as string))}
        >
          <MenuItem value="">-- 请选择 --</MenuItem>
          {tableList.map((table: any) => (
            <MenuItem key={table.id} value={table.id}>
              {table.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" sx={{ height: 24, minWidth: 60, ml: 1 }}>总览</Button>

      <IconButton
        ref={anchorTable}
        aria-label="table actions"
        sx={{ height: 24, width: 24, ml: 1 }}
        onClick={() => setTableMenuState(true)}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorTable.current}
        open={tableMenuState}
        onClose={() => setTableMenuState(false)}
      >
        <MenuItem onClick={() => {
          setTableMenuState(false);
          setTableAddDialogState(true);
        }}>
          添加
        </MenuItem>

        <MenuItem 
          onClick={() => {
            setTableMenuState(false);
            if (selectedTable) {
              setTableDeleteDialogState(true);
            }
          }}
          disabled={!selectedTable}
        >
          删除
        </MenuItem>
      </Menu>

      <InputDialog
        open={tableAddDialogState}
        title="添加表"
        label="表名称"
        onClose={() => setTableAddDialogState(false)}
        onSubmit={async (tableName) => {
          if (tableName) {
            try {
              await dispatch(addTable(tableName));
            } catch (err) {
              console.error('添加表失败:', err);
            }
          }
          setTableAddDialogState(false);
        }}
      />

      <ConfirmDialog
        open={tableDeleteDialogState}
        title="确认删除"
        content={`确定要删除表 "${selectedTableObj?.name}" 吗？此操作不可撤销。`}
        onConfirm={async () => {
          try {
            await dispatch(deleteSelectTable());
          } catch (err) {
            console.error('删除表异常:', err);
          }
          setTableDeleteDialogState(false);
        }}
        onCancel={() => {
          setTableDeleteDialogState(false);
        }}
      />
    </>
  );
}