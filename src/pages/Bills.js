import {
  Box,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableRow,
  Paper,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  TextField,
  ListItem,
  List,
  Avatar,
  ListItemAvatar,
  ListItemText,
  FormControl,
  InputAdornment,
  Zoom,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  TablePagination,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Delete,
  RemoveRedEyeRounded,
  Close,
  Add,
  LocalPrintshopRounded,
  ChangeCircleRounded,
  EditRounded,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTheme, alpha } from "@mui/material/styles";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash.clonedeep";

import { orderStore } from "../store/OrderStore";
import { billStore } from "../store/BillStore";
import { customerStore } from "../store/CustomerStore";
import TableHeader from "../components/TableHeader";
import ReportBill from "../components/ReportBill";
import ReportInvoice from "../components/ReportInvoice";
import Controls from "../components/controls";
import { HttpClient } from "../utils/HttpClient";
import { addInvoice } from "../store/InvoiceStore";

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

const DialogPDF = ({
  open,
  docID,
  listBil,
  handleClose,
  customerDetail,
  dateDoc,
}) => {
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
const DialogInvoice = ({
  open,
  docID,
  listBil,
  handleClose,
  customerDetail,
  dateDoc,
}) => {
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
      <ReportInvoice
        listBil={listBil}
        dateDoc={dateDoc}
        docID={docID}
        customerDetail={customerDetail}
      />
    </Dialog>
  );
};

const SelectedCustomer = ({ onClose, selectedValue, open, listCustomer }) => {
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
            onClick={() => handleListItemClick("addAccount")}
          >
            <ListItemAvatar>
              <Avatar>
                <Add sx={{ color: "#fff" }} />
              </Avatar>
            </ListItemAvatar>
            <Typography>sdfassdf</Typography>
          </ListItem>
        </Box>
      </Paper>
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

      <Tooltip title="บันทึกใบแจ้งหนี้" sx={{ width: "100%" }}>
        {/* <IconButton color="primary" onClick={handleSavePDF}>
          <LocalPrintshopRounded />
        </IconButton> */}
        <Button
          color="primary"
          sx={{ borderRadius: 2 }}
          onClick={handleSavePDF}
          startIcon={<LocalPrintshopRounded />}
        >
          บันทึกใบแจ้งหนี้
        </Button>
      </Tooltip>
    </Toolbar>
  );
};

const Bills = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order } = useSelector(orderStore);
  const { bill } = useSelector(billStore);
  const { customer } = useSelector(customerStore);
  const [customerList, setCustomerList] = useState(customer?.orders?.slice());
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("wage");
  //CheckBox
  const [selected, setSelected] = React.useState([]);
  //list Order
  const [orderList, setOrderList] = useState(order?.slice());
  //list Order
  const [billList, setBillList] = useState(bill?.slice());
  //Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [PDFOpen, setPDFOpen] = useState(false);
  const [PDFPROPS, setPDFPROPS] = useState({});
  const [invoiceProps, setInvoiceProps] = useState({});
  const [openInvoice, setOpenInvoice] = useState(false);
  //Dense Table
  const [dense, setDense] = useState(false);
  //Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState("ทั้งหมด");
  const [valueSubMonth, setValueSubMonth] = useState("ทั้งเดือน");
  //Search
  const [search, setSearch] = useState("");
  //Doc
  const [dateDoc, setDateDoc] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [docID, setDocID] = useState("");
  const [err, setErr] = useState({});
  //Loading
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
  };

  //Dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = (value) => {
    setOpenDialog(false);
    setSelectedCustomer(value);
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
      const newSelecteds = billQuery.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  let listBill = (listOrder) => {
    let sumReport = {};
    sumReport = listOrder.reduce((acc, curr) => {
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
  };
  const handleShowBill = (bill) => {
    setPDFPROPS({
      listBil: listBill(bill.id_order),
      docID: bill._bid,
      dateDoc: {
        dateDoc: bill.docDate,
        dueDate: bill.dueDate,
        dateWork: bill.dateWork,
      },
      customerDetail: bill.id_customer,
      handleClose: () => setPDFOpen(false),
    });
    setPDFOpen(true);
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
        let res = await HttpClient.post("/invoice", {
          id_bill: listID,
          id_customer: selectedCustomer._id,
          docDate: dateDoc,
          dueDate,
          _bid: docID,
        });
        dispatch(addInvoice(res.data));
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
            setOpenInvoice(true);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            navigate("/invoices");
          }
        });
      } catch (error) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    if (customer) {
      const clonedPrevValue = cloneDeep(customer);
      setSelectedCustomer(clonedPrevValue[0]);
      setLoading(false);
    }
  }, [customer]);

  let billQuery = useMemo(() => {
    if (!selectedCustomer) return;
    let newBill = cloneDeep(bill);
    newBill = newBill?.filter((item) => {
      item.cus_name = item.id_customer.cus_name;
      item.countOrder = item.id_order.length;
      return item.id_customer._id === selectedCustomer._id;
    });
    if (valueSubMonth !== "ทั้งเดือน") {
      newBill = newBill.filter((order) => {
        let day = dayjs(order.docDate).format("D");
        if (valueSubMonth === "ต้นเดือน") {
          return day < 16;
        } else {
          return day > 15;
        }
      });
    }

    if (valueYear !== "ทั้งหมด") {
      newBill = newBill.filter(
        (a) => dayjs(a.docDate).locale("th").format("YYYY") === valueYear
      );
    }

    if (valueMonth !== "ทั้งหมด") {
      newBill = newBill.filter(
        (a) => dayjs(a.docDate).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueDay !== "ทั้งหมด") {
      newBill = newBill.filter(
        (a) => dayjs(a.docDate).locale("th").format("DD") === valueDay
      );
    }

    if (search) {
      newBill = newBill.filter((s) => {
        if (
          s._bid
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
          return s;
      });
    }

    return newBill;
  }, [
    bill,
    selectedCustomer,
    valueSubMonth,
    valueYear,
    valueMonth,
    valueDay,
    search,
  ]);

  let orderQuery = useMemo(() => {
    let newOrder = order?.slice() || [];

    return newOrder;
  }, [order]);

  let listInvoice = useMemo(() => {
    let sumReport = {};
    sumReport = selected.reduce((acc, curr) => {
      let total = curr.id_order.reduce((sum, order) => {
        return sum + order.price_order;
      }, 0);
      const str =
        "รถกะบะ 4 ล้อ ตู้ทึบ จำนวน " +
        curr.id_order.length +
        " คัน วิ่งงานวันที่ " +
        dayjs(curr.dateWork).format("DD/MM/YYYY") +
        "@" +
        total +
        "@" +
        curr._bid;
      acc[str] = (acc[str] || 0) + 1;
      return acc;
    }, {});

    let DR = [];
    for (const key in sumReport) {
      DR.push({
        list: key.split("@")[0],
        price: parseInt(key.split("@")[1]),
        id: key.split("@")[2],
      });
    }
    return DR;
  }, [selected]);

  const tableHeaderProps = {
    sortType,
    sortByName,
    onRequestSort: handleRequestSort,
    styleCellProps: {
      fontSize: "1.1rem",
    },
    headCell: [
      { id: "cus_name", label: "ชื่อบริษัท" },
      { id: "_bid", label: "เลขที่เอกสาร" },
      { id: "docDate", label: "วันที่เอกสาร" },
      { id: "dueDate", label: "วันครบกำหนด" },
      { id: "dateWork", label: "วันที่วิ่งงาน" },
      { id: "countOrder", label: "จำนวนเที่ยว" },
      { id: "", label: "" },
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
            {[
              ...new Map(
                bill
                  ?.slice()
                  .map((item) => [
                    dayjs(item.docDate).locale("th").format(dateFormat),
                    item,
                  ])
              ).values(),
            ]
              .sort(function (a, b) {
                return (
                  dayjs(b.docDate).format(dateFormat) -
                  dayjs(a.docDate).format(dateFormat)
                );
              })
              .map((row, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={dayjs(row.docDate).locale("th").format(dateFormat)}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      mb: 1,
                    }}
                  >
                    {dayjs(row.docDate).locale("th").format(dateFormat)}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  if (loading) return <div>something</div>;

  return (
    <Container>
      <SelectedCustomer
        listCustomer={customer}
        selectedValue={selectedCustomer}
        open={openDialog}
        onClose={handleClose}
      />
      <DialogPDF open={PDFOpen} {...PDFPROPS} />
      <DialogInvoice
        open={openInvoice}
        handleClose={() => navigate("/invoices")}
        listBil={listInvoice}
        docID={docID}
        dateDoc={{
          dateDoc,
          dueDate,
        }}
        customerDetail={selectedCustomer}
        // handleClose={() => setOpenInvoice(false)}
      />
      <Box sx={{ marginBottom: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          ใบวางบิลทั้งหมด
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 0, overflow: "hidden" }}>
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
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <Controls.DatePicker
              label="วันที่เอกสาร*"
              value={dateDoc}
              errors={err.dateDoc}
              onChange={(v) => setDateDoc(v)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controls.DatePicker
              label="วันครบกำหนด*"
              value={dueDate}
              errors={err.dueDate}
              onChange={(v) => setDueDate(v)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={6} sm={4} md={2}>
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
          <Grid item xs={12} sm={12} md={4}>
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
        {selected.length ? (
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleSavePDF={handleSavePDF}
          />
        ) : null}
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
            <TableHeader isOpenFirstCell {...tableHeaderProps}>
              <TableCell padding="checkbox" sx={{ p: 0, ml: dense ? 0 : 3 }}>
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < billQuery.length
                  }
                  checked={
                    billQuery.length > 0 && selected.length === billQuery.length
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
              {billQuery
                ?.sort(getComparator(sortType, sortByName))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  const isItemSelected = isSelected(item);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      key={index}
                      sx={{
                        "& td, & th": {
                          borderBlockWidth:
                            index === billQuery.length - 1 ? 0 : 1,
                        },
                      }}
                    >
                      <TableCell
                        role="checkbox"
                        tabIndex={-1}
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        padding="checkbox"
                        sx={{ p: 0, cursor: "pointer", px: 3 }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClick(event, item);
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
                      <TableCell>{item.cus_name}</TableCell>
                      <TableCell align="center">{item._bid}</TableCell>
                      <TableCell align="center">
                        {dayjs(item.docDate)
                          .locale("th")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {dayjs(item.dueDate)
                          .locale("th")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {dayjs(item.dateWork)
                          .locale("th")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">{item.countOrder}</TableCell>
                      <TableCell align="right" sx={{ textAlign: "left" }}>
                        <IconButton
                          onClick={() => handleShowBill(item)}
                          sx={{ p: 1, color: "#4287f5" }}
                        >
                          <RemoveRedEyeRounded />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            count={billQuery?.length || 0}
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

export default Bills;
