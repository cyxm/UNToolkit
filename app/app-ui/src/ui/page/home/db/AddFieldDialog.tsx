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

// 模板定义
interface Template {
  name: string;
  type: FieldType;
  fieldType?: string;
  notNull?: boolean;
  unique?: boolean;
  defaultValue?: string;
}

const templates: Template[] = [
  {
    name: '基本信息',
    type: FieldType.Data,
    fieldType: 'string',
    notNull: false,
    unique: false,
    defaultValue: ''
  },
  {
    name: '主键',
    type: FieldType.Primary,
    fieldType: 'int'
  },
  {
    name: '外键',
    type: FieldType.Foreign,
    fieldType: 'int',
    notNull: true
  },
  {
    name: '创建时间',
    type: FieldType.Data,
    fieldType: 'datetime',
    notNull: true,
    defaultValue: 'CURRENT_TIMESTAMP'
  },
  {
    name: '更新时间',
    type: FieldType.Data,
    fieldType: 'datetime',
    notNull: true,
    defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
];

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
  const [templateId, setTemplateId] = useState<number>(0);

  // 根据模板ID应用模板
  const applyTemplate = (templateId: number) => {
    const template = templates[templateId];
    if (!template) return;

    let updatedField = { ...fieldData };

    // 设置数据类型
    setDataType(template.type);

    // 根据类型设置通用属性
    if (template.type === FieldType.Primary) {
      updatedField = {
        ...updatedField,
        name: 'id',
        primary: 1,
        auto_increment: 1,
        type: template.fieldType || 'int'
      };
    } else {
      updatedField = {
        ...updatedField,
        primary: 0,
        auto_increment: 0,
        type: template.fieldType || updatedField.type
      };

      // 数据字段特有属性
      if (template.type === FieldType.Data) {
        updatedField = {
          ...updatedField,
          not_null: template.notNull ? 1 : 0,
          unique: template.unique ? 1 : 0,
          default: template.defaultValue || ''
        };
      }

      // 外键字段
      if (template.type === FieldType.Foreign) {
        updatedField.not_null = template.notNull ? 1 : 0;
      }
    }

    setFieldData(updatedField);
  };

  useEffect(() => {
    if (startParam.open) {
      if (startParam.field) {
        setFieldData(startParam.field);
        // 根据字段信息确定模板
        if (startParam.field.primary === 1) {
          setDataType(FieldType.Primary);
          setTemplateId(1); // 主键模板
        } else if (startParam.field.name === 'created_at') {
          setDataType(FieldType.Data);
          setTemplateId(3); // 创建时间模板
        } else if (startParam.field.name === 'updated_at') {
          setDataType(FieldType.Data);
          setTemplateId(4); // 更新时间模板
        } else if (startParam.field.name?.endsWith('_id')) {
          setDataType(FieldType.Foreign);
          setTemplateId(2); // 外键模板
        } else {
          setDataType(FieldType.Data);
          setTemplateId(0); // 基本信息模板
        }
      } else {
        // 新建字段，默认使用基本信息模板
        setFieldData(initField);
        setDataType(FieldType.Data);
        setTemplateId(0);
        applyTemplate(0);
      }
    }
  }, [startParam]);

  useEffect(() => {
    // 当模板选择改变时应用模板
    if (fieldData.id === undefined) {
      applyTemplate(templateId);
    }
  }, [templateId]);

  useEffect(() => {
    // 当手动切换类型时，更新模板选择
    if (fieldData.id === undefined) {
      if (dataType === FieldType.Primary) {
        setTemplateId(1);
      } else if (dataType === FieldType.Foreign) {
        setTemplateId(2);
      } else {
        // 对于数据类型，根据字段名判断是否为时间字段
        if (fieldData.name === 'created_at') {
          setTemplateId(3);
        } else if (fieldData.name === 'updated_at') {
          setTemplateId(4);
        } else {
          setTemplateId(0);
        }
      }
    }
  }, [dataType]);

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
              sx={{ mb: 2 }}
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
                disabled={fieldData.id !== undefined || fieldList?.some(field => field.name === 'id' || field.primary) || templateId === 1}
              />

              <FormControlLabel
                value={FieldType.Foreign}
                control={<Radio />}
                label="外键"
                disabled={fieldData.id !== undefined || templateId === 1}
              />
            </RadioGroup>

            {dataType === FieldType.Data && <FormControl fullWidth margin="dense">
              <InputLabel>选择模板</InputLabel>
              <Select
                value={templateId}
                label="选择模板"
                onChange={(e) => setTemplateId(e.target.value as number)}
              >
                {templates.map((template, index) => (
                  <MenuItem key={index} value={index}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>}

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