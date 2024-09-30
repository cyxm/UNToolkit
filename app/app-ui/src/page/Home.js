import Splitter, { SplitDirection } from "@devbookhq/splitter"
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Button, Grid2, Stack } from "@mui/material";
import Title from './Title'
import { handleClick } from './HomeEvent'
import { useState } from "react";

export default function Home() {
    const [filePath, setFilePath] = useState('filePath')
    return (
        <Grid2 container>
            <Title height={"40px"} />
            <Box size={12} height={"40px"} backgroundColor={"#1155f5"}>
                <Splitter direction={SplitDirection.Horizontal} minWidths={[100, 100]} initialSizes={[20, 80]}>
                    <SimpleTreeView backgroundColor={"#1155f5"}>
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
            </Box>
        </Grid2 >
    );
}