import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  Button,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Table } from './DbSlice.js';

interface TableSelectorProps {
  tableList: Table[];
  selectedTable: string;
  onTableChange: (tableName: string) => void;
  onAddTable: () => void;
  onDeleteTable: (tableName: string) => void;
}

export default function TableSelector({
  tableList,
  selectedTable,
  onTableChange,
  onAddTable,
  onDeleteTable,
}: TableSelectorProps) {
  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Divider orientation="vertical" flexItem />
      
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>表</InputLabel>
        <Select
          label="表"
          value={selectedTable}
          onChange={(e) => onTableChange(e.target.value as string)}
        >
          <MenuItem value="">-- 请选择 --</MenuItem>
          {tableList.map(table => (
            <MenuItem key={table.id} value={table.name}>
              {table.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" sx={{ height: 24, minWidth: 60, ml: 1 }}>总览</Button>
      
      <IconButton
        aria-label="table actions"
        onClick={(e) => setTableAnchorEl(e.currentTarget)}
        sx={{ height: 24, width: 24, ml: 1 }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={tableAnchorEl}
        open={Boolean(tableAnchorEl)}
        onClose={() => setTableAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setTableAnchorEl(null);
          onAddTable();
        }}>添加</MenuItem>
        <MenuItem onClick={() => {
          setTableAnchorEl(null);
          if (selectedTable) {
            onDeleteTable(selectedTable);
          }
        }}>删除</MenuItem>
      </Menu>
    </>
  );
}