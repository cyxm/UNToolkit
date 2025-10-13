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
  Button,
  Box
} from '@mui/material';
import { Field, FieldType } from '@/ui/page/home/db/DbSlice.js';
import { FieldEditorStartParam } from './DbSlice.js';

interface AddFieldDialogProps {
  startParam: FieldEditorStartParam;
  onClose: () => void;
  onSubmit: (fieldData: Field) => void;
  fieldList: Field[];
}

export default function AddFieldDialog({
  startParam,
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
  };

  const [fieldData, setFieldData] = useState<Field>(initField);
  const [dataType, setDataType] = useState<FieldType>(FieldType.Data);

  useEffect(() => {
    if (startParam.open) {
      if (startParam.field) {
        setFieldData(startParam.field);
        // 根据字段信息确定模板
        if (startParam.field.primary === 1) {
          setDataType(FieldType.Primary);
        } else if (startParam.field.name === 'created_at') {
          setDataType(FieldType.Data);
        } else if (startParam.field.name === 'updated_at') {
          setDataType(FieldType.Data);
        } else if (startParam.field.name?.endsWith('_id')) {
          setDataType(FieldType.Foreign);
        } else {
          setDataType(FieldType.Data);
        }
      } else {
        // 新建字段，默认使用基本信息模板
        setFieldData(initField);
        setDataType(FieldType.Data);
      }
    }
  }, [startParam]);

  const handleSubmit = () => {
    onSubmit({
      ...fieldData
    });
    onClose();
  };

  return (
    <Dialog open={startParam.open} onClose={onClose}>
      <DialogTitle>{'添加字段'}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Box>
            <RadioGroup
              row
              value={dataType}
              onChange={(e) => {
                setDataType(e.target.value as FieldType);
              }}
            >
              <FormControlLabel
                value={FieldType.Data}
                control={<Radio />}
                label="数据"
                disabled={fieldData.id !== undefined} />

              <FormControlLabel
                value={FieldType.Primary}
                control={<Radio />}
                label="主键"
                disabled={fieldData.id !== undefined || fieldList?.some(field => field.name === 'id' || field.primary)}
              />

              <FormControlLabel
                value={FieldType.Foreign}
                control={<Radio />}
                label="外键"
                disabled={fieldData.id !== undefined}
              />
            </RadioGroup>

            <TextField
              autoFocus
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
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fieldData.not_null === 1}
                        onChange={() => { setFieldData({ ...fieldData, not_null: fieldData.not_null === 1 ? 0 : 1 }) }}
                      />
                    }
                    label="非空"
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
                </Box>
                <TextField
                  label="默认值"
                  fullWidth
                  variant="standard"
                  value={fieldData.default || ''}
                  onChange={(e) => { setFieldData({ ...fieldData, default: e.target.value }) }}
                />
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit}>添加</Button>
      </DialogActions>
    </Dialog>
  );
}