import * as React from 'react';
import { Button } from '@mui/material'

export default function ComboBox() {
    return (
        <>
            <Button variant="text">Text</Button>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
        </>
    );
}