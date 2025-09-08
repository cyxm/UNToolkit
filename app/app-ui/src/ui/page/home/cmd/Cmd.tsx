import React, { useState } from 'react';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';

export default function Cmd() {
  const [program, setProgram] = useState('');

  const handleChange = (event) => {
    setProgram(event.target.value);
  };

  return (
    <Stack spacing={2} direction="column" sx={{ flexGrow: 1, height: '100%', p: 2 }}>
      {/* 上半部分：类别选择和程序选择 */}
      <FormControl>
        <InputLabel id="program-select-label">选择命令行程序</InputLabel>
        <Select
          labelId="program-select-label"
          id="program-select"
          value={program}
          label="选择命令行程序"
          onChange={handleChange}
        >
          <MenuItem value="cmd1">ADB</MenuItem>
        </Select>
      </FormControl>

      <TextField
        placeholder="请输入命令..."
        sx={{ height: '64px' }}
      />

      <Stack sx={{ flexGrow: 1, height: '100%' }}>
        {/* 下半部分的上半部分：留白 */}
        <Box sx={{
          flexGrow: 1,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          minHeight: 0 // 防止内容溢出
        }} />
      </Stack>
    </Stack>
  );
}
