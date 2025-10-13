import React from 'react';
import { Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store.js';
import { setFieldEditorDialog, setSelectFieldType, FieldType } from './DbSlice.js';

export default function FieldFunc() {
  const dispatch = useAppDispatch();

  // 直接从Redux store中获取selectedTable和selectFieldType数据
  const { selectedTable, selectFieldType } = useSelector((state: any) => state.db);

  // 处理筛选类型变化
  const handleFilterChange = (event: any) => {
    dispatch(setSelectFieldType(event.target.value));
  };

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1}>
        {selectedTable && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(setFieldEditorDialog({ open: true, field: null }))}
          >
            添加字段
          </Button>
        )}
        {selectedTable && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(setFieldEditorDialog({ open: true, field: null }))}
          >
            添加字段模板
          </Button>
        )}
        {selectedTable && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(setFieldEditorDialog({ open: true, field: null }))}
          >
            添加表模板
          </Button>
        )}
      </Stack>

      <Stack direction="row" spacing={1}>
        {/* 靠右的筛选下拉框 */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel  >筛选</InputLabel>
          <Select
            value={selectFieldType}
            label="筛选"
            size="small"
            onChange={handleFilterChange}
            sx={{
              fontSize: '0.8rem',
            }}
          >
            <MenuItem value={FieldType.All}>全部</MenuItem>
            <MenuItem value={FieldType.Data}>数据</MenuItem>
            <MenuItem value={FieldType.Primary}>主键</MenuItem>
            <MenuItem value={FieldType.Foreign}>外键</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
