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
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDbStore, Field, FieldType } from '@/store/dbStore';

// 定义表格列宽度数组
const COLUMN_WIDTHS = [
  '15%', // 域名
  '6%', // 类型
  '15%', // 默认
  '4%', // 非空
  '4%', // 唯一
  '10%', // 时间
  '10%', // 操作
];

// 定义通用的单元格样式
const COMMON_CELL_STYLE = {
  borderRight: '1px solid rgba(224, 224, 224, 1)'
};

// 格式化时间戳为日期字符串
const formatDate = (timestamp: number | undefined | null): string => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN');
};

export default function FieldTable() {
  const { fieldList, selectFieldType, deleteField, setFieldEditorDialog } = useDbStore();

  return (
    <TableContainer component={Paper} sx={{ flex: 1 }}>
      <Table stickyHeader aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" width={COLUMN_WIDTHS[0]} sx={COMMON_CELL_STYLE}>域名</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[1]} sx={COMMON_CELL_STYLE}>类型</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[2]} sx={COMMON_CELL_STYLE}>默认</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[3]} sx={COMMON_CELL_STYLE}>非空</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[4]} sx={COMMON_CELL_STYLE}>唯一</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[5]} sx={COMMON_CELL_STYLE}>时间</TableCell>
            <TableCell align="center" width={COLUMN_WIDTHS[6]}>操作</TableCell>
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
                  height: '36px', // 缩小行高
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
                  align="center"
                  sx={{ ...COMMON_CELL_STYLE, padding: '4px 8px' }} // 减小内边距
                >
                  {field.name}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[1]}
                  align="center"
                  sx={{ ...COMMON_CELL_STYLE, padding: '4px 8px' }} // 减小内边距
                >
                  {field.type}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[2]}
                  align="center"
                  sx={{ ...COMMON_CELL_STYLE, padding: '4px 8px' }} // 减小内边距
                >
                  {field.default || '-'}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[3]}
                  align="center"
                  sx={{ ...COMMON_CELL_STYLE, padding: '4px 8px' }} // 减小内边距
                >
                  {field.not_null ? '是' : '否'}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[4]}
                  align="center"
                  sx={{ ...COMMON_CELL_STYLE, padding: '4px 8px' }} // 减小内边距
                >
                  {field.unique ? '是' : '否'}
                </TableCell>
                <TableCell
                  width={COLUMN_WIDTHS[5]}
                  align="center"
                  sx={{ ...COMMON_CELL_STYLE, padding: '4px 8px' }} // 减小内边距
                >
                  <Typography variant="body2">
                    c: {formatDate(field.create_time)}
                  </Typography>
                  <Typography variant="body2">
                    u: {formatDate(field.update_time)}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ padding: '4px 8px' }} // 减小内边距
                  width={COLUMN_WIDTHS[6]}
                >
                  <IconButton
                    size="small"
                    onClick={() => setFieldEditorDialog({ open: true, field: field })}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      deleteField(field.id ?? 0);
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