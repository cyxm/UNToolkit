import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store.js';
import { selectDb, addDb, deleteSelectDb } from './DbSlice.js';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InputDialog from '@/ui/dialog/InputDialog.js';
import ConfirmDialog from '@/ui/dialog/ConfirmDialog.js';
import { useAppDispatch } from '@/store.js';
import { Database } from './DbSlice.js';

export default function DatabaseSelector() {
  const { databaseList, selectedDb } = useSelector((state: RootState) => state.db);
  const dispatch = useAppDispatch();

  //菜单锚点
  const anchorDb = useRef(null);

  //模块状态
  const [dbMenuState, setDbMenuState] = useState(false);
  const [dbAddDialogState, setDbAddDialogState] = useState(false);
  const [dbDeleteDialogState, setDbDeleteDialogState] = useState(false);

  const handleDeleteConfirm = async () => {
    if (selectedDb) {
      try {
        const result = await window.electron.db.databases.delete(selectedDb.id);
        if (result.success) {
          // 如果删除成功，重新加载数据库列表
          dispatch(selectDb(0)); // 重置选择
        } else {
          console.error('删除数据库失败:', result.error);
        }
      } catch (err) {
        console.error('删除数据库异常:', err);
      } finally {
        setDbDeleteDialogState(false);
      }
    }
  };

  return (
    <>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>数据库</InputLabel>
        <Select
          label="数据库"
          value={selectedDb?.id || ''}
          onChange={(e) => dispatch(selectDb(Number(e.target.value)))}
        >
          <MenuItem value="">-- 请选择 --</MenuItem>
          {databaseList.map((db: Database) => (
            <MenuItem key={db.id} value={db.id}>
              {db.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton
        ref={anchorDb}
        aria-label="database actions"
        sx={{ height: 24, width: 24 }}
        onClick={() => setDbMenuState(true)}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorDb.current}
        open={dbMenuState}
        onClose={() => setDbMenuState(false)}
      >
        <MenuItem onClick={() => {
          setDbMenuState(false);
          setDbAddDialogState(true);
        }}>
          添加
        </MenuItem>

        <MenuItem
          onClick={() => {
            setDbMenuState(false);
            if (selectedDb) {
              setDbDeleteDialogState(true);
            }
          }}
          disabled={!selectedDb} >
          删除
        </MenuItem>
      </Menu >

      <InputDialog
        open={dbAddDialogState}
        title="添加数据库"
        label="数据库名称"
        onClose={() => setDbAddDialogState(false)}
        onSubmit={async (dbName) => {
          if (dbName) {
            try {
              await dispatch(addDb(dbName));
            } catch (err) {
              console.error('添加数据库失败:', err);
            }
          }
          setDbAddDialogState(false);
        }}
      />

      <ConfirmDialog
        open={dbDeleteDialogState}
        title="确认删除"
        content={`确定要删除数据库 "${selectedDb?.name}" 吗？此操作不可撤销。`}
        onConfirm={async () => {
          if (selectedDb) {
            try {
              await dispatch(deleteSelectDb());
            } catch (err) {
              console.error('删除数据库异常:', err);
            }
          }
          setDbDeleteDialogState(false);
        }}
        onCancel={() => {
          setDbDeleteDialogState(false);
        }}
      />
    </>
  );
}