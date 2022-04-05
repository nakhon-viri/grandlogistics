import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  customer: null,
  loadingCustomer: false,
  error: null,
};

export const customerReducer = createSlice({
  name: "customer",
  initialState: { value: stateDefault },
  reducers: {
    upDateCustomer: (state, action) => {
      state.value = { ...stateDefault, customer: action.payload };
    },
    upDateLoading: (state, action) => {
      state.value = { ...stateDefault, loadingCustomer: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
    addCustomer: (state, action) => {
      state.value.customer.push(action.payload);
    },
    editCustomer: (state, action) => {
      state.value.customer = state.value.customer.map((item) => {
        if (action.payload._id === item._id) {
          return action.payload;
        } else {
          return item;
        }
      });
    },
    deletedCustomer: (state, action) => {
      state.value.customer = state.value.customer.filter((item) => {
        if (item._id === action.payload) {
          item.deleted = true;
          return item;
        }
        return item;
      });
    },
    recoverCustomer: (state, action) => {
      state.value.customer = state.value.customer.filter((item) => {
        if (item._id === action.payload) {
          item.deleted = false;
          return item;
        }
        return item;
      });
    },
  },
});

export const {
  upDateCustomer,
  editCustomer,
  addCustomer,
  upDateLoading,
  upDateError,
  deletedCustomer,
  recoverCustomer,
} = customerReducer.actions;

// export const customerStore = (state) => state.customer.value;

export const customerStore = (state) => {
  let { customer, loadingCustomer, error } = state.customer.value;
  if (!customer) return state.customer.value;
  let deletedCustomer = [];
  let newCus = customer?.filter((item) => {
    if (item.deleted) {
      deletedCustomer.push(item);
    } else {
      return item;
    }
  });
  customer = newCus;
  return { customer, deletedCustomer, loadingCustomer, error };
};

export const customerReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoading());

    let resCustomer = await HttpClient.get("/customer");
    dispatch(upDateCustomer(resCustomer.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default customerReducer.reducer;
