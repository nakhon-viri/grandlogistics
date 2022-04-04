import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  invoice: null,
  loadingInvoice: false,
  error: null,
};

export const invoiceReducer = createSlice({
  name: "invoice",
  initialState: { value: stateDefault },
  reducers: {
    upDateInvoice: (state, action) => {
      state.value = { ...stateDefault, invoice: action.payload };
    },
    upDateLoading: (state, action) => {
      state.value = { ...stateDefault, loadingInvoice: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
    addInvoice: (state, action) => {
      state.value.invoice.push(action.payload);
    },
  },
});

export const { upDateInvoice, addInvoice, upDateLoading, upDateError } =
  invoiceReducer.actions;

export const invoiceStore = (state) => state.invoice.value;

export const invoiceReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoading());
    let resInvoice = await HttpClient.get("/invoice");
    dispatch(upDateInvoice(resInvoice.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default invoiceReducer.reducer;
