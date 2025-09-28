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

declare global {
  interface Window {
    electron: {
      api: {
        getApiEndpoints: () => Promise<Array<{ id: string, name: string }>>;
        callApi: (endpoint: string, params: string) => Promise<any>;
      };
    };
  }
}

export default function Func() {
  const [endpoint, setEndpoint] = useState('');
  const [loading, setLoading] = useState(true);
  const [endpoints, setEndpoints] = useState<Array<{ id: string, name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<any>(null);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const eps = await window.electron.api.getApiEndpoints();
        setEndpoints(eps);
        setLoading(false);
      } catch (err) {
        console.error('获取API端点失败:', err);
        setError('获取API端点失败');
        setLoading(false);
      }
    };

    fetchEndpoints();
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEndpoint(event.target.value as string);
  };

  const handleApiCall = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && endpoint) {
      try {
        const result = await window.electron.api.callApi(endpoint, (event.target as HTMLInputElement).value);
        setApiResult(result);
      } catch (err) {
        console.error('调用API失败:', err);
        setError('调用API失败');
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
      <FormControl>
        <InputLabel id="api-select-label">选择API端点</InputLabel>
        <Select
          labelId="api-select-label"
          id="api-select"
          value={endpoint}
          label="选择API端点"
          onChange={handleChange}
        >
          {endpoints.map((ep) => (
            <MenuItem key={ep.id} value={ep.id}>{ep.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        placeholder="请输入API参数(JSON格式)..."
        sx={{ height: '64px' }}
        onKeyDown={handleApiCall}
      />

      <Stack sx={{ flexGrow: 1, height: '100%' }}>
        <Box sx={{
          flexGrow: 1,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          minHeight: 0,
          p: 2,
          overflow: 'auto'
        }}>
          {apiResult && (
            <pre>{JSON.stringify(apiResult, null, 2)}</pre>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
