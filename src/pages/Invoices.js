import {
  Container,
  Paper,
  TableContainer,
  TableBody,
  Table,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import {
  Search,
  Delete,
  RemoveRedEyeRounded,
  Close,
  Add,
} from "@mui/icons-material";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import cloneDeep from "lodash.clonedeep";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useOutletContext } from "react-router-dom";

import { invoiceStore } from "../store/InvoiceStore";
import { orderStore } from "../store/OrderStore";
import { customerStore } from "../store/CustomerStore";
import { billStore } from "../store/BillStore";
import TableHeader from "../components/TableHeader";
import ReportInvoice from "../components/ReportInvoice";
import getComparator from "../utils/TableSort";
import TablePagination from "../components/TablePagination";
import TableRows from "../components/TableRows";
import DateSort from "../components/DateSort";
import { SearchField } from "../components/controls";

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

const Invoices = () => {
  const { invoice } = useSelector(invoiceStore);
  const { order } = useSelector(orderStore);
  const { bill } = useSelector(billStore);
  const { customer } = useSelector(customerStore);
  const [title, setTitle] = useOutletContext();
  //Sort by Header
  const [sortType, setSortType] = useState("desc");
  const [sortByName, setSortByName] = useState("wage");
  //invoice
  const [openInvoice, setOpenInvoice] = useState(false);
  const [invoiceProps, setInvoiceProps] = useState({});
  //Pagination
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  //Date Sort
  const [valueSubMonth, setValueSubMonth] = useState("ทั้งเดือน");
  const [valueDay, setValueDay] = useState("ทั้งหมด");
  const [valueMonth, setValueMonth] = useState("ทั้งหมด");
  const [valueYear, setValueYear] = useState(dayjs(new Date()).format("BBBB"));
  //Search
  const [search, setSearch] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = sortByName === property && sortType === "desc";
    setSortType(isAsc ? "asc" : "desc");
    setSortByName(property);
  };

  const handleShowInvoice = (value) => {
    setInvoiceProps({
      listBil: listInvoice(value.bill),
      docID: value._bid,
      dateDoc: {
        dateDoc: value.docDate,
        dueDate: value.dueDate,
      },
      customerDetail: value.customer,
      handleClose: () => setOpenInvoice(false),
    });
    setOpenInvoice(true);
  };

  let listInvoice = (listOrder) => {
    if (!order) return [];
    let sumReport = {};
    let newOrder = cloneDeep(order);
    sumReport = listOrder.reduce((acc, curr) => {
      let OrderCurr = newOrder.filter((item) => item.bill === curr._id);
      let total = OrderCurr.reduce((sum, Odr) => {
        return (sum += Odr.price_order);
      }, 0);
      const str =
        "รถกะบะ 4 ล้อ ตู้ทึบ จำนวน " +
        OrderCurr.length +
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
  };

  let invoiceQuery = useMemo(() => {
    if (!invoice || !bill || !customer) return [];
    let newBill = cloneDeep(bill);
    let newInvoice = cloneDeep(invoice);
    let newCustomer = cloneDeep(customer);

    newInvoice = newInvoice.filter((item) => {
      let resBill = newBill.filter((curr) => curr.invoice === item._id);
      let resCus = newCustomer.find((curr) => curr._id === item.customer);
      item.customer = resCus;
      item.bill = resBill;
      item.cus_name = resCus.cus_name;
      item.countBill = resBill.length;

      return item;
    });

    newInvoice = newInvoice.filter(
      (a) => dayjs(a.docDate).locale("th").format("BBBB") === valueYear
    );

    if (valueSubMonth !== "ทั้งเดือน") {
      newInvoice = newInvoice.filter((order) => {
        let day = dayjs(order.docDate).format("D");
        if (valueSubMonth === "ต้นเดือน") {
          return day < 16;
        } else {
          return day > 15;
        }
      });
    }

    if (valueMonth !== "ทั้งหมด") {
      newInvoice = newInvoice.filter(
        (a) => dayjs(a.docDate).locale("th").format("MMMM") === valueMonth
      );
    }

    if (valueDay !== "ทั้งหมด") {
      newInvoice = newInvoice.filter(
        (a) => dayjs(a.docDate).locale("th").format("DD") === valueDay
      );
    }

    if (search) {
      newInvoice = newInvoice.filter((s) => {
        if (
          s._bid
            .trim()
            .toString()
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          s.cus_name.trim().toLowerCase().includes(search.trim().toLowerCase())
        )
          return s;
      });
    }

    return newInvoice;
  }, [invoice, bill, customer, valueDay, valueMonth, valueYear, search]);

  useEffect(() => setTitle("ใบแจ้งหนี้"), []);

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
      { id: "countBill", label: "จำนวนใบวางบิล" },
      { id: "", label: "" },
    ],
  };

  return (
    <Container>
      <Box sx={{ marginBottom: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: "Itim" }}>
          ใบแจ้งหนี้
        </Typography>
      </Box>
      <DialogInvoice open={openInvoice} {...invoiceProps} />
      <Paper sx={{ p: 0, overflow: "hidden" }}>
        <DateSort
          order={invoice}
          nameQuery={"docDate"}
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
              {invoiceQuery
                ?.sort(getComparator(sortType, sortByName))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  return (
                    <TableRows
                      key={item._id}
                      hover
                      Cell={[
                        {
                          value: item.cus_name,
                          align: "center",
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
                          value: item.countBill,
                          align: "center",
                        },
                        {
                          value: (
                            <IconButton
                              onClick={() => handleShowInvoice(item)}
                              sx={{ p: 1, color: "#4287f5" }}
                            >
                              <RemoveRedEyeRounded />
                            </IconButton>
                          ),
                          sxCell: { textAlign: "left" },
                          align: "center",
                        },
                      ]}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          checked={dense}
          onChecked={(v) => setDense(v)}
          count={invoiceQuery.length}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Invoices;
