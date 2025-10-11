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
import { Field, FieldType } from '@/ui/page/home/db/DbSlice.js';

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fieldData: Field) => void;
  fieldList: Field[];
}

export default function AddFieldDialog({
  open,
  onClose,
  onSubmit,
  fieldList,
}: AddFieldDialogProps) {

  const initField = {
    id: undefined,
    create_time: undefined,
    update_time: undefined,
    enable: 1,
    name: '',
    table_id: undefined,
    type: '',
    primary: 0,
    auto_increment: 0,
    not_null: 0,
    unique: 0,
    default: '',
    is_index: 0,
    ex_foreign: 0,
  }
  const [fieldData, setFieldData] = useState<Field>(initField);
  const [dataType, setDataType] = useState<FieldType>(FieldType.Data);

  useEffect(() => {
    if (open) {
      setFieldData(initField);
    }
  }, [open]);

  useEffect(() => {
    if (dataType === FieldType.Primary) {
      setFieldData({ ...fieldData, name: 'id', primary: 1, auto_increment: 1, type: 'int' });
    } else {
      setFieldData({ ...fieldData, name: '', primary: 0, auto_increment: 0 });
    }
  }, [dataType]);

  const handleSubmit = () => {
    onSubmit({
      ...fieldData
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{'添加字段'}</DialogTitle>
      <DialogContent>
        <RadioGroup
          row
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value as FieldType);
          }}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value={FieldType.Data} control={<Radio />} label="数据" />
          <FormControlLabel
            value={FieldType.Primary}
            control={<Radio />}
            label="主键"
            disabled={fieldList?.some(field => field.name === 'id' || field.primary)}
          />
          <FormControlLabel value={FieldType.Foreign} control={<Radio />} label="外键" />
        </RadioGroup>
        <TextField
          autoFocus
          margin="dense"
          label="字段名称"
          fullWidth
          variant="standard"
          value={fieldData.name || ''}
          onChange={(e) => { setFieldData({ ...fieldData, name: e.target.value }) }}
        />

        {dataType === FieldType.Data && (
          <>
            <FormControl fullWidth margin="dense">
              <InputLabel>类型</InputLabel>
              <Select
                value={fieldData.type || ''}
                label="类型"
                onChange={(e) => { setFieldData({ ...fieldData, type: e.target.value }) }}
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
                  checked={fieldData.not_null === 1}
                  onChange={() => { setFieldData({ ...fieldData, not_null: fieldData.not_null === 1 ? 0 : 1 }) }}
                />
              }
              label="非空"
            />
            <TextField
              margin="dense"
              label="默认值"
              fullWidth
              variant="standard"
              onChange={(e) => { setFieldData({ ...fieldData, default: e.target.value }) }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldData.unique === 1}
                  onChange={() => { setFieldData({ ...fieldData, unique: fieldData.unique === 1 ? 0 : 1 }) }}
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