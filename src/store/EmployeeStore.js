import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  employee: null,
  loadingEmployee: false,
  error: null,
};

export const employeeReducer = createSlice({
  name: "employee",
  initialState: { value: stateDefault },
  reducers: {
    upDateEmployee: (state, action) => {
      state.value = { ...stateDefault, employee: action.payload };
    },
    upDateLoadingEmp: (state, action) => {
      state.value = { ...stateDefault, loadingEmployee: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
  },
});

export const { upDateEmployee, upDateLoadingEmp, upDateError } =
  employeeReducer.actions;

export const employeeStore = (state) => state.employee.value;

export const employeeReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoadingEmp());

    let resEmployee = await HttpClient.get("/personnel");

    dispatch(upDateEmployee(resEmployee.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default employeeReducer.reducer;
