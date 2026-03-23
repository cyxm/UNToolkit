import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import dbReducer from '@/ui/page/home/db/DbSlice.js';
import funcReducer from '@/ui/page/home/func/FuncSlice.js';

export const store = configureStore({
  reducer: {
    db: dbReducer,
    func: funcReducer,
  },
});

// 导出RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出一个自定义的useDispatch hook，避免在每个文件中单独导入类型
export const useAppDispatch = () => useDispatch<AppDispatch>();