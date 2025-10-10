import React, { useState } from 'react';
import {
  Stack,
} from '@mui/material';
import AddFieldDialog from './AddFieldDialog.js';
import FieldTable from './FieldTable.js';
import FieldControlPanel from './FieldControlPanel.js';
import { useSelector } from 'react-redux';
import { setFieldList } from './DbSlice.js';
import { useAppDispatch } from '@/store.js';

export default function FieldEditor() {
  const dispatch = useAppDispatch();
  const { tableList, selectedTable, fieldList, dataType } = useSelector((state: any) => state.db);
  
  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  const handleEditField = (field: any) => {
    setEditingField(field);
  };

  const handleDeleteField = (field: any) => {
    // TODO: 实现删除字段逻辑
  };

  const handleDataTypeChange = (newDataType: string) => {
    // TODO: 实现数据类型改变逻辑
  };

  const handleAddField = () => {
    setOpenAddFieldDialog(true);
  };

  return (
    <>
      <Stack direction="row" sx={{ flexGrow: 1, height: '100%' }}>
        <FieldControlPanel
          dataType={dataType}
          selectedTable={selectedTable}
          onDataTypeChange={handleDataTypeChange}
          onAddField={handleAddField}
        />
        
        <FieldTable
          fieldList={fieldList}
          dataType={dataType}
          tableLoading={false}
          onEditField={handleEditField}
          onDeleteField={handleDeleteField}
        />
      </Stack>

      <AddFieldDialog
        open={openAddFieldDialog && !editingField}
        onClose={() => setOpenAddFieldDialog(false)}
        onSubmit={async (fieldData) => {
          try {
            if (!selectedTable || !fieldData.name) return;

            const table = tableList.find((t: any) => t.name === selectedTable);
            if (!table) {
              alert('找不到对应的表');
              return;
            }

            let result;
            if (fieldData.dataType === 'primary') {
              result = await window.electron.db.fields.create({
                name: fieldData.name,
                table_id: table.id,
                type: "int",
                primary: 1,
                auto_increment: 1
              });
            } else {
              result = await window.electron.db.fields.create({
                name: fieldData.name,
                table_id: table.id,
                type: fieldData.type || "string",
                not_null: fieldData.required ? 1 : 0,
                default: fieldData.defaultValue,
                unique: fieldData.unique ? 1 : 0,
                primary: 0,
                auto_increment: 0
              });
            }
            if (result.success) {
              // 刷新字段列表
              const fieldsResult = await window.electron.db.fields.query({
                where: {
                  table_id: table.id
                }
              });
              if (fieldsResult.success) {
                dispatch(setFieldList(fieldsResult.data));
              }
            } else {
              alert('字段添加失败: ' + result.error);
            }
          } catch (err) {
            console.error('添加字段失败:', err);
          }
        }}
        fieldList={fieldList}
      />

      {editingField && (
        <AddFieldDialog
          open={true}
          onClose={() => setEditingField(null)}
          onSubmit={async (fieldData) => {
            try {
              if (!selectedTable || !fieldData.name) return;

              const table = tableList.find((t: any) => t.name === selectedTable);
              if (!table) return;

              const result = await window.electron.db.fields.update({
                where: { id: editingField.id },
                data: {
                  name: fieldData.name,
                  type: fieldData.type || "string",
                  not_null: fieldData.required ? 1 : 0,
                  default: fieldData.defaultValue,
                  unique: fieldData.unique ? 1 : 0
                }
              });

              if (result.success) {
                // 刷新字段列表
                const fieldsResult = await window.electron.db.fields.query({
                  where: {
                    table_id: table.id
                  }
                });
                if (fieldsResult.success) {
                  dispatch(setFieldList(fieldsResult.data));
                }
              }
            } catch (err) {
              console.error('更新字段失败:', err);
            } finally {
              setEditingField(null);
            }
          }}
          fieldList={fieldList}
          initialData={{
            name: editingField.name,
            type: editingField.type,
            required: editingField.required,
            defaultValue: editingField.defaultValue,
            unique: editingField.isUnique,
            dataType: editingField.isPrimary ? 'primary' : 'data'
          }}
        />
      )}
    </>
  );
}