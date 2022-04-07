import { useEffect, useState } from "react";
import "./styles/App.css";
import AppLayOut from "./components/Layout/App";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Employee from "./pages/Employee";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customer from "./pages/Customer";
import AddCustomer from "./pages/AddCustomer";
import Order from "./pages/Order";
import AddOrder from "./pages/AddOrder";
import ProfileEmployee from "./pages/ProfileEmployee";
import EditOrder from "./pages/EditOrder";
import Report from "./pages/Report";
import EditCustomer from "./pages/EditCustomer";
import ReportCustomer from "./pages/ReportCustomer";
import ReportEmployeeAll from "./pages/ReportEmployeeAll";
import ReportEmployee from "./pages/ReportEmployee";
import Trash from "./pages/Trash";
import Bills from "./pages/Bills";
import CreateBill from "./pages/CreateBill";
import Invoices from "./pages/Invoices";
import Loading from "./components/Loading";

import { authStore, getProfileReq } from "./store/AuthStore";
import { orderReq, orderStore } from "./store/OrderStore";
import { customerReq, customerStore } from "./store/CustomerStore";
import { employeeReq, employeeStore } from "./store/EmployeeStore";
import { billReq, billStore } from "./store/BillStore";
import { invoiceReq, invoiceStore } from "./store/InvoiceStore";
import { useSelector, useDispatch } from "react-redux";

// import { io } from "socket.io-client";

const RequireAuth = () => {
  const [socket, setSocket] = useState(null);
  const { isLogin, loadingAuth } = useSelector(authStore);
  const { loadingEmployee } = useSelector(employeeStore);
  const { loadingCustomer } = useSelector(customerStore);
  const { loadingOrder } = useSelector(orderStore);
  const { loadingBill } = useSelector(billStore);
  const { loadingInvoice } = useSelector(invoiceStore);
  const dispatch = useDispatch();
  let location = useLocation();
  const resToken = verifyToken();

  useEffect(() => {
    if (resToken) {
      if (!isLogin) dispatch(getProfileReq());

      dispatch(orderReq());
      dispatch(customerReq());
      dispatch(employeeReq());
      dispatch(billReq());
      dispatch(invoiceReq());
    }
  }, []);

  // useEffect(() => {
  //   if (resToken) {
  //     const newSocket = io("https://api-grandlogistics.herokuapp.com", {
  //       transports: ["websocket"],
  //     });
  //     newSocket.emit("addUser", "61e309a709a2b863241f457e");
  //     newSocket.on("chat message", (data) => {
  //       console.log(data);
  //     });
  //   }
  //   return () => {
  //     return resToken ? newSocket.close() : null;
  //   };
  // }, []);

  if (!isLogin && !resToken)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (
    loadingAuth ||
    loadingEmployee ||
    loadingCustomer ||
    loadingOrder ||
    loadingBill 
    ||
    loadingInvoice
  ) {
    return <Loading />;
  }

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
  const { isLogin } = useSelector(authStore);

  const reqAuth = {
    isLogin,
  };

  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayOut />}>
          <Route path="/" element={<Employee />} />
          <Route path="/profile" element={<ProfileEmployee />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<Order />} />
          <Route path="/addorder" element={<AddOrder />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/editcustomer" element={<EditCustomer />} />
          <Route path="/addcustomer" element={<AddCustomer />} />
          <Route path="/editorder" element={<EditOrder />} />
          <Route path="/reportallemp" element={<ReportEmployeeAll />} />
          <Route path="/report" element={<Report />} />
          <Route path="/reportemp" element={<ReportEmployee />} />
          <Route path="/reportCustomer" element={<ReportCustomer />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/createbill" element={<CreateBill />} />
          <Route path="/invoices" element={<Invoices />} />
        </Route>
      </Route>
      <Route path="/login" element={<NoRequireAuth {...reqAuth} />} />
      <Route path="*" element={<div>Something</div>} />
    </Routes>
  );
};
export default App;
