import {
  Container,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

import { employeeStore } from "../store/EmployeeStore";
// [
//   ...new Map([...employee].map((item) => [item._id, item])).values(),
// ]
const ReportEmployeeAll = () => {
  const { employee } = useSelector(employeeStore);
  const [employeeList, setEmployeeList] = useState(employee?.slice());

  let report = useMemo(() => {
    let res = [];
    employeeList?.forEach((item) => {
      let total;
      total = item.orders.reduce(
        (sum, number) => {
          sum.wage += number.wage;
          sum.price_order += number.price_order;
          sum.profit += number.profit;
          sum.withdraw += number.withdraw;
          sum.cost += number.cost;
          return sum;
        },
        { price_order: 0, wage: 0, profit: 0, withdraw: 0, cost: 0 }
      );
      total.full_name = item.full_name;
      res.push(total);
    });
    let total = res.reduce(
      (sum, number) => {
        sum.wage += number.wage;
        sum.price_order += number.price_order;
        sum.profit += number.profit;
        sum.withdraw += number.withdraw;
        sum.cost += number.cost;
        return sum;
      },
      { price_order: 0, wage: 0, profit: 0, withdraw: 0, cost: 0 }
    );
    total.full_name = { first_name: "total", last_name: "" };
    res.push(total);
    return res;
  }, []);
  console.log("report", report);
  return (
    <Container maxWidth="md">
      <TableContainer component={Paper} elevation={3}>
        <Table
          sx={{
            minWidth: 700,
            "& td, & th": {
              borderBlockWidth: 1,
            },
          }}
          aria-label="spanning table"
        >
          <TableHead>
            {/* <TableRow>
              <TableCell align="center" colSpan={3}>
                Details
              </TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell align="right">ค่าเที่ยว</TableCell>
              <TableCell align="right">ค่าเที่ยวพนักงาน</TableCell>
              <TableCell align="right">กำไร</TableCell>
              <TableCell align="right">เบิก</TableCell>
              <TableCell align="right">น้ำมัน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{item.full_name.first_name}</TableCell>
                  <TableCell align="right">{item.price_order}</TableCell>
                  <TableCell align="right">{item.wage}</TableCell>
                  <TableCell align="right">{item.profit}</TableCell>
                  <TableCell align="right">{item.withdraw}</TableCell>
                  <TableCell align="right">{item.cost}</TableCell>
                </TableRow>
              );
              // index !== employeeList.length - 1 ?: (
              //   <>
              //     <TableRow
              //       key={"lastItem"}
              //       sx={{
              //         "& td": {
              //           borderBlockWidth: 0,
              //         },
              //       }}
              //     >
              //       <TableCell colSpan={6}></TableCell>
              //     </TableRow>
              //     <TableRow>
              //       <TableCell colSpan={5}>Subtotal</TableCell>
              //       <TableCell align="right">{610.88}</TableCell>
              //     </TableRow>
              //   </>
              // );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {JSON.stringify(employeeList)}
    </Container>
  );
};

export default ReportEmployeeAll;
