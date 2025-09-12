import './home.css';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import GridOnIcon from '@mui/icons-material/GridOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import { Button, Stack, IconButton } from "@mui/material";
import React from "react";
import { Title } from "@/ui/frag/title/Title.js";
import { useTheme } from "@/theme/ThemeProvider.js";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Home() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <Stack direction={"column"} sx={{
            flexGrow: 1,
            height: '100%'
        }}>
            {/* 标题栏 */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                boxShadow: theme.customShadows.header,
                zIndex: 1,
                backgroundColor: 'background.paper'
            }}>
                <Title />
                <IconButton onClick={toggleTheme} color="inherit">
                    {theme.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Stack>

            {/* 内容区域 */}
            <PanelGroup direction="horizontal" style={{
                flexGrow: 1,
                display: 'flex',
                height: '100%'
            }}>
                <Panel defaultSize={20} minSize={20}>
                    <Box sx={{
                        p: 2,
                        height: '100%'
                    }}>
                        <List component="nav">
                            <ListSubheader>基础功能</ListSubheader>
                            <ListItem
                                component={Button}
                                onClick={() => navigate('cmd')}
                            >
                                <ListItemIcon>
                                    <GridOnIcon />
                                </ListItemIcon>
                                <ListItemText primary="命令行管理" />
                            </ListItem>
                            <ListItem
                                component={Button}
                                onClick={() => navigate('db')}
                            >
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                                <ListItemText primary="DB设计" />
                            </ListItem>
                            <ListItem
                                component={Button}
                                onClick={() => navigate('api')}
                            >
                                <ListItemIcon>
                                    <ApiIcon />
                                </ListItemIcon>
                                <ListItemText primary="API调用" />
                            </ListItem>
                        </List>
                    </Box>
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel>
                    <Box sx={{ height: '100%' }}>
                        <Outlet />
                    </Box>
                </Panel>
            </PanelGroup>
        </Stack>
    );
}