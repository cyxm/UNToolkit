import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export enum PageState {
  loading,
  loaded
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

export interface Field {
  id: number;
  name?: string | null;
  type: string;
  table_id?: number | null;
  not_null?: number | null; // 原始数据字段
  required?: boolean; // 转换后的布尔值字段
  default?: string | null;
  defaultValue?: string | null; // 转换后的字段
  unique?: number | null; // 原始数据字段
  isUnique?: boolean; // 转换后的布尔值字段
  primary?: number | null; // 原始数据字段
  isPrimary?: boolean; // 转换后的布尔值字段
  auto_increment?: number | null;
  create_time?: number | null;
  update_time?: number | null;
  enable?: number | null;
}

export interface DbState {
  // 页面异步加载状态
  pageState: PageState;
  // 当前选中的数据库
  selectedDb: Database | null;
  // 数据库列表
  databaseList: Database[];

  tableList: Table[]; // 表列表
  fieldList: Field[]; // 字段列表
  selectedTable: string; // 当前选中的表
  selectedFields: string[]; // 当前选中的字段
}

const initialState: DbState = {
  pageState: PageState.loading,
  databaseList: [],
  tableList: [],
  fieldList: [],
  selectedDb: null,
  selectedTable: '',
  selectedFields: [],
};

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setPageState: (state, action: PayloadAction<PageState>) => {
      state.pageState = action.payload;
    },
    setDatabaseList: (state, action: PayloadAction<Database[]>) => {
      state.databaseList = action.payload;
    },
    setSelectedDb: (state, action: PayloadAction<Database>) => {
      state.selectedDb = action.payload;
    },
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload;
    },
    setTableList: (state, action: PayloadAction<Table[]>) => {
      state.tableList = action.payload;
    },
    setFieldList: (state, action: PayloadAction<Field[]>) => {
      // 转换字段数据以匹配组件期望的格式
      state.fieldList = action.payload.map(field => ({
        ...field,
        required: field.not_null === 1,
        defaultValue: field.default || undefined,
        isUnique: field.unique === 1,
        isPrimary: field.primary === 1
      }));
    },
    setSelectedFields: (state, action: PayloadAction<string[]>) => {
      state.selectedFields = action.payload;
    },
  },
});

export const {
  setPageState,
  setDatabaseList,
  setSelectedDb,
  setSelectedTable,
  setTableList,
  setFieldList,
  setSelectedFields,
} = dbSlice.actions;

// 添加异步thunk处理数据库初始化
export const initializeDatabase = createAsyncThunk(
  'db/initializeDatabase',
  async (_, { dispatch }) => {
    try {
      dispatch(setPageState(PageState.loading));
      const result = await window.electron.db.databases.query();
      if (result.success) {
        dispatch(setDatabaseList(result.data.map((db: any) => ({
          id: db.id,
          name: db.name,
        }))));
      }
    } catch (err) {
      console.error('读取数据库失败:', err);
    } finally {
      dispatch(setPageState(PageState.loaded));
    }
  }
);

// 添加异步thunk处理数据库变化
export const selectDb = createAsyncThunk(
  'db/handleDatabaseChange',
  async (dbId: number, { dispatch, getState }) => {
    const state: any = getState();
    const databaseList = state.db.databaseList;

    // 根据ID找到对应的数据库名称
    const selectedDbObj = databaseList.find((db: any) => db.id === dbId);

    dispatch(setSelectedDb(selectedDbObj));
    dispatch(setSelectedTable(''));

    if (!dbId) {
      dispatch(setTableList([]));
      return;
    }

    try {
      const result = await window.electron.db.tables.query({
        where: { database_id: dbId }
      });
      if (result.success) {
        dispatch(setTableList(result.data.map((table: any) => ({
          id: table.id,
          name: table.name,
          database_id: table.database_id
        }))));
      }
    } catch (err) {
      console.error('Failed to load tables:', err);
    }
  }
);

// 添加异步thunk处理数据库添加
export const addDb = createAsyncThunk(
  'db/addDb',
  async (dbName: string, { dispatch }) => {
    try {
      const currentTime = Date.now();
      const result = await window.electron.db.databases.create({
        name: dbName,
        version: 1,
        create_time: currentTime,
        update_time: currentTime,
        enable: 1,
      });

      if (result.success) {
        // 添加成功后重新初始化数据库列表
        dispatch(initializeDatabase());
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
        dispatch(initializeDatabase());
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

export default dbSlice.reducer;