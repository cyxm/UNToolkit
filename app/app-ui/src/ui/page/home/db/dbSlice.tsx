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
  id: number;                  // 保留原有的id属性（通常为数据库自增主键）
  name?: string | null;        // 从fieldsCreateInput对应，允许为string或null
  type: string;                // 保持必填，与fieldsCreateInput一致
  table_id?: number | null;    // 从fieldsCreateInput对应，允许为number或null
  required: boolean;           // 可基于not_null转换（1为true，0为false）
  defaultValue?: string | null;// 对应default字段，允许为string或null
  unique: boolean;             // 可基于unique转换（1为true，0为false）
  primary?: boolean | null;    // 新增：对应primary字段（1为true，0为false）
  auto_increment?: boolean | null; // 新增：对应auto_increment字段
  create_time?: number | null; // 新增：对应创建时间戳
  update_time?: number | null; // 新增：对应更新时间戳
  enable?: boolean | null;     // 新增：对应启用状态（1为true，0为false）
}

export interface DbState {
  // 页面状态
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
      state.fieldList = action.payload;
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
export const handleDatabaseChange = createAsyncThunk(
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
      const result = await window.electron.db.databases.query({
        where: { id: dbId }
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

export default dbSlice.reducer;