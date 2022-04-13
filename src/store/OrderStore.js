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
    addOrder: (state, action) => {
      state.value.order.push(action.payload);
    },
    deleteOrder: (state, action) => {
      state.value.order = state.value.order.filter((item) => {
        if (item._id === action.payload) {
          item.deleted = true;
          return item;
        }
        return item;
      });
    },
    recoverOrder: (state, action) => {
      state.value.order = state.value.order.filter((item) => {
        if (item._id === action.payload) {
          item.deleted = false;
          return item;
        }
        return item;
      });
    },
    editOrder: (state, action) => {
      state.value.order = state.value.order.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        }
        return item;
      });
    },
    upDateSomeOrder: (state, action) => {
      state.value.order = state.value.order.map((item) => {
        let newSomeOrder = action.payload.find((curr) => curr._id === item._id);
        if (newSomeOrder) {
          return newSomeOrder;
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
  upDateSomeOrder,
} = orderReducer.actions;

// export const orderStore = (state) => state.order.value;

export const orderStore = (state) => {
  let { order, loadingOrder, error } = state.order.value;
  if (!order) return state.order.value;
  let orderDeleted = [];
  let newOrder = order?.filter((item) => {
    if (!item.deleted) {
      return item;
    } else {
      orderDeleted.push(item);
    }
  });
  order = newOrder;
  return { order, orderDeleted, loadingOrder, error };
};

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
