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
  MonetizationOnRounded,
  LocalShippingRounded,
  AccountBalanceWalletRounded,
  AttachMoneyRounded,
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
import Controls, { SearchField } from "../components/controls";
import DateSort from "../components/DateSort";
import TablePagination from "../components/TablePagination";
import TableRows from "../components/TableRows";
import getComparator from "../utils/TableSort";

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

const Row = ({ Cell }) => {
  return <></>;
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

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "asc";
    setSortType(isAsc ? "desc" : "asc");
    setSortByName(property);
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

  const BoxReport = ({ icon, title, number, unit }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          minWidth: "200px",
          borderRightWidth: 1,
          borderRightColor: "red",
          width: "100%",
          mr: 3,
          my: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 3,
            "& .MuiSvgIcon-root": {
              fontSize: "52px",
              color: "#007bff",
            },
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.3rem" }}>
            {title}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            <span style={{ fontWeight: 600 }}>{number}</span>
            {" " + unit}
          </Typography>
        </Box>
      </Box>
    );
  };

  let orderUserSelected = useMemo(() => {
    if (!order || !userSelected) return [];
    let newOrders = order?.filter(
      (item) => item.personnel === userSelected._id
    );
    return newOrders;
  }, [userSelected, order]);

  useEffect(() => {
    let emp = cloneDeep(employee);
    if (state?._id && emp) {
      let res = emp?.filter((item) => item._id === state?._id);
      setUserSelected(cloneDeep(res)[0]);
    } else if (employee) {
      setUserSelected(...employee.slice(0, 1));
    }
  }, [employee, state]);

  let orders = useMemo(() => {
    if (!userSelected || !order) return [];

    let newOrders = orderUserSelected;

    newOrders = newOrders.filter(
      (a) => dayjs(a.pickup_date).locale("th").format("BBBB") === valueYear
    );

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

    for (var i = 0; i < newOrders.length; i++) {
      newOrders[i] = { ...newOrders[i], row_number: i };
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

  useEffect(() => setTitle("รายงานการเงินพนักงานรายบุคคล"), []);

  return (
    <Box>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          รายงานการเงินพนักงานรายบุคคล
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            p: 0,
            py: 2,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            overflow: "auto",
            mb: 2,
            width: "100%",
          }}
        >
          {total ? (
            <>
              <BoxReport
                icon={
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "#007bff" }}
                  >
                    All
                  </Typography>
                }
                title="จำนวนงาน"
                number={orders?.length.toLocaleString("en")}
                unit="งาน"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: "dashed" }}
              />
              <BoxReport
                icon={<MonetizationOnRounded />}
                title="กำไรรวม"
                number={total.profit.toLocaleString("en")}
                unit="บาท"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: "dashed" }}
              />
              <BoxReport
                icon={<MonetizationOnRounded />}
                title="ค่าเที่ยวทั้งหมด"
                number={total.wage.toLocaleString("en")}
                unit="บาท"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: "dashed" }}
              />
              <BoxReport
                icon={<LocalShippingRounded />}
                title="ค่าน้ำมันรวม"
                number={total.cost.toLocaleString("en")}
                unit="บาท"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: "dashed" }}
              />
              <BoxReport
                icon={<AttachMoneyRounded />}
                title="เบิกรวม"
                number={total.withdraw.toLocaleString("en")}
                unit="บาท"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderStyle: "dashed" }}
              />
              <BoxReport
                icon={<AccountBalanceWalletRounded />}
                title="ยอดคงเหลือ"
                number={total.balance.toLocaleString("en")}
                unit="บาท"
              />
            </>
          ) : null}
        </Paper>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Box>
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
              <DateSort
                order={orderUserSelected}
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
              <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                <TableContainer
                  sx={{
                    position: "relative",
                    minWidth: "840px",
                  }}
                >
                  <Table size={dense ? "small" : "normall"}>
                    <TableHeader {...tableHeaderProps}>
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
                          .map((Cell) => (
                            <TableRows
                              key={Cell._id}
                              hover
                              Cell={[
                                { value: "" },
                                {
                                  value: Cell.row_number.toLocaleString("en"),
                                  align: "center",
                                },
                                {
                                  value: dayjs(Cell.pickup_date)
                                    .locale("th")
                                    .format("DD MMMM BBBB"),
                                },
                                {
                                  value: Cell.pickup_location,
                                  align: "right",
                                },
                                {
                                  value: Cell.delivery_location,
                                  align: "right",
                                },
                                {
                                  value: Cell.profit.toLocaleString("en"),
                                  align: "right",
                                },
                                {
                                  value: Cell.wage.toLocaleString("en"),
                                  align: "right",
                                },
                                {
                                  value: Cell.cost.toLocaleString("en"),
                                  align: "right",
                                },
                                {
                                  value: Cell.withdraw.toLocaleString("en"),
                                  align: "right",
                                },
                                {
                                  value: (
                                    Cell.wage -
                                    Cell.cost -
                                    Cell.withdraw
                                  ).toLocaleString("en"),
                                  align: "right",
                                },
                              ]}
                            />
                          ))}
                      {total ? (
                        <TableRows
                          sxRow={{
                            bgcolor: "#00f4b1",
                            "& td": {
                              color: "#555",
                              fontWeight: 700,
                            },
                          }}
                          Cell={[
                            { value: "" },
                            { value: orders?.length.toLocaleString("en") },
                            {
                              value: orders?.length.toLocaleString("en"),
                              align: "center",
                            },
                            {
                              value: "",
                              colSpan: 2,
                            },
                            {
                              value: total.profit.toLocaleString("en"),
                              align: "right",
                            },
                            {
                              value: total.wage.toLocaleString("en"),
                              align: "right",
                            },
                            {
                              value: total.cost.toLocaleString("en"),
                              align: "right",
                            },
                            {
                              value: total.withdraw.toLocaleString("en"),
                              align: "right",
                            },
                            {
                              value: total.balance.toLocaleString("en"),
                              align: "right",
                            },
                          ]}
                        />
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <TablePagination
                checked={dense}
                onChecked={(v) => setDense(v)}
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
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
