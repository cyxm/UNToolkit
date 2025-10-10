import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store.js';
import { initializeDatabase, PageState, loadTablesBySelectedDb } from './DbSlice.js';
import {
  Box,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material';
import DatabaseSelector from './DatabaseSelector.js';
import TableSelector from './TableSelector.js';
import FieldEditor from './FieldEditor.js';

export default function Db() {
  const dispatch = useAppDispatch();

  const {
    pageState,
    selectedDb,
  } = useSelector((state: any) => state.db);

  // 监听selectedDb变化，重新加载tableList
  useEffect(() => {
    dispatch(loadTablesBySelectedDb());
  }, [selectedDb, dispatch]);

  // 初始化
  useEffect(() => {
    dispatch(initializeDatabase());
  }, []);

  // 载入页面
  if (pageState === PageState.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2} direction="column" sx={{ flexGrow: 1, height: '100%', p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
        <DatabaseSelector />
        <Divider orientation="vertical" flexItem />
        <TableSelector />
      </Stack>

      <Stack direction="row" sx={{ flexGrow: 1, height: '100%' }}>
        <FieldEditor />
      </Stack>
    </Stack>
  );
}