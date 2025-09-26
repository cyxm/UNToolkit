import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button
} from '@mui/material';
import { Field } from '@/ui/page/home/db/dbSlice.js';

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fieldData: {
    name: string;
    type: string;
    required: boolean;
    defaultValue: string;
    unique: boolean;
    dataType: 'primary' | 'foreign' | 'data';
  }) => void;
  fieldList: Field[];
}

export default function AddFieldDialog({
  open,
  onClose,
  onSubmit,
  fieldList
}: AddFieldDialogProps) {
  const [dataType, setDataType] = useState<'primary' | 'foreign' | 'data'>('data');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldDefaultValue, setNewFieldDefaultValue] = useState('');
  const [newFieldUnique, setNewFieldUnique] = useState(false);

  useEffect(() => {
    if (open) {
      const hasPrimaryKey = fieldList?.some(field => field.primary);
      const hasIdField = fieldList?.some(field => field.name === 'id');
      const type = hasPrimaryKey || hasIdField ? 'data' : 'primary';
      setDataType(type);
      setNewFieldName(type === 'primary' ? 'id' : '');
      setNewFieldType('');
      setNewFieldRequired(false);
      setNewFieldDefaultValue('');
      setNewFieldUnique(false);
    }
  }, [open, fieldList]);

  const handleSubmit = () => {
    onSubmit({
      name: newFieldName,
      type: newFieldType,
      required: newFieldRequired,
      defaultValue: newFieldDefaultValue,
      unique: newFieldUnique,
      dataType
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>添加字段</DialogTitle>
      <DialogContent>
        <RadioGroup
          row
          value={dataType}
          onChange={(e) => setDataType(e.target.value as 'primary' | 'foreign' | 'data')}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="data" control={<Radio />} label="数据" />
          <FormControlLabel
            value="primary"
            control={<Radio />}
            label="主键"
            disabled={fieldList?.some(field => field.name === 'id' || field.primary)}
          />
          <FormControlLabel value="foreign" control={<Radio />} label="外键" />
        </RadioGroup>
        <TextField
          autoFocus
          margin="dense"
          label="字段名称"
          fullWidth
          variant="standard"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
        />
        {dataType === 'data' && (
          <>
            <FormControl fullWidth margin="dense">
              <InputLabel>类型</InputLabel>
              <Select
                value={newFieldType}
                label="类型"
                onChange={(e) => setNewFieldType(e.target.value as string)}
              >
                <MenuItem value="string">字符串</MenuItem>
                <MenuItem value="int">整数</MenuItem>
                <MenuItem value="float">浮点数</MenuItem>
                <MenuItem value="boolean">布尔值</MenuItem>
                <MenuItem value="datetime">日期时间</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                />
              }
              label="非空"
            />
            <TextField
              margin="dense"
              label="默认值"
              fullWidth
              variant="standard"
              value={newFieldDefaultValue}
              onChange={(e) => setNewFieldDefaultValue(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newFieldUnique}
                  onChange={(e) => setNewFieldUnique(e.target.checked)}
                />
              }
              label="唯一"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit}>添加</Button>
      </DialogActions>
    </Dialog>
  );
}
