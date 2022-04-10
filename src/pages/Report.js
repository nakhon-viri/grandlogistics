import {
  Box,
  TablePagination,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Container,
  Paper,
  Grid,
  FormControl,
  TextField,
  InputAdornment,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  Close,
  PrintRounded,
  ChangeCircleRounded,
} from "@mui/icons-material";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import cloneDeep from "lodash.clonedeep";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useOutletContext } from "react-router-dom";

import { orderStore } from "../store/OrderStore";
import { customerStore } from "../store/CustomerStore";
import Controls from "../components/controls";
import TableHeader from "../components/TableHeader";

function descendingComparator(a, b, sortByName) {
  if (b[sortByName] < a[sortByName]) {
    return -1;
  }
  if (b[sortByName] > a[sortByName]) {
    return 1;
  }
  return 0;
}

function getComparator(sortType, sortByName) {
  return sortType === "desc"
    ? (a, b) => descendingComparator(a, b, sortByName)
    : (a, b) => -descendingComparator(a, b, sortByName);
}

const Report = () => {
  const [title, setTitle] = useOutletContext();
  const { order } = useSelector(orderStore);
  const { customer } = useSelector(customerStore);
  //TablePagination
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("pickup_date");
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueSubMonth, setValueSubMonth] = useState("ทั้งเดือน");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(
    dayjs(new Date()).locale("th").format("BBBB")
  );
  const [company, setCompany] = useState("ทั้งหมด");
  //Search
  const [search, setSearch] = useState("");
  //percentage
  const [percentage, setPercentage] = useState(1);
  //TablePagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //TableHeader
  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "asc";
    setSortType(isAsc ? "desc" : "asc");
    setSortByName(property);
  };

  const orderList = useMemo(() => {
    if (!order) return [];
    let newOrder = cloneDeep(order);

    if (company !== "ทั้งหมด") {
      newOrder = newOrder.filter((item) => item.customer._id === company);
    }

    if (valueSubMonth !== "ทั้งเดือน") {
      newOrder = newOrder.filter((order) => {
        let day = dayjs(order.pickup_date).format("D");
        if (valueSubMonth === "ต้นเดือน") {
          return day < 16;
        } else {
          return day > 15;
        }
      });
    }

    if (valueYear !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("BBBB") === valueYear
      );
    }

    if (valueMonth !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueDay !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("DD") === valueDay
      );
    }

    if (search) {
      newOrder = newOrder.filter((s) => {
        if (
          s.customer.cus_name
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          s._oid.trim().toLowerCase().includes(search.trim().toLowerCase())
        )
          return s;
      });
    }

    for (var i = 0; i < newOrder.length; i++) {
      newOrder[i] = { ...newOrder[i], row_number: i + 1 };
    }

    return newOrder;
  }, [order, company, valueSubMonth, valueYear, valueMonth, valueDay, search]);

  let yearQuery = useMemo(() => {
    let newYear = [
      ...new Map(
        order?.map((item) => [
          dayjs(item.pickup_date).locale("th").format("BBBB"),
          dayjs(item.pickup_date).locale("th").format("BBBB"),
        ])
      ).values(),
    ];

    let now = newYear.find(
      (y) => y === dayjs(new Date()).locale("th").format("BBBB")
    );

    if (!now) {
      newYear.push(dayjs(new Date()).locale("th").format("BBBB"));
    }

    return newYear.sort(function (a, b) {
      return a - b;
    });
  }, [order]);

  const total = useMemo(() => {
    let total = orderList.reduce(
      (sum, number) => {
        sum.wage += number.wage;
        sum.price_order += number.price_order;
        sum.profit += number.profit;
        sum.withdraw += number.withdraw;
        sum.cost += number.cost;
        sum.balance += number.balance;
        return sum;
      },
      {
        price_order: 0,
        wage: 0,
        profit: 0,
        withdraw: 0,
        cost: 0,
        balance: 0,
      }
    );
    return total;
  }, [orderList]);

  useEffect(() => setTitle("การเงินบริษัท"), []);

  const tableHeaderProps = {
    isOpenFirstCell: true,
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    headCell: [
      { id: "row_number", label: "ลำดับ" },
      { id: "pickup_date", label: "วันที่" },
      { id: "_oid", label: "รหัสงาน" },
      { id: "cus_name", label: "ชื่อบริษัทลูกค้า" },
      { id: "price_order", label: "ค่างาน(บาท)" },
      { id: "wage", label: "ค่าเที่ยววื่งพนักงาน(บาท)" },
      { id: "profit", label: "กำไร(บาท)" },
    ],
  };

  const calPercentage = () => percentage / 100;

  const FormSelected = ({ text, changeValue, value, dateFormat, ...rest }) => {
    let dateQuery =
      dateFormat === "BBBB"
        ? yearQuery
        : [
            ...new Map(
              cloneDeep(order)
                ?.filter((item) => {
                  if (company === "ทั้งหมด") {
                    return item;
                    // item.customer._id === company
                  }
                  return item.customer._id === company;
                })
                .map((item) => [
                  dayjs(item.pickup_date).locale("th").format(dateFormat),
                  item,
                ])
            ).values(),
          ]
            .sort(function (a, b) {
              return (
                dayjs(b.pickup_date).format(dateFormat) -
                dayjs(a.pickup_date).format(dateFormat)
              );
            })
            .map((item) =>
              dayjs(item.pickup_date).locale("th").format(dateFormat)
            );

    return (
      <Grid item {...rest}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="demo-multiple-name-label">{text}</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={value}
            onChange={changeValue}
            input={
              <OutlinedInput
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  "& fieldset": {
                    borderRadius: 2,
                  },
                }}
                label={text}
              />
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {dateFormat !== "BBBB" ? (
              <MenuItem
                value="ทั้งหมด"
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  mb: 1,
                }}
              >
                {text}ทั้งหมด
              </MenuItem>
            ) : null}
            {dateQuery.map((row, index) => (
              <MenuItem
                key={index}
                value={row}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  mt: index == 0 ? 0 : 1,
                }}
              >
                {row}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  return (
    <Container>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          การเงินบริษัท
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 0, overflow: "hidden" }}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-name-label">{"บริษัท"}</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={company}
                onChange={(e) => {
                  setValueDay("ทั้งหมด");
                  setValueMonth("ทั้งหมด");
                  setValueYear("ทั้งหมด");
                  setValueSubMonth("ทั้งเดือน");
                  setCompany(e.target.value);
                }}
                input={
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      "& fieldset": {
                        borderRadius: 2,
                      },
                    }}
                    label={"บริษัท"}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                <MenuItem
                  value={"ทั้งหมด"}
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    mb: 1,
                  }}
                >
                  ทั้งหมด
                </MenuItem>
                {customer?.map((row, index) => (
                  <MenuItem
                    key={row._id}
                    value={row._id}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mb: 1,
                    }}
                  >
                    {row.cus_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-name-label">
                {"ช่วงเดือน"}
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={valueSubMonth}
                onChange={(e) => {
                  setValueDay("ทั้งหมด");
                  setValueSubMonth(e.target.value);
                }}
                input={
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      "& fieldset": {
                        borderRadius: 2,
                      },
                    }}
                    label={"ช่วงเดือน"}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {["ทั้งเดือน", "ต้นเดือน", "ปลายเดือน"].map((row, index) => (
                  <MenuItem
                    key={index}
                    value={row}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mt: index == 0 ? 0 : 1,
                    }}
                  >
                    {row}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <FormSelected
            text="วัน"
            dateFormat="DD"
            xs={12}
            sm={6}
            md={2}
            value={valueDay}
            changeValue={(e) => {
              setValueSubMonth("ทั้งเดือน");
              setValueDay(e.target.value);
            }}
          />
          <FormSelected
            text="เดือน"
            dateFormat="MMMM"
            xs={12}
            sm={6}
            md={2}
            value={valueMonth}
            changeValue={(e) => setValueMonth(e.target.value)}
          />
          <FormSelected
            text="ปี"
            dateFormat="BBBB"
            xs={12}
            sm={6}
            md={2}
            value={valueYear}
            changeValue={(e) => setValueYear(e.target.value)}
          />
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              variant="outlined"
              fullWidth
              type={"number"}
              autoComplete="off"
              label="ภาษี"
              size="medium"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                "& .MuiInputLabel-root": { fontSize: "1.1rem" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={10}>
            <FormControl
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            >
              <TextField
                placeholder="Search"
                type="search"
                variant="outlined"
                fullWidth
                autoComplete="off"
                size="medium"
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <TableContainer
          sx={{
            position: "relative",
            minWidth: "800px",
          }}
        >
          <Table
            sx={{
              "& td,&th": {
                borderBottomWidth: 1,
              },
            }}
            size={dense ? "small" : "normall"}
          >
            <TableHeader {...tableHeaderProps} />
            <TableBody>
              {orderList
                ?.sort(getComparator(sortType, sortByName))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((Cell) => (
                  <TableRow key={Cell._id} hover>
                    <TableCell align="center">{Cell.row_number}</TableCell>
                    <TableCell align="center">
                      {dayjs(Cell.pickup_date)
                        .locale("th")
                        .format("DD MMMM BBBB")}
                    </TableCell>
                    <TableCell align="center">{Cell._oid}</TableCell>
                    <TableCell align="center">
                      {Cell.customer.cus_name}
                    </TableCell>
                    <TableCell align="right">
                      {Cell.price_order.toLocaleString("en")}
                    </TableCell>
                    <TableCell align="right">
                      {Cell.wage.toLocaleString("en")}
                    </TableCell>
                    <TableCell align="right">
                      {Cell.profit.toLocaleString("en")}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow
                sx={{
                  "& > td": {
                    fontWeight: 500,
                    fontSize: "1rem",
                  },
                }}
              >
                <TableCell colSpan={2} rowSpan={3} align="center" />
                <TableCell colSpan={2}>{"รวม"}</TableCell>
                <TableCell align="right">
                  {total.price_order.toLocaleString("en")}
                </TableCell>
                <TableCell align="right">
                  {total.wage.toLocaleString("en")}
                </TableCell>
                <TableCell align="right">
                  {total.profit.toLocaleString("en")}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "& > td": {
                    fontWeight: 500,
                    fontSize: "1rem",
                  },
                }}
              >
                <TableCell>{"หัก ภาษีหัก ณ ที่จ่าย"}</TableCell>
                <TableCell align="center">{`${percentage}%`}</TableCell>
                <TableCell align="right">
                  {parseFloat(
                    (total.price_order * calPercentage()).toFixed(2)
                  ).toLocaleString("en")}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(
                    (total.wage * calPercentage()).toFixed(2)
                  ).toLocaleString("en")}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(
                    (total.profit * calPercentage()).toFixed(2)
                  ).toLocaleString("en")}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "& > td": {
                    fontWeight: 600,
                    fontSize: "1.3rem",
                  },
                }}
              >
                <TableCell colSpan={2}>{"จำนวนเงินสุทธิ"}</TableCell>
                <TableCell align="right">
                  {(
                    total.price_order +
                    parseFloat((total.price_order * calPercentage()).toFixed(2))
                  ).toLocaleString("en")}
                </TableCell>
                <TableCell align="right">
                  {(
                    total.wage +
                    parseFloat((total.wage * calPercentage()).toFixed(2))
                  ).toLocaleString("en")}
                </TableCell>
                <TableCell align="right">
                  {(
                    total.profit +
                    parseFloat((total.profit * calPercentage()).toFixed(2))
                  ).toLocaleString("en")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "hidden",
          }}
        >
          <FormControlLabel
            control={
              <>
                <Controls.AntSwitch
                  checked={dense}
                  onChange={(e) => setDense(e.target.checked)}
                  inputProps={{ "aria-label": "ant design" }}
                />
                <Typography sx={{ ml: 1 }}>แคบ</Typography>
              </>
            }
            label={""}
            sx={{
              flex: 1,
              margin: 0,
              pl: "31px",
              mb: 1,
            }}
          />
          <TablePagination
            rowsPerPageOptions={[10, 20, 25, 30, 35, 40, 45]}
            component="div"
            count={orderList?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"จำนวนแถว"}
            sx={{
              "& .MuiToolbar-root": {
                p: 0,
                pr: 2,
              },
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Report;
