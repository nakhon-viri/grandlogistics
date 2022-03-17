import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  order: null,
  loadingOrder: false,
  error: null,
};

export const orderReducer = createSlice({
  name: "order",
  initialState: { value: stateDefault },
  reducers: {
    upDateOrder: (state, action) => {
      state.value = { ...stateDefault, order: action.payload };
    },
    upDateLoading: (state, action) => {
      state.value = { ...stateDefault, loadingOrder: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
  },
});

export const { upDateOrder, upDateLoading, upDateError } = orderReducer.actions;

export const orderStore = (state) => state.order.value;

export const orderReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoading());

    let resOrder = await HttpClient.get("/order");

    dispatch(upDateOrder(resOrder.data.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default orderReducer.reducer;
