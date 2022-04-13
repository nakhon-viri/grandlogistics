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

import { orderStore, upDateSomeOrder } from "../store/OrderStore";
import { customerStore } from "../store/CustomerStore";
import { addBill } from "../store/BillStore";
import TableHeader from "../components/TableHeader";
import Controls from "../components/controls";
import ReportBill from "../components/ReportBill";
import { HttpClient } from "../utils/HttpClient";
import StatusColor from "../components/StatusColor";
import Loading from "../components/Loading";

import DateSort from "../components/DateSort";
import getComparator from "../utils/TableSort";
import TableToolbar from "../components/TableToolbar";
import SelectedCustomer from "../components/SelectedCustomer";
import TabStatus from "../components/TabStatus";
import TablePaginations from "../components/TablePagination";
import TableRows from "../components/TableRows";

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

const CreateBill = () => {
  const { order } = useSelector(orderStore);
  const [title, setTitle] = useOutletContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer } = useSelector(customerStore);
  //Sort by Header
  const [sortType, setSortType] = useState("asc");
  const [sortByName, setSortByName] = useState("row_number");
  //CheckBox
  const [selected, setSelected] = React.useState([]);
  //Filter by Date
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(dayjs(new Date()).format("BBBB"));
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
    if (value != selectedCustomer) {
      setValueDay("ทั้งหมด");
      setValueMonth("ทั้งหมด");
      setValueYear(dayjs(new Date()).format("BBBB"));
    }
    setSelectedCustomer(value);
  };
  //Table Sort
  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
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

  const handleSavePDF = () => {
    if (vetify()) {
      setLoadingSubmit(true);

      let listIdOrder = selected.map((item) => item._id);

      let check = selected.filter((x) => !!x.bill);
      let text = check
        .map((item) => item._oid)
        .toString()
        .replace(/,/g, "\n");

      if (check.length > 0) {
        console.log("asdf");
        Swal.fire({
          title: `มีงานที่ถูกเพิ่มลงในบิลแล้ว\nคุณต้องการที่จะเพิ่มงานนี้ใช่หรือไม่ งานนี้ในบิลอื่น ๆ จะถูกลบ รหัสงานได้แก่ ${text}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#aaa",
          confirmButtonText: "เปิด",
          cancelButtonText: "ปิด",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              let { data } = await HttpClient.post("/bill", {
                order: listIdOrder,
                bill: {
                  id_customer: selectedCustomer._id,
                  docDate: dateDoc,
                  dueDate,
                  dateWork,
                  _bid: docID,
                },
              });
              dispatch(addBill(data.bill));
              dispatch(upDateSomeOrder(data.order));
              setLoadingSubmit(false);
              Swal.fire({
                title: "บันทึกเสร็จสิ้น",
                text: "คุณต้องการที่จะดูใบวางบิลหรือไม่",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#aaa",
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
              }).then((result) => {
                if (result.isConfirmed) {
                  setPDFOpen(true);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  navigate("/bills");
                }
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
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

  let orderCustomer = useMemo(() => {
    let newOrder = cloneDeep(order);

    let result = newOrder?.filter(
      (item) => item.customer === selectedCustomer._id
    );

    return result;
  }, [order, selectedCustomer]);

  let orderQuery = useMemo(() => {
    if (!orderCustomer) return [];
    let newOrder = cloneDeep(orderCustomer);

    if (valueTabs !== "ทั้งหมด") {
      newOrder = newOrder.filter((item) => item.status === valueTabs);
    }

    newOrder = newOrder.filter(
      (item) =>
        dayjs(item.pickup_date).locale("th").format("BBBB") === valueYear
    );

    if (valueMonth !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (item) =>
          dayjs(item.pickup_date).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueDay !== "ทั้งหมด") {
      newOrder = newOrder.filter(
        (item) => dayjs(item.pickup_date).locale("th").format("DD") === valueDay
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
  }, [orderCustomer, valueDay, valueMonth, valueYear, search, valueTabs]);

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
        <TabStatus value={valueTabs} onChange={(v) => setValueTabs(v)} />
        <DateSort
          order={orderCustomer}
          valueDay={valueDay}
          changeValueDay={(v) => setValueDay(v)}
          valueMonth={valueMonth}
          changeValueMonth={(v) => setValueMonth(v)}
          valueYear={valueYear}
          changeValueYear={(v) => setValueYear(v)}
        />
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          {selected.length ? (
            <TableToolbar numSelected={selected.length}>
              <Tooltip title="บันทึกใบวางบิล">
                <Button
                  sx={{ borderRadius: 2 }}
                  onClick={handleSavePDF}
                  startIcon={<NoteAddRounded />}
                >
                  บันทึกใบวางบิล
                </Button>
              </Tooltip>
            </TableToolbar>
          ) : null}
          <TableContainer>
            <Table size={dense ? "small" : "normall"}>
              <TableHeader {...tableHeaderProps}>
                <TableCell sx={{ p: 0, ml: 3 }}>
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
                    sx={{ ml: 3 }}
                  />
                </TableCell>
              </TableHeader>
              <TableBody>
                {orderQuery
                  ?.sort(getComparator(sortType, sortByName))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const isItemSelected = isSelected(item);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRows
                        key={item._id}
                        Cell={[
                          {
                            value: (
                              <Checkbox
                                tabIndex={-1}
                                aria-checked={isItemSelected}
                                selected={isItemSelected}
                                color="primary"
                                checked={isItemSelected}
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
                            value: item.row_number,
                            align: "right",
                          },
                          {
                            value: item._oid,
                            align: "center",
                          },
                          {
                            value: dayjs(item.pickup_date)
                              .locale("th")
                              .format("DD MMMM BBBB"),
                            align: "center",
                          },
                          {
                            value: item.pickup_location,
                            align: "left",
                          },
                          {
                            value: item.delivery_location,
                            align: "left",
                          },
                          {
                            value: item.price_order,
                            align: "right",
                          },
                          {
                            value: item.car_type,
                            align: "left",
                          },
                          {
                            value: item.per_time,
                            align: "left",
                          },
                          {
                            value: (
                              <Typography
                                variant="p"
                                sx={{
                                  bgcolor: StatusColor.colorBgStatus(
                                    item.status,
                                    theme.palette.mode
                                  ),
                                  color: StatusColor.colorTextStatus(
                                    item.status,
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
                                {item.status}
                              </Typography>
                            ),
                            align: "center",
                          },
                        ]}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePaginations
          checked={dense}
          onChecked={(v) => setDense(v)}
          count={orderQuery.length}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default CreateBill;
