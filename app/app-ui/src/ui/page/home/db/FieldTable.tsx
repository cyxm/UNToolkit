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
import { Field, FieldType, deleteField } from './DbSlice.js';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store.js';

export default function FieldTable() {
  const { fieldList, selectFieldType } = useSelector((state: any) => state.db);
  const dispatch = useAppDispatch();

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
                <TableCell component="th" scope="row" width="30%">
                  {field.name}
                </TableCell>
                <TableCell width="20%" align="center">
                  {field.type}
                  {field.primary && <Chip label="主键" size="small" sx={{ ml: 1 }} />}
                </TableCell>
                <TableCell width="10%" align="center">{field.not_null ? '是' : '否'}</TableCell>
                <TableCell width="10%" align="center">{field.default || '-'}</TableCell>
                <TableCell width="10%" align="center">{field.unique ? '是' : '否'}</TableCell>
                <TableCell width="20%" align="center">
                  <IconButton
                    size="small"
                    onClick={() => {
                      // 编辑字段的逻辑将在FieldControlPanel中处理
                      console.log('编辑字段:', field);
                    }}
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