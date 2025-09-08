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

export default function Sql() {
  const [database, setDatabase] = useState('');
  const [loading, setLoading] = useState(true);
  const [databases, setDatabases] = useState<Array<{ id: string, name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<any>(null);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const dbs = await window.electron.sql.getDatabases();
        setDatabases(dbs);
        setLoading(false);
      } catch (err) {
        console.error('获取数据库列表失败:', err);
        setError('获取数据库列表失败');
        setLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDatabase(event.target.value as string);
  };

  const handleQuerySubmit = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && database) {
      try {
        const result = await window.electron.sql.executeQuery(database, (event.target as HTMLInputElement).value);
        setQueryResult(result);
      } catch (err) {
        console.error('执行SQL查询失败:', err);
        setError('执行SQL查询失败');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
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
          value={database}
          label="选择数据库"
          onChange={handleChange}
        >
          {databases.map((db) => (
            <MenuItem key={db.id} value={db.id}>{db.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        placeholder="请输入SQL语句..."
        sx={{ height: '64px' }}
        onKeyDown={handleQuerySubmit}
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
    </Stack>
  );
}
