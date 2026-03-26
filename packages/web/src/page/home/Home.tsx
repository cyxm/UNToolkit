import './Home.css';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Stack } from "@mui/material";
import React from "react";
import Header from './Header.js';
import Sidebar from './Sidebar.js';
import Content from './Content.js';

export default function Home() {
    return (
        <Stack direction="column" sx={{
            flexGrow: 1,
            height: '100%'
        }}>
            {/* 标题栏 */}
            <Header />

            {/* 内容区域 */}
            <PanelGroup direction="horizontal" style={{
                flexGrow: 1,
                display: 'flex',
                height: '100%'
            }}>
                <Panel defaultSize={20} minSize={20}>
                    <Sidebar />
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel>
                    <Content />
                </Panel>
            </PanelGroup>
        </Stack>
    );
}