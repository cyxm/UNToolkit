import Splitter, { SplitDirection } from "@devbookhq/splitter"
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Button, Stack } from "@mui/material";
import React from "react";
import { Title } from "../../frag/title/Title";

export default class Home extends React.Component {
    render() {
        return (
            <Stack direction={"column"}>
                <Title />
                <Box height={"40px"} component={"div"} sx={{ backgroundColor: "#1100f5", width: "100%" }}>
                    <Splitter direction={SplitDirection.Horizontal} minWidths={[100, 100]} initialSizes={[20, 80]}>
                        <SimpleTreeView sx={{ backgroundColor: "#1155f5" }}>
                            <TreeItem itemId="grid" label="Data Grid">
                                <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
                                <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                                <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
                            </TreeItem>
                        </SimpleTreeView>
                        <Box component={"div"} itemID="vFunctionContainer">
                            <Button>111</Button>
                        </Box>
                    </Splitter>
                </Box>
            </Stack >
        )
    }
}
// export const Home: React.FC = () => {
//     return (
//         <Stack direction={"column"}>
//             <Title />
//             <Box size={12} height={"40px"} backgroundColor={"#1155f5"}>
//                 <Splitter direction={SplitDirection.Horizontal} minWidths={[100, 100]} initialSizes={[20, 80]}>
//                     <SimpleTreeView backgroundColor={"#1155f5"}>
//                         <TreeItem itemId="grid" label="Data Grid">
//                             <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
//                             <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
//                             <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
//                         </TreeItem>
//                     </SimpleTreeView>
//                     <Box itemId="vFunctionContainer">
//                         <Button onClick={() => handleClick(setFilePath)}>{filePath}111</Button>
//                     </Box>
//                 </Splitter>
//             </Box>
//         </Stack >
//     )
// }