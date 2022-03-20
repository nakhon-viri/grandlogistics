import { useEffect, useState } from "react";
import "./styles/App.css";
import AppLayOut from "./components/Layout/App";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Employee from "./pages/Employee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customer from "./pages/Customer";
import Order from "./pages/Order";
import Loading from "./components/Loading";

import { authStore, getProfileReq } from "./store/AuthStore";
import { orderReq, orderStore } from "./store/OrderStore";
import { customerReq, customerStore } from "./store/CustomerStore";
import { employeeReq, employeeStore } from "./store/EmployeeStore";
import { useSelector, useDispatch } from "react-redux";

import { io } from "socket.io-client";

const RequireAuth = ({ isLogin }) => {
  const [socket, setSocket] = useState(null);
  let location = useLocation();
  const resToken = verifyToken();

  if (!isLogin && !resToken)
    return <Navigate to="/login" state={{ from: location }} replace />;

  useEffect(() => {
    if (isLogin) {
      const newSocket = io("https://api-grandlogistics.herokuapp.com", {
        transports: ["websocket"],
      });
      newSocket.emit("addUser", "61e309a709a2b863241f457e");
      newSocket.on("chat message", (data) => {
        console.log(data);
      });
    }
    return () => {
      return isLogin ? newSocket.close() : null;
    };
  }, []);

  return <Outlet />;
};

const NoRequireAuth = ({ isLogin }) => {
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  if (isLogin) {
    return <Navigate to={from} replace />;
  }
  return <Login />;
};

const verifyToken = () => {
  let currentDate = new Date();
  const token = localStorage.getItem("ACTO");
  if (!token) return null;
  let decoded = jwt_decode(token);
  if (decoded.exp * 1000 < currentDate.getTime()) {
    localStorage.removeItem("ACTO");
    return false;
  } else {
    return true;
  }
};

const App = () => {
  const { isLogin, loadingAuth } = useSelector(authStore);
  const { loadingEmployee } = useSelector(employeeStore);
  const { loadingCustomer } = useSelector(customerStore);
  const { loadingOrder } = useSelector(orderStore);
  const dispatch = useDispatch();

  const reqAuth = {
    isLogin,
  };

  useEffect(() => {
    const resToken = verifyToken();
    if (resToken) {
      dispatch(orderReq());
      dispatch(getProfileReq());
      dispatch(customerReq());
      dispatch(employeeReq());
    }
  }, []);

  if (loadingAuth || loadingEmployee || loadingCustomer || loadingOrder) {
    return <Loading />;
  }

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
      <Route path="/login" element={<NoRequireAuth {...reqAuth} />} />
      <Route path="*" element={<div>Something</div>} />
    </Routes>
  );
};
export default App;
