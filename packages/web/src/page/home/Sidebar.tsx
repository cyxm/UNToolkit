import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Button } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from './homeStore.js';

// 图标映射
const iconMap = {
  StorageIcon: StorageIcon,
  ApiIcon: ApiIcon,
  GridOnIcon: GridOnIcon,
  BarChartIcon: BarChartIcon
};

export default function Sidebar() {
  const { menuItems, selectedMenuItem, setSelectedMenuItem } = useHomeStore();
  const navigate = useNavigate();

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item.id);
    navigate(item.path);
  };

  return (
    <Box sx={{
      p: 2,
      height: '100%'
    }}>
      <List component="nav">
        <ListSubheader>基础功能</ListSubheader>
        {menuItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <ListItem
              key={item.id}
              component={Button}
              onClick={() => handleMenuItemClick(item)}
              sx={{
                backgroundColor: selectedMenuItem === item.id ? 'action.selected' : 'transparent'
              }}
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
