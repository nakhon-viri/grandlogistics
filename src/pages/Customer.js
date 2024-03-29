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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  Add,
  EditRounded,
  DeleteRounded,
  ChangeCircleRounded,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/th";
import cloneDeep from "lodash.clonedeep";
import { useOutletContext } from "react-router-dom";

import { customerStore } from "../store/CustomerStore";
import { orderStore, deleteOrder } from "../store/OrderStore";
import Controls from "../components/controls";
import TableHeader from "../components/TableHeader";
import StatusColor from "../components/StatusColor";
import Loading from "../components/Loading";
import { HttpClient } from "../utils/HttpClient";

import SelectedCustomer from "../components/SelectedCustomer";
import getComparator from "../utils/TableSort";

const Row = ({ Cell, handleDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover onClick={() => setOpen(!open)} sx={{ cursor: "pointer" }}>
        <TableCell component="th" scope="row" sx={{ p: 0, pl: 1 }}>
          <IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{Cell._oid}</TableCell>
        <TableCell component="th" scope="row">
          {dayjs(Cell.pickup_date).locale("th").format("DD MMMM BBBB")}
        </TableCell>
        <TableCell align="right">{Cell.pickup_location}</TableCell>
        <TableCell align="right">{Cell.delivery_location}</TableCell>
        <TableCell align="right">
          {Cell.price_order.toLocaleString("en")}
        </TableCell>
        <TableCell align="right">{Cell.cost.toLocaleString("en")}</TableCell>
        <TableCell align="right">
          {Cell.withdraw.toLocaleString("en")}
        </TableCell>
        <TableCell align="right">
          {(Cell.wage - Cell.cost - Cell.withdraw).toLocaleString("en")}
        </TableCell>
        <TableCell align="center" sx={{ p: 1.2 }}>
          <Typography
            variant="p"
            sx={{
              bgcolor: StatusColor.colorBgStatus(
                Cell.status,
                theme.palette.mode
              ),
              color: StatusColor.colorTextStatus(
                Cell.status,
                theme.palette.mode
              ),
              px: 0.7,
              py: 0.5,
              fontSize: "0.8rem",
              borderRadius: 2,
              fontFamily: "Prompt",
              fontWeight: 500,
              height: "22px",
            }}
          >
            {Cell.status}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow
        sx={{
          borderBottom: open ? 1 : 0,
          borderBottomColor: "#ccc",
        }}
      >
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={18}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                borderBottom: 1,
                borderBottomColor: "#aeaeae",
              }}
            >
              <Typography variant="h6" gutterBottom component="div">
                รายละเอียด
              </Typography>
              <Table size="normal">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgba(145, 158, 171, 0.16)",
                      borderRadius: 2,
                    }}
                  >
                    {Object.entries(Cell.pickup_point).map((p, i) => {
                      if (p[1]) {
                        return (
                          <TableCell
                            key={i}
                            sx={{
                              py: 2.5,
                              borderRadius: i === 0 ? "16px 0px 0px 16px" : 0,
                            }}
                          >
                            {"จุดที่ " + (i + 1)}
                          </TableCell>
                        );
                      }
                    })}
                    <TableCell>ค่าเที่ยววิ่งพนักงาน(บาท)</TableCell>
                    <TableCell>กำไร(บาท)</TableCell>
                    <TableCell align="right">น้ำมัน(บาท)</TableCell>
                    <TableCell align="right">ตจว./กทม.</TableCell>
                    <TableCell
                      align="center"
                      sx={{ borderRadius: "0px 16px 16px 0px" }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {Object.entries(Cell.pickup_point).map((p, i) => {
                      if (p[1]) {
                        return <TableCell key={i}>{p[1]}</TableCell>;
                      }
                    })}
                    <TableCell>{Cell.wage.toLocaleString("en")}</TableCell>
                    <TableCell>{Cell.profit.toLocaleString("en")}</TableCell>
                    <TableCell align="right">
                      {Cell.cost.toLocaleString("en")}
                    </TableCell>
                    <TableCell align="right">{Cell.area}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          navigate("/editorder", { state: { order: Cell } })
                        }
                        color="warning"
                      >
                        <EditRounded />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(Cell._id)}
                        color="error"
                      >
                        <DeleteRounded />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box>Something Feature</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function SimpleDialogDemo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer } = useSelector(customerStore);
  const [title, setTitle, socket] = useOutletContext();
  const { order } = useSelector(orderStore);
  const [loadingData, setLoadingData] = useState(false);
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
  //Tabs
  const [valueTabs, setValueTabs] = useState("ทั้งหมด");
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(
    dayjs(new Date()).locale("th").format("BBBB")
  );
  //Search
  const [search, setSearch] = useState("");
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "คุณต้องการที่จะลบเที่ยววิ่งนี้ใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "ตกลง",
      cancelButtonText: "ปิด",
    }).then(async (result) => {
      if (result.isDenied) {
        try {
          setLoadingData(true);
          let res = await HttpClient.delete("/order/" + id);
          if (res.data.sucess) {
            dispatch(deleteOrder(id));
            let newOrder = cloneDeep(order)?.find((item) => item._id == id);
            newOrder.deleted = true;
            socket.emit("_EditOrder", newOrder);
            Swal.fire("ลบเสร็จสิ้น!", "", "success");
          } else {
            Swal.fire(
              "อาจมีปัญหาบางอย่างเกิดขึ้นกรุณาลองใหม่อีกครั้ง!",
              "",
              "warning"
            ).then(() => window.location.reload());
          }
        } catch (error) {
          console.log(error.response.data.error.message);
        } finally {
          setLoadingData(false);
        }
      }
    });
  };

  useEffect(() => {
    if (customer) {
      let newList = cloneDeep(customer);
      setSelectedCustomer(newList[0]);
    }
  }, [customer]);

  useEffect(() => setTitle("บริษัทคู่ค้า"), []);

  let orders = useMemo(() => {
    if (!order) return [];

    let newOrders = order?.filter(
      (item) => item.customer === selectedCustomer._id
    );

    if (valueTabs !== "ทั้งหมด") {
      newOrders = newOrders.filter((a) => a.status === valueTabs);
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
    order,
    valueDay,
    valueMonth,
    valueYear,
    search,
    valueTabs,
  ]);

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

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    headCell: [
      { id: "_oid", label: "รหัสงาน" },
      { id: "pickup_date", label: "วันที่" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "wage", label: "ค่างาน(บาท)" },
      { id: "cost", label: "ค่าน้ำมัน(บาท)" },
      { id: "withdraw", label: "เบิก(บาท)" },
      { id: "balance", label: "ยอดคงเหลือ(บาท)" },
      { id: "status", label: "สถานะ" },
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

  if (!selectedCustomer) return <Box>กรุณาเพิ่มบริษัทคู่ค้า</Box>;
  if (loadingData) return <Loading />;

  return (
    <Container>
      <Grid
        container
        rowSpacing={2}
        sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}
      >
        <Grid item xs={12} lg={7} sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
            {selectedCustomer.cus_name}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              variant="contained"
              startIcon={<EditRounded />}
              onClick={() =>
                navigate("/editcustomer", {
                  state: { customer: selectedCustomer },
                })
              }
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
              แก้ไข
            </Button>
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
                mr: 2,
              }}
            >
              เปลี่ยนบริษัท
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() =>
                navigate("/addorder", { state: { customer: selectedCustomer } })
              }
              sx={{
                backgroundColor: "rgb(32, 101, 209)",
                boxShadow: "rgb(32 101 209 / 24%) 0px 8px 16px 0px",
                borderRadius: 2,
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              เพิ่มงาน
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
        sx={{
          paddingInline: 0,
          boxSizing: "border-box",
          mb: 2,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={valueTabs}
          onChange={(e, v) => setValueTabs(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            maxHeight: 48,
            backgroundColor: "rgba(145, 158, 171, 0.16)",
          }}
        >
          <Tab value="ทั้งหมด" label="ทั้งหมด" disableRipple />
          <Tab value="มอบหมายงานเเล้ว" label="มอบหมายงานเเล้ว" disableRipple />
          <Tab value="ปฏิเสธงาน" label="ปฏิเสธงาน" disableRipple />
          <Tab value="ยอมรับ" label="ยอมรับ" disableRipple />
          <Tab value="ส่งงานเเล้ว" label="ส่งงานเเล้ว" disableRipple />
        </Tabs>
        <Divider />
        <Grid container spacing={2} sx={{ p: 3 }}>
          <FormSelected
            text="วัน"
            dateFormat="DD"
            xs={6}
            sm={4}
            md={2}
            dateQuery={dayQuery}
            value={valueDay}
            changeValue={(e) => setValueDay(e.target.value)}
          />
          <FormSelected
            text="เดือน"
            dateFormat="MMMM"
            xs={6}
            sm={4}
            md={2}
            dateQuery={monthQuery}
            value={valueMonth}
            changeValue={(e) => setValueMonth(e.target.value)}
          />
          <FormSelected
            text="ปี"
            dateFormat="BBBB"
            xs={12}
            sm={4}
            md={2}
            dateQuery={yearQuery}
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
            <Table size={dense ? "small" : "normall"}>
              <TableHeader {...tableHeaderProps} />
              <TableBody>
                {orders
                  ?.sort(getComparator(sortType, sortByName))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((Cell) => (
                    <Row
                      key={Cell._id}
                      Cell={Cell}
                      handleDelete={handleDelete}
                    />
                  ))}
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
