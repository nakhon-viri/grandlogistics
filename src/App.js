import React from "react";
import "./styles/App.css";
import AppLayOut from "./components/Layout/App";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";

import Employee from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customer from "./pages/Customer";
import Order from "./pages/Order";

import { authIsLogin } from "./store/AuthStore";
import { useSelector } from "react-redux";

const RequireAuth = ({ isLogin, location }) => {
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const App = () => {
  const {isLogin} = useSelector(authIsLogin);
  let location = useLocation();

  const reqAuth = {
    isLogin,
    location,
  };

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
      <Route path="*" element={<div>NotFound</div>} />
    </Routes>
  );
};

export default App;
