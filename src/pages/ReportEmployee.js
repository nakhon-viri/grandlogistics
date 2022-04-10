import {
  List,
  ListItemAvatar,
  ListItemButton,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  TextField,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  TablePagination,
  FormControlLabel,
  InputAdornment,
  Collapse,
  TableHead,
  Button,
  useMediaQuery,
  Stack,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Search,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

import cloneDeep from "lodash.clonedeep";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import { employeeStore } from "../store/EmployeeStore";
import { orderStore } from "../store/OrderStore";
import TableHeader from "../components/TableHeader";
import Controls from "../components/controls";

const UserList = ({ employee, userSelected, handleSelectedUser }) => {
  const media = useMediaQuery("(max-width:1200px)");

  const listProps = {
    component: media ? Stack : null,
    direction: media ? "row" : null,
  };

  return (
    <List {...listProps} dense>
      {employee?.map((value, index) => {
        return (
          <ListItem key={value._id} disablePadding>
            <ListItemButton
              sx={{
                ...((userSelected === value._id ||
                  (!userSelected && index === 0)) && {
                  "&& .MuiTouchRipple-child": {
                    backgroundColor: "#007bff",
                  },
                }),
                ...(media && { width: "200px" }),

                overflow: "hidden",
              }}
              className={
                (userSelected === value._id ||
                  (!userSelected && index === 0)) &&
                " Mui-selected"
              }
              onClick={() => handleSelectedUser(value)}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ height: "70px", width: "70px", fontSize: 50 }}
                  alt={value.full_name.first_name}
                  src={value.photo}
                />
              </ListItemAvatar>
              <ListItemText
                sx={{ pl: 2 }}
                primary={
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    {value.full_name.first_name +
                      " " +
                      value.full_name.last_name}
                  </Typography>
                }
                secondary={
                  <Box
                    component={"span"}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography component={"span"} sx={{ fontSize: "1em" }}>
                      {"แผนก: " + value.department}
                    </Typography>
                    <Typography component={"span"} sx={{ fontSize: "1em" }}>
                      {"ทะเบียน:   " + value.car_no}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const Row = ({ Cell }) => {
  return (
    <>
      <TableRow hover>
        <TableCell />
        <TableCell align="center">
          {Cell.row_number.toLocaleString("en")}
        </TableCell>
        <TableCell component="th" scope="row">
          {dayjs(Cell.pickup_date).locale("th").format("DD MMMM BBBB")}
        </TableCell>
        <TableCell align="right">{Cell.pickup_location}</TableCell>
        <TableCell align="right">{Cell.delivery_location}</TableCell>
        <TableCell align="right">{Cell.profit.toLocaleString("en")}</TableCell>
        <TableCell align="right">{Cell.wage.toLocaleString("en")}</TableCell>
        <TableCell align="right">{Cell.cost.toLocaleString("en")}</TableCell>
        <TableCell align="right">
          {Cell.withdraw.toLocaleString("en")}
        </TableCell>
        <TableCell align="right">
          {(Cell.wage - Cell.cost - Cell.withdraw).toLocaleString("en")}
        </TableCell>
      </TableRow>
    </>
  );
};

const ReportEmployee = () => {
  let { state } = useLocation();
  const [title, setTitle] = useOutletContext();
  const { employee } = useSelector(employeeStore);
  const { order } = useSelector(orderStore);
  const [employeeList, setEmployeeList] = useState(employee?.slice());
  const [userSelected, setUserSelected] = useState(null);
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("pickup_date");
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(
    dayjs(new Date()).locale("th").format("BBBB")
  );
  //Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  //Dense Table
  const [dense, setDense] = useState(false);
  //Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    let emp = employee?.slice();
    if (state?._id && emp) {
      let res = emp?.filter((item) => item._id === state?._id);
      setUserSelected(cloneDeep(res)[0]);
    } else if (employee) {
      setUserSelected(...employee.slice(0, 1));
    }
  }, [employee, state]);

  let orders = useMemo(() => {
    if (!userSelected) return;
    if (!order) return [];

    let newOrders = order?.filter(
      (item) => item.personnel._id === userSelected._id
    );

    if (valueYear !== "ทั้งหมด") {
      newOrders = newOrders.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("BBBB") === valueYear
      );
    }

    if (valueMonth !== "ทั้งหมด") {
      newOrders = newOrders.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueDay !== "ทั้งหมด") {
      newOrders = newOrders.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("DD") === valueDay
      );
    }

    for (var i = 0; i < newOrders.length; i++) {
      newOrders[i] = { ...newOrders[i], row_number: i };
    }

    for (var i = 0; i < newOrders.length; i++) {
      newOrders[i] = { ...newOrders[i], row_number: i };
    }

    if (search) {
      newOrders = newOrders.filter((s) => {
        if (
          s.delivery_location
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          s.pickup_location
            .trim()
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
          return s;
      });
    }

    return newOrders;
  }, [userSelected, employee, valueDay, valueMonth, valueYear, search]);

  let total = useMemo(() => {
    if (!orders) return;
    let total = orders.reduce(
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
    total.full_name = "Total";
    return total;
  }, [orders]);

  let yearQuery = useMemo(() => {
    if (!userSelected) return [];
    let newOrders = order?.filter(
      (item) => item.personnel._id === userSelected._id
    );
    let newYear = [
      ...new Map(
        newOrders?.map((item) => [
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
 
    return newYear;
  }, [userSelected, order]);

  useEffect(() => setTitle("การเงินพนักงานรายบุลคล"), []);

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "asc";
    setSortType(isAsc ? "desc" : "asc");
    setSortByName(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const userListProps = {
    employee: employeeList,
    handleSelectedUser: (user) => {
      setValueYear(dayjs(new Date()).locale("th").format("BBBB"));
      setValueMonth("ทั้งหมด");
      setValueDay("ทั้งหมด");
      setPage(0);
      setUserSelected(user);
    },
    userSelected: userSelected?._id || null,
  };

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    isOpenFirstCell: true,
    headCell: [
      { id: "row_number", label: "ลำดับ" },
      { id: "pickup_date", label: "วันที่" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "profit", label: "กำไร(บาท)" },
      { id: "wage", label: "ค่าเที่ยวพนักงาน(บาท)" },
      { id: "cost", label: "ค่าน้ำมัน(บาท)" },
      { id: "withdraw", label: "เบิก(บาท)" },
      { id: "balance", label: "ยอดคงเหลือ(บาท)" },
    ],
  };

  const FormSelected = ({ text, changeValue, value, dateFormat, ...rest }) => {
    let dateQuery =
      dateFormat === "BBBB"
        ? yearQuery
        : [
            ...new Map(
              userSelected?.orders
                ?.slice()
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
            MenuProps={MenuProps}
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
                  mb: 1,
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

  const BoxReport = ({ title, sum }) => {
    return (
      <Box justifyContent="space-between" display="flex" mb={0.8}>
        <Typography>{title}</Typography>
        <Typography>{sum}</Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          การเงินพนักงานรายบุลคล
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Box>
            <Paper sx={styles.containerUserReport} elevation={2}>
              <Typography
                variant="h5"
                align={"center"}
                sx={{ fontFamily: "Itim", fontWeight: 500, fontSize: "2rem" }}
              >
                {userSelected?.full_name?.first_name +
                  " " +
                  userSelected?.full_name?.last_name}
              </Typography>
              <Typography
                variant="h5"
                align={"center"}
                sx={{ fontFamily: "Itim", fontWeight: 500 }}
                mb={2}
              >
                สรุปการเงิน
              </Typography>
              {total ? (
                <>
                  <BoxReport
                    title="จำนวนงานทั้งหมด"
                    sum={orders?.length.toLocaleString("en") + " งาน"}
                  />
                  <BoxReport
                    title="กำไรรวม"
                    sum={total.profit.toLocaleString("en") + " บาท"}
                  />
                  <BoxReport
                    title="ค่าน้ำมันรวม"
                    sum={total.cost.toLocaleString("en") + " บาท"}
                  />
                  <BoxReport
                    title="เบิกรวม"
                    sum={total.withdraw.toLocaleString("en") + " บาท"}
                  />
                  <BoxReport
                    title="ยอดคงเหลือรวม"
                    sum={total.balance.toLocaleString("en") + " บาท"}
                  />
                </>
              ) : null}
            </Paper>
            <Paper sx={styles.containerUserList} elevation={2}>
              <UserList {...userListProps} />
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Box mb={10}>
            <Paper
              elevation={3}
              sx={{
                paddingInline: 0,
                boxSizing: "border-box",
                mb: 2,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(145, 158, 171, 0.16)",
                  px: 3,
                  py: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Itim", fontWeight: 500 }}
                >
                  {userSelected?.full_name?.first_name +
                    " " +
                    userSelected?.full_name?.last_name}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ p: 3 }}>
                <Grid item xs={12} sm={12} md={6}>
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
                <FormSelected
                  text="วัน"
                  dateFormat="DD"
                  xs={6}
                  sm={4}
                  md={2}
                  value={valueDay}
                  changeValue={(e) => setValueDay(e.target.value)}
                />
                <FormSelected
                  text="เดือน"
                  dateFormat="MMMM"
                  xs={6}
                  sm={4}
                  md={2}
                  value={valueMonth}
                  changeValue={(e) => setValueMonth(e.target.value)}
                />
                <FormSelected
                  text="ปี"
                  dateFormat="BBBB"
                  xs={12}
                  sm={4}
                  md={2}
                  value={valueYear}
                  changeValue={(e) => setValueYear(e.target.value)}
                />
              </Grid>

              <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                <TableContainer
                  sx={{
                    position: "relative",
                    minWidth: "800px",
                  }}
                >
                  <Table size={dense ? "small" : "normall"}>
                    <TableHeader {...tableHeaderProps}>
                      {/* { id: "row_number", label: "ลำดับ" }, */}
                      <TableCell
                        sx={{
                          color: "text.secondary",
                          width: "24px",
                        }}
                      />
                    </TableHeader>
                    <TableBody>
                      {orders &&
                        orders
                          .sort(getComparator(sortType, sortByName))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((Cell) => <Row key={Cell._id} Cell={Cell} />)}
                      {total ? (
                        <TableRow
                          sx={{
                            bgcolor: "#00f4b1",
                            "& td": {
                              color: "#555",
                              fontWeight: 700,
                            },
                          }}
                        >
                          <TableCell />
                          <TableCell align="center">
                            {orders?.length.toLocaleString("en")}
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell align="right">
                            {total.profit.toLocaleString("en")}
                          </TableCell>
                          <TableCell align="right">
                            {total.wage.toLocaleString("en")}
                          </TableCell>
                          <TableCell align="right">
                            {total.cost.toLocaleString("en")}
                          </TableCell>
                          <TableCell align="right">
                            {total.withdraw.toLocaleString("en")}
                          </TableCell>
                          <TableCell align="right">
                            {total.balance.toLocaleString("en")}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
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
                  rowsPerPageOptions={[5, 10, 20, 25, 30, 35, 40, 45]}
                  component="div"
                  count={orders?.length || 0}
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const styles = {
  containerUserList: {
    maxHeight: "calc(100vh - 220px)",
    overflow: "auto",
  },
  containerUserWork: {
    backgroundColor: "#aff",
    width: "100%",
    height: "100%",
  },
  containerUserReport: {
    px: 2,
    py: 3,
    mb: 2,
  },
};

export default ReportEmployee;
