import { FieldType } from '@/ui/page/home/db/DbSlice.js';

// 模板类型枚举
export enum TemplateType {
  BasicInfo = 0,
  PrimaryKey = 1,
  ForeignKey = 2,
  CreatedAt = 3,
  UpdatedAt = 4
}

// 模板定义
export interface Template {
  name: string;
  type: FieldType;
  fieldType?: string;
  notNull?: boolean;
  unique?: boolean;
  defaultValue?: string;
}

export const templates: Map<TemplateType, Template> = new Map([
  [TemplateType.BasicInfo, {
    name: '基本信息',
    type: FieldType.Data,
    fieldType: 'string',
    notNull: false,
    unique: false,
    defaultValue: ''
  }],
  [TemplateType.PrimaryKey, {
    name: '主键',
    type: FieldType.Primary,
    fieldType: 'int'
  }],
  [TemplateType.ForeignKey, {
    name: '外键',
    type: FieldType.Foreign,
    fieldType: 'int',
    notNull: true
  }],
  [TemplateType.CreatedAt, {
    name: '创建时间',
    type: FieldType.Data,
    fieldType: 'datetime',
    notNull: true,
    defaultValue: 'CURRENT_TIMESTAMP'
  }],
  [TemplateType.UpdatedAt, {
    name: '更新时间',
    type: FieldType.Data,
    fieldType: 'datetime',
    notNull: true,
    defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }]
]);