import React from "react";

import { authStore } from "../store/AuthStore";
import { orderStore } from "../store/OrderStore";
import { customerStore } from "../store/CustomerStore";
import { employeeStore } from "../store/EmployeeStore";
import { useSelector } from "react-redux";

const Order = () => {
  const { employee } = useSelector(employeeStore);
  // const {} = useSelector(customerStore);
  // const {} = useSelector(orderStore);
  // const {} = useSelector(authStore);
  return <div>{JSON.stringify(employee)}</div>;
};

export default Order;
