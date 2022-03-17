import { useEffect } from "react";
import "./styles/App.css";
import AppLayOut from "./components/Layout/App";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Employee from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customer from "./pages/Customer";
import Order from "./pages/Order";
import Loading from "./components/Loading";

import { authIsLogin, getProfileReq } from "./store/AuthStore";
import { orderReq, orderStore } from "./store/OrderStore";
import { customerReq, customerStore } from "./store/CustomerStore";
import { employeeReq, employeeStore } from "./store/EmployeeStore";
import { useSelector, useDispatch } from "react-redux";

const RequireAuth = ({ isLogin, location }) => {
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const App = () => {
  const { isLogin, loadingAuth } = useSelector(authIsLogin);
  const { loadingEmployee } = useSelector(employeeStore);
  const { loadingCustomer } = useSelector(customerStore);
  const { loadingOrder } = useSelector(orderStore);
  const dispatch = useDispatch();
  let location = useLocation();

  const reqAuth = {
    isLogin,
    location,
  };

  useEffect(() => {
    const refeshApp = () => {
      let currentDate = new Date();
      const token = localStorage.getItem("ACTO");
      if (!token) return;
      let decoded = jwt_decode(token);
      if (decoded.exp * 1000 < currentDate.getTime()) {
        localStorage.removeItem("ACTO");
        return;
      } else {
        dispatch(orderReq());
        dispatch(getProfileReq());
        dispatch(customerReq());
        dispatch(employeeReq());
      }
    };
    refeshApp();
  }, []);

  if (loadingAuth || loadingEmployee || loadingCustomer || loadingOrder)
    return <Loading />;

  return (
    <Routes>
      <Route element={<RequireAuth {...reqAuth} />}>
        <Route element={<AppLayOut />}>
          <Route path="/" element={<Employee />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/customer" element={<Customer />} />
        </Route>
      </Route>
      <Route
        path="/login"
        element={isLogin ? <Navigate replace to="/" /> : <Login />}
      />
      <Route path="*" element={<div>Something</div>} />
    </Routes>
  );
};

export default App;
