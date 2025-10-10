import React from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Field } from './DbSlice.js';

interface FieldTableProps {
  fieldList: Field[];
  dataType: string;
  tableLoading: boolean;
  onEditField: (field: Field) => void;
  onDeleteField: (field: Field) => void;
}

export default function FieldTable({
  fieldList,
  dataType,
  tableLoading,
  onEditField,
  onDeleteField,
}: FieldTableProps) {
  if (tableLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ flex: 1 }}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width="30%">域名</TableCell>
            <TableCell align="center" width="20%">类型</TableCell>
            <TableCell align="center" width="10%">非空</TableCell>
            <TableCell align="center" width="10%">默认</TableCell>
            <TableCell align="center" width="10%">唯一</TableCell>
            <TableCell align="center" width="20%">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fieldList?.map((field, index) => {
            // 根据数据类型过滤显示
            const showField =
              (dataType === 'primary' && field.isPrimary) ||
              (dataType === 'foreign' && field.isPrimary) || // 暂时使用primary字段表示foreign key
              (dataType === 'data' && !field.isPrimary);

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
                <TableCell component="th" scope="row" width="30%">
                  {field.name}
                </TableCell>
                <TableCell width="20%" align="center">
                  {field.type}
                  {field.isPrimary && <Chip label="主键" size="small" sx={{ ml: 1 }} />}
                </TableCell>
                <TableCell width="10%" align="center">{field.required ? '是' : '否'}</TableCell>
                <TableCell width="10%" align="center">{field.defaultValue || '-'}</TableCell>
                <TableCell width="10%" align="center">{field.isUnique ? '是' : '否'}</TableCell>
                <TableCell width="20%" align="center">
                  <IconButton size="small" onClick={() => onEditField(field)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteField(field)}
                    disabled={!!field.isPrimary} // 主键字段不允许删除
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