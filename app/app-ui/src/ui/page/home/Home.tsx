import Splitter, { SplitDirection } from "@devbookhq/splitter"
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Button, Stack, IconButton } from "@mui/material";
import React from "react";
import { Title } from "@/ui/frag/title/Title.js";
import { useTheme } from "@/theme/ThemeProvider.js";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Home() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Stack direction={"column"}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Title />
                <IconButton onClick={toggleTheme} color="inherit">
                    {theme.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Stack>
            <Box height={"40px"} component={"div"} sx={{
                backgroundColor: 'var(--primary-color)',
                width: "100%"
            }}>
                <Splitter direction={SplitDirection.Horizontal} minWidths={[100, 100]} initialSizes={[20, 80]}>
                    <SimpleTreeView sx={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--text-color)'
                    }}>
                        <TreeItem itemId="grid" label="Data Grid">
                            <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
                            <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                            <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
                        </TreeItem>
                    </SimpleTreeView>
                    <Box component={"div"} itemID="vFunctionContainer">
                        <Button onClick={() => { }}>发送事件</Button>
                    </Box>
                </Splitter>
            </Box>
        </Stack>
    );
}