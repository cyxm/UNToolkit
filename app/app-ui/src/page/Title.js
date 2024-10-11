import React from "react"
import { Stack } from "@mui/material";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";

export default function Title() {
    return (
        <Stack direction="row" backgroundColor={"#f555f5"}>
            <DeleteSharpIcon />
            <h1>Title</h1>
        </Stack>
    )
}