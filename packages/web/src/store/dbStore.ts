import { create } from 'zustand';
import { Prisma } from '@prisma/client';

// 添加DbType枚举
export enum DbType {
  Common = 0,
  Template = 1
}

export enum FieldType {
  All = 'all',
  Data = 'data',
  Primary = 'primary',
  Foreign = 'foreign'
}

export interface FieldEditorStartParam {
  open: boolean;
  field: Field | null;
}

export interface Database {
  id: number;
  name: string;
}

export interface Table {
  id: number;
  name: string;
  database_id: number;
}

export interface Field extends Prisma.fieldsUncheckedCreateInput { }

export interface DbState {
  // 数据库列表
  databaseList: Database[];
  // 当前选中的数据库
  selectedDb: Database | null;

  // 表列表
  tableList: Table[];
  // 当前选中的表
  selectedTable: Table | null;

  // 字段列表
  fieldList: Field[];
  // 当前选中的字段筛选类型
  selectFieldType: FieldType;

  // 数据库类型
  dbType: DbType;
  // 模板字段列表
  templateFields: Field[];

  // 字段编辑对话框
  fieldEditorDialog: FieldEditorStartParam;

  // Actions
  setDatabaseList: (databaseList: Database[]) => void;
  setSelectedDb: (selectedDb: Database | null) => void;
  setSelectedTable: (selectedTable: Table | null) => void;
  setTableList: (tableList: Table[]) => void;
  setFieldList: (fieldList: Field[]) => void;
  setTemplateFields: (templateFields: Field[]) => void;
  setSelectFieldType: (selectFieldType: FieldType) => void;
  setFieldEditorDialog: (fieldEditorDialog: FieldEditorStartParam) => void;
  setDbType: (dbType: DbType) => void;

  // Async Actions
  initDb: () => Promise<void>;
  selectDb: (dbId: number) => Promise<void>;
  loadTablesBySelectedDb: () => Promise<void>;
  loadFieldsBySelectedTable: () => Promise<void>;
  addDb: (dbName: string) => Promise<number | undefined>;
  deleteSelectDb: () => Promise<number | undefined>;
  addTable: (tableName: string) => Promise<number | undefined>;
  deleteSelectTable: () => Promise<number | undefined>;
  addOrUpdateField: (fieldData: Field) => Promise<any>;
  deleteField: (fieldId: number) => Promise<number | undefined>;
  initTemplateFields: () => Promise<void>;
}

export const useDbStore = create<DbState>((set, get) => ({
  databaseList: [],
  tableList: [],
  fieldList: [],
  templateFields: [],
  selectedDb: null,
  selectedTable: null,
  selectFieldType: FieldType.All,
  dbType: DbType.Common,
  fieldEditorDialog: { open: false, field: null },

  setDatabaseList: (databaseList) => set({ databaseList }),
  setSelectedDb: (selectedDb) => set({ selectedDb }),
  setSelectedTable: (selectedTable) => set({ selectedTable }),
  setTableList: (tableList) => set({ tableList }),
  setFieldList: (fieldList) => set({ fieldList }),
  setTemplateFields: (templateFields) => set({ templateFields }),
  setSelectFieldType: (selectFieldType) => set({ selectFieldType }),
  setFieldEditorDialog: (fieldEditorDialog) => set({ fieldEditorDialog }),
  setDbType: (dbType) => set({ dbType }),

  initDb: async () => {
    const { dbType, setDatabaseList, setSelectedDb } = get();
    console.log('初始化数据库列表:', dbType);
    try {
      const result = await window.electron.db.databases.query({
        where: { type: dbType }
      });
      if (result.success) {
        setDatabaseList(result.data.map((db: any) => ({
          id: db.id,
          name: db.name,
        })));
        setSelectedDb(null);
      }
    } catch (err) {
      console.error('读取数据库失败:', err);
    }
  },

  selectDb: async (dbId: number) => {
    const { databaseList, setSelectedDb } = get();

    // 根据ID找到对应的数据库名称
    const selectedDbObj = databaseList.find((db: any) => db.id === dbId);

    setSelectedDb(selectedDbObj);
  },

  loadTablesBySelectedDb: async () => {
    const { selectedDb, setTableList, setSelectedTable } = get();
    console.log('数据库选择变动');

    if (!selectedDb) {
      console.log('未选择数据库');
      setTableList([]);
      setSelectedTable(null);
      return;
    }

    console.log('选择数据库:', selectedDb.name);
    try {
      const result = await window.electron.db.tables.query({
        where: { database_id: selectedDb.id }
      });

      if (result.success) {
        setTableList(result.data.map((table: any) => ({
          id: table.id,
          name: table.name,
          database_id: table.database_id
        })));
      } else {
        setTableList([]);
        setSelectedTable(null);
      }
    } catch (err) {
      console.error('Failed to load tables:', err);
    }
  },

  loadFieldsBySelectedTable: async () => {
    const { selectedDb, selectedTable, setFieldList } = get();
    console.log('表选择变动');

    if (!selectedDb || !selectedTable) {
      setFieldList([]);
      return;
    }

    try {
      if (selectedTable) {
        console.log('选择表:', selectedTable.id);
        const result = await window.electron.db.fields.query({
          where: { table_id: selectedTable.id }
        });

        console.log('表:', result);

        if (result.success) {
          setFieldList(result.data);
        } else {
          setFieldList([]);
        }
      } else {
        setFieldList([]);
      }
    } catch (err) {
      console.error('Failed to load fields:', err);
      setFieldList([]);
    }
  },

  addDb: async (dbName: string) => {
    const { dbType, initDb } = get();
    try {
      const currentTime = Date.now();
      const result = await window.electron.db.databases.create({
        name: dbName,
        version: 1,
        create_time: currentTime,
        update_time: currentTime,
        enable: 1,
        type: dbType,
      });

      if (result.success) {
        // 添加成功后重新初始化数据库列表
        await initDb();
        return result.id;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('添加数据库失败:', err);
      throw err;
    }
  },

  deleteSelectDb: async () => {
    const { selectedDb, initDb } = get();

    // 检查是否有选中的数据库
    if (!selectedDb) {
      throw new Error('没有选中的数据库');
    }

    try {
      const result = await window.electron.db.databases.delete(selectedDb.id);

      if (result.success) {
        // 删除成功后重新初始化数据库列表
        await initDb();
        return result.changes;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('删除数据库失败:', err);
      throw err;
    }
  },

  addTable: async (tableName: string) => {
    const { selectedDb, setTableList } = get();

    // 检查是否有选中的数据库
    if (!selectedDb) {
      throw new Error('没有选中的数据库');
    }

    try {
      const currentTime = Date.now();
      const result = await window.electron.db.tables.create({
        name: tableName,
        database_id: selectedDb.id,
        version: 1,
        create_time: currentTime,
        update_time: currentTime,
        enable: 1,
      });

      if (result.success) {
        // 添加成功后重新加载表列表
        const tableResult = await window.electron.db.tables.query({
          where: { database_id: selectedDb.id }
        });

        if (tableResult.success) {
          setTableList(tableResult.data.map((table: any) => ({
            id: table.id,
            name: table.name,
            database_id: table.database_id
          })));
        }
        return result.id;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('添加表失败:', err);
      throw err;
    }
  },

  deleteSelectTable: async () => {
    const { selectedDb, selectedTable, setTableList, setSelectedTable } = get();

    // 检查是否有选中的数据库和表
    if (!selectedDb) {
      throw new Error('没有选中的数据库');
    }

    if (!selectedTable) {
      throw new Error('没有选中的表');
    }

    try {
      const result = await window.electron.db.tables.delete(selectedTable.id);

      if (result.success) {
        // 删除成功后重新加载表列表
        const tableResult = await window.electron.db.tables.query({
          where: { database_id: selectedDb.id }
        });

        if (tableResult.success) {
          setTableList(tableResult.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            database_id: t.database_id
          })));
          // 清空选中的表
          setSelectedTable(null);
        }
        return result.changes;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('删除表失败:', err);
      throw err;
    }
  },

  addOrUpdateField: async (fieldData: Field) => {
    const { selectedTable, setFieldList } = get();

    try {
      if (!selectedTable || !fieldData.name) return;

      if (!selectedTable) {
        console.warn('找不到对应的表');
        return;
      }

      const time = Date.now();
      let finalData;
      let result;
      if (fieldData.id) {
        finalData = {
          ...fieldData,
          update_time: time,
        };
        result = await window.electron.db.fields.update({
          where: { id: fieldData.id },
          data: finalData
        });
      } else {
        finalData = {
          ...fieldData,
          table_id: selectedTable.id,
          create_time: time,
          update_time: time,
        };
        result = await window.electron.db.fields.create(finalData);
      }

      if (result.success) {
        // 刷新字段列表
        const fieldsResult = await window.electron.db.fields.query({
          where: {
            table_id: selectedTable.id
          }
        });
        if (fieldsResult.success) {
          setFieldList(fieldsResult.data);
        }
      } else {
        console.warn('字段添加失败: ' + result.error);
      }

      return result;
    } catch (err) {
      console.error('添加字段失败:', err);
      throw err;
    }
  },

  deleteField: async (fieldId: number) => {
    const { selectedTable, setFieldList } = get();

    try {
      // 检查是否有选中的表
      if (!selectedTable) {
        throw new Error('没有选中的表');
      }

      // 删除字段
      const result = await window.electron.db.fields.delete(fieldId);

      if (result.success) {
        // 删除成功后重新加载字段列表
        const fieldsResult = await window.electron.db.fields.query({
          where: {
            table_id: selectedTable.id
          }
        });

        if (fieldsResult.success) {
          setFieldList(fieldsResult.data);
        }
        return result.changes;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('删除字段失败:', err);
      throw err;
    }
  },

  initTemplateFields: async () => {
    const { setTemplateFields } = get();
    try {
      // 查询类型为模板的数据库
      const result = await window.electron.db.tables.query({
        where: { name: 'template_single_field' },
        select: { id: true }
      });

      if (result.success) {
        // 获取表ID
        const tableId = result.data[0]?.id;
        if (tableId) {
          // 查询该表的所有字段
          const fieldsResult = await window.electron.db.fields.query({
            where: { table_id: tableId }
          });

          if (fieldsResult.success) {
            setTemplateFields(fieldsResult.data);
          }
        }
      }
    } catch (err) {
      console.error('初始化模板字段失败:', err);
    }
  },
}));
