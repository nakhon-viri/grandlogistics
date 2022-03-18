import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { HttpClient } from "../utils/HttpClient";
import { upDateLoadingEmp } from "../store/EmployeeStore";

const stateDefault = {
  isLogin: false,
  profile: null,
  loadingAuth: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: stateDefault,
  },
  reducers: {
    upDateLoading: (state) => {
      state.value = { ...stateDefault, loadingAuth: true };
    },
    upDateLogin: (state, action) => {
      state.value = { ...stateDefault, profile: action.payload, isLogin: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
  },
});

export const { upDateLogin, upDateLoading, upDateError } = authSlice.actions;

export const loginReq = (account) => async (dispatch) => {
  try {
    dispatch(upDateLoading());
    dispatch(upDateLoadingEmp());

    let resLogin = await axios.post("/personnel/login", account);
    localStorage.setItem("ACTO", resLogin.data.accessToken);

    dispatch(upDateLogin(resLogin.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export const getProfileReq = () => async (dispatch) => {
  try {
    dispatch(upDateLoading());

    let resLogin = await HttpClient.get("/personnel/me");

    dispatch(upDateLogin(resLogin.data));
  } catch (error) {
    dispatch(upDateError(error.response.data.error.message));
  }
};

export const authStore = (state) => state.auth.value;

export default authSlice.reducer;
