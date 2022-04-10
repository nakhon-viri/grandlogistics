import {
  Paper,
  Box,
  Zoom,
  Typography,
  Dialog,
  ListItemText,
  ListItemAvatar,
  ListItem,
  List,
  Avatar,
  Button,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  TableHead,
  IconButton,
  TablePagination,
  FormControlLabel,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  Divider,
  Toolbar,
  Tooltip,
  AppBar,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Filter } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  Close,
  PrintRounded,
  ChangeCircleRounded,
} from "@mui/icons-material";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/th";
import cloneDeep from "lodash.clonedeep";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import { customerStore } from "../store/CustomerStore";
import { orderStore } from "../store/OrderStore";
import Controls from "../components/controls";
import TableHeader from "../components/TableHeader";
import ReportBill from "../components/ReportBill";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

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

const SelectedCustomer = ({ onClose, selectedValue, open, listCustomer }) => {
  let navigate = useNavigate();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      PaperComponent={Box}
      onClose={handleClose}
      TransitionComponent={Transition}
      open={open}
    >
      <Paper sx={{ px: 0, overflow: "hidden" }}>
        <Box sx={{ backgroundColor: "rgba(145, 158, 171, 0.16)", p: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "Itim", textAlign: "center" }}
          >
            เลือกบริษัทคู้ค้า
          </Typography>
        </Box>
        <Box sx={{ maxHeight: "300px", px: 1, overflow: "auto" }}>
          <List sx={{ pt: 0 }}>
            {listCustomer?.map((item, index) => (
              <ListItem
                button
                onClick={() => handleListItemClick(item)}
                key={index}
                sx={{ borderRadius: 2, mt: index === 0 && 1 }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#bbdefb",
                      color: "#1e88e5",
                    }}
                    // alt={"value.full_name.first_name"}
                    src={item.cus_img}
                  >
                    {item.cus_name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.cus_name} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            p: 1,
            backgroundColor: "rgba(145, 158, 171, 0.16)",
          }}
        >
          <ListItem
            autoFocus
            sx={{
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            button
            onClick={() => navigate("/addcustomer")}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon sx={{ color: "#fff" }} />
              </Avatar>
            </ListItemAvatar>
            <Typography>เพิ่มบริษัทคู่ค้า</Typography>
          </ListItem>
        </Box>
      </Paper>
    </Dialog>
  );
};

const Row = ({ Cell, isItemSelected, labelId, handleClick }) => {
  const theme = useTheme();
  return (
    <TableRow hover>
      <TableCell align="center">
        {dayjs(Cell.pickup_date).locale("th").format("DD MMMM BBBB")}
      </TableCell>
      <TableCell align="center">{Cell._oid}</TableCell>
      <TableCell align="center">{Cell.pickup_location}</TableCell>
      <TableCell align="center">{Cell.delivery_location}</TableCell>
      <TableCell align="right" sx={{ pr: 5 }}>
        {Cell.price_order.toLocaleString("en")}
      </TableCell>
    </TableRow>
  );
};

const EnhancedTableToolbar = ({ title, print }) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        backgroundColor: "rgba(145, 158, 171, 0.16)",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
    </Toolbar>
  );
};

export default function SimpleDialogDemo() {
  const { customer } = useSelector(customerStore);
  const [title, setTitle] = useOutletContext();
  const { order } = useSelector(orderStore);
  //Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  //Customer
  const [customerList] = useState(customer?.slice());
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("pickup_date");
  //TablePagination
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueSubMonth, setValueSubMonth] = useState("ทั้งเดือน");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(
    dayjs(new Date()).locale("th").format("BBBB")
  );
  //percentage
  const [percentage, setPercentage] = useState(1);
  //Search
  const [search, setSearch] = useState("");
  //CheckBox
  const [selected, setSelected] = React.useState([]);
  //Dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = (value) => {
    setOpenDialog(false);
    setSelectedCustomer(value);
  };
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

  const calPercentage = () => percentage / 100;

  useEffect(() => {
    if (customer) {
      let newList = customer?.slice(0, 1);
      setSelectedCustomer(newList[0]);
    }
  }, [customer]);

  let orders = useMemo(() => {
    if (!order) return [];

    let newOrders = order?.filter(
      (item) => item.customer === selectedCustomer._id
    );

    if (valueSubMonth !== "ทั้งเดือน") {
      newOrders = newOrders.filter((order) => {
        let day = dayjs(order.pickup_date).format("D");
        if (valueSubMonth === "ต้นเดือน") {
          return day < 16;
        } else {
          return day > 15;
        }
      });
    }

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
  }, [
    selectedCustomer,
    valueDay,
    valueMonth,
    valueYear,
    valueSubMonth,
    search,
  ]);

  let sumTotal = useMemo(
    () =>
      orders?.reduce((sum, item) => {
        return (sum += item.price_order);
      }, 0),
    [orders]
  );

  let listBil = useMemo(() => {
    let sumReport = {};
    sumReport = selected.reduce((acc, curr) => {
      const str =
        curr.car_type +
        "รับสินค้าจาก " +
        curr.pickup_location +
        " นำส่ง " +
        curr.delivery_location +
        " รอบ " +
        curr.per_time +
        "@" +
        curr.price_order;
      acc[str] = (acc[str] || 0) + 1;
      return acc;
    }, {});

    let DR = [];
    for (const key in sumReport) {
      let price = parseInt(key.split("@")[1]);
      DR.push({
        list: key.split("@")[0],
        price: price,
        amount: sumReport[key],
      });
    }
    return DR;
  }, [selected]);

  let dayQuery = useMemo(() => {
    let newDay = [
      ...new Map(
        order
          ?.filter((item) => item.customer === selectedCustomer._id)
          .map((item) => [
            dayjs(item.pickup_date).locale("th").format("DD"),
            item,
          ])
      ).values(),
    ].sort(function (a, b) {
      return (
        dayjs(b.pickup_date).format("DD") - dayjs(a.pickup_date).format("DD")
      );
    });

    return newDay.map((item) =>
      dayjs(item.pickup_date).locale("th").format("DD")
    );
  }, [selectedCustomer]);

  let monthQuery = useMemo(() => {
    let newMonth = [
      ...new Map(
        order
          ?.filter((item) => item.customer === selectedCustomer._id)
          .map((item) => [
            dayjs(item.pickup_date).locale("th").format("MMMM"),
            item,
          ])
      ).values(),
    ].sort(function (a, b) {
      return (
        dayjs(b.pickup_date).format("MMMM") -
        dayjs(a.pickup_date).format("MMMM")
      );
    });

    return newMonth.map((item) =>
      dayjs(item.pickup_date).locale("th").format("MMMM")
    );
  }, [selectedCustomer, order]);

  let yearQuery = useMemo(() => {
    let newOrders = order?.filter(
      (item) => item.customer === selectedCustomer._id
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

    return newYear.sort(function (a, b) {
      return a - b;
    });
  }, [selectedCustomer, order]);

  useEffect(() => setTitle("การเงินบริษัทคู่ค้า"), []);

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    headCell: [
      { id: "pickup_date", label: "วันที่" },
      { id: "_oid", label: "รหัสงาน" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "profit", label: "ค่าเที่ยว(บาท)" },
    ],
  };

  const FormSelected = ({
    text,
    changeValue,
    value,
    dateQuery,
    dateFormat,
    ...rest
  }) => {
    // let dateQuery = dateFormat === "DD" ? orders : selectedCustomer.orders;
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
    <Container maxWidth={"md"}>
      <Grid
        container
        rowSpacing={2}
        sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}
      >
        <Grid item xs={12} lg={9} sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            {selectedCustomer.cus_name}
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
              startIcon={<ChangeCircleRounded />}
              onClick={handleClickOpen}
              sx={{
                backgroundColor: "rgb(32, 101, 209)",
                boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
                borderRadius: 2,
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              เปลี่ยนบริษัท
            </Button>
          </Box>
        </Grid>
      </Grid>
      <SelectedCustomer
        listCustomer={customerList}
        selectedValue={selectedCustomer}
        open={openDialog}
        onClose={handleClose}
      />
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
        <EnhancedTableToolbar title={selectedCustomer.cus_name} />
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
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
                      mb: 1,
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
            md={3}
            dateQuery={dayQuery}
            value={valueDay}
            changeValue={(e) => setValueDay(e.target.value)}
          />
          <FormSelected
            text="เดือน"
            dateFormat="MMMM"
            xs={12}
            sm={6}
            md={3}
            dateQuery={monthQuery}
            value={valueMonth}
            changeValue={(e) => setValueMonth(e.target.value)}
          />
          <FormSelected
            text="ปี"
            dateFormat="BBBB"
            xs={12}
            sm={6}
            md={3}
            dateQuery={yearQuery}
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
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
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
              <TableHeader isOpenFirstCell {...tableHeaderProps} />
              <TableBody>
                {orders
                  ?.sort(getComparator(sortType, sortByName))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((Cell) => {
                    return <Row key={Cell._id} Cell={Cell} />;
                  })}
                <TableRow
                  sx={{
                    "& > td": {
                      fontWeight: 500,
                      fontSize: "1rem",
                    },
                  }}
                >
                  <TableCell rowSpan={3} colSpan={2} />
                  <TableCell colSpan={2}>รวม</TableCell>
                  <TableCell align="right" sx={{ pr: 5 }}>
                    {sumTotal.toLocaleString("en")}
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
                  <TableCell>หัก ภาษีหัก ณ ที่จ่าย</TableCell>
                  <TableCell align="center">{`${percentage}%`}</TableCell>
                  <TableCell align="right" sx={{ pr: 5 }}>
                    {(sumTotal * calPercentage()).toLocaleString("en")}
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
                  <TableCell colSpan={2}>จำนวนเงินสุทธิ</TableCell>
                  <TableCell align="right" sx={{ pr: 5 }}>
                    {(sumTotal - sumTotal * calPercentage()).toLocaleString(
                      "en"
                    )}
                  </TableCell>
                </TableRow>
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
    </Container>
  );
}
