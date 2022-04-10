import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  TableContainer,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Dialog,
  ListItem,
  List,
  Avatar,
  ListItemText,
  Zoom,
  ListItemAvatar,
  AppBar,
  Toolbar,
  IconButton,
  FormControlLabel,
  TablePagination,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Delete,
  Search,
  Add,
  Close,
  ChangeCircleRounded,
  EditRounded,
  NoteAddRounded,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import dayjs from "dayjs";
import "dayjs/locale/th";
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import cloneDeep from "lodash.clonedeep";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import { orderStore } from "../store/OrderStore";
import { customerStore } from "../store/CustomerStore";
import { addBill } from "../store/BillStore";
import TableHeader from "../components/TableHeader";
import Controls from "../components/controls";
import ReportBill from "../components/ReportBill";
import { HttpClient } from "../utils/HttpClient";
import StatusColor from "../components/StatusColor";
import Loading from "../components/Loading";

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
                <Add sx={{ color: "#fff" }} />
              </Avatar>
            </ListItemAvatar>
            <Typography>เพิ่มบริษัทคู่ค้า</Typography>
          </ListItem>
        </Box>
      </Paper>
    </Dialog>
  );
};

const DialogPDF = ({
  open,
  docID,
  listBil,
  handleClose,
  customerDetail,
  dateDoc,
}) => {
  const navigate = useNavigate();
  let theme = useTheme();
  return (
    <Dialog
      fullScreen
      PaperComponent={"div"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          ...(theme.palette.mode === "dark"
            ? {
                bgcolor: "rgb(22, 28, 36)",
              }
            : {
                bgcolor: "rgb(255, 255, 255)",
              }),
        },
      }}
    >
      <AppBar
        sx={{
          position: "relative",
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              ml: 2,
              ...(theme.palette.mode === "light"
                ? {
                    color: "rgb(22, 28, 36)",
                  }
                : {
                    color: "rgb(255, 255, 255)",
                  }),
            }}
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ReportBill
        listBil={listBil}
        dateDoc={dateDoc}
        docID={docID}
        customerDetail={customerDetail}
      />
    </Dialog>
  );
};

const EnhancedTableToolbar = ({ numSelected, handleSavePDF }) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      <Typography
        sx={{ flex: 1 }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} selected
      </Typography>

      <Tooltip title="บันทึกใบวางบิล">
        <Button
          color="primary"
          sx={{ borderRadius: 2 }}
          onClick={handleSavePDF}
          startIcon={<NoteAddRounded />}
        >
          บันทึกใบวางบิล
        </Button>
      </Tooltip>
    </Toolbar>
  );
};

const CreateBill = () => {
  const { order } = useSelector(orderStore);
  const [title, setTitle] = useOutletContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer } = useSelector(customerStore);
  const [customerList, setCustomerList] = useState(customer?.orders?.slice());
  //Sort by Header
  const [sortType, setSortType] = useState("asc");
  const [sortByName, setSortByName] = useState("row_number");
  //CheckBox
  const [selected, setSelected] = React.useState([]);
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState("ทั้งหมด");
  //Search
  const [search, setSearch] = useState("");
  //Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [PDFOpen, setPDFOpen] = useState(false);
  //Dense Table
  const [dense, setDense] = useState(false);
  //Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  //Doc
  const [dateDoc, setDateDoc] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [dateWork, setDateWork] = useState(null);
  const [docID, setDocID] = useState("");
  const [err, setErr] = useState({});
  //Tabs
  const [valueTabs, setValueTabs] = useState("ทั้งหมด");
  //Loading
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  //Dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = (value) => {
    setOpenDialog(false);
    setSelectedCustomer(value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
  };
  //Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //CheckBox
  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderQuery.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const vetify = () => {
    let error = {};
    if (docID === "") {
      error.docID = "การุณาใส่เลขที่เอกสาร";
    }
    if (dateDoc === null) {
      error.dateDoc = "การุณาใส่วันที่เอกสาร";
    }
    if (dueDate === null) {
      error.dueDate = "การุณาใส่วันครบกำหนด";
    }
    if (dateWork === null) {
      error.dateWork = "การุณาใส่วันที่วิ่งงาน";
    }
    setErr(error);
    return Object.values(error).every((x) => x == "");
  };

  const handleSavePDF = async () => {
    if (vetify()) {
      try {
        setLoadingSubmit(true);
        let listID = selected.map((item) => {
          return item._id;
        });
        let res = await HttpClient.post("/bill", {
          id_order: listID,
          id_customer: selectedCustomer._id,
          docDate: dateDoc,
          dueDate,
          dateWork,
          _bid: docID,
        });
        dispatch(addBill(res.data));
        setLoadingSubmit(false);
        Swal.fire({
          title: "บันทึกเสร็จสิ้น",
          text: "คุณต้องการที่จะดูใบวางบิลหรือไม่",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#aaa",
          confirmButtonText: "เปิด",
          cancelButtonText: "ปิด",
        }).then((result) => {
          if (result.isConfirmed) {
            setPDFOpen(true);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            navigate("/bills");
          }
        });
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  const tableHeaderProps = {
    sortType,
    sortByName,
    isOpenFirstCell: true,
    onRequestSort: handleRequestSort,
    headCell: [
      { id: "row_number", label: "ลำดับ" },
      { id: "_oid", label: "รหัสงาน" },
      { id: "pickup_date", label: "วันที่" },
      { id: "pickup_location", label: "ที่รับสินค้า" },
      { id: "delivery_location", label: "ที่ส่งสินค้า" },
      { id: "price_order", label: "ค่างาน(บาท)" },
      { id: "car_type", label: "ประเภทรถ" },
      { id: "per_time", label: "รอบ" },
      { id: "status", label: "สถานะ" },
    ],
  };

  useEffect(() => {
    if (customer) {
      const clonedPrevValue = cloneDeep(customer);
      setSelectedCustomer(clonedPrevValue[0]);
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => setTitle("สร้างใบวางบิล"), []);

  let orderQuery = useMemo(() => {
    let newOrder =
      order?.slice().filter((item) => item.deleted === false) || [];

    if (valueTabs !== "ทั้งหมด") {
      newOrder = newOrder.filter((item) => item.status === valueTabs);
    }

    if (valueDay !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (item) => dayjs(item.pickup_date).locale("th").format("DD") === valueDay
      );
    }

    if (valueMonth !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (item) =>
          dayjs(item.pickup_date).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueYear !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (item) =>
          dayjs(item.pickup_date).locale("th").format("BBBB") === valueYear
      );
    }

    if (search) {
      newOrder = newOrder.filter((s) => {
        if (
          s.delivery_location
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          s.pickup_location
            .trim()
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
  }, [order, valueDay, valueMonth, valueYear, search, valueTabs]);

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
            {[
              ...new Map(
                order
                  ?.slice()
                  .filter((item) => item.deleted === false)
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

  if (loading) return <Loading />;

  return (
    <Container>
      <SelectedCustomer
        listCustomer={customer}
        selectedValue={selectedCustomer}
        open={openDialog}
        onClose={handleClose}
      />
      <DialogPDF
        open={PDFOpen}
        listBil={listBil}
        docID={docID}
        dateDoc={{ dateDoc, dueDate, dateWork }}
        customerDetail={selectedCustomer}
        handleClose={() => navigate("/bills")}
      />
      <Box sx={{ marginBottom: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          สร้างใบวางบิล
        </Typography>
      </Box>
      <Paper sx={{ p: 0, overflow: "auto" }}>
        <Box sx={{ mb: 1, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">ชื่อและที่อยู่</Typography>
            <Box>
              <Button
                sx={{ borderRadius: 2, mr: 1 }}
                onClick={() =>
                  navigate("/editcustomer", {
                    state: { customer: selectedCustomer },
                  })
                }
                startIcon={<EditRounded />}
              >
                แก้ไข
              </Button>
              <Button
                sx={{ borderRadius: 2 }}
                onClick={handleClickOpen}
                startIcon={<ChangeCircleRounded />}
              >
                เปลียนบริษัท
              </Button>
            </Box>
          </Box>
          <Typography variant="p">{selectedCustomer.cus_name}</Typography>
          <br />
          <Typography variant="p">
            {selectedCustomer.address.house_no +
              " " +
              selectedCustomer.address.street +
              " ตำบล" +
              selectedCustomer.address.subdistrict +
              " อำเภอ" +
              selectedCustomer.address.district +
              " จังหวัด" +
              selectedCustomer.address.province +
              " " +
              selectedCustomer.address.zip_code}
          </Typography>
          <br />
          <Typography variant="p">
            โทรศัพท์ {selectedCustomer.phone_no}
          </Typography>
        </Box>
        <Grid
          container
          columnSpacing={3}
          sx={{ p: 3, bgcolor: "rgba(145, 158, 171, 0.16)" }}
        >
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="เลขที่เอกสาร"
              variant="outlined"
              value={docID}
              onChange={(e) => setDocID(e.target.value)}
              {...(err.docID && { error: true, helperText: err.docID })}
              sx={{
                borderRadius: 2,
                "& fieldset": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controls.DatePicker
              label="วันที่เอกสาร*"
              value={dateDoc}
              errors={err.dateDoc}
              onChange={(v) => setDateDoc(v)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controls.DatePicker
              label="วันครบกำหนด*"
              value={dueDate}
              errors={err.dueDate}
              onChange={(v) => setDueDate(v)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controls.DatePicker
              label="วันที่วิ่งงาน*"
              value={dateWork}
              errors={err.dateWork}
              onChange={(v) => setDateWork(v)}
            />
          </Grid>
        </Grid>
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
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          {selected.length ? (
            <EnhancedTableToolbar
              numSelected={selected.length}
              handleSavePDF={handleSavePDF}
            />
          ) : null}
          <TableContainer>
            <Table size={dense ? "small" : "normall"}>
              <TableHeader {...tableHeaderProps}>
                <TableCell padding="checkbox" sx={{ p: 0, ml: dense ? 0 : 3 }}>
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < orderQuery.length
                    }
                    checked={
                      orderQuery.length > 0 &&
                      selected.length === orderQuery.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                    sx={{ ml: dense ? 0 : 3 }}
                  />
                </TableCell>
              </TableHeader>
              <TableBody>
                {orderQuery
                  ?.sort(getComparator(sortType, sortByName))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((Cell, index) => {
                    const isItemSelected = isSelected(Cell);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow key={Cell._id}>
                        <TableCell
                          role="checkbox"
                          tabIndex={-1}
                          aria-checked={isItemSelected}
                          selected={isItemSelected}
                          padding="checkbox"
                          sx={{ p: 0, cursor: "pointer", px: 3 }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClick(event, Cell);
                          }}
                        >
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {Cell.row_number.toLocaleString("en")}
                        </TableCell>
                        <TableCell>{Cell._oid}</TableCell>
                        <TableCell>
                          {dayjs(Cell.pickup_date)
                            .locale("th")
                            .format("DD MMMM BBBB")}
                        </TableCell>
                        <TableCell>{Cell.pickup_location}</TableCell>
                        <TableCell>{Cell.delivery_location}</TableCell>
                        <TableCell>
                          {Cell.price_order.toLocaleString("en")}
                        </TableCell>
                        <TableCell>{Cell.car_type}</TableCell>
                        <TableCell>{Cell.per_time}</TableCell>
                        <TableCell>
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
                    );
                  })}
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
            rowsPerPageOptions={[10, 20, 25, 30, 35, 40, 45]}
            component="div"
            count={orderQuery?.length || 0}
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

export default CreateBill;
