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
import { Button, Stack, IconButton } from "@mui/material";
import React from "react";
import { Title } from "@/ui/frag/title/Title.js";
import { useTheme } from "@/theme/ThemeProvider.js";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Home() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Stack direction={"column"} sx={{ height: '100%' }}>
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
                height: 'calc(100% - 64px)'
            }}>
                <Panel defaultSize={20} minSize={20}>
                    <Box sx={{
                        p: 2,
                        height: '100%',
                        color: 'var(--text-color)'
                    }}>
                        <List component="nav">
                            <ListSubheader>数据功能</ListSubheader>
                            <ListItem component="div">
                                <ListItemIcon>
                                    <GridOnIcon />
                                </ListItemIcon>
                                <ListItemText primary="数据表格" />
                            </ListItem>
                            <ListItem component="div">
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="数据分析" />
                            </ListItem>

                            <ListSubheader>系统设置</ListSubheader>
                            <ListItem component="div">
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="系统配置" />
                            </ListItem>
                        </List>
                    </Box>
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel defaultSize={80}>
                    <Box component={"div"} itemID="vFunctionContainer" sx={{ height: '100%' }}>
                        <Button onClick={() => { }}>发送事件</Button>
                    </Box>
                </Panel>
            </PanelGroup>
        </Stack>
    );
}