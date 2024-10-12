import React from 'react';
import './IconButton.css';

import { Stack } from '@mui/material'

export default function IconButton({ children, styleName }) {
    return (
        <div className="widget-icon-button ${styleName}">
            {children}
        </div>
    )
}