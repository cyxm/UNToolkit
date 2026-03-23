import React, { useRef, useState } from 'react';
import { useDbStore, DbType, Database } from '@/store/dbStore';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InputDialog from '@/ui/dialog/InputDialog.js';
import ConfirmDialog from '@/ui/dialog/ConfirmDialog.js';

export default function DatabaseSelector() {
  const { databaseList, selectedDb, dbType, selectDb, addDb, deleteSelectDb, setDbType } = useDbStore();

  //菜单锚点
  const anchorDb = useRef(null);

  //模块状态
  const [dbMenuState, setDbMenuState] = useState(false);
  const [dbAddDialogState, setDbAddDialogState] = useState(false);
  const [dbDeleteDialogState, setDbDeleteDialogState] = useState(false);

  return (
    <>
      {/* 数据库类型下拉框 */}
      <FormControl size="small" sx={{ minWidth: 80, mr: 1 }}>
        <Select
          value={dbType}
          size="small"
          onChange={(event) => setDbType(event.target.value as DbType)}
          sx={{
            fontSize: '0.8rem',
            height: '36px'
          }}
        >
          <MenuItem value={DbType.Common}>通用</MenuItem>
          <MenuItem value={DbType.Template}>模板</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ flex: 1 }} size="small">
        <InputLabel>数据库</InputLabel>
        <Select
          label="数据库"
          value={selectedDb?.id || ''}
          onChange={(e) => selectDb(Number(e.target.value))}
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
              await addDb(dbName);
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
              await deleteSelectDb();
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