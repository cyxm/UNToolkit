import React from "react"
import '../styles.css';
import { Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import IconButton from "../widget/icon/IconButton";

export default function Title({ styleName }) {
    return (
        <Stack direction="row" className={styleName}>
            <IconButton styleName="test">
                <HomeRepairServiceIcon />
            </IconButton>
            <MinimizeIcon />
            <CropSquareIcon />
            <CloseIcon />
        </Stack>
    )
}