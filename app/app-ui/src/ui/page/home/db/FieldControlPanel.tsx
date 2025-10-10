import React from 'react';
import {
  Box,
  Stack,
  Button,
  Divider,
} from '@mui/material';

interface FieldControlPanelProps {
  dataType: string;
  selectedTable: string;
  onDataTypeChange: (dataType: string) => void;
  onAddField: () => void;
}

export default function FieldControlPanel({
  dataType,
  selectedTable,
  onDataTypeChange,
  onAddField,
}: FieldControlPanelProps) {
  return (
    <Box sx={{ width: 160, p: 2 }}>
      <Stack spacing={2}>
        <Button
          variant={dataType === 'data' ? 'contained' : 'outlined'}
          onClick={() => onDataTypeChange('data')}
          fullWidth
        >
          数据
        </Button>
        <Button
          variant={dataType === 'primary' ? 'contained' : 'outlined'}
          onClick={() => onDataTypeChange('primary')}
          fullWidth
        >
          主键
        </Button>
        <Button
          variant={dataType === 'foreign' ? 'contained' : 'outlined'}
          onClick={() => onDataTypeChange('foreign')}
          fullWidth
        >
          外键
        </Button>

        <Divider />

        {selectedTable && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onAddField}
            fullWidth
          >
            添加字段
          </Button>
        )}
      </Stack>
    </Box>
  );
}