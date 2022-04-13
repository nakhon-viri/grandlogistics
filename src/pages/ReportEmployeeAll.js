import {
  Container,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  Box,
  Grid,
  Typography,
  Button,
  OutlinedInput,
  MenuItem,
  InputLabel,
  Select,
  IconButton,
  FormControlLabel,
} from "@mui/material";
import {
  Search,
  RemoveRedEyeRounded,
  PersonAddAlt1Rounded,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useOutletContext } from "react-router-dom";
import cloneDeep from "lodash.clonedeep";

import { employeeStore } from "../store/EmployeeStore";
import { orderStore } from "../store/OrderStore";
import TableHeader from "../components/TableHeader";
import Controls, { SearchField } from "../components/controls";
import getComparator from "../utils/TableSort";
import DateSort from "../components/DateSort";
import TablePagination from "../components/TablePagination";
import TableRows from "../components/TableRows";

const ReportEmployeeAll = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useOutletContext();
  const { employee } = useSelector(employeeStore);
  const { order } = useSelector(orderStore);
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("wage");
  //Search
  const [search, setSearch] = useState("");
  //Filter by Date
  const [valueSubMonth, setValueSubMonth] = useState(
    dayjs(new Date()).format("D") > 15 ? "ปลายเดือน" : "ต้นเดือน"
  );
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(dayjs(new Date()).format("BBBB"));
  //Pagination
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
  };

  let report = useMemo(() => {
    if (!order || !employee) return [];
    let res = [];
    let newEmp = cloneDeep(employee);
    let newOrder = cloneDeep(order);
    newEmp.forEach((item) => {
      let resOrders = newOrder.filter((cuur) => cuur.personnel === item._id);

      resOrders = resOrders.filter((currOrder) => {
        return dayjs(currOrder.pickup_date).format("BBBB") === valueYear;
      });

      if (valueMonth !== "ทั้งหมด") {
        resOrders = resOrders.filter(
          (currOrder) =>
            dayjs(currOrder.pickup_date).locale("th").format("MMMM") ===
            valueMonth
        );
      }

      if (valueDay !== "ทั้งหมด") {
        resOrders = resOrders.filter(
          (currOrder) =>
            dayjs(currOrder.pickup_date).locale("th").format("DD") === valueDay
        );
      }

      if (valueSubMonth !== "ทั้งเดือน") {
        resOrders = resOrders.filter((order) => {
          let day = dayjs(order.pickup_date).format("D");
          if (valueSubMonth === "ต้นเดือน") {
            return day < 16;
          } else {
            return day > 15;
          }
        });
      }

      let total = resOrders.reduce(
        (sum, number) => {
          sum.wage += number.wage;
          sum.price_order += number.price_order;
          sum.profit += number.profit;
          sum.withdraw += number.withdraw;
          sum.cost += number.cost;
          sum.balance += number.wage - number.cost - number.withdraw;
          return sum;
        },
        { price_order: 0, wage: 0, profit: 0, withdraw: 0, cost: 0, balance: 0 }
      );
      total._id = item._id;
      total.full_name =
        item.full_name.first_name + " " + item.full_name.last_name;
      total.count = resOrders.length;
      res.push(total);
    });

    if (search) {
      res = res.filter((s) => {
        if (
          s.full_name
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
          return s;
      });
    }

    return res;
  }, [employee, order, valueDay, valueMonth, valueYear, valueSubMonth, search]);

  let total = useMemo(() => {
    let total = report.reduce(
      (sum, number) => {
        sum.wage += number.wage;
        sum.price_order += number.price_order;
        sum.profit += number.profit;
        sum.withdraw += number.withdraw;
        sum.cost += number.cost;
        sum.balance += number.balance;
        sum.count += number.count;
        return sum;
      },
      {
        price_order: 0,
        count: 0,
        wage: 0,
        profit: 0,
        withdraw: 0,
        cost: 0,
        balance: 0,
      }
    );
    total.full_name = "Total";
    return total;
  }, [valueDay, valueMonth, report]);

  useEffect(() => setTitle("รายงานการเงินพนักงานทั้งหมด"), []);

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    styleCellProps: {
      fontSize: "1.1rem",
    },
    headCell: [
      { id: "full_name", label: "ชื่อ" },
      { id: "count", label: "จำนวนงาน" },
      { id: "price_order", label: "ค่าเที่ยว(บาท)" },
      { id: "wage", label: "ค่าเที่ยววิ่งพนักงาน(บาท)" },
      { id: "profit", label: "กำไร(บาท)" },
      { id: "withdraw", label: "เบิก(บาท)" },
      { id: "cost", label: "น้ำมัน(บาท)" },
      { id: "balance", label: "ยอดคงเหลือ(บาท)" },
      { id: "", label: "" },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        rowSpacing={2}
        sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}
      >
        <Grid item xs={12} lg={9} sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            รายงานการเงินพนักงานทั้งหมด
          </Typography>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Rounded />}
              onClick={() => navigate("/register")}
              sx={{
                backgroundColor: "rgb(32, 101, 209)",
                boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
                borderRadius: 2,
                "&:hover": {
                  boxShadow: "none",
                },
                mr: 2,
              }}
            >
              ลงทะเบียนพนักงาน
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Paper elevation={3} sx={{ p: 0, overflow: "hidden" }}>
        <DateSort
          isSubMonth
          order={order}
          valueSubMonth={valueSubMonth}
          changeValueSubMonth={(v) => setValueSubMonth(v)}
          valueDay={valueDay}
          changeValueDay={(v) => setValueDay(v)}
          valueMonth={valueMonth}
          changeValueMonth={(v) => setValueMonth(v)}
          valueYear={valueYear}
          changeValueYear={(v) => setValueYear(v)}
        />
        <Box sx={{ p: 3, pt: 0 }}>
          <SearchField handleSearch={(e) => setSearch(e.target.value)} />
        </Box>
        <TableContainer>
          <Table
            size={dense ? "small" : "medium"}
            sx={{
              minWidth: 700,
              "& td": {
                borderBlockWidth: 1,
                fontSize: "1.1rem",
              },
            }}
            aria-label="spanning table"
          >
            <TableHeader isOpenFirstCell {...tableHeaderProps} />
            <TableBody>
              {report
                .sort(getComparator(sortType, sortByName))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  return (
                    <TableRows
                      key={index}
                      hover
                      sxRow={{
                        "& td, & th": {
                          borderBlockWidth: index === report.length - 1 ? 0 : 1,
                        },
                      }}
                      Cell={[
                        { value: item.full_name },
                        {
                          value: item.count.toLocaleString("en"),
                          align: "center",
                        },
                        {
                          value: item.price_order.toLocaleString("en"),
                          align: "right",
                        },
                        {
                          value: item.wage.toLocaleString("en"),
                          align: "right",
                        },
                        {
                          value: item.profit.toLocaleString("en"),
                          align: "right",
                        },
                        {
                          value: item.withdraw.toLocaleString("en"),
                          align: "right",
                        },
                        {
                          value: item.cost.toLocaleString("en"),
                          align: "right",
                        },
                        {
                          value: item.balance.toLocaleString("en"),
                          align: "right",
                        },
                        {
                          value: (
                            <IconButton
                              sx={{ p: 0.5, color: "#4287f5" }}
                              onClick={() =>
                                navigate("/reportemp", {
                                  state: { _id: item._id },
                                })
                              }
                            >
                              <RemoveRedEyeRounded />
                            </IconButton>
                          ),
                          align: "right",
                        },
                      ]}
                    />
                  );
                })}
              <TableRows
                sxRow={{
                  bgcolor: "#00f4b1",
                  "& td": {
                    color: "#555",
                    fontWeight: 700,
                  },
                }}
                Cell={[
                  { value: total.full_name },
                  { value: total.count.toLocaleString("en"), align: "center" },
                  {
                    value: total.price_order.toLocaleString("en"),
                    align: "right",
                  },
                  { value: total.wage.toLocaleString("en"), align: "right" },
                  { value: total.profit.toLocaleString("en"), align: "right" },
                  {
                    value: total.withdraw.toLocaleString("en"),
                    align: "right",
                  },
                  { value: total.cost.toLocaleString("en"), align: "right" },
                  { value: total.balance.toLocaleString("en"), align: "right" },
                  { value: "" },
                ]}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          checked={dense}
          onChecked={(v) => setDense(v)}
          count={report.length}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default ReportEmployeeAll;
