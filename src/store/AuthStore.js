import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { HttpClient } from "../utils/HttpClient";
import { uploadOrder } from "../store/OrderStore";

const stateDefault = {
  isLogin: false,
  profile: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: stateDefault,
  },
  reducers: {
    upDateloading: (state) => {
      state.value = { ...stateDefault, loading: true };
    },
    upDateLogin: (state, action) => {
      state.value = { ...stateDefault, profile: action.payload, isLogin: true };
    },
    upDateError: (state, action) => {
      state.value = { ...stateDefault, error: action.payload };
    },
  },
});

export const { upDateLogin, upDateloading, upDateError } = authSlice.actions;

export const loginReq = (account) => async (dispatch) => {
  try {
    dispatch(upDateloading());

    let resLogin = await axios.post("/personnel/login", account);
    localStorage.setItem("ACTO", resLogin.data.accessToken);
    let resOrder = await HttpClient.get("/order");

    dispatch(uploadOrder(resOrder.data.data));
    dispatch(upDateLogin(resLogin.data));

  } catch (error) {

    dispatch(upDateError(error.response.data.error.message));
    
  }
};

export const authIsLogin = (state) => state.auth.value;

export default authSlice.reducer;
