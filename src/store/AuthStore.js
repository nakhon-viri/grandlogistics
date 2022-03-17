import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: false,
    profile: {},
    loading: false,
    error: "",
  },
  reducers: {
    upDateLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    upDateloading: (state, action) => {
      state.isLogin = action.payload;
    },
    upDateUProfile: (state, action) => {
      state.isLogin = action.payload;
    },
    upDateError: (state, action) => {
      state.isLogin = action.payload;
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

export const { upDateLogin } = authSlice.actions;

// Function thunk
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

export const authIsLogin = (state) => state.auth;

export default authSlice.reducer;
