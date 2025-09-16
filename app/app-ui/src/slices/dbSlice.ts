import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Database {
  id: number;
  name: string;
}

interface QueryResult {
  // 根据实际查询结果结构定义
  [key: string]: any;
}

interface DbState {
  loading: boolean;
  queryResult: QueryResult | null;
  dbReadStatus: 'unread' | 'read';
  databaseList: Database[];
  selectedDb: string;
  selectedTable: string;
}

const initialState: DbState = {
  loading: false,
  queryResult: null,
  dbReadStatus: 'unread',
  databaseList: [],
  selectedDb: '',
  selectedTable: '',
};

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setQueryResult: (state, action: PayloadAction<QueryResult | null>) => {
      state.queryResult = action.payload;
    },
    setDbReadStatus: (state, action: PayloadAction<'unread' | 'read'>) => {
      state.dbReadStatus = action.payload;
    },
    setDatabaseList: (state, action: PayloadAction<Database[]>) => {
      state.databaseList = action.payload;
    },
    setSelectedDb: (state, action: PayloadAction<string>) => {
      state.selectedDb = action.payload;
    },
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload;
    },
  },
});

export const { 
  setLoading, 
  setQueryResult, 
  setDbReadStatus, 
  setDatabaseList,
  setSelectedDb,
  setSelectedTable
} = dbSlice.actions;

export default dbSlice.reducer;
