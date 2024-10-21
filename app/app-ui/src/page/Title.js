import React from "react"
import '../styles.css';
import { Stack, SvgIcon } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MinimizeIcon from '@mui/icons-material/Minimize';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import Button from '@mui/material/Button';

export default function Title({ styleName }) {
    return (
        <Stack direction="row" className={styleName} display={"flex"} justifyContent={"flex-end"}>
            <Button style={{ height: "inherit", width:0,paddingLeft:"50%"}}>
                <HomeRepairServiceIcon fontSize="medium" />
            </Button>
            <MinimizeIcon />
            <CropSquareIcon />
            <CloseIcon />
        </Stack>
    )
}