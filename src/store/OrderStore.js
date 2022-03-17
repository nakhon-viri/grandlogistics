import { createSlice } from "@reduxjs/toolkit";

export const orderReducer = createSlice({
  name: "order",
  initialState: { order: null },
  reducers: {
    uploadOrder: (state, action) => {
      state.order = action.payload;
    },
  },
});

export const { uploadOrder } = orderReducer.actions;

export const orderStore = (state) => state.order;

export default orderReducer.reducer;
