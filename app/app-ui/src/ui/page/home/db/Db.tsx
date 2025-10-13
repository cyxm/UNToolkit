import React, { useEffect, } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store.js';
import {
  initDb,
  loadTablesBySelectedDb,
  loadFieldsBySelectedTable,
  setFieldEditorDialog,
  addOrUpdateField,
  DbType,
} from './DbSlice.js';
import {
  Box,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material';
import DatabaseSelector from './DatabaseSelector.js';
import TableSelector from './TableSelector.js';
import FieldTable from './FieldTable.js';
import AddFieldDialog from './AddFieldDialog.js';
import FieldFunc from './FieldFunc.js';

export default function Db() {
  const dispatch = useAppDispatch();

  const {
    selectedDb,
    selectedTable,
    fieldEditorDialog,
    fieldList,
    dbType
  } = useSelector((state: any) => state.db);

  // 初始化：仅根据当前 dbType 初始化一次
  useEffect(() => {
    dispatch(initDb());
  }, [dbType, dispatch]);

  // 监听selectedDb变化，重新加载tableList
  useEffect(() => {
    dispatch(loadTablesBySelectedDb());
  }, [selectedDb, dispatch]);

  useEffect(() => {
    dispatch(loadFieldsBySelectedTable());
  }, [selectedTable, dispatch]);

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      <Stack spacing={2} direction="column" sx={{ flexGrow: 1, height: '100%', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
          <DatabaseSelector />
          <Divider orientation="vertical" flexItem />
          <TableSelector />
        </Stack>

        {selectedTable && <FieldFunc />}

        <Stack direction="row" sx={{ flexGrow: 1, height: '100%' }}>
          <FieldTable />
        </Stack>
      </Stack>

      <AddFieldDialog
        startParam={fieldEditorDialog}
        onClose={() => dispatch(setFieldEditorDialog({ open: false, field: null }))}
        onSubmit={(fieldData) => {
          dispatch(addOrUpdateField(fieldData));
        }}
        fieldList={fieldList}
      />
    </Box>
  );
}