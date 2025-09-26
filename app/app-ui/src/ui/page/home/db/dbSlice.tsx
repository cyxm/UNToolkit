import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Database {
  id: number;
  name: string;
}

interface QueryResult {
  // 根据实际查询结果结构定义
  [key: string]: any;
}

interface Table {
  id: number;
  name: string;
  database_id: number;
}

interface Field {
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

interface DbState {
  loading: boolean; // 全局加载状态
  queryResult: QueryResult | null; // 查询结果
  dbReadStatus: 'unread' | 'read'; // 数据库读取状态
  databaseList: Database[]; // 数据库列表
  tableList: Table[]; // 表列表
  fieldList: Field[]; // 字段列表
  selectedDb: string; // 当前选中的数据库
  selectedTable: string; // 当前选中的表
  selectedFields: string[]; // 当前选中的字段
  tablesLoading: boolean; // 表加载状态
  tableLoading: boolean; // 单个表加载状态
  fieldLoading: boolean; // 字段加载状态
  dbAnchorEl: HTMLElement | null; // 数据库菜单锚点元素
  tableAnchorEl: HTMLElement | null; // 表菜单锚点元素
  dataType: 'primary' | 'foreign' | 'data'; // 当前显示的数据类型
  openAddFieldDialog: boolean; // 是否打开添加字段对话框
  editingField: Field | null; // 正在编辑的字段
  fieldToDelete: Field | null; // 待删除的字段
  openAddDialog: boolean; // 是否打开添加数据库对话框
  openAddTableDialog: boolean; // 是否打开添加表对话框
}

const initialState: DbState = {
  loading: false,
  queryResult: null,
  dbReadStatus: 'unread',
  databaseList: [],
  tableList: [],
  fieldList: [],
  selectedDb: '',
  selectedTable: '',
  selectedFields: [],
  tablesLoading: false,
  tableLoading: false,
  fieldLoading: false,
  dbAnchorEl: null,
  tableAnchorEl: null,
  dataType: 'data',
  openAddFieldDialog: false,
  editingField: null,
  fieldToDelete: null,
  openAddDialog: false,
  openAddTableDialog: false,
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
    setDatabaseList: (state, action: PayloadAction<Database[]>) => {
      state.databaseList = action.payload;
    },
    setSelectedDb: (state, action: PayloadAction<string>) => {
      state.selectedDb = action.payload;
    },
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload;
    },
    setTableList: (state, action: PayloadAction<Table[]>) => {
      state.tableList = action.payload;
    },
    setTablesLoading: (state, action: PayloadAction<boolean>) => {
      state.tablesLoading = action.payload;
    },
    setFieldList: (state, action: PayloadAction<Field[]>) => {
      state.fieldList = action.payload;
    },
    setSelectedFields: (state, action: PayloadAction<string[]>) => {
      state.selectedFields = action.payload;
    },
    setTableLoading: (state, action: PayloadAction<boolean>) => {
      state.tableLoading = action.payload;
    },
    setFieldLoading: (state, action: PayloadAction<boolean>) => {
      state.fieldLoading = action.payload;
    },
    setDataType: (state, action: PayloadAction<'primary' | 'foreign' | 'data'>) => {
      state.dataType = action.payload;
    },
    setOpenAddFieldDialog: (state, action: PayloadAction<boolean>) => {
      state.openAddFieldDialog = action.payload;
    },
    setEditingField: (state, action: PayloadAction<Field | null>) => {
      state.editingField = action.payload;
    },
    setFieldToDelete: (state, action: PayloadAction<Field | null>) => {
      state.fieldToDelete = action.payload;
    },
    setOpenAddDialog: (state, action: PayloadAction<boolean>) => {
      state.openAddDialog = action.payload;
    },
    setOpenAddTableDialog: (state, action: PayloadAction<boolean>) => {
      state.openAddTableDialog = action.payload;
    },
  },
});

export const {
  setLoading,
  setQueryResult,
  setDatabaseList,
  setSelectedDb,
  setSelectedTable,
  setTableList,
  setTablesLoading,
  setFieldList,
  setSelectedFields,
  setOpenAddTableDialog,
  setOpenAddFieldDialog,
  setDataType
} = dbSlice.actions;

export default dbSlice.reducer;
