import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
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

  // 字段编辑对话框
  fieldEditorDialog: FieldEditorStartParam;
}

const initialState: DbState = {
  databaseList: [],
  tableList: [],
  fieldList: [],
  selectedDb: null,
  selectedTable: null,
  selectFieldType: FieldType.All,
  dbType: DbType.Common,
  fieldEditorDialog: { open: false, field: null },
};

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setDatabaseList: (state, action: PayloadAction<Database[]>) => {
      state.databaseList = action.payload;
    },
    setSelectedDb: (state, action: PayloadAction<Database | null>) => {
      state.selectedDb = action.payload;
    },
    setSelectedTable: (state, action: PayloadAction<Table | null>) => {
      state.selectedTable = action.payload;
    },
    setTableList: (state, action: PayloadAction<Table[]>) => {
      state.tableList = action.payload;
    },
    setFieldList: (state, action: PayloadAction<Field[]>) => {
      state.fieldList = action.payload;
    },
    setSelectFieldType: (state, action: PayloadAction<FieldType>) => {
      state.selectFieldType = action.payload;
    },
    setFieldEditorDialog: (state, action: PayloadAction<FieldEditorStartParam>) => {
      state.fieldEditorDialog = action.payload;
    },
    setDbType: (state, action: PayloadAction<DbType>) => {
      state.dbType = action.payload;
    },
  },
});

export const {
  setDatabaseList,
  setSelectedDb,
  setSelectedTable,
  setTableList,
  setFieldList,
  setSelectFieldType,
  setFieldEditorDialog,
  setDbType,
} = dbSlice.actions;

// 添加异步thunk处理数据库初始化
export const initDb = createAsyncThunk(
  'db/initDb',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    const dbType = state.db.dbType;
    console.log('初始化数据库列表:', dbType);
    try {
      const result = await window.electron.db.databases.query({
        where: { type: dbType }
      });
      if (result.success) {
        dispatch(setDatabaseList(result.data.map((db: any) => ({
          id: db.id,
          name: db.name,
        }))));
        dispatch(setSelectedDb(null));
      }
    } catch (err) {
      console.error('读取数据库失败:', err);
    }
  }
);

// 添加异步thunk处理数据库变化
export const selectDb = createAsyncThunk(
  'db/selectDb',
  async (dbId: number, { dispatch, getState }) => {
    const state: any = getState();
    const databaseList = state.db.databaseList;

    // 根据ID找到对应的数据库名称
    const selectedDbObj = databaseList.find((db: any) => db.id === dbId);

    dispatch(setSelectedDb(selectedDbObj));
  }
);

// 添加一个监听selectedDb变化的异步action
export const loadTablesBySelectedDb = createAsyncThunk(
  'db/loadTablesBySelectedDb',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    const selectedDb = state.db.selectedDb;
    console.log('数据库选择变动');

    if (!selectedDb) {
      console.log('未选择数据库');
      dispatch(setTableList([]));
      dispatch(setSelectedTable(null));
      return;
    }

    console.log('选择数据库:', selectedDb.name);
    try {
      const result = await window.electron.db.tables.query({
        where: { database_id: selectedDb.id }
      });

      if (result.success) {
        dispatch(setTableList(result.data.map((table: any) => ({
          id: table.id,
          name: table.name,
          database_id: table.database_id
        }))));
      } else {
        dispatch(setTableList([]));
        dispatch(setSelectedTable(null));
      }
    } catch (err) {
      console.error('Failed to load tables:', err);
    }
  }
);

// 添加异步thunk处理表变化时加载字段
export const loadFieldsBySelectedTable = createAsyncThunk(
  'db/loadFieldsBySelectedTable',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    const selectedDb = state.db.selectedDb;
    const selectedTable = state.db.selectedTable;
    console.log('表选择变动');

    if (!selectedDb || !selectedTable) {
      dispatch(setFieldList([]));
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
          dispatch(setFieldList(result.data));
        } else {
          dispatch(setFieldList([]));
        }
      } else {
        dispatch(setFieldList([]));
      }
    } catch (err) {
      console.error('Failed to load fields:', err);
      dispatch(setFieldList([]));
    }
  }
);

// 添加异步thunk处理数据库添加
export const addDb = createAsyncThunk(
  'db/addDb',
  async (dbName: string, { dispatch, getState }) => {
    const state: any = getState();
    const dbType = state.db.dbType;
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
        dispatch(initDb());
        return result.id;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('添加数据库失败:', err);
      throw err;
    }
  }
);

// 添加异步thunk处理选中数据库删除
export const deleteSelectDb = createAsyncThunk(
  'db/deleteSelectDb',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    const selectedDb = state.db.selectedDb;

    // 检查是否有选中的数据库
    if (!selectedDb) {
      throw new Error('没有选中的数据库');
    }

    try {
      const result = await window.electron.db.databases.delete(selectedDb.id);

      if (result.success) {
        // 删除成功后重新初始化数据库列表
        dispatch(initDb());
        return result.changes;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('删除数据库失败:', err);
      throw err;
    }
  }
);

// 添加异步thunk处理表添加
export const addTable = createAsyncThunk(
  'db/addTable',
  async (tableName: string, { dispatch, getState }) => {
    try {
      const state: any = getState();
      const selectedDb = state.db.selectedDb;

      // 检查是否有选中的数据库
      if (!selectedDb) {
        throw new Error('没有选中的数据库');
      }

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
          dispatch(setTableList(tableResult.data.map((table: any) => ({
            id: table.id,
            name: table.name,
            database_id: table.database_id
          }))));
        }
        return result.id;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('添加表失败:', err);
      throw err;
    }
  }
);

// 添加异步thunk处理选中表删除
export const deleteSelectTable = createAsyncThunk(
  'db/deleteSelectTable',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    const selectedDb = state.db.selectedDb;
    const selectedTable = state.db.selectedTable;
    const tableList = state.db.tableList;

    // 检查是否有选中的数据库和表
    if (!selectedDb) {
      throw new Error('没有选中的数据库');
    }

    if (!selectedTable) {
      throw new Error('没有选中的表');
    }

    // 从表列表中找到选中的表
    if (!selectedTable) {
      throw new Error('找不到选中的表');
    }

    try {
      const result = await window.electron.db.tables.delete(selectedTable.id);

      if (result.success) {
        // 删除成功后重新加载表列表
        const tableResult = await window.electron.db.tables.query({
          where: { database_id: selectedDb.id }
        });

        if (tableResult.success) {
          dispatch(setTableList(tableResult.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            database_id: t.database_id
          }))));
          // 清空选中的表
          dispatch(setSelectedTable(null));
        }
        return result.changes;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('删除表失败:', err);
      throw err;
    }
  }
);

export const addOrUpdateField = createAsyncThunk(
  'db/addOrUpdateField',
  async (fieldData: Field, { dispatch, getState }) => {
    const state: any = getState();
    const { selectedTable } = state.db;

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
          dispatch(setFieldList(fieldsResult.data));
        }
      } else {
        console.warn('字段添加失败: ' + result.error);
      }

      return result;
    } catch (err) {
      console.error('添加字段失败:', err);
      throw err;
    }
  }
);

// 添加异步thunk处理字段删除
export const deleteField = createAsyncThunk(
  'db/deleteField',
  async (fieldId: number, { dispatch, getState }) => {
    const state: any = getState();
    const { selectedTable } = state.db;

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
          dispatch(setFieldList(fieldsResult.data));
        }
        return result.changes;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('删除字段失败:', err);
      throw err;
    }
  }
);

export default dbSlice.reducer;