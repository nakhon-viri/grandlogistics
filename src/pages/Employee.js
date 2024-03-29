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
  ManageAccounts,
  EditRounded,
  DeleteRounded,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import cloneDeep from "lodash.clonedeep";
import Swal from "sweetalert2";

import { employeeStore } from "../store/EmployeeStore";
import { orderStore, deleteOrder } from "../store/OrderStore";
import TableHeader from "../components/TableHeader";
import StatusColor from "../components/StatusColor";
import { HttpClient } from "../utils/HttpClient";
import Loading from "../components/Loading";
import { useOutletContext } from "react-router-dom";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

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

const Row = ({ Cell, handleDelete }) => {
  const theme = useTheme();
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover onClick={() => setOpen(!open)} sx={{ cursor: "pointer" }}>
        <TableCell component="th" scope="row" sx={{ p: 0, pl: 1 }}>
          <IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {Cell._oid}
        </TableCell>
        <TableCell component="th" scope="row">
          {dayjs(Cell.pickup_date).locale("th").format("DD MMMM BBBB")}
        </TableCell>
        <TableCell align="right">{Cell.pickup_location}</TableCell>
        <TableCell align="right">{Cell.delivery_location}</TableCell>
        <TableCell align="right">{Cell.wage.toLocaleString("en")}</TableCell>
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
                    <TableCell>ค่างาน(บาท)</TableCell>
                    <TableCell>กำไร(บาท)</TableCell>
                    <TableCell align="right">น้ำมัน(บาท)</TableCell>
                    <TableCell align="right">ตจว./กทม.</TableCell>
                    <TableCell
                      align="right"
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
                    <TableCell>
                      {Cell.price_order.toLocaleString("en")}
                    </TableCell>
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

const Employee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employee } = useSelector(employeeStore);
  const { order } = useSelector(orderStore);
  const [title, setTitle, socket] = useOutletContext();
  const [loadingData, setLoadingData] = useState(false);
  const [employeeList, setEmployeeList] = useState(employee?.slice());
  const [userSelected, setUserSelected] = useState({ orders: [] });
  //Filter by Status
  const [valueTabs, setValueTabs] = useState("ทั้งหมด");
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("pickup_date");
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(dayjs(new Date()).format("BBBB"));
  //Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  //Dense Table
  const [dense, setDense] = useState(false);
  //Search
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTitle("พนักงานทั้งหมด");
    if (employee) {
      setUserSelected(...employee.slice(0, 1));
    }
  }, [employee]);

  let orders = useMemo(() => {
    if (!order) return [];

    let newOrders = order?.filter(
      (item) => item.personnel === userSelected._id
    );

    if (valueTabs !== "ทั้งหมด") {
      newOrders = newOrders.filter((a) => {
        return a.status === valueTabs;
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
  }, [userSelected, order, valueDay, valueMonth, valueYear, search, valueTabs]);

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

  const clDate = (bd) => {
    let dateNow = new Date().getFullYear();
    return dateNow - bd;
  };

  const userListProps = {
    employee: employeeList,
    handleSelectedUser: (user) => {
      setValueYear(dayjs(new Date()).format("BBBB"));
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
    headCell: [
      { id: "_oid", label: "รหัสงาน" },
      { id: "pickup_date", label: "วันที่" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "wage", label: "ค่าเที่ยววิ่งพนักงาน(บาท)" },
      { id: "cost", label: "ค่าน้ำมัน(บาท)" },
      { id: "withdraw", label: "เบิก(บาท)" },
      { id: "balance", label: "ยอดคงเหลือ(บาท)" },
      { id: "status", label: "สถานะ" },
    ],
  };

  let yearQuery = useMemo(() => {
    let newOrders = order?.filter(
      (item) => item.personnel === userSelected._id
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

  let orderUserSelected = useMemo(() => {
    if (!order) return [];
    let newOrders = order?.filter(
      (item) => item.personnel === userSelected._id
    );
    return newOrders;
  }, [userSelected, order]);

  const FormSelected = ({ text, changeValue, value, dateFormat, ...rest }) => {
    let dateQuery =
      dateFormat == "BBBB"
        ? yearQuery
        : [
            ...new Map(
              orderUserSelected.map((item) => [
                dayjs(item.pickup_date).locale("th").format(dateFormat),
                dayjs(item.pickup_date).locale("th").format(dateFormat),
              ])
            ).values(),
          ];

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
            {dateFormat != "BBBB" ? (
              <MenuItem
                value={"ทั้งหมด"}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                }}
              >
                {`${text}ทั้งหมด`}
              </MenuItem>
            ) : null}
            {dateQuery
              // .sort(function (a, b) {
              //   return (
              //     dayjs(b).format(dateFormat) - dayjs(a).format(dateFormat)
              //   );
              // })
              .map((row, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={row}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mt: 1,
                    }}
                  >
                    {row}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  if (loadingData) return <Loading />;

  return (
    <Box>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          พนักงานทั้งหมด
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Paper sx={styles.containerUserList} elevation={2}>
            <UserList {...userListProps} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Box sx={{ marginBottom: 2 }}>
            <Paper
              sx={{
                p: 3,
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ mr: 3 }}>
                <Avatar
                  sx={{ height: "150px", width: "150px", fontSize: 50 }}
                  alt={userSelected?.full_name?.first_name}
                  src={userSelected.photo}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {userSelected?.full_name?.first_name +
                    " " +
                    userSelected?.full_name?.last_name}
                </Typography>
                <Grid container>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="p">
                      {"รหัสงาน : " + userSelected._uid}
                    </Typography>
                    <br />
                    <Typography variant="p">
                      {"ทะเบียนรถ : " + userSelected.car_no}
                    </Typography>
                    <br />
                    <Typography variant="p">
                      {"อายุ : " +
                        clDate(parseInt(userSelected?.birthday?.split("-")[0]))}
                    </Typography>
                    <br />
                    <Typography variant="p">
                      {"เพศ : " + userSelected.gender}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="p">
                      {"แผนก : " + userSelected.department}
                    </Typography>
                    <br />
                    <Typography variant="p">
                      {"เบอร์ติดต่อ : " + userSelected.phone_no}
                    </Typography>
                    <br />
                    <Typography variant="p">
                      {"เลขบัตรประจำตัวประชาชน : " + userSelected.reference_id}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button
                startIcon={<ManageAccounts />}
                onClick={() =>
                  navigate("/profileemployee", {
                    state: { user: userSelected },
                  })
                }
                sx={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  borderRadius: 2,
                }}
              >
                รายละเอียด
              </Button>
            </Paper>
          </Box>
          <Box>
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
                <Tab
                  value="มอบหมายงานเเล้ว"
                  label="มอบหมายงานเเล้ว"
                  disableRipple
                />
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
                    minWidth: "945px",
                  }}
                >
                  <Table size={dense ? "small" : "normall"}>
                    <TableHeader {...tableHeaderProps} />
                    <TableBody>
                      {orders &&
                        orders
                          .sort(getComparator(sortType, sortByName))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
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
                      <AntSwitch
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
};

export default Employee;
