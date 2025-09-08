import React from "react";
import { Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import IconButton from '@mui/material/IconButton';

import "./Title.css";

export class Title extends React.Component {
    render() {
        function handleMin() {
            window.electron.window.min();
        }

        function handleMax() {
            window.electron.window.max();
        }

        function handleClose() {
            window.electron.window.close();
        }

        return (
            <Stack direction="row" style={{
                width: "100%",
                height: "32px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <IconButton>
                    <HomeRepairServiceIcon />
                </IconButton>
                <div className="draggable" style={{ height: "inherit", flexGrow: 1 }}></div>
                <IconButton onClick={handleMin}>
                    <MinimizeIcon />
                </IconButton>
                <IconButton onClick={handleMax}>
                    <CropSquareIcon />
                </IconButton>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Stack>
        )
    }
}