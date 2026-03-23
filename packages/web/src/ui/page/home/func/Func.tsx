import React, { useState, useEffect } from 'react';
import { useFuncStore, PageState } from '@/store/funcStore';
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

export default function Func() {
  const { pageState, setPageState } = useFuncStore();
  const [endpoint, setEndpoint] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [apiResult, setApiResult] = useState(null);

  const handleChange = (event) => {
    setEndpoint(event.target.value);
  };

  const handleApiCall = (event) => {
    // 处理API调用逻辑
  };

  // 初始化
  useEffect(() => {
    const init = async () => {
      try {
        setPageState(PageState.loading);

        setPageState(PageState.loaded);
      } catch (err) {
        console.error('获取API端点失败:', err);
        setPageState(PageState.loaded);
      }
    };

    init();
  }, [setPageState]);

  if (pageState === PageState.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
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
