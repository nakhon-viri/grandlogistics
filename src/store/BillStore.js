import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  bill: null,
  loadingBill: false,
  error: null,
};

export const billReducer = createSlice({
  name: "bill",
  initialState: { value: stateDefault },
  reducers: {
    upDatebill: (state, action) => {
      state.value = { ...stateDefault, bill: action.payload };
    },
    upDateLoading: (state, action) => {
      state.value = { ...stateDefault, loadingBill: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
    addBill: (state, action) => {
      state.value.bill.push(action.payload);
    },
  },
});

export const { upDatebill, addBill, upDateLoading, upDateError } =
  billReducer.actions;

export const billStore = (state) => state.bill.value;

export const billReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoading());

    let resBill = await HttpClient.get("/bill");
    dispatch(upDatebill(resBill.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default billReducer.reducer;
