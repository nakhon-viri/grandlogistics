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
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { employeeStore } from "../store/EmployeeStore";
import { orderStore } from "../store/OrderStore";
import TableHeader from "../components/TableHeader";
import Controls from "../components/controls";

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

const Month = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const ReportEmployeeAll = () => {
  const navigate = useNavigate();
  const { employee } = useSelector(employeeStore);
  const { order } = useSelector(orderStore);
  const [employeeList, setEmployeeList] = useState(employee?.slice());
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("wage");
  //Search
  const [search, setSearch] = useState("");
  //Filter by Date
  const [valueDay, setValueDay] = useState(
    dayjs(new Date()).format("D") > 15 ? "ปลายเดือน" : "ต้นเดือน"
  );
  const [valueMonth, setValueMonth] = useState(
    dayjs(new Date()).locale("th").format("MMMM")
  );
  const [valueYear, setValueYear] = useState("");
  //Dense
  const [dense, setDense] = useState(false);
  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
  };

  let report = useMemo(() => {
    if (!order) return [];
    let res = [];
    employeeList?.forEach((item) => {
      // let resOrders = item.orders.slice();
      let resOrders = order?.filter((cuur) => cuur.personnel._id === item._id);
      // console.log(item._id);
      if (valueDay !== "ทั้งเดือน") {
        resOrders = resOrders.filter((order) => {
          let day = dayjs(order.pickup_date).format("D");
          if (valueDay === "ต้นเดือน") {
            return day < 16;
          } else {
            return day > 15;
          }
        });
      }

      resOrders = resOrders.filter((order) => {
        return (
          dayjs(order.pickup_date).locale("th").format("MMMM") === valueMonth
        );
      });

      resOrders = resOrders.filter((order) => {
        return dayjs(order.pickup_date).format("YYYY") === valueYear;
      });

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
  }, [valueDay, valueMonth, valueYear, search]);

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

  let yearQuery = useMemo(() => {
    let res = [];
    employeeList?.slice().forEach((emp) => {
      res.push(...emp.orders);
    });

    res = [
      ...new Map(
        res?.map((item) => [dayjs(item.pickup_date).format("YYYY"), item])
      ).values(),
    ].sort(function (a, b) {
      return new Date(b.pickup_date) - new Date(a.pickup_date);
    });
    let yearList = [];
    let thisYear = null;
    res.map((item) => {
      yearList.push(dayjs(item.pickup_date).format("YYYY"));
      if (
        dayjs(item.pickup_date).format("YYYY") ==
        dayjs(new Date()).format("YYYY")
      ) {
        setValueYear(dayjs(item.pickup_date).format("YYYY"));
      }
    });
    if (thisYear !== null) {
      setValueYear(yearList[0]);
    }
    return yearList;
  }, []);

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
      { id: "price_order", label: "ค่าเที่ยว" },
      { id: "wage", label: "ค่าเที่ยวพนักงาน" },
      { id: "profit", label: "กำไร" },
      { id: "withdraw", label: "เบิก" },
      { id: "cost", label: "น้ำมัน" },
      { id: "balance", label: "ยอดคงเหลือ" },
      { id: "", label: "" },
    ],
  };

  const FormSelected = ({
    text,
    changeValue,
    queryDate,
    value,
    dateFormat,
    ...rest
  }) => {
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
            {queryDate.map((row, index) => (
              <MenuItem
                key={index}
                value={row}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  ...(index == queryDate.length - 1 ? null : { mb: 0.5 }),
                  // mb: index == queryDate.length - 1 ? 1 : 0,
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
    <Container maxWidth="lg">
      <Grid
        container
        rowSpacing={2}
        sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}
      >
        <Grid item xs={12} lg={9} sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            การเงินพนักงาน(พนักงานทุกคน)
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
        <Grid container spacing={2} sx={{ p: 3 }}>
          <FormSelected
            text="วัน"
            dateFormat="DD"
            xs={6}
            sm={4}
            queryDate={["ทั้งเดือน", "ต้นเดือน", "ปลายเดือน"]}
            md={2}
            value={valueDay}
            changeValue={(e) => setValueDay(e.target.value)}
          />
          <FormSelected
            text="เดือน"
            dateFormat="MMMM"
            xs={6}
            queryDate={Month}
            sm={4}
            md={2}
            value={valueMonth}
            changeValue={(e) => setValueMonth(e.target.value)}
          />
          <FormSelected
            text="ปี"
            dateFormat="YYYY"
            xs={12}
            sm={4}
            queryDate={yearQuery}
            md={2}
            value={valueYear}
            changeValue={(e) => setValueYear(e.target.value)}
          />
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
            </FormControl>{" "}
          </Grid>
        </Grid>
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
                .slice()
                ?.sort(getComparator(sortType, sortByName))
                .map((item, index) => {
                  return (
                    <TableRow
                      hover
                      key={index}
                      sx={{
                        "& td, & th": {
                          borderBlockWidth: index === report.length - 1 ? 0 : 1,
                        },
                      }}
                    >
                      <TableCell>{item.full_name}</TableCell>
                      <TableCell align="center">{item.count}</TableCell>
                      <TableCell align="right">{item.price_order}</TableCell>
                      <TableCell align="right">{item.wage}</TableCell>
                      <TableCell align="right">{item.profit}</TableCell>
                      <TableCell align="right">{item.withdraw}</TableCell>
                      <TableCell align="right">{item.cost}</TableCell>
                      <TableCell align="right">{item.balance}</TableCell>
                      <TableCell align="right">
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow
                sx={{
                  bgcolor: "#00f4b1",
                  "& td": {
                    color: "#555",
                    fontWeight: 700,
                  },
                }}
              >
                <TableCell>{total.full_name}</TableCell>
                <TableCell align="center">{total.count}</TableCell>
                <TableCell align="right">{total.price_order}</TableCell>
                <TableCell align="right">{total.wage}</TableCell>
                <TableCell align="right">{total.profit}</TableCell>
                <TableCell align="right">{total.withdraw}</TableCell>
                <TableCell align="right">{total.cost}</TableCell>
                <TableCell align="right">{total.balance}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            py: 2,
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
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportEmployeeAll;
