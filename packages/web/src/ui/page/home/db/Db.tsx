import React, { useEffect, } from 'react';
import { useDbStore, DbType } from '@/store/dbStore';
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
  const {
    selectedDb,
    selectedTable,
    fieldEditorDialog,
    fieldList,
    dbType,
    initDb,
    loadTablesBySelectedDb,
    loadFieldsBySelectedTable,
    setFieldEditorDialog,
    addOrUpdateField
  } = useDbStore();

  // 初始化：仅根据当前 dbType 初始化一次
  useEffect(() => {
    initDb();
  }, [dbType, initDb]);

  // 监听selectedDb变化，重新加载tableList
  useEffect(() => {
    loadTablesBySelectedDb();
  }, [selectedDb, loadTablesBySelectedDb]);

  useEffect(() => {
    loadFieldsBySelectedTable();
  }, [selectedTable, loadFieldsBySelectedTable]);

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
        onClose={() => setFieldEditorDialog({ open: false, field: null })}
        onSubmit={(fieldData) => {
          addOrUpdateField(fieldData);
        }}
        fieldList={fieldList}
      />
    </Box>
  );
}