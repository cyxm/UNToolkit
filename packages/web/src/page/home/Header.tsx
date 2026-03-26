import React from 'react';
import { Stack, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useHomeStore } from './homeStore.js';

export default function Header() {
  const { themeMode, toggleTheme } = useHomeStore();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1,
      backgroundColor: 'background.paper',
      padding: '0 16px'
    }}>
      <IconButton onClick={toggleTheme} color="inherit">
        {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Stack>
  );
}
