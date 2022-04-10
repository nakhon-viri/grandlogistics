import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  order: null,
  orderDeleted: null,
  loadingOrder: false,
  error: null,
};

export const orderReducer = createSlice({
  name: "order",
  initialState: { value: stateDefault },
  reducers: {
    upDateOrder: (state, action) => {
      state.value = {
        ...stateDefault,
        order: action.payload.filter((item) => item.deleted === false),
        orderDeleted: action.payload.filter((item) => item.deleted === true),
      };
    },
    upDateLoading: (state, action) => {
      state.value = { ...stateDefault, loadingOrder: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
    addOrder: (state, action) => {
      state.value.order.push(action.payload);
    },
    deleteOrder: (state, action) => {
      let orderDeleted = [];
      state.value.order = state.value.order.filter((item) => {
        if (item._id === action.payload) {
          item.deleted = true;
          orderDeleted.push(item);
          return;
        }
        return item;
      });

      state.value.orderDeleted.push(...orderDeleted);
    },
    recoverOrder: (state, action) => {
      let order = [];
      let orderDeleted = [];
      order = state.value.orderDeleted.filter((item) => {
        if (item._id === action.payload) {
          item.deleted = false;
          return item;
        } else {
          orderDeleted.push(item);
        }
      });
      state.value.order.push(...order);
      state.value.orderDeleted = orderDeleted;
    },
    editOrder: (state, action) => {
      state.value.order = state.value.order.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        }
        return item;
      });
    },
  },
});

export const {
  upDateOrder,
  deleteOrder,
  recoverOrder,
  upDateLoading,
  addOrder,
  upDateError,
  editOrder,
} = orderReducer.actions;

export const orderStore = (state) => state.order.value;

export const orderReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoading());

    let resOrder = await HttpClient.get("/order");

    dispatch(upDateOrder(resOrder.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default orderReducer.reducer;
