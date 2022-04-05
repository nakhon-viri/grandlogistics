import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  employee: null,
  deletedEmployee: null,
  loadingEmployee: false,
  error: null,
};

export const employeeReducer = createSlice({
  name: "employee",
  initialState: { value: stateDefault },
  reducers: {
    upDateEmployee: (state, action) => {
      state.value = {
        ...stateDefault,
        employee: action.payload.filter((item) => item.onDuty === true),
        deletedEmployee: action.payload.filter((item) => item.onDuty === false),
      };
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
      state.value.employee = state.value.employee.map((item) => {
        if (action.payload._id === item._id) {
          return action.payload;
        } else {
          return item;
        }
      });
    },
    deletedEmployee: (state, action) => {
      let empDeleted = [];
      state.value.employee = state.value.employee.filter((item) => {
        if (item._id === action.payload) {
          item.onDuty = false;
          empDeleted.push(item);
          return;
        }
        return item;
      });

      state.value.deletedEmployee.push(...empDeleted);
    },
    recoverEmployee: (state, action) => {
      let employee = [];
      let deletedEmployee = [];
      employee = state.value.deletedEmployee.filter((item) => {
        if (item._id === action.payload) {
          item.onDuty = true;
          return item;
        } else {
          deletedEmployee.push(item);
        }
      });
      state.value.employee.push(...employee);
      state.value.deletedEmployee = deletedEmployee;
    },
  },
});

export const {
  upDateEmployee,
  editEmployee,
  addEmployee,
  upDateLoadingEmp,
  upDateError,
  recoverEmployee,
  deletedEmployee,
} = employeeReducer.actions;

export const employeeStore = (state) => state.employee.value;

// export const employeeStore = (state) => {
//   let { employee, loadingEmployee, error } = state.employee.value;
//   if (!employee) return state.employee.value;
//   let deletedEmployee = [];
//   let newEmp = employee?.filter((item) => {
//     if (item.onDuty) {
//       return item;
//     } else {
//       deletedEmployee.push(item);
//     }
//   });
//   employee = newEmp;
//   return { employee, deletedEmployee, loadingEmployee, error };
// };

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
