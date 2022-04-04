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
  },
});

export const { upDateCustomer, addCustomer, upDateLoading, upDateError } =
  customerReducer.actions;

export const customerStore = (state) => state.customer.value;

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
