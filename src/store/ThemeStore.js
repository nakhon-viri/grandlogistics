import { createSlice } from "@reduxjs/toolkit";

export const themeReducer = createSlice({
  name: "theme",
  initialState: { mode: "light" },
  reducers: {
    upDateTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { upDateTheme } = themeReducer.actions;

export const themeStore = (state) => state.theme.mode;

export default themeReducer.reducer;
