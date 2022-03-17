import { createSlice } from "@reduxjs/toolkit";

export const orderReducer = createSlice({
  name: "order",
  initialState: null,
  reducers: {
    uploadOrder: (state, action) => {
      state = action.payload;
    },
  },
});

export const { upDateLogin } = orderReducer.actions;

export const orderStore = (state) => state.order;

export default orderReducer.reducer;
