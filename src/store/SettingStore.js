import { createSlice } from "@reduxjs/toolkit";
import { HttpClient } from "../utils/HttpClient";

const stateDefault = {
  setting: {
    department: [
      "เซลล์",
      "พนักงานขับรถ",
      "แผนกบัญชี",
      "ทีมบริหาร",
      "พนักงานดูหน้าโหลดสินค้า",
    ],
  },
  loadingSetting: false,
  error: null,
};

export const settingReducer = createSlice({
  name: "setting",
  initialState: { value: stateDefault },
  reducers: {
    addDepartment: (state, action) => {
      state.value.setting.department.push(action.payload);
    },
    editDepartment: (state, action) => {
      state.value.setting.department = state.value.setting.department.map(
        (item) => {
          if (action.payload._id == item._id) {
            return action.payload;
          }
          return item;
        }
      );
    },
    delDepartment: (state, action) => {
      state.value.setting.department = state.value.setting.department.filter(
        (item) => item._id != action.payload
      );
    },
    upDateDepartment: (state, action) => {
      state.value.setting.department = action.payload;
      state.value.loadingSetting = false;
    },
    upDateLoadingDepartment: (state, action) => {
      state.value = { ...stateDefault, loadingSetting: true };
    },
    upDateErrorDepartment: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
  },
});

export const {
  addDepartment,
  upDateDepartment,
  upDateLoadingDepartment,
  upDateErrorDepartment,
  editDepartment,
  delDepartment,
} = settingReducer.actions;

export const departmentReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoadingDepartment());

    let { data } = await HttpClient.get("/department");

    dispatch(upDateDepartment(data));
  } catch (error) {
    dispatch(upDateErrorDepartment(error.response));
  }
};

export const settingStore = (state) => {
  let { loadingSetting, error } = state.setting.value;
  let newState2 = state.setting.value.setting;
  return { loadingSetting, error, ...newState2 };
};

export default settingReducer.reducer;
