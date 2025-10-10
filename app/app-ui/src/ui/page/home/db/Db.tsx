import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store.js';
import {
  setSelectedTable,
  setTableList,
  setFieldList,
  PageState,
  selectDb,
  initializeDatabase,
} from './DbSlice.js';
import {
  Box,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddFieldDialog from './AddFieldDialog.js';
import DatabaseSelector from './DatabaseSelector.js';
import TableSelector from './TableSelector.js';
import FieldControlPanel from './FieldControlPanel.js';
import FieldTable from './FieldTable.js';

export default function Db() {
  const dispatch = useAppDispatch();
  const {
    pageState,
    tableList,
    fieldList,
    selectedDb,
    selectedTable,
  } = useSelector((state: RootState) => state.db);

  const [tableAnchorEl, setTableAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddTableDialog, setOpenAddTableDialog] = useState(false);
  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [dataType, setDataType] = useState('data');

  // 初始化
  useEffect(() => {
    dispatch(initializeDatabase());
  }, []);

  // 载入页面
  if (pageState === PageState.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEditField = (field: any) => {
    setEditingField(field);
  };

  const handleDeleteField = (field: any) => {
    // TODO: 实现删除字段逻辑
  };

  return (
    <Stack spacing={2} direction="column" sx={{ flexGrow: 1, height: '100%', p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
        <DatabaseSelector />

        <TableSelector
          tableList={tableList}
          selectedTable={selectedTable}
          onTableChange={(tableName) => dispatch(setSelectedTable(tableName))}
          onAddTable={() => setOpenAddTableDialog(true)}
          onDeleteTable={(tableName) => {
            // TODO: 实现删除表逻辑
          }}
        />
      </Stack>

      <Stack direction="row" sx={{ flexGrow: 1, height: '100%' }}>
        <FieldControlPanel
          dataType={dataType}
          selectedTable={selectedTable}
          onDataTypeChange={setDataType}
          onAddField={() => setOpenAddFieldDialog(true)}
        />

        <AddFieldDialog
          open={openAddFieldDialog && !editingField}
          onClose={() => setOpenAddFieldDialog(false)}
          onSubmit={async (fieldData) => {
            try {
              if (!selectedTable || !fieldData.name) return;

              const table = tableList.find(t => t.name === selectedTable);
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

                const table = tableList.find(t => t.name === selectedTable);
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

        <FieldTable
          fieldList={fieldList}
          dataType={dataType}
          tableLoading={tableLoading}
          onEditField={handleEditField}
          onDeleteField={handleDeleteField}
        />
      </Stack>
    </Stack>
  );
}