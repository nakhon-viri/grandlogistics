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
    addEmployee: (state, action) => {
      state.value.employee.push(action.payload);
    },
    editEmployee: (state, action) => {
      console.log(action.payload);
      state.value.employee = state.value.employee.map((item) => {
        console.log(action.payload._id === item._id);
        if (action.payload._id === item._id) {
          return action.payload;
        } else {
          return item;
        }
      });
    },
  },
});

export const {
  upDateEmployee,
  editEmployee,
  addEmployee,
  upDateLoadingEmp,
  upDateError,
} = employeeReducer.actions;

export const employeeStore = (state) => state.employee.value;

export const employeeReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoadingEmp());

    let resEmployee = await HttpClient.get("/personnel");

    dispatch(upDateEmployee(resEmployee.data.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export default employeeReducer.reducer;
