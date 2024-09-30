import Splitter, { SplitDirection } from "@devbookhq/splitter"
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Button } from "@mui/material";
import { handleClick } from './HomeEvent'
import { useState } from "react";

export default function Home() {
    const [filePath, setFilePath] = useState('filePath')
    return (
        <Splitter direction={SplitDirection.Horizontal} minWidths={[200, 250]} initialSizes={[20, 80]}>
            <SimpleTreeView>
                <TreeItem itemId="grid" label="Data Grid">
                    <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
                    <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                    <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
                </TreeItem>
            </SimpleTreeView>
            <Box itemId="vFunctionContainer">
                <Button onClick={() => handleClick(setFilePath)}>{filePath}111</Button>
            </Box>
        </Splitter>
    );
}