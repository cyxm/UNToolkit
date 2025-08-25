import Splitter, { SplitDirection } from "@devbookhq/splitter"
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Button, Stack } from "@mui/material";
import React from "react";
import { Title } from "@/frag/title/Title";
// import { HomeEventManager } from "./event";

export default class Home extends React.Component {
    // private eventManager = HomeEventManager.getInstance();

    componentDidMount() {
        // 监听数据更新事件
        // this.eventManager.onDataUpdate(this.handleDataUpdate);
    }

    componentWillUnmount() {
        // 清理事件监听
        // this.eventManager.cleanup();
    }

    handleDataUpdate = (data: { data: any }) => {
        console.log('Received updated data:', data);
        // 处理数据更新...
    };

    handleSendEvent = () => {
        // 发送模块动作事件
        // this.eventManager.sendAction('test action');
        
        // // 获取数据
        // this.eventManager.fetchData().then(response => {
        //     console.log('Fetched data:', response);
        // });
    };

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
                            <Button onClick={this.handleSendEvent}>发送事件</Button>
                        </Box>
                    </Splitter>
                </Box>
            </Stack >
        )
    }
}