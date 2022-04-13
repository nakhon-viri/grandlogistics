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
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
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
import { useOutletContext } from "react-router-dom";

import { orderStore } from "../store/OrderStore";
import { billStore, upDateSomeBill } from "../store/BillStore";
import { customerStore } from "../store/CustomerStore";
import TableHeader from "../components/TableHeader";
import ReportBill from "../components/ReportBill";
import ReportInvoice from "../components/ReportInvoice";
import Controls from "../components/controls";
import { HttpClient } from "../utils/HttpClient";
import { addInvoice } from "../store/InvoiceStore";

import getComparator from "../utils/TableSort";
import TableToolbar from "../components/TableToolbar";
import SelectedCustomer from "../components/SelectedCustomer";
import Loading from "../components/Loading";
import TablePaginations from "../components/TablePagination";
import TableRows from "../components/TableRows";
import DateSort from "../components/DateSort";
import { SearchField } from "../components/controls";

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

const Bills = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useOutletContext();
  const { order } = useSelector(orderStore);
  const { bill } = useSelector(billStore);
  const { customer } = useSelector(customerStore);
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("wage");
  //CheckBox
  const [selected, setSelected] = React.useState([]);
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
  const [valueYear, setValueYear] = useState(dayjs(new Date()).format("BBBB"));
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
    // let newListOrder = cloneDeep(listOrder);
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
      customerDetail: bill.customer,
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
      setLoadingSubmit(true);
      let listID = selected.map((item) => item._id);

      let check = selected.filter((x) => !!x.invoice);
      let text = check
        .map((item) => item._bid)
        .toString()
        .replace(/,/g, "\n");

      Swal.fire({
        title: `มีใบวางบิลที่ถูกเพิ่มลงในใบแจ้งหนี้แล้ว\nคุณต้องการที่จะเพิ่มใบวางบิลนี้ใช่หรือไม่ ใบวางบิลนี้ในใบแจ้งหนี้อื่น ๆ จะถูกลบ เลขเอกสารได้แก่ ${text}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#aaa",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let { data } = await HttpClient.post("/invoice", {
              bill: listID,
              invoice: {
                customer: selectedCustomer._id,
                docDate: dateDoc,
                dueDate,
                _bid: docID,
              },
            });
            dispatch(addInvoice(data.invoice));
            dispatch(upDateSomeBill(data.bill));
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
            console.log(error.response.data.error.message);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (customer) {
      const clonedPrevValue = cloneDeep(customer);
      setSelectedCustomer(clonedPrevValue[0]);
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => setTitle("ใบวางบิลทั้งหมด"), []);

  let billQuery = useMemo(() => {
    if (!selectedCustomer || !bill || !order) return [];
    let newBill = cloneDeep(bill);
    let newOrder = cloneDeep(order);

    newBill = newBill.filter((item) => {
      item.cus_name = selectedCustomer.cus_name;
      let newOr = newOrder.filter((curr) => curr.bill === item._id);
      item.countOrder = newOr.length;
      item.id_order = cloneDeep(newOr);
      item.customer = cloneDeep(selectedCustomer);
      return item.id_customer === selectedCustomer._id;
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
        (a) => dayjs(a.docDate).locale("th").format("BBBB") === valueYear
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
    order,
    customer,
    selectedCustomer,
    valueSubMonth,
    valueYear,
    valueMonth,
    valueDay,
    search,
  ]);

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
        dayjs(curr.dateWork).format("DD/MM/BBBB") +
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
 
  if (loading) return <Loading />;

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
        <DateSort
          isSubMonth
          order={bill}
          nameQuery={"docDate"}
          valueSubMonth={valueSubMonth}
          changeValueSubMonth={(v) => setValueSubMonth(v)}
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
        {selected.length ? (
          <TableToolbar numSelected={selected.length}>
            <Tooltip title="บันทึกใบแจ้งหนี้" sx={{ width: "100%" }}>
              <Button
                color="primary"
                sx={{ borderRadius: 2 }}
                onClick={handleSavePDF}
                startIcon={<LocalPrintshopRounded />}
              >
                บันทึกใบแจ้งหนี้
              </Button>
            </Tooltip>
          </TableToolbar>
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
              <TableCell sx={{ p: 0, ml: 3 }}>
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
                  sx={{ ml: 3 }}
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
                    <TableRows
                      key={item._id}
                      hover
                      sxRow={{
                        "& td, & th": {
                          borderBlockWidth: 1,
                        },
                      }}
                      Cell={[
                        {
                          value: (
                            <Checkbox
                              tabIndex={-1}
                              aria-checked={isItemSelected}
                              selected={isItemSelected}
                              checked={isItemSelected}
                              color="primary"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleClick(event, item);
                              }}
                              sx={{ ml: 3 }}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          ),
                          sxCell: { p: 0, ml: 3 },
                        },
                        {
                          value: item.cus_name,
                        },
                        {
                          value: item._bid,
                          align: "center",
                        },
                        {
                          value: dayjs(item.docDate)
                            .locale("th")
                            .format("DD MMMM BBBB"),
                          align: "center",
                        },
                        {
                          value: dayjs(item.dueDate)
                            .locale("th")
                            .format("DD MMMM BBBB"),
                          align: "center",
                        },
                        {
                          value: dayjs(item.dateWork)
                            .locale("th")
                            .format("DD MMMM BBBB"),
                          align: "center",
                        },
                        {
                          value: item.countOrder,
                          align: "center",
                        },
                        {
                          value: (
                            <IconButton
                              onClick={() => handleShowBill(item)}
                              sx={{ p: 1, color: "#4287f5" }}
                            >
                              <RemoveRedEyeRounded />
                            </IconButton>
                          ),
                          align: "left",
                          sxCell: { textAlign: "left" },
                        },
                      ]}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePaginations
          checked={dense}
          onChecked={(v) => setDense(v)}
          count={billQuery.length}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Bills;
