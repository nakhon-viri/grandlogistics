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
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/th";
import cloneDeep from "lodash.clonedeep";

import { customerStore } from "../store/CustomerStore";
import Controls from "../components/controls";
import TableHeader from "../components/TableHeader";
import StatusColor from "../components/StatusColor";
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
  const navigate = useNavigate();
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
            เลือกบริษัทลูกค้า
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
                    // src={"value.photo"}
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

const Row = ({ Cell }) => {
  const theme = useTheme();
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
          {dayjs(Cell.pickup_date).locale("th").format("DD MMMM YYYY")}
        </TableCell>
        <TableCell align="right">{Cell.pickup_location}</TableCell>
        <TableCell align="right">{Cell.delivery_location}</TableCell>
        <TableCell align="right">{Cell.wage}</TableCell>
        <TableCell align="right">{Cell.cost}</TableCell>
        <TableCell align="right">{Cell.withdraw}</TableCell>
        <TableCell align="right">
          {Cell.wage - Cell.cost - Cell.withdraw}
        </TableCell>
        <TableCell align="right" sx={{ p: 1.2 }}>
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
                    <TableCell>จ่ายค่างาน</TableCell>
                    <TableCell>กำไร</TableCell>
                    <TableCell align="right">น้ำมัน</TableCell>
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
                    <TableCell>{Cell.wage}</TableCell>
                    <TableCell>{Cell.profit}</TableCell>
                    <TableCell align="right">{Cell.cost}</TableCell>
                    <TableCell align="right">{Cell.area}</TableCell>
                    <TableCell align="right">
                      <Button>asdf</Button>
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
  const { customer } = useSelector(customerStore);
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
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  //Tabs
  const [valueTabs, setValueTabs] = useState("ทั้งหมด");
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState("ทั้งหมด");
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

  useEffect(() => {
    if (customer) {
      let newList = customer?.slice(0, 1) || [];
      setSelectedCustomer(newList[0]);
    }
  }, [customer]);

  let orders = useMemo(() => {
    let newOrders = cloneDeep(selectedCustomer?.orders) || [];
    if (valueTabs !== "ทั้งหมด") {
      newOrders = newOrders.filter((a) => {
        if (valueTabs === "จัดส่งสำเร็จ") {
          return a.status === valueTabs;
        }
        return a.status === "ยังไม่ถูกจัดส่ง" || a.status === "ยังไม่ถูกจักส่ง";
      });
    }

    if (valueYear !== "ทั้งหมด") {
      newOrders = newOrders.filter(
        (a) => dayjs(a.pickup_date).locale("th").format("YYYY") === valueYear
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
  }, [selectedCustomer, valueDay, valueMonth, valueYear, search, valueTabs]);

  let dateQuery = (dateFormat) =>
    useMemo(
      (dateFormat) => [
        ...new Map(
          selectedCustomer.orders
            ?.slice()
            .map((item) => [
              dayjs(item.pickup_date).locale("th").format(dateFormat),
              item,
            ])
        ).values(),
      ],
      [selectedCustomer]
    );

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    headCell: [
      { id: "_oid", label: "รหัสงาน" },
      { id: "pickup_date", label: "วันที่" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "wage", label: "ค่างาน" },
      { id: "cost", label: "ค่าน้ำมัน" },
      { id: "withdraw", label: "เบิก" },
      { id: "balance", label: "ยอดคงเหลือ" },
      { id: "status", label: "สถานะ" },
    ],
  };

  const FormSelected = ({ text, changeValue, value, dateFormat, ...rest }) => {
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
            {dateQuery(dateFormat)
              .sort(function (a, b) {
                return (
                  dayjs(b.pickup_date).format(dateFormat) -
                  dayjs(a.pickup_date).format(dateFormat)
                );
              })
              .map((row, index) => (
                <MenuItem
                  key={index}
                  value={dayjs(row.pickup_date).locale("th").format(dateFormat)}
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    mb: 1,
                  }}
                >
                  {dayjs(row.pickup_date).locale("th").format(dateFormat)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  if (!selectedCustomer) return <Box>กรุณาเพิ่มบริษัทคู่ค้า</Box>;

  return (
    <Container>
      <Grid
        container
        rowSpacing={2}
        sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}
      >
        <Grid item xs={12} lg={9} sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{selectedCustomer.cus_name}</Typography>
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
            borderBottomColor: "#000",
            borderBottomWidth: 1,
            backgroundColor: "rgba(145, 158, 171, 0.16)",
          }}
        >
          <Tab value="ทั้งหมด" label="ทั้งหมด" disableRipple />
          <Tab value="จัดส่งสำเร็จ" label="จัดส่งสำเร็จ" disableRipple />
          <Tab value="ยังไม่ถูกจัดส่ง" label="ยังไม่ถูกจัดส่ง" disableRipple />
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
            dateFormat="YYYY"
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
                    <Row key={Cell._id} Cell={Cell} />
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
            count={selectedCustomer.orders?.length || 0}
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
