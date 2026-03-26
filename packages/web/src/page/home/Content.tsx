import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function Content() {
  return (
    <Box sx={{
      height: '100%',
      backgroundColor: '#f5f9ff' // 更淡的蓝色背景
    }}>
      <Outlet />
    </Box>
  );
}
