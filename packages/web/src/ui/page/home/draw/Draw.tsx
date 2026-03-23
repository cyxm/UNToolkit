import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Draw() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        绘图功能
      </Typography>
      <Typography>
        这里是绘图功能页面，后续将添加绘图功能实现。
      </Typography>
    </Box>
  );
}
