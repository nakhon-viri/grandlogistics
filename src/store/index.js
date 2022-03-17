import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthStore";
import orderReducer from "./OrderStore";
import customerReducer from "./CustomerStore";
import employeeReducer from "./EmployeeStore";

export default configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    customer: customerReducer,
    employee: employeeReducer,
  },
  // devTools: false,
});
