import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { Template, TemplateType } from './DbTemplate.js';

interface FieldTemplateEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (template: Template) => void;
  template?: Template | null;
}

export default function FieldTemplateEditorDialog({
  open,
  onClose,
  onSubmit,
  template
}: FieldTemplateEditorDialogProps) {
  const [templateData, setTemplateData] = useState<Template>({
    id: TemplateType.BasicInfo,
    name: '',
    type: 'data',
    fieldType: 'varchar',
    notNull: false,
    unique: false,
    defaultValue: '',
    description: ''
  });

  // 初始化表单数据
  useEffect(() => {
    if (open) {
      if (template) {
        setTemplateData({
          ...template
        });
      } else {
        // 重置为默认值
        setTemplateData({
          id: TemplateType.BasicInfo,
          name: '',
          type: 'data',
          fieldType: 'varchar',
          notNull: false,
          unique: false,
          defaultValue: '',
          description: ''
        });
      }
    }
  }, [open, template]);

  const handleChange = (field: keyof Template, value: any) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(templateData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {template ? '编辑字段模板' : '创建字段模板'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="模板名称"
            fullWidth
            value={templateData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel>字段类型</InputLabel>
            <Select
              value={templateData.type}
              label="字段类型"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value="data">数据</MenuItem>
              <MenuItem value="primary">主键</MenuItem>
              <MenuItem value="foreign">外键</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="数据类型"
            fullWidth
            value={templateData.fieldType}
            onChange={(e) => handleChange('fieldType', e.target.value)}
          />
          
          <TextField
            margin="dense"
            label="默认值"
            fullWidth
            value={templateData.defaultValue}
            onChange={(e) => handleChange('defaultValue', e.target.value)}
          />
          
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={3}
            value={templateData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          
          <Box sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={templateData.notNull}
                  onChange={(e) => handleChange('notNull', e.target.checked)}
                />
              }
              label="非空"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={templateData.unique}
                  onChange={(e) => handleChange('unique', e.target.checked)}
                />
              }
              label="唯一"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained">
          {template ? '更新' : '创建'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}