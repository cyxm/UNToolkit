import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Field, FieldType, deleteField, setFieldEditorDialog } from './DbSlice.js';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store.js';

// 定义表格列宽度数组
const COLUMN_WIDTHS = [
  '15%', // 域名
  '10%', // 类型
  '15%', // 默认
  '10%', // 非空
  '10%', // 唯一
  '20%', // 操作
];

// 定义通用的单元格样式
const COMMON_CELL_STYLE = {
  borderRight: '1px solid rgba(224, 224, 224, 1)'
};

export default function FieldTable() {
  const { fieldList, selectFieldType } = useSelector((state: any) => state.db);
  const dispatch = useAppDispatch();

  return (
    <TableContainer component={Paper} sx={{ flex: 1 }}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={COLUMN_WIDTHS[0]} sx={COMMON_CELL_STYLE}>域名</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[1]} sx={COMMON_CELL_STYLE}>类型</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[2]} sx={COMMON_CELL_STYLE}>默认</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[3]} sx={COMMON_CELL_STYLE}>非空</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[4]} sx={COMMON_CELL_STYLE}>唯一</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[5]}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fieldList?.map((field: Field, index: number) => {
            let showField = false;
            switch (selectFieldType) {
              case FieldType.Data:
                showField = field.primary !== 1;
                break;
              case FieldType.Primary:
                showField = field.primary === 1;
                break;
              case FieldType.Foreign:
                showField = !!field.name?.endsWith('_id');
                break;
              default:
                showField = true;
                break;
            }

            if (!showField) return null;

            return (
              <TableRow
                key={field.id}
                sx={{
                  backgroundColor: (theme) =>
                    index % 2 === 0
                      ? theme.palette.background.default
                      : theme.palette.action.hover
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  width={COLUMN_WIDTHS[0]}
                  sx={COMMON_CELL_STYLE}
                >
                  {field.name}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[1]}
                  align="center"
                  sx={COMMON_CELL_STYLE}
                >
                  {field.type}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[2]}
                  align="center"
                  sx={COMMON_CELL_STYLE}
                >
                  {field.default || '-'}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[3]}
                  align="center"
                  sx={COMMON_CELL_STYLE}
                >
                  {field.not_null ? '是' : '否'}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[4]}
                  align="center"
                  sx={COMMON_CELL_STYLE}
                >
                  {field.unique ? '是' : '否'}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[5]}
                  align="center"
                >
                  <IconButton
                    size="small"
                    onClick={() => dispatch(setFieldEditorDialog({ open: true, field: field }))}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      dispatch(deleteField(field.id ?? 0));
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}