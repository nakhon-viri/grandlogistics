import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthStore";
import orderReducer from "./OrderStore";

export default configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
  },
  // devTools: false,
});
