import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PageState {
  loading,
  loaded
}

export interface FuncState {
  pageState: PageState;
}

const initialState: FuncState = {
  pageState: PageState.loading,
};

export const funcSlice = createSlice({
  name: 'func',
  initialState,
  reducers: {
    setPageState: (state, action: PayloadAction<PageState>) => {
      state.pageState = action.payload;
    },
  },
});

export const {
  setPageState,
} = funcSlice.actions;

export default funcSlice.reducer;
