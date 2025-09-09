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
  Alert
} from '@mui/material';
import type { ElectronAPI } from "@un/tool-protocol/electron_api"

export default function Db() {
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [dbReadStatus, setDbReadStatus] = useState<'unread' | 'read'>('unread');

  useEffect(() => {
    window.electron.db.start()

    const result = window.electron.db.executeQuery("");
    console.log(result.data)

    return () => {
      window.electron.db.end()
    }
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2} direction="column" sx={{ flexGrow: 1, height: '100%', p: 2 }}>
      {/* 上半部分：数据库选择和SQL输入 */}
      <FormControl>
        <InputLabel id="database-select-label">选择数据库</InputLabel>
        <Select
          labelId="database-select-label"
          id="database-select"
          label="选择数据库"
        >
        </Select>
      </FormControl>

      <TextField
        placeholder="请输入SQL语句..."
        sx={{ height: '64px' }}
      />

      <Stack sx={{ flexGrow: 1, height: '100%' }}>
        {/* 下半部分：SQL执行结果 */}
        <Box sx={{
          flexGrow: 1,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          minHeight: 0,
          p: 2,
          overflow: 'auto'
        }}>
          {queryResult && (
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          )}
        </Box>
      </Stack>

      {/* 数据库读取状态栏 */}
      <Box
        sx={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: dbReadStatus === 'read' ? 'success.main' : 'error.main',
          color: 'white',
          borderRadius: 1
        }}
      >
        {dbReadStatus === 'read' ? '数据库已读取' : '数据库未读取'}
      </Box>
    </Stack>
  );
}
